"use client"

import { Event } from '@/types/Event';
import React, { useCallback, useMemo, useState } from 'react'

import { getEvents, saveEvent } from '@/services/events';
import { toast, ToastContainer } from 'react-toastify';
import EventForm from '@/components/EventForm';
import ResponseList from '@/components/ResponseList';
import { useQuery } from '@tanstack/react-query';
import { getResponses } from '@/services/responses';
import Image from 'next/image';
import debounce from 'debounce';
import ResponseFilter, { Filters } from '@/components/ResponseFilters';
import { Response } from '@/types/Response';
import ResponseResume from '@/components/ResponseResume';

import './../globals.css'


export default function Admin() {
    const [filters, setFilters] = useState<Filters>({ unique: true, friend: undefined, value: undefined })
    const [eventSaving, setEventSaving] = useState(false)

    const setFiltersDebounced = useMemo(() => debounce(setFilters, 250), [])

    const { data: event, isLoading: isEventLoading } = useQuery({
        queryKey: ["event-fetch"],
        queryFn: async () => {
            const res = await getEvents()
            if(res.length == 0) return null
            return res[0]
        }
    })

    const { data: responses, isLoading: areResponsesLoading, error } = useQuery({
        queryKey: ["responses-fetch", filters],
        queryFn: async () => {
            const res = await getResponses({ friend: filters.friend ? `%${filters.friend}%` : undefined, value: filters.value })
            if (!filters.unique) return res
            const dedups = res.reduce((acc, curr) => { // we only get last response for each person since responses are sorted from created_at desc
                if (acc[curr.friend]) return acc;
                acc[curr.friend] = curr;
                return acc
            }, {} as Record<string, Response>)
            return Object.values(dedups);
        }
    })

    const onEventSubmit = useCallback(async (event: Event) => {
        setEventSaving(true)
        try {
            await saveEvent(event)
            toast.success("Votre événement a bien été mis à jour !")
        } catch (e) {
            console.error(e)
            toast.error("Une erreur est survenue lors de l'enregistrement, réessayez !")
        }
        finally {
            setEventSaving(false)
        }
    }, [])

    return (
        <div className='flex gap-8 w-full grow'>
            <div className='grow w-full flex flex-col gap-4 p-3'>
                <h2 className='text-2xl'>Réponses</h2>
                <span className='text-xs'>
                    Vous trouvez ci-dessous la liste des réponses de vos invités.
                    <ul>
                        <li>
                            Avec l’option Unique, seule la dernière réponse de chaque invité est affichée.
                        </li>
                        <li>
                            En décochant Unique, vous pouvez consulter l’historique complet et voir toutes les réponses données par vos invités au fil du temps.
                        </li>
                    </ul>
                </span>
                <div className='flex flex-col gap-3 grow overflow-hidden basis-0 min-h-0 '>
                    <ResponseResume responses={responses || []} />
                    <ResponseFilter filters={filters} onChange={setFiltersDebounced} />
                    <div className='grow overflow-auto position-relative'>
                        { 
                            error && (
                                <span className='text-sm text-red-800'>Une erreur est survenue lors de la récupération des réponses: {error.message.toString()}</span>
                            )
                        }
                        {
                            !error && (
                                <ResponseList  responses={responses || []} />
                            )
                        }
                    </div>
                </div>
                {
                    areResponsesLoading && <Image className='mx-auto' src="/loading.gif" width={30} height={30} aria-busy alt='Chargement...' />
                }
            </div>
            <div className='shrink-0 flex flex-col gap-4 p-3'>
                    <h2 className='text-2xl'>Édition de l&apos;évenement</h2>
                    <EventForm className='basis-0 min-h-0 overflow-y-auto grow' event={event || undefined} onSubmit={onEventSubmit} loading={isEventLoading || eventSaving} />
            </div>
            <ToastContainer />
        </div>
    )
}