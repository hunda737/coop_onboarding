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
import { useAgentModal } from "@/hooks/use-user-modal";
import {
  Branch,
  useGetBranchesByDistrictQuery,
} from "@/features/branches/branchApiSlice";
import { useBranchSelect } from "./react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { Client } from "@/features/client/clientApiSlice";
import {
  useCreateAgentMutation,
  useUpdateAgentMutation,
} from "@/features/agents/agentApiSlice";
import { useSingleBranchSelect } from "./react-single-select";

const formSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().default(""),
  password: z.string().default(""),
  branchIds: z.array(z.string()),
  status: z.string(),
  mainBranchId: z.string(),
  id: z.number().optional(),
});

type UserModalProps = {
  client: Client | undefined;
  isEdit?: boolean;
  // existingData?: any;
  existingData?: {
    fullName?: string;
    email?: string;
    branchIds?: string[];
    mainBranchId?: number;
    status?: string;
    id?: number;
  };
};

export const AgentModal: FC<UserModalProps> = ({
  client,
  isEdit = false,
  existingData,
}) => {
  const userModal = useAgentModal();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [updateAgent] = useUpdateAgentMutation();
  const [createAgent] = useCreateAgentMutation();

  const { data: res } = useGetBranchesByDistrictQuery(String(client?.district));
  useEffect(() => {
    const fetchBranch = async () => {
      // const res = await getAllBranches();
      const data = res instanceof Array ? res : [];
      setBranches(data);
    };
    fetchBranch();
  }, [res]);

  const UserStatus = ["ACTIVE", "BANNED", "PENDING"];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      branchIds: [],
      status: "",
      mainBranchId: "",
      id: 0,
    },
  });

  // Use `reset` to set form values based on `existingData`
  useEffect(() => {
    if (isEdit && existingData != null) {
      form.reset({
        fullName: existingData.fullName || "",
        email: existingData.email || "",
        password: "", // Optionally don't prefill password
        branchIds: existingData.branchIds || [],
        mainBranchId: String(existingData.mainBranchId) || undefined,
        status: existingData.status || "PENDING",
        id: 0,
      });
    }
  }, [isEdit, existingData, form]);

  const { BranchSelect } = useBranchSelect(branches, form.control);
  const { SingleBranchSelect } = useSingleBranchSelect(
    branches ? branches : [],
    form.control
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (isEdit) {
        const response = await updateAgent({
          branchIds: values.branchIds
            ? values.branchIds
              .map((id: string) => Number(id))
              .filter((id) => !isNaN(id))
            : undefined,
          mainBranchId: Number(values.mainBranchId),
          status: values.status,
          userId: existingData?.id || 0,
        });
        if (response.data) {
          toast.success("Agent Updated");
          window.location.reload();
        }
      } else {
        const response = await createAgent({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          mainBranchId: Number(values.mainBranchId),
          branchIds: values.branchIds
            ? values.branchIds
              .map((id: string) => Number(id))
              .filter((id) => !isNaN(id))
            : undefined,
        });
        if (response.data) {
          toast.success("Agent Created");
        }
      }
      userModal.onClose();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || "Something went wrong.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Agent" : "Add Agent"}
      description={isEdit ? "Edit the agent details" : "Add a new agent"}
      isOpen={userModal.isOpen}
      onClose={userModal.onClose}
    >
      <div className="py-2 pb-4 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {!isEdit && (
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="fullname" {...field} maxLength={20} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!isEdit && (
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
            )}
            {!isEdit && (
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {SingleBranchSelect}
            {BranchSelect}
            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status:</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value?.toString() || ""}
                      defaultValue={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {UserStatus.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            disabled={status === "PENDING"}
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                type="button"
                onClick={userModal.onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-cyan-500">
                {isEdit ? "Update" : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
