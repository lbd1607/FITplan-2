import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlan from "app/plans/queries/getPlan"
import updatePlan from "app/plans/mutations/updatePlan"
import { PlanForm, FORM_ERROR } from "app/plans/components/PlanForm"

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
        <h1>Edit {plan.planName}</h1>
        <pre>{JSON.stringify(plan)}</pre>

        <PlanForm
          submitText="Update Plan"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdatePlan}
          initialValues={plan}
          onSubmit={async (values) => {
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
        />
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

      <p>
        <Link href="/plans">
          <a>Plans</a>
        </Link>
      </p>
    </div>
  )
}

EditPlanPage.authenticate = true
EditPlanPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditPlanPage
