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
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="grid grid-cols-8">
                <h1 className="mb-10 col-span-7">{workout.workoutName}</h1>
                <Link href="/workouts">
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="text-gray-500 cursor-pointer mr-1"
                    />
                  </span>
                </Link>
              </div>

              <p className="formfieldlabel">ID: {workout.id}</p>
              <p className="capitalize formfieldlabel">
                Type: {getWorkoutIcon(workout.workoutType)} {workout.workoutType}
              </p>
              <p className="formfieldlabel">Notes: {workout.workoutNotes || "None"}</p>
              <p className="formfieldlabel">Plan: {workout.planId || "None"}</p>

              {/* <pre>{JSON.stringify(workout, null, 2)}</pre> */}

              <div className="flex flex-row justify-between mt-10">
                <Link href={`/workouts/${workout.id}/edit`}>
                  <button className="btn save">
                    {" "}
                    <a>Edit</a>
                  </button>
                </Link>

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
      <Suspense fallback={<div>Loading...</div>}>
        <Workout />
      </Suspense>
    </div>
  )
}

ShowWorkoutPage.authenticate = true
ShowWorkoutPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowWorkoutPage
