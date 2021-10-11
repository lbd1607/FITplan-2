import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlan from "app/plans/queries/getPlan"
import updatePlan from "app/plans/mutations/updatePlan"
import { PlanForm, FORM_ERROR } from "app/plans/components/PlanForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

export const EditPlan = () => {
  const router = useRouter()
  const planId = useParam("planId", "number")
  const [plan, { setQueryData }] = useQuery(getPlan, { id: planId })
  const [updatePlanMutation] = useMutation(updatePlan)

  return (
    <>
      <Head>
        <title>Edit {plan.planName}</title>
      </Head>

      <div>
        {/*    <h1>Edit {plan.planName}</h1> */}
        <div className="card-container-parent">
          <div className="card-container">
            <div className="card">
              <div className="my-6 px-6 ">
                <div className="grid grid-cols-8">
                  <h1 className="mb-10 col-span-7">Edit {plan.planName}</h1>
                  <Link href="/plans">
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
              <div className="px-8">
                <PlanForm
                  submitText="Save"
                  cancelText="Cancel"
                  cancelURL="/plans"
                  // TODO use a zod schema for form validation
                  //  - Tip: extract mutation's schema into a shared `validations.ts` file and
                  //         then import and use it here
                  // schema={UpdatePlan}
                  initialValues={plan}
                  onSubmit={async (values) => {
                    var daysList = values.days,
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
                        ...values,
                      })
                      await setQueryData(updated)
                      router.push(`/plans/${updated.id}`)
                    } catch (error) {
                      console.error(error)
                      return {
                        [FORM_ERROR]: error.toString(),
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
      <Suspense fallback={<div>Loading...</div>}>
        <EditPlan />
      </Suspense>

      {/* <p>
        <Link href="/plans">
          <a>Plans</a>
        </Link>
      </p> */}
    </div>
  )
}

EditPlanPage.authenticate = true
EditPlanPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPlanPage
