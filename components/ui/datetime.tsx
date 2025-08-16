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

export function Datetime({ defaultDate, name, className, required }: { required?:boolean, className?: string, defaultDate?: Date, name?: string }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(defaultDate)

  const onDateChange = React.useCallback((n: Date) => {
    const d = new Date(date!);
    d.setDate(n.getDate());
    d.setMonth(n.getMonth())
    d.setFullYear(n.getFullYear());
    setDate(d)
    setOpen(false)
  }, [date]);

  const onTimeChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
    const parts = e.target.value.split(':').map((p) => parseInt(p, 10))
    const d = new Date(date!)
    d.setHours(parts[0])
    d.setMinutes(parts[1])
    d.setSeconds(parts[2])
    setDate(d)
  }, [date])

  return (
    <div className={className}>
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
                className="justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                required={required as true}
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={onDateChange}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col">
          <label htmlFor="time-picker" className="px-1">
            Heure de l&apos;évenement
          </label>
          <Input
            required={required}
            type="time"
            id="time-picker"
            step="1"
            disabled={!defaultDate}
            value={date?.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            onChange={onTimeChange}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      </div>
    </div>
  )
}
