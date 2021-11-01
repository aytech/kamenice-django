import { ControlOutlined, MinusCircleOutlined, SaveOutlined, UserOutlined } from "@ant-design/icons"
import { ApolloError, useMutation } from "@apollo/client"
import { Avatar, Button, Col, Form, Input, message, Row, Select, Space, Spin, Tooltip } from "antd"
import { Store } from "antd/lib/form/interface"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { appSettings, pageTitle, selectedPage, userColor, userName } from "../../cache"
import { FormHelper } from "../../lib/components/FormHelper"
import { UPDATE_SETTINGS } from "../../lib/graphql/mutations/Settings"
import { UpdateSettings, UpdateSettingsVariables } from "../../lib/graphql/mutations/Settings/__generated__/UpdateSettings"
import { Settings as SettingsData } from "../../lib/graphql/queries/Settings/__generated__/Settings"
import { OptionsType } from "../../lib/Types"
import "./styles.css"

interface Props {
  settingsData?: SettingsData
}

export const Settings = ({
  settingsData
}: Props) => {

  const { t } = useTranslation()
  const [ form ] = Form.useForm()

  const [ discountsFull, setDiscountsFull ] = useState<boolean>(false)
  const [ discountOptions, setDiscountOptions ] = useState<OptionsType[]>([])
  const [ addDiscountTooltip, setAddDiscountTooltip ] = useState<string>(t("forms.add-discount"))

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
    userName: appSettings()?.userName,
    municipalityFee: appSettings()?.municipalityFee,
    priceBreakfast: appSettings()?.priceBreakfast,
    priceHalfboard: appSettings()?.priceHalfboard,
    discounts: appSettings()?.discountSettingsSet
  }

  const submitForm = () => {
    form.validateFields()
      .then(() => {
        if (appSettings()?.id !== undefined) {
          const variables = form.getFieldsValue(true)
          variables.discounts = variables.discounts.map((discount: any) => {
            return {
              type: discount.type,
              value: discount.value
            }
          })
          updateSettings({ variables: { data: { id: appSettings()?.id, ...variables } } })
        }
      })
      .catch(() => {
        console.error("Form validation failed");
      })
  }

  const updateAddDiscountTooltip = useCallback((fieldsLength: number) => {
    if (discountOptions.length <= fieldsLength) {
      setDiscountsFull(true)
      setAddDiscountTooltip(t("tooltips.discounts-full"))
    } else {
      setDiscountsFull(false)
      setAddDiscountTooltip(t("forms.add-discount"))
    }
  }, [ discountOptions.length, t ])

  useEffect(() => {
    pageTitle(t("pages.settings"))
    selectedPage("user")
  }, [ t, updateAddDiscountTooltip ])

  useEffect(() => {
    if (settingsData !== undefined) {
      const settingsDiscountTypes: OptionsType[] = []
      settingsData?.discountSettingsTypes?.forEach(discount => {
        if (discount !== null) {
          settingsDiscountTypes.push(discount)
        }
      })
      setDiscountOptions(settingsDiscountTypes)
      const discounts = settingsData.settings?.discountSettingsSet
      if (discounts !== undefined) {
        updateAddDiscountTooltip(discounts.length)
      }
    }
  }, [ settingsData, updateAddDiscountTooltip ])

  return (
    <>
      <Row className="settings-row">
        <Col
          className="avatar">
          <Avatar
            style={ {
              backgroundColor: appSettings()?.userColor || undefined
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
                label={ t("settings.base-halfboard-price") }
                name="priceHalfboard">
                <Input addonBefore={ t("currency") } type="number" />
              </Form.Item>
              <Form.Item>
                <Form.List name="discounts">
                  { (fields, { add, remove }) => (
                    <>
                      { fields.map(({ key, name, fieldKey, ...restField }) => (
                        <Space
                          align="baseline"
                          className="discounts-list"
                          key={ key }>
                          <Form.Item
                            { ...restField }
                            fieldKey={ [ fieldKey, 'type' ] }
                            name={ [ name, "type" ] }
                            rules={ [
                              FormHelper.discountValidator(
                                t("rooms.error-duplicate-discount"),
                                () => form.getFieldValue("discounts")
                              )
                            ] }>
                            <Select
                              options={ discountOptions }
                              showSearch />
                          </Form.Item>
                          <Form.Item
                            hasFeedback
                            { ...restField }
                            fieldKey={ [ fieldKey, 'value' ] }
                            name={ [ name, "value" ] }
                            required
                            rules={ [
                              FormHelper.requiredRule(t("forms.field-required")),
                              FormHelper.numberRule(t("forms.enter-number"))
                            ] }>
                            <Input addonBefore="%" type="number" />
                          </Form.Item>
                          <MinusCircleOutlined onClick={ () => {
                            updateAddDiscountTooltip(fields.length - 1) // length is not updated immediately
                            remove(name)
                            form.validateFields()
                          } } />
                        </Space>
                      )) }
                      <Tooltip
                        title={ addDiscountTooltip }>
                        <Button
                          block
                          disabled={ discountsFull }
                          icon={ <ControlOutlined /> }
                          onClick={ () => {
                            updateAddDiscountTooltip(fields.length + 1) // length is not updated immediately
                            add()
                          } }
                          type="dashed">
                          { t("forms.add-discount") }
                        </Button>
                      </Tooltip>
                    </>
                  ) }
                </Form.List>
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