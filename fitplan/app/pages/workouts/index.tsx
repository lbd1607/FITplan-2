import React, { createContext, Dispatch, SetStateAction, Suspense, useState } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import NewWorkoutPage from "app/pages/workouts/new"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import { v4 as uuid } from "uuid"
import { useTransition, animated } from "react-spring"
import WorkoutsList from "./WorkoutsList"

export type FormContextTypes = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}
const FormContextInitialValues: FormContextTypes = {
  show: false,
  setShow: () => {},
}

export const FormContext = createContext(FormContextInitialValues)

const WorkoutsPage: BlitzPage = () => {
  const [show, setShow] = useState(false)

  const showPage = () => {
    setShow(true)
  }
  const formIn = useTransition(show, {
    from: { opacity: 0.5, x: 2000 },
    enter: { opacity: 1, x: 600, y: -15 },
    leave: { opacity: 0.5, x: 2000, display: "hidden" },
    delay: 20,
  })

  return (
    <FormContext.Provider
      value={{
        show: show,
        setShow: setShow,
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
                <button className="btn add float-right ml-10 mr-3 align-middle " onClick={showPage}>
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="plus" size="1x" className="mr-2 cursor-pointer" />
                    Create New
                  </a>
                </button>
              </h1>
            </div>
            {formIn(
              (styles, item) =>
                item && (
                  <animated.div style={styles} className="absolute z-50 ml-12 h-1/2 w-1/3 ">
                    <NewWorkoutPage />
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
    </FormContext.Provider>
  )
}

WorkoutsPage.authenticate = true
WorkoutsPage.getLayout = (page) => (
  <Suspense fallback={<LoadingAnimation />}>
    <Layout>{page}</Layout>
  </Suspense>
)

export default WorkoutsPage
