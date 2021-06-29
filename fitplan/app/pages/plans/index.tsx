import { Fragment, Suspense, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlans from "app/plans/queries/getPlans"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import NewPlanPage from "./new"
import { DragDropContext } from "react-beautiful-dnd"

Modal.setAppElement("#__next")

const ITEMS_PER_PAGE = 100

export const PlansList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ plans, hasMore }] = usePaginatedQuery(getPlans, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

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

  if (plans.length <= 0) {
    return <div className="m-4">No plans to show ...</div>
  } else
    return (
      <div>
        <ul>
          {plans.map((plan) => (
            <Link href={`/plans/${plan.id}`} key={plan.id}>
              <li className="itemrow">
                <a>{plan.planName}</a>
                <div className="grid grid-flow-col float-right mr-4 gap-2">
                  {/* Map though days array so each is displayed here as chip */}
                  {plan.days.map((day) => getDayChip(day))}
                </div>
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

const PlansPage: BlitzPage = () => {
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
        <title>Plans</title>
      </Head>

      <div className="card-container-parent">
        <div className="list-card">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1>
                Plans {/* original link without modal <Link href="/plans/new"> */}
                {/* Must wrap FontAwesomeIcon in <span> to avoid ref error */}
                <button onClick={openModal}>
                  <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
                </button>
                {/* </Link> */}
              </h1>
            </div>
            <div className="inner-scroll">
              <div className="">
                <Suspense fallback={<div>Loading...</div>}>
                  <DragDropContext onDragEnd={this.onDragEnd}>
                    <PlansList />
                  </DragDropContext>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  <div className="card-container-parent">
        <div className="list-card">
          <h1 className="mb-10">
            Weekly Plans
            <button onClick={openModal}>
              <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
            </button>
          </h1>
          <Suspense fallback={<div>Loading...</div>}>
            <PlansList />
          </Suspense>
        </div>
      </div> */}
      <div>
        <Modal
          className="modal"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          <Link href="/plans/new">
            {/* Must wrap workout page in fragment to avoid ref error */}
            <Fragment>
              <NewPlanPage />
            </Fragment>
          </Link>
        </Modal>
      </div>
    </>
  )
}

PlansPage.authenticate = true
PlansPage.getLayout = (page) => <Layout>{page}</Layout>

export default PlansPage
