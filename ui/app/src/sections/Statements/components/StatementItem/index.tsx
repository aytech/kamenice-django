import { DeleteOutlined, FileOutlined, FilePdfOutlined, FileWordOutlined } from "@ant-design/icons"
import { ApolloError, useMutation } from "@apollo/client"
import { Avatar, Button, List, message, Popconfirm, Tooltip } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { DeleteStatementDocument, DeleteStatementMutation, DeleteStatementMutationVariables } from "../../../../lib/graphql/graphql"
import { IGuestReportFile } from "../../../../lib/Types"

interface Props {
  refetchStatements: () => void
  statement: IGuestReportFile
}

export const StatementItem = ({
  refetchStatements,
  statement
}: Props) => {

  const { t } = useTranslation()

  const [ deleteFile, { loading: deleteLoading } ] = useMutation<DeleteStatementMutation, DeleteStatementMutationVariables>(DeleteStatementDocument, {
    onCompleted: (value: DeleteStatementMutation) => {
      if (value.deleteDriveFile !== null && value.deleteDriveFile?.file !== null) {
        message.success(t("statements.delete-success", { name: value.deleteDriveFile?.file?.name }))
        refetchStatements()
      }
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const [ createdDate, setCreatedDate ] = useState<string>()

  useEffect(() => {
    setCreatedDate(moment(statement.created).format('DD-MM-YYYY HH:mm'))
  }, [ statement ])

  return (
    <List.Item
      actions={ [
        <Tooltip title={ t("statements.download-format", { format: "PDF" }) }>
          <Button
            key="pdf"
            icon={ <FilePdfOutlined /> }
            onClick={ () => {
              if (statement.pathPdf !== null) {
                window.open(statement.pathPdf, '_blank', 'noopener,noreferrer')
              }
            } } />
        </Tooltip>,
        <Tooltip title={ t("statements.download-format", { format: "Microsoft Word" }) }>
          <Button
            key="docx"
            icon={ <FileWordOutlined /> }
            onClick={ () => {
              if (statement.pathDocx !== null) {
                window.open(statement.pathDocx, '_blank', 'noopener,noreferrer')
              }
            } } />
        </Tooltip>,
        <Popconfirm
          cancelText={ t("no") }
          okText={ t("yes") }
          onConfirm={ () => {
            if (statement.id !== null) {
              deleteFile({ variables: { fileId: statement.driveId } })
            }
          } }
          title={ t("tooltips.delete-confirm") }>
          <Button
            danger
            key="delete"
            icon={ <DeleteOutlined /> }
            loading={ deleteLoading }>
            { t("delete") }
          </Button>
        </Popconfirm>
      ] }>
      <List.Item.Meta
        avatar={
          <Avatar
            gap={ 4 }
            size="large">
            <FileOutlined />
          </Avatar>
        }
        description={ t("statements.generated", { date: createdDate }) }
        title={ statement.name } />
    </List.Item>
  )
}