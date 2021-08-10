export function Login() {
    const redirect = ()=>{
        window.location.url = "redirecturl"
    }
  return (
    <div >
      <button onClick={redirect}>Connect with Asana</button>
    </div>
  );
}
