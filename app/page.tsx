import Home_Client from '@/common/Home'
import { getEvents } from '@/services/events'
import React from 'react'

export default async function Home_Server() {
    const events = await getEvents()
    // TODO: implement event init
    if(events.length == 0) throw new Error("No event");
    const event = events[0]
    return (
        <Home_Client event={event} />
    )
}