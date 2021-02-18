import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkout from "app/workouts/queries/getWorkout"
import deleteWorkout from "app/workouts/mutations/deleteWorkout"

export const Workout = () => {
  const router = useRouter()
  const workoutId = useParam("workoutId", "number")
  const [deleteWorkoutMutation] = useMutation(deleteWorkout)
  const [workout] = useQuery(getWorkout, { id: workoutId })

  return (
    <>
      <Head>
        <title>{workout.workoutName}</title>
      </Head>

      <div>
        <h1>{workout.workoutName}</h1>
        <pre>{JSON.stringify(workout, null, 2)}</pre>

        <Link href={`/workouts/${workout.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteWorkoutMutation({ id: workout.id })
              router.push("/workouts")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowWorkoutPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/workouts">
          <a>Workouts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Workout />
      </Suspense>
    </div>
  )
}

ShowWorkoutPage.authenticate = true
ShowWorkoutPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWorkoutPage
