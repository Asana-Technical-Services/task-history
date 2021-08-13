import "./App.css";
import { Login } from "./components/Login";
import MainContainer from "./components/MainContainer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2> Task History Tool </h2>
      </header>
      <Login />
    </div>
  );
}

export default App;
