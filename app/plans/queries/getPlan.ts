import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetPlan = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetPlan), resolver.authorize(), async ({ id }) => {
  const plan = await db.plan.findFirst({ where: { id } })

  if (!plan) throw new NotFoundError()

  return plan
})
