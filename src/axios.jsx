import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ride-share-app-be.herokuapp.com',
});

export default instance;
