import { FC, useState } from "react";
import {
  IndividualAccount,
  JointAccount,
  OrganizationalAccount,
  useUpdateIndividualAccountMutation,
  useUpdateJointAccountMutation,
  useUpdateOrganizationalAccountMutation,
} from "@/features/accounts/accountApiSlice";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit2Icon, HomeIcon, MailIcon, PhoneIcon } from "lucide-react";
import EditDialog from "./EditDialog";
import ImageSection from "./ImageSection";
import ImageGroup from "./ImageGroup";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Client } from "@/features/client/clientApiSlice";

type InactiveAccountDetailPresentationProps = {
  account: IndividualAccount | JointAccount | OrganizationalAccount | undefined;
  client: Client | undefined;
};

type SectionType =
  | "contact"
  | "address"
  | "financial"
  | "account"
  | "idfront"
  | "idback"
  | "profile"
  | "passport";

const InactiveAccountDetailPresentation: FC<
  InactiveAccountDetailPresentationProps
> = ({ account, client }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionType | null>(
    null
  );
  const navigate = useNavigate();

  // Use appropriate mutation based on account type
  const [updateIndividualAccount] = useUpdateIndividualAccountMutation();
  const [updateJointAccount] = useUpdateJointAccountMutation();
  const [updateOrganizationalAccount] = useUpdateOrganizationalAccountMutation();

  const handleEdit = (section: SectionType) => {
    setSelectedSection(section);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSection(null);
  };

  // Utility function to organize individual account data for API call
  const organizeIndividualAccountData = (updatedData: Partial<IndividualAccount>) => {
    const completeData = { ...updatedData } as IndividualAccount;
    completeData.phone = account?.phone || "";
    const customerInfoFields = [
      'fullName', 'surname', 'motherName', 'email', 'phone', 'dateOfBirth',
      'country', 'state', 'city', 'streetAddress', 'zipCode', 'occupation',
      'title', 'maritalStatus', 'postCode', 'zoneSubCity', 'houseNo',
      'documentName', 'issueAuthority', 'issueDate', 'expiryDate',
      'employeeStatus', 'legalId', 'salary', 'sector', 'industry',
      'employerName', 'monthlyIncome', 'sex', 'photo', 'residenceCard', 'signature', 'residenceCardBack'
    ];

    const formData = new FormData();
    Object.entries(completeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const fieldName = customerInfoFields.includes(key) ? `customerInfo.${key}` : key;
        if (value instanceof File) {
          formData.append(fieldName, value);
        } else if (typeof value === 'object') {
          formData.append(fieldName, JSON.stringify(value));
        } else {
          formData.append(fieldName, String(value));
        }
      }
    });
    return formData;
  };

  const handleSaveChanges = async (
    updatedData: Partial<IndividualAccount | JointAccount | OrganizationalAccount>,
    isLast: boolean
  ) => {
    if (!account) return;

    let response;
    try {
      switch (account.customerType) {
        case "INDIVIDUAL":
          const formData = organizeIndividualAccountData(updatedData as Partial<IndividualAccount>);
          response = await updateIndividualAccount({
            id: String(account.id),
            formData,
          });
          break;
        case "JOINT":
          response = await updateJointAccount({
            id: String(account.id),
            updatedData: updatedData as Partial<JointAccount>,
          });
          break;
        case "ORGANIZATION":
          response = await updateOrganizationalAccount({
            id: String(account.id),
            updatedData: updatedData as Partial<OrganizationalAccount>,
          });
          break;
      }

      // Handle response with proper type checks
      if ('data' in response && response.data) {
        const accountData = response.data as IndividualAccount | JointAccount | OrganizationalAccount;

        if (accountData.status === "INITIAL" && isLast) {
          toast.error("Please complete all required fields before proceeding");
        } else {
          toast.success("Account updated successfully.");
        }

        if (isLast && accountData.status !== "INITIAL") {
          navigate(-1);
        }
      }
    } catch (error) {
      toast.error("Failed to update account");
    } finally {
      handleCloseDialog();
    }
  };

  // Helper functions for type-safe property access
  const getFullName = () => {
    if (!account) return "";
    if (account.customerType === "INDIVIDUAL") return account.fullName;
    if (account.customerType === "ORGANIZATION") return account.companyName;
    return account.customersInfo[0]?.fullName || "";
  };

  const getPhoto = () => {
    if (!account) return "";
    if (account.customerType === "INDIVIDUAL") return account.photo;
    return "";
  };

  const getSurname = () => {
    if (!account) return "";
    if (account.customerType === "INDIVIDUAL") return account.surname;
    return account.customersInfo[0]?.fullName || "";
  };

  const getEmail = () => {
    if (!account) return "";
    if (account.customerType === "INDIVIDUAL") return account.emailVerified;
    if (account.customerType === "ORGANIZATION") return account.companyEmail;
    return account.customersInfo[0]?.email || "";
  };

  const getStreetAddress = () => {
    if (!account) return "";
    if (account.customerType === "INDIVIDUAL") return account.streetAddress;
    if (account.customerType === "ORGANIZATION") return account.companyResidence;
    return account.customersInfo[0]?.streetAddress || "";
  };

  const getCity = () => {
    if (!account) return "";
    if (account.customerType === "INDIVIDUAL") return account.city;
    if (account.customerType === "ORGANIZATION") return account.companySubCity;
    return account.customersInfo[0]?.city || "";
  };

  // Similar helper functions for other properties...

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full rounded-xl shadow-lg bg-white">
        {/* Header Section */}
        <CardHeader className="flex flex-row items-center justify-between space-x-6 p-6 border-b">
          <div className="flex space-x-6 items-center">
            <div className="relative">
              <div className="absolute top-1/3 left-1/3">
                <Camera
                  size={20}
                  className="cursor-pointer text-primary"
                  onClick={() => handleEdit("profile")}
                />
              </div>
              <img
                src={getPhoto()}
                alt=""
                className="w-16 h-16 rounded-lg shadow-md"
              />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {getFullName()}
              </CardTitle>
              <Badge
                variant={
                  account?.status === "PENDING" ? "secondary" : "default"
                }
                className="mt-2"
              >
                {account?.status}
              </Badge>
            </div>
          </div>
          <div className="text-2xl text-primary">{account?.accountType}</div>
        </CardHeader>

        {/* Contact & Address Section */}
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Information
              </CardTitle>
              <Edit2Icon
                size={16}
                className="cursor-pointer text-primary"
                onClick={() => handleEdit("contact")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-bold text-gray-900">Full Name:</p>
              <p className="text-gray-700">{getFullName()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="font-bold text-gray-900">Surname:</p>
              <p className="text-gray-700">{getSurname()}</p>
            </div>
            {account?.customerType === "INDIVIDUAL" && (
              <div className="flex items-center space-x-2">
                <p className="font-bold text-gray-900">Gender:</p>
                <p className="text-gray-700">{account.sex}</p>
              </div>
            )}
            <div className="flex">
              <div className="flex items-center space-x-2">
                <MailIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-700">{getEmail()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <p className="text-gray-700">{account?.phone}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Address
              </CardTitle>
              <Edit2Icon
                size={16}
                className="cursor-pointer text-primary"
                onClick={() => handleEdit("address")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5 text-gray-400" />
              <p className="text-gray-700">{getStreetAddress()}</p>
            </div>
            <p className="text-gray-700">
              {getCity()}, {account?.customerType === "INDIVIDUAL" ? account.state : ""} {account?.customerType === "INDIVIDUAL" ? account.zipCode : ""}
            </p>
            <p className="text-gray-500">{account?.customerType === "INDIVIDUAL" ? account.country : ""}</p>
            <Badge
              variant={account?.emailVerified ? "default" : "destructive"}
              className="mt-3"
            >
              Email Verified: {account?.emailVerified ? "Yes" : "No"}
            </Badge>
          </div>
          {account?.customerType === "INDIVIDUAL" && (
            <div className="space-y-2">
              <ImageSection
                title="ID Front"
                imageSrc={account.residenceCard || ""}
                altText="Residence Card Front"
                onEdit={() => handleEdit("idfront")}
              />
            </div>
          )}
        </CardContent>

        {/* Financial Information Section */}
        <CardContent className="grid border-t grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Financial Information
              </CardTitle>
              <Edit2Icon
                size={16}
                className="cursor-pointer text-primary"
                onClick={() => handleEdit("financial")}
              />
            </div>
            <p className="text-gray-700">
              <span className="font-bold text-gray-900">Occupation</span>:{" "}
              {account?.currency} {account?.customerType === "INDIVIDUAL" ? account.occupation : ""}
            </p>
            <p className="text-gray-700">
              <span className="font-bold text-gray-900">Initial Deposit</span>:{" "}
              {account?.currency} {Number(account?.initialDeposit).toFixed(2)}
            </p>
            <p className="text-gray-700">
              <span className="font-bold text-gray-900">Monthly Income</span>:{" "}
              {account?.currency} {Number(account?.customerType === "INDIVIDUAL" ? account.monthlyIncome : 0).toFixed(2)}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Account Details
              </CardTitle>
              <Edit2Icon
                size={16}
                className="cursor-pointer text-primary"
                onClick={() => handleEdit("account")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-gray-700">
                <span className="font-bold text-gray-900">Branch: </span>
                {account?.branch}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-gray-700">
                <span className="font-bold text-gray-900">Account Type:</span>
                {"  "}
                {account?.accountType}
              </p>
            </div>
            <p className="text-gray-700">
              <span className="font-bold text-gray-900">Added by:</span>
              {"  "}
              {account?.customerType === "INDIVIDUAL" && account.addedByFullName}
              ({account?.customerType === "INDIVIDUAL" && account.addedByRole})
            </p>
            <p className="text-gray-500">
              <span className="font-bold text-gray-900">Created At: </span>
              {format(
                new Date(account?.createdAt || "10-10-2022"),
                "MM/dd/yyyy"
              )}
            </p>
          </div>
          {account?.customerType === "INDIVIDUAL" && (
            <div className="space-y-2">
              <ImageSection
                title="ID Back"
                imageSrc={account.residenceCardBack || ""}
                altText="Residence Card Back"
                onEdit={() => handleEdit("idback")}
              />
            </div>
          )}
        </CardContent>

        {account?.customerType === "INDIVIDUAL" && (
          <CardContent className="p-6 border-t">
            <ImageGroup
              title="Signature"
              images={[
                // { src: account.legalId || "", alt: "Passport" },
                // {
                //   src: account.documentName|| "",
                //   alt: "Confirmation Form",
                // },
                { src: account.signature || "", alt: "Signature" },
              ]}
              onEdit={() => handleEdit("passport")}
            />
          </CardContent>
        )}
        <EditDialog
          section={selectedSection}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          account={account}
          client={client}
          onSave={handleSaveChanges}
        />
        <div className="flex items-center justify-end mt-4 space-x-4 p-5">
          <Button size="sm" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSaveChanges({ status: "COMPLETED" }, true);
            }}
            size="sm"
          >
            Move
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InactiveAccountDetailPresentation;