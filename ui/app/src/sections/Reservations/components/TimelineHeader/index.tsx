import { CaretLeftOutlined, CaretRightOutlined, CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import { useReactiveVar } from "@apollo/client"
import { Affix, Button, Col, Input, Modal, Row, Tooltip } from "antd"
import moment from "moment"
import { useTranslation } from "react-i18next"
import { canvasTimeEnd, canvasTimeStart } from "../../../../cache"
import "./styles.css"

interface Props {
  onAdd: () => void
  onCopy: () => void
  onDelete: () => void
  onUpdate: () => void
  searchReservation: (value: string) => void
  selectedItemId: string | undefined
  updateReservations: (from: number, to: number) => void
}

export const TimelineHeader = ({
  searchReservation,
  onAdd,
  onCopy,
  onDelete,
  onUpdate,
  selectedItemId,
  updateReservations
}: Props) => {

  const { t } = useTranslation()

  const visibleTimeEnd = useReactiveVar(canvasTimeEnd)
  const visibleTimeStart = useReactiveVar(canvasTimeStart)

  const deleteReservation = () => {
    Modal.confirm({
      title: t("tooltips.delete-reservation-confirm-title"),
      cancelText: t("no"),
      okText: t("yes"),
      onOk: () => onDelete()
    })
  }

  const moveForward = () => {
    const range: number = visibleTimeEnd - visibleTimeStart
    const from = moment(visibleTimeStart + range).valueOf()
    const to = moment(visibleTimeEnd + range).valueOf()
    canvasTimeEnd(to)
    canvasTimeStart(from)
    updateReservations(from, to)
  }

  const moveBackwards = () => {
    const range: number = visibleTimeEnd - visibleTimeStart
    const from = moment(visibleTimeStart - range).valueOf()
    const to = moment(visibleTimeEnd - range).valueOf()
    canvasTimeEnd(to)
    canvasTimeStart(from)
    updateReservations(from, to)
  }

  const ButtonCopy = selectedItemId !== undefined ? (
    <Button
      icon={ <CopyOutlined /> }
      onClick={ () => onCopy() }
      size="middle" />
  ) : null
  const ButtonDelete = selectedItemId !== undefined ? (
    <Button
      icon={ <DeleteOutlined /> }
      onClick={ () => deleteReservation() }
      size="middle" />
  ) : null
  const ButtonEdit = selectedItemId !== undefined ? (
    <Button
      className="last"
      icon={ <EditOutlined /> }
      onClick={ () => onUpdate() }
      size="middle" />
  ) : null

  return (
    <Affix offsetTop={ 58 }>
      <Row className="timeline-header">
        <Col lg={ 10 } md={ 12 } sm={ 12 } className="flex-container">
          <Input.Search
            allowClear
            enterButton
            id="search-guest"
            onSearch={ searchReservation }
            placeholder={ t("placeholders.search-reservation") } />
        </Col>
        <Col lg={ 10 } md={ 8 } sm={ 7 } className="flex-container centered">
          <Button
            icon={ <PlusOutlined /> }
            onClick={ () => onAdd() }
            size="middle" />
          { ButtonCopy }
          { ButtonDelete }
          { ButtonEdit }
        </Col>
        <Col lg={ 4 } md={ 4 } sm={ 5 } className="flex-container end">
          <Tooltip title={ t("tooltips.move-previous-reservation") }>
            <Button
              icon={ <CaretLeftOutlined /> }
              onClick={ moveBackwards }
              shape="circle"
              size="large" />
          </Tooltip>
          <Tooltip title={ t("tooltips.move-next-reservation") }>
            <Button
              className="last"
              icon={ <CaretRightOutlined /> }
              onClick={ moveForward }
              shape="circle"
              size="large" />
          </Tooltip>
        </Col>
      </Row>
    </Affix>
  )
}