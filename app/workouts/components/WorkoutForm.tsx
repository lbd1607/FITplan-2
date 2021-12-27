import { Suspense, useRef, useState } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import { useQuery, useParam, BlitzPage, Link } from "blitz"
import getWorkout from "app/workouts/queries/getWorkout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { v4 as uuid } from "uuid"
import { ExerciseForm } from "app/exercises/components/ExerciseForm"

export { FORM_ERROR } from "app/core/components/Form"

export function WorkoutForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const a11yRef = useRef(null)
  const editingId = useParam("workoutId", "number")
  //Must check editingId first, otherwise validation assumes undefined id and fails on create new
  if (!editingId) {
    var currentState = "resistance"
  } else {
    const [editWorkout] = useQuery(getWorkout, { id: editingId })
    var currentState = `${editWorkout.workoutType}` || "resistance"
  }
  //Set which button is selected onClickCapture, default is the default selection "resistance"; state is lifted to parent
  const [isSelected, setSelected] = useState(currentState)

  return (
    <>
      <Form<S> {...props}>
        <div className="cardcol">
          <div className="mb-3">
            <div className="input-container required-field">
              <label className="formfieldlabel">Workout Name</label>
              <LabeledTextField
                name="workoutName"
                label=""
                className="inputbox "
                aria-required="true"
              />
            </div>
            <div className="input-container required-field">
              <label className="formfieldlabel">Type</label>

              <Field name="workoutType" defaultValue={"resistance"} aria-required="true">
                {(props) => {
                  return (
                    <div className="workoutTypeGrid">
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
                      <button
                        {...props.input}
                        className={
                          isSelected === "flexibility"
                            ? "btn selectbtn selectedOption"
                            : "btn selectbtn"
                        }
                        name="flexibility"
                        value="flexibility"
                        type="button"
                        onClick={props.input.onChange}
                        onClickCapture={() => setSelected("flexibility")}
                        ref={a11yRef}
                      >
                        <FontAwesomeIcon icon="spa" size="lg" className="text-yellow-300 mr-1" />{" "}
                        Flexibility
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
            {/*   <div>
              <Suspense fallback={<div>Loading...</div>}>
                <ExerciseForm {...props} />
              </Suspense>
            </div> */}
          </div>
        </div>
      </Form>
    </>
  )
}
