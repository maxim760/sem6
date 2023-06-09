import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IUserOauthMessage } from "src/api/services/auth/response"
import { IForm } from "src/components/screens/signup/SignupFields"
import { useAuthStore } from "src/store/profile/authStore"
import { getBaseUrl } from "src/utils/config/config"
import { RouterPaths } from "src/utils/config/router"
import { tokenService } from "src/utils/config/tokens"

export const useSocialButtons = () => {
  const navigate = useNavigate()
  const [defaultForm, setDefaultForm] = useState<Partial<IForm>>({})
  const [openDialog, setOpenDialog] = useState(false)
  const setUser = useAuthStore(state => state.setUser)
  const onMessage = useCallback(async (e: MessageEvent<{user: IUserOauthMessage, type: string}>) => {
    if (e?.data?.type === "oauth2") {
      if (!e.data.user.finded) {
        setDefaultForm({ ...e.data.user.user } || {})
        setOpenDialog(true)
      } else {
        const access = e.data.user.accessToken
        tokenService.setAccessToken(access)
        setUser(e.data.user.user)
        navigate(RouterPaths.Profile)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    window.addEventListener("message", onMessage)
    return () => {
      window.removeEventListener("message", onMessage)
    }
  }, [onMessage])
  const onClickSocial = (path: string) => () => {
    try {
      window.open(`${getBaseUrl()}/auth/${path}`, path, 'height=600,width=450,menubar=no,toolbar=no,resizable=yes,scrollbars=yes')
    } catch (e) {
      console.log("error")
    }
  }
  return {
    onClickSocial,
    openDialog,
    setOpenDialog,
    defaultForm

  }
}