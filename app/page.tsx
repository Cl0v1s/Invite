"use client"
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";


const STATUS = {
  YES: "yes",
  NO: "no",
  MAYBE: "maybe",
  IDONTKNOW: "CAN YOU REPEAT THE QUESTION",
} as const



function interpolate(str: string | undefined, vars: Record<string, string | undefined>) {
  if(!str) return ''
  let result = str;
  Object.keys(vars).forEach((k) => { console.log(k, `\$${k}`, str); result = result.replace(new RegExp(`#${k}`, "g"), vars[k] || '')})
  return result
}

export default function Home() {
  const param = useRef(new URLSearchParams(global.location?.search || ''))
  const friend = param.current.get("friend") || 'ami.e'
  const [status, setStatus] = useState<typeof STATUS[keyof typeof STATUS] >("CAN YOU REPEAT THE QUESTION")

  const vars = useMemo(() => ({
    friend, 
    address: process.env.NEXT_PUBLIC_ADDRESS,
    time: process.env.NEXT_PUBLIC_TIME,
  }), [friend])

  const onYes = useCallback(() => {

  }, [])

  const onMaybe = useCallback(() => {

  }, [])

  const onNo = useCallback(() => {

  }, [])

  return (
    <div className="letter">
      <Image src="/stamp.png" alt="" width={172} height={159} className="absolute right-0 top-[-10px] opacity-50 z-[-1]" />
      <div className="px-[40px] py-[25px] grow">
        <h1 className="underline inline-block text-xl mb-3">{ interpolate(process.env.NEXT_PUBLIC_GREETINGS, vars) }</h1>
        <div>
          <span className="underline" dangerouslySetInnerHTML={{ __html: interpolate(process.env.NEXT_PUBLIC_P, vars)}} />
        </div>
        <div className="mt-3">
          Au
          <address>
            {process.env.NEXT_PUBLIC_ADDRESS}
          </address>
          à partir de
          <time>
            {process.env.NEXT_PUBLIC_TIME}
          </time>
        </div>
        <div className="text-xl mt-5">
            {process.env.NEXT_PUBLIC_SENDER}
        </div>
      </div>
      <div className="dialog mb-[-50px] ml-auto mr-[-50px]">
        <div className="dialog__title text-xl">
          Seras-tu présent ?
        </div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={onYes} aria-current={status === "yes"}>
            <Image src="/yes.png" title="Oui !" alt="Oui !" width={100} height={100} />
          </button>
          <button onClick={onMaybe} aria-current={status === "maybe"}>
            <Image src="/maybe.png" title="Peut être !" alt="Peut être !" width={100} height={100} />
          </button>
          <button onClick={onNo} aria-current={status === "no"}>
            <Image src="/no.png"  title="Non ..." alt="Non ..." width={100} height={100} />
          </button>
        </div>
      </div>
    </div>
  );
}
