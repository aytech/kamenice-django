import { useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Skeleton } from "antd"
import { CloseOutlined, MailOutlined, WarningOutlined } from "@ant-design/icons"
import Title from "antd/lib/typography/Title"
import { Store } from "rc-field-form/lib/interface"
import { GuestForm } from "../../lib/Types"
import { GuestFormHelper } from "../../lib/components/GuestFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import "./styles.css"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { CREATE_GUEST, DELETE_GUEST, UPDATE_GUEST } from "../../lib/graphql/mutations/Guest"
import { CreateGuest, CreateGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/CreateGuest"
import { GuestsFull_guests } from "../../lib/graphql/queries/Guests/__generated__/GuestsFull"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { UpdateGuest, UpdateGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/UpdateGuest"
import { useEffect } from "react"
import { errorMessages } from "../../lib/Constants"
import { DeleteGuest, DeleteGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/DeleteGuest"

interface Props {
  addGuest: (guest: Guests_guests) => void
  close: () => void
  guest: GuestsFull_guests | null
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  removeGuest: (guest: GuestsFull_guests) => void
  updateGuestCache: (guest: Guests_guests) => void
  visible: boolean
}

export const GuestDrawer = ({
  addGuest,
  close,
  guest,
  reauthenticate,
  removeGuest,
  updateGuestCache,
  visible
}: Props) => {

  const [ form ] = Form.useForm()

  const [ createGuest, { loading: createLoading } ] = useMutation<CreateGuest, CreateGuestVariables>(CREATE_GUEST)
  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateGuest, UpdateGuestVariables>(UPDATE_GUEST)
  const [ deleteGuest, { loading: deleteLoading } ] = useMutation<DeleteGuest, DeleteGuestVariables>(DELETE_GUEST)


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

  const closeDrawer = (): void => {
    if (form.isFieldsTouched()) {
      setConfirmClose(true)
    } else {
      close()
    }
  }

  const updateGuestAction = (guestId: string, variables: any) => {
    const handler =
      () => updateGuest({ variables: { data: { id: guestId, ...variables } } })
        .then((value: FetchResult<UpdateGuest>) => {
          if (value.data?.updateGuest !== undefined && value.data.updateGuest !== null) {
            form.resetFields()
            message.success("Hotovo!")
            updateGuestCache(value.data.updateGuest?.guest as Guests_guests)
            close()
          }
        })
    handler().catch((reason: ApolloError) => {
      if (reason.message === errorMessages.signatureExpired) {
        reauthenticate(handler, (reason: ApolloError) => message.error(reason.message))
      } else {
        message.error(reason.message)
      }
    })
  }

  const createGuestAction = (variables: any) => {
    const handler =
      () => createGuest({ variables: { data: { ...variables } } })
        .then((value: FetchResult<CreateGuest>) => {
          if (value.data?.createGuest !== undefined && value.data.createGuest !== null) {
            form.resetFields()
            message.success("Hotovo!")
            addGuest(value.data.createGuest?.guest as Guests_guests)
            close()
          }
        })
    handler().catch((reason: ApolloError) => {
      if (reason.message === errorMessages.signatureExpired) {
        reauthenticate(handler, (reason: ApolloError) => message.error(reason.message))
      } else {
        message.error(reason.message)
      }
    })
  }

  const deleteGuestAction = (guestId: string) => {
    const handler =
      () => deleteGuest({ variables: { guestId } })
        .then((value: FetchResult<DeleteGuest>) => {
          if (value.data?.deleteGuest !== undefined && value.data?.deleteGuest !== null) {
            message.success("Hotovo!")
            removeGuest(value.data.deleteGuest?.guest as Guests_guests)
            close()
          }
        })
    handler().catch((reason: ApolloError) => {
      if (reason.message === errorMessages.signatureExpired) {
        reauthenticate(handler, (reason: ApolloError) => message.error(reason.message))
      } else {
        message.error(reason.message)
      }
    })
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
        if (guest === null) {
          createGuestAction(variables)
        } else {
          updateGuestAction(guest.id, variables)
        }
      })
      .catch(() => message.error("Formulář nelze odeslat, opravte prosím chyby"))
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
          title="Zavřít formulář? Data ve formuláři budou ztracena"
          visible={ confirmClose }>
          <CloseOutlined onClick={ closeDrawer } />
        </Popconfirm>
      ) }
      placement="left"
      title="Nový host"
      width={ 500 }
      visible={ visible }
      footer={
        <>
          { guest !== null &&
            <Popconfirm
              cancelText="Ne"
              icon={ <WarningOutlined /> }
              okText="Ano"
              onConfirm={ () => deleteGuestAction(guest.id) }
              title="opravdu odstranit?">
              <Button
                danger
                style={ {
                  float: "left"
                } }
                type="primary">
                Odstranit
              </Button>
            </Popconfirm>
          }
          <Button
            onClick={ submitForm }
            type="primary">
            { guest === null ? "Vytvořit" : "Upravit" }
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
          <Title level={ 5 }>Osobní údaje</Title>
          <Form.Item
            hasFeedback
            label="Jméno"
            name="name"
            required
            rules={ GuestFormHelper.requiredAlphaRules }>
            <Input placeholder="Vaše Jméno" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Příjmení"
            name="surname"
            required
            rules={ GuestFormHelper.requiredAlphaRules }>
            <Input placeholder="Vaše Příjmení" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="E-Mail"
            name="email"
            required
            rules={ [ FormHelper.requiredRule ] }>
            <Input
              addonBefore={ emailPrefixIcon }
              placeholder="e-mail"
              type="email" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Číslo OP"
            name="identity">
            <Input placeholder="číslo občanského průkazu" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Telefonní Číslo"
            name="phone">
            <Input placeholder="číslo" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Věk"
            name="age">
            <Select
              options={ GuestFormHelper.ageOptions }
              placeholder="vyberte ze seznamu" />
          </Form.Item>
          <Form.Item
            label="Pohlaví"
            name="gender">
            <Select
              placeholder="vyberte ze seznamu">
              <Select.Option value="M">Muž</Select.Option>
              <Select.Option value="F">Žena</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Číslo viza"
            name="visa">
            <Input placeholder="číslo visa" />
          </Form.Item>
          <Title level={ 5 }>Trvalé bydliště</Title>
          <Form.Item
            label="Ulice"
            name={ [ "address", "street" ] }>
            <Input placeholder="ulice" />
          </Form.Item>
          <Form.Item
            label="PSČ/Obec">
            <Input.Group compact>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "psc" ] }>
                <Input placeholder="PSČ" />
              </Form.Item>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "municipality" ] }>
                <Input placeholder="Obec" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Občanství">
            <Input.Group compact>
              <Form.Item
                style={ { width: "50%" } }
                name={ [ "citizenship", "selected" ] }>
                <Select style={ { width: "100%" } } placeholder="ze seznamu">
                  <Select.Option value="cze">CZE</Select.Option>
                  <Select.Option value="sk">SK</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={ { width: "50%" } }
                name={ [ "citizenship", "new" ] }>
                <Input placeholder="ručně" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Skeleton>
    </Drawer>
  )
}