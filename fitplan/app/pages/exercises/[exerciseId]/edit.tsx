import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercise from "app/exercises/queries/getExercise"
import updateExercise from "app/exercises/mutations/updateExercise"
import { ExerciseForm, FORM_ERROR } from "app/exercises/components/ExerciseForm"

export const EditExercise = () => {
  const router = useRouter()
  const exerciseId = useParam("exerciseId", "number")
  const [exercise, { setQueryData }] = useQuery(getExercise, { id: exerciseId })
  const [updateExerciseMutation] = useMutation(updateExercise)

  return (
    <>
      <Head>
        <title>Edit {exercise.exName}</title>
      </Head>

      <div>
        <h1>Edit {exercise.exName}</h1>
        <pre>{JSON.stringify(exercise)}</pre>

        <ExerciseForm
          submitText="Update Exercise"
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
        />
      </div>
    </>
  )
}

const EditExercisePage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditExercise />
      </Suspense>

      <p>
        <Link href="/exercises">
          <a>Exercises</a>
        </Link>
      </p>
    </div>
  )
}

EditExercisePage.authenticate = true
EditExercisePage.getLayout = (page) => <Layout>{page}</Layout>

export default EditExercisePage
