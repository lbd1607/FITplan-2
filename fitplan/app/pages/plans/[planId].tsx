import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlan from "app/plans/queries/getPlan"
import deletePlan from "app/plans/mutations/deletePlan"

export const Plan = () => {
  const router = useRouter()
  const planId = useParam("planId", "number")
  const [deletePlanMutation] = useMutation(deletePlan)
  const [plan] = useQuery(getPlan, { id: planId })

  return (
    <>
      <Head>
        <title>{plan.planName}</title>
      </Head>

      <div>
        <h1>{plan.planName}</h1>
        <pre>{JSON.stringify(plan, null, 2)}</pre>

        <Link href={`/plans/${plan.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePlanMutation({ id: plan.id })
              router.push("/plans")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowPlanPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/plans">
          <a>Plans</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Plan />
      </Suspense>
    </div>
  )
}

ShowPlanPage.authenticate = true
ShowPlanPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPlanPage
