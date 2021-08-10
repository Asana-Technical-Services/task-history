import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MainContainer from "./components/MainContainer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2> Task History Tool </h2>
      </header>
      <body>
        <MainContainer />
      </body>
    </div>
  );
}

export default App;
