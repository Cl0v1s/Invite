"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Datetime({ defaultDate, name }: { defaultDate?: Date, name?: string}) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(defaultDate)

  return (
    <>
        <input name={name} type="hidden" value={date?.toISOString()} />
        <div className="flex gap-4">
        <div className="flex flex-col">
            <label htmlFor="date-picker" className="px-1">
            Date de l&apos;évenement
            </label>
            <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
                >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                    setDate(date)
                    setOpen(false)
                }}
                />
            </PopoverContent>
            </Popover>
        </div>
        <div className="flex flex-col">
            <label htmlFor="time-picker" className="px-1">
            Heure de l&apos;évenement
            </label>
            <Input
            type="time"
            id="time-picker"
            step="1"
            defaultValue="10:30:00"
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
        </div>
        </div>
    </>
  )
}
