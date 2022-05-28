import { CalculatorOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import { useLazyQuery } from "@apollo/client"
import { Button, DatePicker, Form, FormInstance, Input, Select, Spin, Typography } from "antd"
import { Store } from "antd/lib/form/interface"
import { ChangeEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { reservationMealOptions, reservationTypeOptions, roommateOptions } from "../../../../../../cache"
import { FormHelper } from "../../../../../../lib/components/FormHelper"
import { NumberHelper } from "../../../../../../lib/components/NumberHelper"
import { dateFormat } from "../../../../../../lib/Constants"
import { Guests, Guests_guests } from "../../../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { CALCULATE_PRICE } from "../../../../../../lib/graphql/queries/Reservation"
import { CalculateReservationPrice, CalculateReservationPriceVariables } from "../../../../../../lib/graphql/queries/Reservation/__generated__/CalculateReservationPrice"
import { IReservation, OptionsType, ReservationTypeKey } from "../../../../../../lib/Types"
import { ReservationFormSuite } from "./components/ReservationFormSuite"
import { ReservationRoommates } from "./components/ReservationRoommates"
import "./styles.css"

interface Props {
  form: FormInstance
  getReservationDays: () => number
  guestsData?: Guests
  reservation?: IReservation
}

export const ReservationForm = ({
  form,
  getReservationDays,
  guestsData,
  reservation
}: Props) => {

  const { t } = useTranslation()

  const [ additionalInfoVisible, setAdditionalInfoVisible ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const [ pricesVisible, setPricesVisible ] = useState<boolean>(false)
  const [ selectedReservationType, setSelectedReservationType ] = useState<ReservationTypeKey>()
  const [ suiteCapacity, setSuiteCapacity ] = useState<number>(0)

  const [ calculatePrices, { loading: calculatePriceLoading } ] = useLazyQuery<CalculateReservationPrice, CalculateReservationPriceVariables>(CALCULATE_PRICE, {
    fetchPolicy: "no-cache",
    onCompleted: (data: CalculateReservationPrice) => {
      if (data.price !== null) {
        form.setFieldsValue({
          priceAccommodation: NumberHelper.formatCurrency(data.price.accommodation),
          priceMeal: NumberHelper.formatCurrency(data.price.meal),
          priceMunicipality: NumberHelper.formatCurrency(data.price.municipality),
          priceTotal: NumberHelper.formatCurrency(data.price.total)
        })
      }
    }
  })

  const initialValues: Store & { type?: ReservationTypeKey } = reservation !== undefined ? {
    dates: [ reservation.fromDate, reservation.toDate ],
    expired: reservation.expired,
    guest: reservation.guest === undefined ? null : reservation.guest.id,
    meal: reservation.meal,
    notes: reservation.notes,
    paying: reservation.payingGuest === undefined || reservation.payingGuest === null ? null : reservation.payingGuest.id,
    priceAccommodation: NumberHelper.formatCurrency(reservation.price?.accommodation),
    priceMeal: NumberHelper.formatCurrency(reservation.price?.meal),
    priceMunicipality: NumberHelper.formatCurrency(reservation.price?.municipality),
    priceTotal: NumberHelper.formatCurrency(reservation.price?.total),
    purpose: reservation.purpose,
    roommates: reservation.roommates,
    suite: reservation.suite?.id,
    suites: reservation.extraSuites,
    type: reservation.type
  } : { type: selectedReservationType }

  const formLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  }

  const getFormGuests = (): Array<number> => {
    const guest = form.getFieldValue("guest")
    const roommates: number[] = []
    form.getFieldValue("roommates")?.forEach((roommate: any) => roommates.push(Number(roommate.id)))
    return [ Number(guest), ...roommates ]
  }

  const ExpirationItem = () => reservation?.type === "NONBINDING" ? (
    <Form.Item
      label={ t("reservations.expiration") }
      name="expired">
      <DatePicker
        className="select-expiration"
        placeholder={ t("reservations.expiration-placeholder") } />
    </Form.Item>
  ) : null

  const selectGuest = (guestId: number) => {
    roommateOptions(guestOptions.filter(option => option.value !== String(guestId)))
  }

  const onPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue(FormHelper.updatePrice({
      accommodation: form.getFieldValue("priceAccommodation"),
      meal: form.getFieldValue("priceMeal"),
      municipality: form.getFieldValue("priceMunicipality")
    }, event.target.id))
  }

  useEffect(() => {
    // Define guest and roommate options
    const options: OptionsType[] = []
    guestsData?.guests?.forEach((guest: Guests_guests | null) => {
      if (guest !== null) {
        options.push({
          label: `${ guest.surname } ${ guest.name }`,
          value: guest.id
        })
      }
    })
    setGuestOptions(options)
    roommateOptions(options.filter(option => option.value !== reservation?.guest?.id))
    // Define room capacity
    const beds = reservation?.suite?.numberBeds
    const bedsExtra = reservation?.suite?.numberBedsExtra
    if (beds !== undefined && beds !== null) {
      let capacity: number = beds
      if (bedsExtra !== undefined && bedsExtra !== null) {
        capacity += bedsExtra
      }
      setSuiteCapacity(capacity - 1) // -1 as main guest occupies one bed
    }
    setSelectedReservationType(reservation?.type)
    form.resetFields()
  }, [ form, guestsData, reservation ])

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
        label={ t("guests.main") }
        name="guest"
        required
        rules={ [ {
          message: t("forms.choose-guest"),
          required: true
        } ] }>
        <Select
          filterOption={ FormHelper.searchFilter }
          onChange={ selectGuest }
          options={ guestOptions }
          showSearch />
      </Form.Item>
      <ReservationRoommates
        form={ form }
        suiteCapacity={ suiteCapacity } />
      <ReservationFormSuite
        form={ form }
        selectedType={ selectedReservationType }
        setSuiteCapacity={ setSuiteCapacity } />
      <Form.Item
        hasFeedback
        label={ t("reservations.type") }
        name="type"
        required
        rules={ [ FormHelper.requiredRule(t("reservations.choose-type")) ] }>
        <Select
          id="select-reservation-type"
          onChange={ setSelectedReservationType }
          options={ reservationTypeOptions() } />
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("reservations.meal") }
        name="meal"
        required
        rules={ [ FormHelper.requiredRule(t("forms.field-required")) ] }>
        <Select
          id="select-reservation-meal"
          options={ reservationMealOptions() } />
      </Form.Item>
      <Form.Item
        label={ t("guests.paying") }
        name="paying"
        tooltip={ t("tooltips.paying-guest") }>
        <Select
          allowClear
          filterOption={ FormHelper.searchFilter }
          options={ guestOptions }
          showSearch />
      </Form.Item>
      <ExpirationItem />
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
      <Form.Item wrapperCol={ {
        lg: { offset: 8, span: 16 },
        md: { offset: 8, span: 16 },
        sm: { offset: 8, span: 16 }
      } }>
        <Button
          block
          onClick={ () => setAdditionalInfoVisible(!additionalInfoVisible) }
          type="dashed"
          icon={ additionalInfoVisible ? <EyeInvisibleOutlined /> : <EyeOutlined /> }>
          { additionalInfoVisible ? t("reservations.hide-info") : t("reservations.show-info") }
        </Button>
      </Form.Item>
      <Spin
        spinning={ pricesVisible && calculatePriceLoading }>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-room") }>
          <Typography.Text>
            <strong>
              { NumberHelper.formatCurrency(reservation?.price?.suite?.priceBase) } { t("currency") }
            </strong>
          </Typography.Text>
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-accommodation") }
          name="priceAccommodation">
          <Input
            addonBefore={ t("currency") }
            onChange={ onPriceChange }
            type="text" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-meal") }
          name="priceMeal">
          <Input
            addonBefore={ t("currency") }
            onChange={ onPriceChange }
            type="text" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-municipality") }
          name="priceMunicipality">
          <Input
            addonBefore={ t("currency") }
            onChange={ onPriceChange }
            type="text" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ <strong>{ t("reservations.price-total") }</strong> }
          name="priceTotal">
          <Input
            addonBefore={ t("currency") }
            type="text" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          wrapperCol={ {
            lg: { offset: 8, span: 16 },
            md: { offset: 8, span: 16 },
            sm: { offset: 8, span: 16 }
          } }>
          <Button
            block
            icon={ <CalculatorOutlined /> }
            onClick={ () => {
              if (reservation?.suite !== undefined) {
                calculatePrices({
                  variables: {
                    data: {
                      guests: getFormGuests(),
                      meal: form.getFieldValue('meal'),
                      numberDays: getReservationDays(),
                      suiteId: Number(reservation.price?.suite?.id)
                    }
                  }
                })
              }
            } }>
            { t("reservations.calculate-prices") }
          </Button>
        </Form.Item>
      </Spin>
      <Form.Item wrapperCol={ {
        lg: { offset: 8, span: 16 },
        md: { offset: 8, span: 16 },
        sm: { offset: 8, span: 16 }
      } }>
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