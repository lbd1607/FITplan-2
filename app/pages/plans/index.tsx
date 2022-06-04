import { createContext, Dispatch, SetStateAction, Suspense, useEffect, useState } from "react"
import { Head, BlitzPage, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import PlansList from "./PlansList"
import { useTransition, animated } from "react-spring"
import getPlans from "app/plans/queries/getPlans"
import { v4 as uuid } from "uuid"
import NewPlanPage from "./new"

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
    console.log("useEffect plans", plans)
    setPlanState(uuid())
  }, [plans])

  const formIn = useTransition(show, {
    from: { opacity: 0.5, x: 2000 },
    enter: { opacity: 1, x: 600, y: -150 },
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
      <div className="m-5 bg-white py-2 " key={planState}>
        <div className="my-10 ">
          <h1 className="ml-2 mt-1">
            Plans
            <button
              className="btn add float-right ml-10 mr-3 align-middle"
              onClick={() => showPage()}
            >
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
                {console.log(planState, show)}
              </animated.div>
            )
        )}
        <div className={show === true ? "" : ""}>
          <Suspense fallback={<div className="m-3 px-6">Loading...</div>}>
            <PlansList />
          </Suspense>
        </div>
      </div>
    </FormContext.Provider>
  )
}

PlansPage.authenticate = true
PlansPage.getLayout = (page) => (
  <Suspense fallback={""}>
    <Layout>{page}</Layout>
  </Suspense>
)

export default PlansPage
