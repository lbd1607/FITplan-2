import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlan from "../queries/getPlan"
import { PlanForm, FORM_ERROR } from "app/pages/plans/components/PlanForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import updatePlan from "../mutations/updatePlan"

export const EditPlan = () => {
  const router = useRouter()
  const planId = useParam("planId", "number")
  const [plan, { setQueryData }] = useQuery(
    getPlan,
    { id: planId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updatePlanMutation] = useMutation(updatePlan)

  return (
    <>
      <Head>
        <title>Edit {plan.planName}</title>
      </Head>

      <div>
        <div className="card-container-parent">
          <div className="card-container">
            <div className="card">
              <div className="my-6 px-6 ">
                <div className="grid grid-cols-8">
                  <h1 className="col-span-7 mb-10">Edit {plan.planName}</h1>
                  <Link href={Routes.PlansPage()}>
                    <span className="col-span-1 justify-end text-right">
                      <FontAwesomeIcon
                        icon="times"
                        size="lg"
                        className="mr-1 cursor-pointer text-slate-500"
                      />
                    </span>
                  </Link>
                </div>
              </div>
              <div className="px-8">
                <PlanForm
                  submitText="Save Changes"
                  cancelText="Cancel"
                  cancelURL="/plans"
                  initialValues={plan}
                  onSubmit={async (values) => {
                    const daysList = values.days,
                      dayOrder = [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ]
                    daysList.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
                    try {
                      const updated = await updatePlanMutation({
                        id: plan.id,
                        itemOrder: plan.itemOrder ? plan.itemOrder : 0,
                        groupOrder: plan.groupOrder ? plan.groupOrder : 0,
                        ...values,
                      })
                      await setQueryData(updated)
                      router.back()
                    } catch (error: any) {
                      if (!values.planName) {
                        return { [FORM_ERROR]: "Enter a plan name." }
                      } else if (!values.workouts) {
                        return { [FORM_ERROR]: "Select a workout." }
                      } else if (!values.days) {
                        return { [FORM_ERROR]: "Select days." }
                      } else {
                        return "An unknown error occurred."
                      }
                    }
                  }}
                  onCancel={async () => {
                    try {
                      router.back()
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
        </div>
      </div>
    </>
  )
}

const EditPlanPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={""}>
        <EditPlan />
      </Suspense>
    </div>
  )
}

EditPlanPage.authenticate = true
EditPlanPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPlanPage
