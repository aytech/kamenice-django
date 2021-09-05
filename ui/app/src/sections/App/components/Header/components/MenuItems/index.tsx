import { BookOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { Avatar, Menu } from "antd"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Link, RouteComponentProps, withRouter } from "react-router-dom"
import { Colors } from "../../../../../../lib/components/Colors"
import { UrlHelper } from "../../../../../../lib/components/UrlHelper"
import { refreshTokenName, tokenName, usernameKey } from "../../../../../../lib/Constants"
import { TOKEN_REVOKE } from "../../../../../../lib/graphql/mutations/Token"
import { RevokeToken, RevokeTokenVariables } from "../../../../../../lib/graphql/mutations/Token/__generated__/RevokeToken"
import { MenuItemKey, User } from "../../../../../../lib/Types"
import "./styles.css"

interface Props {
  selectedPage: MenuItemKey
  user: User | null
}

export const MenuItems = withRouter(({
  history,
  selectedPage,
  user
}: RouteComponentProps & Props) => {

  const { t } = useTranslation()

  const [ revokeToken ] = useMutation<RevokeToken, RevokeTokenVariables>(TOKEN_REVOKE)

  const redirectToLogin = useCallback(() => {
    localStorage.removeItem(usernameKey)
    history.push(`/login?next=${ UrlHelper.getReferrer() }`)
  }, [ history ])

  const logout = (): void => {
    const refreshToken = localStorage.getItem(refreshTokenName)
    if (refreshToken !== null) {
      revokeToken({ variables: { refreshToken } })
        .then(() => {
          localStorage.removeItem(tokenName)
          localStorage.removeItem(refreshTokenName)
        })
        .finally(() => redirectToLogin())
    } else {
      redirectToLogin()
    }
  }

  const userAvatar = user !== null ? (
    <Avatar
      size={ 32 }
      style={ {
        backgroundColor: Colors.getRandomColor()
      } }>
      { user.username.substring(0, 1).toUpperCase() }
    </Avatar>
  ) : null

  return user !== null ? (
    <>
      <Menu
        mode="horizontal"
        className="navigation-items"
        selectedKeys={ [ selectedPage ] }>
        <Menu.Item key="reservation" icon={ <BookOutlined /> }>
          <Link to="/">{ t("reservations.name") }</Link>
        </Menu.Item>
        <Menu.Item key="guests" icon={ <IdcardOutlined /> }>
          <Link to="/guests">{ t("guests.name-pl") }</Link>
        </Menu.Item>
        <Menu.Item key="suites" icon={ <HomeOutlined /> }>
          <Link to="/apartma">{ t("living-units") }</Link>
        </Menu.Item>
      </Menu >
      <Menu
        className="user"
        mode="horizontal"
        selectedKeys={ [ selectedPage ] }>
        <Menu.SubMenu
          key="user"
          title={ userAvatar }>
          <Menu.Item
            key="logout"
            icon={ <LogoutOutlined /> }
            onClick={ logout }>
            { t("logout") }
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </>
  ) : null
})