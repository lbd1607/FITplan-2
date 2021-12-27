import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateExercise = z.object({
  id: z.number(),
  exName: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateExercise),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const exercise = await db.exercise.update({ where: { id }, data })

    return exercise
  }
)
