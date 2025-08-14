"use server"

import { db, ready } from "@/database/db"
import { Event } from "@/types/Event";

export async function getEvents(): Promise<Event[]> {
    await ready;
    return new Promise((resolve, reject) => {
        db.all("select * from event", (err: unknown, res: Record<string, string>[]) => {
            if(err) reject(err)
            else {
                resolve(res.map((r) => ({ ...r, datetime: new Date(r.datetime) } as Event)))
            }
        })
    })
}

export async function saveEvent(event: Event) {
    if(!event.address || !event.datetime || !event.description || !event.intro || !event.outro) throw new Error("Bad request: missing data")
    await ready;
    let request: string;
    const values = [event.intro, event.description, event.address, event.datetime.toISOString(), event.outro]
    if(event.id) {
        request = "update event set intro = ?, description = ?, address = ?, datetime = ?, outro = ? where id = ?"
        values.push(event.id)
    } else {
        request = "insert into event(intro, description, address, datetime, outro) values (?, ?, ?, ?, ?)"
    }
    return new Promise((resolve, reject) => {
        // using a function here and not a () => void is important since this is redefined
        db.run(request, ...values, function(err: unknown) {
            if(err) reject(err)
            resolve({
                ...event,
                // @ts-expect-error no typedef
                id: this.lastID
            })
        })
    })
}