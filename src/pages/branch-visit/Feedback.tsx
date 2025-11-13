import React, { useEffect, useRef, useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff } from "lucide-react";

// Zod schema for validation
const feedbackSchema = z.object({
  branchId: z.string().min(1, "Please select a branch."),
  names: z.string().optional(),
  notes: z.string().optional(),
  transcribedData: z.string().optional(),
  voice: z.boolean().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const FeedbackPage: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      branchId: "",
      names: "",
      notes: "",
      transcribedData: "",
      voice: false,
    },
  });

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-US";
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const speechToText = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(speechToText);
        form.setValue("transcribedData", speechToText);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [form]);

  const startListening = async () => {
    const recognition = recognitionRef.current;
    if (recognition) recognition.start();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      setAudioBlob(audioBlob);
    };

    mediaRecorder.start();
    setIsListening(true);
  };

  const stopListening = () => {
    const recognition = recognitionRef.current;
    if (recognition) recognition.stop();

    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) mediaRecorder.stop();

    setIsListening(false);
  };

  const onSubmit = async (values: FeedbackFormValues) => {
    const formData = new FormData();
    formData.append("branchId", values.branchId);
    formData.append("names", values.names || "");
    formData.append("notes", values.notes || "");
    formData.append("transcribedData", values.transcribedData || "");
    if (audioBlob) formData.append("voice", audioBlob, "feedback.wav");

    await fetch("/api/feedback", {
      method: "POST",
      body: formData,
    });

    // console.log("Feedback submitted!");
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Feedback Page</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Branch Selection */}
          <FormField
            name="branchId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue=""
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="branch1">Branch 1</SelectItem>
                    <SelectItem value="branch2">Branch 2</SelectItem>
                    <SelectItem value="branch3">Branch 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Names */}
          <FormField
            name="names"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Names (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter names" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes */}
          <FormField
            name="notes"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Voice Toggle */}
          <FormField
            name="voice"
            control={form.control}
            render={() => (
              <FormItem>
                <FormLabel>Record Feedback (Optional)</FormLabel>
                <Button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`flex items-center gap-2 ${isListening ? "bg-red-500" : "bg-blue-500"
                    }`}
                >
                  {isListening ? <MicOff /> : <Mic />}
                  {isListening ? "Stop Recording" : "Start Recording"}
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Transcribed Data */}
          <FormField
            name="transcribedData"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transcribed Data (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    rows={8}
                    placeholder="Your transcribed data will appear here..."
                    value={transcript}
                    onChange={(e) => {
                      setTranscript(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="reset" variant="outline">
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FeedbackPage;
