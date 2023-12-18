import { useMutation, useQuery } from 'react-query';

import { JobWithEmployer, Job } from 'types';

import { apiService } from 'services';

export function useList<T>(params: T) {
  const list = () => apiService.get('/jobs', params);

  interface JobListResponse {
    count: number;
    page: number;
    items: JobWithEmployer[];
    totalPages: number;
  }

  return useQuery<JobListResponse>(['jobs', params], list);
}

export function useCreate<T>() {
  const create = (data: T) => apiService.post('/jobs', data);

  return useMutation<Job, unknown, T>(create);
}
