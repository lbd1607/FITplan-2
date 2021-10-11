import { Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getWorkout from "app/workouts/queries/getWorkout"
import updateWorkout from "app/workouts/mutations/updateWorkout"
import { WorkoutForm, FORM_ERROR } from "app/workouts/components/WorkoutForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

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

      <div className="card-container-parent">
        <div className="card-container">
          <div className="card">
            <div className="my-6 px-6">
              <div className="grid grid-cols-8">
                <h1 className="mb-10 col-span-7">Edit {workout.workoutName}</h1>
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
              {/*  <p className="">ID: {workout.id}</p> */}
              <p className="capitalize ">Type: {workout.workoutType}</p>
              <p className="">Notes: {workout.workoutNotes || "None"}</p>
              <p className="">Plan: {workout.planId || "None"}</p>
              {/* <pre>{JSON.stringify(workout)}</pre> */}
            </div>

            <div className="px-8">
              <WorkoutForm
                submitText="Save"
                cancelText="Cancel"
                cancelURL="/workouts"
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
