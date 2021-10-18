import { useEffect, useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Space, Spin } from "antd"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { BulbOutlined, CloseOutlined, ControlOutlined, MinusCircleOutlined } from "@ant-design/icons"
import { Suites_suites } from "../../../../lib/graphql/queries/Suites/__generated__/Suites"
import { Store } from "antd/lib/form/interface"
import { SuiteForm } from "../../../../lib/Types"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { CreateSuite, CreateSuiteVariables } from "../../../../lib/graphql/mutations/Suite/__generated__/CreateSuite"
import { CREATE_SUITE, UPDATE_SUITE } from "../../../../lib/graphql/mutations/Suite"
import { UpdateSuite, UpdateSuiteVariables } from "../../../../lib/graphql/mutations/Suite/__generated__/UpdateSuite"
import { useTranslation } from "react-i18next"
import { discountOptions } from "../../../../cache"
import "./styles.css"

interface Props {
  close: () => void
  refetch: () => void
  suite?: Suites_suites
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

  const [ createSuite, { loading: createLoading } ] = useMutation<CreateSuite, CreateSuiteVariables>(CREATE_SUITE, {
    onError: networkErrorHandler
  })
  const [ updateSuite, { loading: updateLoading } ] = useMutation<UpdateSuite, UpdateSuiteVariables>(UPDATE_SUITE, {
    onError: networkErrorHandler
  })

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const initialValues: Store = {
    beds: suite?.numberBeds,
    beds_extra: suite?.numberBedsExtra,
    discounts: suite?.discountSet,
    number: suite?.number,
    price_base: suite === undefined ? "0.00" : suite.priceBase,
    title: suite?.title
  }

  const discountValidator = [
    {
      message: t("rooms.error-duplicate-discount"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        const duplicate = form.getFieldValue("discounts").filter((discount: any) => discount.type === value)
        // Validation is run after the selected values are added to form
        if (duplicate !== undefined && duplicate.length > 1) {
          return Promise.reject(new Error("Fail discount validation, duplicate value"))
        }
        return Promise.resolve()
      }
    }
  ]

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
          priceBase: formData.price_base,
          priceChild: formData.price_child,
          priceExtra: formData.price_extra,
          priceInfant: formData.price_infant,
          title: formData.title
        }
        if (suite === undefined) {
          createSuite({ variables: { data: { ...variables } } })
            .then((value: FetchResult<CreateSuite>) => {
              actionCallback(() => {
                message.success(t("rooms.created"))
              }, value.data?.createSuite?.suite)
            })
        } else {
          updateSuite({ variables: { data: { id: suite.id, ...variables } } })
            .then((value: FetchResult<UpdateSuite>) => {
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

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

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
          title={ t("forms.close-dirty") }
          visible={ confirmClose }>
          <CloseOutlined onClick={ closeDrawer } />
        </Popconfirm>
      ) }
      footer={
        <Button
          onClick={ submitForm }
          type="primary">
          { suite === undefined ? t("forms.create") : t("forms.update") }
        </Button>
      }
      footerStyle={ {
        textAlign: "right"
      } }
      placement="left"
      title={ t("rooms.new") }
      visible={ visible }
      width={ 500 }>
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
            <Input addonBefore={ t("rooms.currency") } />
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
                        rules={ discountValidator }>
                        <Select
                          options={ discountOptions() }
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
                        remove(name)
                        form.validateFields()
                      } } />
                    </Space>
                  )) }
                  <Button
                    type="dashed"
                    onClick={ () => add() }
                    block
                    icon={ <ControlOutlined /> }>
                    { t("rooms.add-discount") }
                  </Button>
                </>
              ) }
            </Form.List>
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  )
}