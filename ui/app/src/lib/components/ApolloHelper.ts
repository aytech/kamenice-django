import { ApolloError } from "@apollo/client";
import { message } from "antd";

interface Props {
  onQueryError: (reason: ApolloError, text?: string) => void
}

export const ApolloHelper: Props = {
  onQueryError: (reason, text) => {
    console.error(reason.message);
    if (text === undefined) {
      text = "Chyba serveru, kontaktujte správce"
    }
    message.error(text)
  }
}