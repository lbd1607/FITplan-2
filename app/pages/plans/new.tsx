import { Link, useRouter, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import PlanForm, { FORM_ERROR } from "app/plans/components/PlanForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { DayOfWeek } from "../../plans/utils/planUtils"
import { useContext } from "react"
import { PlanFormContext } from "."
import createPlan from "app/plans/mutations/createPlan"

const NewPlanPage = () => {
  const router = useRouter()
  const [createPlanMutation] = useMutation(createPlan)

  const { setCreate } = useContext(PlanFormContext)

  return (
    <div className="items-center justify-center">
      <div className="card-container m-0">
        <div className="modal-card overflow-y-auto">
          <div className="cardcol">
            <div className="grid grid-cols-8">
              <h1 className="col-span-7 mb-5 pl-0">Create New Plan</h1>
              <Link href={Routes.PlansPage()}>
                <button
                  className="col-span-1 justify-end text-right"
                  onClick={() => setCreate(false)}
                >
                  <FontAwesomeIcon
                    icon="times"
                    size="lg"
                    className="mr-1 cursor-pointer text-slate-500"
                  />
                </button>
              </Link>
            </div>
          </div>

          <PlanForm
            submitText="Create Plan"
            cancelText="Cancel"
            cancelURL="/plans"
            onSubmit={async (values) => {
              //Sort days of week as Mon - Sun before posting data
              const daysList = values.days || [],
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
              values.itemOrder = 0
              values.groupOrder = 0

              try {
                await createPlanMutation(values)
                setCreate(false)
                router.push(Routes.PlansPage())
              } catch (error: any) {
                if (!values.planName) {
                  return { [FORM_ERROR]: "Enter a plan name." }
                } else if (!values.days) {
                  return { [FORM_ERROR]: "Select days." }
                } else if (!values.workouts) {
                  return { [FORM_ERROR]: "Select a workout." }
                } else if (
                  error.toString().includes("Unique constraint failed on the fields: (`planName`)")
                ) {
                  return { [FORM_ERROR]: "Plan name must be unique." }
                } else {
                  return { [FORM_ERROR]: "An unknown error occurred." }
                }
              }
            }}
            onCancel={async () => {
              setCreate(false)

              try {
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
