import { BookOutlined, FilePdfOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons"
import { useMutation, useReactiveVar } from "@apollo/client"
import { Avatar, Menu } from "antd"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { appSettings, selectedPage, userColor, userName } from "../../../../../../cache"
import { UrlHelper } from "../../../../../../lib/components/UrlHelper"
import { paths, refreshTokenName, tokenName, uris } from "../../../../../../lib/Constants"
import { TOKEN_REVOKE } from "../../../../../../lib/graphql/mutations/Token"
import { RevokeToken, RevokeTokenVariables } from "../../../../../../lib/graphql/mutations/Token/__generated__/RevokeToken"
import "./styles.css"

export const MenuItems = () => {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const activePage = useReactiveVar(selectedPage)
  const color = useReactiveVar(userColor)
  const name = useReactiveVar(userName)
  const settings = useReactiveVar(appSettings)

  const [ revokeToken ] = useMutation<RevokeToken, RevokeTokenVariables>(TOKEN_REVOKE)

  const logout = (): void => {
    appSettings(null)
    const refreshToken = localStorage.getItem(refreshTokenName)
    if (refreshToken !== null) {
      revokeToken({ variables: { refreshToken } })
        .then(() => {
          localStorage.removeItem(tokenName)
          localStorage.removeItem(refreshTokenName)
        })
        .finally(() => navigate(`/login?next=${ UrlHelper.getReferrer() }`))
    } else {
      navigate(`/login?next=${ UrlHelper.getReferrer() }`)
    }
  }

  const userAvatar = () => {
    return settings !== undefined ? (
      <Avatar
        size={ 32 }
        style={ { backgroundColor: color } }>
        { name?.substring(0, 1).toUpperCase() }
      </Avatar>
    ) : null
  }

  return settings !== null ? (
    <>
      <Menu
        className="navigation-items"
        items={ [
          {
            key: "reservation",
            icon: <BookOutlined />,
            label: (
              <Link to={ uris.reservations }>
                { t("reservations.name") }
              </Link>
            )
          },
          {
            key: "guests",
            icon: <IdcardOutlined />,
            label: (
              <Link to={ paths.guests }>
                { t("guests.name-pl") }
              </Link>
            )
          },
          {
            key: "suites",
            icon: <HomeOutlined />,
            label: (
              <Link to={ paths.suites }>
                { t("rooms.nav-title") }
              </Link>
            )
          }
        ] }
        mode="horizontal"
        selectedKeys={ [ activePage ] } />
      <Menu
        className="user"
        items={ [
          {
            children: [
              {
                key: "settings",
                icon: <SettingOutlined />,
                label: (
                  <Link to={ uris.settings }>
                    { t("pages.settings") }
                  </Link>
                )
              },
              {
                key: "reports",
                icon: <FilePdfOutlined />,
                label: (
                  <Link to={ uris.statements }>
                    { t("pages.statements") }
                  </Link>
                )
              },
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: t("logout"),
                onClick: logout
              }
            ],
            key: "user",
            label: userAvatar()
          }
        ] }
        mode="horizontal"
        selectedKeys={ [ activePage ] } />
    </>
  ) : null
}