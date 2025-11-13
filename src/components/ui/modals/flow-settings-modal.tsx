import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../button";
import { useFlowSettingsModal } from "@/hooks/use-flow-settings-modal";
import {
  useCreateFlowSettingMutation,
  useUpdateFlowSettingMutation,
} from "@/features/account-flow-settings/accountFlowSettingsApiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Enum values
const ACCOUNT_ORIGINS = [
  "DIASPORA_WEB",
  "FAYDA_PASS",
  "SMART_BRANCH",
  "APP_FAYDA",
  "APP_MANUAL",
  "ORGANIZATION_LINK",
] as const;

const DOCUMENT_TYPES = [
  "KEBELEID",
  "EMPLOYEEID",
  "PASSPORT",
  "STUDENTID",
  "DRIVING",
  "NATIONALID",
] as const;

const CUSTOMER_TYPES = ["INDIVIDUAL", "ORGANIZATION", "JOINT"] as const;

const TARGET_STAGES = ["PENDING", "APPROVED", "UNSETTLED", "AUTHORIZED"] as const;

const formSchema = z
  .object({
    accountOrigin: z.string().nullable().optional(),
    documentStatus: z.string().nullable().optional(),
    customerType: z.string().nullable().optional(),
    targetStage: z.enum(TARGET_STAGES),
    matchAllOrigins: z.boolean().default(false),
    matchAllDocuments: z.boolean().default(false),
    matchAllCustomerTypes: z.boolean().default(false),
    active: z.boolean().default(true),
    priority: z.coerce.number().min(0).max(999),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      // Cannot have both specific value and match all
      if (data.accountOrigin && data.matchAllOrigins) return false;
      if (data.documentStatus && data.matchAllDocuments) return false;
      if (data.customerType && data.matchAllCustomerTypes) return false;
      return true;
    },
    {
      message: "Cannot select both a specific value and 'Match All' for the same field",
    }
  )
  .refine(
    (data) => {
      // At least one condition must be set
      const hasOrigin = data.accountOrigin || data.matchAllOrigins;
      const hasDocument = data.documentStatus || data.matchAllDocuments;
      const hasCustomerType = data.customerType || data.matchAllCustomerTypes;
      return hasOrigin || hasDocument || hasCustomerType;
    },
    {
      message: "At least one condition must be specified",
    }
  );

export const FlowSettingsModal = () => {
  const flowSettingsModal = useFlowSettingsModal();
  const [loading, setLoading] = useState(false);
  const [createFlowSetting] = useCreateFlowSettingMutation();
  const [updateFlowSetting] = useUpdateFlowSettingMutation();

  const isEditing = !!flowSettingsModal.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountOrigin: null,
      documentStatus: null,
      customerType: null,
      targetStage: "PENDING",
      matchAllOrigins: false,
      matchAllDocuments: false,
      matchAllCustomerTypes: false,
      active: true,
      priority: 0,
      description: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (flowSettingsModal.data) {
      form.reset({
        accountOrigin: flowSettingsModal.data.accountOrigin,
        documentStatus: flowSettingsModal.data.documentStatus,
        customerType: flowSettingsModal.data.customerType,
        targetStage: flowSettingsModal.data.targetStage as "PENDING" | "APPROVED" | "UNSETTLED" | "AUTHORIZED",
        matchAllOrigins: flowSettingsModal.data.matchAllOrigins,
        matchAllDocuments: flowSettingsModal.data.matchAllDocuments,
        matchAllCustomerTypes: flowSettingsModal.data.matchAllCustomerTypes,
        active: flowSettingsModal.data.active,
        priority: flowSettingsModal.data.priority,
        description: flowSettingsModal.data.description,
      });
    } else {
      form.reset({
        accountOrigin: null,
        documentStatus: null,
        customerType: null,
        targetStage: "PENDING",
        matchAllOrigins: false,
        matchAllDocuments: false,
        matchAllCustomerTypes: false,
        active: true,
        priority: 0,
        description: "",
      });
    }
  }, [flowSettingsModal.data, form]);

  // Watch for changes to clear specific values when match all is checked
  const matchAllOrigins = form.watch("matchAllOrigins");
  const matchAllDocuments = form.watch("matchAllDocuments");
  const matchAllCustomerTypes = form.watch("matchAllCustomerTypes");

  useEffect(() => {
    if (matchAllOrigins) {
      form.setValue("accountOrigin", null);
    }
  }, [matchAllOrigins, form]);

  useEffect(() => {
    if (matchAllDocuments) {
      form.setValue("documentStatus", null);
    }
  }, [matchAllDocuments, form]);

  useEffect(() => {
    if (matchAllCustomerTypes) {
      form.setValue("customerType", null);
    }
  }, [matchAllCustomerTypes, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // Clean up null values
      const cleanedValues = {
        ...values,
        accountOrigin: values.matchAllOrigins ? null : values.accountOrigin,
        documentStatus: values.matchAllDocuments ? null : values.documentStatus,
        customerType: values.matchAllCustomerTypes ? null : values.customerType,
      };

      if (isEditing) {
        await updateFlowSetting({
          id: flowSettingsModal.data!.id,
          data: cleanedValues,
        }).unwrap();
        toast.success("Flow setting updated successfully");
      } else {
        await createFlowSetting(cleanedValues).unwrap();
        toast.success("Flow setting created successfully");
      }

      form.reset();
      flowSettingsModal.onClose();
    } catch (error: unknown) {
      // @ts-expect-error error type
      toast.error(error?.data?.message || "Failed to save flow setting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Flow Setting" : "Create Flow Setting"}
      description="Configure automated routing rules for account approval workflows"
      isOpen={flowSettingsModal.isOpen}
      onClose={flowSettingsModal.onClose}
    >
      <div className="py-2 pb-4 w-full max-h-[70vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Origin */}
            <FormField
              name="accountOrigin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Origin</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === "ALL") {
                        form.setValue("matchAllOrigins", true);
                        form.setValue("accountOrigin", null);
                      } else {
                        form.setValue("matchAllOrigins", false);
                        form.setValue("accountOrigin", value);
                      }
                    }}
                    value={matchAllOrigins ? "ALL" : (field.value || "")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account origin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">
                        <span className="font-medium">All Origins</span>
                      </SelectItem>
                      {ACCOUNT_ORIGINS.map((origin) => (
                        <SelectItem key={origin} value={origin}>
                          {origin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Type */}
            <FormField
              name="documentStatus"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === "ALL") {
                        form.setValue("matchAllDocuments", true);
                        form.setValue("documentStatus", null);
                      } else {
                        form.setValue("matchAllDocuments", false);
                        form.setValue("documentStatus", value);
                      }
                    }}
                    value={matchAllDocuments ? "ALL" : (field.value || "")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">
                        <span className="font-medium">All Documents</span>
                      </SelectItem>
                      {DOCUMENT_TYPES.map((doc) => (
                        <SelectItem key={doc} value={doc}>
                          {doc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Customer Type */}
            <FormField
              name="customerType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value === "ALL") {
                        form.setValue("matchAllCustomerTypes", true);
                        form.setValue("customerType", null);
                      } else {
                        form.setValue("matchAllCustomerTypes", false);
                        form.setValue("customerType", value);
                      }
                    }}
                    value={matchAllCustomerTypes ? "ALL" : (field.value || "")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">
                        <span className="font-medium">All Customer Types</span>
                      </SelectItem>
                      {CUSTOMER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Stage */}
            <FormField
              name="targetStage"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Target Stage *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="UNSETTLED" />
                        </FormControl>
                        <FormLabel className="font-normal">UNSETTLED</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="PENDING" />
                        </FormControl>
                        <FormLabel className="font-normal">PENDING</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="AUTHORIZED" />
                        </FormControl>
                        <FormLabel className="font-normal">AUTHORIZED</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="APPROVED" />
                        </FormControl>
                        <FormLabel className="font-normal">APPROVED</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              name="priority"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority (0-999) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min={0}
                      max={999}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Higher priority rules are evaluated first. High (&gt;500), Medium
                    (100-500), Low (&lt;100)
                  </FormDescription>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description of this rule..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              name="active"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Enable this rule immediately after creation
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                type="button"
                onClick={flowSettingsModal.onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-cyan-500">
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

