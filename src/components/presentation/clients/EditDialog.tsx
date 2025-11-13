import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Account, IndividualAccount } from "@/features/accounts/accountApiSlice";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateBranchSelect } from "@/components/ui/modals/react-branch-select";
import { useGetBranchesByDistrictQuery } from "@/features/branches/branchApiSlice";
import { Client } from "@/features/client/clientApiSlice";

type SectionType =
  | "contact"
  | "address"
  | "financial"
  | "account"
  | "idfront"
  | "idback"
  | "profile"
  | "passport";

interface EditDialogProps {
  section: SectionType | null;
  isOpen: boolean;
  onClose: () => void;
  account: Account | undefined;
  client: Client | undefined;
  onSave: (updatedData: Partial<Account>, isLast: boolean) => void;
}

const accountSchema = z.object({
  fullName: z.string().optional(),
  surname: z.string().optional(),
  motherName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  occupation: z.string().optional(),
  initialDeposit: z.coerce.number().optional(),
  monthlyIncome: z.coerce.number().optional(),
  sex: z.string().optional(),
  branch: z.string().optional(),
  currency: z.string().optional(),
  accountType: z.string().optional(),
  percentageCompleted: z.number().optional(),
  dateOfBirth: z.string().optional(),
  photo: z.any().optional(),
  signature: z.any().optional(),
  residenceCard: z.any().optional(),
  residenceCardBack: z.any().nullable().optional(),
  passport: z.any().optional(),
  confirmationForm: z.any().optional(),
  formCompleted: z.boolean().optional(),
  allFieldsFilled: z.boolean().optional(),
});

const EditDialog: FC<EditDialogProps> = ({
  section,
  isOpen,
  onClose,
  account,
  client,
  onSave,
}) => {
  const isIndividual = account?.customerType === "INDIVIDUAL";
  const individualAccount = account as IndividualAccount | undefined;

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: isIndividual ? individualAccount : {},
  });

  const { data: branches } = useGetBranchesByDistrictQuery(
    String(client?.district)
  );

  const { SingleBranchSelect } = useUpdateBranchSelect(
    branches ? branches : [],
    form.control
  );

  const onSubmit = (data: Partial<Account>) => {
    onSave(data, false);
    onClose();
  };

  const accountType = [
    {
      id: "1",
      name: "Deposit Account",
    },
    {
      id: "2",
      name: "Fixed Time Deposit Account",
    },
    {
      id: "3",
      name: "Non-Repatriable Birr Account",
    },
    {
      id: "4",
      name: "ECOLFL",
    },
    {
      id: "5",
      name: "Diaspora Wadia Saving Account",
    },
    {
      id: "6",
      name: "Diaspora Mudarabah Saving Account",
    },
    {
      id: "7",
      name: "Diaspora Mudarabah Fixed Time",
    },
  ];

  const renderFields = () => {
    if (!isIndividual) {
      return (
        <div className="py-4 text-center">
          <p>Editing is only available for individual accounts</p>
        </div>
      );
    }

    switch (section) {
      case "contact":
        return (
          <>
            <FormField
              name="fullName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name:</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="surname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Surname:</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">MALE</SelectItem>
                      <SelectItem value="FEMALE">FEMALE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "address":
        return (
          <>
            <FormField
              name="streetAddress"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address:</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City:</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case "financial":
        return (
          <>
            <FormField
              name="occupation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation:</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="initialDeposit"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Deposit:</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="monthlyIncome"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income:</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );

      case "account":
        return (
          <>
            {SingleBranchSelect}
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountType.map((account) => (
                        <SelectItem
                          key={account.id}
                          value={account.id?.toString() || ""}
                        >
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="currency"
              disabled
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency:</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={30} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "idfront":
        return (
          <FormField
            name="residenceCard"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Front:</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] || null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "idback":
        return (
          <FormField
            name="residenceCardBack"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Back:</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] || null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case "profile":
        return (
          <FormField
            name="photo"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo:</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0] || null)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "passport":
        return (
          <div>
            {/* <FormField
              name="passport"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport:</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmationForm"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation Form:</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              name="signature"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Signature:</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Edit {section}</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">{renderFields()}</div>
            {isIndividual && (
              <div className="flex justify-end mt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;