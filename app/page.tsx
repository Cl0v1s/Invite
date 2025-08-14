import Home_Client from '@/components/Home'
import React from 'react'
import { getEvent } from './hooks/useEvent'

import './page.css'

export default async function Home_Server() {
    const event = await getEvent()
    return (
        <Home_Client event={event} />
    )
}