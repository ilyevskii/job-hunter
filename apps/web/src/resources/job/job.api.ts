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

export function useUpdate<T>(id: number) {
  const update = (data: T) => apiService.put(`/jobs/${id}`, data);

  return useMutation<Job, unknown, T>(update);
}

export function useDelete<T>(id: number) {
  const deleteJob = (data: T) => apiService.delete(`/jobs/${id}`, data);

  return useMutation<Job, unknown, T>(deleteJob);
}

export function useGet(id: number, options?: any) {
  const getJobById = () => apiService.get(`/jobs/${id}`);

  return useQuery<Job, unknown, JobWithEmployer, string[]>(['jobs', String(id)], getJobById, options);
}
