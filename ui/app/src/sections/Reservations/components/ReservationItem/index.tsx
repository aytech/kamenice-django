import { Dropdown, Menu, Modal, Popover } from "antd"
import { Moment } from "moment"
import { ReactCalendarItemRendererProps, TimelineItem } from "react-calendar-timeline"
import Text from "antd/lib/typography/Text"
import { CustomItemFields } from "../../../../lib/Types"
import { useTranslation } from "react-i18next"

interface Props {
  onCopy: (itemId: string) => void
  onDelete: (reservationId: string) => void
  onUpdate: (itemId: string) => void
}

export const ReservationItem = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps,
  onCopy,
  onDelete,
  onUpdate
}: ReactCalendarItemRendererProps<TimelineItem<CustomItemFields, Moment>> & Props) => {

  const { t } = useTranslation()

  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()

  const deleteWarn = (reservationId: string) => {
    Modal.confirm({
      title: t("tooltips.delete-reservation-confirm-title"),
      cancelText: t("no"),
      okText: t("yes"),
      onOk: () => onDelete(reservationId)
    })
  }

  return item.itemProps !== undefined ? (
    <div { ...getItemProps(item.itemProps) }>
      { itemContext.useResizeHandle ? <div { ...leftResizeProps } /> : '' }
      <Popover title={ item.title } content={ (
        <>
          <div style={ { color: item.color, fontWeight: 700 } }>
            { t(`reservation-types.${ item.type }`) }
          </div>
          <div>
            { t("from") }: <strong>{ item.start_time.format("DD MMM HH:mm") }</strong>
          </div>
          <div>
            { t("to") }: <strong>{ item.end_time.format("DD MMM HH:mm") }</strong>
          </div>
        </>
      ) }>
        <Dropdown
          overlay={ (
            <Menu>
              <Menu.Item
                key="copy"
                onClick={ () => onCopy(item.id) }>
                { t("copy") }
              </Menu.Item>
              <Menu.Item
                key="update"
                onClick={ () => onUpdate(item.id) }>
                { t("update") }
              </Menu.Item>
              <Menu.Item
                key="delete"
                onClick={ () => deleteWarn(item.reservationId) }>
                { t("delete") }
              </Menu.Item>
            </Menu>
          ) }
          trigger={ [ "contextMenu" ] }>
          <div
            className="rct-item-content"
            style={ { maxHeight: `${ itemContext.dimensions.height }` } }>
            <Text strong>{ item.title }</Text>
          </div>
        </Dropdown>
      </Popover>
      { itemContext.useResizeHandle ? <div { ...rightResizeProps } /> : '' }
    </div>
  ) : null
}