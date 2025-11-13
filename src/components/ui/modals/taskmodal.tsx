import React, { useState } from "react";
import { z } from "zod";
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
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTaskMutation } from "@/features/tasks/tasksApiSlice";
import { useGetHighProfileCustomersQuery } from "@/features/hpc/hpcApiSlice";
import { Textarea } from "../textarea";

// ✅ Corrected Zod schema
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  taskDate: z.string().min(1, "Task date is required"),
  taskTime: z.string().min(1, "Task time is required"),
  status: z.enum(["TO_DO", "IN_PROGRESS", "COMPLETE"]),
  reminder: z.boolean().optional(),
  highProfileCustomerId: z.number().min(1, "Customer is required"),
});

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [createTask] = useCreateTaskMutation();
  const { data: highProfileCustomers, isLoading: isLoadingCustomers } = useGetHighProfileCustomersQuery();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      taskDate: "",
      taskTime: "",
      status: "TO_DO",
      reminder: false,
      highProfileCustomerId: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      setLoading(true);
      const [hour, minute] = values.taskTime.split(":").map(Number);
  
      const payload = {
        ...values,
        description: values.description ?? "", // ensure string
        address: values.address ?? "",         // ensure string
        reminder: values.reminder ?? false,    // ensure boolean
        taskTime: {
          hour,
          minute,
          second: 0,
          nano: 0,
        },
        highProfileCustomerId: Number(values.highProfileCustomerId),
      };
  
      await createTask(payload).unwrap();
      toast.success("Task created successfully!");
      onClose();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Modal
      title="New Task"
      description="Add a new task"
      isOpen={open}
      onClose={onClose}
    >
      <div className="py-6 pb-4 w-full max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      {...field}
                      rows={4}
                      className="resize-none w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="taskDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="taskTime"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TO_DO">TO_DO</SelectItem>
                          <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                          <SelectItem value="COMPLETE">COMPLETE</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="highProfileCustomerId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>High Profile Customer</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={String(field.value)}
                        disabled={isLoadingCustomers || loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {highProfileCustomers?.map((customer) => (
                            <SelectItem key={customer.id} value={String(customer.id)}>
                              {customer.accHolderName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="reminder"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      name={field.name}
                      ref={field.ref}
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-cyan-500">
                Create Task
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
