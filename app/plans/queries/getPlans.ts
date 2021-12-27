import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetPlansInput
  extends Pick<Prisma.PlanFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPlansInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: plans,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.plan.count({ where }),
      query: (paginateArgs) => db.plan.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      plans,
      nextPage,
      hasMore,
      count,
    }
  }
)
