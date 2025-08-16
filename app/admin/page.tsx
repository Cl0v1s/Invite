import React from "react";
import { getEvent } from "../hooks/useEvent";

import { Metadata } from "next";

import Page_Client from "./page.client";

export const metadata: Metadata = {
    title: "Informations de l'événement"
}

export default async function Admin_Server() {
    const event = await getEvent()

    return (
        <Page_Client event={event} />
    )
}