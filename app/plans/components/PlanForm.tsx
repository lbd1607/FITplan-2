import React, { Suspense, useState, useRef } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import getWorkouts from "app/workouts/queries/getWorkouts"
import { usePaginatedQuery, useQuery, useParam } from "blitz"
export { FORM_ERROR } from "app/core/components/Form"
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome" */
import "@fortawesome/fontawesome-svg-core/styles.css"
/* import { OnChange } from "react-final-form-listeners"
import { Plan } from "app/pages/plans/[planId]" */
import { DayOfWeek } from "../../pages/plans/planUtils"

const DaysOfTheWeek = () => {
  return (
    <fieldset className="grid grid-flow-col">
      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Monday.dayName}
          id={DayOfWeek.Monday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
          aria-required="true"
        />
        <label htmlFor={DayOfWeek.Monday.ref} className="daysChip ">
          {DayOfWeek.Monday.abbr}
        </label>
      </div>
      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Tuesday.dayName}
          id={DayOfWeek.Tuesday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
        />
        <label htmlFor={DayOfWeek.Tuesday.ref} className="daysChip ">
          {DayOfWeek.Tuesday.abbr}
        </label>
      </div>

      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Wednesday.dayName}
          id={DayOfWeek.Wednesday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
        />
        <label htmlFor={DayOfWeek.Wednesday.ref} className="daysChip ">
          {DayOfWeek.Wednesday.abbr}
        </label>
      </div>

      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Thursday.dayName}
          id={DayOfWeek.Thursday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
        />
        <label htmlFor={DayOfWeek.Thursday.ref} className="daysChip ">
          {DayOfWeek.Thursday.abbr}
        </label>
      </div>

      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Friday.dayName}
          id={DayOfWeek.Friday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
        />
        <label htmlFor={DayOfWeek.Friday.ref} className="daysChip ">
          {DayOfWeek.Friday.abbr}
        </label>
      </div>

      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Saturday.dayName}
          id={DayOfWeek.Saturday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
        />
        <label htmlFor={DayOfWeek.Saturday.ref} className="daysChip ">
          {DayOfWeek.Saturday.abbr}
        </label>
      </div>

      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Sunday.dayName}
          id={DayOfWeek.Sunday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
        />
        <label htmlFor={DayOfWeek.Sunday.ref} className="daysChip ">
          {DayOfWeek.Sunday.abbr}
        </label>
      </div>
    </fieldset>
  )
}

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
                    <label className="formfieldlabel required-field">Plan Name </label>
                    <Field
                      component="input"
                      name="planName"
                      className="inputbox"
                      aria-required="true"
                    />

                    <div className="pt-4 mt-6">
                      <div className="input-container mb-1">
                        <div className="input-container">
                          <label className="formfieldlabel required-field">Days of the Week</label>
                          <DaysOfTheWeek />
                        </div>

                        <div className="input-container required-field">
                          <label className="formfieldlabel">Workouts</label>

                          <div>
                            <fieldset className="dropdown-parent">
                              <Field
                                component="select"
                                name="workouts"
                                className="dropdown-field"
                                aria-required="true"
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
