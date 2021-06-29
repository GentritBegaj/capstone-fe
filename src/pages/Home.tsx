import React, { FC } from "react";
import { NavBar, Banner } from "../components";
import { Container } from "@material-ui/core";

const Home: FC = () => {
  return (
    <div>
      <NavBar />
      <Banner />
    </div>
  );
};

export default Home;
