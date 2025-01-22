"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import DetailKontrakModal from "./DetailKontrakModal";

export interface ReturnItem {
  application_no: string;
  contract_no: string;
  application_date: string;
  customer_name: string;
  address: string;
  customer_type: string;
  outlet: string;
  dealer: string;
  merk_objek: string;
  model_object: string;
  request_return: string;
  reason: string;
  return_request_process: string;
  return_request_form: string;
}

export default function ApprovalReturn() {
  const [returnData, setReturnData] = useState<ReturnItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof ReturnItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractNo, setSelectedContractNo] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APPROVAL_RETURN_API_URL}/getApprovalReturn`,
        { branch_code: "0104" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setReturnData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (column: keyof ReturnItem) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...returnData].sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold my-2">RETURN PROCESS</h1>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-[#204A7E] p-4 border-b-4 border-[#F7AD00]">
            <h2 className="text-2xl font-bold text-white">TO DO LIST</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <span className="mr-2">Show</span>
                <select
                  className="border rounded px-2 py-1"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="ml-2">entries</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">Search:</span>
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      className="px-4 py-2 text-left cursor-pointer"
                      onClick={() => handleSort("application_no")}
                    >
                      <div className="flex items-center">
                        No. Aplikasi
                        {sortColumn === "application_no" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-2 text-left cursor-pointer"
                      onClick={() => handleSort("application_date")}
                    >
                      <div className="flex items-center">
                        Tanggal Aplikasi
                        {sortColumn === "application_date" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-2 text-left cursor-pointer"
                      onClick={() => handleSort("customer_name")}
                    >
                      <div className="flex items-center">
                        Nama Customer
                        {sortColumn === "customer_name" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-2 text-left cursor-pointer"
                      onClick={() => handleSort("return_request_process")}
                    >
                      <div className="flex items-center">
                        Process
                        {sortColumn === "return_request_process" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-4 py-2 text-left cursor-pointer"
                      onClick={() => handleSort("return_request_form")}
                    >
                      <div className="flex items-center">
                        Request Return
                        {sortColumn === "return_request_form" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-2">{item.application_no}</td>
                        <td className="px-4 py-2">
                          {" "}
                          {new Date(item.application_date)
                            .toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })
                            .replace(/,/g, "")
                            .replace(/\//g, "-")}
                        </td>
                        <td className="px-4 py-2">{item.customer_name}</td>
                        <td className="px-4 py-2">
                          {item.return_request_form}
                        </td>
                        <td className="px-4 py-2">
                          {item.return_request_process}
                        </td>
                        <td className="px-4 py-2">
                          <button className="text-blue-500">
                            <Edit2
                              className="w-4 h-4"
                              onClick={() => {
                                console.log(
                                  "Setting contract number:",
                                  item.contract_no
                                );
                                setSelectedContractNo(item.contract_no);
                                setIsModalOpen(true);
                              }}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-2 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between mt-4">
              <div>
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex">
                <button
                  className={`px-3 py-1 border rounded mr-1 ${
                    currentPage === 1
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 border rounded mr-1 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className={`px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        {selectedContractNo && (
          <DetailKontrakModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedContractNo(null);
            }}
            contractNo={selectedContractNo}
            onSuccessfulAction={fetchData}
          />
        )}
      </div>
    </>
  );
}
