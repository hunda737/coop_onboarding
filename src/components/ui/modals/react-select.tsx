import Select, { MultiValue } from "react-select";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel } from "../form";
import { Branch } from "@/features/branches/branchApiSlice";

// Define the option type for react-select
type OptionType = {
  label: string;
  value: string;
};

// Custom hook to manage branch selection
export const useBranchSelect = (branches: Branch[], control: Control<any>) => {
  // Map branches to react-select options
  const branchOptions = branches.map((branch) => ({
    label: branch.companyName || "Unknown Branch",
    value: branch.id?.toString() || "",
  }));

  return {
    branchOptions,
    BranchSelect: (
      <FormField
        name="branchIds"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Branch:</FormLabel>
            <Select
              {...field}
              isMulti // Enable multi-select
              options={branchOptions}
              value={branchOptions.filter((option) =>
                field.value?.includes(option.value)
              )} // Set value for multi-select
              onChange={
                (options: MultiValue<OptionType>) =>
                  field.onChange(options.map((option) => option.value)) // Handle array of selected values
              }
            />
          </FormItem>
        )}
      />
    ),
  };
};
