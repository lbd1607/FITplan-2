import { Fragment, useState } from "react"
import { Link, usePaginatedQuery, useRouter, useMutation, useParam } from "blitz"
import getPlans from "app/plans/queries/getPlans"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { FORM_ERROR } from "app/plans/components/PlanForm"
import updatePlan from "app/plans/mutations/updatePlan"
import { v4 as uuid } from "uuid"
import { GroupName, getDayChip } from "./planUtils"

const ITEMS_PER_PAGE = 100

const PlansList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ plans }] = usePaginatedQuery(getPlans, {
    orderBy: { itemOrder: "asc" } || { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const [plansArray, updatePlansArray] = useState(plans)

  const planId = useParam("planId", "number")

  const getIndex = (obj, entry) => Object.values(obj).indexOf(entry)

  const groupList = {
    [uuid()]: {
      name: GroupName.UNASSIGNED,
      items: Array.from(
        plansArray.filter((planItem) => planItem.groupOrder === null || planItem.groupOrder === 0) //Show only unassigned items in this first group
      ),
      groupOrder: getIndex(GroupName, GroupName.UNASSIGNED),
    },
    [uuid()]: {
      name: GroupName.WEEK1,
      items: Array.from(plansArray.filter((planItem) => planItem.groupOrder === 1)),
      groupOrder: getIndex(GroupName, GroupName.WEEK1),
    },
    [uuid()]: {
      name: GroupName.WEEK2,
      items: Array.from(plansArray.filter((planItem) => planItem.groupOrder === 2)),
      groupOrder: getIndex(GroupName, GroupName.WEEK2),
    },
    [uuid()]: {
      name: GroupName.WEEK3,
      items: Array.from(plansArray.filter((planItem) => planItem.groupOrder === 3)),
      groupOrder: getIndex(GroupName, GroupName.WEEK3),
    },
    [uuid()]: {
      name: GroupName.WEEK4,
      items: Array.from(plansArray.filter((planItem) => planItem.groupOrder === 4)),
      groupOrder: getIndex(GroupName, GroupName.WEEK4),
    },
  }
  const [groups, setGroups] = useState(groupList)

  const handleOnDragEnd = (result, groups, setGroups) => {
    const start = result.source
    const end = result.destination
    const startId = start.droppableId
    const endId = end.droppableId

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

    for (const item of newItems) {
      if (item) {
        const newOrder = newItems.indexOf(item)
        item.itemOrder = newOrder
        item.groupOrder = newGroups.groupOrder

        postUpdatedOrder(item)
      }
    }
    updatePlansArray(newItems)
  }

  const [updatePlanMutation] = useMutation(updatePlan)

  //Post updated itemOrder values to the planItem passed in from handleOnDragEnd
  const postUpdatedOrder = async (values) => {
    try {
      const updated = await updatePlanMutation({
        id: planId,
        ...values,
      })
      return updated
    } catch (error) {
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  if (plansArray.length <= 0) {
    return <div className="m-4 pl-6">No plans to show ...</div>
  } else
    return (
      <>
        <div className="mt-1 flex-1 list-none pt-12">
          <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, groups, setGroups)}>
            {Object.entries(groups).map(([groupid, group]) => {
              return (
                <Fragment key={groupid}>
                  <Droppable
                    droppableId={groupid}
                    /* Reparents the draggable and re-renders the item being dragged to avoid issues with positioning during drag*/
                    renderClone={(provided, rubric) => (
                      <div
                        className="itemrow"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                      >
                        <FontAwesomeIcon
                          icon="grip-lines"
                          size="lg"
                          className="mr-3 text-slate-500"
                        />{" "}
                        {group?.items[rubric.source.index]?.planName}
                        <div className="float-right mr-4 grid grid-flow-col gap-2">
                          {group?.items[rubric.source.index]?.days.map((day) => getDayChip(day))}
                        </div>
                      </div>
                    )}
                  >
                    {(provided, snapshot) => {
                      return (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="pl-16">
                          <div className="cardcol ml-4 mr-0 py-2 pr-0">
                            <div className="-mr-8 origin-bottom-right -translate-x-16 -translate-y-16 transform">
                              <div
                                className={
                                  snapshot.isDraggingOver ? "top-0 space-y-9 bg-green-200" : ""
                                }
                              >
                                <div
                                  className={
                                    group.name !== "Unassigned"
                                      ? "my-1 rounded-sm border-l-4 border-purple-500 bg-slate-50 bg-opacity-70 px-8 pt-6 pb-12"
                                      : "my-1 rounded-sm border-l-4 border-pink-500 bg-red-50 bg-opacity-40 px-8 pt-6 pb-12"
                                  }
                                  style={{ minHeight: "10rem" }}
                                >
                                  <div className="">
                                    <h2 className="mb-4 bg-transparent pl-0">{group.name}</h2>
                                  </div>
                                  {group.items.map((item, index) => {
                                    return (
                                      <Draggable
                                        key={item.id}
                                        draggableId={item.id.toString()}
                                        index={index}
                                      >
                                        {(provided) => (
                                          <Link href={`/plans/${item.id}`} key={item.id}>
                                            <ul className="list-none">
                                              <li
                                                className="itemrow"
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                              >
                                                <FontAwesomeIcon
                                                  icon="grip-lines"
                                                  size="lg"
                                                  className="mr-3 text-slate-500"
                                                />{" "}
                                                <a className="select-none">{item.planName}</a>
                                                <div className="float-right mr-4 grid grid-flow-col gap-2">
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
                          </div>

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

export default PlansList
