import React, { Suspense, useState, useRef } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import getWorkouts from "app/workouts/queries/getWorkouts"
import { usePaginatedQuery, useQuery, useParam } from "blitz"
export { FORM_ERROR } from "app/core/components/Form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { OnChange } from "react-final-form-listeners"

export function PlanFormFields<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [{ workouts }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  const randid = () => {
    var i = () => {
      return ((1 + Math.random()) * 0x10000) | 0
    }
    const daygroupid = i() + i() + i() + i() + i() + i()
    return daygroupid
  }

  const [workoutInputs, setInputFields] = useState([{ id: randid(), workouts: "" }])

  const [dayInputs, setDayInputs] = useState([{ id: randid(), days: [""] }])

  const handleDayChange = (value, id) => {
    const newInputFields = dayInputs.map((item) => {
      return { id: item.id, days: value }
    })

    setDayInputs(newInputFields)
  }

  /*  const handleWorkoutChange = (workoutId, newval) => {
    const newInputFields = workoutInputs.map((workoutObj) => {
      if (workoutId === workoutObj.id) {
        workoutObj[workoutId] = newval
      }
      return workoutObj
    })
    setInputFields(newInputFields)
    console.log(newInputFields)
  } */

  const handleWorkoutChange = (fieldId, event) => {
    const newInputFields = workoutInputs.map((item) => {
      if (fieldId === item.id) {
        item[event.target.name] = event.target.value
      }
      return item
    })

    setInputFields(newInputFields)
    console.log(newInputFields)
  }

  const addAnotherWorkout = () => {
    setInputFields([...workoutInputs, { id: randid(), workouts: "" }])
  }

  const removeWorkout = (id) => {
    const values = [...workoutInputs]
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    )
    setInputFields(values)
  }

  return (
    <Form<S> {...props}>
      <>
        <div className="modal-card-container-parent mb-10">
          <div className="card p-0 shadow-none mb-0">
            <div className="inner-scroll-parent">
              <div className="inner-scroll mt-0 py-0">
                <div className="cardcol py-0">
                  <div className="">
                    <label className="formfieldlabel">Plan Name </label>
                    <Field
                      component="input"
                      name="planName"
                      className="inputbox required-field"
                      aria-required="true"
                    />

                    {workoutInputs.map((workoutInput) => (
                      <div key={workoutInput.id}>
                        <div className="border p-4 mt-6" key={workoutInput.id}>
                          <div className="input-container mb-1">
                            <div className="input-container">
                              <label className="formfieldlabel">Days of the Week</label>
                              <fieldset className="grid grid-flow-col">
                                <div className="dayParent">
                                  <Field
                                    name="days"
                                    value="Monday"
                                    id="mon"
                                    component="input"
                                    type="checkbox"
                                    className="noCheckbox"
                                  />

                                  <OnChange name="days">
                                    {(event, workoutInput) => {
                                      handleDayChange(event, workoutInput.id)
                                    }}
                                  </OnChange>
                                  <label htmlFor="mon" className="daysChip ">
                                    {" "}
                                    M
                                  </label>
                                </div>
                              </fieldset>
                            </div>

                            <div className="input-container required-field">
                              <label className="formfieldlabel">Workouts</label>

                              <div>
                                <div className="dropdown-parent">
                                  <Field name="workouts" type="select">
                                    {(workoutInputs) => (
                                      <div>
                                        <select
                                          name={workoutInputs.input.name}
                                          className="dropdown-field"
                                          key={workoutInput.id}
                                          value={workoutInputs.input.value[0]}
                                          // value={if using built in onchange and calling custom handler onchangecapture[workoutInputs.input.value]}
                                          // onChange={workoutInputs.input.onChange}
                                          onChange={(e) => {
                                            handleWorkoutChange(workoutInput.id, e)
                                          }}
                                          multiple
                                        >
                                          {workouts.map((workout) => (
                                            <option
                                              key={workout.id}
                                              value={workout.workoutName}
                                              label={workout.workoutName}
                                              defaultValue={workout.workoutName[0] || []}
                                            ></option>
                                          ))}
                                        </select>
                                      </div>
                                    )}
                                  </Field>
                                  {/* <OnChange name="workouts">
                                    {(value) => {
                                      handleWorkoutChange(workoutInput.id, value)
                                    }}
                                  </OnChange> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          disabled={workoutInputs.length === 1}
                          onClick={() => removeWorkout(workoutInput.id)}
                          type="button"
                        >
                          <FontAwesomeIcon icon="minus-circle" size="lg" className="deleteicon" />
                        </button>
                        <button onClick={addAnotherWorkout} type="button">
                          <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
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
