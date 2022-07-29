import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteExercise = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteExercise), resolver.authorize(), async ({ id }) => {
  const exercise = await db.exercise.deleteMany({ where: { id } })

  return exercise
})
