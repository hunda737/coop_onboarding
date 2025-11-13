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
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../button";
import { Branch } from "@/features/branches/branchApiSlice";
import { useBranchSelect } from "./react-select";
import Select from "react-select";
import { useVisitTargetModal } from "@/hooks/use-visit-target-modal";
import {
  useGetCurrentUserQuery,
  useGetUsersByClientIdQuery,
} from "@/features/user/userApiSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { VisitTarget } from "@/features/visit-target/visitTargetApiSlice";
import { addTarget } from "@/features/visit-target/visitTargetSlice";

// Define the form schema
const formSchema = z.object({
  user: z.string().min(1, "User is required"),
  branch: z.array(z.string()).optional(),
  visitTarget: z.coerce.number().optional(),
  month: z.enum([
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]),
  year: z.coerce.number().min(1900).max(2100, "Please enter a valid year"),
  remarks: z.string().optional(),
});

type TargetModalProps = {
  branches: Branch[] | undefined;
};

export const VisitTargetModal: React.FC<TargetModalProps> = ({ branches }) => {
  const targetModal = useVisitTargetModal();
  const [loading, setLoading] = useState(false);

  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: users } = useGetUsersByClientIdQuery(
    String(currentUser?.client?.id || "1")
  );
  const dispatch = useAppDispatch();

  const filteredUsers = users?.filter((u) => u.role.includes("VISIT")) || [];
  const userOptions = filteredUsers.map((user) => ({
    label: user.fullName,
    value: user.fullName,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      branch: [],
      visitTarget: 0,
      month: "JANUARY",
      year: new Date().getFullYear(),
      remarks: "",
    },
  });

  const { BranchSelect } = useBranchSelect(branches || [], form.control);

  const monthOptions = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ].map((month) => ({ label: month, value: month }));

  const { targets } = useAppSelector((state) => state.visitTargets);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // console.log(values);

      const newTarget: VisitTarget = {
        targetId: targets.length + 1,
        userId: parseInt(values.user, 10),
        assignedUserName:
          userOptions.find((user) => user.value === values.user)?.label ||
          "Unknown User",
        visitTarget: values.visitTarget,
        branchs: values.branch,
        month: values.month,
        year: values.year,
        remarks: values.remarks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(addTarget(newTarget));

      toast.success("Target created successfully");
      form.reset();
      targetModal.onClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to create target");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Visit Target"
      description="Set visit target for a branch"
      isOpen={targetModal.isOpen}
      onClose={targetModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Select User Dropdown */}
            <FormField
              name="user"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User:</FormLabel>
                  <Select
                    {...field}
                    options={userOptions}
                    value={userOptions.find(
                      (option) => option.value === field.value
                    )} // Set selected user
                    onChange={(option) => field.onChange(option?.value)} // Update value on change
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {BranchSelect}

            <FormField
              name="visitTarget"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visit Target:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter visit target"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="year"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year:</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="month"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month:</FormLabel>
                  <Select
                    {...field}
                    options={monthOptions}
                    value={monthOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="remarks"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks:</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Optional remarks"
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
                onClick={targetModal.onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-cyan-500">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
