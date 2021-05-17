import { Fragment, Suspense, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercises from "app/exercises/queries/getExercises"
import NewExercisePage from "./new"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

Modal.setAppElement("#__next")

const ITEMS_PER_PAGE = 100

export const ExercisesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ exercises, hasMore }] = usePaginatedQuery(getExercises, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  if (exercises.length <= 0) {
    return <div className="m-4">No exercises to show ...</div>
  } else
    return (
      <div>
        <ul>
          {exercises.map((exercise) => (
            <Link href={`/exercises/${exercise.id}`} key={exercise.id}>
              <li className="itemrow">
                <a>{exercise.exName}</a>
              </li>
            </Link>
          ))}
        </ul>

        {/*  <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button> */}
      </div>
    )
}

const ExercisesPage: BlitzPage = () => {
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
        <title>Exercises</title>
      </Head>

      <div className="card-container-parent">
        <div className="list-card">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1>
                Exercises {/* original link without modal <Link href="/exercises/new"> */}
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
                  <ExercisesList />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="card-container-parent">
        <div className="list-card">
          <h1 className="mb-10">
            Exercises
            <button onClick={openModal}>
              <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
            </button>
          </h1>
          <Suspense fallback={<div>Loading...</div>}>
            <ExercisesList />
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
          <Link href="/exercises/new">
            {/* Must wrap workout page in fragment to avoid ref error */}
            <Fragment>
              <NewExercisePage />
            </Fragment>
          </Link>
        </Modal>
      </div>
    </>
  )
}

ExercisesPage.authenticate = true
ExercisesPage.getLayout = (page) => <Layout>{page}</Layout>

export default ExercisesPage
