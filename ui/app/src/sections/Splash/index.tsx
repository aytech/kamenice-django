import { Layout, Skeleton } from "antd"
import "./index.css"

export const Splash = () => {
  return (
    <Layout
      className="splash-layout">
      <Layout.Content>
        <Skeleton
          active
          avatar
          paragraph={ { rows: 3 } }
          className="splash-skeleton" />
        <Skeleton
          active
          avatar
          paragraph={ { rows: 3 } }
          className="splash-skeleton" />
        <Skeleton
          active
          avatar
          paragraph={ { rows: 3 } }
          className="splash-skeleton" />
      </Layout.Content>
    </Layout>
  )
}