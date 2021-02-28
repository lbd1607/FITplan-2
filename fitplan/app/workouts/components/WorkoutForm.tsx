import { useRef, useState } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

export { FORM_ERROR } from "app/core/components/Form"

export function WorkoutForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const a11yRef = useRef(null)
  //Set which button is selected onClickCapture, default is the default selection "resistance"; state is lifted to parent
  const [isSelected, setSelected] = useState("resistance")

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

              <Field name="workoutType" defaultValue={"resistance"}>
                {(props) => {
                  return (
                    <div>
                      <button
                        {...props.input}
                        className={
                          isSelected === "resistance"
                            ? "btn selectbtn selectedOption"
                            : "btn selectbtn"
                        }
                        name="resistance"
                        value="resistance"
                        type="button"
                        onClick={props.input.onChange}
                        onClickCapture={() => setSelected("resistance")}
                        ref={a11yRef}
                      >
                        <FontAwesomeIcon icon="dumbbell" size="lg" className="text-cyan-500 mr-1" />{" "}
                        Resistance
                      </button>

                      <button
                        {...props.input}
                        className={
                          isSelected === "cardio" ? "btn selectbtn selectedOption" : "btn selectbtn"
                        }
                        name="cardio"
                        value="cardio"
                        type="button"
                        onClick={props.input.onChange}
                        onClickCapture={() => setSelected("cardio")}
                        ref={a11yRef}
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
                        className={
                          isSelected === "endurance"
                            ? "btn selectbtn selectedOption"
                            : "btn selectbtn"
                        }
                        name="endurance"
                        value="endurance"
                        type="button"
                        onClick={props.input.onChange}
                        onClickCapture={() => setSelected("endurance")}
                        ref={a11yRef}
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
