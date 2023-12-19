import { useMutation, useQuery } from 'react-query';
import { apiService } from 'services';

import { Feedback } from 'types';

export function useCreate<T>() {
  const create = (data: T) => apiService.post('/feedbacks', data);

  return useMutation<Feedback, unknown, T>(create);
}

export function useGet(jobId: number, options?: any) {
  const getApplicationById = () => apiService.get(`/feedbacks/${jobId}`);

  interface GetFeedbackResponse {
    status: 'ACCEPTED' | 'DECLINED' | 'PENDING';
    feedback?: Feedback,
  }

  return useQuery<Feedback, unknown, GetFeedbackResponse, string[]>(['feedbacks', String(jobId)], getApplicationById, options);
}
