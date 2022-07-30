import React from "react"
import { Link, usePaginatedQuery, useRouter, Routes } from "blitz"
import "@fortawesome/fontawesome-svg-core/styles.css"
import getExercises from "./queries/getExercises"

const ITEMS_PER_PAGE = 100

const ExercisesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ exercises }] = usePaginatedQuery(getExercises, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  if (exercises.length <= 0) {
    return <div className="m-4 pl-6">No exercises to show ...</div>
  } else
    return (
      <div>
        <ul>
          {exercises.map((exercise) => (
            <Link href={Routes.ShowExercisePage({ exerciseId: exercise.id })} key={exercise.id}>
              <li className="itemrow pl-10">
                <a>{exercise.exName}</a>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
}

export default ExercisesList
