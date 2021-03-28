import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { useQuery, useParam, useMutation } from "blitz"
import getWorkout from "app/workouts/queries/getWorkout"
import * as z from "zod"
import { Field } from "react-final-form"
import { Workout } from "app/pages/workouts/[workoutId]"
export { FORM_ERROR } from "app/core/components/Form"

export function ExerciseForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  // Sets up <Condition /> so when another field equals a certain value, the field inside the conditional tags is visible. Otherwise, the conditional field is hidden.
  const Condition = ({ when, is, children }) => (
    <Field name={when} subscription={{ value: true }}>
      {({ input: { value } }) => (value === is ? children : null)}
    </Field>
  )
  const workoutId = useParam("workoutId", "number")
  const [workout] = useQuery(getWorkout, { id: workoutId })
  return (
    <Form<S> {...props}>
      <div className="card">
        <p>Workout Id: {workout.id || "none"}</p>

        {/* Pass the current workout id to exercises */}
        <Field
          name="workoutId"
          defaultValue={workoutId || "none"}
          component="input"
          hidden="true"
        />

        <LabeledTextField name="exName" label="Exercise Name" />

        <div className="div">
          <label>Type</label>
          <Field component="select" name="exType" label="Type" defaultValue={"interval"}>
            <option value="interval">Interval</option>
            <option value="reps">Repetition</option>
            <option value="distance">Distance</option>
            <option value="rest">Rest</option>
          </Field>
          <Condition when="exType" is="interval">
            <label>Time</label>
            <Field name="exInterval" component="input" type="text" />
          </Condition>
          <Condition when="exType" is="reps">
            <label>Number of Repetitions</label>
            <Field name="exReps" component="input" type="text" />
          </Condition>
          <Condition when="exType" is="distance">
            <label>Distance</label>
            <Field name="exDistance" component="input" type="text" />
          </Condition>
          <Condition when="exType" is="rest">
            <label>Time</label>
            <Field name="exRest" component="input" type="text" />
          </Condition>
        </div>
        <div className="div">
          <label>Notes</label>
          <Field component="textarea" name="exNotes" label="Notes" />
        </div>
      </div>
    </Form>
  )
}
