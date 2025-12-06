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
  const [updatingId, setUpdatingId] = useState(null); // Row loader

  // ==========================
  // FETCH LEADS
  // ==========================
  const loadData = async () => {
    setLoading(true);

    try {
      const response = await fetchLeads({
        startDate,
        endDate,
        status,
      });

      setData(response?.metaData?.leadInfos || []);
    } catch (err) {
      console.error("Filter API Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data (no filters)
  useEffect(() => {
    loadData();
  }, []);

  // ==========================
  // DOWNLOAD EXCEL
  // ==========================
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

  // ==========================
  // CLIENT SEARCH FILTER
  // ==========================
  const filteredData = data.filter((item) =>
    item?.name?.toLowerCase()?.includes(filterText.toLowerCase())
  );

  // ==========================
  // UPDATE STATUS HANDLER
  // ==========================
  const handleStatusChange = async (id, oldStatus, newStatus) => {
    if (oldStatus === newStatus) return;

    setUpdatingId(id); // show loader in that row

    try {
      const res = await updateLeadStatus(id, newStatus);

      if (res?.code === 0) {
        // success → update local state
        setData((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Status update failed:", error);
      alert("Error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <button
          onClick={handleDownloadExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
        >
          Download Excel
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-lg shadow mb-5 flex flex-wrap gap-4">
        {/* Start Date */}
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 block"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 block"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="border rounded px-3 py-2 block"
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

        {/* Search by Name */}
        <div>
          <label className="text-sm font-medium">Search Name</label>
          <input
            type="text"
            className="border rounded px-3 py-2 block"
            placeholder="Search name..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Apply Filters */}
        <button
          onClick={loadData}
          className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 self-end"
        >
          Apply Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-y-scroll" style={{ maxHeight: "500px" }}>
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
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
                  <td colSpan="10" className="text-center p-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center p-4 text-gray-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 border">{index + 1}</td>
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">{item.mobNumber}</td>
                    <td className="p-3 border">{item.email}</td>
                    <td className="p-3 border">{item.address}</td>
                    <td className="p-3 border">{item.courseName}</td>
                    <td className="p-3 border">{item.educationLevel}</td>
                    <td className="p-3 border">{item.message}</td>
                    <td className="p-3 border">
                      {item.createdAt?.split("T")[0]}
                    </td>

                    {/* STATUS DROPDOWN WITH LOADER */}
                    <td className="p-3 border">
                      {updatingId === item.id ? (
                        <span className="text-blue-600">Updating...</span>
                      ) : (
                        <select
                          className="border px-2 py-1 rounded"
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
























































// import React, { useEffect, useState } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { fetchLeads } from "../../../services/apis/fetchLeads";

// const STATUS_OPTIONS = [
//   "New",
//   "CONTACTED",
//   "COUNSELLED",
//   "APPLIED",
//   "ADMITTED",
//   "NA",
// ];

// export default function Dashboard() {
//   const [data, setData] = useState([]);
//   const [filterText, setFilterText] = useState("");

//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [status, setStatus] = useState("ALL");

//   const [loading, setLoading] = useState(false);

//   // ==========================
//   // FETCH LEADS
//   // ==========================
//   const loadData = async () => {
//     setLoading(true);

//     try {
//       const response = await fetchLeads({
//         startDate,
//         endDate,
//         status,
//       });

//       const leadInfos = response?.metaData?.leadInfos || [];
//       setData(leadInfos);
//     } catch (err) {
//       console.error("Filter API Error:", err);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load data WITHOUT filters on mount → /filter
//   useEffect(() => {
//     loadData();
//   }, []);

//   // ==========================
//   // DOWNLOAD EXCEL
//   // ==========================
//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filteredData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     saveAs(
//       new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       }),
//       "lead_data.xlsx"
//     );
//   };

//   // ==========================
//   // FILTER BY NAME (client-side)
//   // ==========================
//   const filteredData = data.filter((item) =>
//     item?.name?.toLowerCase()?.includes(filterText.toLowerCase())
//   );

//   return (
//     <div className="p-0">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">Dashboard</h1>

//         <button
//           onClick={handleDownloadExcel}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
//         >
//           Download Excel
//         </button>
//       </div>

//       {/* FILTERS */}
//       <div className="bg-white p-4 rounded-lg shadow mb-5 flex flex-wrap gap-4">
//         {/* Start Date */}
//         <div>
//           <label className="text-sm font-medium">Start Date</label>
//           <input
//             type="date"
//             className="border rounded px-3 py-2 block"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>

//         {/* End Date */}
//         <div>
//           <label className="text-sm font-medium">End Date</label>
//           <input
//             type="date"
//             className="border rounded px-3 py-2 block"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>

//         {/* Status Filter */}
//         <div>
//           <label className="text-sm font-medium">Status</label>
//           <select
//             className="border rounded px-3 py-2 block"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             <option value="ALL">All</option>
//             {STATUS_OPTIONS.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Search by Name */}
//         <div>
//           <label className="text-sm font-medium">Search Name</label>
//           <input
//             type="text"
//             className="border rounded px-3 py-2 block"
//             placeholder="Search name..."
//             value={filterText}
//             onChange={(e) => setFilterText(e.target.value)}
//           />
//         </div>

//         {/* Apply Filters */}
//         <button
//           onClick={loadData}
//           className="bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 self-end"
//         >
//           Apply Filters
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="overflow-y-scroll" style={{ maxHeight: "500px" }}>
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 border">Sl No</th>
//                 <th className="p-3 border">Name</th>
//                 <th className="p-3 border">Phone</th>
//                 <th className="p-3 border">Email</th>
//                 <th className="p-3 border">Address</th>
//                 <th className="p-3 border">Course</th>
//                 <th className="p-3 border">Education</th>
//                 <th className="p-3 border">Message</th>
//                 <th className="p-3 border">Date</th>
//                 <th className="p-3 border">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="10" className="text-center p-4 text-gray-500">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="text-center p-4 text-gray-500">
//                     No data found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item, index) => (
//                   <tr key={item.id} className="border-b hover:bg-gray-50">
//                     <td className="p-3 border">{index + 1}</td>
//                     <td className="p-3 border">{item.name}</td>
//                     <td className="p-3 border">{item.mobNumber}</td>
//                     <td className="p-3 border">{item.email}</td>
//                     <td className="p-3 border">{item.address}</td>
//                     <td className="p-3 border">{item.courseName}</td>
//                     <td className="p-3 border">{item.educationLevel}</td>
//                     <td className="p-3 border">{item.message}</td>

//                     <td className="p-3 border">
//                       {item.createdAt?.split("T")[0]}
//                     </td>

//                     {/* Editable status dropdown */}
//                     <td className="p-3 border">
//                       <select
//                         className="border px-2 py-1 rounded"
//                         defaultValue={item.status}
//                       >
//                         {STATUS_OPTIONS.map((s) => (
//                           <option key={s} value={s}>
//                             {s}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }





































// // import React, { useState } from "react";
// // import { studentData } from "../../../constants/data";
// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";

// // export default function Dashboard() {
// //   const [filterText, setFilterText] = useState("");

// //   // Filter logic
// //   const filteredData = studentData.filter((item) =>
// //     item.name.toLowerCase().includes(filterText.toLowerCase())
// //   );

// //   // Download Excel
// //   const handleDownloadExcel = () => {
// //     const worksheet = XLSX.utils.json_to_sheet(filteredData);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

// //     const excelBuffer = XLSX.write(workbook, {
// //       bookType: "xlsx",
// //       type: "array",
// //     });

// //     const data = new Blob([excelBuffer], {
// //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //     });

// //     saveAs(data, "student_data.xlsx");
// //   };

// //   return (
// //     <div className="p-6">
// //       {/* Page Header */}
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

// //         <div className="flex gap-3">
// //           {/* Filter Input */}
// //           <input
// //             type="text"
// //             placeholder="Filter by name..."
// //             value={filterText}
// //             onChange={(e) => setFilterText(e.target.value)}
// //             className="px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //           />

// //           {/* Download Excel */}
// //           <button
// //             onClick={handleDownloadExcel}
// //             className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
// //           >
// //             Download Excel
// //           </button>
// //         </div>
// //       </div>

// //       {/* Table */}
// //       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
// //         <table className="w-full border-collapse">
// //           <thead className="bg-gray-100 text-gray-700">
// //             <tr>
// //               <th className="p-3 text-left border">Sl No</th>
// //               <th className="p-3 text-left border">Name</th>
// //               <th className="p-3 text-left border">Date</th>
// //               <th className="p-3 text-left border">Phone</th>
// //               <th className="p-3 text-left border">Email</th>
// //               <th className="p-3 text-left border">Address</th>
// //               <th className="p-3 text-left border">Course</th>
// //               <th className="p-3 text-left border">Education</th>
// //               <th className="p-3 text-left border">Message</th>
// //               <th className="p-3 text-left border">status</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {filteredData.map((item, index) => (
// //               <tr key={index} className="border-b hover:bg-gray-50">
// //                 <td className="p-3 border">{index + 1}</td>
// //                 <td className="p-3 border">{item.name}</td>
// //                 <td className="p-3 border">{item.date}</td>
// //                 <td className="p-3 border">{item.phone}</td>
// //                 <td className="p-3 border">{item.email}</td>
// //                 <td className="p-3 border">{item.address}</td>
// //                 <td className="p-3 border">{item.course}</td>
// //                 <td className="p-3 border">{item.education}</td>
// //                 <td className="p-3 border">{item.message}</td>
// //                 <td className="p-3 border">{item.status}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         {/* Empty State */}
// //         {filteredData.length === 0 && (
// //           <p className="text-center p-4 text-gray-500">No results found.</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
