import { useQuery } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import { pageTitle } from "../../../../cache"
import { APP } from "../../../../lib/graphql/queries/App"

export const PageTitle = () => {

  useQuery(APP)

  return pageTitle() !== null ? (
    <Title
      level={ 3 }
      style={ {
        borderBottom: "1px solid #e1e1e1",
        paddingBottom: ".3em"
      } }>
      { pageTitle() }
    </Title>
  ) : null
}