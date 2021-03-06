import { useCallback, useEffect, useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Space, Spin, Tooltip } from "antd"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { BulbOutlined, CloseOutlined, ControlOutlined, MinusCircleOutlined } from "@ant-design/icons"
import { Store } from "antd/lib/form/interface"
import { ISuite, SuiteForm } from "../../../../lib/Types"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { useTranslation } from "react-i18next"
import { discountSuiteOptions } from "../../../../cache"
import "./styles.css"
import Title from "antd/lib/typography/Title"
import { CreateSuiteDocument, CreateSuiteMutation, CreateSuiteMutationVariables, UpdateSuiteDocument, UpdateSuiteMutation, UpdateSuiteMutationVariables } from "../../../../lib/graphql/graphql"

interface Props {
  close: () => void
  refetch: () => void
  suite?: ISuite
  visible: boolean
}

export const SuiteDrawer = ({
  close,
  refetch,
  suite,
  visible
}: Props) => {

  const { t } = useTranslation()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createSuite, { loading: createLoading } ] = useMutation<CreateSuiteMutation, CreateSuiteMutationVariables>(CreateSuiteDocument, {
    onError: networkErrorHandler
  })
  const [ updateSuite, { loading: updateLoading } ] = useMutation<UpdateSuiteMutation, UpdateSuiteMutationVariables>(UpdateSuiteDocument, {
    onError: networkErrorHandler
  })

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)
  const [ discountsFull, setDiscountsFull ] = useState<boolean>(false)
  const [ addDiscountTooltip, setAddDiscountTooltip ] = useState<string>(t("tooltips.add-discount-suite"))

  const initialValues: Store = {
    beds: suite?.numberBeds,
    beds_extra: suite?.numberBedsExtra,
    discounts: suite?.discountSuiteSet,
    number: suite?.number,
    price_base: suite === undefined ? "0.00" : suite.priceBase,
    title: suite?.title
  }

  const actionCallback = (callback: () => void, newSuite?: any | null) => {
    if (newSuite !== undefined && newSuite !== null) {
      callback()
    }
    if (refetch !== undefined) {
      refetch()
    }
    close()
  }

  const submitForm = () => {
    form.validateFields()
      .then(() => {
        const formData: SuiteForm = form.getFieldsValue(true)
        const variables = {
          discounts: formData.discounts.map(discount => {
            return { type: discount.type, value: discount.value }
          }),
          number: formData.number,
          numberBeds: formData.beds,
          numberBedsExtra: formData.beds_extra,
          priceBase: formData.price_base,
          priceChild: formData.price_child,
          priceExtra: formData.price_extra,
          priceInfant: formData.price_infant,
          title: formData.title
        }
        if (suite === undefined) {
          createSuite({ variables: { data: { ...variables } } })
            .then((value: FetchResult<CreateSuiteMutation>) => {
              actionCallback(() => {
                message.success(t("rooms.created"))
              }, value.data?.createSuite?.suite)
            })
        } else {
          updateSuite({ variables: { data: { id: suite.id, ...variables } } })
            .then((value: FetchResult<UpdateSuiteMutation>) => {
              actionCallback(() => {
                message.success(t("rooms.updated"))
              }, value.data?.updateSuite?.suite)
            })
        }
      })
      .catch(() => {
        console.error("Form validation failed");
      })
  }

  const closeDrawer = (): void => {
    if (form.isFieldsTouched()) {
      setConfirmClose(true)
    } else {
      close()
    }
  }

  const updateAddDiscountTooltip = useCallback((fieldsLength: number) => {
    if (discountSuiteOptions() !== undefined && discountSuiteOptions().length <= fieldsLength) {
      setDiscountsFull(true)
      setAddDiscountTooltip(t("tooltips.discounts-full"))
    } else {
      setDiscountsFull(false)
      setAddDiscountTooltip(t("tooltips.add-discount-suite"))
    }
  }, [ t ])

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

  useEffect(() => {
    if (suite !== undefined && suite.discountSuiteSet !== undefined) {
      updateAddDiscountTooltip(suite.discountSuiteSet.length)
    }
  }, [ suite, updateAddDiscountTooltip ])

  return (
    <Drawer
      closable={ false }
      extra={ (
        <Popconfirm
          onCancel={ () => setConfirmClose(false) }
          onConfirm={ () => {
            setConfirmClose(false)
            close()
          } }
          placement="rightTop"
          title={ t("forms.close-dirty") }
          visible={ confirmClose }>
          <Button
            className="close-button"
            icon={ <CloseOutlined /> }
            onClick={ closeDrawer }
            shape="circle" />
        </Popconfirm>
      ) }
      footer={
        <Button
          id="submit-suite"
          onClick={ submitForm }
          type="primary">
          { suite === undefined ? t("forms.create") : t("forms.update") }
        </Button>
      }
      footerStyle={ {
        textAlign: "right"
      } }
      placement="left"
      title={ (
        <Title
          className="drawer-title"
          level={ 4 }>
          { t("rooms.new") }
        </Title>
      ) }
      visible={ visible }
      width={ 500 } >
      <Spin
        size="large"
        spinning={
          createLoading
          || updateLoading
        }
        tip={ `${ t("loading") }...` }>
        <Form
          form={ form }
          initialValues={ initialValues }
          layout="vertical"
          name="suite">
          <Form.Item
            hasFeedback
            label={ t("forms.name") }
            name="title"
            required
            rules={ [ FormHelper.requiredRule(t("forms.field-required")) ] }>
            <Input placeholder={ t("rooms.name") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("rooms.number-beds") }
            name="beds"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              {
                message: t("forms.enter-number"),
                pattern: /^[0-9]+$/
              }
            ] }
            tooltip={ {
              icon: <BulbOutlined />,
              title: t("tooltips.room-beds")
            } }>
            <Input placeholder={ t("rooms.number-beds") } type="number" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("rooms.number-beds-extra") }
            name="beds_extra"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              {
                message: t("forms.enter-number"),
                pattern: /^[0-9]+$/
              }
            ] }>
            <Input placeholder={ t("rooms.number-beds-extra") } type="number" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("number") }
            name="number"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              FormHelper.numberRule(t("forms.enter-number"))
            ] }>
            <Input placeholder={ t("rooms.number") } type="number" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("rooms.price-base") }
            name="price_base"
            rules={ [
              {
                message: t("forms.enter-number"),
                pattern: /^[0-9]{1,4}(\.[0-9]{1,2})?$/
              }
            ] }>
            <Input
              addonBefore={ t("currency") }
              type="text" />
          </Form.Item>
          <Form.Item>
            <Form.List name="discounts">
              { (fields, { add, remove }) => (
                <>
                  { fields.map((field) => (
                    <Space
                      align="baseline"
                      className="discounts-list"
                      key={ field.key }>
                      <Form.Item
                        { ...field }
                        fieldKey={ [ field.key, 'type' ] }
                        name={ [ field.name, "type" ] }
                        rules={ [
                          FormHelper.discountValidator(
                            t("rooms.error-duplicate-discount"),
                            () => form.getFieldValue("discounts")
                          )
                        ] }>
                        <Select
                          options={ discountSuiteOptions() }
                          showSearch />
                      </Form.Item>
                      <Form.Item
                        hasFeedback
                        { ...field }
                        fieldKey={ [ field.key, 'value' ] }
                        name={ [ field.name, "value" ] }
                        required
                        rules={ [
                          FormHelper.requiredRule(t("forms.field-required")),
                          FormHelper.numberRule(t("forms.enter-number"))
                        ] }>
                        <Input addonBefore="%" type="number" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={ () => {
                        updateAddDiscountTooltip(fields.length - 1) // length is not updated immediately
                        remove(field.name)
                        form.validateFields()
                      } } />
                    </Space>
                  )) }
                  <Tooltip
                    title={ addDiscountTooltip }>
                    <Button
                      block
                      disabled={ discountsFull === true }
                      id="add-discount-field"
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
        </Form>
      </Spin>
    </Drawer >
  )
}