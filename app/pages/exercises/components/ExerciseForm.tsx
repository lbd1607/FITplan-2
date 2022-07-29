import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { useQuery, useParam } from "blitz"
import * as z from "zod"
import { Field } from "react-final-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import getWorkout from "app/pages/workouts/queries/getWorkout"
export { FORM_ERROR } from "app/core/components/Form"

export function ExerciseForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  // Sets up <Condition /> so when another field equals a certain value, the field inside the conditional tags is visible. Otherwise, the conditional field is hidden.
  const Condition = ({ when, is, children }) => (
    <Field name={when} subscription={{ value: true }}>
      {({ input: { value } }) => (value === is ? children : null)}
    </Field>
  )

  const workoutId = useParam("workoutId", "number")
  const [workout] = useQuery(getWorkout, { id: workoutId }, { enabled: false })
  const currentWorkoutId = workout?.id ?? 0

  return (
    <>
      <Form<S> {...props}>
        {/* Pass the current workout id to exercises */}
        <Field
          name="workoutId"
          defaultValue={currentWorkoutId || null}
          component="input"
          hidden={true}
        />
        <div className="cardcol">
          <div className="mb-3">
            <div className="input-container required-field">
              <label className="formfieldlabel">Exercise Name</label>
              <LabeledTextField name="exName" label="" className="inputbox " aria-required="true" />
            </div>
            <div className="input-container required-field">
              <label className="formfieldlabel">Type</label>
              <div className="dropdown-parent">
                <Field
                  component="select"
                  name="exType"
                  label="Type"
                  defaultValue={"interval"}
                  className="dropdown-field"
                  aria-required="true"
                >
                  <option value="interval">Interval</option>
                  <option value="reps">Repetition</option>
                  <option value="distance">Distance</option>
                  <option value="rest">Rest</option>
                </Field>
                <FontAwesomeIcon icon="caret-down" size="lg" className="dropdown-caret" />{" "}
              </div>

              <div aria-required="true">
                <Condition when="exType" is="interval">
                  <label className="formfieldlabel">Time</label>
                  <Field name="exInterval" component="input" type="text" className="inputbox" />
                </Condition>
                <Condition when="exType" is="reps">
                  <label className="formfieldlabel">Reps</label>
                  <Field name="exReps" component="input" type="text" className="inputbox" />
                </Condition>
                <Condition when="exType" is="distance">
                  <label className="formfieldlabel">Distance</label>
                  <Field name="exDistance" component="input" type="text" className="inputbox" />
                </Condition>
                <Condition when="exType" is="rest">
                  <label className="formfieldlabel">Time</label>
                  <Field name="exRest" component="input" type="text" className="inputbox" />
                </Condition>
              </div>
            </div>
            <div className="input-container">
              <label className="formfieldlabel">Notes</label>
              <Field component="textarea" name="exNotes" label="Notes" className="inputbox" />
            </div>
          </div>
        </div>
      </Form>
    </>
  )
}
