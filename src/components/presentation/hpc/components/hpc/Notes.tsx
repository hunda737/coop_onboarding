import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { notes as initialNotes } from "./notesData";
import { Button } from "@/components/ui/button";

const Notes = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-600 mb-2">
          NOTES ({initialNotes.length})
        </h3>
        <Button size="sm" className="my-1">
          <Plus size={12} />
        </Button>
      </div>
      <div className="overflow-x-auto border rounded-md h-72 overflow-y-scroll custom-scrollbar">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">#</th>
              <th className="px-4 py-2 whitespace-nowrap">Title</th>
              <th className="px-4 py-2 whitespace-nowrap">Category</th>
              <th className="px-4 py-2 whitespace-nowrap">Created By</th>
              <th className="px-4 py-2 whitespace-nowrap">Created At</th>
              <th className="px-4 py-2 whitespace-nowrap">Tags</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {initialNotes.map((note, index) => (
              <>
                {/* Main Row */}
                <tr
                  key={note.noteId}
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
                  <td className="px-4 py-2 whitespace-nowrap">{note.title}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {note.category}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {note.createdBy}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {note.tags?.join(", ") || "No Tags"}
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRow === index && (
                  <tr
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td colSpan={6} className="px-4 py-2">
                      <div className="text-gray-700 text-xs">
                        <strong>Content: </strong>
                        {note.content || "No content available."}
                      </div>
                      {note.lastUpdated && (
                        <div className="text-gray-500 text-xs mt-1">
                          <strong>Last Updated: </strong>
                          {new Date(note.lastUpdated).toLocaleDateString()}
                        </div>
                      )}
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

export default Notes;
