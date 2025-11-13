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
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../button";
import { useSettleAccountMutation } from "@/features/accounts/accountApiSlice";
import { useSettleModal } from "@/hooks/use-settle-modal";

// Validation schema
const formSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  amount: z.coerce.number(),
});

type SettleModalProps = {
  selectedAccountIds: number[]; // Still keep as array for component flexibility
  amount: number;
};

export const SettleModal: React.FC<SettleModalProps> = ({
  amount,
  selectedAccountIds,
}) => {
  const settleModal = useSettleModal();
  const [settleAccount] = useSettleAccountMutation(); // ✅ Correct mutation
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionId: "",
      amount,
    },
  });

  useEffect(() => {
    form.setValue("amount", amount);
  }, [amount, form]);

const onSubmit = async (values: z.infer<typeof formSchema>) => {
  try {
    setLoading(true);

    if (selectedAccountIds.length === 0) {
      toast.error("No account selected");
      return;
    }

    await settleAccount({
      accountIds: selectedAccountIds[0], // Send first ID as number
      referenceNumber: values.transactionId
    }).unwrap();

    toast.success("Account settled successfully");
    settleModal.onClose();
    form.reset();
    
  } catch (error: any) {
    toast.error(
      error?.data?.message || "Settlement failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal
      title="Settle Transaction"
      description="Settle Transaction"
      isOpen={settleModal.isOpen}
      onClose={settleModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="transactionId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction ID</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="amount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100"
                      {...field}
                      readOnly
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
                onClick={settleModal.onClose}
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
