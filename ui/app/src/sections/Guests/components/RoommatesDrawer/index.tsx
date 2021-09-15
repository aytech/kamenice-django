import { CloseOutlined, WarningOutlined } from "@ant-design/icons"
import { Button, Drawer, Form, Popconfirm } from "antd"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"

interface Props {
  close: () => void
  guest: Guests_guests | null
  roommate?: Guests_guests | null
  visible: boolean
}

export const RoommatesDrawer = ({
  close,
  guest,
  roommate,
  visible
}: Props) => {

  const { t } = useTranslation()

  const [ form ] = Form.useForm()

  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)

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
            onClick={ () => console.log("Submit form") }
            type="primary">
            { (roommate === undefined || roommate === null) ? t("forms.create") : t("forms.update") }
          </Button>
        </>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }></Drawer>
  )
}