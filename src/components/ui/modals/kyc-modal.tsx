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
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useUserModal } from "@/hooks/use-user-modal";
import { Button } from "../button";
import { useCreateUserMutation } from "@/features/user/userApiSlice";
import { Role, useGetAllRolesQuery } from "@/features/roles/roleApiSlice";
import { Client } from "@/features/client/clientApiSlice";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type UserModalProps = {
  clientId: number;
  client: Client | undefined;
};

export const KycModal: FC<UserModalProps> = ({ clientId }) => {
  const userModal = useUserModal();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [createUser] = useCreateUserMutation();
  const { data: res } = useGetAllRolesQuery();

  useEffect(() => {
    const data = res instanceof Array ? res : [];
    setRoles(data);
  }, [res]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // Find ACCOUNT-APPROVER role ID
      const accountApproverRole = roles.find(
        (role) => role.roleName === "ACCOUNT-APPROVER"
      );
      const roleId = accountApproverRole?.id || 3; // Fallback to 2 if not found

      const response = await createUser({
        email: values.email,
        roleId: Number(roleId),
        clientId: clientId || Number(localStorage.getItem("clientId")),
        branchIds: [],
        mainBranchId: 0,
      });

      if (response.data) {
        toast.success("User Created");
        userModal.onClose();
      } else if (response.error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        toast.error(response.error.data.message);
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      toast.error(error?.error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add KYC"
      description="Add a new kyc admin"
      isOpen={userModal.isOpen}
      onClose={userModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} maxLength={50} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                type="button"
                onClick={userModal.onClose}
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
