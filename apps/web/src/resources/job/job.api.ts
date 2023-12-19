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

export function useGet(id: number, options?: any) {
  const getJobById = () => apiService.get(`/jobs/${id}`);

  return useQuery<Job, unknown, JobWithEmployer, string[]>(['jobs', String(id)], getJobById, options);
}
