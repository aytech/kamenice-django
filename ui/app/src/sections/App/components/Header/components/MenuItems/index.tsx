import { BookOutlined, FilePdfOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { Avatar, Menu } from "antd"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Link, RouteComponentProps, withRouter } from "react-router-dom"
import { appSettings, selectedPage, userColor, userName } from "../../../../../../cache"
import { UrlHelper } from "../../../../../../lib/components/UrlHelper"
import { paths, refreshTokenName, tokenName, uris } from "../../../../../../lib/Constants"
import { TOKEN_REVOKE } from "../../../../../../lib/graphql/mutations/Token"
import { RevokeToken, RevokeTokenVariables } from "../../../../../../lib/graphql/mutations/Token/__generated__/RevokeToken"
import "./styles.css"

export const MenuItems = withRouter(({
  history
}: RouteComponentProps) => {

  const { t } = useTranslation()

  const [ revokeToken ] = useMutation<RevokeToken, RevokeTokenVariables>(TOKEN_REVOKE)

  const redirectToLogin = useCallback(() => {
    history.push(`/login?next=${ UrlHelper.getReferrer() }`)
  }, [ history ])

  const logout = (): void => {
    appSettings(null)
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

  const userAvatar = () => {
    return appSettings() !== undefined ? (
      <Avatar
        size={ 32 }
        style={ { backgroundColor: userColor() } }>
        { userName()?.substring(0, 1).toUpperCase() }
      </Avatar>
    ) : null
  }

  return appSettings() !== null ? (
    <>
      <Menu
        mode="horizontal"
        className="navigation-items"
        selectedKeys={ [ selectedPage() ] }>
        <Menu.Item key="reservation" icon={ <BookOutlined /> }>
          <Link to={ uris.reservations }>{ t("reservations.name") }</Link>
        </Menu.Item>
        <Menu.Item key="guests" icon={ <IdcardOutlined /> }>
          <Link to={ paths.guests }>{ t("guests.name-pl") }</Link>
        </Menu.Item>
        <Menu.Item key="suites" icon={ <HomeOutlined /> }>
          <Link to={ paths.suites }>{ t("rooms.nav-title") }</Link>
        </Menu.Item>
      </Menu >
      <Menu
        className="user"
        mode="horizontal"
        selectedKeys={ [ selectedPage() ] }>
        <Menu.SubMenu
          key="user"
          title={ userAvatar() }>
          <Menu.Item
            key="settings"
            icon={ <SettingOutlined /> }>
            <Link to={ uris.settings }>{ t("pages.settings") }</Link>
          </Menu.Item>
          <Menu.Item
            key="reports"
            icon={ <FilePdfOutlined /> }>
            <Link to={ uris.statements }>{ t("pages.statements") }</Link>
          </Menu.Item>
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