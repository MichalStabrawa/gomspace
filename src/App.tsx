import React from "react";

import "./App.css";
import AccountUserList from "./components/AccountUserList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Bank Accounts Users</h1>
      </header>
      <main className="main">
        <AccountUserList/>
      </main>
    </div>
  );
}

export default App;
