"use client"
import { Event } from '@/types/Event';
import React, { FormEventHandler, useCallback, useState } from 'react'

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Datetime } from "@/components/ui/datetime";
import { Button } from "@/components/ui/button";
import { saveEvent } from '@/services/events';
import { toast, ToastContainer } from 'react-toastify';

function Hints() {
    return (
        <span className="text-xs">
            Il est possible d&apos;utiliser les tags suivant pour afficher certaines informations:
            <ul className="flex flex-col gap-2 mt-3">
                <li>#friend: affiche le nom de la personne invitée</li>
                <li>#address: Affiche l&apos;adresse de l&apos;évenement</li>
                <li>#time: Affiche la date et l&apos;heure de l&apos;évenement</li>
            </ul>
        </span>
    )
}

export default function Admin_Client({ event }: { event: Event }) {
    const [loading, setLoading] = useState(false)

    const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget)
        const newEvent: Event = {
            id: event.id,
            address: data.get("address") as string,
            datetime: new Date(data.get("datetime") as string),
            description: data.get("description") as string,
            intro: data.get("intro") as string,
            outro: data.get("outro") as string
        }
        setLoading(true)
        try {
            await saveEvent(newEvent)
            toast.success("Votre événement a bien été mis à jour !")
        } catch (e) {
            console.error(e)
            toast.error("Une erreur est survenue lors de l'enregistrement, réessayez !")
        } finally {
            setLoading(false)
        }

    }, [event.id])

    return (
        <>
            <form className="flex flex-col gap-5 py-3" onSubmit={onSubmit}>
                <div className='border p-3 rounded-md flex flex-col gap-5'>
                    <h1 className="text-2xl text-gray-700">Edition de l&apos;évenement</h1>
                    <Hints />
                    <label>
                        Introduction
                        <Input required className="mt-2 text-gray-700" name="intro" defaultValue={event.intro} />
                    </label>
                    <label>
                        Adresse
                        <Input required className="mt-2 text-gray-700" name="address" defaultValue={event.address} />
                    </label>
                    <Datetime required className="datetime" defaultDate={event.datetime} name="datetime" />
                    <label>
                        Contenu de l&apos;invitation
                        <Textarea required className="mt-2 text-gray-700" name="description" rows={10} defaultValue={event.description} />
                    </label>
                    <label>
                        Outro
                        <Input required className="mt-2 text-gray-700" name="outro" defaultValue={event.outro} />
                    </label>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            Envoyer
                        </Button>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    )
}