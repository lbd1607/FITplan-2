import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateWorkout = z
  .object({
    id: z.number(),
    workoutName: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateWorkout),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const workout = await db.workout.update({ where: { id }, data })

    return workout
  }
)
