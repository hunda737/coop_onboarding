import { apiSlice } from "../api/apiSlice";

export interface HarmonizationUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  branch?: string;
}

export interface HarmonizationAccountData {
  id: number;
  accountTitle: string;
  mobile: string;
  address: string;
  photoUrl: string;
  ethnicity: string;
  gender: string;
  dateOfBirth: string;
  occupation: string;
  openingDate: string;
  customerId: number;
  createdAt: string;
}

export interface HarmonizationFaydaData {
  id: number;
  sub: string;
  givenName: string;
  name: string;
  familyName: string;
  email: string;
  phoneNumber: string;
  pictureUrl: string;
  birthdate: string;
  gender: string;
  addressStreetAddress: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
  createdAt: string;
}

export interface HarmonizationReview {
  id: number;
  decision: string;
  rejectionReason?: string;
  reviewedBy: HarmonizationUser;
  reviewedAt: string;
  createdAt: string;
}

export interface HarmonizationItem {
  id: number;
  accountNumber: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  addedBy: HarmonizationUser;
  accountData: HarmonizationAccountData;
  faydaData: HarmonizationFaydaData;
  review?: HarmonizationReview;
}

export interface HarmonizationPageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface HarmonizationResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: HarmonizationItem[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: HarmonizationPageable;
  empty: boolean;
}

export interface HarmonizationQueryParams {
  page?: number;
  size?: number;
}

export const harmonizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHarmonization: builder.query<HarmonizationResponse, HarmonizationQueryParams>({
      query: ({ page = 0, size = 10 }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });
        return {
          url: `/api/v1/harmonization?${params.toString()}`,
        };
      },
      providesTags: [{ type: "Accounts", id: "HARMONIZATION_LIST" }],
    }),
  }),
});

export const { useGetHarmonizationQuery } = harmonizationApiSlice;

