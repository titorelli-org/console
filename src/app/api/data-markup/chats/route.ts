import { unmaskNumber } from "@/lib/server/keymask"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  const accountIdStr = req.nextUrl.searchParams.get('accountId')

  if (!accountIdStr)
    throw new Error('Account id not provided')

  const accountId = unmaskNumber(accountIdStr)

  if (!accountId)
    return new NextResponse('Account id not provided in query parameter', { status: 400 })

  return NextResponse.json([])
}
