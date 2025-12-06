import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchLeads } from "../../../services/apis/fetchLeads";
import { updateLeadStatus } from "../../../services/apis/updateLeadStatus";

const STATUS_OPTIONS = [
  "New",
  "CONTACTED",
  "COUNSELLED",
  "APPLIED",
  "ADMITTED",
  "NA",
];

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetchLeads({ startDate, endDate, status });
      setData(response?.metaData?.leadInfos || []);
    } catch (err) {
      console.error("Filter API Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "lead_data.xlsx"
    );
  };

  const filteredData = data.filter((item) =>
    item?.name?.toLowerCase()?.includes(filterText.toLowerCase())
  );

  const handleStatusChange = async (id, oldStatus, newStatus) => {
    if (oldStatus === newStatus) return;

    setUpdatingId(id);
    try {
      const res = await updateLeadStatus(id, newStatus);

      if (res?.code === 0) {
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      alert("Error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Modern status UI styles
  const getStatusColor = (s) => {
    switch (s) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "CONTACTED":
        return "bg-yellow-100 text-yellow-700";
      case "COUNSELLED":
        return "bg-purple-100 text-purple-700";
      case "APPLIED":
        return "bg-orange-100 text-orange-700";
      case "ADMITTED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>

        <button
          onClick={handleDownloadExcel}
          className="px-5 py-2 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 shadow-md"
        >
          Download Excel
        </button>
      </div>

      {/* FILTERS CARD */}
      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200 mb-8">
        <div className="flex flex-wrap gap-6">

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              className="border rounded-lg px-3 py-2 mt-1 shadow-sm text-gray-700"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className="border rounded-lg px-3 py-2 mt-1 shadow-sm text-gray-700"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              className="border rounded-lg px-3 py-2 mt-1 shadow-sm text-gray-700"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ALL">All</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Search Name</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 mt-1 shadow-sm"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>

          <button
            onClick={loadData}
            className="px-5 py-2 h-fit self-end rounded-xl text-white bg-green-600 hover:bg-green-700 shadow"
          >
            Apply Filters
          </button>

           <button
    onClick={() => {
      setStartDate("");
      setEndDate("");
      setStatus("ALL");
      setFilterText("");
      loadData();
    }}
    className="px-5 py-2 h-fit self-end rounded-xl text-white bg-red-600 hover:bg-green-700 shadow"
  >
    Reset
  </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-y-auto" style={{ maxHeight: "500px" }}>
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr className="text-gray-700">
                <th className="p-3 border">Sl No</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Address</th>
                <th className="p-3 border">Course</th>
                <th className="p-3 border">Education</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Created Date</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">{item.mobNumber}</td>
                    <td className="p-3 border">{item.email}</td>
                    <td className="p-3 border">{item.address}</td>
                    <td className="p-3 border">{item.courseName}</td>
                    <td className="p-3 border">{item.educationLevel}</td>
                    <td className="p-3 border">{item.message}</td>
                    <td className="p-3 border">{item.createdAt?.split("T")[0]}</td>

                    {/* Status Modern UI */}
                    <td className="p-3 border">
                      {updatingId === item.id ? (
                        <span className="text-blue-600">Updating...</span>
                      ) : (
                        <select
                          className={`border px-2 py-1 rounded-lg font-medium shadow-sm ${getStatusColor(
                            item.status
                          )}`}
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(
                              item.id,
                              item.status,
                              e.target.value
                            )
                          }
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
