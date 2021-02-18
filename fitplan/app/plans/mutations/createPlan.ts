import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreatePlan = z
  .object({
    planName: z.string(),
    workouts: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreatePlan), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const plan = await db.plan.create({ data: input })

  return plan
})
