import { getEvents } from "@/services/events";

export async function getEvent() {
    const events = await getEvents()
    // TODO: implement event init
    if(events.length == 0) throw new Error("No event");
    return events[0]
}