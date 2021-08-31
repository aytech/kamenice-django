import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  hasAccess: boolean
  onAdd: () => void
}

export const AddSuite = ({
  hasAccess,
  onAdd
}: Props) => {

  const { t } = useTranslation()

  return hasAccess === true ? (
    <Button
      icon={ <PlusCircleOutlined /> }
      onClick={ onAdd }
      type="primary">
      { t("living-unit-add") }
    </Button>
  ) : null
}