import { createContext, Dispatch, SetStateAction, Suspense, useState } from "react"
import { Head, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { useTransition, animated, config } from "react-spring"
import { v4 as uuid } from "uuid"
import NewPlanPage from "./new"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import PlansList from "../../plans/components/PlansList"
import EditPlanPage from "./[planId]/edit"

export type PlanFormContextTypes = {
  create: boolean
  setCreate: Dispatch<SetStateAction<boolean>>
  edit: boolean
  setEdit: Dispatch<SetStateAction<boolean>>
  currentPlanId: number
  setCurrentPlanId: Dispatch<SetStateAction<number>>
}
const FormContextInitialValues: PlanFormContextTypes = {
  create: false,
  setCreate: () => {},
  edit: false,
  setEdit: () => {},
  currentPlanId: 0,
  setCurrentPlanId: () => {},
}
export const PlanFormContext = createContext(FormContextInitialValues)

const PlansPage: BlitzPage = () => {
  const [create, setCreate] = useState(false)
  const [edit, setEdit] = useState(false)
  const [currentPlanId, setCurrentPlanId] = useState(0)

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
    <PlanFormContext.Provider
      value={{
        create: create,
        setCreate: setCreate,
        edit: edit,
        setEdit: setEdit,
        currentPlanId: currentPlanId,
        setCurrentPlanId: setCurrentPlanId,
      }}
    >
      <Head>
        <title>Plans</title>
      </Head>
      <div className="card-container-parent" key={uuid()}>
        <div className="list-card rounded-sm">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1 className="ml-2 mt-4">
                Plans
                <button
                  className="btn add float-right ml-10 mr-3 align-middle"
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
                    <NewPlanPage />
                  </animated.div>
                )
            )}
            {editFormIn(
              (styles, showEdit) =>
                showEdit && (
                  <animated.div style={styles} className="absolute z-50 ml-12 h-1/2 w-1/3 ">
                    <EditPlanPage />
                  </animated.div>
                )
            )}
            <div className="inner-scroll">
              <Suspense fallback={<LoadingAnimation />}>
                <PlansList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </PlanFormContext.Provider>
  )
}

PlansPage.authenticate = true
PlansPage.getLayout = (page) => (
  <Suspense fallback={<LoadingAnimation />}>
    <Layout>{page}</Layout>
  </Suspense>
)

export default PlansPage
