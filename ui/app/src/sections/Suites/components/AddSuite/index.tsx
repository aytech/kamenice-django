import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Whoami_whoami } from "../../../../lib/graphql/queries/User/__generated__/Whoami";

interface Props {
  onAdd: () => void
  user: Whoami_whoami | undefined
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