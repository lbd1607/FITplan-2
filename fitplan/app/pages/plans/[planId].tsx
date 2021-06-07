import { Fragment, Suspense, useState } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlan from "app/plans/queries/getPlan"
import deletePlan from "app/plans/mutations/deletePlan"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import EditPlanPage from "./[planId]/edit"

Modal.setAppElement("#__next")

export const Plan = () => {
  const router = useRouter()
  const planId = useParam("planId", "number")
  const [deletePlanMutation] = useMutation(deletePlan)
  const [plan] = useQuery(getPlan, { id: planId })

  /*  const [confirmModalIsOpen, confirmModalSetIsOpen] = useState(false)
  function confirmOpenModal() {
    confirmModalSetIsOpen(true)
  }

  let confirm = false
  function confirmDelete(choice) {
    return (confirm = choice)
  } */
  const [modalIsOpen, modalSetIsOpen] = useState(false)
  function openModal() {
    modalSetIsOpen(true)
  }
  function closeModal() {
    modalSetIsOpen(false)
    return <Link href="/" />
  }

  //Determine chip for day based on day passed in during sub-map
  function getDayChip(days) {
    switch (days) {
      case "Monday":
        return (
          <div className="daysChip daySelected daysChipSm" key={0}>
            M
          </div>
        )
      case "Tuesday":
        return (
          <div className="daysChip daySelected daysChipSm" key={1}>
            Tu
          </div>
        )
      case "Wednesday":
        return (
          <div className="daysChip daySelected daysChipSm" key={2}>
            W
          </div>
        )
      case "Thursday":
        return (
          <div className="daysChip daySelected daysChipSm" key={3}>
            Th
          </div>
        )
      case "Friday":
        return (
          <div className="daysChip daySelected daysChipSm" key={4}>
            F
          </div>
        )
      case "Saturday":
        return (
          <div className="daysChip daySelected daysChipSm" key={5}>
            Sa
          </div>
        )
      case "Sunday":
        return (
          <div className="daysChip daySelected daysChipSm" key={6}>
            Su
          </div>
        )
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <title>{plan.planName}</title>
      </Head>
      {/*  <pre>{JSON.stringify(plan, null, 2)}</pre> */}
      <div className="card-container-parent w-2/6">
        <div className="card-container">
          <div className="card py-6 ">
            <div className="rounded-t mb-0 px-6 py-6 ">
              <div className="grid grid-cols-8">
                <h1 className="mb-10 col-span-7">{plan.planName}</h1>
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
              <p className="formfieldlabel">ID: {plan.id}</p>

              <span>
                <div className="flex flex-row space-x-3">
                  <p className="formfieldlabel">Days: </p>
                  {/* <p className="formfieldlabel">Days: {plan.days.join(", ") || "None"}</p> */}
                  {/* Map though days array so each is displayed here as chip */}
                  {plan.days.map((day) => getDayChip(day))}
                </div>
              </span>
              <p className="formfieldlabel">Workouts: {plan.workouts.join(", ") || "None"}</p>

              <div className="flex flex-row justify-between mt-10">
                <button className="btn edit" onClick={openModal}>
                  {" "}
                  <a>
                    <FontAwesomeIcon icon="pen" size="1x" className="cursor-pointer mr-2" />
                    Edit
                  </a>
                </button>
                <button
                  className="btn delete"
                  type="button"
                  onClick={async () => {
                    // confirmOpenModal
                    if (window.confirm("Delete from Plans?")) {
                      await deletePlanMutation({ id: plan.id })
                      router.push("/plans")
                    }
                  }}
                >
                  <FontAwesomeIcon icon="trash" size="1x" className="cursor-pointer mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/*  <Modal
          className="modal"
          isOpen={confirmModalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          Delete from Plans?
          <button onClick={confirmDelete(false)}>Cancel</button>
          <button onClick={confirmDelete(true)}>Delete</button>
        </Modal> */}
        <Modal
          className="modal"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          <Link href={`/plans/${plan.id}/edit`}>
            {/* Must wrap plan page in fragment to avoid ref error */}
            <Fragment>
              <EditPlanPage />
            </Fragment>
          </Link>
        </Modal>
      </div>
    </>
  )
}

const ShowPlanPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Plan />
      </Suspense>
    </div>
  )
}

ShowPlanPage.authenticate = true
ShowPlanPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowPlanPage
