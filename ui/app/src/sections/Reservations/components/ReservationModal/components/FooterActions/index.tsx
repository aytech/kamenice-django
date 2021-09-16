import { CloseCircleOutlined, NotificationOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { IReservation } from "../../../../../../lib/Types";

interface RemoveProps {
  deleteReservation: (reservationId: string) => void
  reservation?: IReservation
}

interface ConfirmationProps {
  reservation?: IReservation
}

interface AddGuestProps {
  openGuestDrawer: () => void
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

  return reservation !== undefined && reservation.id !== undefined ? (
    <Popconfirm
      cancelText={ t("no") }
      key="remove"
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
  reservation
}: ConfirmationProps) => {

  const { t } = useTranslation()

  return (
    <Tooltip
      placement="top"
      title={ t("reservations.send-confirmation") }>
      <Button
        className="action confirm"
        key="confirmation"
        icon={ <NotificationOutlined /> }
        onClick={ () => console.log('sending confirmation for ', reservation) } />
    </Tooltip>
  )
}

export const AddGuestButton = ({
  openGuestDrawer
}: AddGuestProps) => {

  const { t } = useTranslation()

  return (
    <Tooltip
      placement="top"
      title={ t("guests.add") }>
      <Button
        className="action add"
        key="guest"
        icon={ <UserAddOutlined /> }
        onClick={ openGuestDrawer } />
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
        key="create"
        icon={ <SaveOutlined /> }
        onClick={ submit }
        type="primary" />
    </Tooltip>
  )
}