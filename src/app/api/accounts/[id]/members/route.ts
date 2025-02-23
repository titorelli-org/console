import { NextResponse, type NextRequest } from "next/server";
import { maskNumber, unmaskNumber } from "@/lib/server/keymask";
import type { SelectorAccountMemberVm } from "@/types/account-members-selector";
import { getAccountService } from "@/lib/server/services/instances";

export const GET = async (req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) => {
  const accountId = unmaskNumber((await paramsPromise).id)

  if (!accountId)
    throw new Error('Account id not provided')

  const accountService = getAccountService()
  const members = await accountService.getAccountMembers(accountId)
  const membersVm = members.map(({ id, username }) => ({ id: maskNumber(id), username } as SelectorAccountMemberVm))

  return NextResponse.json(membersVm)
}
