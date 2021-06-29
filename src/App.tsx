import React, { FC, useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import LoginAndRegister from "./pages/LoginAndRegister";
import axios from "./axios";

const App: FC = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get("/users/me", { withCredentials: true })
        .then((response) => console.log(response.data))
        .catch((err) => console.log(err));
    };
    fetchUser();
  }, []);

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/login">
            <LoginAndRegister />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
