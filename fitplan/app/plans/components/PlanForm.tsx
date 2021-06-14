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
import { Plan } from "app/pages/plans/[planId]"
import getPlan from "app/plans/queries/getPlan"

// Use these to get workouts after .map bug fixed for useQuery
// const workoutId = useParam("workoutId", "number")
// const [workouts] = useQuery(getWorkouts, { where: { id: workoutId } })

export function PlanFormFields<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [{ workouts }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  const Days = [""]

  const a11yRef = useRef(null)
  const editingId = useParam("planId", "number")
  //Must check editingId first, otherwise validation assumes undefined id and fails on create new
  if (!editingId) {
    var currentState = [""]
  } else {
    const [editPlan] = useQuery(getPlan, { id: editingId })
    var currentState = editPlan.days || [""]
  }
  //Set which button is selected onClickCapture, default is the default selection "resistance"; state is lifted to parent
  const [isSelected, setSelected] = useState(currentState)

  return (
    <Form<S> {...props}>
      <div className="modal-card-container-parent mb-10">
        <div className="card p-0 shadow-none mb-0">
          <div className="inner-scroll-parent">
            <div className="inner-scroll mt-0 py-0">
              <div className="cardcol py-0">
                <div className="">
                  <div className="input-container required-field">
                    <label className="formfieldlabel">Plan Name</label>
                    <LabeledTextField
                      name="planName"
                      label=""
                      className="inputbox "
                      aria-required="true"
                    />
                  </div>

                  {/*  <div className="input-container">
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
                <label htmlFor="mon" className="daysChip ">
                  {" "}
                  M
                </label>
              </div>
         
              <div className="dayParent">
                <Field
                  name="days"
                  value="Tuesday"
                  id="tue"
                  component="input"
                  type="checkbox"
                  className="noCheckbox"
                />
                <label htmlFor="tue" className="daysChip ">
                  {" "}
                  Tu
                </label>
              </div>
      
              <div className="dayParent">
                <Field
                  name="days"
                  value="Wednesday"
                  id="wed"
                  component="input"
                  type="checkbox"
                  className="noCheckbox"
                />
                <label htmlFor="wed" className="daysChip ">
                  {" "}
                  W
                </label>
              </div>
           
              <div className="dayParent">
                <Field
                  name="days"
                  value="Thursday"
                  id="thu"
                  component="input"
                  type="checkbox"
                  className="noCheckbox"
                />
                <label htmlFor="thu" className="daysChip ">
                  {" "}
                  Th
                </label>
              </div>
  
              <div className="dayParent">
                <Field
                  name="days"
                  value="Friday"
                  id="fri"
                  component="input"
                  type="checkbox"
                  className="noCheckbox"
                />
                <label htmlFor="fri" className="daysChip ">
                  {" "}
                  F
                </label>
              </div>
     
              <div className="dayParent">
                <Field
                  name="days"
                  value="Saturday"
                  id="sat"
                  component="input"
                  type="checkbox"
                  className="noCheckbox"
                />
                <label htmlFor="sat" className="daysChip ">
                  {" "}
                  Sa
                </label>
              </div>
       
              <div className="dayParent">
                <Field
                  name="days"
                  value="Sunday"
                  id="sun"
                  component="input"
                  type="checkbox"
                  className="noCheckbox"
                />
                <label htmlFor="sun" className="daysChip ">
                  {" "}
                  Su
                </label>
              </div>
            </fieldset>
          </div> */}

                  {/*  <div className="input-container required-field">
            <label className="formfieldlabel">Workouts</label>

            <div>
              <div>
                <fieldset className="dropdown-parent">
                  <Field component="select" name="workouts" className="dropdown-field" multiple>
                    {workouts.map((workout) => (
                      <option
                        className="hover:bg-gray-400"
                        key={workout.id}
                        value={workout.workoutName}
                        label={workout.workoutName}
                        defaultValue={workout.workoutName[0] || []}
                      ></option>
                    ))}
                  </Field>
                </fieldset>
              </div>
            </div>
          </div> */}

                  <div className="input-container mb-0">
                    <fieldset className="grid grid-flow-row">
                      <div className="justify-start mb-4">
                        <Field
                          name="days"
                          /* value={workouts[0] != null ? isSelected : !isSelected} */
                          value="Monday"
                          id="mon"
                          component="input"
                          type="checkbox"
                          className="noCheckbox"
                        />

                        <label className="formfieldlabel" htmlFor="mon">
                          {""}Monday
                        </label>

                        <fieldset className="dropdown-parent">
                          <Field
                            component="select"
                            name="workouts"
                            className="dropdown-field"
                            multiple
                          >
                            <option value="None">None</option>
                            {workouts.map((workout) => (
                              <option
                                className="hover:bg-gray-400"
                                key={workout.id}
                                value={workout.workoutName}
                                label={workout.workoutName}
                                defaultValue={workout.workoutName[0] || []}
                                /*  onClickCapture={() => setSelected(["Monday"])} */
                              ></option>
                            ))}
                          </Field>
                        </fieldset>
                      </div>

                      <div className="justify-start mb-4">
                        <Field name="days" value="Tuesday" id="tue" component="select" />

                        <label className="formfieldlabel">Tuesday</label>

                        <fieldset className="dropdown-parent">
                          <Field
                            component="select"
                            name="workouts"
                            className="dropdown-field"
                            multiple
                          >
                            {workouts.map((workout) => (
                              <option
                                className="hover:bg-gray-400"
                                key={workout.id}
                                value={workout.workoutName}
                                label={workout.workoutName}
                                defaultValue={workout.workoutName[0] || []}
                              ></option>
                            ))}
                          </Field>
                        </fieldset>
                      </div>

                      <div className="justify-start mb-4">
                        <Field name="days" value="Wednesday" id="wed" component="select" />

                        <label className="formfieldlabel">Wednesday</label>

                        <fieldset className="dropdown-parent">
                          <Field
                            component="select"
                            name="workouts"
                            className="dropdown-field"
                            multiple
                          >
                            {workouts.map((workout) => (
                              <option
                                className="hover:bg-gray-400"
                                key={workout.id}
                                value={workout.workoutName}
                                label={workout.workoutName}
                                defaultValue={workout.workoutName[0] || []}
                              ></option>
                            ))}
                          </Field>
                        </fieldset>
                      </div>

                      <div className="justify-start mb-4">
                        <Field name="days" value="Thursday" id="thu" component="select" />

                        <label className="formfieldlabel">Thursday</label>

                        <fieldset className="dropdown-parent">
                          <Field
                            component="select"
                            name="workouts"
                            className="dropdown-field"
                            multiple
                          >
                            {workouts.map((workout) => (
                              <option
                                className="hover:bg-gray-400"
                                key={workout.id}
                                value={workout.workoutName}
                                label={workout.workoutName}
                                defaultValue={workout.workoutName[0] || []}
                              ></option>
                            ))}
                          </Field>
                        </fieldset>
                      </div>

                      <div className="justify-start mb-4">
                        <Field name="days" value="Friday" id="fri" component="select" />

                        <label className="formfieldlabel">Friday</label>

                        <fieldset className="dropdown-parent">
                          <Field
                            component="select"
                            name="workouts"
                            className="dropdown-field"
                            multiple
                          >
                            {workouts.map((workout) => (
                              <option
                                className="hover:bg-gray-400"
                                key={workout.id}
                                value={workout.workoutName}
                                label={workout.workoutName}
                                defaultValue={workout.workoutName[0] || []}
                              ></option>
                            ))}
                          </Field>
                        </fieldset>
                      </div>

                      <div className="justify-start mb-4">
                        <Field name="days" value="Saturday" id="sat" component="select" />

                        <label className="formfieldlabel">Saturday</label>

                        <fieldset className="dropdown-parent">
                          <Field
                            component="select"
                            name="workouts"
                            className="dropdown-field"
                            multiple
                          >
                            {workouts.map((workout) => (
                              <option
                                className="hover:bg-gray-400"
                                key={workout.id}
                                value={workout.workoutName}
                                label={workout.workoutName}
                                defaultValue={workout.workoutName[0] || []}
                              ></option>
                            ))}
                          </Field>
                        </fieldset>
                      </div>

                      <div className="justify-start mb-4">
                        <Field name="days" value="Sunday" id="sun" component="select" />

                        <label className="formfieldlabel">Sunday</label>

                        <fieldset className="dropdown-parent ">
                          <Field
                            component="select"
                            name="workouts"
                            className="dropdown-field"
                            multiple
                          >
                            {workouts.map((workout) => (
                              <option
                                className="hover:bg-gray-400"
                                key={workout.id}
                                value={workout.workoutName}
                                label={workout.workoutName}
                                defaultValue={workout.workoutName[0] || []}
                              ></option>
                            ))}
                          </Field>
                        </fieldset>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {<style jsx global>{``}</style>}
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
