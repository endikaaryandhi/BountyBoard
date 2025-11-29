import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useBounties = () => {
  return useQuery({
    queryKey: ['bounties'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/bounties`);
      return data;
    }
  });
};

export const useBounty = (id) => {
  return useQuery({
    queryKey: ['bounty', id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/api/bounties/${id}`);
      return data;
    },
    enabled: !!id
  });
};