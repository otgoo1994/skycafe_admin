import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useApiError } from './api';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  const { handleError } = useApiError();

  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        mutations: {
          onError: handleError,
          networkMode: 'always'
        },
        queries: {
          networkMode: 'always'
        }
      },
      queryCache: new QueryCache({
        onError: handleError
      })
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </QueryClientProvider>
  );
}
