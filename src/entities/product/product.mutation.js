import { useMutation } from '@tanstack/react-query';
import { axiosFormInstance, axiosInstance } from '../../api';
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

export const useDeleteBranch = () => {
  return useMutation({
    mutationFn: async (seq) => {
      return axiosFormInstance.delete(`${URL.adminBranch}/${seq}`);
    }
  });
};

export const useDeleteBanner = () => {
  return useMutation({
    mutationFn: async (seq) => {
      return axiosInstance.delete(`${URL.adminBanner}/${seq}`);
    }
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: async (seq) => {
      return axiosInstance.delete(`${URL.adminCategory}/${seq}`);
    }
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (seq) => {
      return axiosInstance.delete(`${URL.adminProduct}/${seq}`);
    }
  });
};

export const useDeleteSetProduct = () => {
  return useMutation({
    mutationFn: async (seq) => {
      return axiosInstance.delete(`${URL.adminSetProduct}/${seq}`);
    }
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.put(`${URL.adminProduct}`, formData);
    }
  });
};

export const useUpdateSetProduct = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.put(`${URL.adminSetProduct}`, formData);
    }
  });
};

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosInstance.put(`${URL.adminCategory}`, formData);
    }
  });
};

export const useUpdateBanner = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.put(`${URL.adminBanner}`, formData);
    }
  });
};

export const useUpdateBranch = () => {
  return useMutation({
    mutationFn: async (formData) => {
      return axiosFormInstance.put(`${URL.adminBranch}`, formData);
    }
  });
};
