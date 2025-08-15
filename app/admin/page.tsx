import React from "react";
import { getEvent } from "../hooks/useEvent";

import { Metadata } from "next";

import Admin_Client from "@/components/Admin";
import Page_Client from "./page.client";

export const metadata: Metadata = {
    title: "Informations de l'événement"
}

export default async function Admin_Server() {
    const event = await getEvent()

    return (
        <Page_Client>
            <Admin_Client event={event} />
        </Page_Client>
    )
}