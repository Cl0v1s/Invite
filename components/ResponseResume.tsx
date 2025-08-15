import { Response } from '@/types/Response';
import React, { useMemo } from 'react'

export default function ResponseResume({ responses }: { responses: Response[] }) {
    // we only keep the first value found in list since responses are ordered by created_at desc
    const deduped: Response["value"][] = useMemo(() => (
        Object.values(
            responses.reduce((acc, curr) => {
                if (acc[curr.friend]) return acc;
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
    )
}