import React, { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercise from "app/exercises/queries/getExercise"
import deleteExercise from "app/exercises/mutations/deleteExercise"
import getWorkout from "app/workouts/queries/getWorkout"
import getWorkouts from "app/workouts/queries/getWorkouts"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import EditExercisePage from "app/pages/exercises/[exerciseId]/edit"

Modal.setAppElement("#__next")

export const Exercise = () => {
  const router = useRouter()
  const exerciseId = useParam("exerciseId", "number")
  const [deleteExerciseMutation] = useMutation(deleteExercise)
  const [exercise] = useQuery(getExercise, { id: exerciseId })

  const workoutId = useParam("workoutId", "number")

  const [{ workouts }] = useQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  //Must check to see if workoutId exists first or validation throws undefined id error
  if (!workoutId) {
    var thisWorkoutId = 0
  } else {
    const [workout] = useQuery(getWorkout, { id: workoutId })

    var thisWorkoutId = workout.id
  }

  const [modalIsOpen, modalSetIsOpen] = useState(false)
  function openModal() {
    modalSetIsOpen(true)
  }
  function closeModal() {
    modalSetIsOpen(false)
    return <Link href={Routes.Home()} />
  }
  //Get rate, such as time, reps, or distance, based on the exercise type passed from
  function getExTypeRates(exType) {
    switch (exType) {
      case "interval":
        return <p className="formfieldlabel">Time: {exercise.exInterval || "None"}</p>
      case "reps":
        return <p className="formfieldlabel">Reps: {exercise.exReps || "None"}</p>
      case "distance":
        return <p className="formfieldlabel">Distance: {exercise.exDistance || "None"}</p>
      case "rest":
        return <p className="formfieldlabel">Rest: {exercise.rest || "None"}</p>
      case "":
        return <p className="formfieldlabel">"None"</p>
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <title>{exercise.exName}</title>
      </Head>

      <div className="card-container-parent w-2/6">
        <div className="card-container">
          <div className="card py-6 border-gray-200 border">
            <div className="rounded-t mb-0 px-6 py-6 ">
              <div className="grid grid-cols-8">
                <h1 className="mb-10 col-span-7">{exercise.exName}</h1>
                <Link href={Routes.ExercisesPage()}>
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="text-gray-500 cursor-pointer mr-1"
                    />
                  </span>
                </Link>
              </div>

              <p className="formfieldlabel capitalize">Type: {exercise.exType}</p>
              <span>{getExTypeRates(exercise.exType) || "None"}</span>
              <p className="formfieldlabel">Notes: {exercise.exNotes || "None"}</p>

              <ul>
                {workouts.map((workout) =>
                  exercise.workoutId === workout.id ? (
                    <li className="formfieldlabel" key={thisWorkoutId}>
                      Assigned to Workout: {workout.workoutName}
                    </li>
                  ) : (
                    ""
                  )
                )}
              </ul>
              <div className="flex flex-row justify-between mt-10 px-8">
                <button className="btn edit" onClick={openModal}>
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="pen" size="1x" className="cursor-pointer mr-2" />
                    Edit
                  </a>
                </button>
                {/* </Link> */}

                <button
                  className="btn delete"
                  type="button"
                  onClick={async () => {
                    if (window.confirm("This will be deleted")) {
                      await deleteExerciseMutation({ id: exercise.id })
                      router.push(Routes.ExercisesPage())
                    }
                  }}
                >
                  <FontAwesomeIcon icon="trash" size="1x" className="cursor-pointer mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Modal
          className="modal"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          <Link href={Routes.EditExercisePage({ exerciseId: exercise.id })}>
            {/* Must wrap exercise page in fragment to avoid ref error */}
            <Fragment>
              <EditExercisePage />
            </Fragment>
          </Link>
        </Modal>
      </div>
    </>
  )
}

const ShowExercisePage: BlitzPage = () => {
  return (
    <div>
      {/*   <p>
        <Link href={Routes.ExercisesPage()}>
          <a>Exercises</a>
        </Link>
      </p> */}

      <Suspense fallback={<div>Loading...</div>}>
        <Exercise />
      </Suspense>
    </div>
  )
}

ShowExercisePage.authenticate = true
ShowExercisePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowExercisePage

/* 
 <Link href={Routes.EditExercisePage({ exerciseId: exercise.id })}>
          <a>Edit</a>
        </Link>
*/
