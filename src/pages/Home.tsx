import React, { FC } from 'react';
import NavBar from '../components/NavBar';
import { Container } from '@material-ui/core';

const Home: FC = () => {
  return (
    <div>
      <NavBar />
      <Container>
        <p>lorem ipsum dolor sit amet, consectetur adip</p>
        <p>lorem ipsum dolor sit amet, consectetur adip</p>
        {[...new Array(100)].map(() => (
          <p>lorem ipsum dolor sit amet, consectetur adip</p>
        ))}
      </Container>
    </div>
  );
};

export default Home;
