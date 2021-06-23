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

function DayGroup() {
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

  // const [workoutInputs, setInputFields] = useState([{ id: randid(), workouts: "", days: [""] }])
  const [workoutInputs, setInputFields] = useState([{ id: randid(), workouts: "" }])

  const [dayInputs, setDayInputs] = useState([{ id: randid(), days: [""] }])

  const handleWorkoutChange = (value, id) => {
    const newInputFields = workoutInputs.map((item) => {
      // if (id === item.id) {
      // i[e.target.name] = e.target.value
      // }
      //  (i.id === id) ? {...i, value: !i} : i

      //setInputFields({ ...workoutInputs, [item.id]: value })

      // return value

      return { id: item.id, workouts: value }
    })
    //setInputFields({ ...workoutInputs, [item.id]: value })
    // })

    setInputFields(newInputFields)
    //setInputFields(value)
    console.log(newInputFields)
    //console.log(value)
  }

  const handleDayChange = (value, id) => {
    const newInputFields = dayInputs.map((item) => {
      return { id: item.id, days: value }
    })

    setDayInputs(newInputFields)
  }
  const addAnotherWorkout = () => {
    // setInputFields([...workoutInputs, { id: randid(), workouts: "", days: [""] }])
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
                          {/*  <label className="formfieldlabel">s{workoutInput.id}</label>
                          <input
                            name="s"
                            className="inputbox required-field"
                            onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                            aria-required="true"
                          /> */}

                          <div className="input-container">
                            <label className="formfieldlabel">Days of the Week</label>
                            <fieldset className="grid grid-flow-col">
                              {/*     <Field name="days" type="checkbox"> */}
                              {/*     {(props) => {
                                  return ( */}
                              {/*   <div className="dayParent">
                                <input
                               
                                  name="days"
                                  value="Monday"
                                  id="mon"
                                  className="noCheckbox"
                                  type="checkbox"
                                
                                  onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                                  key={workoutInput.id}
                                />
                                <label htmlFor="mon" className="daysChip ">
                                  {" "}
                                  M
                                </label>
                              </div> */}

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
                                  {(value, workoutInput) => {
                                    handleDayChange(value, workoutInput.id)
                                  }}
                                </OnChange>
                                <label htmlFor="mon" className="daysChip ">
                                  {" "}
                                  M
                                </label>
                              </div>

                              {/*     )
                                }} */}
                              {/*      </Field> */}
                              {/* <div className="dayParent">
                                <input
                                  name="days"
                                  value="Tuesday"
                                  id="tue"
                                  type="checkbox"
                                  className="noCheckbox"
                                  onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                                />
                                <label htmlFor="tue" className="daysChip ">
                                  {" "}
                                  Tu
                                </label>
                              </div>

                              <div className="dayParent">
                                <input
                                  name="days"
                                  value="Wednesday"
                                  id="wed"
                                  type="checkbox"
                                  className="noCheckbox"
                                  onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                                />
                                <label htmlFor="wed" className="daysChip ">
                                  {" "}
                                  W
                                </label>
                              </div>

                              <div className="dayParent">
                                <input
                                  name="days"
                                  value="Thursday"
                                  id="thu"
                                  type="checkbox"
                                  className="noCheckbox"
                                  onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                                />
                                <label htmlFor="thu" className="daysChip ">
                                  {" "}
                                  Th
                                </label>
                              </div>

                              <div className="dayParent">
                                <input
                                  name="days"
                                  value="Friday"
                                  id="fri"
                                  type="checkbox"
                                  className="noCheckbox"
                                  onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                                />
                                <label htmlFor="fri" className="daysChip ">
                                  {" "}
                                  F
                                </label>
                              </div>

                              <div className="dayParent">
                                <input
                                  name="days"
                                  value="Saturday"
                                  id="sat"
                                  type="checkbox"
                                  className="noCheckbox"
                                  onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                                />
                                <label htmlFor="sat" className="daysChip ">
                                  {" "}
                                  Sa
                                </label>
                              </div>

                              <div className="dayParent">
                                <input
                                  name="days"
                                  value="Sunday"
                                  id="sun"
                                  type="checkbox"
                                  className="noCheckbox"
                                  onChange={(e) => handleWorkoutChange(workoutInput.id, e)}
                                />
                                <label htmlFor="sun" className="daysChip ">
                                  {" "}
                                  Su
                                </label>
                              </div> */}
                            </fieldset>
                          </div>

                          <div className="input-container required-field">
                            <label className="formfieldlabel">Workouts</label>

                            <div>
                              <fieldset className="dropdown-parent">
                                <Field
                                  name="workouts"
                                  component="select"
                                  className="dropdown-field"
                                  key={workoutInput.id}
                                  // onChange={(e) => {
                                  //   handleWorkoutChange(workoutInput.id, e)
                                  // }}
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
                                  <OnChange name="workouts">
                                    {(value) => {
                                      handleWorkoutChange(value, workoutInput.id)
                                    }}
                                  </OnChange>
                                </Field>
                              </fieldset>
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
  )
}

export default DayGroup

export function PlanFormFields<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <>
        <div>
          <DayGroup />
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
