import axios from "axios";
import {
  AutocompleteResponse,
  CreateSearchParams,
  CreateSearchResponse,
  SearchResultsResponse,
} from "@/types/booking";
import { toCreateSearchBody } from "./bookingMappers";

const bookingApi = axios.create({
  baseURL: process.env.BOOKING_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
});

export async function searchLocations(
  location: string,
): Promise<AutocompleteResponse> {
  const { data } = await bookingApi.get<AutocompleteResponse>(
    "/api/v2/autocomplete",
    { params: { location } },
  );
  return data;
}

export async function getSearchResults(
  guid: string,
): Promise<SearchResultsResponse> {
  const { data } = await bookingApi.get<SearchResultsResponse>(
    `/api/v2/search/${guid}`,
    { params: { searchVersion: 2 } },
  );

  console.log({ data });

  return data;
}

export async function createSearch(
  params: CreateSearchParams,
): Promise<CreateSearchResponse> {
  const { data } = await bookingApi.post<CreateSearchResponse>(
    "/api/v2/search/create-search",
    toCreateSearchBody(params),
  );
  return data;
}
