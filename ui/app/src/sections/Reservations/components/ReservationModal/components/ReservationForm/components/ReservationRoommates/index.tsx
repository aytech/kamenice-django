import { MinusCircleOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { useReactiveVar } from "@apollo/client"
import { Button, DatePicker, Form, FormInstance, Select, Space, Tooltip } from "antd"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Moment } from "moment"
import { roommateOptions } from "../../../../../../../../cache"
import { FormHelper } from "../../../../../../../../lib/components/FormHelper"
import { Validators } from "../../../../../../../../lib/components/Validators"

interface Props {
  form: FormInstance
  suiteCapacity: number
}

export const ReservationRoommates = ({
  form,
  suiteCapacity
}: Props) => {

  const { t } = useTranslation()
  const options = useReactiveVar(roommateOptions)

  const [ addTooltip, setAddTooltip ] = useState<string>(t("tooltips.add-roommate"))

  const updateAddTooltip = useCallback((roommatesLength: number) => {
    if (suiteCapacity <= roommatesLength) {
      setAddTooltip(t("tooltips.room-capacity-full"))
    } else {
      setAddTooltip(t("tooltips.add-roommate"))
    }
  }, [ suiteCapacity, t ])

  useEffect(() => {
    const roommates = form.getFieldValue("roommates")
    if (roommates !== undefined) {
      updateAddTooltip(roommates.length)
    }
  }, [ form, suiteCapacity, updateAddTooltip ])

  return (
    <Form.Item
      wrapperCol={ {
        lg: { offset: 8, span: 16 },
        md: { offset: 8, span: 16 },
        sm: { offset: 8, span: 16 }
      } }>
      <Form.List name="roommates">
        { (fields, { add, remove }) => (
          <>
            { fields.map((field) => (
              <Space
                align="baseline"
                className="roommate-list"
                key={ field.key }>
                <Form.Item
                  hasFeedback
                  name={ [ field.name, "id" ] }
                  rules={ Validators.getRoommateValidators(
                    [ t("forms.guest-selected"), ("forms.guest-duplicate") ],
                    form.getFieldValue("roommates"),
                    form.getFieldValue("guest")
                  ) }>
                  <Select
                    className="select-roommate"
                    filterOption={ FormHelper.searchFilter }
                    options={ options }
                    showSearch />
                </Form.Item>
                <Form.Item
                  name={ [ field.name, "fromDate" ] }>
                  <DatePicker
                    disabledDate={ (currentDate: Moment) => {
                      const dates = form.getFieldValue("dates")
                      // Disable all days if reservation dates not set
                      if (dates === undefined || dates.length < 2) {
                        return true
                      }
                      // Cannot be before the reservation start date
                      if (currentDate.valueOf() < dates[ 0 ].valueOf()
                        || currentDate.valueOf() > dates[ 1 ].valueOf()) {
                        return true
                      }
                      return false
                    } }
                    placeholder={ t("from") } />
                </Form.Item>
                <MinusCircleOutlined onClick={ () => {
                  remove(field.name)
                  updateAddTooltip(fields.length - 1) // fields length seems not updated immediately
                  form.validateFields()
                } } />
              </Space>
            )) }
            <Tooltip title={ addTooltip }>
              <Button
                disabled={
                  fields.length >= options.length
                  || fields.length >= suiteCapacity
                }
                id="add-roommate"
                type="dashed"
                onClick={ () => {
                  add()
                  updateAddTooltip(fields.length + 1) // fields length seems not updated immediately
                } }
                block
                icon={ <UsergroupAddOutlined /> }>
                { t("reservations.add-roommate") }
              </Button>
            </Tooltip>
          </>
        ) }
      </Form.List>
    </Form.Item>
  )
}