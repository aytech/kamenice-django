import { WarningOutlined } from "@ant-design/icons"
import { Button, Popconfirm } from "antd"
import { useTranslation } from "react-i18next"
import { ISuite } from "../../../../../../lib/Types"

interface Props {
  deleteSuite: (suiteId: string) => void
  submitForm: () => void
  suite?: ISuite
}

export const RoomActions = ({
  deleteSuite,
  submitForm,
  suite
}: Props) => {

  const { t } = useTranslation()

  return (
    <>
      { suite !== undefined &&
        <Popconfirm
          cancelText={ t("no") }
          icon={ <WarningOutlined /> }
          okText={ t("yes") }
          onConfirm={ () => {
            deleteSuite(suite.id)
          } }
          title={ t("tooltips.delete-confirm") }>
          <Button
            danger
            style={ {
              float: "left"
            } }
            type="primary">
            { t("delete") }
          </Button>
        </Popconfirm>
      }
      <Button
        onClick={ submitForm }
        type="primary">
        { suite === undefined ? t("forms.create") : t("forms.update") }
      </Button>
    </>
  )
}