import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdatePlan = z.object({
  id: z.number(),
  planName: z.string(),
  itemOrder: z.number(),
  groupOrder: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdatePlan),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const plan = await db.plan.update({ where: { id }, data })

    return plan
  }
)
