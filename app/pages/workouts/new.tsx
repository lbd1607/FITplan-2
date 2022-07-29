import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { WorkoutForm, FORM_ERROR } from "app/pages/workouts/components/WorkoutForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { useContext } from "react"
import { FormContext } from "."
import createWorkout from "./mutations/createWorkout"

const NewWorkoutPage: BlitzPage = () => {
  const router = useRouter()
  const [createWorkoutMutation] = useMutation(createWorkout)

  const { setShow } = useContext(FormContext)

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
                  onClick={() => setShow(false)}
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
                setShow(false)
                router.push(Routes.WorkoutsPage())
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
            onCancel={async () => {
              setShow(false)
              try {
                router.push(Routes.PlansPage())
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
