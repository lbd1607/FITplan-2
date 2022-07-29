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
    const exercise = await db.exercise.update({ where: { id }, data })

    return exercise
  }
)
