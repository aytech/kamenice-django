import { useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm, Select } from "antd"
import { CloseOutlined, MailOutlined } from "@ant-design/icons"
import Title from "antd/lib/typography/Title"
import { Store } from "rc-field-form/lib/interface"
import { GuestForm } from "../../lib/Types"
import { GuestFormHelper } from "../../lib/components/GuestFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import "./styles.css"
import { ApolloError, ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client"
import { CREATE_GUEST, UPDATE_GUEST } from "../../lib/graphql/mutations/Guest"
import { CreateGuest, CreateGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/CreateGuest"
import { GuestsFull, GuestsFull_guests } from "../../lib/graphql/queries/Guests/__generated__/GuestsFull"
import { Guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { UpdateGuest, UpdateGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/UpdateGuest"

interface Props {
  close: () => void
  guest: GuestsFull_guests | null
  refetch: ((variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<Guests | GuestsFull>>) | undefined
  visible: boolean
}

export const GuestDrawer = ({
  close,
  guest,
  refetch,
  visible
}: Props) => {

  const [ form ] = Form.useForm()

  const [ createGuest ] = useMutation<CreateGuest, CreateGuestVariables>(CREATE_GUEST, {
    onCompleted: (data: CreateGuest) => {
      message.success(`Host ${ data.createGuest?.guest?.name } ${ data.createGuest?.guest?.surname } byl přidán`)
      if (refetch !== undefined) {
        refetch()
      }
      form.resetFields()
      close()
    },
    onError: (error: ApolloError): void => {
      message.error(error.message)
    }
  })
  const [ updateGuest ] = useMutation<UpdateGuest, UpdateGuestVariables>(UPDATE_GUEST, {
    onCompleted: (data: UpdateGuest) => {
      message.success(`Host ${ data.updateGuest?.guest?.name } ${ data.updateGuest?.guest?.surname } byl upraven`)
      form.resetFields()
      close()
    },
    onError: () => {
      message.error("Chyba serveru, kontaktujte správce")
    }
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

  const closeDrawer = (): void => {
    if (form.isFieldsTouched()) {
      setConfirmClose(true)
    } else {
      close()
    }
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
          createGuest({ variables: { data: { ...variables } } })
        } else {
          updateGuest({ variables: { data: { id: guest.id, ...variables } } })
        }
      })
      .catch(() => message.error("Formulář nelze odeslat, opravte prosím chyby"))
  }

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
      title="Nový Uživatel"
      width={ 500 }
      visible={ visible }
      footer={
        <>
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
          label="Číslo OP"
          name="identity"
          required
          rules={ [ FormHelper.requiredRule ] }>
          <Input placeholder="číslo občanského průkazu" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Telefonní Číslo"
          name="phone"
          required
          rules={ [ FormHelper.requiredRule ] }>
          <Input placeholder="číslo" />
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
          label="Věk"
          name="age"
          required
          rules={ [ FormHelper.requiredRule ] }>
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
    </Drawer>
  )
}