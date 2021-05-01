import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createPlan from "app/plans/mutations/createPlan"
import { PlanForm, FORM_ERROR } from "app/plans/components/PlanForm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

const NewPlanPage: BlitzPage = () => {
  const router = useRouter()
  const [createPlanMutation] = useMutation(createPlan)

  return (
    <div>
      <div className="card-container">
        <div className="card">
          <div className="cardcol">
            <div className="grid grid-cols-8">
              <h1 className="mb-5 col-span-7">Create New Plan</h1>
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

          <PlanForm
            submitText="Save"
            cancelText="Cancel"
            cancelURL="/plans"
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

          {/* <p>
            <Link href="/plans">
              <a>Plans</a>
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  )
}

NewPlanPage.authenticate = true
NewPlanPage.getLayout = (page) => <Layout title={"Create New Plan"}>{page}</Layout>

export default NewPlanPage
