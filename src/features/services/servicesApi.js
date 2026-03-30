import { baseApi } from "../../app/baseApi";

/** Şimdilik sabit kullanıcı — servis listesi bu kullanıcıya göre gelir */
export const DEFAULT_SERVICES_USER_ID =
  "E49D497A-0107-40BB-92CD-932025E5A134";

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getServicesByUser: build.query({
      query: (userId) => ({
        url: `/api/user-panel/customer-requests/services-by-user/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetServicesByUserQuery } = servicesApi;
