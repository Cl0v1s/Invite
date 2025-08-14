import React from "react";
import { getEvent } from "../hooks/useEvent";

import { Metadata } from "next";

import './page.css'
import Admin_Client from "@/components/Admin";

export const metadata: Metadata = {
    title: "Informations de l'événement"
}

export default async function Admin_Server() {
    const event = await getEvent()

    return (
        <Admin_Client event={event} />
    )
}