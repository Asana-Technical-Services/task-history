import { useState } from "react";
import asana from "asana";

export function Login() {
  const [userName, setUserName] = useState("");

  const redirect = () => {
    /**
     * Fill in this client ID before using the app.
     */
    var CLIENT_ID = "1200754514360823";
    var REDIRECT_URI =
      "https://app.asana.com/-/oauth_authorize?response_type=code&client_id=1200754514360823&redirect_uri=https%3A%2F%2Ftask-history.glitch.me";

    // Create a client.
    var client = asana.Client.create({
      clientId: CLIENT_ID,
      // By default, the redirect URI is the current URL, so for this example
      // we don't actually have to pass it. We do anyway to show that you can.
      redirectUri: REDIRECT_URI,
    });

    // Configure the way we want to use Oauth. This auto-detects that we're
    // in a browser and so defaults to the redirect flow, which we want.
    client.useOauth();

    // Now call `authorize` to get authorization. If the Oauth token
    // is already in the URL, it will pull it out and proceed. Otherwise it
    // will redirect to Asana.
    client
      .authorize()
      .then(function () {
        // The client is authorized! Make a simple request.
        return client.users.me().then(function (me) {
          setUserName(me.name);
        });
      })
      .catch(function (err) {
        console.log("err ", err);
        setUserName("error");
      });
  };

  return (
    <div>
      <p>{userName}</p>
      <button onClick={redirect}>Connect with Asana</button>
    </div>
  );
}
