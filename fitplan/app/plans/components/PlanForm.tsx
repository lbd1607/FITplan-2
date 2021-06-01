import React, { Suspense, useState } from "react"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import * as z from "zod"
import { Field } from "react-final-form"
import getWorkouts from "app/workouts/queries/getWorkouts"
import { usePaginatedQuery } from "blitz"
export { FORM_ERROR } from "app/core/components/Form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { Plan } from "app/pages/plans/[planId]"

// Use these to get workouts after .map bug fixed for useQuery
// const workoutId = useParam("workoutId", "number")
// const [workouts] = useQuery(getWorkouts, { where: { id: workoutId } })

export function PlanFormFields<S extends z.ZodType<any, any>>(
  props: FormProps<S>
  /* workoutInputs: ["workoutInput-0"] */
) {
  //console.log(props)
  const [{ workouts }] = usePaginatedQuery(getWorkouts, {
    orderBy: { id: "asc" },
  })

  let defaultWorkout = workouts.map((workout) => workout.workoutName)

  //const [addAnotherWorkout] = useState()
  let workoutInputId = 0

  const [workoutInputs, setWorkoutInput] = useState([{ workouts: "" }])

  const addAnotherWorkout = () => {
    setWorkoutInput([...workoutInputs, { workouts: "" }])
  }

  const handleWorkoutChange = (workoutInputId, e) => {
    const [selectedOption, setSelectedOption] = useState(workoutInputId.value)
    setSelectedOption(e.target.value)
  }

  /* const handleWorkoutChange = (workoutInputId, e) => {
    const vals = [...workoutInputs]
    vals[workoutInputId][e.target.name] = e.target.value
    setWorkoutInput(vals)
  } */

  /* const handleWorkoutChange = (workoutInputId, e) => {
    const vals = [...workoutInputs]
    vals[workoutInputId][e.target.name] = e.target.value
    setWorkoutInput(vals)
  } */

  /* const handleWorkoutChange = (workoutInputId, e) => {
    const newWorkoutInputs = workoutInputs.map((i) => {
      if (workoutInputId === i.id) {
        i[e.target.name] = e.target.value
      }
      return i
    })
    setWorkoutInput(newWorkoutInputs)
  } */

  const removeWorkout = (workoutInputId) => {
    const vals = [...workoutInputs]
    vals.splice(vals.findIndex((value) => value.workouts === workoutInputId, 1))
    setWorkoutInput(vals)
  }

  /* const handleWorkoutSubmit = (e) => {
    e.preventDefault();
  } */

  return (
    <Form<S> {...props}>
      <div className="cardcol">
        <div className="mb-3">
          <div className="input-container required-field">
            <label className="formfieldlabel">Plan Name</label>
            <LabeledTextField name="planName" label="" className="inputbox " aria-required="true" />
          </div>

          <div className="input-container">
            <label className="formfieldlabel">Days of the Week</label>
            <fieldset className="grid grid-flow-col">
              {/* Monday */}
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
              {/* Tuesday */}
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
              {/* Wednesday */}
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
              {/* Thursday */}
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
              {/* Friday */}
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
              {/* Saturday */}
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
              {/* Sunday */}
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
          {/* {this.state.inputs.map((input) => ( */}

          <div className="input-container required-field">
            <label className="formfieldlabel">Workouts</label>
            {/* <button type="button" onClick={() => addAnotherWorkout(workoutInputs)}>
              <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
            </button> */}
            <button type="button" onClick={() => addAnotherWorkout()}>
              <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
            </button>
            <button type="button" onClick={() => removeWorkout(workoutInputId)}>
              <FontAwesomeIcon icon="minus-circle" size="lg" className="deleteicon" />
            </button>
            <div>
              {workoutInputs.map((workoutInputs, workoutInputId) => (
                <div key={workoutInputId}>
                  <fieldset className="dropdown-parent">
                    <Field
                      {...workoutInputs}
                      component="select"
                      name="workouts"
                      value={workoutInputs.workouts}
                      defaultValue={defaultWorkout[0]}
                      className="dropdown-field"
                      onChange={(e) => handleWorkoutChange(workoutInputId, e)}
                      id={workoutInputId}
                    >
                      {workouts.map((workout) => (
                        <option key={workout.id} value={workout.workoutName}>
                          {workout.workoutName}
                        </option>
                      ))}
                    </Field>
                    <FontAwesomeIcon icon="caret-down" size="lg" className="dropdown-caret" />{" "}
                  </fieldset>
                </div>
              ))}{" "}
            </div>
            {/* {(workoutInputs) => {
              return (
                <div key={workoutInputs.workoutInput}>
                  <div className="input-container required-field" {...workoutInputs}>
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
              )
            }} */}
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
