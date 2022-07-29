import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetExercisesInput
  extends Pick<Prisma.ExerciseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetExercisesInput) => {
    const {
      items: exercises,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.exercise.count({ where }),
      query: (paginateArgs) => db.exercise.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      exercises,
      nextPage,
      hasMore,
      count,
    }
  }
)
