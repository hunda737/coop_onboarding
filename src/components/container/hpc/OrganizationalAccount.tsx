import React, { useState } from "react";
import OrganizationPresentation from "@/components/presentation/hpc/OrganizationalAccountPresentation";
import {
  useCreateOrganizationMutation,
  useCreateLinkMutation,
  useGetRegisteredAccountsQuery,
  useExtendExpiryMutation,
} from "@/features/Organization/organizationApiSlice";
import { useToast } from "@/hooks/use-toast";
import { X, ChevronDown, ChevronUp, RefreshCw, ArrowLeft } from "lucide-react";

interface FormMember {
  fullName: string;
  email: string;
  phoneNumber: string;
}



type SortKey = "companyName" | "customerName" | "expiryTime";

const OrganizationContainer: React.FC = () => {
  const { toast } = useToast();
  const [createOrganization] = useCreateOrganizationMutation();
  const [createLink] = useCreateLinkMutation();
  const [extendExpiry] = useExtendExpiryMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [showRegisteredOrgs, setShowRegisteredOrgs] = useState(false);
  const [extendingToken, setExtendingToken] = useState<string | null>(null);
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);

  const {
    data: registeredAccounts = [],
    isLoading: isLoadingRegistered,
    isFetching: isRefetchingRegistered,
    refetch: refetchRegisteredAccounts,
  } = useGetRegisteredAccountsQuery(undefined, {
    skip: !showRegisteredOrgs,
  });

  const handleSubmit = async (companyName: string, members: FormMember[]): Promise<void> => {
    setIsLoading(true);
    setSuccessMessage("");
    setLinks([]);

    try {
      const apiData = {
        companyName: companyName.trim(),
        phoneNumber: members[0]?.phoneNumber.trim() || "",
        personalInfo: members.map((m) => ({
          fullName: m.fullName.trim(),
          email: m.email.trim(),
          phone: m.phoneNumber.trim(),
        })),
      };

      const orgResponse = await createOrganization(apiData).unwrap();
      setSuccessMessage(
        `Organization "${orgResponse.companyName}" created with ID ${orgResponse.id}`
      );

      toast({
        title: "Success",
        description: `Organization ${orgResponse.companyName} created!`,
        variant: "default",
      });

      const linkResponse = await createLink({
        accountId: orgResponse.id,
        expirationHours: 48,
      }).unwrap();

      setLinks(linkResponse);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Creation failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtendExpiry = async (token: string, hours: number) => {
    setExtendingToken(token);
    try {
      const response = await extendExpiry({ token, additionalHours: hours }).unwrap();

      toast({
        title: "Success",
        description: response.message || "Expiry extended successfully",
        variant: "default",
      });

      await refetchRegisteredAccounts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to extend expiry",
        variant: "destructive",
      });
    } finally {
      setExtendingToken(null);
    }
  };

  const toggleExpandAccount = (accountId: string) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId);
  };

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAccounts = React.useMemo(() => {
    if (!sortConfig) return registeredAccounts;

    return [...registeredAccounts].sort((a, b) => {
      // For expiryTime, compare Date objects
      if (sortConfig.key === "expiryTime") {
        const dateA = new Date(a.expiryTime);
        const dateB = new Date(b.expiryTime);
        if (dateA < dateB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      }

      // For string keys
      const valA = a[sortConfig.key].toLowerCase();
      const valB = b[sortConfig.key].toLowerCase();

      if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [registeredAccounts, sortConfig]);

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="inline ml-1 h-4 w-4" /> : 
      <ChevronDown className="inline ml-1 h-4 w-4" />;
  };

  return (
    <div className="relative min-h-screen">
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${showRegisteredOrgs ? 'opacity-0 scale-95 h-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
        {/* Fancy Top-Right Button */}
        <div className="absolute top-1 right-1 z-10">
          <button
            onClick={() => setShowRegisteredOrgs(true)}
            style={{
              background: "linear-gradient(to right, #fff,)",
            }}
            className="text-gray px-3 py-2 "
          >
           Registered Accounts
          </button>
        </div>

        {/* Main Form */}
        <OrganizationPresentation onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 p-4 border border-green-400 rounded bg-green-50 text-green-800 shadow-sm max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold mb-2">Organization Created Successfully</h2>
            <p>
              Organization{" "}
              <span className="font-semibold">
                {successMessage.match(/"(.*)"/)?.[1] || ""}
              </span>{" "}
              created with ID{" "}
              <span className="font-semibold">
                {successMessage.match(/ID (\d+)/)?.[1] || ""}
              </span>.
            </p>
          </div>
        )}

        {/* Registration Links */}
        {links.length > 0 && (
          <div className="mt-6 p-6 border border-gray-300 rounded shadow max-w-4xl mx-auto bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Created Registration Links
            </h3>
            <ul className="space-y-4">
              {links.map((link) => {
                const registrationUrl = `https://yourdomain.com/register?token=${link.token}`;
                return (
                  <li key={link.id} className="p-4 border rounded hover:shadow-md transition-shadow">
                    <p>
                      <strong>Customer:</strong> {link.customerName}{" "}
                      <span className="text-gray-600">
                        ({link.customerEmail})
                      </span>
                    </p>
                    <p>
                      <strong>Expires at:</strong>{" "}
                      {new Date(link.expiryTime).toLocaleString()}
                    </p>
                    <p className="mt-2">
                      <a
                        href={registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {registrationUrl}
                      </a>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Registered Organizations Panel */}
      <div className={`fixed inset-0 bg-white z-50 overflow-y-auto transition-all duration-300 ${showRegisteredOrgs ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header with title and buttons */}
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-4 z-10">
            <button
              onClick={() => setShowRegisteredOrgs(false)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span className="font-medium">Back to Form</span>
            </button>
            
            <h3 className="text-2xl font-bold text-gray-800 text-center flex-grow">
              Registered Organizations
            </h3>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => refetchRegisteredAccounts()}
                className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded transition"
                disabled={isRefetchingRegistered}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefetchingRegistered ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowRegisteredOrgs(false)}
                className="text-gray-400 hover:text-red-500 transition p-2"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {isLoadingRegistered ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : registeredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No registered organizations found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded border border-gray-300 shadow">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 border-b border-gray-200 cursor-pointer" onClick={() => requestSort("companyName")}>
                      Company {getSortIcon("companyName")}
                    </th>
                    <th className="text-left p-3 border-b border-gray-200 cursor-pointer" onClick={() => requestSort("customerName")}>
                      Customer {getSortIcon("customerName")}
                    </th>
                    <th className="text-left p-3 border-b border-gray-200 cursor-pointer" onClick={() => requestSort("expiryTime")}>
                      Expiry Time {getSortIcon("expiryTime")}
                    </th>
                    <th className="p-3 border-b border-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAccounts.map((account) => (
                    <React.Fragment key={account.token}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpandAccount(account.token)}>
                        <td className="p-3 border-b border-gray-200">{account.companyName}</td>
                        <td className="p-3 border-b border-gray-200">{account.customerName}</td>
                        <td className="p-3 border-b border-gray-200">{new Date(account.expiryTime).toLocaleString()}</td>
                        <td className="p-3 border-b border-gray-200">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleExtendExpiry(account.token, 24);
                            }}
                            disabled={extendingToken === account.token}
                            className="text-blue-600 hover:underline disabled:text-gray-400"
                          >
                            {extendingToken === account.token ? "Extending..." : "Extend 24h"}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Row for Registered Devices */}
                      {expandedAccount === account.token && (
                        <tr className="bg-gray-100">
                          <td colSpan={4} className="p-4">
                            <div>
                              <h4 className="font-semibold mb-2">Registered Devices</h4>
                              {account.registeredDevices.length === 0 ? (
                                <p className="text-gray-500">No devices registered.</p>
                              ) : (
                                <table className="w-full border-collapse border border-gray-300 rounded">
                                  <thead>
                                    <tr className="bg-gray-200">
                                      <th className="p-2 border border-gray-300 text-left">Device ID</th>
                                      <th className="p-2 border border-gray-300 text-left">Device Name</th>
                                      <th className="p-2 border border-gray-300 text-left">Status</th>
                                      <th className="p-2 border border-gray-300 text-left">Last Used</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {account.registeredDevices.map((device) => (
                                      <tr key={device.id} className="hover:bg-gray-50">
                                        <td className="p-2 border border-gray-300">{device.deviceId}</td>
                                        <td className="p-2 border border-gray-300">{device.deviceName}</td>
                                        <td className="p-2 border border-gray-300">{device.status}</td>
                                        <td className="p-2 border border-gray-300">{new Date(device.lastUsed).toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationContainer;
