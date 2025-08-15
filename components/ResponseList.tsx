import React, { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Response } from '@/types/Response'

function Value(v: Response["value"]) {
    switch(v) {
        case "yes": 
            return "Oui"
        case "maybe": 
            return "Peut-être"
        case "no":
        default:
            return "Non"
    }
}

function ResponseItem({ response }: { response: Response}) {
    return (
        <TableRow>
            <TableCell>
                { response.friend }
            </TableCell>
            <TableCell>
                { response.createdAt.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </TableCell>
            <TableCell>
                { Value(response.value) }
            </TableCell>
        </TableRow>
    )
}

export default function ResponseList({ responses }: { responses: Response[]}) {
    // we only keep the first value found in list since responses are ordered by created_at desc
    const deduped: Response["value"][] = useMemo(() => (
        Object.values(
            responses.reduce((acc, curr) => {
                if(acc[curr.friend]) return acc;
                acc[curr.friend] = curr.value 
                return acc;
            }, {} as Record<string, Response["value"]>)
        )
    ), [responses])

    const yes = useMemo(() => (
        deduped.filter((d) => d === "yes").length
    ), [deduped])
    
    const maybe = useMemo(() => (
        deduped.filter((d) => d === "maybe").length
    ), [deduped])

    const no = useMemo(() => (
        deduped.filter((d) => d === "no").length
    ), [deduped])

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex gap-3'>
                <div>
                    <span className='font-bold'>Oui (uniques) :</span> {yes}
                </div>
                <div>
                    <span className='font-bold'>Peut-être (uniques) :</span> {maybe}
                </div>
                <div>
                    <span className='font-bold'>Non (uniques) :</span> {no}
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Nom
                        </TableHead>
                        <TableHead>
                            Date de la réponse
                        </TableHead>
                        <TableHead>
                            Réponse
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { responses.map((r) => <ResponseItem key={r.id} response={r} />)}
                </TableBody>
            </Table>
        </div>
    )
}