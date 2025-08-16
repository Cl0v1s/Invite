import React from "react";
import { Metadata } from "next";

import Page_Client from "./page.client";

export const metadata: Metadata = {
    title: "Informations de l'événement"
}

export default async function Admin_Server() {
    return (
        <Page_Client />
    )
}