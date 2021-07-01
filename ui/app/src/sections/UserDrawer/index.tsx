import React from "react"
import { Button, Drawer, Form, Input, Select } from "antd"
import { MailOutlined } from "@ant-design/icons"
import Title from "antd/lib/typography/Title"

interface Props {
  setVisible: (visible: boolean) => void,
  visible: boolean
}

export const UserDrawer = ({
  setVisible,
  visible
}: Props) => {

  const [ form ] = Form.useForm()
  const phonePrefixSelector = (
    <Form.Item name="phone-prefix" noStyle>
      <Select
        defaultValue="420"
        options={ [
          { label: "+420", value: "420" }
        ] }
        style={ { width: 80 } } />
    </Form.Item>
  )
  const emailPrefixIcon = (
    <Form.Item name="email-prefix" noStyle>
      <MailOutlined />
    </Form.Item>
  )
  return (
    <Drawer
      onClose={ () => {
        setVisible(false)
      } }
      placement="left"
      title="Nový Uživatel"
      width={ 500 }
      visible={ visible }
      footer={
        <div style={ {
          textAlign: "right"
        } }>
          <Button
            onClick={ () => {
              form.validateFields()
                .then(() => {
                  console.log("Submit to data store")
                })
                .catch((error) => {
                  console.log("Fix errors: ", error)
                })
            } }
            type="primary">
            Vytvořit
          </Button>
        </div>
      }>
      <Form
        form={ form }
        layout="vertical"
        name="user">
        <Title level={ 5 }>Osobní údaje</Title>
        <Form.Item
          hasFeedback
          label="Jméno"
          name="name"
          required
          rules={ [
            {
              required: true,
              message: "pole je povinné"
            }
          ] }>
          <Input placeholder="Vaše Jméno" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Příjmení"
          name="surname"
          required
          rules={ [
            {
              required: true,
              message: "pole je povinné"
            }
          ] }>
          <Input placeholder="Vaše Příjmení" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Číslo OP"
          name="id"
          required
          rules={ [
            {
              required: true,
              message: "pole je povinné"
            }
          ] }>
          <Input placeholder="číslo občanského průkazu" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Číslo viza"
          name="visa">
          <Input placeholder="číslo visa" />
        </Form.Item>
        <Form.Item
          label="Telefonní Číslo"
          name="phone"
          required
          rules={ [
            {
              required: true,
              message: "pole je povinné"
            }
          ] }>
          <Input
            addonBefore={ phonePrefixSelector }
            placeholder="telefonní číslo"
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="E-Mail"
          name="email"
          required
          rules={ [
            {
              required: true,
              message: "pole je povinné"
            }
          ] }>
          <Input
            addonBefore={ emailPrefixIcon }
            placeholder="e-mail" />
        </Form.Item>
        <Form.Item
          label="Pohlaví">
          <Select
            onChange={ (value) => { console.log(value) } }
            placeholder="vyberte ze seznamu">
            <Select.Option value="man">Muž</Select.Option>
            <Select.Option value="woman">Žena</Select.Option>
          </Select>
        </Form.Item>
        <Title level={ 5 }>Trvalé bydliště</Title>
        <Form.Item
          label="Ulice">
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
              name={ [ "address", "province" ] }>
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
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Vytvořit
          </Button>
        </Form.Item> */}
      </Form>
    </Drawer>
  )
}