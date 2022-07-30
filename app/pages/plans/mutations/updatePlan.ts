import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdatePlan = z.object({
  id: z.number(),
  planName: z.string(),
  itemOrder: z.number(),
  groupOrder: z.number(),
  planNotes: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdatePlan),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const plan = await db.plan.update({ where: { id }, data })

    return plan
  }
)
