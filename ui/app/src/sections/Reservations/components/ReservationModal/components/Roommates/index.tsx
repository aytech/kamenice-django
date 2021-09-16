import { UserAddOutlined } from "@ant-design/icons"
import { Form, Input } from "antd"
import { useTranslation } from "react-i18next"
import { Roommates as RoommatesData } from "../../../../../../lib/graphql/queries/Roommates/__generated__/Roommates"

interface Props {
  roommates?: RoommatesData
}

export const Roommates = ({
  roommates
}: Props) => {

  const { t } = useTranslation()

  return roommates !== undefined
    && roommates.roommates !== null
    && roommates.roommates.length > 0 ? (

    <>
      {
        roommates.roommates.map(roommate => {
          return roommate === null ? null : (
            <Form.Item
              key={ roommate.id }
              label={ t("guests.roommate") }>
              <Input
                disabled
                placeholder={ `${ roommate.name } ${ roommate.surname }` }
                prefix={
                  <UserAddOutlined />
                } />
            </Form.Item>
          )
        })
      }
    </>

  ) : null
}