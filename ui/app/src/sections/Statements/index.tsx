import { Button, Col, DatePicker, Form, Input, List, message, Modal, Pagination, Row, Skeleton, Spin, Tooltip } from "antd"
import { useTranslation } from "react-i18next"
import Text from "antd/lib/typography/Text"
import { CloseOutlined, FileAddOutlined } from "@ant-design/icons"
import { useCallback, useEffect, useState } from "react"
import { ApolloError, useLazyQuery, useQuery } from "@apollo/client"
import { GENERATE_STATEMENT, STATEMENTS } from "../../lib/graphql/queries/Statements"
import { Statements as StatementsData, Statements_guestsReportFiles } from "../../lib/graphql/queries/Statements/__generated__/Statements"
import { PagerHelper } from "../../lib/components/PagerHelper"
import { StatementItem } from "./components/StatementItem"
import { GenerateStatement } from "../../lib/graphql/queries/Statements/__generated__/GenerateStatement"
import "./styles.css"
import { pageTitle, selectedPage } from "../../cache"

export const Statements = () => {

  const { t } = useTranslation()
  const [ form ] = Form.useForm()

  const [ statementModalOpen, setStatementModalOpen ] = useState<boolean>(false)
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ filteredFiles, setFilteredFiles ] = useState<Statements_guestsReportFiles[]>([])
  const [ totalFiles, setTotalFiles ] = useState<number>(0)
  const [ files, setFiles ] = useState<Statements_guestsReportFiles[]>([])

  const { data, loading, refetch: refetchStatements } = useQuery<StatementsData>(STATEMENTS, {
    onError: (reason: ApolloError) => message.error(reason.message)
  })
  const [ generateStatement, { loading: generateLoading } ] = useLazyQuery<GenerateStatement>(GENERATE_STATEMENT, {
    fetchPolicy: "no-cache",
    onCompleted: (value: GenerateStatement) => {
      if (value.guestsReport?.status === true) {
        setStatementModalOpen(false)
        form.resetFields()
        message.success(value.guestsReport.message)
      } else {
        message.error(value.guestsReport?.message)
      }
      refetchStatements()
    },
    onError: (reason: ApolloError) => message.error(reason.message)
  })

  const onPageChange = (page: number) => {
    PagerHelper.onPageChange(files, page, (slice: Statements_guestsReportFiles[]) => {
      setFilteredFiles(slice)
      setCurrentPage(page)
    })
  }

  const onSearch = (value: string) => {
    if (value.length < 1) {
      setTotalFiles(files.length)
      onPageChange(currentPage)
    } else {
      const foundFiles = files.filter(file => {
        return file.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      })
      setFilteredFiles(foundFiles)
      setTotalFiles(foundFiles.length)
    }
    setCurrentPage(1)
  }

  const updateFileList = useCallback((fileList) => {
    PagerHelper.getPageSlice(fileList, currentPage, (data: Statements_guestsReportFiles[], page: number) => {
      setCurrentPage(page)
      setFilteredFiles(data)
    })
  }, [ currentPage ])

  useEffect(() => {
    const statements: Statements_guestsReportFiles[] = []
    if (data !== undefined && data.guestsReportFiles !== null) {
      data.guestsReportFiles.forEach((statement: Statements_guestsReportFiles | null) => {
        if (statement !== null) {
          statements.push(statement)
        }
      })
      setFiles(statements)
      setTotalFiles(statements.length)
      updateFileList(statements)
    }
  }, [ data, updateFileList ])

  useEffect(() => {
    pageTitle(t("statements.page-title"))
    selectedPage("user")
  }, [ t ])

  return (
    <>
      <Skeleton
        active
        loading={ loading }
        paragraph={ { rows: 5 } }>
        <List
          bordered={ true }
          className="guests"
          dataSource={ filteredFiles }
          footer={
            <Row>
              <Col lg={ 5 } md={ 5 } sm={ 7 } xs={ 0 }></Col>
              <Col
                className="pagination"
                lg={ 14 } md={ 14 } sm={ 10 } xs={ 12 }>
                <Pagination
                  current={ currentPage }
                  onChange={ onPageChange }
                  pageSize={ PagerHelper.defaultPageSize }
                  total={ totalFiles } />
              </Col>
              <Col lg={ 5 } md={ 5 } sm={ 7 } xs={ 12 }>
                <Text disabled>&reg;{ t("company-name") }</Text>
              </Col>
            </Row>
          }
          header={ (
            <Row>
              <Col lg={ 10 } md={ 12 } sm={ 14 } xs={ 16 }>
                <Input.Search
                  allowClear
                  enterButton
                  id="search-file"
                  onSearch={ onSearch }
                  placeholder={ t("statements.search") } />
              </Col>
              <Col lg={ 12 } md={ 9 } sm={ 5 } xs={ 4 } />
              <Col lg={ 2 } md={ 3 } sm={ 5 } xs={ 4 }>
                <Tooltip title={ t("statements.generate") }>
                  <Button
                    block
                    loading={ generateLoading }
                    onClick={ () => setStatementModalOpen(true) }>
                    <FileAddOutlined />
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          ) }
          itemLayout="horizontal"
          renderItem={ (statement: Statements_guestsReportFiles) => (
            <StatementItem
              refetchStatements={ refetchStatements }
              statement={ statement } />
          ) } />
      </Skeleton>
      <Modal
        className="statement-modal"
        closeIcon={ (
          <Button
            className="close-button"
            disabled={ generateLoading }
            icon={ <CloseOutlined /> }
            shape="circle" />
        ) }
        title={ t("statements.modal-title") }
        visible={ statementModalOpen }
        okText={ t("statements.action-generate") }
        okButtonProps={ { disabled: generateLoading } }
        onOk={ () => {
          form.validateFields()
            .then(() => {
              const from = form.getFieldValue("from")
              const to = form.getFieldValue("to")
              generateStatement({
                variables: {
                  fromDate: from.format('YYYY-MM-DD'),
                  toDate: to.format('YYYY-MM-DD')
                }
              })
            })
            .catch(() => message.error(t("errors.invalid-form")))
        } }
        cancelButtonProps={ { disabled: generateLoading } }
        onCancel={ () => setStatementModalOpen(false) }>
        <Spin size="large" spinning={ generateLoading }>
          <Form
            form={ form }
            layout="inline">
            <Form.Item
              label={ t("from") }
              name="from"
              rules={ [
                {
                  message: t("forms.choose-date"),
                  required: true
                }
              ] }>
              <DatePicker />
            </Form.Item>
            <Form.Item
              label={ t("to") }
              name="to"
              rules={ [
                {
                  message: t("forms.choose-date"),
                  required: true
                }
              ] }>
              <DatePicker />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}