import NextAuth from "next-auth";
import SecretsManager from "aws-";
import Cryptr from "cryptr";

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
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth providers do not return email by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        return {
          id: profile.data.gid,
          name: profile.data?.name,
        };
      },
      clientId: process.env.NEXT_CLIENT_ID,
      clientSecret: process.env.NEXT_CLIENT_SECRET,
    },
  ],
  pages: {
    signIn: "/signin",
  },

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
        const cryptr = new Cryptr(process.env.NEXT_ENCRYPTION_KEY);
        token.accessToken = cryptr.encrypt(account.accessToken);
      }
      // Also encrypt firstname for fun
      console.log(account);
      if (account?.data?.name) {
        const cryptr = new Cryptr(process.env.NEXT_ENCRYPTION_KEY);
        token.name = cryptr.encrypt(account.data.name);
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
      // Add access_token to session
      const cryptr = new Cryptr(process.env.NEXT_ENCRYPTION_KEY);
      session.accessToken = cryptr.decrypt(token.accessToken);
      session.user.name = cryptr.decrypt(token.name);
      return session;
    },
  },
  useSecureCookies: true,
  session: { jwt: true },
});
// session: { jwt: true },
//   jwt: {
//     // A secret to use for key generation - you should set this explicitly
//     // Defaults to NextAuth.js secret if not explicitly specified.
//     // This is used to generate the actual signingKey and produces a warning
//     // message if not defined explicitly.
//     secret: "INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw",
//     // You can generate a signing key using `jose newkey -s 512 -t oct -a HS512`
//     // This gives you direct knowledge of the key used to sign the token so you can use it
//     // to authenticate indirectly (eg. to a database driver)
//     signingKey: {
//       kty: "oct",
//       kid: "Dl893BEV-iVE-x9EC52TDmlJUgGm9oZ99_ZL025Hc5Q",
//       alg: "HS512",
//       k: "K7QqRmJOKRK2qcCKV_pi9PSBv3XP0fpTu30TP8xn4w01xR3ZMZM38yL2DnTVPVw6e4yhdh0jtoah-i4c_pZagA",
//     },
//     // If you chose something other than the default algorithm for the signingKey (HS512)
//     // you also need to configure the algorithm
//     verificationOptions: {
//       algorithms: ["HS256"],
//     },
//     secureCookie: true,
//     // Set to true to use encryption. Defaults to false (signing only).
//     encryption: true,
//     encryptionKey: process.env.NEXT_ENCRYPTION_KEY,
//     // decryptionKey: encryptionKey,
//     decryptionOptions: {
//       algorithms: ["A256GCM"],
//     },
//   },
