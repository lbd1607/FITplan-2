import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercises from "app/exercises/queries/getExercises"

const ITEMS_PER_PAGE = 100

export const ExercisesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ exercises, hasMore }] = usePaginatedQuery(getExercises, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            <Link href={`/exercises/${exercise.id}`}>
              <a>{exercise.exName}</a>
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

const ExercisesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Exercises</title>
      </Head>

      <div>
        <p>
          <Link href="/exercises/new">
            <a>Create Exercise</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <ExercisesList />
        </Suspense>
      </div>
    </>
  )
}

ExercisesPage.authenticate = true
ExercisesPage.getLayout = (page) => <Layout>{page}</Layout>

export default ExercisesPage
