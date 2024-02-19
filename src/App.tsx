import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import "./App.css";
import AccountUserList from "./components/AccountUserList";

function App() {
  return (
    <Provider store={store}>
     <div className="App">
        <header className="App-header">
          <h1>Bank Accounts Users</h1>
        </header>
        <main className="main">
          <AccountUserList />
        </main>
      </div>
    </Provider>
  );
}

export default App;
