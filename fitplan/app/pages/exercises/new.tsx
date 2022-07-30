import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createExercise from "./mutations/createExercise"
import { ExerciseForm, FORM_ERROR } from "app/pages/exercises/components/ExerciseForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { useContext } from "react"
import { FormContext } from "."

const NewExercisePage: BlitzPage = () => {
  const router = useRouter()
  const [createExerciseMutation] = useMutation(createExercise)

  const { setShow } = useContext(FormContext)

  return (
    <div className="flex items-center justify-center ">
      <div className="card-container m-0">
        <div className="modal-card">
          <div className="cardcol">
            <div className="grid grid-cols-8">
              <h1 className="col-span-7 mb-5 pl-0">Create New Exercise</h1>
              <Link href={Routes.ExercisesPage()}>
                <button
                  className="col-span-1 justify-end text-right"
                  onClick={() => setShow(false)}
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

          <ExerciseForm
            submitText="Create Exercise"
            cancelText="Cancel"
            cancelURL="/exercises"
            onSubmit={async (values) => {
              try {
                await createExerciseMutation(values)
                setShow(false)
                router.push(Routes.ExercisesPage())
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
            onCancel={async () => {
              setShow(false)
              try {
                router.push(Routes.ExercisesPage())
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
  )
}

NewExercisePage.authenticate = true
NewExercisePage.getLayout = (page) => <Layout title={"Create New Exercise"}>{page}</Layout>

export default NewExercisePage
