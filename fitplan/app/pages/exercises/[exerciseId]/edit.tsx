import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercise from "app/exercises/queries/getExercise"
import updateExercise from "app/exercises/mutations/updateExercise"
import { ExerciseForm, FORM_ERROR } from "app/exercises/components/ExerciseForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

export const EditExercise = () => {
  const router = useRouter()
  const exerciseId = useParam("exerciseId", "number")
  const [exercise, { setQueryData }] = useQuery(getExercise, { id: exerciseId })
  const [updateExerciseMutation] = useMutation(updateExercise)

  //Get rate, such as time, reps, or distance, based on the exercise type passed from
  function getExTypeRates(exType) {
    switch (exType) {
      case "interval":
        return <p className="formfieldlabel">Time: {exercise.exInterval || "None"}</p>
      case "reps":
        return <p className="formfieldlabel">Reps: {exercise.exReps || "None"}</p>
      case "distance":
        return <p className="formfieldlabel">Distance: {exercise.exDistance || "None"}</p>
      case "rest":
        return <p className="formfieldlabel">Rest: {exercise.rest || "None"}</p>
      case "":
        return <p className="formfieldlabel">"None"</p>
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <title>Edit {exercise.exName}</title>
      </Head>

      <div className="card-container-parent">
        <div className="card-container">
          <div className="card">
            <div className="my-6 px-6 ">
              <div className="grid grid-cols-8">
                <h1 className="mb-10 col-span-7">Edit {exercise.exName}</h1>
                <Link href="/exercises">
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="text-gray-500 cursor-pointer mr-1"
                    />
                  </span>
                </Link>
              </div>
              {/* <p className="formfieldlabel">ID: {exercise.id}</p> */}
              <p className="formfieldlabel capitalize">Type: {exercise.exType}</p>
              <span>{getExTypeRates(exercise.exType) || "None"}</span>
              {/* <p className="capitalize formfieldlabel">
                Type: {getWorkoutIcon(workout.workoutType)} {workout.workoutType}
              </p> */}

              <p className="formfieldlabel">Notes: {exercise.exNotes || "None"}</p>
              {/* <p className="formfieldlabel">Workout ID: {exercise.workoutId || "None"}</p> */}
            </div>
            {/* <div>
              <h1>Edit {exercise.exName}</h1>
              <pre>{JSON.stringify(exercise)}</pre> */}
            <div className="px-8">
              {" "}
              <ExerciseForm
                submitText="Save"
                cancelText="Cancel"
                cancelURL="/exercises"
                // TODO use a zod schema for form validation
                //  - Tip: extract mutation's schema into a shared `validations.ts` file and
                //         then import and use it here
                // schema={UpdateExercise}
                initialValues={exercise}
                onSubmit={async (values) => {
                  try {
                    const updated = await updateExerciseMutation({
                      id: exercise.id,
                      ...values,
                    })
                    await setQueryData(updated)
                    router.push(`/exercises/${updated.id}`)
                  } catch (error) {
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
      {/* </div> */}
    </>
  )
}

const EditExercisePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditExercise />
      </Suspense>

      {/*  <p>
        <Link href="/exercises">
          <a>Exercises</a>
        </Link>
      </p> */}
    </div>
  )
}

EditExercisePage.authenticate = true
EditExercisePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditExercisePage
