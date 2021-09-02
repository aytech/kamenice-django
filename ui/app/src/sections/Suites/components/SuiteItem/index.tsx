import { HomeOutlined } from "@ant-design/icons"
import { Avatar, Button, List } from "antd"
import { useTranslation } from "react-i18next"
import { Suites_suites } from "../../../../lib/graphql/queries/Suites/__generated__/Suites"

interface Props {
  openSuite: (suite: Suites_suites) => void
  suite: Suites_suites
}

export const SuiteItem = ({
  openSuite,
  suite
}: Props) => {

  const { t } = useTranslation()

  return (
    <List.Item
      actions={ [
        <Button
          className="low-case"
          key="edit"
          onClick={ () => openSuite(suite) }
          type="link">
          { t("forms.update") }
        </Button>
      ] }
      className="suite-item"
      onClick={ () => openSuite(suite) }>
      <List.Item.Meta
        avatar={
          <Avatar gap={ 4 } size="large">
            <HomeOutlined />
          </Avatar>
        }
        description={ `${ t("rooms.number") } - ${ suite.number }` }
        title={ suite.title } />
    </List.Item>
  )
}