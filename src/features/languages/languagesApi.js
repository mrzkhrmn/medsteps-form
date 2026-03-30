import { baseApi } from "../../app/baseApi";

export const languagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLanguages: build.query({
      query: () => ({
        url: "/api/Languages",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetLanguagesQuery } = languagesApi;
