import { useMutation, useQuery } from 'react-query';
import { apiService } from 'services';

import { Application, ApplicationWithUser } from 'types';

export function useList<T>(params: T) {
  const list = () => apiService.get('/applications', params);

  interface ApplicationListResponse {
    count: number;
    page: number;
    items: ApplicationWithUser[];
    totalPages: number;
  }

  return useQuery<ApplicationListResponse>(['applications', params], list);
}

export function useCreate<T>() {
  const create = (data: T) => apiService.post('/applications', data);

  return useMutation<Application, unknown, T>(create);
}

export function useGet(id: number, options?: any) {
  const getApplicationById = () => apiService.get(`/applications/${id}`);

  return useQuery<Application, unknown, Application, string[]>(['applications', String(id)], getApplicationById, options);
}
