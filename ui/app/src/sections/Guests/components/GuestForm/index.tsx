import { MailOutlined } from "@ant-design/icons"
import { Form, FormInstance, Input, Select } from "antd"
import { Store } from "antd/lib/form/interface"
import Title from "antd/lib/typography/Title"
import { useTranslation } from "react-i18next"
import { FormHelper } from "../../../../lib/components/FormHelper"
import { Guests_guests } from "../../../../lib/graphql/queries/Guests/__generated__/Guests"
import { Roommates_roommates } from "../../../../lib/graphql/queries/Roommates/__generated__/Roommates"

interface Props {
  emailRequired: boolean
  form: FormInstance
  guest?: Guests_guests | Roommates_roommates | null
}

export const GuestForm = ({
  emailRequired,
  form,
  guest
}: Props) => {

  const { t } = useTranslation()

  const initialValues: Store = {
    age: guest?.age,
    address: {
      municipality: guest?.addressMunicipality,
      psc: guest?.addressPsc,
      street: guest?.addressStreet
    },
    citizenship: {
      selected: guest?.citizenship
    },
    email: guest?.email,
    gender: guest?.gender,
    identity: guest?.identity,
    name: guest?.name,
    phone: guest?.phoneNumber,
    surname: guest?.surname,
    visa: guest?.visaNumber
  }

  const EmailFormItem = () => {
    const EmailInput = (
      <Input
        addonBefore={ <MailOutlined /> }
        placeholder={ t("email") }
        type="email" />
    )
    return emailRequired ? (
      <Form.Item
        hasFeedback
        label={ t("email") }
        name="email"
        required
        rules={ [ FormHelper.requiredRule(t("forms.field-required")) ] }>
        { EmailInput }
      </Form.Item>
    ) : (
      <Form.Item
        hasFeedback
        label={ t("email") }
        name="email">
        { EmailInput }
      </Form.Item>
    )
  }

  return (
    <Form
      form={ form }
      initialValues={ initialValues }
      layout="vertical"
      name="guest">
      <Title level={ 5 }>
        { t("forms.personal-data") }
      </Title>
      <Form.Item
        hasFeedback
        label={ t("name") }
        name="name"
        required
        rules={ [
          FormHelper.requiredRule(t("forms.field-required")),
          FormHelper.requiredAlphaRule(t("forms.enter-text"))
        ] }>
        <Input placeholder={ t('name') } />
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("surname") }
        name="surname"
        required
        rules={ [
          FormHelper.requiredRule(t("forms.field-required")),
          FormHelper.requiredAlphaRule(t("forms.enter-text"))
        ] }>
        <Input placeholder={ t("surname") } />
      </Form.Item>
      <EmailFormItem />
      <Form.Item
        hasFeedback
        label={ t("forms.id-number") }
        name="identity">
        <Input placeholder={ t("forms.id-number-full") } />
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("phone-number") }
        name="phone">
        <Input placeholder={ t("number") } />
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("age") }
        name="age">
        <Select
          options={ FormHelper.guestAgeOptions }
          placeholder={ t("forms.choose-from-list") } />
      </Form.Item>
      <Form.Item
        label={ t("sex") }
        name="gender">
        <Select
          placeholder={ t("forms.choose-from-list") }>
          <Select.Option value="M">{ t("man") }</Select.Option>
          <Select.Option value="F">{ t("woman") }</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        hasFeedback
        label={ t("forms.visa-number") }
        name="visa">
        <Input placeholder={ t("forms.visa-number") } />
      </Form.Item>
      <Title level={ 5 }>{ t("forms.address") }</Title>
      <Form.Item
        label={ t("forms.street") }
        name={ [ "address", "street" ] }>
        <Input placeholder={ t("forms.street") } />
      </Form.Item>
      <Form.Item
        label={ t("forms.psc-label") }>
        <Input.Group compact>
          <Form.Item
            style={ { marginBottom: 0, width: "50%" } }
            name={ [ "address", "psc" ] }>
            <Input placeholder={ t("forms.psc") } />
          </Form.Item>
          <Form.Item
            style={ { marginBottom: 0, width: "50%" } }
            name={ [ "address", "municipality" ] }>
            <Input placeholder={ t("forms.municipality") } />
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item
        label={ t("forms.citizenship") }>
        <Input.Group compact>
          <Form.Item
            style={ { width: "50%" } }
            name={ [ "citizenship", "selected" ] }>
            <Select style={ { width: "100%" } } placeholder={ t("forms.from-list") }>
              <Select.Option value="cze">CZE</Select.Option>
              <Select.Option value="sk">SK</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={ { width: "50%" } }
            name={ [ "citizenship", "new" ] }>
            <Input placeholder={ t("forms.by-hand") } />
          </Form.Item>
        </Input.Group>
      </Form.Item>
    </Form>
  )
}