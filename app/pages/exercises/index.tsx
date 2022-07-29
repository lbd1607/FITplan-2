import React, {
  createContext,
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useState,
} from "react"
import { Head, BlitzPage, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import NewExercisePage from "app/pages/exercises/new"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import { v4 as uuid } from "uuid"
import { useTransition, animated } from "react-spring"
import ExercisesList from "./ExercisesList"
import getExercises from "app/exercises/queries/getExercises"

export type FormContextTypes = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  setExerciseState: Dispatch<SetStateAction<boolean>>
}
const FormContextInitialValues: FormContextTypes = {
  show: false,
  setShow: () => {},
  setExerciseState: () => {},
}
export const FormContext = createContext(FormContextInitialValues)

const ExercisesPage: BlitzPage = () => {
  const [{ exercises }] = usePaginatedQuery(getExercises, {
    orderBy: { id: "asc" },
  })

  const [exerciseState, setExerciseState] = useState(uuid())

  const [show, setShow] = useState(false)

  useEffect(() => {
    setExerciseState(uuid())
  }, [exercises])

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
      value={{ show: show, setShow: setShow, setExerciseState: setExerciseState }}
    >
      <Head>
        <title>Exercises</title>
      </Head>

      <div className="card-container-parent" id={exerciseState}>
        <div className="list-card">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1 className="ml-2 mt-4">
                Exercises
                <button className="btn add float-right ml-10 mr-3 align-middle" onClick={showPage}>
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
                    <NewExercisePage />
                  </animated.div>
                )
            )}
            <div className="inner-scroll">
              <Suspense fallback={<LoadingAnimation />}>
                <ExercisesList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </FormContext.Provider>
  )
}

ExercisesPage.authenticate = true
ExercisesPage.getLayout = (page) => (
  <Suspense fallback={<LoadingAnimation />}>
    <Layout>{page}</Layout>
  </Suspense>
)

export default ExercisesPage
