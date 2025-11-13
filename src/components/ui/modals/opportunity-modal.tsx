// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Modal } from "@/components/ui/modal";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { FC, useState } from "react";
// import { toast } from "react-hot-toast";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../select";
// import { Button } from "../button";
// import { useCreateOpportunityMutation } from "@/features/opportunity/opportunityApiSlice";
// import { useGetLeadsQuery } from "@/features/opportunity/opportunityApiSlice";
// import { useOpportunityModal } from "@/hooks/use-opportunity-modal";

// const formSchema = z.object({
//   leadId: z.string().min(1, "Lead is required"),
//   product: z.string().min(1, "Product is required"),
//   value: z.number().positive("Value must be a positive number"),
//   stage: z.enum(["Prospecting", "Negotiation", "Won", "Lost"]),
//   probability: z
//     .number()
//     .min(0, "Probability cannot be less than 0%")
//     .max(100, "Probability cannot exceed 100%"),
//   expectedCloseDate: z.string().optional(),
//   notes: z.string().optional(),
// });

// type OpportunityModalProps = {
//   clientId: number;
// };

// export const OpportunityModal: FC<OpportunityModalProps> = ({ clientId }) => {
//   const [loading, setLoading] = useState(false);
//   const { data: leads } = useGetLeadsQuery(clientId); // Fetch leads for the client
//   const [createOpportunity] = useCreateOpportunityMutation();
//   const opportunityModal = useOpportunityModal();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       leadId: "",
//       product: "",
//       value: 0,
//       stage: "Prospecting",
//       probability: 0,
//       expectedCloseDate: "",
//       notes: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       setLoading(true);

//       const response = await createOpportunity({
//         leadId: values.leadId,
//         product: values.product,
//         value: values.value,
//         stage: values.stage,
//         probability: values.probability,
//         expectedCloseDate: values.expectedCloseDate || null,
//         notes: values.notes || "",
//         clientId,
//       });

//       if (response.data) {
//         toast.success("Opportunity Created");
//       }
//     } catch (error: unknown) {
//       toast.error(
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         error?.data?.message ||
//           "Failed to create opportunity. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       title="Add Opportunity"
//       description="Create a new opportunity"
//       isOpen={opportunityModal.isOpen}
//       onClose={opportunityModal.onClose}
//     >
//       <div className="py-2 pb-4 w-full">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             {/* Lead Selection */}
//             <FormField
//               name="leadId"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Lead:</FormLabel>
//                   <Select
//                     disabled={loading}
//                     onValueChange={field.onChange}
//                     value={field.value || ""}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select lead" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {leads?.map((lead) => (
//                         <SelectItem key={lead.id} value={lead.id}>
//                           {lead.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Product */}
//             <FormField
//               name="product"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product:</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Product or service" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Value */}
//             <FormField
//               name="value"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Value:</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="Deal value" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Stage */}
//             <FormField
//               name="stage"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Stage:</FormLabel>
//                   <Select
//                     disabled={loading}
//                     onValueChange={field.onChange}
//                     value={field.value || ""}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select stage" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="Prospecting">Prospecting</SelectItem>
//                       <SelectItem value="Negotiation">Negotiation</SelectItem>
//                       <SelectItem value="Won">Won</SelectItem>
//                       <SelectItem value="Lost">Lost</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Probability */}
//             <FormField
//               name="probability"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Probability (%):</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Chance of success (0-100%)"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Expected Close Date */}
//             <FormField
//               name="expectedCloseDate"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Expected Close Date:</FormLabel>
//                   <FormControl>
//                     <Input type="date" placeholder="Select a date" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Notes */}
//             <FormField
//               name="notes"
//               control={form.control}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Notes:</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Additional notes (optional)"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="pt-6 space-x-2 flex items-center justify-end w-full">
//               <Button variant="outline" type="button" onClick={() => {}}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading} className="bg-cyan-500">
//                 Create
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </Modal>
//   );
// };
