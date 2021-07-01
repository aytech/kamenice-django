import React from "react"
import { Button, Drawer, Form, Input, Select } from "antd"

interface Props {
  setVisible: (visible: boolean) => void,
  visible: boolean
}

export const UserDrawer = ({
  setVisible,
  visible
}: Props) => {

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
              console.log("Submit to data store")
            } }
            type="primary">
            Vytvořit
          </Button>
        </div>
      }>
      <Form
        layout="vertical">
        <Form.Item
          label="Jméno"
          required
          tooltip="Vaše Jméno (povinné)">
          <Input placeholder="Vaše Jméno" />
        </Form.Item>
        <Form.Item
          label="Příjmení"
          required
          tooltip="Vaše Příjmení (povinné)">
          <Input placeholder="Vaše Příjmení" />
        </Form.Item>
        <Form.Item
          label="Číslo OP"
          required
          tooltip="Číslo Občanského Průkazu (povinné)">
          <Input placeholder="číslo občanského průkazu" />
        </Form.Item>
        <Form.Item
          label="Číslo viza"
          tooltip="Číslo viza (nepovinné)">
          <Input placeholder="číslo visa" />
        </Form.Item>
        <Form.Item
          label="Telefonní Číslo"
          required
          tooltip="Telefonní Číslo (povinné)">
          <Input placeholder="telefonní číslo" />
        </Form.Item>
        <Form.Item
          label="E-Mail"
          required
          tooltip="Elektronická Adresa (povinné)">
          <Input placeholder="e-mail" />
        </Form.Item>
        <Form.Item
          label="Pohlaví"
          tooltip="Pohlaví (nepovinné)">
          <Select
            onChange={ (value) => { console.log(value) } }
            placeholder="vyberte ze seznamu">
            <Select.Option value="man">Muž</Select.Option>
            <Select.Option value="woman">Žena</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  )
}