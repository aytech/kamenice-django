import { DeleteOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons"
import { ApolloError, useMutation } from "@apollo/client"
import { Avatar, Button, List, message, Popconfirm } from "antd"
import { useTranslation } from "react-i18next"
import { DeleteSuiteDocument, DeleteSuiteMutation, DeleteSuiteMutationVariables } from "../../../../lib/graphql/graphql"
import { ISuite } from "../../../../lib/Types"

interface Props {
  openSuite: (suite: ISuite) => void
  refetch?: () => void
  suite: ISuite
}

export const SuiteItem = ({
  openSuite,
  refetch,
  suite
}: Props) => {

  const { t } = useTranslation()

  const [ deleteSuite, { loading: deleteLoading } ] = useMutation<DeleteSuiteMutation, DeleteSuiteMutationVariables>(DeleteSuiteDocument, {
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
          title={ t("tooltips.delete-confirm") }>
          <Button
            danger
            className="delete-suite"
            key="delete"
            icon={ <DeleteOutlined /> }
            loading={ deleteLoading }>
            { t("delete") }
          </Button>
        </Popconfirm>
      ] }
      className="suite-item">
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