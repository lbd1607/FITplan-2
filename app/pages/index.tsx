import { Suspense } from "react"
import { Link, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import PlansList from "../plans/components/PlansList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import LoadingAnimation from "app/core/components/LoadingAnimation"
import WorkoutsList from "../workouts/components/WorkoutsList"

const Home: BlitzPage = () => {
  return (
    <div className="">
      <main>
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
                      <Suspense fallback={<LoadingAnimation />}>
                        <PlansList />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dash-card col-span-5 row-span-4">
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
                      <Suspense fallback={<LoadingAnimation />}>
                        <WorkoutsList />
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
