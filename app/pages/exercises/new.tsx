import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createExercise from "app/exercises/mutations/createExercise"
import { ExerciseForm, FORM_ERROR } from "app/exercises/components/ExerciseForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

const NewExercisePage: BlitzPage = () => {
  const router = useRouter()
  const [createExerciseMutation] = useMutation(createExercise)

  return (
    <div className="flex items-center justify-center ">
      <div className="card-container m-0">
        <div className="modal-card">
          <div className="cardcol">
            <div className="grid grid-cols-8">
              <h1 className="mb-5 col-span-7 pl-0">Create New Exercise</h1>
              <Link href={Routes.ExercisesPage()}>
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

          <div className="px-8">
            {" "}
            <ExerciseForm
              submitText="Create Exercise"
              cancelText="Cancel"
              cancelURL="/exercises"
              // TODO use a zod schema for form validation
              //  - Tip: extract mutation's schema into a shared `validations.ts` file and
              //         then import and use it here
              // schema={CreateExercise}
              // initialValues={{}}
              onSubmit={async (values) => {
                try {
                  await createExerciseMutation(values)
                  router.push(Routes.ExercisesPage())
                } catch (error: any) {
                  console.error(error)
                  return {
                    [FORM_ERROR]: error.toString(),
                  }
                }
              }}
              onCancel={async () => {
                try {
                  Routes.ExercisesPage()
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

      {/*  <p>
        <Link href={Routes.ExercisesPage()}>
          <a>Exercises</a>
        </Link>
      </p> */}
    </div>
  )
}

NewExercisePage.authenticate = true
NewExercisePage.getLayout = (page) => <Layout title={"Create New Exercise"}>{page}</Layout>

export default NewExercisePage
