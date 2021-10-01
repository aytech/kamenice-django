import { useQuery } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import { APP } from "../../../../lib/graphql/queries/App"

export const PageTitle = () => {

  const { data } = useQuery(APP)

  return data.pageTitle === null ? null : (
    <Title
      level={ 3 }
      style={ {
        borderBottom: "1px solid #e1e1e1",
        paddingBottom: ".3em"
      } }>
      { data.pageTitle }
    </Title>
  )
}