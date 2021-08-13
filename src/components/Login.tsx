export function Login() {
  const redirect = () => {
    let redirectUrl = process.env.ASANA_AUTH_URL
    le
    if (redirectUrl){
      window.location.href = redirectUrl;
    }
  };
  return (
    <div>
      <button onClick={redirect}>Connect with Asana</button>
    </div>
  );
}
