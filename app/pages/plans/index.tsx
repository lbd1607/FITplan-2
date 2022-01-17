import { Fragment, Suspense, useEffect, useState } from "react"
import { Head, Link, BlitzPage, Routes, useMutation, usePaginatedQuery, useRouter } from "blitz"
import Layout from "app/core/layouts/Layout"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import PlansList from "./PlansList"
import { useTransition, animated } from "react-spring"
import getPlans from "app/plans/queries/getPlans"
import { v4 as uuid } from "uuid"
import NewPlanPage from "./new"

// Modal.setAppElement("#__next")

const PlansPage: BlitzPage = () => {
  const [{ plans }] = usePaginatedQuery(getPlans, {
    orderBy: { itemOrder: "asc" } || { id: "asc" },
  })
  const [planState, setPlanState] = useState(uuid())
  const [show, setShow] = useState(false)
  useEffect(() => {
    setPlanState(uuid())
  }, [plans])
  /*  const [modalIsOpen, modalSetIsOpen] = useState(false)

  const openModal = () => {
    modalSetIsOpen(true)
  }
  const closeModal = () => {
    modalSetIsOpen(false)

    // router.push("/")
    return <Link href={Routes.PlansPage()} />
  } */

  const formIn = useTransition(show, {
    from: { opacity: 0.5, x: 2000 },
    enter: { opacity: 1, x: 1200 },
    leave: { opacity: 0.5, x: 2000, display: "hidden" },
    delay: 50,
  })

  const showPage = () => {
    setShow(true)
  }
  return (
    <>
      <Head>
        <title>Plans</title>
      </Head>

      {/*  <div className="card-container-parent ">
        <div className="list-card "> */}
      {/*  <div className="inner-scroll-parent">
            <div className="inner-scroll-heading"> */}
      <div className="py-2 m-5 bg-white " key={planState}>
        <div className="my-10 ">
          <h1 className="ml-2 mt-1">
            Plans
            <button className="btn add ml-10 align-middle float-right mr-3" onClick={showPage}>
              {" "}
              <a>
                <FontAwesomeIcon icon="plus" size="1x" className="cursor-pointer mr-2" />
                Create New
              </a>
            </button>
          </h1>
        </div>
        {/*   </div> */}

        {/*  <div className="inner-scroll pt-1"> */}

        {formIn(
          (styles, item) =>
            item && (
              <animated.div style={styles} className="w-1/3 h-1/2 absolute z-50 ml-12 ">
                <button
                  onClick={() => {
                    setShow(false)
                    setPlanState(uuid())
                  }}
                >
                  X
                </button>
                <NewPlanPage setPlanState={setPlanState} setShow={setShow} />
                {console.log(planState, show)}
              </animated.div>
            )
        )}
        <div className={show === true ? "" : ""}>
          <Suspense fallback={<div className="m-3 px-6">Loading...</div>}>
            <PlansList />
          </Suspense>

          {/*    </div> */}
          {/* </div> */}
          {/*   </div>
      </div> */}
          {/*  <div>
          <Modal
            className="modal"
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            portalClassName="reg-modal"
          >
            <Link href={Routes.NewPlanPage()}>
        
              <Fragment>
                <NewPlanPage />
              </Fragment>
            </Link>
          </Modal>
        </div> */}
        </div>
      </div>
    </>
  )
}

PlansPage.authenticate = true
PlansPage.getLayout = (page) => (
  <Suspense fallback={""}>
    <Layout>{page}</Layout>
  </Suspense>
)

export default PlansPage
