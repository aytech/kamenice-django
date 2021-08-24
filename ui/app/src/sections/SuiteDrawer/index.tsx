import { useEffect, useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm, Spin } from "antd"
import { FormHelper } from "../../lib/components/FormHelper"
import { CloseOutlined, WarningOutlined } from "@ant-design/icons"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { Store } from "antd/lib/form/interface"
import { SuiteForm } from "../../lib/Types"
import { FetchResult, useMutation } from "@apollo/client"
import { CreateSuite, CreateSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/CreateSuite"
import { CREATE_SUITE, DELETE_SUITE, UPDATE_SUITE } from "../../lib/graphql/mutations/Suite"
import { UpdateSuite, UpdateSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/UpdateSuite"
import { DeleteSuite, DeleteSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"

interface Props {
  addOrUpdateSuite: (suite: Suites_suites) => void
  clearSuite: (suiteId: string) => void
  close: () => void
  suite?: Suites_suites
  visible: boolean
}

export const SuiteDrawer = ({
  addOrUpdateSuite,
  clearSuite,
  close,
  suite,
  visible
}: Props) => {

  const [ createSuite, { loading: createLoading } ] = useMutation<CreateSuite, CreateSuiteVariables>(CREATE_SUITE)
  const [ deleteSuite, { loading: deleteLoading } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE)
  const [ updateSuite, { loading: updateLoading } ] = useMutation<UpdateSuite, UpdateSuiteVariables>(UPDATE_SUITE)

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const initialValues: Store = {
    number: suite?.number,
    title: suite?.title
  }

  const submitForm = () => {
    form.validateFields()
      .then(() => {
        const formData: SuiteForm = form.getFieldsValue(true)
        const variables = {
          number: formData.number,
          title: formData.title
        }
        if (suite === undefined) {
          createSuite({ variables: { data: { ...variables } } })
            .then((value: FetchResult<CreateSuite>) => {
              const suite = value.data?.createSuite?.suite
              if (suite !== undefined && suite !== null) {
                addOrUpdateSuite(suite)
                message.success("Apartmá byla vytvořena")
                close()
              }
            })
        } else {
          updateSuite({ variables: { data: { id: suite.id, ...variables } } })
            .then((value: FetchResult<UpdateSuite>) => {
              const suite = value.data?.updateSuite?.suite
              if (suite !== undefined && suite !== null) {
                addOrUpdateSuite(suite)
                message.success("Apartmá byla aktualizována")
                close()
              }
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
          title="Zavřít formulář? Data ve formuláři budou ztracena"
          visible={ confirmClose }>
          <CloseOutlined onClick={ closeDrawer } />
        </Popconfirm>
      ) }
      footer={
        <>
          { suite !== undefined &&
            <Popconfirm
              cancelText="Ne"
              icon={ <WarningOutlined /> }
              okText="Ano"
              onConfirm={ () => {
                deleteSuite({ variables: { suiteId: suite.id } })
                  .then((value: FetchResult<DeleteSuite>) => {
                    const suiteId = value.data?.deleteSuite?.suite?.id
                    if (suiteId !== undefined) {
                      clearSuite(suiteId)
                      message.success("Apartmá byla odstraněna")
                      close()
                    }
                  })
                console.log("Deleting suite: ", suite.id)
              } }
              title="opravdu odstranit?">
              <Button
                danger
                style={ {
                  float: "left"
                } }
                type="primary">
                Odstranit
              </Button>
            </Popconfirm>
          }
          <Button
            onClick={ submitForm }
            type="primary">
            { suite === undefined ? "Vytvořit" : "Upravit" }
          </Button>
        </>
      }
      footerStyle={ {
        textAlign: "right"
      } }
      placement="left"
      title="Nové apartmá"
      visible={ visible }
      width={ 500 }>
      <Spin
        size="large"
        spinning={
          createLoading
          || deleteLoading
          || updateLoading
        }
        tip="Načítám...">
        <Form
          form={ form }
          initialValues={ initialValues }
          layout="vertical"
          name="suite">
          <Form.Item
            hasFeedback
            label="Název"
            name="title"
            required
            rules={ [ FormHelper.requiredRule ] }>
            <Input placeholder="název apartmá" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Číslo"
            name="number"
            required
            rules={ [
              FormHelper.requiredRule,
              {
                message: "zadejte číslo",
                pattern: /^[0-9]+$/
              }
            ] }>
            <Input placeholder="číslo apartmá" type="number" />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  )
}