import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Calendar } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { Account } from "@/features/accounts/accountApiSlice";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

interface PreviewProps {
  account: Account | undefined;
}

// Type Guards
const hasPhoto = (account: any): account is { photo: string } => !!account?.photo;
const hasFullName = (account: any): account is { fullName: string } => !!account?.fullName;
const hasEmail = (account: any): account is { email: string } => !!account?.email;
const hasMonthlyIncome = (account: any): account is { monthlyIncome: number } =>
  typeof account?.monthlyIncome === "number";
const hasInitialDeposit = (account: any): account is { initialDeposit: number } =>
  typeof account?.initialDeposit === "number";
const hasPhone = (account: any): account is { phone: string } => !!account?.phone;

const callScripts = {
  greeting: "Hello, this is [Your Name] calling from [Bank Name].",
  purpose:
    "We're reaching out regarding your inactive account to assist with reactivation.",
  followUp:
    "Would you be available to discuss your options, or is there a convenient time for a follow-up call?",
  closing:
    "Thank you for your time! Please let us know if you have any questions.",
};

const InactiveAccountDetails: React.FC<PreviewProps> = ({ account }) => {
  const navigate = useNavigate();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [callResponseModalOpen, setCallResponseModalOpen] = useState(false);
  const [smsMessage, setSmsMessage] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [customerResponse, setCustomerResponse] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [pastChats, setPastChats] = useState<
    { date: string; response: string }[]
  >([]);

  const handleSendSms = () => setSmsModalOpen(true);
  const confirmSendSms = () => {
    toast.success("SMS sent: " + smsMessage);
    setSmsMessage("");
    setSmsModalOpen(false);
  };

  const handleScheduleCall = () => setCallResponseModalOpen(true);
  const confirmCallResponse = () => {
    toast.success(`Call Status: ${callStatus} - Response: ${customerResponse}`);
    setPastChats((prev) => [
      ...prev,
      { date: new Date().toLocaleString(), response: customerResponse },
    ]);
    setCallStatus("");
    setCustomerResponse("");
    setCallResponseModalOpen(false);
  };

  const scheduleCallMeeting = () => {
    if (scheduledDate) {
      toast.success(`Call scheduled for: ${scheduledDate.toLocaleString()}`);
      setScheduledDate(null);
      setScheduleModalOpen(false);
    } else {
      toast.error("Please select a date and time.");
    }
  };

  return (
    <div className="container">
      <div className="w-full mx-auto bg-white p-5 border rounded-lg shadow">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold text-cyan-600">
            {account?.accountType || (
              <span className="text-red-400">Not Filled</span>
            )}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="w-full col-span-1 md:col-span-2">
            <div className="grid grid-cols-2 gap-8 bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex flex-col items-center">
                <img
                  src={hasPhoto(account) ? account.photo : ""}
                  alt="Profile Photo"
                  className="rounded-full border mb-6"
                  width={150}
                  height={150}
                />
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {hasFullName(account) ? account.fullName : (
                    <span className="text-red-400">Not Filled</span>
                  )}
                </h1>
                <p className="text-gray-600 mb-2">
                  {hasEmail(account) ? account.email : (
                    <span className="text-red-400">Not Filled</span>
                  )}
                </p>
                <p className="text-gray-600">
                  Phone:{" "}
                  {hasPhone(account) ? account.phone : (
                    <span className="text-red-400">Not Filled</span>
                  )}
                </p>
              </div>
              <div className="space-y-3">
                <InfoRow label="Account Number" value="1022200133177" />
                <InfoRow label="Branch" value="1004103417" />
                <InfoRow label="Customer ID" value="Finfine Branch" />
                <InfoRow label="Display Name" value="YARED MELESE TEFERA" />
                <InfoRow label="Product Name" value="Saving Account" />
                <InfoRow label="Account Status" value="Inactive" />
                <InfoRow label="Customer Type" value="PRIMARY" />
                <InfoRow label="Town Country" value="ADAMA" />
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Financial Information
              </h2>
              <div className="space-y-4">
                <InfoRow
                  label="Initial Deposit"
                  value={
                    hasInitialDeposit(account)
                      ? `ETB ${account.initialDeposit.toFixed(2)}`
                      : "Not Filled"
                  }
                />
                <InfoRow
                  label="Available Balance"
                  value={
                    hasMonthlyIncome(account)
                      ? `ETB ${account.monthlyIncome.toFixed(2)}`
                      : "Not Filled"
                  }
                />
              </div>
            </div>
          </div>

          {/* Past Chats */}
          <div className="w-full border rounded-xl p-5 h-[32rem] overflow-y-scroll">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Past Chats
            </h2>
            {pastChats.length === 0 ? (
              <p className="text-gray-500">No past chats yet.</p>
            ) : (
              <ul className="space-y-4">
                {pastChats.map((chat, index) => (
                  <li key={index} className="bg-gray-100 p-4 rounded-lg shadow">
                    <p className="text-gray-700"><strong>Date:</strong> {chat.date}</p>
                    <p className="text-gray-700"><strong>Response:</strong> {chat.response}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end mt-8 space-x-4 border-t pt-6">
          <Button size="sm" onClick={() => navigate(-1)}>Cancel</Button>
          <Button size="sm" onClick={handleSendSms}><MessageSquare className="mr-2 h-4 w-4" />Send SMS</Button>
          <Button size="sm" onClick={() => setScheduleModalOpen(true)}><Calendar className="mr-2 h-4 w-4" />Schedule Call</Button>
          <Button size="sm" onClick={handleScheduleCall}><Phone className="mr-2 h-4 w-4" />Make a Call</Button>
        </div>

        {/* Modals */}
        {smsModalOpen && (
          <Modal title="Send SMS" onClose={() => setSmsModalOpen(false)} onConfirm={confirmSendSms}>
            <textarea className="w-full h-40 border border-gray-300 p-2 rounded-lg" value={smsMessage} onChange={(e) => setSmsMessage(e.target.value)} />
          </Modal>
        )}

        {scheduleModalOpen && (
          <Modal title="Schedule a Call Meeting" onClose={() => setScheduleModalOpen(false)} onConfirm={scheduleCallMeeting}>
            <DatePicker
              selected={scheduledDate}
              onChange={(date: Date | null) => setScheduledDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className="w-full border border-gray-300 p-2 rounded-lg"
              placeholderText="Select date and time"
            />
          </Modal>
        )}

        {callResponseModalOpen && (
          <Modal title="Call Response" onClose={() => setCallResponseModalOpen(false)} onConfirm={confirmCallResponse}>
            <div className="bg-gray-200 p-4 rounded-lg mb-4">
              {Object.values(callScripts).map((line, i) => (
                <div key={i} className="mb-2 text-gray-700">{line}</div>
              ))}
            </div>
            <input
              type="text"
              placeholder="Call Status"
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
              value={callStatus}
              onChange={(e) => setCallStatus(e.target.value)}
            />
            <textarea
              className="w-full h-40 border border-gray-300 p-2 rounded-lg"
              placeholder="Customer Response"
              value={customerResponse}
              onChange={(e) => setCustomerResponse(e.target.value)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default InactiveAccountDetails;

// Reusable Components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-gray-700">
    <span className="font-bold">{label}:</span>
    <span>{value}</span>
  </div>
);

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}> = ({ title, onClose, onConfirm, children }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h3 className="text-lg font-semibold text-cyan-600 mb-4">{title}</h3>
      {children}
      <div className="flex items-center justify-end mt-4 space-x-4">
        <Button size="sm" onClick={onClose}>Cancel</Button>
        <Button size="sm" onClick={onConfirm}>Confirm</Button>
      </div>
    </div>
  </div>
);
