import { queryKeys } from '@/utils/queryKeyFactory';
import { useQuery } from '@tanstack/react-query';
import { searchUserByEmail } from './groupQueryUtils';

export const useEmailSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: queryKeys.searchEmails(searchTerm),
    queryFn: () => searchUserByEmail({ email: searchTerm }),
    //? query is sent only if the user has typed at least two characters
    enabled: !!searchTerm && searchTerm.length >= 2, // !! converts searchTerm to a boolean
    gcTime: 60 * 1000,
  });
};
