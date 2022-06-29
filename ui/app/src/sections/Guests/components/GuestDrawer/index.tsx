import { useState } from "react"
import { Button, Drawer, Form, message, Popconfirm, Skeleton } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import "./styles.css"
import { ApolloError, FetchResult, useMutation, useReactiveVar } from "@apollo/client"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { GuestForm } from "../GuestForm"
import { IGuest, IGuestForm } from "../../../../lib/Types"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { guestDrawerOpen, selectedGuest } from "../../../../cache"
import Title from "antd/lib/typography/Title"
import { CreateGuestDocument, CreateGuestMutation, CreateGuestMutationVariables, UpdateGuestDocument, UpdateGuestMutation, UpdateGuestMutationVariables } from "../../../../lib/graphql/graphql"

interface Props {
  refetch?: () => void
}

export const GuestDrawer = ({
  refetch
}: Props) => {

  const { t } = useTranslation()
  const guest = selectedGuest()
  const visible = useReactiveVar(guestDrawerOpen)

  const [ form ] = Form.useForm()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createGuest, { loading: createLoading } ] = useMutation<CreateGuestMutation, CreateGuestMutationVariables>(CreateGuestDocument, {
    onError: networkErrorHandler
  })
  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateGuestMutation, UpdateGuestMutationVariables>(UpdateGuestDocument, {
    onError: networkErrorHandler
  })

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const actionCallback = (callback: (newGuest: any) => void, newGuest?: any | null) => {
    if (newGuest !== undefined && newGuest !== null) {
      callback(newGuest)
    }
    if (refetch !== undefined) {
      refetch()
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
            .then((value: FetchResult<CreateGuestMutation>) => {
              actionCallback((newGuest: IGuest) => {
                message.success(t("guests.added", { name: newGuest.name, surname: newGuest.surname }))
              }, value.data?.createGuest?.guest)
            })
        } else {
          updateGuest({ variables: { data: { id: String(guest.id), ...variables } } })
            .then((value: FetchResult<UpdateGuestMutation>) => {
              actionCallback((newGuest: IGuest) => {
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
      className="guest-drawer"
      closable={ false }
      extra={
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
          <Button
            className="close-button"
            icon={ <CloseOutlined /> }
            onClick={ () => {
              if (form.isFieldsTouched()) {
                setConfirmClose(true)
              } else {
                guestDrawerOpen(false)
              }
            } }
            shape="circle" />
        </Popconfirm>
      }
      placement="left"
      title={ (
        <Title
          className="drawer-title"
          level={ 4 }>
          { t("guests.name") }
        </Title>)
      }
      width={ 500 }
      visible={ visible }
      footer={
        <Button
          id="submit-guest"
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