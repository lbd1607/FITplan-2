import { Fragment, Suspense, useState } from "react"
import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createWorkout from "app/workouts/mutations/createWorkout"
import { WorkoutForm, FORM_ERROR } from "app/workouts/components/WorkoutForm"
// import NewExercisePage from "../exercises/new"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

Modal.setAppElement("#__next")

const NewWorkoutPage: BlitzPage = () => {
  const router = useRouter()
  const [createWorkoutMutation] = useMutation(createWorkout)

  /* const [modalIsOpen, modalSetIsOpen] = useState(false)
  function openExerciseModal() {
    modalSetIsOpen(true)
  }
  function closeModal() {
    modalSetIsOpen(false)
    return <Link href="/" />
  } */

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <div className="card-container">
          <div className="card">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="grid grid-cols-8">
                <h1 className="mb-5 col-span-7">Create New Workout</h1>
                <Link href="/workouts">
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="text-gray-500 cursor-pointer mr-1"
                    />
                  </span>
                </Link>
              </div>
            </div>

            <WorkoutForm
              submitText="Save"
              cancelText="Cancel"
              cancelURL="/workouts"
              // TODO use a zod schema for form validation
              //  - Tip: extract mutation's schema into a shared `validations.ts` file and
              //         then import and use it here
              // schema={CreateWorkout}
              // initialValues={{}}
              onSubmit={async (values) => {
                try {
                  const workout = await createWorkoutMutation(values)
                  /* closeModal()
                  openExerciseModal() */
                  router.push(`/workouts`)
                  // router.push(`/exercises/new`)
                  //router.push(`/workouts/${workout.id}`)
                } catch (error) {
                  //console.error(error)
                  if (!values.workoutName) {
                    return { [FORM_ERROR]: "Workout name is required" }
                  } else if (!values.workoutType) {
                    return { [FORM_ERROR]: "Workout type is required" }
                  } else {
                    return {
                      [FORM_ERROR]: error.toString(),
                    }
                  }
                }
              }}
              onCancel={async () => {
                try {
                  router.back()
                } catch (error) {
                  console.error(error)
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* <div>
        <Modal className="modal" isOpen={modalIsOpen} onRequestClose={closeModal}>
          <Link href="/exercises/new">
            Must wrap workout page in fragment to avoid ref error
            <Fragment>
              <NewExercisePage />
            </Fragment>
          </Link>
        </Modal>
      </div> */}
    </Suspense>
  )
}

NewWorkoutPage.authenticate = true
NewWorkoutPage.getLayout = (page) => <Layout title={"Create New Workout"}>{page}</Layout>

export default NewWorkoutPage
