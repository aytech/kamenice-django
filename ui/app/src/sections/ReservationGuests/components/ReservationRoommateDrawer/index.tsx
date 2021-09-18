import { CloseOutlined } from "@ant-design/icons"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { Drawer, Form, message, Popconfirm, Skeleton } from "antd"
import { useEffect } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { CREATE_RESERVATON_ROOMMATE, DELETE_RESERVATON_ROOMMATE, UPDATE_RESERVATON_ROOMMATE } from "../../../../lib/graphql/mutations/ReservationGuest"
import { CreateReservationRoommate, CreateReservationRoommateVariables, CreateReservationRoommate_createReservationRoommate_roommate } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/CreateReservationRoommate"
import { DeleteReservationRoommate, DeleteReservationRoommateVariables, DeleteReservationRoommate_deleteReservationRoommate_roommate } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/DeleteReservationRoommate"
import { UpdateReservationRoommate, UpdateReservationRoommateVariables, UpdateReservationRoommate_updateReservationRoommate_roommate } from "../../../../lib/graphql/mutations/ReservationGuest/__generated__/UpdateReservationRoommate"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"
import { IGuestForm } from "../../../../lib/Types"
import { GuestForm } from "../../../Guests/components/GuestForm"
import { Footer } from "./components/Footer"

interface Props {
  close: () => void
  guest?: Guests_guests | null
  refetch?: () => void
  reservationHash: string
  roommate?: Roommates_roommates
  visible: boolean
}

export const ReservationRoommateDrawer = ({
  close,
  guest,
  refetch,
  reservationHash,
  roommate,
  visible
}: Props) => {

  const { t } = useTranslation()

  const [ createRoommate, { loading: createLoading } ] = useMutation<CreateReservationRoommate, CreateReservationRoommateVariables>(CREATE_RESERVATON_ROOMMATE)
  const [ deleteRoommate, { loading: deleteLoading } ] = useMutation<DeleteReservationRoommate, DeleteReservationRoommateVariables>(DELETE_RESERVATON_ROOMMATE)
  const [ updateRoommate, { loading: updateLoading } ] = useMutation<UpdateReservationRoommate, UpdateReservationRoommateVariables>(UPDATE_RESERVATON_ROOMMATE)

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

  const [ form ] = Form.useForm()

  const actionCallback = (callback: (roommate: any) => void, roommate?: any | null) => {
    if (roommate !== undefined || roommate !== null) {
      callback(roommate)
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
          citizenship: formData.citizenship?.selected === undefined ? formData.citizenship?.new : formData.citizenship.selected,
          email: formData.email,
          gender: formData.gender,
          identity: formData.identity,
          name: formData.name,
          phoneNumber: formData.phone,
          surname: formData.surname,
          visaNumber: formData.visa
        }
        if (roommate === undefined) {
          createRoommate({ variables: { data: { hash: reservationHash, ...variables } } })
            .then((value: FetchResult<CreateReservationRoommate>) => {
              actionCallback((roommate: CreateReservationRoommate_createReservationRoommate_roommate) => {
                message.success(t("guests.added", { name: roommate.name, surname: roommate.surname }))
              }, value.data?.createReservationRoommate?.roommate)
            })
            .catch((reason: ApolloError) => message.error(reason.message))
        } else {
          updateRoommate({ variables: { data: { id: roommate?.id, hash: reservationHash, ...variables } } })
            .then((value: FetchResult<UpdateReservationRoommate>) => {
              actionCallback((roommate: UpdateReservationRoommate_updateReservationRoommate_roommate) => {
                message.success(t("guests.updated", { name: roommate.name, surname: roommate.surname }))
              }, value.data?.updateReservationRoommate?.roommate)
            })
            .catch((reason: ApolloError) => message.error(reason.message))
        }
      })
      .catch(() => message.error(t("errors.invalid-form")))
  }

  const getPageTitle = () => {
    if (roommate === undefined) {
      return t("guests.new")
    } else {
      return `${ t("guests.name") } - ${ roommate.name } ${ roommate.surname }`
    }
  }

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

  return guest === undefined
    || guest === null ? null : (
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
      title={ getPageTitle() }
      width={ 500 }
      visible={ visible }
      footer={
        <Footer
          deleteRoommate={ () => {
            deleteRoommate({ variables: { data: { id: roommate?.id, hash: reservationHash } } })
              .then((value: FetchResult<DeleteReservationRoommate>) => {
                actionCallback((roommate: DeleteReservationRoommate_deleteReservationRoommate_roommate) => {
                  message.success(t("guests.deleted", { name: roommate.name, surname: roommate.surname }))
                }, value.data?.deleteReservationRoommate?.roommate)
              })
          } }
          roommate={ roommate }
          submit={ submitForm } />
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ createLoading
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