import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createWorkout from "app/workouts/mutations/createWorkout"
import { WorkoutForm, FORM_ERROR } from "app/workouts/components/WorkoutForm"
// import NewExercisePage from "../exercises/new"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { useState } from "react"

const NewWorkoutPage: BlitzPage = () => {
  const router = useRouter()
  const [createWorkoutMutation] = useMutation(createWorkout)

  return (
    <div className="grid items-center justify-center">
      <div className="card-container m-0">
        <div className="modal-card">
          <div className="cardcol">
            <div className="grid grid-cols-8">
              <h1 className="mb-5 col-span-7 pl-0">Create New Workout</h1>

              <Link href={Routes.WorkoutsPage()}>
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
            submitText="Create Workout"
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
                router.push(Routes.WorkoutsPage())
              } catch (error: any) {
                if (!values.workoutName) {
                  return { [FORM_ERROR]: "Enter a workout name." }
                } else if (!values.workoutType) {
                  return { [FORM_ERROR]: "Select a workout type." }
                } else {
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }
            }}
            onCancel={async () => {
              try {
                router.push(Routes.WorkoutsPage())
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
  )
}

NewWorkoutPage.authenticate = true
NewWorkoutPage.getLayout = (page) => <Layout title={"Create New Workout"}>{page}</Layout>

export default NewWorkoutPage
