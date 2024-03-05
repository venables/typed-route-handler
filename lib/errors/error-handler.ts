import { type NextResponse } from "next/server"

export type TypedRouteOnErrorCallback = (err: unknown) => Promise<void> | void
