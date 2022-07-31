import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { WorkoutForm, FORM_ERROR } from "app/pages/workouts/components/WorkoutForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { useContext } from "react"
import { WorkoutFormContext } from "."
import createWorkout from "./mutations/createWorkout"

const NewWorkoutPage: BlitzPage = () => {
  const router = useRouter()
  const [createWorkoutMutation] = useMutation(createWorkout)

  const { setCreate } = useContext(WorkoutFormContext)

  return (
    <div className="flex items-center justify-center">
      <div className="card-container m-0">
        <div className="modal-card">
          <div className="cardcol">
            <div className="grid grid-cols-8">
              <h1 className="col-span-7 mb-5 pl-0">Create New Workout</h1>
              <Link href={Routes.WorkoutsPage()}>
                <button
                  className="col-span-1 justify-end text-right"
                  onClick={() => setCreate(false)}
                >
                  <FontAwesomeIcon
                    icon="times"
                    size="lg"
                    className="mr-1 cursor-pointer text-slate-500"
                  />
                </button>
              </Link>
            </div>
          </div>

          <WorkoutForm
            submitText="Create Workout"
            cancelText="Cancel"
            cancelURL="/workouts"
            onSubmit={async (values) => {
              try {
                await createWorkoutMutation(values)
                setCreate(false)
                router.push(Routes.WorkoutsPage())
              } catch (error: any) {
                if (!values.workoutName) {
                  return { [FORM_ERROR]: "Enter a workout name." }
                } else if (!values.workoutType) {
                  return { [FORM_ERROR]: "Select a workout type." }
                } else if (
                  error
                    .toString()
                    .includes("Unique constraint failed on the fields: (`workoutName`)")
                ) {
                  return { [FORM_ERROR]: "Workout name must be unique." }
                } else {
                  return { [FORM_ERROR]: "An unknown error occurred." }
                }
              }
            }}
            onCancel={async () => {
              setCreate(false)
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
