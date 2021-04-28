import { Fragment, Suspense, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlans from "app/plans/queries/getPlans"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import NewPlanPage from "./new"

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
        <title>Weekly Plans</title>
      </Head>
      <div className="card-container-parent">
        <div className="list-container">
          <h1 className="mb-10">
            Weekly Plans {/* original link without modal <Link href="/exercises/new"> */}
            <button onClick={openModal}>
              <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
            </button>
          </h1>

          <Suspense fallback={<div>Loading...</div>}>
            <PlansList />
          </Suspense>
        </div>
      </div>
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
