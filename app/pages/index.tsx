import { Suspense } from "react"
import { Image, Link, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { WorkoutsList } from "app/pages/workouts/index"
import PlansList from "../pages/plans/PlansList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { ExercisesList } from "app/pages/exercises"

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        {/*  <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div> */}
      </>
    )
  } else {
    Routes.LoginPage()
    return (
      <>
        {/*  <Link href={Routes.SignupPage()}>
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href={Routes.LoginPage()}>
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link> */}
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <div className="">
      <main>
        <Suspense fallback={<div className="pl-20">Loading...</div>}>
          <UserInfo />
        </Suspense>

        <div className="card-container-parent">
          <div className="mx-9 my-0 mb-2 flex-1 px-6 pb-6 ">
            <div className="grid h-full grid-flow-row grid-cols-12 grid-rows-4 gap-4 ">
              <div
                className="dash-card col-span-7 col-start-1 row-span-4 row-start-1"
                style={{ backdropFilter: "blur(30px" }}
              >
                <div className="inner-scroll-parent">
                  <div className="inner-scroll-heading">
                    <h1 className="pl-10">
                      Plans
                      <Link href={Routes.PlansPage()}>
                        <span>
                          <FontAwesomeIcon
                            icon="chevron-right"
                            size="sm"
                            className="chevronicon float-right m-1"
                          />
                        </span>
                      </Link>
                    </h1>
                  </div>
                  <div className="inner-scroll">
                    <div className="">
                      <Suspense fallback={<div className="pl-20">Loading...</div>}>
                        <PlansList />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dash-card col-span-5 row-span-2">
                <div className="inner-scroll-parent">
                  <div className="inner-scroll-heading">
                    <h1>
                      Workouts
                      <Link href={Routes.WorkoutsPage()}>
                        <span>
                          <FontAwesomeIcon
                            icon="chevron-right"
                            size="sm"
                            className="chevronicon float-right m-1"
                          />
                        </span>
                      </Link>
                    </h1>
                  </div>
                  <div className="inner-scroll">
                    <div className="">
                      <Suspense fallback={<div className="pl-20">Loading...</div>}>
                        <WorkoutsList />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dash-card col-span-5 row-span-2">
                <div className="inner-scroll-parent">
                  <div className="inner-scroll-heading">
                    <h1>
                      Exercises
                      <Link href={Routes.WorkoutsPage()}>
                        <span>
                          <FontAwesomeIcon
                            icon="chevron-right"
                            size="sm"
                            className="chevronicon float-right m-1"
                          />
                        </span>
                      </Link>
                    </h1>
                  </div>
                  <div className="inner-scroll">
                    <div className="">
                      <Suspense fallback={<div className="pl-10">Loading...</div>}>
                        <ExercisesList />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
