// examSlice.ts

import { apiSlice } from '../api/apiSlice';

interface Example {
  id: string;
  open: boolean;
}

export const exampleApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createExample: builder.mutation<Example, Partial<Example>>({
      query: data => ({
        url: '/examples/new',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [{ type: 'Examples', id: 'EXAMPLE_LIST' }]
    }),
    getAllExamples: builder.query<Example[], string[]>({
      query: filter => ({
        url: '/examples',
        params: filter
      }),
      providesTags: result =>
        // Is result available?
        result
          ? // Successful query
            [
              ...result.map(({ id }) => ({ type: 'Examples', id }) as const),
              { type: 'Examples', id: 'EXAMPLE_LIST' }
            ]
          : // An error occurred, but we still want to refetch this query when `{ type: 'Examples', id: 'EXAMPLE_LIST' }` is invalidated
            [{ type: 'Examples', id: 'EXAMPLE_LIST' }]
    }),
    getExample: builder.query<Example, string | undefined>({
      query: id => ({
        url: `/examples/${id}`
      }),
      providesTags: (_, __, id) => [{ type: 'Examples', id }]
    }),
    updateExample: builder.mutation<Example, Partial<Example>>({
      query: ({ id, ...data }) => ({
        url: `/examples/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Examples', id }]
    }),
    deleteExample: builder.mutation<boolean, string>({
      query: id => ({
        url: `/examples/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, id) => [{ type: 'Examples', id }]
    })
  })
});

export type { Example };

export const {
  useCreateExampleMutation,
  useGetAllExamplesQuery,
  useGetExampleQuery,
  useUpdateExampleMutation,
  useDeleteExampleMutation
} = exampleApiSlice;
