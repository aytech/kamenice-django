import { useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Skeleton } from "antd"
import { CloseOutlined, MailOutlined, WarningOutlined } from "@ant-design/icons"
import Title from "antd/lib/typography/Title"
import { Store } from "rc-field-form/lib/interface"
import { GuestForm } from "../../../../lib/Types"
import { GuestFormHelper } from "../../../../lib/components/GuestFormHelper"
import { FormHelper } from "../../../../lib/components/FormHelper"
import "./styles.css"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { CREATE_GUEST, DELETE_GUEST, UPDATE_GUEST } from "../../../../lib/graphql/mutations/Guest"
import { CreateGuest, CreateGuestVariables } from "../../../../lib/graphql/mutations/Guest/__generated__/CreateGuest"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { UpdateGuest, UpdateGuestVariables } from "../../../../lib/graphql/mutations/Guest/__generated__/UpdateGuest"
import { useEffect } from "react"
import { DeleteGuest, DeleteGuestVariables } from "../../../../lib/graphql/mutations/Guest/__generated__/DeleteGuest"
import { useTranslation } from "react-i18next"

interface Props {
  addGuest: (guest: Guests_guests) => void
  close: () => void
  guest?: Guests_guests | null
  removeGuest?: (guestId: string) => void
  visible: boolean
}

export const GuestDrawer = ({
  addGuest,
  close,
  guest,
  removeGuest,
  visible
}: Props) => {

  const { t } = useTranslation()

  const [ form ] = Form.useForm()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createGuest, { loading: createLoading } ] = useMutation<CreateGuest, CreateGuestVariables>(CREATE_GUEST, {
    onError: networkErrorHandler
  })
  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateGuest, UpdateGuestVariables>(UPDATE_GUEST, {
    onError: networkErrorHandler
  })
  const [ deleteGuest, { loading: deleteLoading } ] = useMutation<DeleteGuest, DeleteGuestVariables>(DELETE_GUEST, {
    onError: networkErrorHandler
  })

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

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
  const emailPrefixIcon = (
    <Form.Item name="email-prefix" noStyle>
      <MailOutlined />
    </Form.Item>
  )

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
        if (guest === undefined || guest === null) {
          createGuest({ variables: { data: { ...variables } } })
            .then((value: FetchResult<CreateGuest>) => {
              const guest = value.data?.createGuest?.guest
              if (guest !== undefined && guest !== null) {
                addGuest(guest)
                message.success(t("guests.added", { name: guest.name, surname: guest.surname }))
              }
              close()
            })
        } else {
          updateGuest({ variables: { data: { id: String(guest.id), ...variables } } })
            .then((value: FetchResult<UpdateGuest>) => {
              const guest = value.data?.updateGuest?.guest
              if (guest !== undefined && guest !== null) {
                addGuest(guest)
                message.success(t("guests.updated", { name: guest.name, surname: guest.surname }))
              }
              close()
            })
        }
      })
      .catch(() => message.error(t("errors.invalid-form")))
  }

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

  return (
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
      title={ t("guests.name") }
      width={ 500 }
      visible={ visible }
      footer={
        <>
          { guest !== undefined && guest !== null &&
            <Popconfirm
              cancelText={ t("no") }
              icon={ <WarningOutlined /> }
              okText={ t("yes") }
              onConfirm={ () => {
                deleteGuest({ variables: { guestId: guest.id } })
                  .then((value: FetchResult<DeleteGuest>) => {
                    const guest = value.data?.deleteGuest?.guest
                    if (removeGuest !== undefined && guest !== undefined && guest !== null) {
                      removeGuest(guest.id)
                      message.success(t("guests.deleted"))
                      close()
                    }
                  })
              } }
              title={ t("forms.delete-confirm") }>
              <Button
                danger
                style={ {
                  float: "left"
                } }
                type="primary">
                { t('forms.delete') }
              </Button>
            </Popconfirm>
          }
          <Button
            onClick={ submitForm }
            type="primary">
            { (guest === undefined || guest === null) ? t("forms.create") : t("forms.update") }
          </Button>
        </>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ createLoading || updateLoading || deleteLoading }
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
              GuestFormHelper.requiredAlphaRule(t("forms.enter-text"))
            ] }>
            <Input placeholder={ t('forms.your-name') } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("surname") }
            name="surname"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              GuestFormHelper.requiredAlphaRule(t("forms.enter-text"))
            ] }>
            <Input placeholder={ t("your-surname") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("email") }
            name="email"
            required
            rules={ [ FormHelper.requiredRule(t("forms.field-required")) ] }>
            <Input
              addonBefore={ emailPrefixIcon }
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
            <Input placeholder={ t("number") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("age") }
            name="age">
            <Select
              options={ GuestFormHelper.ageOptions }
              placeholder={ t("forms.choose-from-list") } />
          </Form.Item>
          <Form.Item
            label={ t("sex") }
            name="gender">
            <Select
              placeholder={ t("forms.choose-from-list") }>
              <Select.Option value="M">{ t("man") }</Select.Option>
              <Select.Option value="F">{ t("woman") }</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("forms.visa-number") }
            name="visa">
            <Input placeholder={ t("forms.visa-number") } />
          </Form.Item>
          <Title level={ 5 }>{ t("forms.address") }</Title>
          <Form.Item
            label={ t("forms.street") }
            name={ [ "address", "street" ] }>
            <Input placeholder={ t("forms.street") } />
          </Form.Item>
          <Form.Item
            label={ t("forms.psc-label") }>
            <Input.Group compact>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "psc" ] }>
                <Input placeholder={ t("forms.psc") } />
              </Form.Item>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "municipality" ] }>
                <Input placeholder={ t("forms.municipality") } />
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