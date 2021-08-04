import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { User } from "../../../../lib/Types";

interface Props {
  onAdd: () => void
  user: User | undefined
}

export const AddSuite = ({
  onAdd,
  user
}: Props) => {
  return user === undefined ? (
    <Button
      icon={ <PlusCircleOutlined /> }
      onClick={ onAdd }
      type="primary">
      Přidat apartmá
    </Button>
  ) : null
}