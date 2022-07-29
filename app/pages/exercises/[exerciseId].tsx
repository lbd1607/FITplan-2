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

export const Exercise = () => {
  const router = useRouter()
  const exerciseId = useParam("exerciseId", "number")
  const [deleteExerciseMutation] = useMutation(deleteExercise)
  const [exercise] = useQuery(getExercise, { id: exerciseId })

  const [{ workouts }] = useQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  const workoutId = useParam("workoutId", "number")

  const [workout] = useQuery(getWorkout, { id: workoutId }, { enabled: false })
  const currentWorkoutId = workout?.id ?? 0

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
        return <p className="formfieldlabel">None</p>
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
          <div className="card border border-gray-200 py-6">
            <div className="mb-0 rounded-t px-6 py-6 ">
              <div className="grid grid-cols-8">
                <h1 className="col-span-7 mb-10">{exercise.exName}</h1>
                <Link href={Routes.ExercisesPage()}>
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="mr-1 cursor-pointer text-gray-500"
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
                    <li className="formfieldlabel" key={currentWorkoutId}>
                      Assigned to Workout: {workout.workoutName}
                    </li>
                  ) : (
                    ""
                  )
                )}
              </ul>
              <div className="mt-10 flex flex-row justify-between px-8">
                <button className="btn edit" onClick={openModal}>
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="pen" size="1x" className="mr-2 cursor-pointer" />
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
                  <FontAwesomeIcon icon="trash" size="1x" className="mr-2 cursor-pointer" />
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
