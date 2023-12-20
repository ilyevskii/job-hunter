import { useQuery } from 'react-query';
import { apiService } from 'services';

import { Industry } from 'types';

export function useList<T>(params?: T) {
  const list = () => apiService.get('/industries', params);

  interface IndustryListResponse {
    items: Industry[];
  }

  return useQuery<IndustryListResponse>(['industries', params], list);
}
