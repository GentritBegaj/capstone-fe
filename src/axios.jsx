import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://api.rideshareapp.xyz',
});

export default instance;
