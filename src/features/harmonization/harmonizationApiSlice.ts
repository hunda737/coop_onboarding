import { apiSlice, baseUrl } from "../api/apiSlice";
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
  addressZone: string;
  addressWoreda: string;
  nationality: string;
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
  addedBy?: AddedBy;
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
  success?: boolean;
  harmonizationData?: {
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
  addressZone?: string;
  addressWoreda?: string;
  nationality?: string;
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

export interface PaginatedHarmonizationResponse {
  content: Harmonization[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// RTK Query Endpoints
export const harmonizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET - Get all harmonizations with pagination
    getHarmonizations: builder.query<PaginatedHarmonizationResponse, { status?: string; branchId?: number; districtId?: number; page?: number; size?: number; sortBy?: string; sortDirection?: string }>({
      query: ({ status, branchId, districtId, page = 0, size = 10, sortBy = "createdAt", sortDirection = "desc" }) => {
        let url = `/api/v1/harmonization`;
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());
        params.append("sortBy", sortBy);
        params.append("sortDirection", sortDirection);
        if (status) {
          params.append("status", status);
        }
        if (branchId !== undefined) {
          params.append("branchId", branchId.toString());
        }
        if (districtId !== undefined) {
          params.append("districtId", districtId.toString());
        }
        return `${url}?${params.toString()}`;
      },
      providesTags: (result) =>
        result && result.content && result.content.length > 0
          ? [
              ...result.content.map(({ id }) => ({ type: "Harmonization" as const, id })),
              { type: "Harmonization", id: "LIST" },
            ]
          : [{ type: "Harmonization", id: "LIST" }],
      // Refetch when component mounts or arguments change
      keepUnusedDataFor: 0, // Don't keep unused data
      transformResponse: (response: any): PaginatedHarmonizationResponse => {
        // Handle paginated response from backend
        if (response && response.content && Array.isArray(response.content)) {
          return {
            content: response.content.map((item: any) => ({
              ...item,
              accountData: item.accountData || {}
            })),
            totalPages: response.totalPages || 0,
            totalElements: response.totalElements || 0,
            size: response.size || 0,
            number: response.number || 0,
            first: response.first || false,
            last: response.last || false,
            numberOfElements: response.numberOfElements || 0,
            empty: response.empty || false,
          };
        }
        
        // Fallback for unexpected response structure
        console.warn("Unknown harmonization response structure:", response);
        return {
          content: [],
          totalPages: 0,
          totalElements: 0,
          size: 0,
          number: 0,
          first: true,
          last: true,
          numberOfElements: 0,
          empty: true,
        };
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
        formData.append("addressZone", data.addressZone || "");
        formData.append("addressWoreda", data.addressWoreda || "");
        formData.append("nationality", data.nationality || "");
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

    // POST - Refetch images
    refetchImage: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/v1/harmonization/refetch-image/${id}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Harmonization" as const, id }],
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

    // GET - Export harmonization data (returns Excel file)
    exportHarmonizationData: builder.query<Blob, { startDate: string; endDate: string }>({
      queryFn: async ({ startDate, endDate }) => {
        const token = secureAuth.getAccessToken();
        
        try {
          const response = await fetch(
            `${baseUrl}/api/v1/harmonization/export?startDate=${startDate}&endDate=${endDate}`,
            {
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text().catch(() => "Failed to export data");
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
              error: error instanceof Error ? error.message : "Failed to export data" 
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
  useRefetchImageMutation,
  useLazyExportHarmonizationDataQuery,
} = harmonizationApiSlice;

