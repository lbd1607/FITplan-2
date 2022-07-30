import { Workout } from "app/pages/workouts/[workoutId]"
import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateExercise = z
  .object({
    exName: z.string(),
    exType: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreateExercise), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const exercise = await db.exercise.create({ data: input })

  return exercise
})
