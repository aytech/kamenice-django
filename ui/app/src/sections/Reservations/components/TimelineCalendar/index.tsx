import { useReactiveVar } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import moment from "moment"
import Timeline, { CursorMarker, DateHeader, SidebarHeader, TimelineHeaders } from "react-calendar-timeline"
import { ReservationItem } from "../ReservationItem"
import { canvasTimeEnd, canvasTimeStart, reservationItems, timelineGroups } from "../../../../cache"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface Props {
  onItemDeselect: () => void
  onItemMove: (itemId: string, dragTime: number, newGroupOrder: number) => void
  onItemSelect: (itemId: string) => void
}
export const TimelineCalendar = ({
  onItemDeselect,
  onItemMove,
  onItemSelect
}: Props) => {

  const { t } = useTranslation()

  const groups = useReactiveVar(timelineGroups)
  const items = useReactiveVar(reservationItems)
  const visibleTimeEnd = useReactiveVar(canvasTimeEnd)
  const visibleTimeStart = useReactiveVar(canvasTimeStart)

  const [ firstFrameStartTime ] = useState<number>(moment().subtract(1, "year").valueOf())
  const [ firstFrameEndTime ] = useState<number>(moment(firstFrameStartTime).add(1, "month").valueOf())
  const [ lastFrameEndTime ] = useState<number>(moment().add(1, "year").valueOf())
  const [ lastFrameStartTime ] = useState<number>(moment(lastFrameEndTime).subtract(1, "month").valueOf())

  return groups.length > 0 ? (
    <Timeline
      canChangeGroup={ true }
      canMove={ true }
      canResize={ false }
      groupRenderer={ ({ group }) => {
        return (
          <Title level={ 5 }>
            { group.title }
          </Title>
        )
      } }
      groups={ groups }
      itemRenderer={ props =>
        <ReservationItem { ...props } />
      }
      items={ items }
      itemTouchSendsClick={ true }
      lineHeight={ 60 }
      onItemClick={ onItemSelect }
      onItemDeselect={ onItemDeselect }
      onCanvasClick={ onItemDeselect }
      onItemMove={ onItemMove }
      onItemSelect={ onItemSelect }
      onTimeChange={ (visibleTimeStart: number, visibleTimeEnd: number, updateScrollCanvas: (start: number, end: number) => void) => {
        if (visibleTimeEnd > lastFrameEndTime) {
          canvasTimeEnd(lastFrameEndTime)
          canvasTimeStart(lastFrameStartTime)
          updateScrollCanvas(lastFrameStartTime, lastFrameEndTime)
        } else if (visibleTimeStart < firstFrameStartTime) {
          canvasTimeEnd(firstFrameEndTime)
          canvasTimeStart(firstFrameStartTime)
          updateScrollCanvas(firstFrameStartTime, firstFrameEndTime)
        } else {
          canvasTimeEnd(visibleTimeEnd)
          canvasTimeStart(visibleTimeStart)
          updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
        }
      } }
      visibleTimeEnd={ visibleTimeEnd }
      visibleTimeStart={ visibleTimeStart }>
      <TimelineHeaders>
        <SidebarHeader>
          { ({ getRootProps }) => {
            return (
              <div
                { ...getRootProps() }
                className="side-header">
                { t("rooms.nav-title") }
              </div>
            )
          } }
        </SidebarHeader>
        <DateHeader unit="primaryHeader" />
        <DateHeader
          className="days"
          unit="day" />
      </TimelineHeaders>
      <CursorMarker>
        {
          ({ styles, date }) => {
            return (
              <div style={ { ...styles, backgroundColor: "rgba(136, 136, 136, 0.5)", color: "#888" } }>
                <div className="rt-marker__label">
                  <div className="rt-marker__content">
                    { moment(date).format("DD MMM HH:mm") }
                  </div>
                </div>
              </div>
            )
          }
        }
      </CursorMarker>
    </Timeline>
  ) : null
}