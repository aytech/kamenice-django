import { Alert, Button, Space, Tooltip } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { useTranslation } from "react-i18next"
import { IReservation } from "../../../../../../lib/Types"

interface Props {
  cancel: () => void
  message?: string
  note?: string,
  reservation?: IReservation
  send: (reservation?: IReservation, note?: string) => void
  setNote: (note: string) => void,
  visible: boolean
}

export const Confirmation = ({
  cancel,
  message,
  note,
  reservation,
  send,
  setNote,
  visible
}: Props) => {

  const { t } = useTranslation()

  return visible === true && message !== undefined ? (
    <Alert
      className="reservation-info"
      message={ (
        <>
          <p>{ message }</p>
          <p>
            <TextArea
              rows={ 3 }
              placeholder={ t("reservations.email-additional-info") }
              onChange={ (event) => { setNote(event.target.value) } }
              value={ note } />
          </p>
          <Space
            className="fill-width centered"
            direction="horizontal">
            <Tooltip
              title={ t("reservations.send-ok-info") }
              placement="bottom">
              <Button
                onClick={ () => send(reservation, note) }
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
        </>
      ) }
      type="success" />
  ) : null
}