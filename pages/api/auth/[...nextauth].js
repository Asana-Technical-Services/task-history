import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: "asana",
      name: "Asana",
      type: "oauth",
      version: "2.0",
      scope: [],
      params: { grant_type: "authorization_code" },
      accessTokenUrl: "https://app.asana.com/-/oauth_token",
      requestTokenUrl: "https://app.asana.com/-/oauth_authorize",
      authorizationUrl:
        "https://app.asana.com/-/oauth_authorize?response_type=code",
      profileUrl: "https://app.asana.com/api/1.0/users/me",
      async profile(profile, tokens) {
        console.log(tokens);
        console.log(profile);

        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth providers do not return email by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`

        return {
          id: profile.data.gid,
          name: profile.data.name,
          email: profile.data.email,
          image: profile.data.photo.image_128x128,
        };
      },
      async session(session, token) {
        // Add property to session, like an access_token from a provider.
        session.accessToken = token.accessToken;
        return session;
      },
      clientId: "1200754514360823",
      clientSecret: process.env.NEXT_SECRET,
    },
  ],
  callbacks: {
    /**
     * @param  {object}  token     Decrypted JSON Web Token
     * @param  {object}  user      User object      (only available on sign in)
     * @param  {object}  account   Provider account (only available on sign in)
     * @param  {object}  profile   Provider profile (only available on sign in)
     * @param  {boolean} isNewUser True if new user (only available on sign in)
     * @return {object}            JSON Web Token that will be saved
     */

    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },

    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */

    async session(session, token) {
      // Add property to session, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
