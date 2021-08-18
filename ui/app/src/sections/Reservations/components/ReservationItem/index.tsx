import { Popover } from "antd"
import { Moment } from "moment"
import { ReactCalendarItemRendererProps, TimelineItem } from "react-calendar-timeline"
import Text from "antd/lib/typography/Text"
import { CustomItemFields } from "../../../../lib/Types"

export const ReservationItem = ({ item, itemContext, getItemProps, getResizeProps }: ReactCalendarItemRendererProps<TimelineItem<CustomItemFields, Moment>>) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
  return item.itemProps !== undefined ? (
    <div { ...getItemProps(item.itemProps) }>
      { itemContext.useResizeHandle ? <div { ...leftResizeProps } /> : '' }
      <Popover title={ item.title } content={ (
        <>
          <div style={ { color: item.color, fontWeight: 700 } }>
            { item.type }
          </div>
          <div>
            Od: <strong>{ item.start_time.format("DD MMM HH:mm") }</strong>
          </div>
          <div>
            Do: <strong>{ item.end_time.format("DD MMM HH:mm") }</strong>
          </div>
        </>
      ) }>
        <div
          className="rct-item-content"
          style={ { maxHeight: `${ itemContext.dimensions.height }` } }>
          <Text strong>{ item.title }</Text>
        </div>
      </Popover>
      { itemContext.useResizeHandle ? <div { ...rightResizeProps } /> : '' }
    </div>
  ) : null
}