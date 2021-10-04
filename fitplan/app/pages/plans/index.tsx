import { Fragment, Suspense, useState, useRef } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, useMutation, useParam } from "blitz"
import Layout from "app/core/layouts/Layout"
import getPlans from "app/plans/queries/getPlans"
import Modal from "react-modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import NewPlanPage from "./new"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { FORM_ERROR } from "app/plans/components/PlanForm"
import updatePlan from "app/plans/mutations/updatePlan"
import { v4 as uuid } from "uuid"
import { PureComponent } from "react"
import { createPortal } from "react-dom"
import { isEmptyBindingElement } from "typescript"
import { empty } from "@prisma/client/runtime"

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

  //Get styles for dnd items
  /*   const getStyle = (style, element) => {
    if (style.position === "fixed") {
      return createPortal(element, _dragEl)
    }
    return element
  } */

  /*   const getStyle = (style, snapshot) => {
    if (!snapshot.isDragging || !snapshot.isDropAnimating) {
      return style
    }
    const { moveTo, curve, duration } = snapshot.dropAnimation
    const offset = { x: 0, y: 0 }
    const x = style.left - offset.x
    const y = style.top - offset.y
    return { ...style, left: x, top: y, transition: `${curve} ${duration + 0.25}s` }
  } */
  /*   const getStyle = (style, snapshot) => {
    if (!snapshot.isDropAnimating) {
      return style
    }
    const { moveTo, curve, duration } = snapshot.dropAnimation

    const translate = `translate(${moveTo.x + 20}px, ${moveTo.y + 100}px)`

    return {
      ...style,
      transform: `${translate}`,

      transition: `all ${curve} ${duration + 0.1}s`,
    }
  } */

  //State for plan items (each row item)
  const [planItem, updatePlanItem] = useState(plans)

  //Fetch plan id
  const planId = useParam("planId", "number")

  //Create list of premade groups
  const groupList = {
    [uuid()]: {
      name: "Unassigned",
      items: Array.from(
        planItem.filter((planItem) => planItem.groupOrder === null || planItem.groupOrder === 0) //Show only unassigned items in this first group
      ),
      groupOrder: 0,
    },
    [uuid()]: {
      name: "Week 1",
      items: Array.from(planItem.filter((planItem) => planItem.groupOrder === 1)),
      groupOrder: 1,
    },
    [uuid()]: {
      name: "Week 2",
      items: Array.from(planItem.filter((planItem) => planItem.groupOrder === 2)),
      groupOrder: 2,
    },
    [uuid()]: {
      name: "Week 3",
      items: Array.from(planItem.filter((planItem) => planItem.groupOrder === 3)),
      groupOrder: 3,
    },
    [uuid()]: {
      name: "Week 4",
      items: Array.from(planItem.filter((planItem) => planItem.groupOrder === 4)),
      groupOrder: 4,
    },
  }
  //State for groups, gets updated on drag end
  const [groups, setGroups] = useState(groupList)

  //Handle onDragEnd so state changes are persisted in UI and can be posted to DB with hooks
  const handleOnDragEnd = (result, groups, setGroups) => {
    const start = result.source
    const end = result.destination
    const startId = start.droppableId
    const endId = end.droppableId
    //If dropped outside the droppable area, return (ignores move)
    if (!end) return

    //If items are being moved within their starting group
    if (startId === endId) {
      const endGroup = groups[startId]
      const endItems = [...endGroup.items]
      const [removedItem] = endItems.splice(start.index, 1)
      endItems.splice(end.index, 0, removedItem || start.index)
      //Update state of start group only
      setGroups({
        ...groups,
        [startId]: {
          ...endGroup,
          items: endItems,
        },
      })
      gatherItemOrder(removedItem, endItems, endGroup)
    } else {
      const startGroup = groups[startId]
      const startItems = [...startGroup.items]
      const [removedItem] = startItems.splice(start.index, 1)
      const endGroup = groups[endId]
      const endItems = [...endGroup.items]
      endItems.splice(end.index, 0, removedItem || start.index)
      //Update state of both start and end groups
      setGroups({
        ...groups,
        [startId]: {
          ...startGroup,
          items: startItems,
        },
        [endId]: {
          ...endGroup,
          items: endItems,
        },
      })
      gatherItemOrder(removedItem, endItems, endGroup)
    }
  }

  //Gather data to send the new order to postUpdatedOrder so it can be posted to the database
  const gatherItemOrder = (removedItem, newItems, newGroups) => {
    if (!removedItem) return

    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i]

      if (item) {
        var newOrder = newItems.indexOf(item)
        item.itemOrder = newOrder
        item.groupOrder = newGroups.groupOrder
      }

      postUpdatedOrder(item)
    }
    updatePlanItem(newItems)
  }

  //Update mutation to update plan itemOrder
  const [updateNoteMutation] = useMutation(updatePlan)

  //Post updated itemOrder values to the planItem passed in from handleOnDragEnd()
  async function postUpdatedOrder(values) {
    try {
      const updated = await updateNoteMutation({
        id: planId,
        ...values,
      })
      await updated
    } catch (error) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  if (plans.length <= 0) {
    return <div className="m-4">No plans to show ...</div>
  } else
    return (
      <>
        <div className="flex-1 list-none">
          {/*  <div className="grid grid-flow-col h-full"> */}
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, groups, setGroups)}>
            {Object.entries(groups).map(([groupid, group], index) => {
              return (
                <Fragment key={groupid}>
                  <Droppable
                    droppableId={groupid}
                    /* Reparents the draggable and re-renders the item being dragged to avoid issues with positioning during drag*/
                    renderClone={(provided, snapshot, rubric) => (
                      <div
                        className="itemrow"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        /* style={getStyle(provided.draggableProps.style, snapshot)} */
                      >
                        <FontAwesomeIcon
                          icon="grip-lines"
                          size="lg"
                          className="text-gray-500 mr-3"
                        />{" "}
                        {group.items[rubric.source.index].planName}
                        <div className="grid grid-flow-col float-right mr-4 gap-2">
                          {/* Map though days array so each is displayed here as chip */}
                          {group.items[rubric.source.index].days.map((day) => getDayChip(day))}
                        </div>
                      </div>
                    )}
                  >
                    {(provided, snapshot) => {
                      return (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="px-4">
                          <>
                            <div className="cardcol py-2 px-0 mx-4">
                              <div className={snapshot.isDraggingOver ? "bg-green-200" : ""}>
                                <div
                                  className={
                                    group.name !== "Unassigned"
                                      ? "rounded-sm px-8 pt-6 pb-12 my-1 border-l-4 border-purple-500 bg-gray-50 bg-opacity-70"
                                      : "rounded-sm px-8 pt-6 pb-12 my-1 border-l-4 border-pink-500 bg-red-50 bg-opacity-40"
                                  }
                                  style={{ minHeight: "10rem" }}
                                >
                                  <h2 className="mb-4 bg-transparent pl-0">{group.name}</h2>
                                  {group.items.map((item, index) => {
                                    return (
                                      <Draggable
                                        key={item.id}
                                        draggableId={item.id.toString()}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <Link href={`/plans/${item.id}`} key={item.id}>
                                            <ul className="list-none">
                                              <li
                                                className="itemrow"
                                                /* className={
                                                  snapshot.isDragging
                                                    ? "itemrow transform translate-x-8 translate-y-12"
                                                    : "itemrow"
                                                } */
                                                /* className={
                                                    snapshot.isDropAnimating
                                                      ? "itemrow   absolute top-0 left-0 transform -translate-y-72 -translate-x-72"
                                                      : "itemrow"
                                                  } */

                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                /* style={getStyle(
                                                  provided.draggableProps.style,
                                                  snapshot
                                                )} */
                                              >
                                                <FontAwesomeIcon
                                                  icon="grip-lines"
                                                  size="lg"
                                                  className="text-gray-500 mr-3"
                                                />{" "}
                                                <a className="select-none">{item.planName}</a>
                                                <div className="grid grid-flow-col float-right mr-4 gap-2">
                                                  {/* Map though days array so each is displayed here as chip */}
                                                  {item.days.map((day) => getDayChip(day))}
                                                </div>
                                              </li>
                                            </ul>
                                          </Link>
                                        )}
                                      </Draggable>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </>

                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </Fragment>
              )
            })}
          </DragDropContext>
        </div>
      </>
    )
}

const PlansPage: BlitzPage = () => {
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
              <h1 className="ml-5 mt-1">
                Plans
                {/* Must wrap FontAwesomeIcon in <span> to avoid ref error */}
                <button onClick={openModal}>
                  <FontAwesomeIcon icon="plus-circle" size="lg" className="addicon" />
                </button>
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
