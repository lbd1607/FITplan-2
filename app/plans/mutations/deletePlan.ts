import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeletePlan = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeletePlan), resolver.authorize(), async ({ id }) => {
  const plan = await db.plan.deleteMany({ where: { id } })

  return plan
})
