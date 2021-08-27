import { useState } from "react"
import { Button, Drawer, Form, Input, message, Popconfirm, Select, Skeleton } from "antd"
import { CloseOutlined, MailOutlined, WarningOutlined } from "@ant-design/icons"
import Title from "antd/lib/typography/Title"
import { Store } from "rc-field-form/lib/interface"
import { GuestForm } from "../../lib/Types"
import { GuestFormHelper } from "../../lib/components/GuestFormHelper"
import { FormHelper } from "../../lib/components/FormHelper"
import "./styles.css"
import { ApolloError, FetchResult, useMutation } from "@apollo/client"
import { CREATE_GUEST, DELETE_GUEST, UPDATE_GUEST } from "../../lib/graphql/mutations/Guest"
import { CreateGuest, CreateGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/CreateGuest"
import { GuestsFull_guests } from "../../lib/graphql/queries/Guests/__generated__/GuestsFull"
import { Guests_guests } from "../../lib/graphql/queries/Guests/__generated__/Guests"
import { UpdateGuest, UpdateGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/UpdateGuest"
import { useEffect } from "react"
import { DeleteGuest, DeleteGuestVariables } from "../../lib/graphql/mutations/Guest/__generated__/DeleteGuest"

interface Props {
  addGuest: (guest: Guests_guests) => void
  close: () => void
  guest?: GuestsFull_guests | null
  removeGuest?: (guestId: string) => void
  visible: boolean
}

export const GuestDrawer = ({
  addGuest,
  close,
  guest,
  removeGuest,
  visible
}: Props) => {

  const [ form ] = Form.useForm()

  const networkErrorHandler = (reason: ApolloError) => message.error(reason.message)

  const [ createGuest, { loading: createLoading } ] = useMutation<CreateGuest, CreateGuestVariables>(CREATE_GUEST, {
    onError: networkErrorHandler
  })
  const [ updateGuest, { loading: updateLoading } ] = useMutation<UpdateGuest, UpdateGuestVariables>(UPDATE_GUEST, {
    onError: networkErrorHandler
  })
  const [ deleteGuest, { loading: deleteLoading } ] = useMutation<DeleteGuest, DeleteGuestVariables>(DELETE_GUEST, {
    onError: networkErrorHandler
  })


  const [ confirmClose, setConfirmClose ] = useState<boolean>(false)
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
  const emailPrefixIcon = (
    <Form.Item name="email-prefix" noStyle>
      <MailOutlined />
    </Form.Item>
  )

  const submitForm = (): void => {
    form.validateFields()
      .then(() => {
        const formData: GuestForm = form.getFieldsValue(true)
        const variables = {
          age: formData.age,
          addressMunicipality: formData.address?.municipality,
          addressPsc: formData.address?.psc,
          addressStreet: formData.address?.street,
          citizenship: formData.citizenship?.selected === undefined ? formData.citizenship?.new : formData.citizenship.selected,
          email: formData.email,
          gender: formData.gender,
          identity: formData.identity,
          name: formData.name,
          phoneNumber: formData.phone,
          surname: formData.surname,
          visaNumber: formData.visa
        }
        if (guest === undefined || guest === null) {
          createGuest({ variables: { data: { ...variables } } })
            .then((value: FetchResult<CreateGuest>) => {
              const guest = value.data?.createGuest?.guest
              if (guest !== undefined && guest !== null) {
                addGuest(guest)
                message.success(`Host ${ guest.name } ${ guest.surname } přidán!`)
              }
              close()
            })
        } else {
          updateGuest({ variables: { data: { id: String(guest.id), ...variables } } })
            .then((value: FetchResult<UpdateGuest>) => {
              const guest = value.data?.updateGuest?.guest
              if (guest !== undefined && guest !== null) {
                addGuest(guest)
                message.success(`Host ${ guest.name } ${ guest.surname } aktualizován!`)
              }
              close()
            })
        }
      })
      .catch(() => message.error("Formulář nelze odeslat, opravte prosím chyby"))
  }

  useEffect(() => {
    if (visible === true) {
      form.resetFields()
    }
  }, [ form, visible ])

  return (
    <Drawer
      closeIcon={ (
        <Popconfirm
          onCancel={ () => setConfirmClose(false) }
          onConfirm={ () => {
            setConfirmClose(false)
            form.resetFields()
            close()
          } }
          placement="rightTop"
          title="Zavřít formulář? Data ve formuláři budou ztracena"
          visible={ confirmClose }>
          <CloseOutlined onClick={ () => {
            if (form.isFieldsTouched()) {
              setConfirmClose(true)
            } else {
              close()
            }
          } } />
        </Popconfirm>
      ) }
      placement="left"
      title="Nový host"
      width={ 500 }
      visible={ visible }
      footer={
        <>
          { guest !== undefined && guest !== null &&
            <Popconfirm
              cancelText="Ne"
              icon={ <WarningOutlined /> }
              okText="Ano"
              onConfirm={ () => {
                deleteGuest({ variables: { guestId: guest.id } })
                  .then((value: FetchResult<DeleteGuest>) => {
                    const guest = value.data?.deleteGuest?.guest
                    if (removeGuest !== undefined && guest !== undefined && guest !== null) {
                      removeGuest(guest.id)
                      message.success("Host byl smazán")
                      close()
                    }
                  })
              } }
              title="opravdu odstranit?">
              <Button
                danger
                style={ {
                  float: "left"
                } }
                type="primary">
                Odstranit
              </Button>
            </Popconfirm>
          }
          <Button
            onClick={ submitForm }
            type="primary">
            { (guest === undefined || guest === null) ? "Vytvořit" : "Upravit" }
          </Button>
        </>
      }
      footerStyle={ {
        padding: "16px 20px",
        textAlign: "right"
      } }>
      <Skeleton
        active
        loading={ createLoading || updateLoading || deleteLoading }
        paragraph={ { rows: 15 } }>
        <Form
          form={ form }
          initialValues={ initialValues }
          layout="vertical"
          name="guest">
          <Title level={ 5 }>Osobní údaje</Title>
          <Form.Item
            hasFeedback
            label="Jméno"
            name="name"
            required
            rules={ GuestFormHelper.requiredAlphaRules }>
            <Input placeholder="Vaše Jméno" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Příjmení"
            name="surname"
            required
            rules={ GuestFormHelper.requiredAlphaRules }>
            <Input placeholder="Vaše Příjmení" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="E-Mail"
            name="email"
            required
            rules={ [ FormHelper.requiredRule ] }>
            <Input
              addonBefore={ emailPrefixIcon }
              placeholder="e-mail"
              type="email" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Číslo OP"
            name="identity">
            <Input placeholder="číslo občanského průkazu" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Telefonní Číslo"
            name="phone">
            <Input placeholder="číslo" />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Věk"
            name="age">
            <Select
              options={ GuestFormHelper.ageOptions }
              placeholder="vyberte ze seznamu" />
          </Form.Item>
          <Form.Item
            label="Pohlaví"
            name="gender">
            <Select
              placeholder="vyberte ze seznamu">
              <Select.Option value="M">Muž</Select.Option>
              <Select.Option value="F">Žena</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Číslo viza"
            name="visa">
            <Input placeholder="číslo visa" />
          </Form.Item>
          <Title level={ 5 }>Trvalé bydliště</Title>
          <Form.Item
            label="Ulice"
            name={ [ "address", "street" ] }>
            <Input placeholder="ulice" />
          </Form.Item>
          <Form.Item
            label="PSČ/Obec">
            <Input.Group compact>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "psc" ] }>
                <Input placeholder="PSČ" />
              </Form.Item>
              <Form.Item
                style={ { marginBottom: 0, width: "50%" } }
                name={ [ "address", "municipality" ] }>
                <Input placeholder="Obec" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Občanství">
            <Input.Group compact>
              <Form.Item
                style={ { width: "50%" } }
                name={ [ "citizenship", "selected" ] }>
                <Select style={ { width: "100%" } } placeholder="ze seznamu">
                  <Select.Option value="cze">CZE</Select.Option>
                  <Select.Option value="sk">SK</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                style={ { width: "50%" } }
                name={ [ "citizenship", "new" ] }>
                <Input placeholder="ručně" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Form>
      </Skeleton>
    </Drawer>
  )
}