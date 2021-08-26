import { useMutation } from "@apollo/client"
import { Button, Form, Input, message, Result, Spin } from "antd"
import { CONTACT_MESSAGE } from "../../../../lib/graphql/mutations/Contact"
import { CreateContactMessage, CreateContactMessageVariables } from "../../../../lib/graphql/mutations/Contact/__generated__/CreateContactMessage"

interface Props {
  show: boolean
}

export const Error = ({
  show
}: Props) => {

  const [ createContactMessage, { loading: creatingMessage } ] = useMutation<CreateContactMessage, CreateContactMessageVariables>(CONTACT_MESSAGE)

  const [ form ] = Form.useForm()

  const submitForm = () => {
    form.validateFields()
      .then(() => {
        createContactMessage({ variables: { data: { message: form.getFieldValue("message") } } })
        .then(() => {
          message.success("Vaše zpráva byla odeslána, děkujeme!")
          form.resetFields()
        })
      })
      .catch(() => message.error("Formulář nelze odeslat, opravte prosím chyby"))
  }

  return show === true ? (
    <Spin
      spinning={ creatingMessage }
      tip="Posílám zprávu">
      <Result
        status="error"
        title="Rezervace nenalezena"
        subTitle="Zanechte nám prosím zprávu, nebo nám zavolejte na +420 XXX XXX XXX"
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
                  message: "Zadejte text zprávy"
                }
              ] }>
              <Input.TextArea rows={ 4 } />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Odeslat
              </Button>
            </Form.Item>
          </Form>
        } />
    </Spin>
  ) : null
}