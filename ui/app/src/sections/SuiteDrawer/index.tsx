import { useEffect, useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm } from "antd"
import { FormHelper } from "../../lib/components/FormHelper"
import { CloseOutlined } from "@ant-design/icons"
import { Suites, Suites_suites } from "../../lib/graphql/queries/Suites/__generated__/Suites"
import { Store } from "antd/lib/form/interface"
import { ApolloError, ApolloQueryResult, OperationVariables, useMutation } from "@apollo/client"
import { CreateSuite, CreateSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/CreateSuite"
import { CREATE_SUITE, UPDATE_SUITE } from "../../lib/graphql/mutations/Suite"
import { SuiteForm } from "../../lib/Types"
import { SuiteInput } from "../../lib/graphql/globalTypes"
import { UpdateSuite, UpdateSuiteVariables } from "../../lib/graphql/mutations/Suite/__generated__/UpdateSuite"

interface Props {
  close: () => void
  refetch: ((variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<Suites>>) | undefined
  suite: Suites_suites | undefined
  visible: boolean
}

export const SuiteDrawer = ({
  close,
  suite,
  refetch,
  visible
}: Props) => {

  const [ createSuite ] = useMutation<CreateSuite, CreateSuiteVariables>(CREATE_SUITE, {
    onCompleted: (data: CreateSuite): void => {
      message.success(`Apartmá ${ data.createSuite?.suite?.title } byla vytvořena`)
      if (refetch !== undefined) {
        refetch()
      }
      close()
    },
    onError: (error: ApolloError): void => {
      console.log('Error creating: ', error)
    }
  })
  const [ updateSuite ] = useMutation<UpdateSuite, UpdateSuiteVariables>(UPDATE_SUITE, {
    onCompleted: (data: UpdateSuite): void => {
      message.success(`Apartmá ${ data.updateSuite?.suite?.title } byla aktualizována`)
      if (refetch !== undefined) {
        refetch()
      }
      close()
    },
    onError: (error: ApolloError): void => {
      console.log('Error updating: ', error)
    }
  })

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
        const variables: { data: SuiteInput } = {
          data: {
            number: formData.number,
            title: formData.title
          }
        }
        if (suite === undefined) {
          createSuite({ variables })
        } else {
          if (form.isFieldsTouched()) {
            variables.data.id = suite.id
            updateSuite({ variables })
          }
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
          <Button
            onClick={ submitForm }
            type="primary">
            Vytvořit
          </Button>
        </>
      }
      placement="left"
      title="Nové apartmá"
      visible={ visible }
      width={ 500 }>
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
    </Drawer>
  )
}