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
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { useGetCRMUsersQuery } from "@/features/crm/crmApiSlice";
import { useBulkAssignCRMMutation } from "@/features/hpc/hpcApiSlice";
import { useAssignBulkCRMModal } from "@/hooks/use-assign-crm-modal";

// Zod validation schema for the form
const formSchema = z.object({
  crmId: z.string().min(1, "CRM is required"),
});

type AssignBulkCRMModalProps = {
  hpcIds: number[];
};

export const AssignBulkCRMModal: React.FC<AssignBulkCRMModalProps> = ({
  hpcIds,
}) => {
  const assignBulkCRMModal = useAssignBulkCRMModal();
  const [loading, setLoading] = useState(false);

  const { data: crmData } = useGetCRMUsersQuery({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crmId: "",
    },
  });

  const [assignBulkCRM] = useBulkAssignCRMMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      await assignBulkCRM({
        crmId: Number(values.crmId),
        body: hpcIds,
      }).unwrap();
      toast.success("CRM Assigned successfully!");
      assignBulkCRMModal.onClose();
    } catch (error) {
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        error?.data?.message || "Something went wrong. Please try again!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Assign CRM"
      description="Assign CRM to HPC"
      isOpen={assignBulkCRMModal.isOpen}
      onClose={assignBulkCRMModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="crmId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRM</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select RM" />
                      </SelectTrigger>
                      <SelectContent>
                        {crmData?.map((crm) => (
                          <SelectItem
                            key={crm.userId}
                            value={String(crm.userId)}
                          >
                            {crm.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                type="button"
                onClick={assignBulkCRMModal.onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-cyan-500">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
