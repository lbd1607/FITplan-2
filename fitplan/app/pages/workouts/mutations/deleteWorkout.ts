import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteWorkout = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteWorkout), resolver.authorize(), async ({ id }) => {
  const workout = await db.workout.deleteMany({ where: { id } })

  return workout
})
