import { Suspense } from "react"
import { Link, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { WorkoutsList } from "./workouts/index"
import { PlansList } from "./plans/index"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        {/*  <div>
          <code>{currentUser.name || "None"}</code>
          <br />
          <code>{currentUser.email || "None"}</code>
          <br />
          <code>{currentUser.id || "None"}</code>
          <br />
          <code>{currentUser.role || "None"}</code>
        </div> */}
      </>
    )
  } else {
    return (
      <>
        <Link href="/signup">
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href="/login">
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <div className="">
      <main>
        <Suspense fallback="Loading...">
          <UserInfo />
        </Suspense>

        <div className="grid gap-4 grid-cols-12 data-simplebar">
          {/* Column 1 */}
          <div className="col-span-7">
            <div className="card-container-parent">
              {/* Current Workout */}
              <div className="dash-container ml-20">
                <h1 className="m-3">Current Workout</h1>
              </div>
            </div>
          </div>
          {/* Column 2 */}
          <div className="card-container-parent col-span-5 ">
            <div className="dash-container mr-20  ">
              <div className="grid grid-rows-2 h-full gap-6 divide-y">
                {/* Workouts */}
                <div className="row-span-1 overflow-y-scroll ">
                  <h1 className="m-3">Workouts</h1>
                  <Suspense fallback={<div>Loading...</div>}>
                    <WorkoutsList />
                    <WorkoutsList />
                    <WorkoutsList />
                  </Suspense>
                </div>

                {/* Weekly Plans */}
                <div className="row-span-1 overflow-y-scroll">
                  <h1 className="m-3">Weekly Plans</h1>
                  <Suspense fallback={<div>Loading...</div>}>
                    <PlansList />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        /*Firefox*/
        /*
        * {
          scrollbar-width: thin;
          scrollbar-color: #333;
        }
        /* Chrome, Safari, Edge */
        *::-webkit-scrollbar {
          width: 10px;
        }

        *::-webkit-scrollbar-track {
          background: #888;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 20px;
          border: none;
        }
        */
      `}</style>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
