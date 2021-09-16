import { CloseOutlined, MailOutlined } from "@ant-design/icons"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Skeleton } from "antd"
import { Store } from "antd/lib/form/interface"
import Title from "antd/lib/typography/Title"
import { useEffect } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { UPDATE_RESERVATON_GUEST } from "../../../../lib/graphql/mutations/ReservationGuest"
import { UpdateReservationGuest, UpdateReservationGuestVariables } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/UpdateReservationGuest"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { GuestForm } from "../../../../lib/Types"

interface Props {
  close: () => void
  guest?: Guests_guests
  reservationHash: string
  visible: boolean
}

export const ReservationGuestDrawer = ({
  close,
  guest,
  reservationHash,
  visible
}: Props) => {

  const { t } = useTranslation()

  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateReservationGuest, UpdateReservationGuestVariables>(UPDATE_RESERVATON_GUEST)

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const [ form ] = Form.useForm()

  const initialValues: Store = {
    age: guest?.age,
    address: {
      municipality: guest?.addressMunicipality,
      psc: guest?.addressPsc,
      street: guest?.addressStreet
    },
    citizenship: {
      selected: guest?.citizenship
    },
    email: guest?.email,
    gender: guest?.gender,
    identity: guest?.identity,
    name: guest?.name,
    phone: guest?.phoneNumber,
    surname: guest?.surname,
    visa: guest?.visaNumber
  }

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: GuestForm = form.getFieldsValue(true)
        const variables = {
          age: formData.age,
          addressMunicipality: formData.address?.municipality,
          addressPsc: formData.address?.psc,
          addressStreet: formData.address?.street,
          citizenship: formData.citizenship?.selected === undefined ? formData.citizenship?.new : formData.citizenship.selected,
          email: formData.email,
          gender: formData.gender,
          identity: formData.identity,
          name: formData.name,
          phoneNumber: formData.phone,
          surname: formData.surname,
          visaNumber: formData.visa
        }
        updateGuest({ variables: { data: { id: String(guest?.id), hash: reservationHash, ...variables } } })
          .then((value: FetchResult<UpdateReservationGuest>) => {
            const guest = value.data?.updateReservationGuest?.guest
            if (guest !== undefined && guest !== null) {
              message.success(t("guests.updated", { name: guest.name, surname: guest.surname }))
            }
            close()
          })
          .catch((reason: ApolloError) => message.error(reason.message))
      })
      .catch(() => message.error(t("errors.invalid-form")))
  }

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

  return guest === undefined ? null : (
    <Drawer
      closeIcon={ (
        <Popconfirm
          onCancel={ () => setConfirmClose(false) }
          onConfirm={ () => {
            setConfirmClose(false)
            form.resetFields()
            close()
          } }
          placement="rightTop"
          title={ t("forms.close-dirty") }
          visible={ confirmClose }>
          <CloseOutlined onClick={ () => {
            if (form.isFieldsTouched()) {
              setConfirmClose(true)
            } else {
              close()
            }
          } } />
        </Popconfirm>
      ) }
      placement="left"
      title={ `${ t("guests.name") } - ${ guest.name } ${ guest.surname }` }
      width={ 500 }
      visible={ visible }
      footer={
        <Button
          onClick={ submitForm }
          type="primary">
          { t("forms.save") }
        </Button>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ updateLoading }
        paragraph={ { rows: 15 } }>
        <Form
          form={ form }
          initialValues={ initialValues }
          layout="vertical"
          name="guest">
          <Title level={ 5 }>
            { t("forms.personal-data") }
          </Title>
          <Form.Item
            hasFeedback
            label={ t("name") }
            name="name"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              FormHelper.requiredAlphaRule(t("forms.enter-text"))
            ] }>
            <Input placeholder={ t("name") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("surname") }
            name="surname"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              FormHelper.requiredAlphaRule(t("forms.enter-text"))
            ] }>
            <Input placeholder={ t("surname") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("email") }
            name="email"
            required
            rules={ [ FormHelper.requiredRule(t("forms.field-required")) ] }>
            <Input
              addonBefore={ <MailOutlined /> }
              placeholder={ t("email") }
              type="email" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("forms.id-number") }
            name="identity">
            <Input placeholder={ t("forms.id-number-full") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("phone-number") }
            name="phone">
            <Input placeholder={ t("phone-number") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("age") }
            name="age">
            <Select
              options={ FormHelper.guestAgeOptions }
              placeholder={ t("forms.choose-from-list") } />
          </Form.Item>
          <Form.Item
            label={ t("sex") }
            name="gender">
            <Select
              placeholder={ t("forms.choose-from-list") }>
              <Select.Option value="M">
                { t("man") }
              </Select.Option>
              <Select.Option value="F">
                { t("woman") }
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("forms.visa-number") }
            name="visa">
            <Input placeholder={ t("forms.visa-number") } />
          </Form.Item>
          <Title level={ 5 }>Trvalé bydliště</Title>
          <Form.Item
            label={ t("forms.street") }
            name={ [ "address", "street" ] }>
            <Input placeholder={ t("forms.street") } />
          </Form.Item>
          <Form.Item
            label={ `${ t("psc") }/${ t("municipality") }` }>
            <Input.Group compact>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "psc" ] }>
                <Input placeholder={ t("psc") } />
              </Form.Item>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "municipality" ] }>
                <Input placeholder={ t("municipality") } />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label={ t("forms.citizenship") }>
            <Input.Group compact>
              <Form.Item
                style={ { width: "50%" } }
                name={ [ "citizenship", "selected" ] }>
                <Select style={ { width: "100%" } } placeholder={ t("forms.from-list") }>
                  <Select.Option value="cze">CZE</Select.Option>
                  <Select.Option value="sk">SK</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={ { width: "50%" } }
                name={ [ "citizenship", "new" ] }>
                <Input placeholder={ t("forms.by-hand") } />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Skeleton>
    </Drawer>
  )
}