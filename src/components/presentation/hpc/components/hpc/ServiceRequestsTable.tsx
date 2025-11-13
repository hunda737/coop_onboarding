import { serviceRequests } from "./serviceData";

export const ServiceRequestsTable = () => {
  return (
    <div className="mt-4">
      <h3 className="text-xs font-semibold text-gray-600 mb-2">
        SERVICE REQUESTS ({serviceRequests.length})
      </h3>
      <div className="overflow-x-auto border rounded-md h-60 overflow-y-scroll custom-scrollbar">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">Created By</th>
              <th className="px-4 py-2 whitespace-nowrap">Service Request</th>
              <th className="px-4 py-2 whitespace-nowrap">Created On</th>
              <th className="px-4 py-2 whitespace-nowrap">Code</th>
              <th className="px-4 py-2 whitespace-nowrap">Product Name</th>
              <th className="px-4 py-2 whitespace-nowrap">Request Type</th>
              <th className="px-4 py-2 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {serviceRequests.map((request, index) => (
              <tr
                key={index}
                className={`h-8 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  {request.createdBy}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-blue-600 hover:underline cursor-pointer">
                  {request.requestNumber}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(request.createdOn)?.toISOString().split("T")[0]}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {request.productCode}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {request.productName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {request.requestType}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
