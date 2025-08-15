import Home_Client from '@/components/Home'
import React from 'react'
import { getEvent } from './hooks/useEvent'

import './page.css'
import { redirect } from 'next/navigation'

export default async function Home_Server() {
    const event = await getEvent()
    if(!event) {
        redirect('/admin')
        return null
    }
    return (
        <Home_Client event={event} />
    )
}