import axios from "axios";
import getConfig from "next/config";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

const { publicRuntimeConfig } = getConfig();
let webAddress = publicRuntimeConfig.apiUrl;

export const fetchAll = async () => {
  const session: any = await getSession();
  let config = {
    headers: {
      Authorization: "Bearer " + session.user.accessToken,
    },
  };
  const { data } = await axios.get(`${webAddress}terminals`, config);
  return data.payload;
};
