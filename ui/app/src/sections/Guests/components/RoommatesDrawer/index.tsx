import { CloseOutlined, WarningOutlined } from "@ant-design/icons"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Skeleton } from "antd"
import { Store } from "antd/lib/form/interface"
import Title from "antd/lib/typography/Title"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { CREATE_ROOMMATE } from "../../../../lib/graphql/mutations/Roommate"
import { CreateRoommate, CreateRoommateVariables } from "../../../../lib/graphql/mutations/Roommate/__generated__/CreateRoommate"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { GuestForm } from "../../../../lib/Types"

interface Props {
  close: () => void
  guest?: Guests_guests | null
  refetch?: () => any
  roommate?: Guests_guests | null
  visible: boolean
}

export const RoommatesDrawer = ({
  close,
  guest,
  refetch,
  roommate,
  visible
}: Props) => {

  const { t } = useTranslation()

  const [ createRoommate, { loading: createLoading } ] = useMutation<CreateRoommate, CreateRoommateVariables>(CREATE_ROOMMATE, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const [ form ] = Form.useForm()

  const initialValues: Store = {
    age: roommate?.age,
    name: roommate?.name,
    surname: roommate?.surname
  }

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: GuestForm = form.getFieldsValue(true)
        const variables = {
          age: formData.age,
          guestId: guest?.id,
          name: formData.name,
          surname: formData.surname
        }
        if (roommate === undefined || roommate === null) {
          createRoommate({ variables: { data: { ...variables } } })
            .then((result: FetchResult<CreateRoommate>) => {
              const roommate = result.data?.createRoommate?.roommate
              if (roommate !== undefined && roommate !== null) {
                message.success(t("guests.added", { name: roommate.name, surname: roommate.surname }))
              }
              if (refetch !== undefined) {
                refetch()
              }
              close()
            })
        }
      })
      .catch(() => message.error(t("errors.invalid-form")))
  }

  return (
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
      title={
        <>
          { guest?.name } { guest?.surname } - <span className="low-case">{ t("guests.roommate") }</span>
        </>
      }
      width={ 500 }
      visible={ visible }
      footer={
        <>
          { roommate !== undefined && roommate !== null &&
            <Popconfirm
              cancelText={ t("no") }
              icon={ <WarningOutlined /> }
              okText={ t("yes") }
              onConfirm={ () => {
                console.log("Delete roommate")
                // deleteGuest({ variables: { guestId: guest.id } })
                //   .then((value: FetchResult<DeleteGuest>) => {
                //     const guest = value.data?.deleteGuest?.guest
                //     if (removeGuest !== undefined && guest !== undefined && guest !== null) {
                //       removeGuest(guest.id)
                //       message.success(t("guests.deleted"))
                //       close()
                //     }
                //   })
              } }
              title={ t("forms.delete-confirm") }>
              <Button
                danger
                style={ {
                  float: "left"
                } }
                type="primary">
                { t('forms.delete') }
              </Button>
            </Popconfirm>
          }
          <Button
            disabled={ createLoading }
            onClick={ submitForm }
            type="primary">
            { (roommate === undefined || roommate === null) ? t("forms.create") : t("forms.update") }
          </Button>
        </>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ createLoading }
        paragraph={ { rows: 15 } }>
        <Form
          form={ form }
          initialValues={ initialValues }
          layout="vertical"
          name="roommates">
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
            <Input placeholder={ t('name') } />
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