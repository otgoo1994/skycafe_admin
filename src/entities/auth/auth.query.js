import { queryOptions } from '@tanstack/react-query';
import { axiosInstance } from '../../api';
import { URL } from './auth.constants';

export const HomeQuery = {
  all: () => ['auth']
  //   getBoardListHome: () =>
  //     queryOptions({
  //       queryKey: [...HomeQuery.all(), 'getBoardListHome'],
  //       queryFn: async () => {
  //         const response = await axiosInstance.get(`${URL.TOP5_BOARD_LIST}`);

  //         return response.data;
  //       },
  //       retry: 1,
  //       staleTime: 0,
  //       refetchOnMount: true,
  //       refetchOnWindowFocus: false
  //     })
};
