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

export async function getResponses(request: Pick<Partial<Response>, "friend"> = {}): Promise<Response[]> {
    await ready;
    const ands = Object.keys(request).map((and) => (
        `${and} = ?`
    ))
    const where = ands.length > 0 ? `where ${ands.join(' and ')}` : ''

    return new Promise((resolve, reject) => {
        db.all(`select * from response ${where} order by created_at DESC`, ...Object.values(request), (err: unknown, res: Record<string, string>[]) => {
            if(err) reject(err)
            else {
                resolve(
                    res.map((r) => ({ ...r, createdAt: new Date(r.created_at) }) as Response)
                )
            }
        })
    })
}