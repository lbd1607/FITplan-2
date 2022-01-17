import { Link, useRouter, useMutation, BlitzPage, Routes, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import createPlan from "app/plans/mutations/createPlan"
import { PlanForm, FORM_ERROR } from "app/plans/components/PlanForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { DayOfWeek } from "./planUtils"
import { useEffect, useState } from "react"
import { v4 as uuid } from "uuid"
import getPlans from "app/plans/queries/getPlans"

const NewPlanPage = ({ setPlanState, setShow }) => {
  /*   const [{ plans }] = usePaginatedQuery(getPlans, {
    orderBy: { itemOrder: "asc" } || { id: "asc" },
  })

  useEffect(() => {
    updatePlanState(uuid())
  }, [plans]) */

  const router = useRouter()
  const [createPlanMutation] = useMutation(createPlan)

  return (
    <div className="items-center justify-center ">
      <div className="card-container m-0">
        <div className="modal-card overflow-y-auto">
          <div className="cardcol">
            <div className="grid grid-cols-8">
              <h1 className="mb-5 col-span-7 pl-0">Create New Plan</h1>
              <Link href={Routes.PlansPage()}>
                <span className="col-span-1 justify-end text-right">
                  <FontAwesomeIcon
                    icon="times"
                    size="lg"
                    className="text-gray-500 cursor-pointer mr-1"
                  />
                </span>
              </Link>
            </div>
          </div>

          <PlanForm
            submitText="Create Plan"
            cancelText="Cancel"
            cancelURL="/plans"
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={CreatePlan}
            // initialValues={{}}
            onSubmit={async (values) => {
              //Sort days of week as Mon - Sun before posting data
              let daysList = values.days || [],
                dayOrder = [
                  DayOfWeek.Monday.dayName,
                  DayOfWeek.Tuesday.dayName,
                  DayOfWeek.Wednesday.dayName,
                  DayOfWeek.Thursday.dayName,
                  DayOfWeek.Friday.dayName,
                  DayOfWeek.Saturday.dayName,
                  DayOfWeek.Sunday.dayName,
                ]
              daysList.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
              //console.log(daysList)
              values.itemOrder = 0
              values.groupOrder = 0

              try {
                await createPlanMutation(values)
                setShow(false)
                setPlanState(uuid())
                router.push(Routes.PlansPage())
                // return <Link href={Routes.PlansPage()} />
              } catch (error: any) {
                if (!values.planName) {
                  return { [FORM_ERROR]: "Enter a plan name." }
                } else if (!values.workouts) {
                  return { [FORM_ERROR]: "Select a workout." }
                } else if (!values.days) {
                  return { [FORM_ERROR]: "Select days." }
                }
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
            onCancel={async () => {
              setShow(false)
              try {
                // return <Link href={Routes.PlansPage()} />

                router.push(Routes.PlansPage())
              } catch (error) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

NewPlanPage.authenticate = true
NewPlanPage.getLayout = (page) => <Layout title={"Create New Plan"}>{page}</Layout>

export default NewPlanPage
