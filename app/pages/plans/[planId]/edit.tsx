import { Suspense, useContext } from "react"
import { Head, Link, useRouter, useQuery, useMutation, Routes, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import PlanForm, { FORM_ERROR } from "app/plans/components/PlanForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { PlanFormContext } from ".."
import getPlan from "app/plans/queries/getPlan"
import deletePlan from "app/plans/mutations/deletePlan"
import updatePlan from "app/plans/mutations/updatePlan"

export const EditPlan = () => {
  const router = useRouter()

  const { setEdit, currentPlanId } = useContext(PlanFormContext)

  const [plan, { setQueryData }] = useQuery(
    getPlan,
    { id: currentPlanId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updatePlanMutation] = useMutation(updatePlan)
  const [deletePlanMutation] = useMutation(deletePlan)

  return (
    <>
      <Head>
        <title>Edit {plan.planName}</title>
      </Head>

      <div className="items-center justify-center">
        <div className="card-container m-0">
          <div className="modal-card">
            <button
              className="btn delete border-none w-fit px-3 py-1 absolute top-12 mt-0.5"
              type="button"
              onClick={async () => {
                if (window.confirm("Delete from Plans?")) {
                  await deletePlanMutation({ id: plan.id })
                  setEdit(false)
                  router.push(Routes.PlansPage())
                }
              }}
            >
              <FontAwesomeIcon icon="trash" size="1x" className=" cursor-pointer" />
            </button>

            <div className="cardcol">
              <div className="grid grid-cols-8 content-center">
                <div className="col-span-7 inline-flex">
                  <h1 className="">{plan.planName}</h1>
                </div>
                <Link href={Routes.PlansPage()}>
                  <button
                    className="col-span-1 justify-end text-right pl-5"
                    onClick={() => setEdit(false)}
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
                    planName: values.planName,
                    itemOrder: values.itemOrder ? values.itemOrder : plan.itemOrder,
                    groupOrder: values.groupOrder ? values.groupOrder : plan.groupOrder,
                    workouts: values.workouts,
                    planNotes: values.planNotes ? values.planNotes : "",
                  })
                  await setQueryData(updated)
                  router.push(Routes.PlansPage())
                  setEdit(false)
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
                  await router.push(Routes.PlansPage())
                  setEdit(false)
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
