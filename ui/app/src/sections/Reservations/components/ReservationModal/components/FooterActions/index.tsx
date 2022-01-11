import { CloseCircleOutlined, NotificationOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useTranslation } from "react-i18next";
import { guestDrawerOpen, selectedGuest } from "../../../../../../cache";
import { IReservation } from "../../../../../../lib/Types";

interface RemoveProps {
  deleteReservation: (reservationId: string) => void
  reservation?: IReservation
}

interface ConfirmationProps {
  note?: string,
  reservation?: IReservation
  send: (reservation: IReservation, note?: string) => void
  setNote: (note: string) => void
}

interface SubmitProps {
  reservation?: IReservation
  submit: () => void
}

export const RemoveButton = ({
  deleteReservation,
  reservation
}: RemoveProps) => {

  const { t } = useTranslation()

  return reservation !== undefined
    && reservation.id !== undefined ? (
    <Popconfirm
      cancelText={ t("no") }
      okText={ t("yes") }
      onConfirm={ () => {
        if (reservation.id !== undefined) {
          deleteReservation(String(reservation.id))
        }
      } }
      title={ `${ t("reservations.remove") }?` }>
      <Tooltip
        placement="top"
        title={ t("delete") }>
        <Button
          block
          className="action delete"
          danger
          icon={ <CloseCircleOutlined /> } />
      </Tooltip>
    </Popconfirm>
  ) : null
}

export const SendConfirmationButton = ({
  note,
  reservation,
  send,
  setNote
}: ConfirmationProps) => {

  const { t } = useTranslation()

  const tooltip = () => {
    if (reservation?.type === "INQUIRY") {
      return t("reservations.send-inquiry-response", { email: reservation.guest?.email })
    }
    if (reservation?.type === "NONBINDING") {
      return t("reservations.send-confirmation-confirm", { email: reservation.guest?.email })
    }
  }

  return reservation !== undefined
    && reservation.id !== undefined
    && reservation.guest?.email !== undefined
    && reservation.guest.email !== null
    && (reservation.type === "NONBINDING" || reservation.type === "INQUIRY") ? (
    <Popconfirm
      cancelText={ t("no") }
      okText={ t("yes") }
      onConfirm={ () => send(reservation, note) }
      title={ (
        <>
          <p>
            { tooltip() }
          </p>
          <TextArea
            rows={ 3 }
            placeholder={ t("reservations.email-additional-info") }
            onChange={ (event) => { setNote(event.target.value) } }
            value={ note } />
        </>
      ) }>
      <Tooltip
        placement="top"
        title={ t("reservations.send-confirmation-tooltip") }>
        <Button
          block
          className="action confirm"
          icon={ <NotificationOutlined /> } />
      </Tooltip>
    </Popconfirm>
  ) : null
}

export const AddGuestButton = () => {

  const { t } = useTranslation()

  return (
    <Tooltip
      placement="top"
      title={ t("guests.add") }>
      <Button
        block
        className="action add"
        id="add-guest"
        icon={ <UserAddOutlined /> }
        onClick={ () => {
          selectedGuest(null)
          guestDrawerOpen(true)
        } } />
    </Tooltip>
  )
}

export const SubmitButton = ({
  reservation,
  submit
}: SubmitProps) => {

  const { t } = useTranslation()

  return (
    <Tooltip
      placement="top"
      title={ (reservation !== undefined && reservation.id !== undefined) ? t("forms.update") : t("forms.save") }>
      <Button
        block
        className="action submit"
        id="submit-reservation"
        icon={ <SaveOutlined /> }
        onClick={ submit }
        type="primary" />
    </Tooltip>
  )
}