import { useCallback, useEffect, useState } from "react"
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Space, Spin, Typography } from "antd"
import { Moment } from "moment"
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client"
import { Store } from "rc-field-form/lib/interface"
import { CloseCircleOutlined, CloseOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, MinusCircleOutlined, PlusCircleOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import "./styles.css"
import { IReservation, OptionsType, ReservationInputExtended, ReservationTypeKey } from "../../../../lib/Types"
import { ReservationFormHelper } from "../../../../lib/components/ReservationFormHelper"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { ReservationInput } from "../../../../lib/graphql/globalTypes"
import { dateFormat } from "../../../../lib/Constants"
import { GuestDrawer } from "../../../Guests/components/GuestDrawer"
import { Guests, Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { GUESTS } from "../../../../lib/graphql/queries/Guests"
import { CreateReservation, CreateReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/CreateReservation"
import { CREATE_RESERVATION, DELETE_RESERVATION, UPDATE_RESERVATION } from "../../../../lib/graphql/mutations/Reservation"
import { UpdateReservation, UpdateReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/UpdateReservation"
import { DeleteReservation, DeleteReservationVariables } from "../../../../lib/graphql/mutations/Reservation/__generated__/DeleteReservation"
import { SuitesWithReservations_reservations } from "../../../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { useTranslation } from "react-i18next"
import { Suites_suites } from "../../../../lib/graphql/queries/Suites/__generated__/Suites"
import { Prices } from "../../../../lib/Prices"
import moment from "moment"

interface Props {
  addOrUpdateReservation: (reservation?: SuitesWithReservations_reservations | null) => void
  close: () => void
  isOpen: boolean
  clearReservation: (reservationId?: string | null) => void
  reservation?: IReservation
  suite?: Suites_suites
}

export const ReservationModal = ({
  addOrUpdateReservation,
  close,
  isOpen,
  clearReservation,
  reservation,
  suite
}: Props) => {

  const { t } = useTranslation()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createReservation, { loading: createLoading } ] = useMutation<CreateReservation, CreateReservationVariables>(CREATE_RESERVATION, {
    onCompleted: (data: CreateReservation) => {
      addOrUpdateReservation(data.createReservation?.reservation)
      message.success(t("reservations.created"))
      close()
    },
    onError: networkErrorHandler
  })
  const [ deleteReservation, { loading: deleteLoading } ] = useMutation<DeleteReservation, DeleteReservationVariables>(DELETE_RESERVATION, {
    onCompleted: (data: DeleteReservation) => {
      clearReservation(data.deleteReservation?.reservation?.id)
      message.success(t("reservations.deleted"))
      close()
    },
    onError: networkErrorHandler
  })
  const [ updateReservation, { loading: updateLoading } ] = useMutation<UpdateReservation, UpdateReservationVariables>(UPDATE_RESERVATION, {
    onCompleted: (data: UpdateReservation) => {
      addOrUpdateReservation(data.updateReservation?.reservation)
      message.success(t("reservations.updated"))
      close()
    },
    onError: networkErrorHandler
  })
  const [ getGuests, { loading: guestsLoading, data: guestsData } ] = useLazyQuery<Guests>(GUESTS, {
    onError: networkErrorHandler
  })

  const [ deleteConfirmVisible, setDeleteConfirmVisible ] = useState<boolean>(false)
  const [ guestDrawerOpen, setGuestDrawerOpen ] = useState<boolean>(false)
  const [ guestOptions, setGuestOptions ] = useState<OptionsType[]>([])
  const [ roommateOptions, setRoommateOptions ] = useState<OptionsType[]>([])
  const [ additionalInfoVisible, setAdditionalInfoVisible ] = useState<boolean>(false)
  const [ pricesVisible, setPricesVisible ] = useState<boolean>(false)

  const [ form ] = Form.useForm()

  const getGuestOption = (guest: Guests_guests) => {
    return {
      label: `${ guest.name } ${ guest.surname }`,
      value: guest.id
    }
  }

  const addGuestOption = (guest: Guests_guests) => {
    setGuestOptions(guestOptions.concat(getGuestOption(guest)))
  }

  const initialValues: Store & { type?: ReservationTypeKey } = reservation !== undefined ? {
    dates: [ reservation.fromDate, reservation.toDate ],
    guest: reservation.guest === undefined ? null : reservation.guest.id,
    meal: reservation.meal,
    notes: reservation.notes,
    priceAccommodation: "0.00", // @TODO: calculate
    priceExtra: "0.00", // @TODO: calculate
    priceMeal: "0.00", // @TODO: calculate
    priceMunicipality: "0.00", // @TODO: calculate
    priceTotal: reservation.priceTotal,
    purpose: reservation.purpose,
    roommates: [],
    type: reservation.type
  } : { type: "NONBINDING" }

  const getReservationInput = useCallback((): ReservationInput => {
    const formData = form.getFieldsValue(true)
    const formDates: Array<Moment> = form.getFieldValue("dates")
    let from, to: Moment

    if (formDates === null) {
      from = moment()
      to = moment()
    } else {
      from = formDates[ 0 ]
      to = formDates[ 1 ]
    }

    const roommates = formData.roommates === undefined ? [] :
      Array.from(formData.roommates, (data: { id: number }) => data.id)
    return {
      fromDate: from.format(dateFormat),
      guestId: formData.guest,
      meal: formData.meal,
      notes: formData.notes,
      priceAccommodation: formData.priceAccommodation,
      priceExtra: formData.priceExtra,
      priceMeal: formData.priceMeal,
      priceMunicipality: formData.priceMunicipality,
      priceTotal: formData.priceTotal,
      purpose: formData.purpose,
      roommatesIds: roommates,
      suiteId: reservation !== undefined ? +reservation.suite.id : null,
      toDate: to.format(dateFormat),
      type: formData.type
    }
  }, [ form, reservation ])

  const submitForm = (): void => {
    const variables: ReservationInput = getReservationInput()
    if (reservation !== undefined && reservation.id !== undefined) {
      updateReservation({ variables: { data: { id: String(reservation.id), ...variables } } })
    } else {
      createReservation({ variables: { data: { ...variables } } })
    }
  }

  const guestValidator = [
    {
      message: t("forms.guest-duplicate"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        const roommates: Array<{ id: number }> = form.getFieldValue("roommates")
        if (roommates === undefined || roommates.length === 0) {
          return Promise.resolve()
        }
        const duplicate = roommates.filter((id: { id: number } | undefined) => {
          return id !== undefined && id.id === value
        })
        if (duplicate === undefined || duplicate.length === 0) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail guest validation, equals to roommate"))
      }
    },
    {
      message: t("forms.choose-guest"),
      required: true
    }
  ]

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
      message: t("forms.guest-equals-roommate"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        if (form.getFieldValue("guest") !== value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail roommate validation, equals to guest"))
      }
    }
  ]

  const getRemoveButton = () => {
    return reservation !== undefined && reservation.id !== undefined ? (
      <Popconfirm
        cancelText={ t("no") }
        key="remove"
        okText={ t("yes") }
        onConfirm={ () => {
          if (reservation.id !== undefined) {
            deleteReservation({ variables: { reservationId: String(reservation.id) } })
          }
        } }
        title={ `${ t("reservations.remove") }?` }>
        <Button
          className="cancel-button"
          danger
          icon={ <CloseCircleOutlined /> }>
          { t("forms.delete") }
        </Button>
      </Popconfirm>
    ) : null
  }

  const footerButtons = [
    getRemoveButton(),
    <Button
      key="guest"
      onClick={ () => setGuestDrawerOpen(true) }>
      { t("guests.add") }
    </Button>,
    <Button
      key="create"
      icon={ reservation === undefined ? <PlusCircleOutlined /> : <EditOutlined /> }
      onClick={ () => {
        form.validateFields()
          .then(submitForm)
      } }
      type="primary">
      { (reservation !== undefined && reservation.id !== undefined) ? t("forms.update") : t("forms.save") }
    </Button>
  ]

  const updatePrice = useCallback(() => {
    if (suite !== undefined && reservation !== undefined) {
      const input: ReservationInput & ReservationInputExtended = getReservationInput()
      input.suite = suite
      input.roommates = []
      if (input.guestId !== undefined && input.guestId !== null) {
        input.guest = guestsData?.guests?.find(guest => guest?.id === input.guestId)
      }
      if (input.roommatesIds !== undefined && input.roommatesIds !== null && input.roommatesIds.length > 0) {
        input.roommatesIds.forEach(id => {
          const roommate = guestsData?.guests?.find(guest => guest?.id === String(id))
          if (roommate !== undefined && roommate !== null) {
            input.roommates?.push(roommate)
          }
        })
      }
      form.setFieldsValue(Prices.calculatePrice(input))
    }
  }, [ form, getReservationInput, guestsData, reservation, suite ])

  useEffect(() => {
    // Form instance is created on page load (before modal is open),
    // but the component is rendered only when modal is opened
    if (isOpen === true) {
      form.resetFields()
      getGuests()
      updatePrice()
    }
  }, [ form, getGuests, isOpen, reservation, updatePrice ])

  useEffect(() => {
    if (guestsData !== undefined && guestsData.guests !== null) {
      const options: OptionsType[] = []
      guestsData.guests.forEach((guest: Guests_guests | null) => {
        if (guest !== null) {
          options.push(getGuestOption(guest))
        }
      })
      setGuestOptions(options)
    }
  }, [ guestsData ])

  const formLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  }

  return (
    <>
      <Modal
        className="reservation-modal"
        closeIcon={ (
          <Popconfirm
            onCancel={ () => setDeleteConfirmVisible(false) }
            onConfirm={ () => {
              setDeleteConfirmVisible(false)
              setTimeout(close)
            } }
            title={ t("forms.close-dirty") }
            visible={ deleteConfirmVisible }>
            <CloseOutlined onClick={ () => {
              if (form.isFieldsTouched()) {
                setDeleteConfirmVisible(true)
              } else {
                close()
              }
            } } />
          </Popconfirm>
        ) }
        footer={ footerButtons }
        title={ t("reservations.form") }
        visible={ isOpen }>
        <Spin
          spinning={
            guestsLoading
            || createLoading
            || deleteLoading
            || updateLoading
          }
          tip={ `${ t("loading") }...` }>
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
                onChange={ updatePrice }
                showTime />
            </Form.Item>
            <Form.Item
              hasFeedback
              label={ t("guests.name") }
              name="guest"
              required
              rules={ guestValidator }>
              <Select
                filterOption={ (input, option): boolean => {
                  const match = option?.label?.toString().toLowerCase().indexOf(input.toLowerCase())
                  return match !== undefined && match >= 0
                } }
                onChange={ updatePrice }
                options={ guestOptions }
                showSearch />
            </Form.Item>
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
                        label={ t("reservations.roommate") }
                        name={ [ name, "id" ] }
                        rules={ roommateValidator }>
                        <Select
                          onChange={ updatePrice }
                          options={ roommateOptions }
                          showSearch />
                      </Form.Item>
                      <MinusCircleOutlined onClick={ () => {
                        remove(name)
                        form.validateFields()
                        updatePrice()
                      } } />
                    </Space>
                  )) }
                  <Form.Item wrapperCol={ { offset: 8, span: 16 } }>
                    <Button
                      disabled={ fields.length >= roommateOptions.length }
                      type="dashed"
                      onClick={ () => add() }
                      block
                      icon={ <UsergroupAddOutlined /> }>
                      { t("reservations.add-roommate") }
                    </Button>
                  </Form.Item>
                </>
              ) }
            </Form.List>
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
              <Select
                onChange={ updatePrice }
                options={ ReservationFormHelper.mealOptions } />
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
        </Spin>
      </Modal>
      <GuestDrawer
        close={ () => setGuestDrawerOpen(false) }
        addGuest={ addGuestOption }
        visible={ guestDrawerOpen } />
    </>
  )
}