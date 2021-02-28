import React, { Suspense } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import getWorkouts from "app/workouts/queries/getWorkouts"
import { useQuery, useParam, usePaginatedQuery, useRouter } from "blitz"
export { FORM_ERROR } from "app/core/components/Form"

// Use these to get workouts after .map bug fixed for useQuery
// const workoutId = useParam("workoutId", "number")
// const [workouts] = useQuery(getWorkouts, { where: { id: workoutId } })

export function PlanFormFields<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  //console.log(props)
  const [{ workouts }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  let defaultWorkout = workouts.map((workout) => workout.workoutName)

  return (
    <Form<S> {...props}>
      <div className="card">
        <LabeledTextField name="planName" label="Plan Name" />
        <div>
          <label>Days of the Week</label>
          <fieldset>
            {"Monday"}
            <Field name="days" component="input" value="Monday" type="checkbox" />

            {"Tuesday"}
            <Field name="days" value="Tuesday" component="input" type="checkbox" />

            {"Wednesday"}
            <Field name="days" value="Wednesday" component="input" type="checkbox" />

            {"Thursday"}
            <Field name="days" value="Thursday" component="input" type="checkbox" />

            {"Friday"}
            <Field name="days" value="Friday" component="input" type="checkbox" />

            {"Saturday"}
            <Field name="days" value="Saturday" component="input" type="checkbox" />

            {"Sunday"}
            <Field name="days" value="Sunday" component="input" type="checkbox" />
          </fieldset>
        </div>
        <div>
          <label>Workouts</label>

          <Field component="select" name="workouts" defaultValue={defaultWorkout[0]}>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.workoutName}>
                {workout.workoutName}
              </option>
            ))}
          </Field>
        </div>
      </div>
    </Form>
  )
}

export function PlanForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <PlanFormFields<S> {...props} />
      </Suspense>
    </div>
  )
}
