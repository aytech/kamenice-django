import { SaveOutlined, UserOutlined } from "@ant-design/icons"
import { ApolloError, useMutation, useReactiveVar } from "@apollo/client"
import { Avatar, Button, Col, Form, Input, message, Row, Spin } from "antd"
import { Store } from "antd/lib/form/interface"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { appSettings, pageTitle, selectedPage, userColor, userName } from "../../cache"
import { UPDATE_SETTINGS } from "../../lib/graphql/mutations/Settings"
import { UpdateSettings, UpdateSettingsVariables } from "../../lib/graphql/mutations/Settings/__generated__/UpdateSettings"
import "./styles.css"

export const Settings = () => {

  const { t } = useTranslation()
  const [ form ] = Form.useForm()
  const settings = useReactiveVar(appSettings)

  const [ updateSettings, { loading: updateLoading } ] = useMutation<UpdateSettings, UpdateSettingsVariables>(UPDATE_SETTINGS, {
    onCompleted: (value: UpdateSettings) => {
      message.success(t("settings.updated"))
      appSettings(value.updateSettings?.settings)
      if (value.updateSettings?.settings?.userColor !== null) {
        userColor(value.updateSettings?.settings?.userColor)
      }
      if (value.updateSettings?.settings?.userName !== null) {
        userName(value.updateSettings?.settings?.userName)
      }
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const initialValues: Store = {
    userName: settings?.userName,
    municipalityFee: settings?.municipalityFee,
    priceBreakfast: settings?.priceBreakfast,
    priceBreakfastChild: settings?.priceBreakfastChild,
    priceHalfboard: settings?.priceHalfboard,
    priceHalfboardChild: settings?.priceHalfboardChild
  }

  const submitForm = () => {
    form.validateFields()
      .then(() => {
        if (settings?.id !== undefined) {
          const variables = form.getFieldsValue(true)
          updateSettings({ variables: { data: { id: settings?.id, ...variables } } })
        }
      })
      .catch(() => {
        console.error("Form validation failed");
      })
  }

  useEffect(() => {
    pageTitle(t("pages.settings"))
    selectedPage("user")
  }, [ t ])

  useEffect(() => {
    form.resetFields()
  }, [ form, settings ])

  return (
    <>
      <Row className="settings-row">
        <Col
          className="avatar">
          <Avatar
            style={ {
              backgroundColor: settings?.userColor || undefined
            } }
            icon={ <UserOutlined /> }
            size={ 150 } />
        </Col>
      </Row>
      <Row className="settings-row">
        <Col
          lg={ 14 }
          md={ 20 }
          sm={ 22 }
          xs={ 24 }>
          <Spin
            size="large"
            spinning={ updateLoading }
            tip={ `${ t("loading") }...` }>
            <Form
              form={ form }
              initialValues={ initialValues }
              layout="vertical"
              name="settings">
              <Form.Item
                label={ t("settings.user-name") }
                name="userName">
                <Input
                  addonBefore={ <UserOutlined /> }
                  placeholder={ t("settings.your-name") }
                  type="text" />
              </Form.Item>
              <Form.Item
                label={ t("settings.municipality-fee-amount") }
                name="municipalityFee">
                <Input addonBefore={ t("currency") } type="number" />
              </Form.Item>
              <Form.Item
                label={ t("settings.base-breakfast-price") }
                name="priceBreakfast">
                <Input addonBefore={ t("currency") } type="number" />
              </Form.Item>
              <Form.Item
                label={ t("settings.breakfast-price-child") }
                name="priceBreakfastChild">
                <Input addonBefore={ t("currency") } type="number" />
              </Form.Item>
              <Form.Item
                label={ t("settings.base-halfboard-price") }
                name="priceHalfboard">
                <Input addonBefore={ t("currency") } type="number" />
              </Form.Item>
              <Form.Item
                label={ t("settings.halfboard-price-child") }
                name="priceHalfboardChild">
                <Input addonBefore={ t("currency") } type="number" />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  className="button-submit"
                  htmlType="submit"
                  icon={ <SaveOutlined /> }
                  onClick={ submitForm }
                  shape="round"
                  type="primary">
                  { t("forms.save") }
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Col>
      </Row>
    </>
  )
}