import { useState } from "react"
import { Button, Drawer, Form, message, Popconfirm, Skeleton } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import "./styles.css"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { CREATE_GUEST, UPDATE_GUEST } from "../../../../lib/graphql/mutations/Guest"
import { CreateGuest, CreateGuestVariables, CreateGuest_createGuest_guest } from "../../../../lib/graphql/mutations/Guest/__generated__/CreateGuest"
import { UpdateGuest, UpdateGuestVariables, UpdateGuest_updateGuest_guest } from "../../../../lib/graphql/mutations/Guest/__generated__/UpdateGuest"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { GuestForm } from "../GuestForm"
import { IGuestForm } from "../../../../lib/Types"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { guestDrawerOpen, selectedGuest } from "../../../../cache"

interface Props {
  refetch?: (guest?: any) => void
}

export const GuestDrawer = ({
  refetch
}: Props) => {

  const { t } = useTranslation()
  const guest = selectedGuest()

  const [ form ] = Form.useForm()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createGuest, { loading: createLoading } ] = useMutation<CreateGuest, CreateGuestVariables>(CREATE_GUEST, {
    onError: networkErrorHandler
  })
  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateGuest, UpdateGuestVariables>(UPDATE_GUEST, {
    onError: networkErrorHandler
  })

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const actionCallback = (callback: (newGuest: any) => void, newGuest?: any | null) => {
    if (newGuest !== undefined && newGuest !== null) {
      callback(newGuest)
    }
    if (refetch !== undefined) {
      refetch(newGuest)
    }
    guestDrawerOpen(false)
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
    if (guestDrawerOpen() === true) {
      form.resetFields()
    }
  }, [ form ])

  return (
    <Drawer
      closeIcon={ (
        <Popconfirm
          onCancel={ () => setConfirmClose(false) }
          onConfirm={ () => {
            setConfirmClose(false)
            form.resetFields()
            guestDrawerOpen(false)
          } }
          placement="rightTop"
          title={ t("forms.close-dirty") }
          visible={ confirmClose }>
          <CloseOutlined onClick={ () => {
            if (form.isFieldsTouched()) {
              setConfirmClose(true)
            } else {
              guestDrawerOpen(false)
            }
          } } />
        </Popconfirm>
      ) }
      placement="left"
      title={ t("guests.name") }
      width={ 500 }
      visible={ guestDrawerOpen() }
      footer={
        <Button
          onClick={ submitForm }
          type="primary">
          { (guest === undefined || guest === null) ? t("forms.create") : t("forms.update") }
        </Button>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ createLoading || updateLoading }
        paragraph={ { rows: 15 } }>
        <GuestForm form={ form } />
      </Skeleton>
    </Drawer>
  )
}