import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getExercise from "app/exercises/queries/getExercise"
import deleteExercise from "app/exercises/mutations/deleteExercise"

export const Exercise = () => {
  const router = useRouter()
  const exerciseId = useParam("exerciseId", "number")
  const [deleteExerciseMutation] = useMutation(deleteExercise)
  const [exercise] = useQuery(getExercise, { id: exerciseId })

  return (
    <>
      <Head>
        <title>{exercise.exName}</title>
      </Head>

      <div>
        <h1>{exercise.exName}</h1>
        <pre>{JSON.stringify(exercise, null, 2)}</pre>

        <Link href={`/exercises/${exercise.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteExerciseMutation({ id: exercise.id })
              router.push("/exercises")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowExercisePage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/exercises">
          <a>Exercises</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Exercise />
      </Suspense>
    </div>
  )
}

ShowExercisePage.authenticate = true
ShowExercisePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowExercisePage
