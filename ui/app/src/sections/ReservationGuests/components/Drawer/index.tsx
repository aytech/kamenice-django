import { CloseOutlined } from "@ant-design/icons"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { Button, Drawer, Form, message, Popconfirm, Skeleton } from "antd"
import { useEffect } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { selectedGuest } from "../../../../cache"
import { CREATE_RESERVATON_GUEST, UPDATE_RESERVATON_GUEST } from "../../../../lib/graphql/mutations/ReservationGuest"
import { CreateReservationGuest, CreateReservationGuestVariables } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/CreateReservationGuest"
import { UpdateReservationGuest, UpdateReservationGuestVariables } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/UpdateReservationGuest"
import { IGuestForm } from "../../../../lib/Types"
import { GuestForm } from "../../../Guests/components/GuestForm"

interface Props {
  close: () => void
  refetch: () => void
  reservationHash: string
  visible: boolean
}

export const ReservationGuestDrawer = ({
  close,
  refetch,
  reservationHash,
  visible
}: Props) => {

  const { t } = useTranslation()
  const guest = selectedGuest()

  const [ createGuest, { loading: createLoading } ] = useMutation<CreateReservationGuest, CreateReservationGuestVariables>(CREATE_RESERVATON_GUEST, {
    onCompleted: (value: CreateReservationGuest) => {
      const createdGuest = value.createReservationGuest?.guest
      if (createdGuest !== undefined && createdGuest !== null) {
        message.success(t("guests.added", { name: createdGuest.name, surname: createdGuest.surname }))
      }
      if (refetch !== undefined) {
        refetch()
      }
      close()
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateReservationGuest, UpdateReservationGuestVariables>(UPDATE_RESERVATON_GUEST)

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const [ form ] = Form.useForm()

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: IGuestForm = form.getFieldsValue(true)
        const variables = {
          age: formData.age,
          addressMunicipality: formData.address?.municipality,
          addressPsc: formData.address?.psc,
          addressStreet: formData.address?.street,
          citizenship: formData.citizenship?.selected === undefined ? formData.citizenship?.new : formData.citizenship.selected,
          email: formData.email,
          gender: formData.gender,
          identity: formData.identity,
          name: formData.name,
          phoneNumber: formData.phone,
          surname: formData.surname,
          visaNumber: formData.visa
        }
        if (guest === null) {
          createGuest({ variables: { data: { hash: reservationHash, ...variables } } })
        } else {
          updateGuest({ variables: { data: { id: String(guest.id), hash: reservationHash, ...variables } } })
            .then((value: FetchResult<UpdateReservationGuest>) => {
              const updatedGuest = value.data?.updateReservationGuest?.guest
              if (updatedGuest !== undefined && updatedGuest !== null) {
                message.success(t("guests.updated", { name: updatedGuest.name, surname: updatedGuest.surname }))
              }
              close()
            })
            .catch((reason: ApolloError) => message.error(reason.message))
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
      title={ guest === null ? t("guests.new") : `${ guest.name } ${ guest.surname }` }
      width={ 500 }
      visible={ visible }
      footer={
        <Button
          onClick={ submitForm }
          type="primary">
          { guest === null ? t("forms.create") : t("forms.update") }
        </Button>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ updateLoading || createLoading }
        paragraph={ { rows: 15 } }>
        <GuestForm form={ form } />
      </Skeleton>
    </Drawer>
  )
}