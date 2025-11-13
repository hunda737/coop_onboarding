import { apiSlice } from "../api/apiSlice";

export interface OrganizationMember {
  fullName: string;
  email: string;
  phone: string; // member phone key is "phone"
}

interface OrganizationAccountResponse {
  id: number;
  accountId: number;
  companyName: string;
  phoneNumber: string; // company phoneNumber key
  personalInfo: OrganizationMember[];
}

interface CreateOrganizationRequest {
  companyName: string;
  phoneNumber: string;
  personalInfo: OrganizationMember[];
}

interface ExtendExpiryResponse {
  success: boolean;
  message: string;
  newExpiryTime?: string;
}

// Helper to convert JSON to FormData with correct keys
const createOrganizationFormData = (data: CreateOrganizationRequest) => {
  const formData = new FormData();
  formData.append("companyName", data.companyName);
  formData.append("phoneNumber", data.phoneNumber);
  data.personalInfo.forEach((member, i) => {
    formData.append(`personalInfo[${i}].fullName`, member.fullName);
    formData.append(`personalInfo[${i}].email`, member.email);
    formData.append(`personalInfo[${i}].phone`, member.phone);
  });
  return formData;
};

export const organizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation<
      OrganizationAccountResponse,
      CreateOrganizationRequest
    >({
      query: (data) => ({
        url: "/api/v1/accounts/organizational",
        method: "POST",
        body: createOrganizationFormData(data),
        // DO NOT set Content-Type header for FormData
      }),
    }),

    createLink: builder.mutation<
      Array<{
        id: number;
        token: string;
        expiryTime: string;
        accountId: number;
        companyName: string;
        customerId: number;
        customerName: string;
        customerEmail: string;
      }>,
      { accountId: number; expirationHours: number }
    >({
      query: ({ accountId, expirationHours }) => ({
        url: `/api/registration/create-link?accountId=${accountId}&expirationHours=${expirationHours}`,
        method: "POST",
        // no body here, all data in query params
      }),
    }),
    
    getRegisteredAccounts: builder.query<
      Array<{
        id: number;
        token: string;
        expiryTime: string;
        accountId: number;
        companyName: string;
        customerId: number;
        customerName: string;
        customerEmail: string;
        registeredDevices: Array<{
          id: number;
          deviceId: string;
          deviceName: string;
          status: string;
          lastUsed: string;
        }>;
      }>,
      void
    >({
      query: () => ({
        url: "/api/registration",
        method: "GET",
      }),
    }),
    
    extendExpiry: builder.mutation<
      ExtendExpiryResponse,
      { token: string; additionalHours: number }
    >({
      query: ({ token, additionalHours }) => ({
        url: `/api/registration/extend-expiry?token=${token}&additionalHours=${additionalHours}`,
        method: "POST",
      }),
    }),
  }),
});

export const { 
  useCreateOrganizationMutation, 
  useCreateLinkMutation,
  useGetRegisteredAccountsQuery,
  useExtendExpiryMutation 
} = organizationApiSlice;