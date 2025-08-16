"use client" 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Event } from '@/types/Event';
import React, { useCallback } from 'react'

import { saveEvent } from '@/services/events';
import { toast, ToastContainer } from 'react-toastify';
import EventForm from '@/components/EventForm';
import ResponseList from '@/components/ResponseList';
import { useQuery } from '@tanstack/react-query';
import { getResponses } from '@/services/responses';
import Image from 'next/image';

function Admin({ event }: { event: Event }) {
    const { data: responses, isLoading: areResponsesLoading } = useQuery({
        queryKey: ["responses-fetch"],
        queryFn: () => {
            return getResponses()
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
                {
                    responses && <ResponseList responses={responses} />
                }
            </div>
            <div className='shrink-0'>
                <h2 className='text-2xl mb-4'>Edition de l&apos;évenement</h2>
                <EventForm event={event} onSubmit={onEventSubmit} />
            </div>
            <ToastContainer />
        </div>
    )
}

const queryClient = new QueryClient()

export default function Page_Client({ event }: { event: Event }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Admin event={event} />
        </QueryClientProvider>
    )
}
