import React, { useContext } from "react"
import { usePaginatedQuery, useRouter } from "blitz"
import getWorkouts from "../queries/getWorkouts"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { WorkoutFormContext } from "../../pages/workouts"

const ITEMS_PER_PAGE = 100

const WorkoutsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ workouts }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const { setEdit, setCurrentWorkoutId, setCreate } = useContext(WorkoutFormContext)

  const showPage = (id) => {
    setCurrentWorkoutId(id)
    setCreate(false)
    setEdit(true)
  }

  function getWorkoutIcon(worktype) {
    switch (worktype) {
      case "resistance":
        return <FontAwesomeIcon icon="dumbbell" size="lg" className="mr-4 ml-2 text-cyan-500 " />
      case "cardio":
        return <FontAwesomeIcon icon="heartbeat" size="lg" className="mr-4 ml-3 text-pink-500 " />
      case "endurance":
        return <FontAwesomeIcon icon="burn" size="lg" className="mr-5 ml-3 text-orange-500 " />
      case "flexibility":
        return <FontAwesomeIcon icon="spa" size="lg" className="mr-5 ml-2 text-yellow-300 " />
      default:
        break
    }
  }

  if (workouts.length <= 0) {
    return <div className="m-4 pl-6">No workouts to show ...</div>
  } else
    return (
      <div className="mt-1 flex-1 list-none pt-12">
        <ul>
          {workouts.map((workout) => (
            <button
              className="itemrow flex w-full place-items-center items-start"
              onClick={() => showPage(workout.id)}
              key={workout.id}
            >
              <li className=" " key={workout.id}>
                {getWorkoutIcon(workout.workoutType)} {workout.workoutName}
              </li>
            </button>
          ))}
        </ul>
      </div>
    )
}

export default WorkoutsList
