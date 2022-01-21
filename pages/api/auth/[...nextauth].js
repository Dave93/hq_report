require("dotenv").config();
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import getConfig from "next/config";
import { DateTime } from "luxon";
import parse from "parse-duration";
const { publicRuntimeConfig } = getConfig();
let webAddress = publicRuntimeConfig.apiUrl;
const refreshAccessToken = async (token) => {
  const { data: user } = await axios.post(
    `${webAddress}auth/token/refresh`,
    {
      refreshToken: token.refreshToken,
    },
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
    }
  );
  console.log(user);
  console.log(parse(user.payload.accessTokenExpires));
  const { accessToken, refreshToken } = user.payload;
  return {
    ...token,
    accessToken,
    accessTokenExpires: Date.now() + parse(user.payload.accessTokenExpires),
    refreshToken,
  };
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "HQ Report",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Login",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };

        const res = await fetch(`${webAddress}auth/login`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            tenant: credentials.tenantKey,
            "Accept-Language": "en-US",
          },
        });

        const user = await res.json();
        if (!res.ok) {
          throw new Error(user.exception);
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    // signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const { accessToken, refreshToken } = user.payload.token;
        const userData = user.payload.user;
        const access = user.payload.access;
        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpires:
            Date.now() + parse(user.payload.accessTokenExpires),
          user: userData,
          access,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.exp) {
        return token;
      }
      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user = token.user;
      session.access = token.access;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;

      return session;
    },
  },
  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    brandColor: "", // Hex color code #33FF5D
    logo: "/logo.jpg", // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === "development",
});
