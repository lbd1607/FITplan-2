import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetExercise = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetExercise), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const exercise = await db.exercise.findFirst({ where: { id } })

  if (!exercise) throw new NotFoundError()

  return exercise
})
