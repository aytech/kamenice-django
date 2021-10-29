import { CloseCircleOutlined, NotificationOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { guestDrawerOpen, selectedGuest } from "../../../../../../cache";
import { IReservation } from "../../../../../../lib/Types";

interface RemoveProps {
  deleteReservation: (reservationId: string) => void
  reservation?: IReservation
}

interface ConfirmationProps {
  reservation?: IReservation
  send: (reservation: IReservation) => void
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
        title={ t("forms.delete") }>
        <Button
          className="action delete"
          danger
          icon={ <CloseCircleOutlined /> } />
      </Tooltip>
    </Popconfirm>
  ) : null
}

export const SendConfirmationButton = ({
  reservation,
  send
}: ConfirmationProps) => {

  const { t } = useTranslation()

  return reservation !== undefined
    && reservation.id !== undefined
    && reservation.guest?.email !== undefined
    && reservation.guest.email !== null ? (
    <Popconfirm
      cancelText={ t("no") }
      okText={ t("yes") }
      onConfirm={ () => send(reservation) }
      title={ t("reservations.send-confirmation-confirm", { email: reservation.guest?.email }) }>
      <Tooltip
        placement="top"
        title={ t("reservations.send-confirmation-tooltip") }>
        <Button
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
        className="action add"
        id="add-main-guest"
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
        className="action submit"
        icon={ <SaveOutlined /> }
        onClick={ submit }
        type="primary" />
    </Tooltip>
  )
}