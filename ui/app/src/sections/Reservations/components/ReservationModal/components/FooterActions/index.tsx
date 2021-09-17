import { CloseCircleOutlined, NotificationOutlined, SaveOutlined, UserAddOutlined } from "@ant-design/icons";
import { ApolloError, useMutation } from "@apollo/client";
import { Button, message, Popconfirm, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { SEND_CONFIRMATION } from "../../../../../../lib/graphql/mutations/Reservation";
import { SendConfirmation, SendConfirmationVariables } from "../../../../../../lib/graphql/mutations/Reservation/__generated__/SendConfirmation";
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

  const [ sendConfirmation, { loading } ] = useMutation<SendConfirmation, SendConfirmationVariables>(SEND_CONFIRMATION, {
    onCompleted: () => message.success(t("reservations.confirmation-sent", { email: reservation?.guest?.email })),
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  return reservation !== undefined && reservation.id !== undefined ? (
    <Popconfirm
      cancelText={ t("no") }
      okText={ t("yes") }
      onConfirm={ () => {
        if (reservation.id !== undefined) {
          sendConfirmation({ variables: { reservationId: String(reservation.id) } })
        }
      } }
      title={ t("reservations.send-confirmation-confirm", { email: reservation.guest?.email }) }>
      <Tooltip
        placement="top"
        title={ t("reservations.send-confirmation-tooltip") }>
        <Button
          className="action confirm"
          icon={ <NotificationOutlined /> }
          loading={ loading } />
      </Tooltip>
    </Popconfirm>
  ) : null
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
        icon={ <SaveOutlined /> }
        onClick={ submit }
        type="primary" />
    </Tooltip>
  )
}