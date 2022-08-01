import React, { createContext, Dispatch, SetStateAction, Suspense, useState } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import NewWorkoutPage from "app/pages/workouts/new"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import { v4 as uuid } from "uuid"
import { useTransition, animated, config } from "react-spring"
import WorkoutsList from "./WorkoutsList"
import EditWorkoutPage from "./[workoutId]/edit"

export type WorkoutFormContextTypes = {
  create: boolean
  setCreate: Dispatch<SetStateAction<boolean>>
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  currentWorkoutId: number
  setCurrentWorkoutId: Dispatch<SetStateAction<number>>
}
const FormContextInitialValues: WorkoutFormContextTypes = {
  create: false,
  setCreate: () => {},
  edit: false,
  setEdit: () => {},
  currentWorkoutId: 0,
  setCurrentWorkoutId: () => {},
}

export const WorkoutFormContext = createContext(FormContextInitialValues)

const WorkoutsPage: BlitzPage = () => {
  const [create, setCreate] = useState(false)
  const [edit, setEdit] = useState(false)
  const [currentWorkoutId, setCurrentWorkoutId] = useState(0)

  const createFormIn = useTransition(create, {
    from: { opacity: 0 },
    enter: { opacity: 1, x: 600 },
    leave: { opacity: 0, display: "hidden" },
    delay: 20,
    config: config.gentle,
  })
  const editFormIn = useTransition(edit, {
    from: { opacity: 0 },
    enter: { opacity: 1, x: 600 },
    leave: { opacity: 0, display: "hidden" },
    delay: 20,
    config: config.gentle,
  })

  return (
    <WorkoutFormContext.Provider
      value={{
        create: create,
        setCreate: setCreate,
        edit: edit,
        setEdit: setEdit,
        currentWorkoutId: currentWorkoutId,
        setCurrentWorkoutId: setCurrentWorkoutId,
      }}
    >
      <Head>
        <title>Workouts</title>
      </Head>
      <div className="card-container-parent" key={uuid()}>
        <div className="list-card rounded-sm">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1 className="ml-2 mt-4">
                Workouts
                <button
                  className="btn add float-right ml-10 mr-3 align-middle "
                  onClick={() => setCreate(true)}
                >
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="plus" size="1x" className="mr-2 cursor-pointer" />
                    Create New
                  </a>
                </button>
              </h1>
            </div>
            {createFormIn(
              (styles, showNew) =>
                showNew && (
                  <animated.div style={styles} className="absolute z-50 ml-12 h-1/2 w-1/3 ">
                    <NewWorkoutPage />
                  </animated.div>
                )
            )}
            {editFormIn(
              (styles, showEdit) =>
                showEdit && (
                  <animated.div style={styles} className="absolute z-50 ml-12 h-1/2 w-1/3 ">
                    <EditWorkoutPage />
                  </animated.div>
                )
            )}
            <div className="inner-scroll">
              <Suspense fallback={<LoadingAnimation />}>
                <WorkoutsList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </WorkoutFormContext.Provider>
  )
}

WorkoutsPage.authenticate = true
WorkoutsPage.getLayout = (page) => (
  <Suspense fallback={<LoadingAnimation />}>
    <Layout>{page}</Layout>
  </Suspense>
)

export default WorkoutsPage
