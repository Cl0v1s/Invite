import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Response } from '@/types/Response'

function Value(v: Response["value"]) {
    switch (v) {
        case "yes":
            return "Oui"
        case "maybe":
            return "Peut-être"
        case "no":
        default:
            return "Non"
    }
}

function ResponseItem({ response }: { response: Response }) {
    return (
        <TableRow>
            <TableCell>
                {response.friend}
            </TableCell>
            <TableCell>
                {response.createdAt.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </TableCell>
            <TableCell>
                {Value(response.value)}
            </TableCell>
        </TableRow>
    )
}

export default function ResponseList({ responses, className }: { responses: Response[], className?: string }) {
    return (
        <Table className={className}>
            <TableHeader >
                <TableRow className='sticky top-0 bg-white shadow-sm' >
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
                {responses.map((r) => <ResponseItem key={r.id} response={r} />)}
            </TableBody>
        </Table>
    )
}