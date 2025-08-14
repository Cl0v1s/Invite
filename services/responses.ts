"use server"

import { ready, db } from "@/database/db"
import { Response } from "@/types/Response"

export async function saveResponse(response: Response) {
    if(!response.friend || !response.value) throw new Error('Bad request: missing data')
    await ready;
    return new Promise((resolve, reject) => {
        db.run("insert into response(friend, value) values(?, ?)", response.friend, response.value, (err: unknown) => {
            if(err) reject(err)
            else resolve({
                ...response,
                createdAt: new Date()
            })
        })
    })
}

export async function getResponses(request: Pick<Response, "friend">): Promise<Response[]> {
    await ready;
    return new Promise((resolve, reject) => {
        db.all("select * from response where friend = ? order by created_at DESC", request.friend, (err: unknown, res: Record<string, string>[]) => {
            if(err) reject(err)
            else {
                resolve(
                    res.map((r) => ({ ...r, createdAt: new Date(r.created_at) }) as Response)
                )
            }
        })
    })
}