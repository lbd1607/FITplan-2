import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateWorkout = z.object({
  id: z.number(),
  workoutName: z.string(),
  workoutType: z.string(),
  workoutNotes: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateWorkout),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const workout = await db.workout.update({ where: { id }, data })

    return workout
  }
)
