import { useMutation, useQuery } from 'react-query';
import { apiService } from 'services';

import { Resume, ResumeWithUser } from 'types';

export function useList<T>(params?: T) {
  const list = () => apiService.get('/resumes', params);

  interface ResumeListResponse {
    items: Resume[];
  }

  return useQuery<ResumeListResponse>(['resumes', params], list);
}

export function useCreate<T>() {
  const create = (data: T) => apiService.post('/resumes', data);

  return useMutation<Resume, unknown, T>(create);
}

export function useGet(id: number, options?: any) {
  const getResumeById = () => apiService.get(`/resumes/${id}`);

  return useQuery<Resume, unknown, ResumeWithUser, string[]>(['resumes', String(id)], getResumeById, options);
}
