import { Suspense } from "react"
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center ">
        <div className="card-container ">
          <div className="modal-card">
            <div className="cardcol">
              <div className="grid grid-cols-8">
                <h1 className="mb-5 col-span-7 pl-0">Create New Exercise</h1>
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
            </div>

            <ExerciseForm
              submitText="Save"
              cancelText="Cancel"
              cancelURL="/exercises"
              // TODO use a zod schema for form validation
              //  - Tip: extract mutation's schema into a shared `validations.ts` file and
              //         then import and use it here
              // schema={CreateExercise}
              // initialValues={{}}
              onSubmit={async (values) => {
                try {
                  const exercise = await createExerciseMutation(values)
                  /* router.push(`/exercises/${exercise.id}`) */
                  router.push("/exercises")
                } catch (error) {
                  //console.error(error)
                  if (!values.exName) {
                    return { [FORM_ERROR]: "Enter an exercise name." }
                  } else if (!values.exType) {
                    return { [FORM_ERROR]: "Select an exercise type." }
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

            {/*  <p>
        <Link href="/exercises">
          <a>Exercises</a>
        </Link>
      </p> */}
          </div>
        </div>
      </div>
    </Suspense>
  )
}

NewExercisePage.authenticate = true
NewExercisePage.getLayout = (page) => <Layout title={"Create New Exercise"}>{page}</Layout>

export default NewExercisePage
