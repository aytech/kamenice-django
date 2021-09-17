import { WarningOutlined } from "@ant-design/icons"
import { Button, Popconfirm } from "antd"
import { useTranslation } from "react-i18next"
import { ReservationGuests_reservationGuests_roommates } from "../../../../../../lib/graphql/queries/ReservationGuests/__generated__/ReservationGuests"

interface Props {
  deleteRoommate: () => void
  roommate?: ReservationGuests_reservationGuests_roommates
  submit: () => void
}

export const Footer = ({
  deleteRoommate,
  roommate,
  submit
}: Props) => {

  const { t } = useTranslation()

  const DeleteButton = () => {
    return roommate !== undefined ? (
      <Popconfirm
        cancelText={ t("no") }
        icon={ <WarningOutlined /> }
        okText={ t("yes") }
        onConfirm={ deleteRoommate }
        title={ t("forms.delete-confirm") }>
        <Button
          danger
          style={ {
            float: "left"
          } }
          type="primary">
          { t('forms.delete') }
        </Button>
      </Popconfirm>
    ) : null
  }

  return (
    <>
      <DeleteButton />
      <Button
        onClick={ submit }
        type="primary">
        { (roommate === undefined || roommate === null) ? t("forms.create") : t("forms.update") }
      </Button>
    </>
  )
}