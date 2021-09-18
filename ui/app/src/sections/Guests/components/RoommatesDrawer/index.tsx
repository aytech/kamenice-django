import { CloseOutlined, WarningOutlined } from "@ant-design/icons"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { Button, Drawer, Form, message, Popconfirm, Skeleton } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { CREATE_ROOMMATE, DELETE_ROOMMATE, UPDATE_ROOMMATE } from "../../../../lib/graphql/mutations/Roommate"
import { CreateRoommate, CreateRoommateVariables, CreateRoommate_createRoommate_roommate } from "../../../../lib/graphql/mutations/Roommate/__generated__/CreateRoommate"
import { DeleteRoommate, DeleteRoommateVariables, DeleteRoommate_deleteRoommate_roommate } from "../../../../lib/graphql/mutations/Roommate/__generated__/DeleteRoommate"
import { UpdateRoommate, UpdateRoommateVariables, UpdateRoommate_updateRoommate_roommate } from "../../../../lib/graphql/mutations/Roommate/__generated__/UpdateRoommate"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"
import { IGuestForm } from "../../../../lib/Types"
import { GuestForm } from "../GuestForm"

interface Props {
  close: () => void
  guest?: Guests_guests | null
  refetch?: () => any
  roommate?: Roommates_roommates | null
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
  const [ deleteRoommate, { loading: deleteLoading } ] = useMutation<DeleteRoommate, DeleteRoommateVariables>(DELETE_ROOMMATE, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ updateRoommate, { loading: updateLoading } ] = useMutation<UpdateRoommate, UpdateRoommateVariables>(UPDATE_ROOMMATE, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const actionCallback = (callback: (newRoommate: any) => void, newRoommate?: any | null) => {
    if (newRoommate !== undefined || newRoommate !== null) {
      callback(newRoommate)
    }
    if (refetch !== undefined) {
      refetch()
    }
    close()
  }

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: IGuestForm = form.getFieldsValue(true)
        const variables = {
          age: formData.age,
          addressMunicipality: formData.address?.municipality,
          addressPsc: formData.address?.psc,
          addressStreet: formData.address?.street,
          citizenship: FormHelper.getGuestCitizenship(formData),
          email: formData.email,
          gender: formData.gender,
          identity: formData.identity,
          name: formData.name,
          phoneNumber: formData.phone,
          surname: formData.surname,
          visaNumber: formData.visa
        }
        if (roommate === undefined || roommate === null) {
          createRoommate({ variables: { data: { guestId: guest?.id, ...variables } } })
            .then((value: FetchResult<CreateRoommate>) => {
              actionCallback((newRoommate: CreateRoommate_createRoommate_roommate) => {
                message.success(t("guests.added", { name: newRoommate.name, surname: newRoommate.surname }))
              }, value.data?.createRoommate?.roommate)
            })
        } else {
          updateRoommate({ variables: { data: { id: roommate.id, ...variables } } })
            .then((value: FetchResult<UpdateRoommate>) => {
              actionCallback((newRoommate: UpdateRoommate_updateRoommate_roommate) => {
                message.success(t("guests.updated", { name: newRoommate.name, surname: newRoommate.surname }))
              }, value.data?.updateRoommate?.roommate)
            })
        }
      })
      .catch(() => message.error(t("errors.invalid-form")))
  }

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, roommate, visible ])

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
      title={ t("guests.roommate") }
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
                deleteRoommate({ variables: { roommateId: roommate.id } })
                  .then((value: FetchResult<DeleteRoommate>) => {
                    actionCallback((deletedRoommate: DeleteRoommate_deleteRoommate_roommate) => {
                      message.success(t("guests.deleted", { name: deletedRoommate.name, surname: deletedRoommate.surname }))
                    }, value.data?.deleteRoommate?.roommate)
                  })
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
        loading={
          createLoading
          || deleteLoading
          || updateLoading }
        paragraph={ { rows: 15 } }>
        <GuestForm
          emailRequired={ false }
          form={ form }
          guest={ roommate } />
      </Skeleton>
    </Drawer>
  )
}