import { apiSlice } from "../api/apiSlice";

// Interfaces for Request and Response
export interface MeetingTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface Meeting {
  meetingId: number;
  highProfileCustomerName: string;
  crmName: string;
  meetingDate: string;
  meetingTime: MeetingTime | string;
  reason?: string;
  feeling?: string;
  emotionalAttachment?: string;
  notes?: string;
  category?: string;
  address?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingRequest {
  highProfileCustomerId?: number;
  meetingDate?: string;
  meetingTime?: string; // Use "HH:mm:ss" format
  reason?: string;
  feeling?: string;
  emotionalAttachment?: string;
  notes?: string;
  address?: string;
}

export interface UpdateMeetingRequest {
  meetingId: number;
  feeling?: string;
  meetingTime?: string;
  meetingDate?: string;
  emotionalAttachment?: string;
  notes?: string;
  address?: string;
}

export interface ScheduleMeetingRequest {
  highProfileCustomerId?: number;
  meetingDate?: string;
  meetingTime?: string; // Use "HH:mm:ss" format
  reason?: string;
  address?: string;
}

export interface GetMeetingsParams {
  hpc?: number;
  status?: "SCHEDULED" | "COMPLETED" | "CANCELED";
}

export interface DeleteParams {
  meetingId?: number;
}

// Meeting API Slice
export const meetingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. POST /api/v1/meetings
    createMeeting: builder.mutation<Meeting, CreateMeetingRequest>({
      query: (data) => ({
        url: "/api/v1/meetings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Meeting", id: "MEETING_LIST" }],
    }),

    // 2. PUT /api/v1/meetings
    updateMeeting: builder.mutation<Meeting, UpdateMeetingRequest>({
      query: ({ meetingId, ...data }) => ({
        url: `/api/v1/meetings/update`,
        method: "PUT",
        params: { meetingId },
        body: data,
      }),
      invalidatesTags: [{ type: "Meeting", id: "MEETING_LIST" }],
    }),

    // 3. GET /api/v1/meetings
    getMeetings: builder.query<Meeting[], void>({
      query: () => ({
        url: "/api/v1/meetings",
      }),
      providesTags: [{ type: "Meeting", id: "MEETING_LIST" }],
    }),

    // 4. POST /api/v1/meetings/schedule
    scheduleMeeting: builder.mutation<Meeting, ScheduleMeetingRequest>({
      query: (data) => ({
        url: "/api/v1/meetings/schedule",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Meeting", id: "MEETING_LIST" }],
    }),

    // 5. GET /api/v1/meetings/me
    getMyMeetings: builder.query<Meeting[], GetMeetingsParams>({
      query: (params) => ({
        url: "/api/v1/meetings/me",
        params,
      }),
      providesTags: [{ type: "Meeting", id: "MEETING_LIST" }],
    }),

    // 5. GET /api/v1/meetings/me
    deleteMeeting: builder.mutation<Meeting[], DeleteParams>({
      query: (params) => ({
        url: "/api/v1/meetings",
        params,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Meeting", id: "MEETING_LIST" }],
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useGetMeetingsQuery,
  useScheduleMeetingMutation,
  useGetMyMeetingsQuery,
  useDeleteMeetingMutation,
} = meetingApiSlice;
