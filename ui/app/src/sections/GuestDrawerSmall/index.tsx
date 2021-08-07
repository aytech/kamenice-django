import { CloseOutlined, MailOutlined } from "@ant-design/icons"
import { ApolloError, ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client"
import { Button, Drawer, Form, Input, message, Popconfirm } from "antd"
import Title from "antd/lib/typography/Title"
import { useState } from "react"
import { FormHelper } from "../../lib/components/FormHelper"
import { GuestFormHelper } from "../../lib/components/GuestFormHelper"
import { errorMessages } from "../../lib/Constants"
import { CREATE_GUEST_BASIC } from "../../lib/graphql/mutations/Guest"
import { CreateGuestBasic, CreateGuestBasicVariables } from "../../lib/graphql/mutations/Guest/__generated__/CreateGuestBasic"
import { GuestForm } from "../../lib/Types"

interface Props {
  close: () => void
  open: boolean
  reauthenticate: (callback: () => void, errorHandler?: (reason: ApolloError) => void) => void
  refetch: ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>) | undefined
}

export const GuestDrawerSmall = ({
  close,
  open,
  reauthenticate,
  refetch
}: Props) => {

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const [ createGuest ] = useMutation<CreateGuestBasic, CreateGuestBasicVariables>(CREATE_GUEST_BASIC)

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: GuestForm = form.getFieldsValue(true)
        const variables = {
          email: formData.email,
          name: formData.name,
          surname: formData.surname
        }
        const submitGuestRequest = () => createGuest({ variables: { data: variables } })
          .then(() => {
            message.success(`Host ${ formData.name } ${ formData.surname } byl přidán`)
            if (refetch !== undefined) {
              refetch()
            }
            close()
          })
        submitGuestRequest()
          .catch((reason: ApolloError) => {
            if (reason.message === errorMessages.signatureExpired) {
              reauthenticate(submitGuestRequest, (reason: ApolloError) => message.error(reason.message))
            } else {
              message.error(reason.message)
            }
          })
      })
      .catch(() => console.error("Formulář nelze odeslat"))
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
            form.resetFields()
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
      footerStyle={ {
        textAlign: "right"
      } }
      placement="left"
      title="Nový host"
      visible={ open }
      width={ 500 }>
      <Form
        form={ form }
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
            addonBefore={ (
              <Form.Item name="email-prefix" noStyle>
                <MailOutlined />
              </Form.Item>
            ) }
            placeholder="e-mail"
            type="email" />
        </Form.Item>
      </Form>
    </Drawer>
  )
}