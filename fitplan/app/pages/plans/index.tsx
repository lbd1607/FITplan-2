import { Fragment, Suspense, useState, useRef } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlans from "app/plans/queries/getPlans"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import NewPlanPage from "./new"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { idText } from "typescript"

Modal.setAppElement("#__next")

const ITEMS_PER_PAGE = 100

export const PlansList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ plans, hasMore }] = usePaginatedQuery(getPlans, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

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

  const randid = () => {
    var i = () => {
      return ((1 + Math.random()) * 0x10000) | 0
    }
    const daygroupid = i() + i() + i() + i() + i() + i()
    return daygroupid
  }
  const itemsFromBackend = [{ id: randid() }]

  const colItems = {
    [randid()]: {
      name: "Todo",
      items: itemsFromBackend,
    },
  }
  const [columns, setColumns] = useState(colItems)

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return
    const { source, destination } = result
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    })
  }

  if (plans.length <= 0) {
    return <div className="m-4">No plans to show ...</div>
  } else
    return (
      <DragDropContext {...columns} onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <Droppable droppableId={id.toString()} key={id}>
              {(provided) => {
                return (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {column.items.map((item, index) => {
                      return (
                        <ul key={id}>
                          {plans.map((plan) => (
                            <Link href={`/plans/${plan.id}`} key={plan.id}>
                              <span>
                                <Draggable
                                  key={item.id.toString()}
                                  draggableId={item.id.toString()}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <li className="itemrow">
                                        <a className="select-none">{plan.planName}</a>
                                        <div className="grid grid-flow-col float-right mr-4 gap-2">
                                          {/* Map though days array so each is displayed here as chip */}
                                          {plan.days.map((day) => getDayChip(day))}
                                        </div>
                                      </li>
                                    </div>
                                  )}
                                </Draggable>
                              </span>
                            </Link>
                          ))}
                        </ul>
                      )
                    })}
                  </div>
                )
              }}
            </Droppable>
          )
        })}
      </DragDropContext>
    )
}

const PlansPage: BlitzPage = (planId, plan) => {
  /* Setup modal, contain modal open and close functions */
  const [modalIsOpen, modalSetIsOpen] = useState(false)
  const openModal = () => {
    modalSetIsOpen(true)
  }
  const closeModal = () => {
    modalSetIsOpen(false)
    // router.push("/")
    return <Link href="/" />
  }

  return (
    <>
      <Head>
        <title>Plans</title>
      </Head>

      <div className="card-container-parent">
        <div className="list-card">
          <div className="inner-scroll-parent">
            <div className="inner-scroll-heading">
              <h1>
                Plans {/* original link without modal <Link href="/plans/new"> */}
                {/* Must wrap FontAwesomeIcon in <span> to avoid ref error */}
                <button onClick={openModal}>
                  <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
                </button>
                {/* </Link> */}
              </h1>
            </div>
            <div className="inner-scroll">
              <div className="">
                <Suspense fallback={<div>Loading...</div>}>
                  <PlansList />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  <div className="card-container-parent">
        <div className="list-card">
          <h1 className="mb-10">
            Weekly Plans
            <button onClick={openModal}>
              <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
            </button>
          </h1>
          <Suspense fallback={<div>Loading...</div>}>
            <PlansList />
          </Suspense>
        </div>
      </div> */}
      <div>
        <Modal
          className="modal"
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          portalClassName="reg-modal"
        >
          <Link href="/plans/new">
            {/* Must wrap workout page in fragment to avoid ref error */}
            <Fragment>
              <NewPlanPage />
            </Fragment>
          </Link>
        </Modal>
      </div>
    </>
  )
}

PlansPage.authenticate = true
PlansPage.getLayout = (page) => <Layout>{page}</Layout>

export default PlansPage
