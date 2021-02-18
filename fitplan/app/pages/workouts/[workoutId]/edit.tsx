import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkout from "app/workouts/queries/getWorkout"
import updateWorkout from "app/workouts/mutations/updateWorkout"
import { WorkoutForm, FORM_ERROR } from "app/workouts/components/WorkoutForm"

export const EditWorkout = () => {
  const router = useRouter()
  const workoutId = useParam("workoutId", "number")
  const [workout, { setQueryData }] = useQuery(getWorkout, { id: workoutId })
  const [updateWorkoutMutation] = useMutation(updateWorkout)

  return (
    <>
      <Head>
        <title>Edit {workout.workoutName}</title>
      </Head>

      <div>
        <h1>Edit {workout.workoutName}</h1>
        <pre>{JSON.stringify(workout)}</pre>

        <WorkoutForm
          submitText="Update Workout"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateWorkout}
          initialValues={workout}
          onSubmit={async (values) => {
            try {
              const updated = await updateWorkoutMutation({
                id: workout.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(`/workouts/${updated.id}`)
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditWorkoutPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditWorkout />
      </Suspense>

      <p>
        <Link href="/workouts">
          <a>Workouts</a>
        </Link>
      </p>
    </div>
  )
}

EditWorkoutPage.authenticate = true
EditWorkoutPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditWorkoutPage
