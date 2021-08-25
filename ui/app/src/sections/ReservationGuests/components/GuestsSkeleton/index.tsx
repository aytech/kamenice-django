import { List, Skeleton } from "antd"

export const GuestsSkeleton = () => {

  return (
    <List
      itemLayout="vertical"
      size="large"
      dataSource={ [ 0, 1, 2 ] }
      renderItem={ idx => (
        <List.Item
          key={ idx }>
          <Skeleton
            active
            avatar
            loading={ true } />
        </List.Item>
      ) } />
  )
}