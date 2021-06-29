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
import { Plan } from "app/pages/plans/[planId]"

export function PlanFormFields<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [{ workouts }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  return (
    <Form<S> {...props}>
      <>
        <div className="modal-card-container-parent ">
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

                    <div className="p-4 mt-6">
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
                        </div>

                        <div className="input-container required-field">
                          <label className="formfieldlabel">Workouts</label>

                          <div>
                            <fieldset className="dropdown-parent">
                              <Field
                                component="select"
                                name="workouts"
                                className="dropdown-field"
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
                              </Field>
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
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
