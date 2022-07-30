import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateWorkout = z.object({
  workoutName: z.string(),
  workoutType: z.string(),
  workoutNotes: z.string(),
})

export default resolver.pipe(resolver.zod(CreateWorkout), resolver.authorize(), async (input) => {
  const workout = await db.workout.create({ data: input })

  return workout
})
