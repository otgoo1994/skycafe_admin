import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../../api';
import { URL } from './auth.constants';

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: async (data) => {
      return axiosInstance.post(`${URL.login}`, data);
    }
  });
};
