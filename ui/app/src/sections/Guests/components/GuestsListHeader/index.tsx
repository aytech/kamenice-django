import { UsergroupAddOutlined } from "@ant-design/icons"
import { Button, Col, Row, Tooltip } from "antd"
import { useTranslation } from "react-i18next"

interface Props {
	action: () => void
	title: string
}

export const GuestsListHeader = ({
	action,
	title
}: Props) => {

	const { t } = useTranslation()

	return (
		<Row>
			<Col lg={ 23 } md={ 22 } sm={ 20 } xs={ 20 }>
				<h4>{ title }</h4>
			</Col>
			<Col lg={ 1 } md={ 2 } sm={ 4 } xs={ 4 }>
				<Tooltip title={ t("guests.add") }>
					<Button
						onClick={ action }>
						<UsergroupAddOutlined />
					</Button>
				</Tooltip>
			</Col>
		</Row>
	)
}