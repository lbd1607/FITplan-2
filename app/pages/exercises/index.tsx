import React, { Fragment, Suspense, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercises from "app/exercises/queries/getExercises"
import NewExercisePage from "app/pages/exercises/new"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import LoadingAnimation from "app/core/components/LoadingAnimation"

const ITEMS_PER_PAGE = 100

export const ExercisesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ exercises }] = usePaginatedQuery(getExercises, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  if (exercises.length <= 0) {
    return <div className="m-4">No exercises to show ...</div>
  } else
    return (
      <div>
        <ul>
          {exercises.map((exercise) => (
            <Link href={Routes.ShowExercisePage({ exerciseId: exercise.id })} key={exercise.id}>
              <li className="itemrow pl-10">
                <a>{exercise.exName}</a>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
}

const ExercisesPage: BlitzPage = () => {
  const router = useRouter()
  /* Setup modal, contain modal open and close functions */
  const [modalIsOpen, modalSetIsOpen] = useState(false)
  const openModal = () => {
    router.push(Routes.NewExercisePage())
  }
  const closeModal = () => {
    modalSetIsOpen(false)
    return <Link href={Routes.ExercisesPage()} />
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
              <h1 className="ml-2 mt-4">
                Exercises
                <button className="btn add float-right ml-10 mr-3 align-middle" onClick={openModal}>
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="plus" size="1x" className="mr-2 cursor-pointer" />
                    Create New
                  </a>
                </button>
              </h1>
            </div>
            <div className="inner-scroll">
              <div className="">
                <Suspense fallback={<LoadingAnimation />}>
                  <ExercisesList />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Modal
          className="modal"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          <Link href={Routes.NewExercisePage()}>
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
