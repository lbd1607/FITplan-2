import React, { Fragment, Suspense, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkouts from "app/workouts/queries/getWorkouts"
import deleteWorkout from "app/workouts/mutations/deleteWorkout"
import NewWorkoutPage from "app/pages/workouts/new"
//import ShowWorkoutPage from "app/pages/workouts/[workoutId]"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

// Modal.setAppElement("#__next")

const ITEMS_PER_PAGE = 100

export const WorkoutsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ workouts, hasMore }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  function getWorkoutIcon(worktype) {
    switch (worktype) {
      case "resistance":
        return <FontAwesomeIcon icon="dumbbell" size="lg" className="mr-4 ml-2 text-cyan-500 " />
      case "cardio":
        return <FontAwesomeIcon icon="heartbeat" size="lg" className="mr-4 ml-3 text-pink-500 " />
      case "endurance":
        return <FontAwesomeIcon icon="burn" size="lg" className="mr-5 ml-3 text-orange-500 " />
      case "flexibility":
        return <FontAwesomeIcon icon="spa" size="lg" className="mr-5 ml-2 text-yellow-300 " />
      default:
        break
    }
  }

  if (workouts.length <= 0) {
    return <div className="m-4 pl-6">No workouts to show ...</div>
  } else
    return (
      <div>
        <ul>
          {workouts.map((workout) => (
            <Link href={Routes.ShowWorkoutPage({ workoutId: workout.id })} key={workout.id}>
              <li className="itemrow">
                <a>
                  {getWorkoutIcon(workout.workoutType)} {workout.workoutName}
                </a>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
}

const WorkoutsPage: BlitzPage = () => {
  const router = useRouter()
  const [modalState, setModalState] = useState(false)
  const openModal = () => {
    // setModalState(true)
    router.push(Routes.NewWorkoutPage())
  }
  const closeModal = () => {
    setModalState(false)
    router.push("/workouts")
    // return <Link href={Routes.WorkoutsPage()} />
  }

  return (
    <>
      <Head>
        <title>Workouts</title>
      </Head>
      <div className="card-container-parent">
        <div className="list-card rounded-sm">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1 className="ml-2 mt-1">
                Workouts
                <button
                  className="btn add float-right ml-10 mr-3 align-middle "
                  onClick={openModal}
                >
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="plus" size="1x" className="mr-2 cursor-pointer" />
                    Create New
                  </a>
                </button>
              </h1>
            </div>
            <div className="inner-scroll">
              <div className="">
                <Suspense fallback={<div className="m-3 px-6">Loading...</div>}>
                  <WorkoutsList />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        className="modal"
        isOpen={modalState}
        setOpen={setModalState}
        onRequestClose={closeModal}
        portalClassName="reg-modal"
      >
        <NewWorkoutPage />
      </Modal>
    </>
  )
}

WorkoutsPage.authenticate = true
WorkoutsPage.getLayout = (page) => <Layout>{page}</Layout>

export default WorkoutsPage
