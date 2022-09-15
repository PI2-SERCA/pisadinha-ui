import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const CONFIG: AxiosRequestConfig = {
  timeout: parseInt(process.env.REACT_APP_PISADINHA_TIMEOUT || '5000', 10),
  baseURL: `${process.env.REACT_APP_PISEIRO_API_URL}/`,
  headers: {
    Accept: 'application/json',
  },
};

export default class APIAdapter {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create(CONFIG);
  }

  async get(path: string, config?: AxiosRequestConfig) {
    const res = await this.instance.get(path, config);

    return res.data.results || res.data;
  }

  async post(
    path: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ) {
    const res = await this.instance.post(path, data, config);
    return res.data.results || res;
  }

  async patch(
    path: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ) {
    const res = await this.instance.patch(path, data, config);

    return res.data.results || res;
  }

  async delete(path: string, config?: AxiosRequestConfig) {
    const res = await this.instance.delete(path, config);

    return res.data.results || res;
  }
}
