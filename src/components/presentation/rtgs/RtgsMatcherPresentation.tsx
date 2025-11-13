import { useGetRTGSRequestsQuery } from "@/features/rtgs/rtgsApiSlice";
import { cn } from "@/lib/utils";

const RtgsMatcherPresentation = () => {
  const { data: rtgsRequests = [] } = useGetRTGSRequestsQuery();

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Group RTGS Requests by bank and match Incoming with Outgoing
  const matchedTransactions = rtgsRequests.reduce((matches, request) => {
    const { bank, type } = request;
  
    const normalizedType = type.toLowerCase() as "incoming" | "outgoing";
  
    // Ensure a match entry exists for this bank
    if (!matches[bank]) {
      matches[bank] = { incoming: [], outgoing: [] };
    }
  
    matches[bank][normalizedType].push(request);
  
    return matches;
  }, {} as Record<string, { incoming: typeof rtgsRequests; outgoing: typeof rtgsRequests }>);
  

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">RTGS Matcher Table</h1>

      {Object.keys(matchedTransactions).length > 0 ? (
        <table
          className={cn(
            "table w-full border-collapse text-xs",
            "border border-gray-200"
          )}
        >
          <thead className={cn("bg-gray-100 text-left")}>
            <tr>
              <th className="p-4 border border-gray-200">Bank</th>
              <th className="p-4 border border-gray-200">
                Incoming Transactions
              </th>
              <th className="p-4 border border-gray-200">
                Outgoing Transactions
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(matchedTransactions).map(
              ([bank, { incoming, outgoing }], index) => {
                // Calculate total amounts
                const incomingTotal = incoming.reduce(
                  (sum, trx) => sum + trx.amount,
                  0
                );
                const outgoingTotal = outgoing.reduce(
                  (sum, trx) => sum + trx.amount,
                  0
                );

                // Determine row background color
                const rowBgColor =
                  incomingTotal === outgoingTotal
                    ? "bg-cyan-100"
                    : incomingTotal > outgoingTotal
                    ? "bg-green-100"
                    : "bg-red-100";

                return (
                  <tr key={index} className={cn("", rowBgColor)}>
                    <td className="p-4 border text-base border-gray-200">{bank}</td>
                    <td className="p-4 border border-gray-200">
                      {incoming.length > 0 ? (
                        incoming.map((trx) => (
                          <div key={trx.id} className="mb-2">
                            <div>Branch: {trx.branch}</div>
                            <div>Amount: {formatNumber(trx.amount)}</div>
                            <div>Contact: {trx.contact}</div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">
                          No Incoming
                        </span>
                      )}
                      <div className="mt-2 font-bold">
                        Total: {formatNumber(incomingTotal)}
                      </div>
                    </td>
                    <td className="p-4 border border-gray-200">
                      {outgoing.length > 0 ? (
                        outgoing.map((trx) => (
                          <div key={trx.id} className="mb-2">
                            <div>Branch: {trx.branch}</div>
                            <div>Amount: {formatNumber(trx.amount)}</div>
                            <div>Contact: {trx.contact}</div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">
                          No Outgoing
                        </span>
                      )}
                      <div className="mt-2 font-bold">
                        Total: {formatNumber(outgoingTotal)}
                      </div>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">
          No RTGS transactions available.
        </p>
      )}
    </div>
  );
};

export default RtgsMatcherPresentation;
