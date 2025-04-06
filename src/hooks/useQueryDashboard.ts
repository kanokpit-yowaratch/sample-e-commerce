import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { create, read, update, remove, upload } from "@/lib/apiFetcher";
import { PaginationParams, PaginationResponse } from "@/types/common";

const DASHBOARD_API = '/api/dashboard';
const defaultStaleTime = 5 * 60 * 1000; // 5 minutes

const invalidateModule = (queryClient: ReturnType<typeof useQueryClient>, moduleName: string) => {
  queryClient.invalidateQueries({ queryKey: [moduleName] });
};

export function useItems<T>(module: string) {
  return useQuery({
    queryKey: [module],
    queryFn: async () => read<T>(`${DASHBOARD_API}/${module}`),
    staleTime: defaultStaleTime,
  });
}

export function useItemsWithPagination<T, TPagination extends PaginationResponse<T>>(
  module: string,
  options: PaginationParams
) {
  const { page, perPage, search } = options;
  return useQuery({
    queryKey: [module, options],
    queryFn: () =>
      read<TPagination>(
        `${DASHBOARD_API}/${module}?page=${page}&perPage=${perPage}&search=${search}`
      ),
    staleTime: defaultStaleTime,
  });
}

export function useItem<T>(moduleName: string, id: string) {
  return useQuery<T, Error>({
    queryKey: [moduleName, id],
    queryFn: () => read<T>(`${DASHBOARD_API}/${moduleName}/${id}`),
  });
}

export function useCreateItem<TCreate, T>(moduleName: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, TCreate>({
    mutationFn: (item) => create<T>(`${DASHBOARD_API}/${moduleName}`, item),
    onSuccess: () => invalidateModule(queryClient, moduleName),
  });
}

export function useUpdateItem<TUpdate, T>(moduleName: string, id: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, TUpdate>({
    mutationFn: (item) => update<T>(`${DASHBOARD_API}/${moduleName}/${id}`, item),
    onSuccess: () => invalidateModule(queryClient, moduleName),
  });
}

export function useDeleteItem<TId extends string | number>(moduleName: string) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, TId>({
    mutationFn: (id) => remove(`${DASHBOARD_API}/${moduleName}/${id}`),
    onSuccess: () => invalidateModule(queryClient, moduleName),
  });
}

export function useUploadCover<T>(moduleName: string) {
  const queryClient = useQueryClient();
  return useMutation<T, Error, FormData>({
    mutationFn: (data) => upload<T>(`${DASHBOARD_API}/${moduleName}`, data),
    onSuccess: () => invalidateModule(queryClient, moduleName),
  });
}
