import React, { Suspense } from "react"
import { Form, FormProps } from "app/core/components/Form"
import * as z from "zod"
import { Field } from "react-final-form"
import { usePaginatedQuery } from "blitz"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { DayOfWeek } from "../utils/planUtils"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import getWorkouts from "app/workouts/queries/getWorkouts"
export { FORM_ERROR } from "app/core/components/Form"

const DaysOfTheWeek = () => {
  return (
    <fieldset className="grid grid-flow-col" aria-required="true">
      <div className="dayParent">
        <Field
          name="days"
          value={DayOfWeek.Monday.dayName}
          id={DayOfWeek.Monday.ref}
          component="input"
          type="checkbox"
          className="noCheckbox"
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
          <div className="card mb-0 p-0 shadow-none">
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

                    <div className="mt-6 pt-4">
                      <div className="input-container mb-1">
                        <div className="input-container">
                          <label className="formfieldlabel required-field">Days of the Week</label>
                          <DaysOfTheWeek />
                        </div>

                        <div className="input-container required-field">
                          <label className="formfieldlabel">Workouts</label>
                          <div>
                            <fieldset>
                              {workouts.map((workout) => (
                                <div key={workout.id}>
                                  <label className="ml-4">
                                    <Field
                                      component="input"
                                      type="checkbox"
                                      key={workout.id}
                                      value={workout.workoutName}
                                      name="workouts"
                                      aria-required="false"
                                    />
                                    <span className="ml-2">{workout.workoutName}</span>
                                  </label>
                                </div>
                              ))}
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="input-container">
                      <label className="formfieldlabel">Notes</label>
                      <Field
                        component="textarea"
                        name="planNotes"
                        label="Notes"
                        className="inputbox"
                      />
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

export default function PlanForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <div>
      <Suspense fallback={<LoadingAnimation />}>
        <PlanFormFields<S> {...props} />
      </Suspense>
    </div>
  )
}
