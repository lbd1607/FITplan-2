import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreatePlan = z.object({
  planName: z.string(),
  // workouts: z.string(),
  workouts: z.array(z.string()),
  days: z.array(z.string()),
})

export default resolver.pipe(resolver.zod(CreatePlan), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const plan = await db.plan.create({ data: input })

  return plan
})
