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
import { useTargetModal } from "@/hooks/use-target-modal";
import { Button } from "../button";
import { Branch } from "@/features/branches/branchApiSlice";
import { useBranchSelect } from "./react-select";
import { useCreateBulkSameTargetMutation } from "@/features/target/targetApiSlice";
import Select, { MultiValue } from "react-select";

// Define month literals as constants
const MONTHS = [
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
] as const;
type Month = typeof MONTHS[number]; // Create Month type

// Define the option type for react-select
type OptionType = {
  label: string;
  value: Month; // Use Month type instead of string
};

const formSchema = z.object({
  branchIds: z.array(z.coerce.number()).optional(),
  districtId: z.union([z.coerce.number().optional(), z.null()]),
  accountOnboarding: z.coerce.number(),
  agentRegistration: z.coerce.number(),
  inactiveAccount: z.coerce.number(),
  year: z.coerce.number().min(1900).max(2100, "Please enter a valid year"),
  months: z.array(z.enum(MONTHS)), // Use the MONTHS constant
});

type TargetModalProps = {
  branches: Branch[] | undefined;
  districtId: number | undefined;
};

export const TargetModal: React.FC<TargetModalProps> = ({
  branches,
  districtId,
}) => {
  const targetModal = useTargetModal();
  const [loading, setLoading] = useState(false);
  const [createBulkTarget] = useCreateBulkSameTargetMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchIds: [],
      districtId: 101,
      accountOnboarding: 0,
      agentRegistration: 0,
      inactiveAccount: 0,
      year: new Date().getFullYear(),
      months: [],
    },
  });

  const { BranchSelect } = useBranchSelect(
    branches ? branches : [],
    form.control
  );

  const selectedBranchIds = form.watch("branchIds");

  useEffect(() => {
    if (selectedBranchIds?.length) {
      form.setValue("districtId", null);
    } else {
      form.setValue("districtId", districtId);
      form.setValue("branchIds", []);
    }
  }, [districtId, form, selectedBranchIds?.length]);

  // Properly typed month options using Month type
  const monthOptions: OptionType[] = MONTHS.map((month) => ({
    label: month,
    value: month,
  }));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await createBulkTarget(values).unwrap();
      if (response) {
        toast.success("Target Set successfully");
      }
      form.reset();
      targetModal.onClose();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      toast.error(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Target"
      description="Add new target for branch and district"
      isOpen={targetModal.isOpen}
      onClose={targetModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {BranchSelect}

            <FormField
              name="accountOnboarding"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Onboarding:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Account Onboarding"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="agentRegistration"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Registration:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Agent Registration"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="inactiveAccount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inactive Account:</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Inactive Account"
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

            {/* Fixed Month Multi-Select */}
            <FormField
              name="months"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Months:</FormLabel>
                  <Select
                    isMulti
                    options={monthOptions}
                    value={monthOptions.filter((option) =>
                      field.value.includes(option.value)
                    )}
                    onChange={(options: MultiValue<OptionType>) => {
                      field.onChange(
                        options.map((option) => option.value)
                      );
                    }}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
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