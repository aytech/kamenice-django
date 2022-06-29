import { useMutation } from "@apollo/client"
import { Button, Form, Input, message, Result, Spin } from "antd"
import { useTranslation } from "react-i18next"
import { CreateContactMessageDocument, CreateContactMessageMutation, CreateContactMessageMutationVariables } from "../../../../lib/graphql/graphql"

interface Props {
  show: boolean
}

export const Error = ({
  show
}: Props) => {

  const { t } = useTranslation()

  const [ createContactMessage, { loading: creatingMessage } ] = useMutation<CreateContactMessageMutation, CreateContactMessageMutationVariables>(CreateContactMessageDocument)

  const [ form ] = Form.useForm()

  const submitForm = () => {
    form.validateFields()
      .then(() => {
        createContactMessage({ variables: { data: { message: form.getFieldValue("message") } } })
          .then(() => {
            message.success(t("reservations.message-sent"))
            form.resetFields()
          })
      })
      .catch(() => message.error(t("errors.invalid-form")))
  }

  return show === true ? (
    <Spin
      spinning={ creatingMessage }
      tip={ t("reservations.sending-message") }>
      <Result
        status="error"
        title={ t("reservations.not-found") }
        subTitle={ t("reservations.leave-message", { number: "+420 XXX XXX XXX" }) }
        extra={
          <Form
            form={ form }
            name="contact"
            onFinish={ submitForm }
            wrapperCol={ {
              offset: 6,
              span: 12
            } }>
            <Form.Item
              name="message"
              rules={ [
                {
                  required: true,
                  message: t("forms.enter-message")
                }
              ] }>
              <Input.TextArea rows={ 4 } />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                { t("send") }
              </Button>
            </Form.Item>
          </Form>
        } />
    </Spin>
  ) : null
}