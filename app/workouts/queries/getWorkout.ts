import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetWorkout = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetWorkout), resolver.authorize(), async ({ id }) => {
  const workout = await db.workout.findFirst({ where: { id } })

  if (!workout) throw new NotFoundError()

  return workout
})
