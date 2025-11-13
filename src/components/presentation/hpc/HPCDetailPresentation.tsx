import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HighProfileCustomerResponse } from "@/features/hpc/hpcApiSlice";
import { Mail, Phone } from "lucide-react";
import { EngagementTabs } from "./components/hpc/EngagementTabs";
import { MainTabs } from "./components/hpc/MainTabs";
import { Separator } from "@/components/ui/separator";
import PredictionGraph from "../../charts/PredictionGraph";

type HPCDetailPresentationProps = {
  hpc: HighProfileCustomerResponse | undefined;
};

const HPCDetailPresentation: React.FC<HPCDetailPresentationProps> = ({
  hpc,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-0.5">
          <div className="border rounded-xl shadow bg-white p-4">
            <h2 className="pb-3 text-cyan-500 text-sm font-semibold">
              PROFILE INFORMATION
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 font-semibold text-sm">
                  Date of Birth
                </span>
                <span className="text-gray-500 text-xs">
                  {hpc?.birthDate &&
                    new Date(hpc?.birthDate).toISOString().split("T")[0]}{" "}
                  ddd
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 font-semibold text-sm">
                  Marital Status
                </span>
                <span className="text-gray-500 text-xs">
                  {hpc?.maritalStatus}
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 font-semibold text-sm">
                  Nationality
                </span>
                <span className="text-gray-500 text-xs">
                  {hpc?.nationality}
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 font-semibold text-sm">
                  Gender
                </span>
                <span className="text-gray-500 text-xs">{hpc?.gender}</span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 font-semibold text-sm">
                  CR Name
                </span>
                <span className="text-gray-500 text-xs">
                  {hpc?.assignedCRMName}
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 font-semibold text-sm">
                  Registered Date
                </span>
                <span className="text-gray-500 text-xs">
                  {hpc?.createdBy &&
                    new Date(hpc?.createdBy).toISOString().split("T")[0]}
                </span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 text-sm font-semibold">
                  Address
                </span>
                <span className="text-gray-500 text-xs">{hpc?.address}</span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 text-sm font-semibold">TIN</span>
                <span className="text-gray-500 text-xs">{hpc?.tinNumber}</span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 text-sm font-semibold">
                  Phone
                </span>
                <span className="text-gray-500 text-xs">{hpc?.phone}</span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 text-sm font-semibold">
                  Email
                </span>
                <span className="text-gray-500 text-xs">{hpc?.email}</span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 text-sm font-semibold">
                  With Coop
                </span>
                <span className="text-gray-500 text-xs">5 YEARS</span>
              </div>
              <div className="flex flex-col space-y-0.5">
                <span className="text-gray-600 text-sm font-semibold">
                  Business Started
                </span>
                <span className="text-gray-500 text-xs">2014-12-21</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded-xl shadow bg-white p-2 px-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Avatar>
                <AvatarImage
                  width={100}
                  src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
                  alt="@shadcn"
                />
                <AvatarFallback>HP</AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <h4 className="text-sm font-semibold leading-none whitespace-nowrap">
                  {hpc?.accHolderName}
                </h4>
                <div className="flex items-center space-x-1">
                  <Phone className="border p-1 rounded bg-gray-100 h-6 w-6" />
                  <Mail className="border p-1 rounded bg-gray-100 h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="text-orange-500 pl-4 text-sm">
              <span>300M Birr transactions expected this month</span>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="p-2">
            <div className="grid gap-4">
              <PredictionGraph />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 container mx-auto p-2 border rounded-xl shadow bg-white">
          <MainTabs />
        </div>
        <div className="container mx-auto p-2 border rounded-xl shadow bg-white">
          <EngagementTabs />
        </div>
      </div>
    </div>
  );
};

export default HPCDetailPresentation;
