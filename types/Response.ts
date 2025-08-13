
export const ResponseValue = {
  YES: "yes",
  NO: "no",
  MAYBE: "maybe",
  IDONTKNOW: "CAN YOU REPEAT THE QUESTION",
} as const


export type Response = {
    friend: string,
    createdAt: Date,
    value: typeof ResponseValue[keyof typeof ResponseValue],
}