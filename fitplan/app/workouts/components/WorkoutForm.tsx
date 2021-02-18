import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
export { FORM_ERROR } from "app/core/components/Form"

export function WorkoutForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <div className="flex content-center items-center  h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0 mt-6">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="mb-3">
                <div>
                  <h1>Create a New Workout</h1>
                </div>
                <div className="div">
                  <LabeledTextField
                    name="workoutName"
                    label="Workout Name"
                    className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full"
                  />
                </div>
                <div className="div">
                  <label>Type</label>
                  <Field
                    component="select"
                    name="workoutType"
                    label="Type"
                    defaultValue={"resistance"}
                  >
                    <option value="resistance">Resistance</option>
                    <option value="cardio">Cardio</option>
                    <option value="endurance">Endurance</option>
                  </Field>
                </div>
                <div>
                  <label>Notes</label>
                  <Field component="textarea" name="workoutNotes" label="Notes" />
                </div>
              </div>
              {/* <div style={{ fontSize: "12px" }}> */}
              <div>
                You got this!
                <FontAwesomeIcon icon="heartbeat" size="2x" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}
