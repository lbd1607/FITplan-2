import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetWorkoutsInput
  extends Pick<Prisma.WorkoutFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetWorkoutsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: workouts, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.workout.count({ where }),
      query: (paginateArgs) => db.workout.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      workouts,
      nextPage,
      hasMore,
      count,
    }
  }
)
