import { useRef, useState } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { useQuery, useParam, useMutation } from "blitz"
import getWorkout from "app/workouts/queries/getWorkout"
import * as z from "zod"
import { Field } from "react-final-form"
import { Workout } from "app/pages/workouts/[workoutId]"
export { FORM_ERROR } from "app/core/components/Form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

export function ExerciseForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  // Sets up <Condition /> so when another field equals a certain value, the field inside the conditional tags is visible. Otherwise, the conditional field is hidden.
  const Condition = ({ when, is, children }) => (
    <Field name={when} subscription={{ value: true }}>
      {({ input: { value } }) => (value === is ? children : null)}
    </Field>
  )
  const a11yRef = useRef(null)
  const workoutId = useParam("workoutId", "number")
  //Must check to see if workoutId exists first or validation throws undefined id error
  if (!workoutId) {
    var thisWorkoutId = 0
  } else {
    const [workout] = useQuery(getWorkout, { id: workoutId })
    var thisWorkoutId = workout.id
  }
  //Must check editingId first, otherwise validation assumes undefined id and fails on create new
  if (!workoutId) {
    var currentState = "resistance"
  } else {
    const [editWorkout] = useQuery(getWorkout, { id: workoutId })
    var currentState = `${editWorkout.workoutType}` || "resistance"
  }

  //Set which button is selected onClickCapture, default is the default selection "resistance"; state is lifted to parent
  const [isSelected, setSelected] = useState(currentState)

  return (
    <>
      <Form<S> {...props}>
        {/* Pass the current workout id to exercises */}
        <Field
          name="workoutId"
          defaultValue={thisWorkoutId || null}
          component="input"
          hidden={true}
        />
        <div className="cardcol">
          <div className="mb-3">
            <div className="input-container required-field">
              <label className="formfieldlabel">Exercise Name</label>
              <LabeledTextField name="exName" label="" className="inputbox " aria-required="true" />
            </div>
            {/* <LabeledTextField name="exName" label="Exercise Name" /> */}

            <div className="input-container required-field">
              <label className="formfieldlabel">Type</label>
              <div className="dropdown-parent">
                <Field
                  component="select"
                  name="exType"
                  label="Type"
                  defaultValue={"interval"}
                  className="dropdown-field"
                >
                  <option value="interval">Interval</option>
                  <option value="reps">Repetition</option>
                  <option value="distance">Distance</option>
                  <option value="rest">Rest</option>
                </Field>
                <FontAwesomeIcon icon="caret-down" size="lg" className="dropdown-caret" />{" "}
              </div>

              <div>
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

            {/* <div className="div"> */}
            {/*  <label>Type</label>
              <Field component="select" name="exType" label="Type" defaultValue={"interval"}>
                <option value="interval">Interval</option>
                <option value="reps">Repetition</option>
                <option value="distance">Distance</option>
                <option value="rest">Rest</option>
              </Field> */}

            {/* <Condition when="exType" is="interval">
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
              </Condition> */}
            {/* </div> */}
            {/* <div className="div">
              <label>Notes</label>
              <Field component="textarea" name="exNotes" label="Notes" />
            </div> */}

            <div className="input-container">
              <label className="formfieldlabel">Notes</label>
              <Field component="textarea" name="exNotes" label="Notes" className="inputbox" />
            </div>
          </div>
        </div>
      </Form>
      {/*  <style jsx global>{`
        
      `}</style> */}
    </>
  )
}
