import { baseApi } from "../../app/baseApi";

export const countriesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCountries: build.query({
      query: () => ({
        url: "/api/Countries",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
