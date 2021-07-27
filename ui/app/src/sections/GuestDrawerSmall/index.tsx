import { CloseOutlined, MailOutlined } from "@ant-design/icons"
import { ApolloError, ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client"
import { Button, Drawer, Form, Input, message, Popconfirm } from "antd"
import Title from "antd/lib/typography/Title"
import { useState } from "react"
import { FormHelper } from "../../lib/components/FormHelper"
import { GuestFormHelper } from "../../lib/components/GuestFormHelper"
import { CREATE_GUEST_BASIC } from "../../lib/graphql/mutations/Guest"
import { CreateGuestBasic, CreateGuestBasicVariables } from "../../lib/graphql/mutations/Guest/__generated__/CreateGuestBasic"
import { SuitesWithReservations } from "../../lib/graphql/queries/Suites/__generated__/SuitesWithReservations"
import { GuestForm } from "../../lib/Types"

interface Props {
  close: () => void
  open: boolean
  refetch: ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<SuitesWithReservations>>) | undefined
}

export const GuestDrawerSmall = ({
  close,
  open,
  refetch
}: Props) => {

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const [ createGuest ] = useMutation<CreateGuestBasic, CreateGuestBasicVariables>(CREATE_GUEST_BASIC, {
    onCompleted: (data: CreateGuestBasic) => {
      message.success(`Host ${ data.createGuest?.guest?.name } ${ data.createGuest?.guest?.surname } byl přidán`)
      if (refetch !== undefined) {
        refetch()
      }
      close()
    },
    onError: (error: ApolloError): void => {
      message.error(error.message)
    }
  })

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: GuestForm = form.getFieldsValue(true)
        const variables = {
          email: formData.email,
          name: formData.name,
          surname: formData.surname
        }
        createGuest({ variables: { data: variables } })
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