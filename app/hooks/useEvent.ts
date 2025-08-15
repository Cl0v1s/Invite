import { getEvents } from "@/services/events";

export async function getEvent() {
    const events = await getEvents()
    if(events.length == 0) return undefined
    return events[0]
}