import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createPlan from "app/plans/mutations/createPlan"
import { PlanForm, FORM_ERROR } from "app/plans/components/PlanForm"

const NewPlanPage: BlitzPage = () => {
  const router = useRouter()
  const [createPlanMutation] = useMutation(createPlan)

  return (
    <div>
      <h1>Create New Plan</h1>

      <PlanForm
        submitText="Create Plan"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreatePlan}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const plan = await createPlanMutation(values)
            router.push(`/plans/${plan.id}`)
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href="/plans">
          <a>Plans</a>
        </Link>
      </p>
    </div>
  )
}

NewPlanPage.authenticate = true
NewPlanPage.getLayout = (page) => <Layout title={"Create New Plan"}>{page}</Layout>

export default NewPlanPage
