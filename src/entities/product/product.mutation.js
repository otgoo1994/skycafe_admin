import { useMutation } from '@tanstack/react-query';
import { axiosFormInstance } from '../../api';
import { URL } from './product.constants';

export const useAddSet = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.post(`${URL.adminSetProduct}`, formData);
    }
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.post(`${URL.adminProduct}`, formData);
    }
  });
};

export const useAddCategory = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.post(`${URL.adminCategory}`, formData);
    }
  });
};

export const useAddBanner = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.post(`${URL.adminBanner}`, formData);
    }
  });
};

export const useAddBranch = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.post(`${URL.adminBranch}`, formData);
    }
  });
};
