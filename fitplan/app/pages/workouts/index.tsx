import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkouts from "app/workouts/queries/getWorkouts"
import deleteWorkout from "app/workouts/mutations/deleteWorkout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

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

  const [deleteWorkoutMutation] = useMutation(deleteWorkout)

  //Determine which icon to display according to workout type
  function getWorkoutIcon(worktype) {
    switch (worktype) {
      case "resistance":
        return <FontAwesomeIcon icon="dumbbell" size="lg" className="text-cyan-500 mr-4 ml-2 " />
      case "cardio":
        return <FontAwesomeIcon icon="heartbeat" size="lg" className="text-pink-500 mr-4 ml-3 " />
      case "endurance":
        return <FontAwesomeIcon icon="burn" size="lg" className="text-orange-500 mr-5 ml-3 " />
      default:
        break
    }
  }

  return (
    <div>
      <ul>
        {workouts.map((workout) => (
          <Link href={`/workouts/${workout.id}`} key={workout.id}>
            <li className="itemrow">
              <a>
                {getWorkoutIcon(workout.workoutType)} {workout.workoutName}
              </a>
              {/* <span className="justify-evenly">
                <Link href={`/workouts/${workout.id}/edit`}>
                  <span className="mx-5 rounded-full h-8 w-8 flex items-center justify-center border border-purple-600">
                    <FontAwesomeIcon icon="pen" size="sm" className="editicon" />
                  </span>
                </Link>

                <button
                  className="rounded-full h-8 w-8 flex items-center justify-center border border-pink-600"
                  type="button"
                  onClick={async () => {
                    if (window.confirm("This will be deleted")) {
                      await deleteWorkoutMutation({ id: workout.id })
                      router.push("/workouts")
                    }
                  }}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <span className="mx-5">
                    <FontAwesomeIcon icon="trash" size="sm" className="deleteicon" />
                  </span>
                </button>
              </span> */}
            </li>
          </Link>
        ))}
      </ul>

      {/* <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
    </div>
  )
}

const WorkoutsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Workouts</title>
      </Head>
      <div className="card-container-parent">
        <div className="card mx-20 h-screen mb-14">
          <h1 className="mb-10">
            Workouts{" "}
            <Link href="/workouts/new">
              {/* Must wrap FontAwesomeIcon in <span> to avoid ref error */}
              <span>
                <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
              </span>
            </Link>
          </h1>

          <Suspense fallback={<div>Loading...</div>}>
            <WorkoutsList />
          </Suspense>
        </div>
      </div>
    </>
  )
}

WorkoutsPage.authenticate = true
WorkoutsPage.getLayout = (page) => <Layout>{page}</Layout>

export default WorkoutsPage
