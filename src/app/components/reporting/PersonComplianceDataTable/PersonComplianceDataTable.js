// "use client";
// import React, { useState, useEffect } from "react";
// import { FiFilter, FiDownload } from "react-icons/fi";
// import Pagination from "../../common/pagination/pagination";
// import { getAlerts } from "../../../../../utils/organization/alert/api";
// import { getZones } from "../../../../../utils/organization/zone/api";
// import { getCameras } from "../../../../../utils/organization/camera/api";
// import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";

// const PersonComplianceDataTable = ({ filters }) => {
//   const [data, setData] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [cameras, setCameras] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const rowsPerPage = 5;

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const { dateFrom, dateTo, selectedZones, selectedCameras, selectedPPEs } = filters;
//         const macAddresses = selectedCameras.length > 0
//           ? selectedCameras.map(c => c.deviceMAC)
//           : cameras.map(c => c.deviceMAC);
//         const alertsData = await getAlerts(
//           "PPE",
//           1,
//           100,
//           macAddresses.length > 0 ? macAddresses.join(",") : "",
//           dateFrom,
//           dateTo
//         );
//         const zonesData = await getZones(1, 100);
//         const camerasData = await getCameras(1, 100);

//         setZones(zonesData.zonesData || []);
//         setCameras(camerasData.devicesData || []);

//         const filteredZones = selectedZones.length > 0
//           ? zonesData.zonesData.filter(z => selectedZones.some(sz => sz._id === z._id))
//           : zonesData.zonesData;

//         const processedData = processAlertData(
//           alertsData.AlarmHistoryData || [],
//           filteredZones,
//           camerasData.devicesData || [],
//           selectedPPEs
//         );

//         setData(processedData);
//         setTotalPages(Math.ceil(processedData.length / rowsPerPage));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [filters, cameras]);

//   const processAlertData = (alerts, zones, cameras, selectedPPEs) => {
//     const processedData = [];

//     alerts.forEach(alert => {
//       const { macAddress, alertTypeCounts, recordedAt } = alert;
//       const camera = cameras.find(c => c.deviceMAC === macAddress);
//       const zone = zones.find(z => z.installedDevices.includes(macAddress)) || { zoneName: "Unknown" };

//       Object.entries(alertTypeCounts).forEach(([personId, types]) => {
//         const ppeTypes = Object.keys(types)
//           .filter(typeId => types[typeId] && ALERT_TYPE_MAP[typeId])
//           .map(typeId => ALERT_TYPE_MAP[typeId])
//           .filter(ppeType => selectedPPEs.length === 0 || selectedPPEs.includes(ppeType))
//           .filter(ppeType => ["safety-vest", "helmet", "gloves", "glasses"].includes(ppeType));

//         if (ppeTypes.length > 0) {
//           processedData.push({
//             personId: `Person ${personId}`,
//             zone: zone.zoneName,
//             camera: camera?.deviceName || macAddress,
//             ppeTypes: ppeTypes.join(", ").replace(/-/g, " ").toUpperCase(),
//             alertCount: ppeTypes.length,
//             recordedAt: new Date(recordedAt).toLocaleString(),
//           });
//         }
//       });
//     });

//     return processedData;
//   };

//   const handlePageChange = (newPageIndex) => {
//     setCurrentPage(newPageIndex);
//   };
//     const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);


//   return (
//     <div className="bg-white rounded-lg shadow-sm border p-5 mt-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">Person Compliance Data Table</h2>
//         <div className="flex items-center gap-2">
//           <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
//             <FiFilter className="text-gray-500" /> Filter
//           </button>
//           <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
//             <FiDownload className="text-gray-500" /> Export
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 text-sm text-gray-700">
//           <thead className="bg-gray-50">
//             <tr className="text-left text-gray-600">
//               <th className="px-4 py-2 border-b border-gray-200 font-medium">Person</th>
//               <th className="px-4 py-2 border-b border-gray-200 font-medium">Zone</th>
//               <th className="px-4 py-2 border-b border-gray-200 font-medium">Camera</th>
//               <th className="px-4 py-2 border-b border-gray-200 font-medium">PPE Types Detected</th>
//               <th className="px-4 py-2 border-b border-gray-200 font-medium">Alert Count</th>
//               <th className="px-4 py-2 border-b border-gray-200 font-medium">Recorded At</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-4">Loading...</td>
//               </tr>
//             ) : paginatedData.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-4">No data available</td>
//               </tr>
//             ) : (
//               paginatedData.map((row, index) => (
//                 <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
//                   <td className="px-4 py-3">{row.personId}</td>
//                   <td className="px-4 py-3">{row.zone}</td>
//                   <td className="px-4 py-3">{row.camera}</td>
//                   <td className="px-4 py-3">{row.ppeTypes}</td>
//                   <td className="px-4 py-3 font-medium">{row.alertCount}</td>
//                   <td className="px-4 py-3">{row.recordedAt}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         pageCount={totalPages}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//         totalResults={data.length}
//         resultsPerPage={rowsPerPage}
//       />
//     </div>
//   );
// };

// export default PersonComplianceDataTable;









"use client";
import React, { useState, useEffect } from "react";
import { FiFilter, FiDownload } from "react-icons/fi";
import Pagination from "../../common/pagination/pagination";
import { getAlerts } from "../../../../../utils/organization/alert/api";
import { getZones } from "../../../../../utils/organization/zone/api";
import { getCameras } from "../../../../../utils/organization/camera/api";
import { ALERT_TYPE_MAP } from "../../../../../lib/alertTypes";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa6";

const PersonComplianceDataTable = ({ filters }) => {
  const [data, setData] = useState([]);
  const [zones, setZones] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { dateFrom, dateTo, selectedZones, selectedCameras, selectedPPEs } = filters;
        const macAddresses = selectedCameras.length > 0
          ? selectedCameras.map(c => c.deviceMAC)
          : cameras.map(c => c.deviceMAC);
        const alertsData = await getAlerts(
          "PPE",
          1,
          100,
          macAddresses.length > 0 ? macAddresses.join(",") : "",
          dateFrom,
          dateTo
        );
        const zonesData = await getZones(1, 100);
        const camerasData = await getCameras(1, 100);

        setZones(zonesData.zonesData || []);
        setCameras(camerasData.devicesData || []);

        const filteredZones = selectedZones.length > 0
          ? zonesData.zonesData.filter(z => selectedZones.some(sz => sz._id === z._id))
          : zonesData.zonesData;

        const processedData = processAlertData(
          alertsData.AlarmHistoryData || [],
          filteredZones,
          camerasData.devicesData || [],
          selectedPPEs
        );

        setData(processedData);
        setTotalPages(Math.ceil(processedData.length / rowsPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const processAlertData = (alerts, zones, cameras, selectedPPEs) => {
    const processedData = [];

    alerts.forEach(alert => {
      const { macAddress, alertTypeCounts, recordedAt } = alert;
      const camera = cameras.find(c => c.deviceMAC === macAddress);
      const zone = zones.find(z => z.installedDevices.includes(macAddress)) || { zoneName: "Unknown" };

      Object.entries(alertTypeCounts).forEach(([personId, types]) => {
        const ppeTypes = Object.keys(types)
          .filter(typeId => types[typeId] && ALERT_TYPE_MAP[typeId])
          .map(typeId => ALERT_TYPE_MAP[typeId])
          .filter(ppeType => selectedPPEs.length === 0 || selectedPPEs.includes(ppeType))
          .filter(ppeType => ["safety-vest", "helmet", "gloves", "glasses"].includes(ppeType));

        if (ppeTypes.length > 0) {
          processedData.push({
            personId: `Person ${personId}`,
            zone: zone.zoneName,
            camera: camera?.deviceName || macAddress,
            ppeTypes: ppeTypes.join(", ").replace(/-/g, " ").toUpperCase(),
            alertCount: ppeTypes.length,
            recordedAt: recordedAt,
          });
        }
      });
    });

    return processedData;
  };

  const handlePageChange = (newPageIndex) => {
    setCurrentPage(newPageIndex);
  };

  const handleExportCSV = () => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ['Person', 'Zone', 'Camera', 'PPE Types Detected', 'Alert Count', 'Recorded At'];
    const csvRows = [headers.join(',')];

    data.forEach(row => {
      const values = [
        row.personId,
        row.zone,
        row.camera,
        row.ppeTypes,
        row.alertCount,
        row.recordedAt
      ].map(value => `"${String(value).replace(/"/g, '""')}"`); // Escape quotes and wrap in quotes to handle commas
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'person-compliance-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportXLS = () => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ['Person', 'Zone', 'Camera', 'PPE Types Detected', 'Alert Count', 'Recorded At'];
    let htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"> <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Person Compliance Data</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>
    `;
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    htmlContent += `
            </tr>
          </thead>
          <tbody>
    `;
    data.forEach(row => {
      htmlContent += `
            <tr>
              <td>${row.personId}</td>
              <td>${row.zone}</td>
              <td>${row.camera}</td>
              <td>${row.ppeTypes}</td>
              <td>${row.alertCount}</td>
              <td>${row.recordedAt}</td>
            </tr>
      `;
    });
    htmlContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'person-compliance-data.xls');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Simple text-based export as fallback (not real PDF, but can be printed/saved as PDF)
    const headers = ['Person', 'Zone', 'Camera', 'PPE Types Detected', 'Alert Count', 'Recorded At'];
    let textContent = 'Person Compliance Data\n\n';
    textContent += headers.join('\t') + '\n';
    data.forEach(row => {
      textContent += [
        row.personId,
        row.zone,
        row.camera,
        row.ppeTypes,
        row.alertCount,
        row.recordedAt
      ].join('\t') + '\n';
    });

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'person-compliance-data.txt');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // alert('PDF generation without third-party libraries is complex. Downloaded as TXT for now. Open in browser and print to PDF if needed.');
  };

  const paginatedData = data.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Person Compliance Data Table</h2>
        <div className="flex items-center gap-2">
          {/* <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <FiFilter className="text-gray-500" /> Filter
          </button> */}
          {/* <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 border px-3 py-1.5 bg-green-500 rounded-md text-sm text-green-700 hover:bg-gray-50"
          >
            <FiDownload className="text-gray-500" /> Export CSV
          </button> */}
           <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                          <button 
                            onClick={handleExportPDF}
                            className="bg-red-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto mb-2 md:mb-0"
                          >
                            <FaFilePdf />PDF
                          </button>
                          <button 
                            onClick={handleExportCSV}
                            className="bg-green-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto mb-2 md:mb-0"
                          >
                            <FaFileCsv />CSV
                          </button>
                          <button 
                            onClick={handleExportXLS}
                            className="bg-blue-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto"
                          >
                            <FaFileExcel />XLS
                          </button>
                        </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Person</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Zone</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Camera</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">PPE Types Detected</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Alert Count</th>
              <th className="px-4 py-2 border-b border-gray-200 font-medium">Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading...</td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No data available</td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3">{row.personId}</td>
                  <td className="px-4 py-3">{row.zone}</td>
                  <td className="px-4 py-3">{row.camera}</td>
                  <td className="px-4 py-3">{row.ppeTypes}</td>
                  <td className="px-4 py-3 font-medium">{row.alertCount}</td>
                  <td className="px-4 py-3">{row.recordedAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalResults={data.length}
        resultsPerPage={rowsPerPage}
      />
    </div>
  );
};

export default PersonComplianceDataTable;