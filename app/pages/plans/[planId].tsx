import React, { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlan from "app/plans/queries/getPlan"
import deletePlan from "app/plans/mutations/deletePlan"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import EditPlanPage from "app/pages/plans/[planId]/edit"
import getWorkout from "app/workouts/queries/getWorkout"
import getWorkouts from "app/workouts/queries/getWorkouts"
import getExercises from "app/exercises/queries/getExercises"
import { v4 as uuid } from "uuid"

Modal.setAppElement("#__next")

export const Plan = () => {
  const router = useRouter()
  const planId = useParam("planId", "number")
  const [deletePlanMutation] = useMutation(deletePlan)
  const [plan] = useQuery(getPlan, { id: planId })

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

  //Determine chip for day based on day passed in during sub-map
  function getDayChip(days) {
    switch (days) {
      case "Monday":
        return (
          <div className="daysChip daySelected daysChipSm" key={0}>
            M
          </div>
        )
      case "Tuesday":
        return (
          <div className="daysChip daySelected daysChipSm" key={1}>
            Tu
          </div>
        )
      case "Wednesday":
        return (
          <div className="daysChip daySelected daysChipSm" key={2}>
            W
          </div>
        )
      case "Thursday":
        return (
          <div className="daysChip daySelected daysChipSm" key={3}>
            Th
          </div>
        )
      case "Friday":
        return (
          <div className="daysChip daySelected daysChipSm" key={4}>
            F
          </div>
        )
      case "Saturday":
        return (
          <div className="daysChip daySelected daysChipSm" key={5}>
            Sa
          </div>
        )
      case "Sunday":
        return (
          <div className="daysChip daySelected daysChipSm" key={6}>
            Su
          </div>
        )
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <title>{plan.planName}</title>
      </Head>

      <div className="card-container-parent w-2/6 ">
        <div className="card-container ">
          <div className="card py-6 border-gray-200 border">
            <div className="rounded-t mb-0 px-6 py-6 ">
              <div className="grid grid-cols-8">
                <h1 className="mb-10 col-span-7">{plan.planName}</h1>
                <Link href="/plans">
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="text-gray-500 cursor-pointer mr-1"
                    />
                  </span>
                </Link>
              </div>

              <span>
                <div className="flex flex-row space-x-3">
                  <p className="formfieldlabel pr-2">Days: </p>

                  {/* Map though days array so each is displayed here as chip */}
                  {plan.days.map((day) => getDayChip(day))}
                </div>
              </span>

              {/* Map through plan.workouts and get single assigned workout. If the name of assigned workout is the same as the workout name, then map the exercises to each workout. This only works because workoutName is required to be a unique value in the schema. */}
              {/*     <p className="formfieldlabel">Workouts:</p> */}

              <ul className="ml-8">
                {plan.workouts.map((assignedWorkout) =>
                  workouts.map((workout) =>
                    assignedWorkout === workout.workoutName ? (
                      <ul key={uuid()}>
                        <div key={uuid()}>
                          <ul className="formfieldlabel" key={thisWorkoutId}>
                            Workout: {workout.workoutName}
                            {exercises.map((exercise) =>
                              exercise.workoutId === workout.id ? (
                                <li className="list-disc ml-8 pl-2 leading-8" key={exercise.id}>
                                  {exercise.exName}
                                </li>
                              ) : (
                                ""
                              )
                            )}
                          </ul>
                        </div>
                      </ul>
                    ) : (
                      ""
                    )
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
                <button
                  className="btn delete"
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Delete from Plans?")) {
                      await deletePlanMutation({ id: plan.id })
                      router.push("/plans")
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
        {/*  <Modal
          className="modal"
          isOpen={confirmModalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          Delete from Plans?
          <button onClick={confirmDelete(false)}>Cancel</button>
          <button onClick={confirmDelete(true)}>Delete</button>
        </Modal> */}
        <Modal
          className="modal"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          <Link href={Routes.EditPlanPage({ planId: plan.id })}>
            {/* Must wrap plan page in fragment to avoid ref error */}
            <Fragment>
              <EditPlanPage />
            </Fragment>
          </Link>
        </Modal>
      </div>
    </>
  )
}

const ShowPlanPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Plan />
      </Suspense>
    </div>
  )
}

ShowPlanPage.authenticate = true
ShowPlanPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPlanPage
