import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeletePlan = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeletePlan), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const plan = await db.plan.deleteMany({ where: { id } })

  return plan
})
