import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAllLeadsQuery } from "@/features/lead/leadApiSlice";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useLeadModal } from "@/hooks/use-lead-modal";
import { LeadModal } from "@/components/ui/modals/lead-modal";
import { useParams } from "react-router-dom";

const Leads = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const { data: leadsData } = useGetAllLeadsQuery();
  const leadModal = useLeadModal();
  const params = useParams();

  const toggleExpand = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleStatusChange = (
    index: number,
    newStatus: "New" | "Contacted" | "Qualified" | "Disqualified"
  ) => {
    console.log(index, newStatus);
    // setLeads(updatedLeads);
  };

  return (
    <div className="mt-4">
      <LeadModal customerId={Number(params.customerId)} />
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">
          LEADS ({leadsData?.length})
        </h3>
        <Button size="sm" className="my-1" onClick={leadModal.onOpen}>
          <Plus size={12} />
        </Button>
      </div>
      <div className="overflow-x-auto border rounded-md h-56 overflow-y-scroll custom-scrollbar">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">#</th>
              <th className="px-4 py-2 whitespace-nowrap">Name</th>
              <th className="px-4 py-2 whitespace-nowrap">Contact</th>
              <th className="px-4 py-2 whitespace-nowrap">Source</th>
              <th className="px-4 py-2 whitespace-nowrap">Interest</th>
              <th className="px-4 py-2 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {leadsData?.map((lead, index) => (
              <>
                {/* Main Row */}
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
                  <td className="px-4 py-2 whitespace-nowrap">{lead.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lead.phone || lead.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{lead.source}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {lead.interest}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    <select
                      className="border rounded-md px-2 py-1 text-xs"
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(
                          index,
                          e.target.value as
                          | "New"
                          | "Contacted"
                          | "Qualified"
                          | "Disqualified"
                        )
                      }
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Disqualified">Disqualified</option>
                    </select>
                  </td>
                </tr>

                {expandedRow === index && (
                  <tr
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td colSpan={7} className="px-4 py-2">
                      <div className="text-gray-700 text-xs">
                        <strong>Notes: </strong>
                        {lead.notes || "No additional notes provided."}
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

export default Leads;
