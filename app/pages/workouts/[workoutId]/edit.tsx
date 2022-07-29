import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkout from "app/workouts/queries/getWorkout"
import updateWorkout from "app/workouts/mutations/updateWorkout"
import { WorkoutForm, FORM_ERROR } from "app/workouts/components/WorkoutForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

export const EditWorkout = () => {
  const router = useRouter()
  const workoutId = useParam("workoutId", "number")
  const [workout, { setQueryData }] = useQuery(
    getWorkout,
    { id: workoutId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateWorkoutMutation] = useMutation(updateWorkout)

  return (
    <>
      <Head>
        <title>Edit {workout.workoutName}</title>
      </Head>

      <div className="card-container-parent">
        <div className="card-container">
          <div className="card">
            <div className="my-6 px-6">
              <div className="grid grid-cols-8">
                <h1 className="col-span-7 mb-10">Edit {workout.workoutName}</h1>
                <Link href={Routes.WorkoutsPage()}>
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="mr-1 cursor-pointer text-gray-500"
                    />
                  </span>
                </Link>
              </div>
              <p className="capitalize ">Type: {workout.workoutType}</p>
              <p className="">Notes: {workout.workoutNotes || "None"}</p>
              <p className="">Plan: {workout.planId || "None"}</p>
            </div>

            <div className="px-8">
              <WorkoutForm
                submitText="Update Workout"
                cancelText="Cancel"
                cancelURL="/workouts"
                initialValues={workout}
                onSubmit={async (values) => {
                  try {
                    const updated = await updateWorkoutMutation({
                      id: workout.id,
                      ...values,
                    })
                    await setQueryData(updated)
                    router.push(Routes.ShowWorkoutPage({ workoutId: updated.id }))
                  } catch (error: any) {
                    console.error(error)
                    return {
                      [FORM_ERROR]: error.toString(),
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
    </div>
  )
}

EditWorkoutPage.authenticate = true
EditWorkoutPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditWorkoutPage
