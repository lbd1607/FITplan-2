import { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercise from "app/exercises/queries/getExercise"
import deleteExercise from "app/exercises/mutations/deleteExercise"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import EditExercisePage from "./[exerciseId]/edit"

Modal.setAppElement("#__next")

export const Exercise = () => {
  const router = useRouter()
  const exerciseId = useParam("exerciseId", "number")
  const [deleteExerciseMutation] = useMutation(deleteExercise)
  const [exercise] = useQuery(getExercise, { id: exerciseId })

  const [modalIsOpen, modalSetIsOpen] = useState(false)
  function openModal() {
    modalSetIsOpen(true)
  }
  function closeModal() {
    modalSetIsOpen(false)
    // router.push("/")
    return <Link href="/" />
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

      <div className="card-container-parent">
        <div className="card-container w-2/6">
          <div className="card">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="grid grid-cols-8">
                <h1 className="mb-10 col-span-7">{exercise.exName}</h1>
                <Link href="/exercises">
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="text-gray-500 cursor-pointer mr-1"
                    />
                  </span>
                </Link>
              </div>

              <p className="formfieldlabel">ID: {exercise.id}</p>
              <p className="formfieldlabel capitalize">Type: {exercise.exType}</p>
              <span>{getExTypeRates(exercise.exType) || "None"}</span>
              {/* <p className="capitalize formfieldlabel">
                Type: {getWorkoutIcon(workout.workoutType)} {workout.workoutType}
              </p> */}

              <div></div>
              <p className="formfieldlabel">Notes: {exercise.exNotes || "None"}</p>
              <p className="formfieldlabel">Workout ID: {exercise.workoutId || "None"}</p>

              {/* 
              <p className="formfieldlabel">Exercises: </p>

              <ul>
                {exercises.map((exercise) =>
                  exercise.workoutId === workout.id ? (
                    <li key={exercise.id}>{exercise.exName}</li>
                  ) : (
                    ""
                  )
                )}
              </ul> */}

              {/* <pre>{JSON.stringify(workout, null, 2)}</pre> */}

              <div className="flex flex-row justify-between mt-10">
                {/* <Link href={`/workouts/${workout.id}/edit`}> */}
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
                      router.push("/exercises")
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
          <Link href={`/exercises/${exercise.id}/edit`}>
            {/* Must wrap exercise page in fragment to avoid ref error */}
            <Fragment>
              <EditExercisePage />
            </Fragment>
          </Link>
        </Modal>
      </div>

      {/* <div>
        <h1>{exercise.exName}</h1>
        <pre>{JSON.stringify(exercise, null, 2)}</pre>

        <Link href={`/exercises/${exercise.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteExerciseMutation({ id: exercise.id })
              router.push("/exercises")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div> */}
    </>
  )
}

const ShowExercisePage: BlitzPage = () => {
  return (
    <div>
      {/* <p>
        <Link href="/exercises">
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
