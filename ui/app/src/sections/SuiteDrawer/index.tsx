import { useEffect, useState } from "react"
import { Button, Drawer, Form, Input, Popconfirm, Spin } from "antd"
import { FormHelper } from "../../lib/components/FormHelper"
import { CloseOutlined, WarningOutlined } from "@ant-design/icons"
import { Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { Store } from "antd/lib/form/interface"
import { SuiteForm } from "../../lib/Types"

interface Props {
  close: () => void
  createSuite: (variables: any) => void
  deleteSuite: (suiteId: string) => void
  loading: boolean
  suite?: Suites_suites
  updateSuite: (suiteId: string, variables: any) => void
  visible: boolean
}

export const SuiteDrawer = ({
  close,
  createSuite,
  deleteSuite,
  loading,
  suite,
  updateSuite,
  visible
}: Props) => {

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const initialValues: Store = {
    number: suite?.number,
    title: suite?.title
  }

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

  const submitForm = () => {
    form.validateFields()
      .then(() => {
        const formData: SuiteForm = form.getFieldsValue(true)
        const variables = {
          number: formData.number,
          title: formData.title
        }
        if (suite === undefined) {
          createSuite(variables)
        } else {
          updateSuite(suite.id, variables)
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
              onConfirm={ () => deleteSuite(suite.id) }
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
        spinning={ loading }
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