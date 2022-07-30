import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercise from "../queries/getExercise"
import { ExerciseForm, FORM_ERROR } from "app/pages/exercises/components/ExerciseForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import updateExercise from "../mutations/updateExercise"

export const EditExercise = () => {
  const router = useRouter()
  const exerciseId = useParam("exerciseId", "number")
  const [exercise, { setQueryData }] = useQuery(
    getExercise,
    { id: exerciseId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateExerciseMutation] = useMutation(updateExercise)

  //Get rate, such as time, reps, or distance, based on the exercise type passed from
  function getExTypeRates(exType) {
    switch (exType) {
      case "interval":
        return <p className="formfieldlabel">Time: {exercise.exInterval ?? "None"}</p>
      case "reps":
        return <p className="formfieldlabel">Reps: {exercise.exReps ?? "None"}</p>
      case "distance":
        return <p className="formfieldlabel">Distance: {exercise.exDistance ?? "None"}</p>
      case "rest":
        return <p className="formfieldlabel">Rest: {exercise.exRest ?? "None"}</p>
      case "":
        return <p className="formfieldlabel">None</p>
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <title>Edit Exercise {exercise.exName}</title>
      </Head>

      <div className="card-container-parent">
        <div className="card-container">
          <div className="card">
            <div className="my-6 px-6 ">
              <div className="grid grid-cols-8">
                <h1 className="col-span-7 mb-10">Edit {exercise.exName}</h1>
                <Link href={Routes.ExercisesPage()}>
                  <span className="col-span-1 justify-end text-right">
                    <FontAwesomeIcon
                      icon="times"
                      size="lg"
                      className="mr-1 cursor-pointer text-slate-500"
                    />
                  </span>
                </Link>
              </div>

              <p className="formfieldlabel capitalize">Type: {exercise.exType}</p>
              <span>{getExTypeRates(exercise.exType) ?? "None"}</span>

              <p className="formfieldlabel">Notes: {exercise.exNotes ?? "None"}</p>
            </div>

            <div className="px-8">
              {" "}
              <ExerciseForm
                submitText="Save Changes"
                cancelText="Cancel"
                cancelURL="/exercises"
                initialValues={exercise}
                onSubmit={async (values) => {
                  try {
                    const updated = await updateExerciseMutation({
                      id: exercise.id,
                      ...values,
                    })
                    await setQueryData(updated)
                    router.push(Routes.ShowExercisePage({ exerciseId: updated.id }))
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

const EditExercisePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<LoadingAnimation />}>
        <EditExercise />
      </Suspense>
    </div>
  )
}

EditExercisePage.authenticate = true
EditExercisePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditExercisePage
