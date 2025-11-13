import { useState } from "react";
import { Button } from "@/components/ui/button";
import { opportunities as initialOpportunities } from "@/features/opportunity/opportunityApiSlice";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

const Opportunities = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [opportunities, setOpportunities] = useState(initialOpportunities);

  const toggleExpand = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleStageChange = (
    index: number,
    newStage: "Prospecting" | "Negotiation" | "Won" | "Lost"
  ) => {
    const updatedOpportunities = opportunities.map((opportunity, i) =>
      i === index ? { ...opportunity, stage: newStage } : opportunity
    );
    setOpportunities(updatedOpportunities);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">
          OPPORTUNITIES ({opportunities.length})
        </h3>
        <Button size="sm" className="my-1">
          <Plus size={12} />
        </Button>
      </div>
      <div className="overflow-x-auto border rounded-md h-56 overflow-y-scroll custom-scrollbar">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">#</th>
              <th className="px-4 py-2 whitespace-nowrap">Lead</th>
              <th className="px-4 py-2 whitespace-nowrap">Product</th>
              <th className="px-4 py-2 whitespace-nowrap">Value</th>
              <th className="px-4 py-2 whitespace-nowrap">Probability (%)</th>
              <th className="px-4 py-2 whitespace-nowrap">Assigned To</th>
              <th className="px-4 py-2 whitespace-nowrap">Stage</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {opportunities.map((opportunity, index) => (
              <>
                {/* Main Row */}
                <tr
                  key={index}
                  className={`h-8 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
                    {opportunity.leadId}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {opportunity.product}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    ${opportunity.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {opportunity.probability}%
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {opportunity.assignedTo || "N/A"}
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap">
                    <select
                      className="border rounded-md px-2 py-1 text-xs"
                      value={opportunity.stage}
                      onChange={(e) =>
                        handleStageChange(
                          index,
                          e.target.value as
                            | "Prospecting"
                            | "Negotiation"
                            | "Won"
                            | "Lost"
                        )
                      }
                    >
                      <option value="Prospecting">Prospecting</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                </tr>
                {/* Expanded Row */}
                {expandedRow === index && (
                  <tr
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td colSpan={7} className="px-4 py-2">
                      <div className="text-gray-700 text-xs">
                        <strong>Notes: </strong>
                        {opportunity.notes || "No additional notes provided."}
                      </div>
                      <div className="text-gray-700 text-xs">
                        <strong>Expected Close Date: </strong>
                        {opportunity.expectedCloseDate
                          ? new Date(
                              opportunity.expectedCloseDate
                            ).toLocaleDateString()
                          : "N/A"}
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

export default Opportunities;
