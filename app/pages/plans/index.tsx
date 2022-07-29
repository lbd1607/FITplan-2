import { createContext, Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"
import { Head, BlitzPage, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { useTransition, animated } from "react-spring"
import getPlans from "app/plans/queries/getPlans"
import { v4 as uuid } from "uuid"
import NewPlanPage from "./new"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import PlansList from "./PlansList"

export type FormContextTypes = {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  setPlanState: Dispatch<SetStateAction<boolean>>
}
const FormContextInitialValues: FormContextTypes = {
  show: false,
  setShow: () => {},
  setPlanState: () => {},
}
export const FormContext = createContext(FormContextInitialValues)

const PlansPage: BlitzPage = () => {
  const [{ plans }] = usePaginatedQuery(getPlans, {
    orderBy: { itemOrder: "asc" } || { id: "asc" },
  })

  const [planState, setPlanState] = useState(uuid())

  const [show, setShow] = useState(false)

  useEffect(() => {
    setPlanState(uuid())
  }, [plans])

  const formIn = useTransition(show, {
    from: { opacity: 0.5, x: 2000 },
    enter: { opacity: 1, x: 600, y: -15 },
    leave: { opacity: 0.5, x: 2000, display: "hidden" },
    delay: 20,
  })

  const showPage = () => {
    setShow(true)
  }

  return (
    <FormContext.Provider value={{ show: show, setShow: setShow, setPlanState: setPlanState }}>
      <Head>
        <title>Plans</title>
      </Head>
      <div className="card-container-parent" id={planState}>
        <div className="list-card rounded-sm">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1 className="ml-2 mt-4">
                Plans
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
                    <NewPlanPage />
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
    </FormContext.Provider>
  )
}

PlansPage.authenticate = true
PlansPage.getLayout = (page) => (
  <Suspense fallback={<LoadingAnimation />}>
    <Layout>{page}</Layout>
  </Suspense>
)

export default PlansPage
