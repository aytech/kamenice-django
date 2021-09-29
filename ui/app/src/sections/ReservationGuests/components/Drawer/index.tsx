import { CloseOutlined } from "@ant-design/icons"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { Button, Drawer, Form, message, Popconfirm, Skeleton } from "antd"
import { useEffect } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { UPDATE_RESERVATON_GUEST } from "../../../../lib/graphql/mutations/ReservationGuest"
import { UpdateReservationGuest, UpdateReservationGuestVariables } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/UpdateReservationGuest"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { IGuestForm } from "../../../../lib/Types"
import { GuestForm } from "../../../Guests/components/GuestForm"

interface Props {
  close: () => void
  guest?: Guests_guests
  reservationHash: string
  visible: boolean
}

export const ReservationGuestDrawer = ({
  close,
  guest,
  reservationHash,
  visible
}: Props) => {

  const { t } = useTranslation()

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
        updateGuest({ variables: { data: { id: String(guest?.id), hash: reservationHash, ...variables } } })
          .then((value: FetchResult<UpdateReservationGuest>) => {
            const guest = value.data?.updateReservationGuest?.guest
            if (guest !== undefined && guest !== null) {
              message.success(t("guests.updated", { name: guest.name, surname: guest.surname }))
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

  return guest === undefined ? null : (
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
      title={ `${ t("guests.name") } - ${ guest.name } ${ guest.surname }` }
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
        loading={ updateLoading }
        paragraph={ { rows: 15 } }>
        <GuestForm
          form={ form }
          guest={ guest } />
      </Skeleton>
    </Drawer>
  )
}