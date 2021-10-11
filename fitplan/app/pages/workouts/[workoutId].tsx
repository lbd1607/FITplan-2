import { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkout from "app/workouts/queries/getWorkout"
import deleteWorkout from "app/workouts/mutations/deleteWorkout"
import EditWorkoutPage from "./[workoutId]/edit"
import getExercises from "app/exercises/queries/getExercises"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import ExerciseForm from "../exercises/new"

Modal.setAppElement("#__next")

export const Workout = () => {
  const router = useRouter()
  const workoutId = useParam("workoutId", "number")
  const [deleteWorkoutMutation] = useMutation(deleteWorkout)
  const [workout] = useQuery(getWorkout, { id: workoutId })

  const [modalIsOpen, modalSetIsOpen] = useState(false)
  function openModal() {
    modalSetIsOpen(true)
  }
  function closeModal() {
    modalSetIsOpen(false)
    // router.push("/")
    return <Link href="/" />
  }

  const page = Number(router.query.page) || 0
  const [{ exercises }] = useQuery(getExercises, {
    orderBy: { id: "asc" },
  })

  //Determine which icon to display according to workout type
  function getWorkoutIcon(worktype) {
    switch (worktype) {
      case "resistance":
        return <FontAwesomeIcon icon="dumbbell" size="lg" className="text-cyan-500 mx-1 " />
      case "cardio":
        return <FontAwesomeIcon icon="heartbeat" size="lg" className="text-pink-500 mx-1 " />
      case "endurance":
        return <FontAwesomeIcon icon="burn" size="lg" className="text-orange-500 mx-1 " />
      case "flexibility":
        return <FontAwesomeIcon icon="spa" size="lg" className="text-yellow-300 mx-1 " />
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <title>{workout.workoutName}</title>
      </Head>

      <div className="card-container-parent w-2/6">
        <div className="card-container ">
          <div className="card py-6 border-gray-200 border">
            <div className="rounded-t px-6 py-6">
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
              <p className="capitalize formfieldlabel">
                Type: {getWorkoutIcon(workout.workoutType)} {workout.workoutType}
              </p>
              <p className="formfieldlabel">Notes: {workout.workoutNotes || "None"}</p>
              <p className="formfieldlabel">Plan: {workout.planId || "None"}</p>
              <p className="formfieldlabel">Exercises: </p>
              <ul className="ml-8">
                {exercises.map((exercise) =>
                  exercise.workoutId === workout.id ? (
                    <li className="list-disc ml-8 pl-2" key={exercise.id}>
                      {exercise.exName}
                    </li>
                  ) : (
                    ""
                  )
                )}
              </ul>

              <div className="w-full border-0 shadow-none pt-2 pb-2 flex object-center justify-center">
                {/* <Link href="/exercises/new"> */}

                {/* <button className="formfieldlabel" onClick={addExercise}>
                  <FontAwesomeIcon icon="plus-circle" size="2x" className="addicon ml-0" />
                  Exercise
                </button> */}
                {/*    <Fragment>
                  <ExerciseForm />
                </Fragment> */}
                {/*  </Link> */}
              </div>

              <div className="flex flex-row justify-between mt-10">
                <button className="btn edit" onClick={openModal}>
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="pen" size="1x" className="cursor-pointer mr-2" />
                    Edit
                  </a>
                </button>

                <button
                  className="btn delete"
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Delete from Workouts?")) {
                      await deleteWorkoutMutation({ id: workout.id })
                      router.push("/workouts")
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
          <Link href={`/workouts/${workout.id}/edit`}>
            {/* Must wrap workout page in fragment to avoid ref error */}
            <Fragment>
              <EditWorkoutPage />
            </Fragment>
          </Link>
        </Modal>
      </div>
      {/*   <div>
        <Modal isOpen={exModalIsOpen} onRequestClose={exCloseModal}>
          <Link href={`/exercises/new`}>
          
            <Fragment>
              <ExerciseForm />
            </Fragment>
          </Link>
        </Modal>
      </div> */}
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
