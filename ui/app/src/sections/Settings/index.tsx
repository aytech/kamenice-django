import { SaveOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Col, Form, Row } from "antd"
import { Store } from "antd/lib/form/interface"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { pageTitle, selectedPage } from "../../cache"
import "./styles.css"

export const Settings = () => {

  const { t } = useTranslation()
  const [ form ] = Form.useForm()

  const initialValues: Store = {

  }

  useEffect(() => {
    pageTitle(t("pages.settings"))
    selectedPage("user")
  }, [ t ])

  return (
    <Row className="settings-row">
      <Col
        className="avatar"
        offset={ 8 }
        span={ 8 }>
        <Avatar icon={ <UserOutlined /> } size={ 150 } />
      </Col>
      <Col
        offset={ 6 }
        span={ 12 }>
        <Form
          form={ form }
          initialValues={ initialValues }
          layout="vertical"
          name="settings">
          <Form.Item>
            <Button
              block
              className="button-submit"
              htmlType="submit"
              icon={ <SaveOutlined /> }
              shape="round"
              type="primary">
              { t("forms.save") }
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}