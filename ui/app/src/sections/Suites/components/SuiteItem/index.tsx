import { DeleteOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons"
import { ApolloError, useMutation } from "@apollo/client"
import { Avatar, Button, List, message, Popconfirm } from "antd"
import { useTranslation } from "react-i18next"
import { DELETE_SUITE } from "../../../../lib/graphql/mutations/Suite"
import { DeleteSuite, DeleteSuiteVariables } from "../../../../lib/graphql/mutations/Suite/__generated__/DeleteSuite"
import { Suites_suites } from "../../../../lib/graphql/queries/Suites/__generated__/Suites"

interface Props {
  openSuite: (suite: Suites_suites) => void
  refetch?: () => void
  suite: Suites_suites
}

export const SuiteItem = ({
  openSuite,
  refetch,
  suite
}: Props) => {

  const { t } = useTranslation()

  const [ deleteSuite, { loading: deleteLoading } ] = useMutation<DeleteSuite, DeleteSuiteVariables>(DELETE_SUITE, {
    onCompleted: () => {
      message.success(t("rooms.deleted"))
      if (refetch !== undefined) {
        refetch()
      }
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  return (
    <List.Item
      actions={ [
        <Button
          className="edit-suite"
          key="edit"
          icon={ <EditOutlined /> }
          onClick={ () => openSuite(suite) }>
          { t("forms.update") }
        </Button>,
        <Popconfirm
          cancelText={ t("no") }
          id="delete-suite-confirm"
          key="delete"
          okText={ t("yes") }
          onConfirm={ () => deleteSuite({ variables: { suiteId: suite.id } }) }
          title={ t("forms.delete-confirm") }>
          <Button
            danger
            className="delete-suite"
            key="delete"
            icon={ <DeleteOutlined /> }
            loading={ deleteLoading }>
            { t("forms.delete") }
          </Button>
        </Popconfirm>
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