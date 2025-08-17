"use client"
import { getEvents } from "@/services/events";
import { getResponses, saveResponse } from "@/services/responses";
import { ResponseValue } from "@/types/Response";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import './page.css'


import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";

function interpolate(str: string | undefined, vars: Record<string, string | undefined>) {
  if (!str) return ''
  let result = str;
  Object.keys(vars).forEach((k) => { result = result.replace(new RegExp(`#${k}`, "g"), vars[k] || '') })
  return result
}

export default function Page_Client() {
  const router = useRouter();
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ["event-fetch"],
    queryFn: async () => {
      const res = await getEvents()
      if(res.length == 0) return null
      return res[0]
    }
  })

  const lastRequest = useRef<Date | null>(null)
  const param = useRef(new URLSearchParams(global.location?.search || ''))
  const friend = useMemo(() => param.current.get("friend"), [])
  const [status, setStatus] = useState<typeof ResponseValue[keyof typeof ResponseValue]>("CAN YOU REPEAT THE QUESTION")
  const [loading, setLoading] = useState(false)

  const time = useMemo(() => {
    return `${event?.datetime.toLocaleTimeString(undefined, { timeStyle: "short" })} le ${event?.datetime.toLocaleDateString()}`
  }, [event])

  const vars = useMemo(() => ({
    friend: friend || "ami.e",
    address: event?.address,
    time
  }), [event?.address, friend, time])

  const fetchStatus = useCallback(async () => {
    if (!friend) return;
    setLoading(true);
    try {
      const t = new Date()
      lastRequest.current = t
      const results = await getResponses({ friend })
      if (lastRequest.current > t) return;
      if (results.length === 0) return;
      setStatus(results[0].value)
    } catch (e) {
      console.error(e)
      toast.error("Une erreur est survenue lors de la récupération de ta réponse, dis-le moi !")
    } finally {
      setLoading(false)
    }
  }, [friend])


  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const answer = useCallback(async (value: typeof ResponseValue[keyof typeof ResponseValue]) => {
    setLoading(true)
    try {
      await saveResponse({
        friend: friend!,
        value,
        createdAt: new Date(),
      })
      setStatus(value)
      toast.success("Ta réponse a bien été envoyée !")
    } catch (e) {
      console.error(e)
      toast.error("Une erreur est survenue lors de l'envoi de ta réponse, préviens moi !")
    } finally {
      setLoading(false)
    }

  }, [friend])

  const onYes = useCallback(() => {
    answer(ResponseValue.YES)
  }, [answer])

  const onMaybe = useCallback(() => {
    answer(ResponseValue.MAYBE)
  }, [answer])

  const onNo = useCallback(() => {
    answer(ResponseValue.NO)
  }, [answer])

  useEffect(() => {
    if(!isEventLoading && event === null) {
        router.replace('/admin')
    }
  }, [isEventLoading, event, router])

  if(isEventLoading) {
    return (
      <Image unoptimized aria-busy src="/loading.gif" width={50} height={50} alt="Chargement..." />
    )
  }

  return (
    <div className="letter-wrapper w-full grow flex flex-col items-center justify-center ">
      <div className="letter my-[25px]">
        <Image src="/stamp.png" alt="" width={172} height={159} className="absolute right-0 top-[-10px] opacity-50 z-[-1]" />
        <div className="px-[40px] py-[25px] grow">
          <h1 className="underline inline-block text-xl mb-3">{interpolate(event?.intro, vars)}</h1>
          <div>
            <span className="underline" dangerouslySetInnerHTML={{ __html: interpolate(event?.description, vars) }} />
          </div>
          <div className="mt-3">
            Au
            <a href={`https://www.google.com/maps/place/${encodeURIComponent(event?.address || '')}`} target="_blank">
              <address className="letter__address">
                {event?.address}
              </address>
            </a>
            à partir de
            <time className="letter__time">
              {time}
            </time>
          </div>
          <div className="text-xl mt-5">
            {event?.outro}
          </div>
        </div>
        {
          friend && (
            <div className="dialog mx-auto sm:ml-auto sm:mr-[-30px] px-[10px] sm:px-[60px] md:px-[60px]">
              <div className="dialog__title text-xl">
                Seras-tu présent.e ?
              </div>
              <div className="flex items-center justify-center gap-3 relative" aria-busy={loading} data-answered={status !== ResponseValue.IDONTKNOW}>
                {
                  loading && <Image unoptimized className="absolute" src="/loading.gif" width={50} height={50} alt="Chargement..." />
                }
                <button className="letter__button" onClick={onYes} aria-current={status === "yes"} disabled={loading}>
                  <Image src="/yes.png" title="Oui !" alt="Oui !" width={100} height={100} />
                </button>
                <button className="letter__button" onClick={onMaybe} aria-current={status === "maybe"} disabled={loading}>
                  <Image src="/maybe.png" title="Peut être !" alt="Peut être !" width={100} height={100} />
                </button>
                <button className="letter__button" onClick={onNo} aria-current={status === "no"} disabled={loading}>
                  <Image src="/no.png" title="Non ..." alt="Non ..." width={100} height={100} />
                </button>
              </div>
            </div>
          )
        }

      </div>
      <ToastContainer />
    </div>
  );
}
