import { useReactiveVar } from "@apollo/client"
import Title from "antd/lib/typography/Title"
import { pageTitle } from "../../../../cache"

export const PageTitle = () => {
  const title = useReactiveVar(pageTitle)
  return title !== null ? (
    <Title
      level={ 3 }
      style={ {
        borderBottom: "1px solid #e1e1e1",
        paddingBottom: ".3em"
      } }>
      { title }
    </Title>
  ) : null
}