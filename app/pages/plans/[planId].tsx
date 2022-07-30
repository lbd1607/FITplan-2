import React, { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlan from "./queries/getPlan"
import deletePlan from "./mutations/deletePlan"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import EditPlanPage from "app/pages/plans/[planId]/edit"
import { v4 as uuid } from "uuid"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import getWorkouts from "../workouts/queries/getWorkouts"
import getWorkout from "../workouts/queries/getWorkout"

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

  const workoutId = useParam("workoutId", "number")

  const [{ workouts }] = useQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  const [workout] = useQuery(getWorkout, { id: workoutId }, { enabled: false })
  const currentWorkoutId = workout?.id ?? 0

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
          <div className="card border border-slate-200 py-6">
            <div className="mb-0 rounded-t px-6 py-6 ">
              <div className="grid grid-cols-8">
                <h1 className="col-span-7 mb-10">{plan.planName}</h1>
                <Link href="/plans">
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="mr-1 cursor-pointer text-slate-500"
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
              <ul className="ml-8">
                {plan.workouts.map((assignedWorkout) =>
                  workouts.map((workout) =>
                    assignedWorkout === workout.workoutName ? (
                      <ul key={uuid()}>
                        <div key={uuid()}>
                          <ul className="formfieldlabel" key={currentWorkoutId}>
                            Workout: {workout.workoutName}
                          </ul>
                        </div>
                      </ul>
                    ) : (
                      ""
                    )
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
                <button
                  className="btn delete"
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Delete from Plans?")) {
                      await deletePlanMutation({ id: plan.id })
                      router.push(Routes.PlansPage())
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
          <Link href={Routes.EditPlanPage({ planId: plan.id })}>
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
      <Suspense fallback={<LoadingAnimation />}>
        <Plan />
      </Suspense>
    </div>
  )
}

ShowPlanPage.authenticate = true
ShowPlanPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPlanPage
