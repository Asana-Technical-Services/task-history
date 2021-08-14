import asana from "asana";
import OAuth2AuthCodePkceClient from "oauth2-pkce";
import { useEffect, useState } from "react";
import axios from "axios";

const oauthClient = new OAuth2AuthCodePkceClient({
  scopes: [],
  authorizationUrl: "https://app.asana.com/-/oauth_authorize",
  tokenUrl: "https://app.asana.com/-/oauth_token",
  clientId: "1200754514360823",
  redirectUrl: "http://localhost:3000",
  storeRefreshToken: false,
  // optional:
  onAccessTokenExpiry() {
    // when the access token has expired
    return oauthClient.exchangeRefreshTokenForAccessToken();
  },
  onInvalidGrant() {
    // when there is an error getting a token with a grant
    console.warn(
      "Invalid grant! Auth code or refresh token need to be renewed."
    );
    // you probably want to redirect the user to the login page here
  },
  onInvalidToken() {
    // the token is invalid, e. g. because it has been removed in the backend
    console.warn(
      "Invalid token! Refresh and access tokens need to be renewed."
    );
    // you probably want to redirect the user to the login page here
  },
});

export function Login() {
  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const url = window.location.href;
    if (token === "") {
      oauthClient.receiveCode();
      oauthClient.getAccessToken().then((newToken: string) => {
        setToken(newToken);
        console.log("token:", newToken);
      });
      // .then((res: any) => {
      //   setUserName(res.data?.name || "");
      // });
    }
  }, []);

  const redirect = () => {
    oauthClient.requestAuthorizationCode();
  };

  return (
    <div>
      <p>{userName}</p>
      <button onClick={redirect}>Connect with Asana</button>
    </div>
  );
}
