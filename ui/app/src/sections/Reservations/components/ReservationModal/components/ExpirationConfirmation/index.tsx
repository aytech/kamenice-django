import { Alert } from "antd"
import moment from "moment"
import { useTranslation } from "react-i18next"
import { IReservation } from "../../../../../../lib/Types"

interface Props {
  reservation?: IReservation
}

export const ExpirationConfirmation = ({
  reservation
}: Props) => {

  const { t } = useTranslation()

  const isExpired = (): boolean => {
    if (
      reservation === undefined
      || reservation.expired === null) {
      return false // Reservation value is not set
    }
    // Leave 15 minutes delay for reservation validity
    const diff = moment().diff(reservation.expired) // difference between now and validity
    const validityDelay = (15 * 1000) * 60

    if ((diff - validityDelay) > 0) {
      return true
    }
    return false
  }

  return isExpired() === true ? (
    <Alert
      className="reservation-info"
      message={ t("reservations.expired-info") }
      type="error" />
  ) : null
}