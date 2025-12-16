import { apiSlice } from "../api/apiSlice";
import { secureAuth } from "@/lib/secureAuth";

// TypeScript Interfaces
export interface ImageData {
  id: number;
  imageType: string;
  createdAt: string;
}

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
  decision: "HARMONIZED" | "REJECT";
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
  images?: ImageData[];
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
  decision: "HARMONIZED" | "REJECT";
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
      query: () => "/api/v1/harmonization-review",
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
        
        // Append all fields to FormData (send empty strings for optional fields if not provided)
        formData.append("phoneNumber", data.phoneNumber || "");
        formData.append("email", data.email || "");
        formData.append("familyName", data.familyName || "");
        formData.append("name", data.name || "");
        formData.append("givenName", data.givenName || "");
        formData.append("sub", data.sub || "");
        formData.append("birthdate", data.birthdate || "");
        formData.append("gender", data.gender || "");
        formData.append("addressStreetAddress", data.addressStreetAddress || "");
        formData.append("addressLocality", data.addressLocality || "");
        formData.append("addressRegion", data.addressRegion || "");
        formData.append("addressPostalCode", data.addressPostalCode || "");
        formData.append("addressCountry", data.addressCountry || "");
        formData.append("harmonizationRequestId", data.harmonizationRequestId.toString());
        
        // Append picture file if provided
        if (data.picture) {
          formData.append("picture", data.picture);
        }

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
        url: "/api/v1/harmonization-review/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Harmonization", id: arg.harmonizationRequestId },
        { type: "Harmonization", id: "LIST" },
      ],
    }),

    // GET - Get image by ID (returns blob/Resource)
    getImageById: builder.query<Blob, number>({
      queryFn: async (imageId) => {
        const token = secureAuth.getAccessToken();
        const baseUrl = "http://localhost:9061";
        
        try {
          const response = await fetch(`${baseUrl}/api/v1/harmonization/image/${imageId}`, {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });

          if (!response.ok) {
            const errorText = await response.text().catch(() => "Failed to fetch image");
            return { 
              error: { 
                status: response.status, 
                data: errorText 
              } as any
            };
          }

          const blob = await response.blob();
          return { data: blob };
        } catch (error) {
          return { 
            error: { 
              status: 'FETCH_ERROR' as const, 
              error: error instanceof Error ? error.message : "Failed to fetch image" 
            } as any
          };
        }
      },
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
  useLazyGetImageByIdQuery,
} = harmonizationApiSlice;

