import { useState } from "react"
import { Button, Drawer, Form, Input, Popconfirm } from "antd"
import { FormHelper } from "../../lib/components/FormHelper"
import { CloseOutlined } from "@ant-design/icons"

interface Props {
  close: () => void
  visible: boolean
}

export const SuiteDrawer = ({
  close,
  visible
}: Props) => {

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const submitForm = () => {
    console.log('Submitting: ', form.getFieldsValue(true))
  }

  const closeDrawer = (): void => {
    if (form.isFieldsTouched()) {
      setConfirmClose(true)
    } else {
      close()
    }
  }

  return (
    <Drawer
      closeIcon={ (
        <Popconfirm
          onCancel={ () => setConfirmClose(false) }
          onConfirm={ () => {
            setConfirmClose(false)
            close()
          } }
          placement="rightTop"
          title="Zavřít formulář? Data ve formuláři budou ztracena"
          visible={ confirmClose }>
          <CloseOutlined onClick={ closeDrawer } />
        </Popconfirm>
      ) }
      footer={
        <>
          <Button
            onClick={ submitForm }
            type="primary">
            Vytvořit
          </Button>
        </>
      }
      placement="left"
      title="Nové apartmá"
      visible={ visible }
      width={ 500 }>
      <Form
        form={ form }
        layout="vertical"
        name="suite">
        <Form.Item
          hasFeedback
          label="Název"
          name="title"
          required
          rules={ [ FormHelper.requiredRule ] }>
          <Input placeholder="název apartmá" />
        </Form.Item>
        <Form.Item
          hasFeedback
          label="Číslo"
          name="number"
          rules={ [
            {
              message: "zadejte číslo",
              pattern: /^[0-9]+$/
            }
          ] }>
          <Input placeholder="číslo apartmá" type="number" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}