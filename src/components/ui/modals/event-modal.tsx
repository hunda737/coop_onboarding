import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { useEventModal } from "@/hooks/use-event-modal";
import { CalendarEvent } from "@/components/presentation/hpc/components/calendar/CalenderData";
import { useGetHighProfileCustomersQuery } from "@/features/hpc/hpcApiSlice";
import {
  Meeting,
  useDeleteMeetingMutation,
  useScheduleMeetingMutation,
  useUpdateMeetingMutation,
} from "@/features/meeting/meetingApiSlice";
import { Textarea } from "../textarea";

const formSchema = z.object({
  highProfileCustomerId: z.number({
    required_error: "High Profile Customer is required",
  }),
  meetingDate: z.string().min(1, "Meeting date is required"),
  meetingTime: z.string().min(1, "Meeting time is required"),
  category: z.string().min(1, "Category is required"),
  reason: z.string().optional(),
  address: z.string().optional(),
  feeling: z.string().optional(),
  notes: z.string().optional(),
});

type EventModalProps = {
  event: CalendarEvent | null | undefined;
  dataToCreate?: Partial<Meeting> | null;
};

const categoryOptions = [
  { label: "Primary", value: "primary" },
  { label: "Danger", value: "danger" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Success", value: "success" },
];

export const EventModal: React.FC<EventModalProps> = ({
  event,
  dataToCreate,
}) => {
  const eventModal = useEventModal();
  const [loading, setLoading] = useState(false);

  const { data: customers = [], isLoading: customersLoading } =
    useGetHighProfileCustomersQuery();

  // API mutations
  const [scheduleMeating] = useScheduleMeetingMutation();
  const [updateMeeting] = useUpdateMeetingMutation();
  const [deleteMeeting] = useDeleteMeetingMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      highProfileCustomerId: undefined,
      meetingDate: "",
      meetingTime: "",
      reason: "",
      address: "",
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        highProfileCustomerId:
          customers.find(
            (customer) =>
              customer.accHolderName ===
              event?.extendedProps?.highProfileCustomerName
          )?.id || undefined,
        meetingDate: event?.start
          ? new Date(event?.start).toLocaleDateString("en-CA")
          : "",
        meetingTime: event?.start
          ? new Date(event?.start).toLocaleTimeString("en-GB", {
              hour12: false,
            })
          : "",
        reason: event?.title || "",
        address: event?.extendedProps?.address || "",
        category: event?.extendedProps?.category || "",
        notes: event?.extendedProps?.notes || "",
        feeling: event?.extendedProps?.feeling || "",
      });
    } else {
      form.reset();
    }
  }, [event, customers, form]);

  useEffect(() => {
    if (dataToCreate) {
      form.reset({
        highProfileCustomerId: undefined,
        meetingDate: dataToCreate.meetingDate || "",
        meetingTime: String(dataToCreate.meetingTime) || "",
        reason: dataToCreate.reason || "",
        category: dataToCreate.category || "",
        address: dataToCreate.address || "",
      });
    } else if (dataToCreate === null) {
      form.reset({
        highProfileCustomerId: undefined,
        meetingDate: "",
        meetingTime: "",
        reason: "",
        address: "",
      });
    }
  }, [dataToCreate, form]);

  const HandleDelete = async () => {
    setLoading(true);
    try {
      if (event?.id) {
        // Update meeting
        await deleteMeeting({
          meetingId: Number(event.id),
        }).unwrap();
        toast.success("Meeting deleted successfully!");
      }
      eventModal.onClose();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      toast.error(error?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (event?.id) {
        // Update meeting
        await updateMeeting({
          meetingId: Number(event.id),
          ...values,
        }).unwrap();
        toast.success("Meeting updated successfully!");
      } else {
        // Create meeting
        await scheduleMeating(values).unwrap();
        toast.success("Meeting created successfully!");
      }
      eventModal.onClose();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      toast.error(error?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={eventModal.isOpen}
      onClose={eventModal.onClose}
      size={event?.id ? "max-w-3xl" : null}
      title={event?.id ? "Edit Meeting" : "Create Meeting"}
      description="Create a new meeting or edit an existing one."
    >
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="highProfileCustomerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>High Profile Customer</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(parseInt(value, 10))
                    }
                    value={field.value?.toString() || ""}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          customersLoading
                            ? "Loading customers..."
                            : "Select a customer"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          {customer.accHolderName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={event?.id ? "grid grid-cols-2 gap-4" : ""}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Reason for the meeting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={event?.id ? "grid grid-cols-2 gap-4" : ""}>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Meeting address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {event?.id && (
                <FormField
                  control={form.control}
                  name="feeling"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeling</FormLabel>
                      <FormControl>
                        <Input placeholder="feeling" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {event?.id && (
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={10}
                        placeholder="Write notes here ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex items-center justify-between">
              {event?.id ? (
                <div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={HandleDelete}
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <div></div>
              )}
              <div className="flex space-x-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={eventModal.onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? event?.id
                      ? "Updating..."
                      : "Creating..."
                    : event?.id
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
