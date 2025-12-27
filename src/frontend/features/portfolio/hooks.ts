'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPortfolio, addHolding } from '../../services/portfolio.api';

export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: getPortfolio,
  });
}

export function useAddHolding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addHolding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    },
  });
}
