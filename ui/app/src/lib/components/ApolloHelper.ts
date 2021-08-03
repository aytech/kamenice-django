import { ApolloError } from "@apollo/client";
import { message } from "antd";
import { apolloErrorUnauthorized } from "../Constants";

interface Props {
  onQueryError: (reason: ApolloError, text?: string) => void
  onRefetchError: (reason: ApolloError, callback: () => void) => void
}

export const ApolloHelper: Props = {
  onQueryError: (reason, text) => {
    console.error(reason.message);
    if (text === undefined) {
      text = "Chyba serveru, kontaktujte správce"
    }
    message.error(text)
  },
  onRefetchError: (reason: ApolloError, callback: () => void) => {
    if (reason.message === apolloErrorUnauthorized) {
      callback()
    }
  }
}