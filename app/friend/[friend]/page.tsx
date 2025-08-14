import { redirect, RedirectType } from "next/navigation"


export default async function Friend({params}: { params: { friend: string }}) {
    const { friend } = await params
    redirect(`/?friend=${friend}`, RedirectType.replace)
}