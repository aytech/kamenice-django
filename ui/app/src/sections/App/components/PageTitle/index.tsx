import Title from "antd/lib/typography/Title"

interface Props {
  title: string | null
}

export const PageTitle = ({
  title
}: Props) => {
  return title === null ? null : (
    <Title
      level={ 3 }
      style={ {
        borderBottom: "1px solid #e1e1e1",
        paddingBottom: ".3em"
      } }>
      { title }
    </Title>
  )
}