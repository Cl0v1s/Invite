import { Response } from '@/types/Response'
import React, { FormEventHandler, useCallback } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'

export type Filters = Pick<Partial<Response>, "value" | "friend"> & { unique: boolean }

export default function ResponseFilter({ filters, onChange}: { filters: Filters, onChange: (responses: Filters) => void})  {

    const onInternalChange: FormEventHandler<HTMLFormElement> = useCallback((e) => {
        const data = new FormData(e.currentTarget)
        onChange({
            friend: data.get("friend") as string || undefined,
            unique: data.get("unique") === "on",
            value: data.get("value") === "all" ? undefined : data.get("value") as Response["value"]
        })
    }, [onChange])

    return (
        <form className='flex gap-3 items-center' onChange={onInternalChange}>
                <label>
                    Nom
                    <Input name="friend" defaultValue={filters.friend} />
                </label>
                <label>
                    Type
                    <Select name="value" defaultValue={filters.value || "all"}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tout</SelectItem>
                            <SelectItem value="yes">Oui</SelectItem>
                            <SelectItem value="maybe">Peut-être</SelectItem>
                            <SelectItem value="no">Non</SelectItem>
                        </SelectContent>
                    </Select>
                </label>
                <label className='flex gap-2 items-center'>
                    <Checkbox name="unique" defaultChecked={filters.unique} />
                    Unique
                </label>
        </form>
    )
}