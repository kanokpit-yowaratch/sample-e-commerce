import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { create, read, update, remove, upload, patch } from '@/lib/apiFetcher';
import { PaginationParams, PaginationResponse } from '@/types/common';

const DASHBOARD_API = '/api/protected';
const defaultStaleTime = 5 * 60 * 1000; // 5 minutes

const invalidateModule = (queryClient: ReturnType<typeof useQueryClient>, moduleName: string) => {
  queryClient.invalidateQueries({ queryKey: [moduleName] });
};

export function useItems<T>(
  module: string,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const segments = module.split('/').filter(Boolean);
  const queryOptions = {
    queryKey: segments, // support: a, a/b, a/b/c
    queryFn: async () => {
      const result = await read<T>(`${DASHBOARD_API}/${module}`);
      return result;
    },
    staleTime: defaultStaleTime,
    ...options,
  };
  return useQuery(queryOptions);
}

export function useItemsWithPagination<T, TPagination extends PaginationResponse<T>>(
  module: string,
  options: PaginationParams,
) {
  const { page, perPage, search } = options;
  const queryString = search ? `?page=${page}&perPage=${perPage}&search=${search}`
    : `?page=${page}&perPage=${perPage}`;
  return useQuery({
    queryKey: [module, options],
    queryFn: () =>
      read<TPagination>(`${DASHBOARD_API}/${module}${queryString}`),
    staleTime: defaultStaleTime,
  });
}

export function useItem<T>(moduleName: string, id: string | number) {
  return useQuery<T, Error>({
    queryKey: [moduleName, id],
    queryFn: () => read<T>(`${DASHBOARD_API}/${moduleName}/${id}`),
    enabled: id != null && id != 0,
  });
}

export function useCreateItem<TCreate, T>(moduleName: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, TCreate>({
    mutationFn: (item) => create<T>(`${DASHBOARD_API}/${moduleName}`, item),
    onSuccess: () => invalidateModule(queryClient, moduleName),
    onError: (error: Error) => error,
  });
}

export function useUpdateItem<TUpdate, T>(moduleName: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, TUpdate>({
    mutationFn: (item) => update<T>(`${DASHBOARD_API}/${moduleName}/${id}`, item),
    onSuccess: () => invalidateModule(queryClient, moduleName),
    onError: (error: Error) => error,
  });
}

export function usePatchItem<TUpdate, T>(moduleName: string, id: string | number) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, TUpdate>({
    mutationFn: (item) => patch<T>(`${DASHBOARD_API}/${moduleName}/${id}`, item),
    onSuccess: () => invalidateModule(queryClient, moduleName),
    onError: (error: Error) => error,
  });
}

export function useDeleteItem<TId extends string | number>(moduleName: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, TId>({
    mutationFn: (id) => remove(`${DASHBOARD_API}/${moduleName}/${id}`),
    onSuccess: () => invalidateModule(queryClient, moduleName),
    onError: (error: Error) => error,
  });
}

export function useUpload<T>(moduleName: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, FormData>({
    mutationFn: (data) => upload<T>(`${DASHBOARD_API}/${moduleName}`, data),
    onSuccess: () => invalidateModule(queryClient, moduleName),
    onError: (error: Error) => error,
  });
}
