import { queryOptions } from '@tanstack/react-query';
import { axiosInstance } from '../../api';
import { URL } from './product.constants';

export const ProductQuery = {
  all: () => ['product'],
  getProductList: (seq) =>
    queryOptions({
      queryKey: [...ProductQuery.all(), 'getProductList'],
      queryFn: async () => {
        const response = await axiosInstance.get(`${URL.getProducts}${seq ? '/' + seq : ''}`);

        return response.data;
      },
      retry: 1,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false
    }),
  getSetProductList: (seq) =>
    queryOptions({
      queryKey: [...ProductQuery.all(), 'getSetProductList'],
      queryFn: async () => {
        const response = await axiosInstance.get(`${URL.getSetProducts}${seq ? '/' + seq : ''}`);

        return response.data;
      },
      retry: 1,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false
    }),

  getCategoryList: (seq) =>
    queryOptions({
      queryKey: [...ProductQuery.all(), 'getCategoryList'],
      queryFn: async () => {
        const response = await axiosInstance.get(`${URL.category}${seq ? '/' + seq : ''}`);

        return response.data;
      },
      retry: 1,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false
    }),

  getBannerList: (seq) =>
    queryOptions({
      queryKey: [...ProductQuery.all(), 'getBannerList'],
      queryFn: async () => {
        const response = await axiosInstance.get(`${URL.banners}${seq ? '/' + seq : ''}`);

        return response.data;
      },
      retry: 1,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false
    }),

  getBranchList: (seq) =>
    queryOptions({
      queryKey: [...ProductQuery.all(), 'getBranchList'],
      queryFn: async () => {
        const response = await axiosInstance.get(`${URL.branch}${seq ? '/' + seq : ''}`);
        return response.data;
      },
      retry: 1,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: false
    })
};
