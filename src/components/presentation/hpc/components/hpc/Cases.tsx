import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAllCasesQuery } from "@/features/cases/caseApiSlice";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useCaseModal } from "@/hooks/use-case-modal";
import { CaseModal } from "@/components/ui/modals/case-modal";
import { useParams } from "react-router-dom";

const Cases = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const { data: casesData } = useGetAllCasesQuery();
  const caseModal = useCaseModal();
  const params = useParams();
  // console.log(casesData);

  const toggleExpand = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleStatusChange = (
    index: number,
    newStatus: "Open" | "In Progress" | "Closed"
  ) => {
    // const indexs = index;
    // const newStatuss = newStatus;
    console.log(index, newStatus);
    // setCases(updatedCases);
  };

  return (
    <div className="mt-4">
      <CaseModal customerId={Number(params.customerId)} />
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">
          CASES ({casesData?.length})
        </h3>
        <Button size="sm" className="my-1" onClick={caseModal.onOpen}>
          <Plus size={12} />
        </Button>
      </div>
      <div className="overflow-x-auto border rounded-md h-56 overflow-y-scroll custom-scrollbar">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs64 text-gray-700">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">#</th>
              <th className="px-4 py-2 whitespace-nowrap">Title</th>
              <th className="px-4 py-2 whitespace-nowrap">Priority</th>
              <th className="px-4 py-2 whitespace-nowrap">CR Assigned</th>
              <th className="px-4 py-2 whitespace-nowrap">Due Date</th>
              <th className="px-4 py-2 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {casesData?.map((request, index) => (
              <>
                <tr
                  key={index}
                  className={`h-8 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button onClick={() => toggleExpand(index)}>
                      {expandedRow === index ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {request.title}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {request.priority}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {request.assignedToUserName || "N/A"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {request.dueDate || "N/A"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    <select
                      className="border rounded-md px-2 py-1 text-xs"
                      value={request.status}
                      onChange={(e) =>
                        handleStatusChange(
                          index,
                          e.target.value as "Open" | "In Progress" | "Closed"
                        )
                      }
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN-PROGRESS">In Progress</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                </tr>

                {expandedRow === index && (
                  <tr
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td colSpan={7} className="px-4 py-2">
                      <div className="text-gray-700 text-xs">
                        <strong>Description: </strong>
                        {request.description || "No description provided."}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cases;
