import React from "react"
import { Button, Drawer } from "antd"

interface Props {
  setVisible: (visible: boolean) => void,
  visible: boolean
}

export const UserDrawer = ({
  setVisible,
  visible
}: Props) => {

  return (
    <Drawer
      onClose={ () => {
        setVisible(false)
      } }
      placement="left"
      title="Nový Uživatel"
      width={ 500 }
      visible={ visible }
      footer={
        <div style={ {
          textAlign: "right"
        } }>
          <Button
            onClick={ () => {
              console.log("Submit to data store")
            } }
            type="primary">
            Submit
          </Button>
        </div>
      } />
  )
}