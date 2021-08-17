import axios from 'axios';

const instance = axios.create({
  baseURL: `https://api.rideshareapp.xyz`,
});

export default instance;
