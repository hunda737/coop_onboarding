import { apiSlice } from "../api/apiSlice";

// TypeScript Interfaces
export interface AccountData {
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

export interface FaydaData {
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

export interface AddedBy {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  branch: string;
}

export interface ReviewedBy {
  id: number;
  fullName: string;
  username: string;
  role: string;
}

export interface Review {
  id: number;
  decision: "MERGE" | "REJECT";
  rejectionReason?: string;
  reviewedBy: ReviewedBy;
  reviewedAt: string;
  createdAt: string;
}

export interface Harmonization {
  id: number;
  accountNumber: string;
  phoneNumber: string;
  status: "PENDING_OTP" | "OTP_VERIFIED" | "COMPLETED" | "PENDING_KYC_REVIEW" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  accountData: AccountData;
}

export interface HarmonizationDetail extends Harmonization {
  addedBy: AddedBy;
  faydaData: FaydaData;
  review?: Review;
}

export interface SendOtpRequest {
  accountNumber: string;
}

export interface SendOtpResponse {
  harmonizationRequestId: number;
  accountNumber: string;
  phoneNumber: string;
  maskedPhoneNumber: string;
  message: string;
}

export interface VerifyOtpRequest {
  accountNumber: string;
  harmonizationRequestId: number;
  otpCode: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  harmonizationRequestId: number;
  harmonizationData: {
    id: number;
    accountNumber: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    accountData: {
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
    };
  };
}

export interface FaydaUrlResponse {
  url: string;
  clientId: string;
}

// Legacy interface for Fayda data from WebSocket (kept for backward compatibility)
export interface FaydaDataWebSocket {
  sub: string;
  name: string;
  phone_number: string;
  picture: string;
  birthdate: string;
  gender: string;
  address: {
    street_address?: string;
    locality?: string;
    region: string;
    postal_code?: string;
    country?: string;
  };
  given_name?: string;
  family_name?: string;
  email?: string;
}

export interface SaveFaydaDataRequest {
  phoneNumber: string;
  email?: string;
  familyName?: string;
  name: string;
  givenName?: string;
  sub: string;
  picture?: File | Blob;
  birthdate: string;
  gender: string;
  addressStreetAddress?: string;
  addressLocality?: string;
  addressRegion: string;
  addressPostalCode?: string;
  addressCountry?: string;
  harmonizationRequestId: number;
}

export interface SaveFaydaDataResponse {
  success: boolean;
  message: string;
  harmonizationId: number;
}

export interface ReviewHarmonizationRequest {
  harmonizationRequestId: number;
  decision: "MERGE" | "REJECT";
  rejectionReason?: string;
}

export interface ReviewHarmonizationResponse {
  success: boolean;
  message: string;
}

// RTK Query Endpoints
export const harmonizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET - Get all harmonizations
    getHarmonizations: builder.query<Harmonization[], void>({
      query: () => "/api/v1/harmonization",
      providesTags: (result) =>
        result && Array.isArray(result) && result.length > 0
          ? [
              ...result.map(({ id }) => ({ type: "Harmonization" as const, id })),
              { type: "Harmonization", id: "LIST" },
            ]
          : [{ type: "Harmonization", id: "LIST" }],
      transformResponse: (response: any): Harmonization[] => {
        // Handle different response structures
        let data: Harmonization[] = [];
        
        if (Array.isArray(response)) {
          data = response;
        } else if (response?.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response?.content && Array.isArray(response.content)) {
          data = response.content;
        } else if (response?.items && Array.isArray(response.items)) {
          data = response.items;
        } else {
          console.warn("Unknown harmonization response structure:", response);
          return [];
        }
        
        // Ensure all items have accountData
        return data.map(item => ({
          ...item,
          accountData: item.accountData || {}
        }));
      },
    }),

    // POST - Send OTP
    sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
      query: (data) => ({
        url: "/api/v1/harmonization/get-phone",
        method: "POST",
        body: data,
      }),
    }),

    // POST - Verify OTP
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: "/api/v1/harmonization/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // GET - Get Fayda URL
    getFaydaUrl: builder.query<FaydaUrlResponse, string>({
      query: (clientId) => `/api/v1/national/get-url?clientId=${clientId}`,
    }),

    // POST - Save Fayda Data (multipart/form-data)
    saveFaydaData: builder.mutation<SaveFaydaDataResponse, SaveFaydaDataRequest>({
      query: (data) => {
        const formData = new FormData();
        
        // Append all fields to FormData
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("name", data.name);
        formData.append("sub", data.sub);
        formData.append("birthdate", data.birthdate);
        formData.append("gender", data.gender);
        formData.append("addressRegion", data.addressRegion);
        formData.append("harmonizationRequestId", data.harmonizationRequestId.toString());
        
        // Optional fields
        if (data.email) formData.append("email", data.email);
        if (data.familyName) formData.append("familyName", data.familyName);
        if (data.givenName) formData.append("givenName", data.givenName);
        if (data.addressStreetAddress) formData.append("addressStreetAddress", data.addressStreetAddress);
        if (data.addressLocality) formData.append("addressLocality", data.addressLocality);
        if (data.addressPostalCode) formData.append("addressPostalCode", data.addressPostalCode);
        if (data.addressCountry) formData.append("addressCountry", data.addressCountry);
        if (data.picture) formData.append("picture", data.picture);

        return {
          url: "/api/v1/harmonization/save-fayda-data",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "Harmonization", id: "LIST" }],
    }),

    // GET - Get harmonization by ID
    getHarmonizationById: builder.query<HarmonizationDetail, number>({
      query: (id) => `/api/v1/harmonization/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Harmonization" as const, id }],
    }),

    // POST - Review harmonization (merge or reject)
    reviewHarmonization: builder.mutation<ReviewHarmonizationResponse, ReviewHarmonizationRequest>({
      query: (data) => ({
        url: "/api/v1/harmonization/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Harmonization", id: arg.harmonizationRequestId },
        { type: "Harmonization", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetHarmonizationsQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGetFaydaUrlQuery,
  useLazyGetFaydaUrlQuery,
  useSaveFaydaDataMutation,
  useGetHarmonizationByIdQuery,
  useReviewHarmonizationMutation,
} = harmonizationApiSlice;

