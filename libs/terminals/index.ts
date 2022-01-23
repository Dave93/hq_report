import axios from "axios";
import getConfig from "next/config";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { Session } from "@types/session";

const { publicRuntimeConfig } = getConfig();
let webAddress = publicRuntimeConfig.apiUrl;

export const fetchAll = async () => {
  const session: Session = await getSession();
  let config = {
    headers: {
      Authorization: "Bearer " + session.user.accessToken,
    },
  };
  const { data } = await axios.get(`${webAddress}terminals`, config);
  return data.payload;
};
