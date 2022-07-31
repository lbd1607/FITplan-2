import { Suspense, useContext } from "react"
import { Head, Link, useRouter, useQuery, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"

import { WorkoutForm, FORM_ERROR } from "app/pages/workouts/components/WorkoutForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import getWorkout from "../queries/getWorkout"
import updateWorkout from "../mutations/updateWorkout"
import { WorkoutFormContext } from ".."
import deleteWorkout from "../mutations/deleteWorkout"

export const EditWorkout = ({ workoutId }) => {
  const router = useRouter()
  const [workout, { setQueryData }] = useQuery(
    getWorkout,
    { id: workoutId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateWorkoutMutation] = useMutation(updateWorkout)

  const { setEdit } = useContext(WorkoutFormContext)

  const [deleteWorkoutMutation] = useMutation(deleteWorkout)

  return (
    <>
      <Head>
        <title>Edit {workout.workoutName}</title>
      </Head>
      <div className="items-center justify-center">
        <div className="card-container m-0">
          <div className="modal-card">
            <button
              className="btn delete border-none w-fit px-3 py-1 absolute top-12 mt-0.5"
              type="button"
              onClick={async () => {
                if (window.confirm("Delete from Workouts?")) {
                  await deleteWorkoutMutation({ id: workout.id })
                  setEdit(false)
                  router.push(Routes.WorkoutsPage())
                }
              }}
            >
              <FontAwesomeIcon icon="trash" size="1x" className=" cursor-pointer" />
            </button>

            <div className="cardcol">
              <div className="grid grid-cols-8 content-center">
                <div className="col-span-7 inline-flex">
                  <h1 className="">{workout.workoutName}</h1>
                </div>
                <Link href={Routes.WorkoutsPage()}>
                  <button
                    className="col-span-1 justify-end text-right pl-5"
                    onClick={() => setEdit(false)}
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

            <div className="px-8">
              <WorkoutForm
                submitText="Save Changes"
                cancelText="Cancel"
                cancelURL="/workouts"
                initialValues={workout}
                onSubmit={async (values) => {
                  try {
                    const updated = await updateWorkoutMutation({
                      id: workout.id,
                      workoutName: values.workoutName,
                      workoutType: values.workoutType,
                      workoutNotes:
                        values.workoutNotes === undefined || values.workoutNotes === null
                          ? ""
                          : values.workoutNotes,
                    })
                    await setQueryData(updated)
                    router.push(Routes.WorkoutsPage())
                    setEdit(false)
                  } catch (error: any) {
                    if (!values.workoutName) {
                      return { [FORM_ERROR]: "Enter a workout name." }
                    } else if (!values.workoutType) {
                      return { [FORM_ERROR]: "Select a workout type." }
                    } else {
                      return "An unknown error occurred."
                    }
                  }
                }}
                onCancel={async () => {
                  setEdit(false)
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
      </div>
    </>
  )
}

const EditWorkoutPage = ({ workoutId }) => {
  return (
    <div>
      <Suspense fallback={""}>
        <EditWorkout workoutId={workoutId} />
      </Suspense>
    </div>
  )
}

EditWorkoutPage.authenticate = true
EditWorkoutPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditWorkoutPage
