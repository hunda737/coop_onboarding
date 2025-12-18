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
import { useUserModal } from "@/hooks/use-user-modal";
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
import { useGetAllBranchesQuery, useGetBranchesByDistrictQuery } from "@/features/branches/branchApiSlice";
import { Client } from "@/features/client/clientApiSlice";

// Zod schema
const formSchema = z.object({
  // fullName: z.string().min(1),
  email: z.string().default(""),
  // password: z.string().default(""),
  roleId: z.string(),
  clientId: z.coerce.number().optional(),
  mainBranchId: z.string(),
  branchIds: z.array(z.string()),
});

type UserModalProps = {
  clientId: number;
  client: Client | undefined;
};

export const UserModal: FC<UserModalProps> = ({ clientId, client }) => {
  const userModal = useUserModal();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [createUser] = useCreateUserMutation();

  const { data: branches } = useGetAllBranchesQuery(
    // String(client?.district)
  );

  // const { data: branches } = useGetBranchesByDistrictQuery(
  //   String(client?.district)
  // );
  const { data: res } = useGetAllRolesQuery();

  useEffect(() => {
    const data = res instanceof Array ? res : [];
    setRoles(data);
  }, [res]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // fullName: "",
      email: "",
      // password: "",
      roleId: "",
      mainBranchId: "",
      branchIds: [],
    },
  });

  const { BranchSelect } = useBranchSelect(branches || [], form.control);
  const { SingleBranchSelect } = useSingleBranchSelect(branches || [], form.control);

  // Watch role selection
  const selectedRoleId = form.watch("roleId");
  const selectedRole = roles.find((role) => role.id.toString() === selectedRoleId);

  // Role behavior map
  const roleBehaviors: Record<string, { showMainBranch: boolean; showBranches: boolean }> = {
    "CLIENT-ADMIN": { showMainBranch: false, showBranches: false },
    "ACCOUNT-APPROVER": { showMainBranch: false, showBranches: false },
    "BRANCH-ADMIN": { showMainBranch: true, showBranches: false },
    "ACCOUNT-CREATOR": { showMainBranch: true, showBranches: true },
    "GRADUATE-TRAINEE": { showMainBranch: true, showBranches: true },
  };

  const behavior = selectedRole
    ? roleBehaviors[selectedRole.roleName] || { showMainBranch: false, showBranches: false }
    : { showMainBranch: false, showBranches: false };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await createUser({
        // fullName: values.fullName,
        email: values.email,
        // password: values.password,
        roleId: Number(values.roleId),
        mainBranchId: Number(values.mainBranchId),
        clientId: clientId || Number(localStorage.getItem("clientId")),
        branchIds: values.branchIds
          ? values.branchIds.map((id) => Number(id)).filter((id) => !isNaN(id))
          : [],
      });

      if (response.data) {
        toast.success("User Created");
        userModal.onClose();
      } else if (response.error) {
        // @ts-expect-error
        toast.error(response.error.data.message);
      }
    } catch (error: unknown) {
      // @ts-expect-error
      toast.error(error?.error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

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
            {/* Full Name */}
            {/* <FormField
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
            /> */}
            {/* Email */}
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
            {/* Password */}
            {/* <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} maxLength={30} minLength={8} required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" />
                  </FormControl>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character. <br />
                    <span className="text-red-500">*</span>
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* Role Select */}
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
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles
                        .filter(
                          (item) =>
                            item.roleName !== "SUPER-ADMIN" &&
                            item.roleName !== "HIGH-PROFILE-CLIENT"
                        )
                        .filter((item) => !item.roleName.includes("CRM"))
                        .filter((item) => !item.roleName.includes("VISIT"))
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

            {/* Conditionally render branches */}
            {behavior.showMainBranch && SingleBranchSelect}
            {/* {behavior.showBranches && BranchSelect} */}

            {/* Actions */}
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
