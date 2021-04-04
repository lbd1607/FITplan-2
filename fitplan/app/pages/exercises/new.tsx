import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createExercise from "app/exercises/mutations/createExercise"
import { ExerciseForm, FORM_ERROR } from "app/exercises/components/ExerciseForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

const NewExercisePage: BlitzPage = () => {
  const router = useRouter()
  const [createExerciseMutation] = useMutation(createExercise)

  return (
    <div>
      <h2>Create New Exercise</h2>

      <ExerciseForm
        submitText="OK"
        /*         cancelText="NO"
        cancelURL="/exercises" */
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateExercise}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const exercise = await createExerciseMutation(values)
            router.push(`/exercises/${exercise.id}`)
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

      {/*  <p>
        <Link href="/exercises">
          <a>Exercises</a>
        </Link>
      </p> */}
    </div>
  )
}

NewExercisePage.authenticate = true
NewExercisePage.getLayout = (page) => <Layout title={"Create New Exercise"}>{page}</Layout>

export default NewExercisePage
