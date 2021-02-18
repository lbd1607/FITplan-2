import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkouts from "app/workouts/queries/getWorkouts"

const ITEMS_PER_PAGE = 100

export const WorkoutsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ workouts, hasMore }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            <Link href={`/workouts/${workout.id}`}>
              <a>{workout.workoutName}</a>
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

const WorkoutsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Workouts</title>
      </Head>

      <div>
        <p>
          <Link href="/workouts/new">
            <a>Create Workout</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <WorkoutsList />
        </Suspense>
      </div>
    </>
  )
}

WorkoutsPage.authenticate = true
WorkoutsPage.getLayout = (page) => <Layout>{page}</Layout>

export default WorkoutsPage
