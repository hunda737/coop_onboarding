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
import { FC } from "react";
import { toast } from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { useCreateLeadMutation } from "@/features/lead/leadApiSlice";
import { useLeadModal } from "@/hooks/use-lead-modal";
import { useGetCurrentUserQuery } from "@/features/user/userApiSlice";
import { Textarea } from "../textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Contact is required"),
  email: z.string().email("Invalid email").optional(),
  source: z.enum(["REFERRAL", "AD", "EVENT"]),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"]),
  description: z.string().optional(),
  interest: z.string().optional(),
});

type LeadModalProps = {
  customerId: number;
};

export const LeadModal: FC<LeadModalProps> = ({ customerId }) => {
  const leadModal = useLeadModal();
  const [createLead, { isLoading: createLeadLoading }] =
    useCreateLeadMutation();
  const { data: currentUser } = useGetCurrentUserQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "REFERRAL",
      status: "NEW",
      description: "",
      interest: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createLead({
        highProfileCustomerId: Number(customerId),
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        source: values.source,
        status: values.status,
        notes: values.description || "",
        interest: values.interest || "",
        assignedToUserId: currentUser?.userId,
      }).unwrap();

      if (response) {
        toast.success("Lead created successfully!");
        leadModal.onClose(); // Close modal after success
        form.reset(); // Reset form for reuse
      }
    } catch (error) {
      toast.error(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        error?.data?.message || "Failed to create lead. Please try again."
      );
    }
  };

  return (
    <Modal
      title="Add Lead"
      description="Create a new lead"
      isOpen={leadModal.isOpen}
      onClose={leadModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Name */}
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="Lead name" {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact */}
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone:</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Lead Source */}
              <FormField
                name="source"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Source:</FormLabel>
                    <Select
                      disabled={createLeadLoading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="REFERRAL">REFERRAL</SelectItem>
                        <SelectItem value="AD">AD</SelectItem>
                        <SelectItem value="EVENT">EVENT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status:</FormLabel>
                    <Select
                      disabled={createLeadLoading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          "NEW",
                          "CONTACTED",
                          "QUALIFIED",
                          "CONVERTED",
                          "LOST",
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Interest */}
            <FormField
              name="interest"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest:</FormLabel>
                  <FormControl>
                    <Input placeholder="Interest (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                type="button"
                onClick={leadModal.onClose}
                disabled={createLeadLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createLeadLoading}
                className="bg-cyan-500"
              >
                {createLeadLoading ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
