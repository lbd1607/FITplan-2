import { Ctx } from "blitz"
import db from "db"

// Must disable this warning for Blitz, var is being used
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  })

  return user
}
