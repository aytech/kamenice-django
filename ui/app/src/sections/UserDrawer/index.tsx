import React from "react"
import { useState } from "react"
import { Button, Drawer, Form, Input, List, message, Popconfirm, Select } from "antd"
import { CloseOutlined, MailOutlined } from "@ant-design/icons"
import Title from "antd/lib/typography/Title"
import { Store } from "rc-field-form/lib/interface"
import { GuestErrorResponse, GuestForm } from "../../lib/Types"
import { UserFormHelper } from "../../lib/components/UserFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import "./styles.css"
import { ApolloError, useMutation } from "@apollo/client"
import { CREATE_GUEST } from "../../lib/graphql/mutations/Guest"
import { CreateGuest, CreateGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/CreateGuest"

interface Props {
  close: () => void
  setGuest: (guest: GuestForm) => void
  visible: boolean
}

export const UserDrawer = ({
  close,
  setGuest,
  visible
}: Props) => {

  const [ createGuest, { data, loading, error } ] = useMutation<CreateGuest, CreateGuestVariables>(CREATE_GUEST, {
    onCompleted: (data) => {
      console.log('Complete: ', data);
    },
    onError: (error: ApolloError): void => {
      message.error(
        <List
          dataSource={ UserFormHelper.getGuestResponseErrorList(error.message) }
          renderItem={ item => <List.Item>{ item }</List.Item> }
          size="small" />
      )
    }
  })
  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)
  const [ form ] = Form.useForm()
  const initialValues: Store = {
    phone: {
      code: "+420"
    }
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
        createGuest({
          variables: {
            data: {
              addressMunicipality: formData.address?.municipality,
              addressPsc: formData.address?.psc,
              addressStreet: formData.address?.street,
              citizenship: formData.citizenship?.selected === undefined ? formData.citizenship?.new : formData.citizenship.selected,
              email: formData.email,
              gender: formData.gender,
              identity: formData.identity,
              name: formData.name,
              phoneNumber: `${ formData.phone?.code } ${ formData.phone?.number }`,
              surname: formData.surname,
              visaNumber: formData.visa
            }
          }
        })
        console.log("Submit to data store: ", formData)
        // setGuest(form.getFieldsValue(true))
        // close()
      })
      .catch((error) => {
        console.log("Fix errors: ", error)
      })
  }

  return (
    <Drawer
      closeIcon={ (
        <Popconfirm
          onCancel={ () => setConfirmClose(false) }
          onConfirm={ close }
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
            Vytvořit
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
        name="user">
        <Title level={ 5 }>Osobní údaje</Title>
        <Form.Item
          hasFeedback
          label="Jméno"
          name="name"
          required
          rules={ UserFormHelper.requiredAlphaRules }>
          <Input placeholder="Vaše Jméno" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Příjmení"
          name="surname"
          required
          rules={ UserFormHelper.requiredAlphaRules }>
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
          label="Telefonní Číslo"
          name="phone"
          required>
          <Input.Group compact>
            <Form.Item
              className="area-field"
              hasFeedback
              name={ [ "phone", "code" ] }
              rules={ UserFormHelper.phoneCodeRequiredRules }
              valuePropName="value">
              <Input
                placeholder="kód" />
            </Form.Item>
            <Form.Item
              className="phone-field"
              hasFeedback
              name={ [ "phone", "number" ] }
              rules={ UserFormHelper.requiredNumericRules }>
              <Input
                placeholder="číslo"
                type="tel" />
            </Form.Item>
          </Input.Group>
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
          name="visa_number">
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