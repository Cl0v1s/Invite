"use client"
import { Event } from '@/types/Event';
import React, { useCallback, useMemo, useState } from 'react'

import { saveEvent } from '@/services/events';
import { toast, ToastContainer } from 'react-toastify';
import EventForm from './EventForm';
import ResponseList from './ResponseList';
import { useQuery } from '@tanstack/react-query';
import { getResponses } from '@/services/responses';
import Image from 'next/image';
import ResponseFilters, { Filters } from './ResponseFilters';
import ResponseResume from './ResponseResume';
import { Response } from '@/types/Response';
import debounce from 'debounce'

export default function Admin_Client({ event }: { event: Event | undefined }) {
    const [filters, setFilters] = useState<Filters>({ unique: false, friend: undefined, value: undefined })

    const setFiltersDebounced = useMemo(() => debounce(setFilters, 250), [])

    const { data: responses, isLoading: areResponsesLoading } = useQuery({
        queryKey: ["responses-fetch", filters],
        queryFn: async () => {
            const res = await getResponses({ friend: filters.friend ? `%${filters.friend}%` : undefined, value: filters.value })
            if(!filters.unique) return res
            const dedups = res.reduce((acc, curr) => { // we only get last response for each person since responses are sorted from created_at desc
                if(acc[curr.friend]) return acc;
                acc[curr.friend] = curr;
                return acc
            }, {} as Record<string, Response>)
            return Object.values(dedups);
        } 
    })

    const onEventSubmit = useCallback(async (event: Event) => {
        try {
            await saveEvent(event)
            toast.success("Votre événement a bien été mis à jour !")
        } catch (e) {
            console.error(e)
            toast.error("Une erreur est survenue lors de l'enregistrement, réessayez !")
        }
    }, [])

    return (
        <div className='flex gap-8 w-full p-3'>
            <div className='grow w-full'>
                <h2 className='text-2xl mb-4'>Réponses</h2>
                {
                    areResponsesLoading && <Image className='mx-auto' src="/loading.gif" width={30} height={30} aria-busy alt='Chargement...' />
                }
                <div className='flex flex-col gap-3'>
                    {
                        responses && (
                                <ResponseResume responses={responses} />
                        )
                    }
                    <ResponseFilters filters={filters} onChange={setFiltersDebounced} />
                    {
                        responses && (
                                <ResponseList responses={responses} />
                        )
                    }
                </div>
            </div>
            <div className='shrink-0'>
                <h2 className='text-2xl mb-4'>Edition de l&apos;évenement</h2>
                <EventForm event={event} onSubmit={onEventSubmit} />
            </div>
            <ToastContainer />
        </div>
    )
}