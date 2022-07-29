import React, { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkout from "app/workouts/queries/getWorkout"
import deleteWorkout from "app/workouts/mutations/deleteWorkout"
import EditWorkoutPage from "app/pages/workouts/[workoutId]/edit"
import getExercises from "app/exercises/queries/getExercises"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

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
    return <Link href={Routes.Home()} />
  }

  const page = Number(router.query.page) || 0
  const [{ exercises }] = useQuery(getExercises, {
    orderBy: { id: "asc" },
  })

  //Determine which icon to display according to workout type
  function getWorkoutIcon(worktype) {
    switch (worktype) {
      case "resistance":
        return <FontAwesomeIcon icon="dumbbell" size="lg" className="mx-1 text-cyan-500 " />
      case "cardio":
        return <FontAwesomeIcon icon="heartbeat" size="lg" className="mx-1 text-pink-500 " />
      case "endurance":
        return <FontAwesomeIcon icon="burn" size="lg" className="mx-1 text-orange-500 " />
      case "flexibility":
        return <FontAwesomeIcon icon="spa" size="lg" className="mx-1 text-yellow-300 " />
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
          <div className="card border border-gray-200 py-6">
            <div className="rounded-t px-6 py-6">
              <div className="grid grid-cols-8">
                <h1 className="col-span-7 mb-10">{workout.workoutName}</h1>
                <Link href={Routes.WorkoutsPage()}>
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="mr-1 cursor-pointer text-gray-500"
                    />
                  </span>
                </Link>
              </div>
              <p className="formfieldlabel capitalize">
                Type: {getWorkoutIcon(workout.workoutType)} {workout.workoutType}
              </p>
              <p className="formfieldlabel">Notes: {workout.workoutNotes || "None"}</p>
              <p className="formfieldlabel">Plan: {workout.planId || "None"}</p>
              <p className="formfieldlabel">Exercises: </p>
              <ul className="ml-8">
                {exercises.map((exercise) =>
                  exercise.workoutId === workout.id ? (
                    <li className="ml-8 list-disc pl-2" key={exercise.id}>
                      {exercise.exName}
                    </li>
                  ) : (
                    ""
                  )
                )}
              </ul>

              <div className="flex w-full justify-center border-0 object-center pt-2 pb-2 shadow-none"></div>

              <div className="mt-10 flex flex-row justify-between px-8">
                <button className="btn edit" onClick={openModal}>
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="pen" size="1x" className="mr-2 cursor-pointer" />
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
          <Link href={Routes.EditWorkoutPage({ workoutId: workout.id })}>
            {/* Must wrap workout page in fragment to avoid ref error */}
            <Fragment>
              <EditWorkoutPage />
            </Fragment>
          </Link>
        </Modal>
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
