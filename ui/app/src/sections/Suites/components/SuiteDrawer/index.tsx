import { useEffect, useState } from "react"
import { Drawer, Form, Input, message, Popconfirm, Spin } from "antd"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { CloseOutlined } from "@ant-design/icons"
import { Suites_suites } from "../../../../lib/graphql/queries/Suites/__generated__/Suites"
import { Store } from "antd/lib/form/interface"
import { SuiteForm } from "../../../../lib/Types"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { CreateSuite, CreateSuiteVariables } from "../../../../lib/graphql/mutations/Suite/__generated__/CreateSuite"
import { CREATE_SUITE, DELETE_SUITE, UPDATE_SUITE } from "../../../../lib/graphql/mutations/Suite"
import { UpdateSuite, UpdateSuiteVariables } from "../../../../lib/graphql/mutations/Suite/__generated__/UpdateSuite"
import { DeleteSuite, DeleteSuiteVariables } from "../../../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"
import { useTranslation } from "react-i18next"
import { RoomActions } from "./components/RoomActions"
import Title from "antd/lib/typography/Title"

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
  const [ deleteSuite, { loading: deleteLoading } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE, {
    onError: networkErrorHandler
  })
  const [ updateSuite, { loading: updateLoading } ] = useMutation<UpdateSuite, UpdateSuiteVariables>(UPDATE_SUITE, {
    onError: networkErrorHandler
  })

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const initialValues: Store = {
    beds: suite?.numberBeds,
    number: suite?.number,
    price_base: suite === undefined ? "0.00" : suite.priceBase,
    price_child: suite === undefined ? "0.00" : suite.priceChild,
    price_extra: suite === undefined ? "0.00" : suite.priceExtra,
    price_infant: suite === undefined ? "0.00" : suite.priceInfant,
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

  const deleteSuiteHandle = (suiteId: string) => {
    deleteSuite({ variables: { suiteId } })
      .then((value: FetchResult<DeleteSuite>) => {
        actionCallback(() => {
          message.success(t("rooms.deleted"))
        }, value.data?.deleteSuite?.suite)
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
        <RoomActions
          deleteSuite={ deleteSuiteHandle }
          submitForm={ submitForm }
          suite={ suite } />
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
          || deleteLoading
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
            ] }>
            <Input placeholder={ t("rooms.number-beds") } type="number" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("number") }
            name="number"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              {
                message: t("forms.enter-number"),
                pattern: /^[0-9]+$/
              }
            ] }>
            <Input placeholder={ t("rooms.number") } type="number" />
          </Form.Item>
          <Title level={ 5 }>{ t("rooms.prices-title") }</Title>
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
          <Form.Item
            hasFeedback
            label={ t("rooms.price-child") }
            name="price_child"
            rules={ [
              {
                message: t("forms.enter-number"),
                pattern: /^[0-9]{1,4}(\.[0-9]{1,2})?$/
              }
            ] }>
            <Input addonBefore={ t("rooms.currency") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("rooms.price-infant") }
            name="price_infant"
            rules={ [
              {
                message: t("forms.enter-number"),
                pattern: /^[0-9]{1,4}(\.[0-9]{1,2})?$/
              }
            ] }>
            <Input addonBefore={ t("rooms.currency") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("rooms.price-extra") }
            name="price_extra"
            rules={ [
              {
                message: t("forms.enter-number"),
                pattern: /^[0-9]{1,4}(\.[0-9]{1,2})?$/
              }
            ] }>
            <Input addonBefore={ t("rooms.currency") } />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  )
}