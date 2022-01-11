import { MinusCircleOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { useReactiveVar } from "@apollo/client"
import { Button, Form, FormInstance, Select, Space, Tooltip } from "antd"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { roommateOptions } from "../../../../../../../../cache"
import { FormHelper } from "../../../../../../../../lib/components/FormHelper"

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

  const roommateValidator = [
    {
      message: t("forms.guest-selected"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        const duplicates: Array<{ id: number }> = form.getFieldValue("roommates").filter((id: { id: number } | undefined) => {
          return id !== undefined && id.id === value
        })
        if (duplicates === undefined || duplicates.length <= 1) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail roommate validation, duplicate value"))
      }
    },
    {
      message: t("forms.guest-duplicate"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        if (form.getFieldValue("guest") !== value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail roommate validation, equals to guest"))
      }
    }
  ]

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
                  { ...field }
                  fieldKey={ [ field.key, 'first' ] }
                  name={ [ field.name, "id" ] }
                  rules={ roommateValidator }>
                  <Select
                    className="select-roommate"
                    filterOption={ FormHelper.searchFilter }
                    options={ options }
                    showSearch />
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