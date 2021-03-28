import { Fragment, Suspense, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkouts from "app/workouts/queries/getWorkouts"
import deleteWorkout from "app/workouts/mutations/deleteWorkout"
import NewWorkoutPage from "./new"
import ShowWorkoutPage from "./[workoutId]"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

Modal.setAppElement("#__next")

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

  const [deleteWorkoutMutation] = useMutation(deleteWorkout)

  //Determine which icon to display according to workout type
  function getWorkoutIcon(worktype) {
    switch (worktype) {
      case "resistance":
        return <FontAwesomeIcon icon="dumbbell" size="lg" className="text-cyan-500 mr-4 ml-2 " />
      case "cardio":
        return <FontAwesomeIcon icon="heartbeat" size="lg" className="text-pink-500 mr-4 ml-3 " />
      case "endurance":
        return <FontAwesomeIcon icon="burn" size="lg" className="text-orange-500 mr-5 ml-3 " />
      default:
        break
    }
  }

  return (
    <div>
      <ul>
        {workouts.map((workout) => (
          <Link href={`/workouts/${workout.id}`} key={workout.id}>
            <li className="itemrow">
              <a>
                {getWorkoutIcon(workout.workoutType)} {workout.workoutName}
              </a>
            </li>
          </Link>
        ))}
      </ul>

      {/* <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
    </div>
  )
}

const WorkoutsPage: BlitzPage = () => {
  /* Setup modal, contain modal open and close functions */
  const [modalIsOpen, modalSetIsOpen] = useState(false)
  const openModal = () => {
    modalSetIsOpen(true)
  }
  const closeModal = () => {
    modalSetIsOpen(false)
    // router.push("/")
    return <Link href="/" />
  }
  return (
    <>
      <Head>
        <title>Workouts</title>
      </Head>
      <div className="card-container-parent">
        <div className="list-container">
          <h1 className="mb-10">
            Workouts {/* original link without modal <Link href="/workouts/new"> */}
            {/* Must wrap FontAwesomeIcon in <span> to avoid ref error */}
            <button onClick={openModal}>
              <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
            </button>
            {/* </Link> */}
          </h1>

          <Suspense fallback={<div>Loading...</div>}>
            <WorkoutsList />
          </Suspense>
        </div>
      </div>
      <div>
        <Modal className="modal" isOpen={modalIsOpen} onRequestClose={closeModal}>
          <Link href="/workouts/new">
            {/* Must wrap workout page in fragment to avoid ref error */}
            <Fragment>
              <NewWorkoutPage />
            </Fragment>
          </Link>
        </Modal>
      </div>
    </>
  )
}

WorkoutsPage.authenticate = true
WorkoutsPage.getLayout = (page) => <Layout>{page}</Layout>

export default WorkoutsPage
