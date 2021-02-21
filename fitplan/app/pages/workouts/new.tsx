import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createWorkout from "app/workouts/mutations/createWorkout"
import { WorkoutForm, FORM_ERROR } from "app/workouts/components/WorkoutForm"

const NewWorkoutPage: BlitzPage = () => {
  const router = useRouter()
  const [createWorkoutMutation] = useMutation(createWorkout)

  return (
    <div className="card-container-parent">
      <div className="card-container">
        <div className="card">
          {/* <h1>Create New Workout</h1> */}

          <WorkoutForm
            submitText="Save"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreateWorkout}
            // initialValues={{}}
            onSubmit={async (values) => {
              try {
                const workout = await createWorkoutMutation(values)
                router.push(`/workouts/${workout.id}`)
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
          {/* <div className="grid justify-between"> */}
          <div className="rdiv">
            <button className="btn cancel">
              <Link href="/workouts">
                <a>Discard</a>
              </Link>
            </button>
          </div>

          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

NewWorkoutPage.authenticate = true
NewWorkoutPage.getLayout = (page) => <Layout title={"Create New Workout"}>{page}</Layout>

export default NewWorkoutPage
