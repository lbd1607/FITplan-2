import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
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
              <h1 className="mb-10">Create a New Workout</h1>
            </div>
            <div className="input-container">
              <LabeledTextField name="workoutName" label="Workout Name" className="inputbox" />
            </div>
            <div className="input-container">
              <label className="formfieldlabel">Type</label>

              {/* <Field component="select" name="workoutType" label="Type" defaultValue={"resistance"}>
                <option value="resistance">Resistance</option>
                <option value="cardio">Cardio</option>
                <option value="endurance">Endurance</option>
              </Field> */}

              <Field name="workoutType" defaultValue={"resistance"}>
                {(props) => {
                  return (
                    <div>
                      {/* className={
                          props.selected === true ? "btn selectbtn selectedOption" : "btn selectbtn"
                        } */}
                      <button
                        {...props.input}
                        className="btn selectbtn"
                        name="cardio"
                        value="resistance"
                        type="button"
                        onClick={props.input.onChange}
                      >
                        <FontAwesomeIcon icon="dumbbell" size="lg" className="text-cyan-500 mr-1" />{" "}
                        Resistance
                      </button>
                      <button
                        {...props.input}
                        className="btn selectbtn"
                        name="cardio"
                        value="cardio"
                        type="button"
                        onClick={props.input.onChange}
                      >
                        <FontAwesomeIcon
                          icon="heartbeat"
                          size="lg"
                          className="text-pink-500 mr-1"
                        />{" "}
                        Cardio
                      </button>
                      <button
                        {...props.input}
                        className="btn selectbtn"
                        name="cardio"
                        value="endurance"
                        type="button"
                        onClick={props.input.onChange}
                      >
                        <FontAwesomeIcon icon="burn" size="lg" className="text-orange-500 mr-1" />{" "}
                        Endurance
                      </button>
                    </div>
                  )
                }}
              </Field>
            </div>
            <div className="input-container">
              <label className="formfieldlabel">Notes</label>
              <Field component="textarea" name="workoutNotes" label="Notes" className="inputbox" />
            </div>
          </div>
        </div>
      </Form>
    </>
  )
}
