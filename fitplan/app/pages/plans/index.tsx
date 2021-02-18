import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlans from "app/plans/queries/getPlans"

const ITEMS_PER_PAGE = 100

export const PlansList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ plans, hasMore }] = usePaginatedQuery(getPlans, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>
            <Link href={`/plans/${plan.id}`}>
              <a>{plan.planName}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const PlansPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Plans</title>
      </Head>

      <div>
        <p>
          <Link href="/plans/new">
            <a>Create Plan</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <PlansList />
        </Suspense>
      </div>
    </>
  )
}

PlansPage.authenticate = true
PlansPage.getLayout = (page) => <Layout>{page}</Layout>

export default PlansPage
