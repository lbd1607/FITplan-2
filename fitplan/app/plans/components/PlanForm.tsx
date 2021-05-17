import React, { Suspense, useState } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import getWorkouts from "app/workouts/queries/getWorkouts"
import { useQuery, useParam, usePaginatedQuery, useRouter } from "blitz"
export { FORM_ERROR } from "app/core/components/Form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { check } from "prettier"

// Use these to get workouts after .map bug fixed for useQuery
// const workoutId = useParam("workoutId", "number")
// const [workouts] = useQuery(getWorkouts, { where: { id: workoutId } })

export function PlanFormFields<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  //console.log(props)
  const [{ workouts }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  let defaultWorkout = workouts.map((workout) => workout.workoutName)

  return (
    <Form<S> {...props}>
      <div className="cardcol">
        <div className="mb-3">
          <div className="input-container required-field">
            <label className="formfieldlabel">Plan Name</label>
            <LabeledTextField name="planName" label="" className="inputbox " aria-required="true" />
          </div>

          <div>
            <label className="formfieldlabel">Days of the Week</label>
            <fieldset className="grid grid-rows-1 grid-flow-col">
              {/* {"Monday"} */}
              <div className="input-container rounded-full h-10 w-10 flex items-center justify-center bg-purple-700 text-white font-bold cust-checkbox">
                <Field
                  name="days"
                  component="input"
                  value="Monday"
                  type="checkbox"
                  className="noCheckbox"
                />
                <label>M</label>
              </div>

              {/* {"Tuesday"} */}
              <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-700 text-white font-bold">
                Tu
                <Field name="days" value="Tuesday" component="input" type="checkbox" />
              </div>

              {/* {"Wednesday"} */}
              <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-700 text-white font-bold">
                W
                <Field name="days" value="Wednesday" component="input" type="checkbox" />
              </div>

              {/* {"Thursday"} */}
              <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-700 text-white font-bold">
                Th
                <Field name="days" value="Thursday" component="input" type="checkbox" />
              </div>

              {/* {"Friday"} */}
              <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-700 text-white font-bold">
                F
                <Field name="days" value="Friday" component="input" type="checkbox" />
              </div>

              {/* {"Saturday"} */}
              <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-700 text-white font-bold">
                Sa
                <Field name="days" value="Saturday" component="input" type="checkbox" />
              </div>

              {/* {"Sunday"} */}
              <div className="rounded-full h-10 w-10 flex items-center justify-center bg-purple-700 text-white font-bold">
                Su
                <Field name="days" value="Sunday" component="input" type="checkbox" />
              </div>
            </fieldset>
          </div>
          <div>
            <div className="input-container required-field">
              <label className="formfieldlabel">Workouts</label>

              <div className="dropdown-parent">
                <Field
                  component="select"
                  name="workouts"
                  defaultValue={defaultWorkout[0]}
                  className="dropdown-field"
                >
                  {workouts.map((workout) => (
                    <option key={workout.id} value={workout.workoutName}>
                      {workout.workoutName}
                    </option>
                  ))}
                </Field>
                <FontAwesomeIcon icon="caret-down" size="lg" className="dropdown-caret" />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        <style jsx global>{`
          input.noCheckbox {
            background: red;
          }

          /*  input.noCheckbox {
            display: none;
          }
          input.noCheckbox + label {
            cursor: pointer;
            width: 100%;
            text-align: center;
          }
          input.noCheckbox + label:hover {
            background: red;
          }
          input.noCheckbox + label:active,
          input.noCheckbox:checked + label,
          input.noCheckbox + label:checked {
            background: black;
            border: 1px solid green;
          } */

          /*  .cust-checkbox:hover {
            background: red;
          }
          .cust-checkbox:checked {
            background: black;
          }
          input.noCheckbox:checked {
            background: black;
          } */
        `}</style>
      }
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
