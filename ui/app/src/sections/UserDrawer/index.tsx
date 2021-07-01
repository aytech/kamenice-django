import React from "react"
import { Button, Drawer, Form, Input, Select } from "antd"
import Title from "antd/lib/typography/Title"

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
        <Title level={ 5 }>Osobní údaje</Title>
        <Form.Item
          label="Jméno"
          required>
          <Input placeholder="Vaše Jméno" />
        </Form.Item>
        <Form.Item
          label="Příjmení"
          required>
          <Input placeholder="Vaše Příjmení" />
        </Form.Item>
        <Form.Item
          label="Číslo OP"
          required>
          <Input placeholder="číslo občanského průkazu" />
        </Form.Item>
        <Form.Item
          label="Číslo viza">
          <Input placeholder="číslo visa" />
        </Form.Item>
        <Form.Item
          label="Telefonní Číslo"
          required>
          <Input placeholder="telefonní číslo" />
        </Form.Item>
        <Form.Item
          label="E-Mail"
          required>
          <Input placeholder="e-mail" />
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
      </Form>
    </Drawer>
  )
}