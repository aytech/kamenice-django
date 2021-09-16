import { CloseOutlined } from "@ant-design/icons"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Skeleton } from "antd"
import { Store } from "antd/lib/form/interface"
import Title from "antd/lib/typography/Title"
import { useEffect } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { UPDATE_ROOMMATE } from "../../../../lib/graphql/mutations/Roommate"
import { UpdateRoommate, UpdateRoommateVariables } from "../../../../lib/graphql/mutations/Roommate/__generated__/UpdateRoommate"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"
import { GuestForm } from "../../../../lib/Types"

interface Props {
  close: () => void
  guest?: Guests_guests | null
  roommate?: Roommates_roommates
  visible: boolean
}

export const ReservationRoommateDrawer = ({
  close,
  guest,
  roommate,
  visible
}: Props) => {

  const { t } = useTranslation()

  const [ updateRoommate, { loading } ] = useMutation<UpdateRoommate, UpdateRoommateVariables>(UPDATE_ROOMMATE)

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const [ form ] = Form.useForm()

  const initialValues: Store = {
    age: roommate?.age,
    gender: roommate?.gender,
    identity: roommate?.identity,
    name: roommate?.name,
    surname: roommate?.surname,
  }

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: GuestForm = form.getFieldsValue(true)
        const variables = {
          age: formData.age,
          identity: formData.identity,
          name: formData.name,
          surname: formData.surname
        }
        updateRoommate({ variables: { data: { id: roommate?.id, ...variables } } })
          .then((value: FetchResult<UpdateRoommate>) => {
            const roommate = value.data?.updateRoommate?.roommate
            if (roommate !== undefined && roommate !== null) {
              message.success(t("guests.updated", { name: roommate.name, surname: roommate.surname }))
            }
            close()
          })
          .catch((reason: ApolloError) => message.error(reason.message))
      })
      .catch(() => message.error(t("errors.invalid-form")))
  }

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

  return guest === undefined
    || guest === null
    || roommate === undefined ? null : (
    <Drawer
      closeIcon={ (
        <Popconfirm
          onCancel={ () => setConfirmClose(false) }
          onConfirm={ () => {
            setConfirmClose(false)
            form.resetFields()
            close()
          } }
          placement="rightTop"
          title={ t("forms.close-dirty") }
          visible={ confirmClose }>
          <CloseOutlined onClick={ () => {
            if (form.isFieldsTouched()) {
              setConfirmClose(true)
            } else {
              close()
            }
          } } />
        </Popconfirm>
      ) }
      placement="left"
      title={ `${ t("guests.name") } - ${ roommate.name } ${ roommate.surname }` }
      width={ 500 }
      visible={ visible }
      footer={
        <Button
          onClick={ submitForm }
          type="primary">
          { t("forms.save") }
        </Button>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ loading }
        paragraph={ { rows: 15 } }>
        <Form
          form={ form }
          initialValues={ initialValues }
          layout="vertical"
          name="guest">
          <Title level={ 5 }>
            { t("forms.personal-data") }
          </Title>
          <Form.Item
            hasFeedback
            label={ t("name") }
            name="name"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              FormHelper.requiredAlphaRule(t("forms.enter-text"))
            ] }>
            <Input placeholder={ t("name") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("surname") }
            name="surname"
            required
            rules={ [
              FormHelper.requiredRule(t("forms.field-required")),
              FormHelper.requiredAlphaRule(t("forms.enter-text"))
            ] }>
            <Input placeholder={ t("surname") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("forms.id-number") }
            name="identity">
            <Input placeholder={ t("forms.id-number-full") } />
          </Form.Item>
          <Form.Item
            hasFeedback
            label={ t("age") }
            name="age">
            <Select
              options={ FormHelper.guestAgeOptions }
              placeholder={ t("forms.choose-from-list") } />
          </Form.Item>
        </Form>
      </Skeleton>
    </Drawer>
  )
}