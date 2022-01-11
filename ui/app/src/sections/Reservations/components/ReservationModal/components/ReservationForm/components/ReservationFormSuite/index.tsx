import { ApartmentOutlined, MinusCircleOutlined } from "@ant-design/icons"
import { useReactiveVar } from "@apollo/client"
import { Button, Form, FormInstance, Select, Space, Tooltip } from "antd"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { suiteOptions } from "../../../../../../../../cache"
import { FormHelper } from "../../../../../../../../lib/components/FormHelper"
import { ReservationTypeKey } from "../../../../../../../../lib/Types"

interface Props {
  form: FormInstance
  selectedType: ReservationTypeKey
}

export const ReservationFormSuite = ({
  form,
  selectedType
}: Props) => {

  const { t } = useTranslation()
  const options = useReactiveVar(suiteOptions)

  const [ addExtraSuiteTooltip, setAddExtraSuiteTooltip ] = useState<string>(t("tooltips.suite-extend-reservation"))

  const suiteValidator = [
    {
      message: t("forms.suite-selected"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        const duplicates: Array<{ id: number }> = form.getFieldValue("suites").filter((id: { id: number } | undefined) => {
          return id !== undefined && id.id === value
        })
        if (duplicates === undefined || duplicates.length <= 1) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail suites validation, duplicate value"))
      }
    },
    {
      message: t("forms.suite-selected"),
      validator: (_rule: any, value: number): Promise<void | Error> => {
        if (form.getFieldValue("suite") !== value) {
          return Promise.resolve()
        }
        return Promise.reject(new Error("Fail suites validation, equals to main suite"))
      }
    }
  ]

  const updateAddExtraSuiteTooltip = (fieldsLength: number) => {
    if (options.length <= fieldsLength) {
      setAddExtraSuiteTooltip(t("tooltips.suite-extend-reservation-full"))
    } else {
      setAddExtraSuiteTooltip(t("tooltips.suite-extend-reservation"))
    }
  }

  useEffect(() => {
    if (selectedType !== "INQUIRY") {
      setAddExtraSuiteTooltip(t("tooltips.suite-not-extendable"))
    }
  }, [ selectedType, t ])

  return (
    <>
      <Form.Item
        hasFeedback
        label={ t("rooms.single") }
        name="suite"
        required
        rules={ [ FormHelper.requiredRule(t("reservations.choose-suite")) ] }>
        <Select
          id="select-suite"
          options={ suiteOptions() } />
      </Form.Item>
      <Form.Item
        wrapperCol={ {
          lg: { offset: 8, span: 16 },
          md: { offset: 8, span: 16 },
          sm: { offset: 8, span: 16 }
        } }>
        <Form.List name="suites">
          { (fields, { add, remove }) => (
            <>
              { fields.map((field) => (
                <Space
                  align="baseline"
                  className="fill-width"
                  key={ field.key }>
                  <Form.Item
                    hasFeedback
                    { ...field }
                    fieldKey={ [ field.key, 'first' ] }
                    name={ [ field.name, "id" ] }
                    rules={ suiteValidator }>
                    <Select
                      className="select-suite"
                      filterOption={ FormHelper.searchFilter }
                      options={ options }
                      showSearch />
                  </Form.Item>
                  <MinusCircleOutlined onClick={ () => {
                    remove(field.name)
                    updateAddExtraSuiteTooltip(fields.length - 1) // fields length seems not updated immediately
                  } } />
                </Space>
              )) }
              <Tooltip title={ addExtraSuiteTooltip }>
                <Button
                  disabled={
                    selectedType !== "INQUIRY"
                    || (fields.length >= options.length)
                  }
                  id="add-suite"
                  type="dashed"
                  onClick={ () => {
                    add()
                    updateAddExtraSuiteTooltip(fields.length + 1) // fields length seems not updated immediately
                  } }
                  block
                  icon={ <ApartmentOutlined /> }>
                  { t("reservations.add-suite") }
                </Button>
              </Tooltip>
            </>
          ) }
        </Form.List>
      </Form.Item>
    </>
  )
}