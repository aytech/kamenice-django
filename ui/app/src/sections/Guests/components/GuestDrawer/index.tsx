import { useState } from "react"
import { Button, Drawer, Form, message, Popconfirm, Skeleton } from "antd"
import { CloseOutlined, WarningOutlined } from "@ant-design/icons"
import "./styles.css"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { CREATE_GUEST, DELETE_GUEST, UPDATE_GUEST } from "../../../../lib/graphql/mutations/Guest"
import { CreateGuest, CreateGuestVariables, CreateGuest_createGuest_guest } from "../../../../lib/graphql/mutations/Guest/__generated__/CreateGuest"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { UpdateGuest, UpdateGuestVariables, UpdateGuest_updateGuest_guest } from "../../../../lib/graphql/mutations/Guest/__generated__/UpdateGuest"
import { useEffect } from "react"
import { DeleteGuest, DeleteGuestVariables, DeleteGuest_deleteGuest_guest } from "../../../../lib/graphql/mutations/Guest/__generated__/DeleteGuest"
import { useTranslation } from "react-i18next"
import { GuestForm } from "../GuestForm"
import { IGuestForm } from "../../../../lib/Types"
import { FormHelper } from "../../../../lib/components/FormHelper"

interface Props {
  close: () => void
  guest?: Guests_guests | null
  refetch?: (guest?: any) => void
  visible: boolean
}

export const GuestDrawer = ({
  close,
  guest,
  refetch,
  visible
}: Props) => {

  const { t } = useTranslation()

  const [ form ] = Form.useForm()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createGuest, { loading: createLoading } ] = useMutation<CreateGuest, CreateGuestVariables>(CREATE_GUEST, {
    onError: networkErrorHandler
  })
  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateGuest, UpdateGuestVariables>(UPDATE_GUEST, {
    onError: networkErrorHandler
  })
  const [ deleteGuest, { loading: deleteLoading } ] = useMutation<DeleteGuest, DeleteGuestVariables>(DELETE_GUEST, {
    onError: networkErrorHandler
  })

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const actionCallback = (callback: (newGuest: any) => void, newGuest?: any | null) => {
    if (newGuest !== undefined || newGuest !== null) {
      callback(newGuest)
    }
    if (refetch !== undefined) {
      refetch(newGuest)
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
        if (guest === undefined || guest === null) {
          createGuest({ variables: { data: { ...variables } } })
            .then((value: FetchResult<CreateGuest>) => {
              actionCallback((newGuest: CreateGuest_createGuest_guest) => {
                message.success(t("guests.added", { name: newGuest.name, surname: newGuest.surname }))
              }, value.data?.createGuest?.guest)
            })
        } else {
          updateGuest({ variables: { data: { id: String(guest.id), ...variables } } })
            .then((value: FetchResult<UpdateGuest>) => {
              actionCallback((newGuest: UpdateGuest_updateGuest_guest) => {
                message.success(t("guests.updated", { name: newGuest.name, surname: newGuest.surname }))
              }, value.data?.updateGuest?.guest)
            })
        }
      })
      .catch(() => message.error(t("errors.invalid-form")))
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
      title={ t("guests.name") }
      width={ 500 }
      visible={ visible }
      footer={
        <>
          { guest !== undefined && guest !== null &&
            <Popconfirm
              cancelText={ t("no") }
              icon={ <WarningOutlined /> }
              okText={ t("yes") }
              onConfirm={ () => {
                deleteGuest({ variables: { guestId: guest.id } })
                  .then((value: FetchResult<DeleteGuest>) => {
                    actionCallback((deletedGuest: DeleteGuest_deleteGuest_guest) => {
                      message.success(t("deleted-extended", { name: deletedGuest.name, surname: deletedGuest.surname }))
                    }, value.data?.deleteGuest?.guest)
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
            onClick={ submitForm }
            type="primary">
            { (guest === undefined || guest === null) ? t("forms.create") : t("forms.update") }
          </Button>
        </>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ createLoading || updateLoading || deleteLoading }
        paragraph={ { rows: 15 } }>
        <GuestForm
          emailRequired={ true }
          form={ form }
          guest={ guest } />
      </Skeleton>
    </Drawer>
  )
}