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
import Select, { SingleValue } from "react-select";
import { useCreateRTGSRequestMutation } from "@/features/rtgs/rtgsApiSlice";
// import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import {
  Select as DefaultSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { useRtgsModal } from "@/hooks/use-rtgs-modal";

// Define the option type for react-select
type OptionType = {
  label: string;
  value: string;
};

const formSchema = z.object({
  branch: z.string(),
  type: z.string(z.enum(["Outgoing", "Incoming"])),
  bank: z.string(
    z.enum([
      "Abay Bank",
      "Awash International Bank",
      "Bank of Abyssinia",
      "Bunna International Bank",
      "Dashen Bank",
      "Enat Bank",
      "Wegagen Bank",
    ])
  ),
  amount: z.coerce.number(),
  contact: z.string(),
});

export const RTGSModal = () => {
  const rtgsModal = useRtgsModal();
  const [loading, setLoading] = useState(false);
  const [createRTGSRequest] = useCreateRTGSRequestMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: "",
      type: "Outgoing",
      bank: "",
      amount: 0,
      contact: "",
    },
  });

  const bankOptions = [
    "Abay Bank",
    "Awash International Bank",
    "Bank of Abyssinia",
    "Bunna International Bank",
    "Dashen Bank",
    "Enat Bank",
    "Wegagen Bank",
  ].map((bank) => ({ label: bank, value: bank }));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      setLoading(true);
      const response = await createRTGSRequest({
        branch: "New Branch",
        type: values.type,
        bank: values.bank,
        amount: values.amount,
        contact: "0912345678",
      });
      if (response) {
        toast.success("Target Set successfully");
      }
      form.reset();
      rtgsModal.onClose();
    } catch (error: unknown) {
      // toast.error(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add RTGS request"
      description="Add new rtgs for branch and district"
      isOpen={rtgsModal.isOpen}
      onClose={rtgsModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="bank"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank:</FormLabel>
                  <Select
                    {...field}
                    // isMulti // Enable multi-select
                    options={bankOptions}
                    value={bankOptions.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(option: SingleValue<OptionType>) =>
                      field.onChange(option?.value)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type:</FormLabel>
                  <FormControl>
                    <DefaultSelect
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Outgoing">Outgoing</SelectItem>
                          <SelectItem value="Incomming">Incomming</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </DefaultSelect>
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
                  <FormLabel>Amount:</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                type="button"
                onClick={rtgsModal.onClose}
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
