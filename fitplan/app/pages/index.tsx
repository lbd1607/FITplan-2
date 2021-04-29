import { Suspense } from "react"
import { Link, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { WorkoutsList } from "./workouts/index"
import { PlansList } from "./plans/index"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"

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

        <div className="card-container-parent">
          <div className="flex-1 mx-14 my-0 mb-8 p-6 ">
            <div className="grid grid-cols-12 grid-rows-4 gap-4 grid-flow-row grid-flow-col h-full">
              <div className="col-start-1 col-span-7 row-start-1 row-span-4 dash-card">
                <div>
                  <h1 className="m-3">
                    Current Workout
                    <Link href="/">
                      <span>
                        <FontAwesomeIcon
                          icon="chevron-right"
                          size="sm"
                          className="chevronicon float-right m-1"
                        />
                      </span>
                    </Link>
                  </h1>
                  <div className="m-4">No workouts to show ...</div>
                </div>
              </div>

              <div className="dash-card col-span-5 row-span-2">
                <div className="fade-bottom">
                  <h1 className="m-3">
                    Workouts
                    <Link href="/workouts">
                      <span>
                        <FontAwesomeIcon
                          icon="chevron-right"
                          size="sm"
                          className="chevronicon float-right m-1"
                        />
                      </span>
                    </Link>
                  </h1>

                  <Suspense fallback={<div>Loading...</div>}>
                    <WorkoutsList />
                  </Suspense>
                </div>
              </div>

              <div className="dash-card col-span-5 row-span-2">
                <div>
                  <h1 className="m-3">
                    Weekly Plans
                    <Link href="/plans">
                      <span>
                        <FontAwesomeIcon
                          icon="chevron-right"
                          size="sm"
                          className="chevronicon float-right m-1"
                        />
                      </span>
                    </Link>
                  </h1>
                  <Suspense fallback={<div>Loading...</div>}>
                    <PlansList />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  */}

        {/* <div className="min-h-screen flex items-center">
          <div className="flex-1 max-w-4xl mx-auto p-10">
            <div className="grid grid-cols-6 grid-rows-4 gap-4 grid-flow-row grid-flow-col">
              <div className="col-start-1 col-span-2 row-start-1 row-span-4 card">
                <div></div>
              </div>
              <div className="card row-span-2">
                <div></div>
              </div>
              <div className="card row-span-2">
                <div></div>
              </div>
            </div>
          </div>
        </div> */}
      </main>
      <style jsx global>{`
        /*Firefox*/

        * {
          scrollbar-width: none;
          scrollbar-color: #333;
        }
        /* Chrome, Safari, Edge */
        *::-webkit-scrollbar {
          width: 10px;
        }

        *::-webkit-scrollbar-track {
          display: none;
        }

        *::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 20px;
          border: none;
        }

        .fade-bottom {
          -webkit-mask-image: -webkit-gradient(
            linear,
            left 90%,
            left-bottom,
            from(rgba(0, 0, 0, 1)),
            to(rgba(0, 0, 0, 0))
          );

          mask-image: linear-gradient(to bottom, white 90%, transparent);
        }
      `}</style>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
