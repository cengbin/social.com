import axios from 'axios';

export const instance = axios.create({
  baseURL: '',
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

export async function request(options: any) {
  const {
    debug = false,
    loading = false,
    successNotice = false,
    errorNotice = false,
    formatResponseTime = false,
    getResponse = false,
    ...config
  } = options;

  try {
    const response = await instance(config);

    if (response.status === 200) {
      const result = response.data;

      return getResponse ? response : result;
    }
    return Promise.reject(response);
  } catch (error: any) {
    console.log('Request canceled:', error?.message);
    throw error;
  } finally {
  }
}
