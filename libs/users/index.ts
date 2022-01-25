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
  const { data } = await axios.get(`${webAddress}access/users`, config);
  return data.payload;
};

export const getAllRoles = async () => {
  const session: any = await getSession();
  let config = {
    headers: {
      Authorization: "Bearer " + session.user.accessToken,
    },
  };
  const { data } = await axios.get(`${webAddress}access/roles`, config);
  return data.payload;
};

export const fetchById = async (id: string) => {
  const session: any = await getSession();
  let config = {
    headers: {
      Authorization: "Bearer " + session.user.accessToken,
    },
  };
  const { data } = await axios.get(`${webAddress}access/users/${id}`, config);
  return data.payload;
};

export const updateById = async (id: string, data: any) => {
  const session: any = await getSession();
  let config = {
    headers: {
      Authorization: "Bearer " + session.user.accessToken,
    },
  };
  const { data: response } = await axios.put(
    `${webAddress}access/users/${id}`,
    data,
    config
  );
  return response.payload;
};

export const create = async (data: any) => {
  const session: any = await getSession();
  let config = {
    headers: {
      Authorization: "Bearer " + session!.user.accessToken,
    },
  };
  const { data: response } = await axios.post(
    `${webAddress}access/users`,
    data,
    config
  );
  return response.payload;
};
