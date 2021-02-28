import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkout from "app/workouts/queries/getWorkout"
import deleteWorkout from "app/workouts/mutations/deleteWorkout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

export const Workout = () => {
  const router = useRouter()
  const workoutId = useParam("workoutId", "number")
  const [deleteWorkoutMutation] = useMutation(deleteWorkout)
  const [workout] = useQuery(getWorkout, { id: workoutId })

  //Determine which icon to display according to workout type
  function getWorkoutIcon(worktype) {
    switch (worktype) {
      case "resistance":
        return <FontAwesomeIcon icon="dumbbell" size="lg" className="text-cyan-500 mx-1 " />
      case "cardio":
        return <FontAwesomeIcon icon="heartbeat" size="lg" className="text-pink-500 mx-1 " />
      case "endurance":
        return <FontAwesomeIcon icon="burn" size="lg" className="text-orange-500 mx-1 " />
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <title>{workout.workoutName}</title>
      </Head>
      <div className="card-container-parent">
        <div className="card-container">
          <div className="card">
            <div className="rounded-t mb-0 px-6 px-6 py-6">
              <h1 className="mb-10">{workout.workoutName}</h1>
              <p className="formfieldlabel">ID: {workout.id}</p>
              <p className="capitalize formfieldlabel">
                Type: {getWorkoutIcon(workout.workoutType)} {workout.workoutType}
              </p>
              <p className="formfieldlabel">Notes: {workout.workoutNotes || "None"}</p>
              <p className="formfieldlabel">Plan: {workout.planId || "None"}</p>

              {/* <pre>{JSON.stringify(workout, null, 2)}</pre> */}

              <div className="flex flex-row justify-between mt-10">
                <button className="btn save">
                  {" "}
                  <Link href={`/workouts/${workout.id}/edit`}>
                    <a>Edit</a>
                  </Link>
                </button>

                <button
                  className="btn cancel"
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
            </div>
          </div>
        </div>
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
