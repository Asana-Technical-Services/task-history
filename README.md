# Next.js base for Asana

This is a template for creating a Next.js web app which uses Asana OAuth to authenticate users and make calls as them.

The code that's written is relatively sparse, only providing a splash page, sign-in page, and homepage for logged-in users. After that, you can modify the homepage and add more pages to run whatever code you'd like!

## Initial Setup

### OAuth2 and Asana

This app uses OAuth2 for authoriaztion, meaning that users authorize the app to view Asana as them to get task history data.

The overall OAuth flow goes something like this:

- User clicks "sign in" on our app
- User is redirected to Asana, where they authorize the app to use Asana as them.
- User gets redirected back to our app with a code that lets our app use Asana as them for a period of time

This is explained further in the Asana developer docs [here](https://developers.asana.com/docs/oauth). Go through the steps that those docs provide for registering an app.

Take note of the Client ID and Client Secret. We also need to provide a redirect URL. For local development and getting started, enter in `https://localhost:3000/api/auth/callback/asana`

### Environment Variables

To allow the code here to act as the app you just created, create a `.env.local` file in the root directory, and provide the following:

```
NEXT_AUTH_URL=base url for auth redirect, for development this should be [https://localhost:3000]
NEXT_CLIENT_SECRET=client secret from the app you created above
NEXT_CLIENT_ID=client id from the app you created above
NEXT_JWT_ENCRYPTION_KEY={"kty":"oct","kid":"","alg":"A256GCM","k":""} - generate this using `jose newkey -s 256 -t oct -a A256GCM`
```

The last variable is an encryption key for the data we store between sessions in order to keep users logged in. To do this, the app saves a cookie in the browser with the access token and a few other details in the form of a JSON Web Token (JWT). So that we don't leak information, this token is encrypted with a key that should be kept secret, and only entered in the env variables.

### Development Certificates (using https for development)

_Some_ browsers (looking at you, Chrome) don't allow the setting of secure cookies from non-secure (not https) domains, including localhost.

In order to do this, we need to do 3 things:

1. create Certificates and a Certificate Authority locally for localhost
2. store the certificates in this project '/certificates/\[certs\]'
3. update the certs are referenced in server.js

To create certificates we'll be using `mkcert`: https://github.com/FiloSottile/mkcert

Install mkcert following the instructions above. on mac using Homebrew:

```
brew install mkcert
```

Once installed, run:

```
mkcert -install
mkcert localhost
```

It will drop the certificate and certificate key in your current directory as something like `localhost-key.pem` and `localhost.pem`

Move these two files to a folder in the root directory of this project called `certificates`, or whatever other folder you like _but make sure you add this folder to your .gitignore_ and do not share these anywhere outside of your local development environment.

Finally, modify the lines in `server.js` to reference this location:

```
const httpsOptions = {
  key: fs.readFileSync("./certificates/localhost-key.pem"),
  cert: fs.readFileSync("./certificates/localhost.pem"),
};
```

If these keys ever leak, remove them and delete them using:

```
mkcert -uninstall
rm -r "$(mkcert -CAROOT)"
```

### Install and Run

run the command `npm install` to install dependencies

run the command `npm run dev` to run the app locally in development mode.

you can then interact with app in the browser at [https://localhost:3000](https://localhost:3000) to view it in the browser.\
The page will reload if you make edits.\
You will also see any errors in the console.

## Project Structure

This project is built using a few libraries for some of the core functionality. You may need to reference their documentation to understand some of the code here. Those libraries are:

- [Next.js](https://nextjs.org/docs) for overall page structure
- [React](https://reactjs.org/) for reactive javascript app pages
- [Next-Auth](https://next-auth.js.org/) for OAuth2
- [typescript](https://www.typescriptlang.org/) for typed javascript

It is also built to be deployed on [AWS Amplify](https://aws.amazon.com/amplify/). The complexities of that will be discussed in the Deploy section below, but there's a YAML file you'll notice which helps us configure some build options

### File structure

```
-+pages
 |- api / [...nextauth].js - Next-Auth endpoint handling redirects in the OAuth flow
 |- _app.tsx - This adds a wrapper to the standard Next App so we can access the Next-Auth objects from anywhere
 |-home.tsx - the base home page for signed-in users, where you can call asana from
 |-index.tsx - the main splash page for users not signed in, which provides info about the app
 |-signin.tsx - the sign in page to initiate the OAuth flow
-+ public - Folder containing public images and the index.html file that contains the main entrypoint for the app
-+ src - source code for the app compontents and logic
 |-+components/* - React app components
 |-+utils/* - logic for making API calls and other Asana functions
-+ styles/globals.css - global CSS for the app
-.gitignore
-.amplify.yml - configures the build settings for AWS so you can pull env variables into Next
-custom.d.ts - typescript settings
-next-env.d.ts - Next+typescript settings
-next-config.js - Next+react setting
-package.json - dependencies listing
-README.md
-tsconfig.json - more typescript settings 😊
```

## Adding new pages & extend

To add new pages and extend this base project, create any new page you'd like just like a normal app.

For pages where you want to make calls to Asana, follow the pattern that the `Home` page uses:

```
const Home = () => {

// ... some component function
};

// set auth=true so when we render it (via _app.tsx), we'll redirect users who aren't signed in.

Home.auth = true;

export default Home;

```

Then, you can use the `useSession()` hook as to get the access token and make calls to Asana. For more info, check the [Next-Auth](https://next-auth.js.org/getting-started/client#usesession) documentation.

## Deploying

To deploy this app on AWS Amplify, first:

1. Fork this repository, and make sure you follow the overview getting started above and have tested it locally.
2. Commit this to a new repository on Github. Do not commit your .env.local file
3. Log in to AWS Amplify console. Create a new app, and add a frontend from Github following the latter half of [this flow](https://docs.amplify.aws/guides/hosting/nextjs/q/platform/js/#deploy-and-host-a-hybrid-app-ssg-and-ssr). You shouldn't need the Amplify CLI.
4. Add the environment variables in just as you have them above in the .env.local. These are not, and should not, be used in any frontend code, and so are echoed to the next app when building the backend. That echo is done in the .amplify.yml file above, along with other build settings. The `NEXTAUTH_URL` environment variable should be the same as the Production branch URL under App Settings > General > App Details in the AWS console.
5. Add the same URL you added as the NEXTAUTH_URL + /api/auth/callback/asana to your App Redirect URLs in the Asana Developer app console.
