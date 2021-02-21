import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Link } from "blitz"
import * as z from "zod"
import { Field } from "react-final-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

export { FORM_ERROR } from "app/core/components/Form"

export function WorkoutForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <>
      <Form<S> {...props}>
        <div className="rounded-t mb-0 px-6 py-6">
          <div className="mb-3">
            <div>
              <h1>Create a New Workout</h1>
            </div>
            <div className="input-container">
              <LabeledTextField name="workoutName" label="Workout Name" />
            </div>
            <div className="input-container">
              <label>Type</label>

              <Field component="select" name="workoutType" label="Type" defaultValue={"resistance"}>
                <option value="resistance">Resistance</option>
                <option value="cardio">Cardio</option>
                <option value="endurance">Endurance</option>
              </Field>
            </div>
            <div className="input-container">
              <label>Notes</label>
              <Field component="textarea" name="workoutNotes" label="Notes" />
            </div>
          </div>
          <p>
            You got this!
            <FontAwesomeIcon icon="heartbeat" size="2x" />
          </p>
        </div>
      </Form>
    </>
  )
}
