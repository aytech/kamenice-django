import { WarningOutlined } from "@ant-design/icons"
import { Button, Popconfirm } from "antd"
import { useTranslation } from "react-i18next"
import { Suites_suites } from "../../../../../../lib/graphql/queries/Suites/__generated__/Suites"

interface Props {
  deleteSuite: (suiteId: string) => void
  submitForm: () => void
  suite?: Suites_suites
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
          title={ t("forms.delete-confirm") }>
          <Button
            danger
            style={ {
              float: "left"
            } }
            type="primary">
            { t("forms.delete") }
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