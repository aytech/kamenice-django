import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onAdd: () => void
}

export const AddSuite = ({
  onAdd
}: Props) => {
  return (
    <Button
      icon={ <PlusCircleOutlined /> }
      onClick={ onAdd }
      type="primary">
      Přidat apartmá
    </Button>
  )
}