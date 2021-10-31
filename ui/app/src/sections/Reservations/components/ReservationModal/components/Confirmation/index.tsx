import { Alert, Button, Space, Tooltip } from "antd"
import { useTranslation } from "react-i18next"
import { IReservation } from "../../../../../../lib/Types"

interface Props {
  cancel: () => void
  message?: string
  reservation?: IReservation
  send: (reservation?: IReservation) => void
  visible: boolean
}

export const Confirmation = ({
  cancel,
  message,
  reservation,
  send,
  visible
}: Props) => {

  const { t } = useTranslation()

  return visible === true && message !== undefined ? (
    <Alert
      action={
        <Space direction="horizontal">
          <Tooltip
            title={ t("reservations.send-ok-info") }
            placement="bottom">
            <Button
              onClick={ () => send(reservation) }
              size="small"
              type="primary">
              { t("yes") }
            </Button>
          </Tooltip>
          <Tooltip
            placement="bottom"
            title={ t("reservations.send-cancel-info") }>
            <Button
              danger
              id="reservation-notification-cancel"
              onClick={ cancel }
              size="small">
              { t("no") }
            </Button>
          </Tooltip>
        </Space>
      }
      className="reservation-info"
      message={ message }
      type="success" />
  ) : null
}