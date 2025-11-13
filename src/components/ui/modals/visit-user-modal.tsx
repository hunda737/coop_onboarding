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

import { useBranchSelect } from "./react-select";
import { useSingleBranchSelect } from "./react-single-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { useCreateUserMutation } from "@/features/user/userApiSlice";
import { Role, useGetAllRolesQuery } from "@/features/roles/roleApiSlice";
import { useGetBranchesByDistrictQuery } from "@/features/branches/branchApiSlice";
import { Client } from "@/features/client/clientApiSlice";
import { useVisitUserModal } from "@/hooks/use-visit-user-modal";

const formSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().default(""),
  password: z.string().default(""),
  roleId: z.string(),
  clientId: z.coerce.number().optional(),
  mainBranchId: z.string(),
  branchIds: z.array(z.string()),
});

type UserModalProps = {
  clientId: number;
  client: Client | undefined;
};

export const UserVisitModal: FC<UserModalProps> = ({ clientId, client }) => {
  const userModal = useVisitUserModal();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [createUser] = useCreateUserMutation();
  const { data: branches } = useGetBranchesByDistrictQuery(
    String(client?.district)
  );
  const { data: res } = useGetAllRolesQuery();

  useEffect(() => {
    const fetchData = async () => {
      const data = res instanceof Array ? res : [];
      setRoles(data);
    };

    fetchData();
  }, [res]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      roleId: "",
      mainBranchId: "",
      branchIds: [],
    },
  });

  const { BranchSelect } = useBranchSelect(
    branches ? branches : [],
    form.control
  );

  const { SingleBranchSelect } = useSingleBranchSelect(
    branches ? branches : [],
    form.control
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await createUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        roleId: Number(values.roleId),
        mainBranchId: Number(values.mainBranchId),
        clientId: clientId || Number(localStorage.getItem("clientId")),
        branchIds: values.branchIds
          ? values.branchIds
            .map((id: string) => Number(id))
            .filter((id) => !isNaN(id))
          : [],
      });
      if (response.data) {
        toast.success("User Created");
      }
      userModal.onClose();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      toast.error(error?.error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Watch the roleId value
  const selectedRoleId = form.watch("roleId");

  return (
    <Modal
      title="Add User"
      description="Add a new user"
      isOpen={userModal.isOpen}
      onClose={userModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name:</FormLabel>
                  <FormControl>
                    <Input placeholder="fullname" {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role:</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                    defaultValue={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a role"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles
                        .filter((item) => item.roleName.includes("VISIT"))
                        .map((role) => (
                          <SelectItem
                            key={role.id}
                            value={role.id?.toString() || ""}
                          >
                            {role.roleName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(selectedRoleId === "2" ||
              selectedRoleId === "3" ||
              selectedRoleId === "202") &&
              SingleBranchSelect}
            {(selectedRoleId === "2" || selectedRoleId === "3") && BranchSelect}
            {/* The react-select component */}
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
