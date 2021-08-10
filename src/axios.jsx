import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://www.rideshareapp.xyz',
});

export default instance;
