import { baseApi } from "../../app/baseApi";

export const customerRequestsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createCustomerRequest: build.mutation({
      query: (body) => ({
        url: "/api/user-panel/customer-requests",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateCustomerRequestMutation } = customerRequestsApi;

