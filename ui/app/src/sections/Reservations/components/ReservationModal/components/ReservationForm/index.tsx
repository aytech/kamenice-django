import { CalculatorOutlined, EyeInvisibleOutlined, EyeOutlined, MinusCircleOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { useLazyQuery } from "@apollo/client"
import { Button, DatePicker, Form, FormInstance, Input, Select, Space, Spin, Tooltip, Typography } from "antd"
import { Store } from "antd/lib/form/interface"
import moment, { Moment } from "moment"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { appSettings, selectedSuite } from "../../../../../../cache"
import { FormHelper } from "../../../../../../lib/components/FormHelper"
import { ReservationFormHelper } from "../../../../../../lib/components/ReservationFormHelper"
import { dateFormat } from "../../../../../../lib/Constants"
import { Guests, Guests_guests } from "../../../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { CALCULATE_PRICE } from "../../../../../../lib/graphql/queries/Reservation"
import { CalculateReservationPrice, CalculateReservationPriceVariables } from "../../../../../../lib/graphql/queries/Reservation/__generated__/CalculateReservationPrice"
import { IReservation, OptionsType, ReservationTypeKey } from "../../../../../../lib/Types"
import "./styles.css"

interface Props {
  form: FormInstance
  guestsData?: Guests
  reservation?: IReservation
}

export const ReservationForm = ({
  form,
  guestsData,
  reservation
}: Props) => {

  const { t } = useTranslation()

  const [ additionalInfoVisible, setAdditionalInfoVisible ] = useState<boolean>(false)
  const [ addRoommateTooltip, setAddRoommateTooltip ] = useState<string>(t("tooltips.add-roommate"))
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const [ pricesVisible, setPricesVisible ] = useState<boolean>(false)
  const [ roommateOptions, setRoommateOptions ] = useState<OptionsType[]>([])
  const [ suiteCapacity, setSuiteCapacity ] = useState<number>(0)

  const [ calculatePrices, { loading: calculatePriceLoading } ] = useLazyQuery<CalculateReservationPrice, CalculateReservationPriceVariables>(CALCULATE_PRICE, {
    fetchPolicy: "no-cache",
    onCompleted: (data: CalculateReservationPrice) => {
      if (data.price !== null) {
        form.setFieldsValue({
          priceAccommodation: data.price.accommodation,
          priceMeal: data.price.meal,
          priceMunicipality: data.price.municipality,
          priceTotal: data.price.total
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
    priceAccommodation: reservation.priceAccommodation,
    priceMeal: reservation.priceMeal,
    priceMunicipality: reservation.priceMunicipality,
    priceTotal: reservation.priceTotal,
    purpose: reservation.purpose,
    roommates: reservation.roommates,
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

  const roommateValidator = [
    {
      message: t("forms.guest-selected"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        const duplicates: Array<{ id: number }> = form.getFieldValue("roommates").filter((id: { id: number } | undefined) => {
          return id !== undefined && id.id === value
        })
        if (duplicates === undefined || duplicates.length <= 1) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail roommate validation, duplicate value"))
      }
    },
    {
      message: t("forms.guest-duplicate"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        if (form.getFieldValue("guest") !== value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail roommate validation, equals to guest"))
      }
    }
  ]

  const getReservationDuration = (): number => {
    const formDates: Array<Moment> = form.getFieldValue("dates")
    if (formDates !== null) {
      const startDate = moment(formDates[ 0 ])
      const endDate = moment(formDates[ 1 ])
      return Math.ceil(moment.duration(endDate.diff(startDate)).asDays())
    }
    // @todo: replace with default constant 
    return 1
  }

  const getGuestsIds = (): Array<number> => {
    const guest = form.getFieldValue("guest")
    const roommates = form.getFieldValue("roommates")
      .map((roommate: any) => Number(roommate.id))
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
    setRoommateOptions(guestOptions.filter(option => option.value !== String(guestId)))
  }

  const updateRoomCapacity = useCallback((roommatesLength: number) => {
    if (suiteCapacity <= roommatesLength) {
      setAddRoommateTooltip(t("tooltips.room-capacity-full"))
    } else {
      setAddRoommateTooltip(t("tooltips.add-roommate"))
    }
  }, [ suiteCapacity, t ])

  useEffect(() => {
    // Define guest and roommate options
    const options: OptionsType[] = []
    guestsData?.guests?.forEach((guest: Guests_guests | null) => {
      if (guest !== null) {
        options.push({
          label: `${ guest.name } ${ guest.surname }`,
          value: guest.id
        })
      }
    })
    setGuestOptions(options)
    setRoommateOptions(options.filter(option => option.value !== reservation?.guest?.id))
    // Define room capacity
    const beds = reservation?.suite.numberBeds
    const bedsExtra = reservation?.suite.numberBedsExtra
    if (beds !== undefined && beds !== null) {
      let capacity: number = beds
      if (bedsExtra !== undefined && bedsExtra !== null) {
        capacity += bedsExtra
      }
      setSuiteCapacity(capacity - 1) // -1 as main guest occupies one bed
    }
    // When opening existing reservation, update
    // tooltip for adding guests, if necessary
    if (reservation?.roommates?.length !== undefined) {
      updateRoomCapacity(reservation.roommates.length)
    }
  }, [ guestsData, reservation, updateRoomCapacity ])


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
      <Form.Item
        wrapperCol={ { offset: 8, span: 16 } }>
        <Form.List name="roommates">
          { (fields, { add, remove }) => (
            <>
              { fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  align="baseline"
                  className="roommate-list"
                  key={ key }>
                  <Form.Item
                    hasFeedback
                    { ...restField }
                    fieldKey={ [ fieldKey, 'first' ] }
                    name={ [ name, "id" ] }
                    rules={ roommateValidator }>
                    <Select
                      options={ roommateOptions }
                      showSearch />
                  </Form.Item>
                  <MinusCircleOutlined onClick={ () => {
                    remove(name)
                    updateRoomCapacity(fields.length - 1) // fields length seems not updated immediately
                    form.validateFields()
                  } } />
                </Space>
              )) }
              <Tooltip title={ addRoommateTooltip }>
                <Button
                  disabled={
                    fields.length >= roommateOptions.length
                    || fields.length >= suiteCapacity
                  }
                  type="dashed"
                  onClick={ () => {
                    add()
                    updateRoomCapacity(fields.length + 1) // fields length seems not updated immediately
                  } }
                  block
                  icon={ <UsergroupAddOutlined /> }>
                  { t("reservations.add-roommate") }
                </Button>
              </Tooltip>
            </>
          ) }
        </Form.List>
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
        label={ t("guests.paying") }
        name="paying"
        tooltip={ t("tooltips.paying-guest") }>
        <Select
          allowClear
          filterOption={ (input, option): boolean => {
            const match = option?.label?.toString().toLowerCase().indexOf(input.toLowerCase())
            return match !== undefined && match >= 0
          } }
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
      <Spin
        spinning={ pricesVisible && calculatePriceLoading }>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-room") }>
          <Typography.Text>
            <strong>
              { selectedSuite()?.priceBase } { t("currency") }
            </strong>
          </Typography.Text>
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-accommodation") }
          name="priceAccommodation">
          <Input addonBefore={ t("currency") } type="number" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-meal") }
          name="priceMeal">
          <Input addonBefore={ t("currency") } type="number" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ t("reservations.price-municipality") }
          name="priceMunicipality">
          <Input addonBefore={ t("currency") } type="number" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          label={ <strong>{ t("reservations.price-total") }</strong> }
          name="priceTotal">
          <Input addonBefore={ t("currency") } type="number" />
        </Form.Item>
        <Form.Item
          hidden={ !pricesVisible }
          wrapperCol={ { offset: 8, span: 16 } }>
          <Button
            block
            icon={ <CalculatorOutlined /> }
            onClick={ () => {
              const selectedSuiteId = selectedSuite()?.id
              if (selectedSuiteId !== undefined) {
                calculatePrices({
                  variables: {
                    data: {
                      guests: getGuestsIds(),
                      meal: form.getFieldValue('meal'),
                      numberDays: getReservationDuration(),
                      settingsId: Number(appSettings()?.id),
                      suiteId: Number(selectedSuiteId)
                    }
                  }
                })
              }
            } }>
            { t("reservations.calculate-prices") }
          </Button>
        </Form.Item>
      </Spin>
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