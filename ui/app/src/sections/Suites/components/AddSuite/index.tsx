import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  hasAccess: boolean
  onAdd: () => void
}

export const AddSuite = ({
  hasAccess,
  onAdd
}: Props) => {
  return hasAccess === true ? (
    <Button
      icon={ <PlusCircleOutlined /> }
      onClick={ onAdd }
      type="primary">
      Přidat apartmá
    </Button>
  ) : null
}