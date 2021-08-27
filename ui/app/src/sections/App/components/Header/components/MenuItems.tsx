import { BookOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined } from "@ant-design/icons"
import { useMutation } from "@apollo/client"
import { Avatar, Menu, Spin } from "antd"
import { useCallback } from "react"
import { Link, RouteComponentProps, withRouter } from "react-router-dom"
import { Colors } from "../../../../../lib/components/Colors"
import { UrlHelper } from "../../../../../lib/components/UrlHelper"
import { refreshTokenName, tokenName, usernameKey } from "../../../../../lib/Constants"
import { TOKEN_REVOKE } from "../../../../../lib/graphql/mutations/Token"
import { RevokeToken, RevokeTokenVariables } from "../../../../../lib/graphql/mutations/Token/__generated__/RevokeToken"
import { User } from "../../../../../lib/Types"

interface Props {
  user: User | null
}

export const MenuItems = withRouter(({
  history,
  user
}: RouteComponentProps & Props) => {

  const [ revokeToken, { loading: revokeLoading } ] = useMutation<RevokeToken, RevokeTokenVariables>(TOKEN_REVOKE)

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
      <Spin
        spinning={ revokeLoading }>
        <Menu mode="horizontal">
          <Menu.Item key="reservation" icon={ <BookOutlined /> }>
            <Link to="/">Rezervace</Link>
          </Menu.Item>
          <Menu.Item key="guests" icon={ <IdcardOutlined /> }>
            <Link to="/guests">Hosté</Link>
          </Menu.Item>
          <Menu.Item key="suites" icon={ <HomeOutlined /> }>
            <Link to="/apartma">Apartmá</Link>
          </Menu.Item>
        </Menu >
      </Spin>
      <Menu className="user" mode="horizontal">
        <Menu.SubMenu
          key="user-sub"
          title={ userAvatar }>
          <Menu.Item
            key="logout"
            icon={ <LogoutOutlined /> }
            onClick={ logout }>
            Odhlásit
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </>
  ) : null
})