import { Empty } from "antd"
import { Content } from "antd/lib/layout/layout"
import Title from "antd/lib/typography/Title"

export const Guests = () => {
  return (
    <Content className="app-content">
      <Title level={ 3 } className="home__listings-title">
        Hosté
      </Title>
      <Empty />
    </Content>
  )
}