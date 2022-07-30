import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteWorkout = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeleteWorkout), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const workout = await db.workout.deleteMany({ where: { id } })

  return workout
})
