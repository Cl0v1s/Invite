import React from "react";
import { getEvent } from "../hooks/useEvent";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Datetime } from "@/components/ui/datetime";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Informations de l'événement"
}

export default async function Admin_Server() {
    const event = await getEvent()

    return (
        <>
            <form className="flex flex-col gap-3">
                <label>
                    Introduction
                    <Input name="intro" defaultValue={event.intro} />
                </label>
                <Datetime defaultDate={event.datetime} name="datetime" />
                <label>
                    Contenu de l&apos;invitation
                    <Textarea name="description" defaultValue={event.description} /> 
                </label>
                <label>
                    Outro 
                    <Input name="outro"  defaultValue={event.outro}/>
                </label>
                <div className="flex justify-end">
                    <Button type="submit">
                        Envoyer
                    </Button>
                </div>
            </form>
        </>
    )
}