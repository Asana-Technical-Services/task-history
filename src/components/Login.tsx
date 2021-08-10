export function Login() {
  const redirect = () => {
    window.location.href = "redirecturl";
  };
  return (
    <div>
      <button onClick={redirect}>Connect with Asana</button>
    </div>
  );
}
