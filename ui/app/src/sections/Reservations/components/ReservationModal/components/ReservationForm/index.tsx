import { CalculatorOutlined, EyeInvisibleOutlined, EyeOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { Button, DatePicker, Form, FormInstance, Input, Select, Typography } from "antd"
import { Store } from "antd/lib/form/interface"
import moment, { Moment } from "moment"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { FormHelper } from "../../../../../../lib/components/FormHelper"
import { ReservationFormHelper } from "../../../../../../lib/components/ReservationFormHelper"
import { dateFormat } from "../../../../../../lib/Constants"
import { ReservationInput } from "../../../../../../lib/graphql/globalTypes"
import { Guests, Guests_guests } from "../../../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates, Roommates_roommates } from "../../../../../../lib/graphql/queries/Roommates/__generated__/Roommates"
import { Suites_suites } from "../../../../../../lib/graphql/queries/Suites/__generated__/Suites"
import { Prices } from "../../../../../../lib/Prices"
import { IReservation, OptionsType, ReservationInputExtended, ReservationTypeKey } from "../../../../../../lib/Types"
import { Roommates as RoommatesItem } from "../Roommates"

interface Props {
  form: FormInstance
  guest?: Guests_guests
  guestsData?: Guests
  openRoommateDrawer: () => void
  reservation?: IReservation
  roommatesData?: Roommates
  selectGuest: (guestId: string) => void
  suite?: Suites_suites
}

export const ReservationForm = ({
  form,
  guest,
  guestsData,
  openRoommateDrawer,
  reservation,
  roommatesData,
  selectGuest,
  suite
}: Props) => {

  const { t } = useTranslation()

  const [ additionalInfoVisible, setAdditionalInfoVisible ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const [ pricesVisible, setPricesVisible ] = useState<boolean>(false)

  const initialValues: Store & { type?: ReservationTypeKey } = reservation !== undefined ? {
    dates: [ reservation.fromDate, reservation.toDate ],
    guest: reservation.guest === undefined ? null : reservation.guest.id,
    meal: reservation.meal,
    notes: reservation.notes,
    priceAccommodation: reservation.priceAccommodation,
    priceExtra: reservation.priceAccommodation,
    priceMeal: reservation.priceMeal,
    priceMunicipality: reservation.priceMunicipality,
    priceTotal: reservation.priceTotal,
    purpose: reservation.purpose,
    roommates: [],
    type: reservation.type
  } : { type: "NONBINDING" }

  const formLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  }

  const getReservationPrices = (): ReservationInput => {
    const formData = form.getFieldsValue(true)
    const roommates: Roommates_roommates[] = []
    const formDates: Array<Moment> = form.getFieldValue("dates")
    let from, to: Moment

    if (formDates === null) {
      from = moment()
      to = moment()
    } else {
      from = formDates[ 0 ]
      to = formDates[ 1 ]
    }

    const data: ReservationInput = {
      fromDate: from.format(dateFormat),
      guestId: formData.guest,
      meal: formData.meal,
      toDate: to.format(dateFormat)
    }

    roommatesData?.roommates?.forEach(roommate => {
      if (roommate !== undefined && roommate !== null) {
        roommates.push(roommate)
      }
    })
    data.roommates = roommates
    return data
  }

  const calculatePrices = () => {
    if (suite !== undefined && reservation !== undefined) {
      const input: ReservationInput & ReservationInputExtended = getReservationPrices()
      input.suite = suite
      input.roommates = []
      if (input.guestId !== undefined && input.guestId !== null) {
        const guest = guestsData?.guests?.find(guest => guest?.id === input.guestId)
        if (guest !== null) {
          input.guest = guest
        }
      }
      form.setFieldsValue(Prices.calculatePrice(input))
    }
  }

  useEffect(() => {
    if (guestsData !== undefined && guestsData.guests !== null) {
      const options: OptionsType[] = []
      guestsData.guests.forEach((guest: Guests_guests | null) => {
        if (guest !== null) {
          options.push({
            label: `${ guest.name } ${ guest.surname }`,
            value: guest.id
          })
        }
      })
      setGuestOptions(options)
    }
  }, [ guestsData ])

  return (
    <Form
      form={ form }
      initialValues={ initialValues }
      { ...formLayout }>
      <Form.Item
        label={ t("reservations.date") }
        name="dates"
        required>
        <DatePicker.RangePicker
          format={ dateFormat }
          showTime />
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("guests.name") }
        name="guest"
        required
        rules={ [
          {
            message: t("forms.choose-guest"),
            required: true
          }
        ] }>
        <Select
          filterOption={ (input, option): boolean => {
            const match = option?.label?.toString().toLowerCase().indexOf(input.toLowerCase())
            return match !== undefined && match >= 0
          } }
          onChange={ selectGuest }
          options={ guestOptions }
          showSearch />
      </Form.Item>
      <RoommatesItem
        guest={ guest }
        roommates={ roommatesData } />
      <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
        <Button
          block
          disabled={ guest === undefined }
          icon={ <UsergroupAddOutlined /> }
          onClick={ openRoommateDrawer }
          type="dashed">
          { t("guests.roommate") }
        </Button>
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("reservations.type") }
        name="type"
        required
        rules={ [ ReservationFormHelper.getRequiredRule(t("reservations.choose-type")) ] }>
        <Select
          options={ ReservationFormHelper.reservationOptions } />
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("reservations.meal") }
        name="meal"
        required
        rules={ [ FormHelper.requiredRule(t("forms.field-required")) ] }>
        <Select options={ ReservationFormHelper.mealOptions } />
      </Form.Item>
      <Form.Item
        hidden={ !additionalInfoVisible }
        label={ t("reservations.purpose") }
        name="purpose">
        <Input placeholder={ t("reservations.purpose") } />
      </Form.Item>
      <Form.Item
        hidden={ !additionalInfoVisible }
        label={ t("reservations.notes") }
        name="notes">
        <Input.TextArea
          placeholder={ t("forms.enter-text") }
          allowClear />
      </Form.Item>
      <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
        <Button
          block
          onClick={ () => setAdditionalInfoVisible(!additionalInfoVisible) }
          type="dashed"
          icon={ additionalInfoVisible ? <EyeInvisibleOutlined /> : <EyeOutlined /> }>
          { additionalInfoVisible ? t("reservations.hide-info") : t("reservations.show-info") }
        </Button>
      </Form.Item>
      {/* @TODO: add tooltips explaining price calculation */ }
      <Form.Item
        hidden={ !pricesVisible }
        label={ t("reservations.price-room") }>
        <Typography.Text>
          <strong>
            { suite?.priceBase } { t("rooms.currency") }
          </strong>
        </Typography.Text>
      </Form.Item>
      <Form.Item
        hidden={ !pricesVisible }
        label={ t("reservations.price-accommodation") }
        name="priceAccommodation">
        <Input addonBefore={ t("rooms.currency") } type="number" />
      </Form.Item>
      <Form.Item
        hidden={ !pricesVisible }
        label={ t("reservations.price-extra") }
        name="priceExtra">
        <Input addonBefore={ t("rooms.currency") } type="number" />
      </Form.Item>
      <Form.Item
        hidden={ !pricesVisible }
        label={ t("reservations.price-meal") }
        name="priceMeal">
        <Input addonBefore={ t("rooms.currency") } type="number" />
      </Form.Item>
      <Form.Item
        hidden={ !pricesVisible }
        label={ t("reservations.price-municipality") }
        name="priceMunicipality">
        <Input addonBefore={ t("rooms.currency") } type="number" />
      </Form.Item>
      <Form.Item
        hidden={ !pricesVisible }
        label={ <strong>{ t("reservations.price-total") }</strong> }
        name="priceTotal">
        <Input addonBefore={ t("rooms.currency") } type="number" />
      </Form.Item>
      <Form.Item
        hidden={ !pricesVisible }
        wrapperCol={ { offset: 8, span: 16 } }>
        <Button
          block
          icon={ <CalculatorOutlined /> }
          onClick={ calculatePrices }>
          { t("reservations.calculate-prices") }
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
        <Button
          block
          onClick={ () => setPricesVisible(!pricesVisible) }
          type="dashed"
          icon={ pricesVisible ? <EyeInvisibleOutlined /> : <EyeOutlined /> }>
          { pricesVisible ? t("reservations.hide-prices") : t("reservations.show-prices") }
        </Button>
      </Form.Item>
    </Form>
  )
}