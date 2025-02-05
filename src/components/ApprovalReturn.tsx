"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import DetailKontrakModal from "./DetailKontrakModal";
import { useAuth } from "@/hooks/useAuth";
import { ApprovalReturnRequest } from "@/types/approvalReturn";
import { approvalReturnApi } from "@/service/api";
import { useTableSort } from "@/hooks/useTableSort";
import { usePagination } from "@/hooks/usePagination";
import { TableControls } from "./DataTable/TableControls";
import { ReturnTable } from "./DataTable/Table";
import { TableFooter } from "./DataTable/TableFooter";
import { LoadingSpinner } from "./util/LoadingSpinner";
import { ErrorMessage } from "./util/ErrorMessage";

export default function ApprovalReturn() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationLoading, setIsConfirmationLoading] = useState(false);
  const [returnData, setReturnData] = useState<ApprovalReturnRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    contractNo: null as string | null,
  });

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const data = await approvalReturnApi.getApprovalReturn("0104");
      setReturnData(data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = "/unauthorized";
      return;
    }
    fetchData();
  }, [user, authLoading]);

  const filteredData = useMemo(
    () =>
      returnData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [returnData, searchTerm]
  );

  const { sortedData, sortColumn, sortDirection, handleSort } = useTableSort(filteredData);
  const { currentItems, currentPage, totalPages, handlePageChange } = usePagination(sortedData, itemsPerPage);

  const handleModalOpen = (contractNo: string) => {
    setModalState({ isOpen: true, contractNo });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, contractNo: null });
  };

  if (!user) return null;

  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <>
      {isConfirmationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-medium border-b-[5px] border-[var(--primary-blue)] pb-2 mb-4">
          RETURN PROCESS
        </h1>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold relative">
            <div className="ml-4 border-b-[3px] border-gray-300 w-full absolute bottom-0"></div>
            <span className="ml-4 relative inline-block pb-2">
              <span>To Do List</span>
              <div className="absolute bottom-0 left-0 border-b-[3px] border-[#F7AD00] w-14"></div>
            </span>
          </h2>
          <div className="p-4">
            <TableControls
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            <ReturnTable
              items={currentItems}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onActionClick={handleModalOpen}
            />
            <TableFooter
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        {modalState.contractNo && (
          <DetailKontrakModal
            isOpen={modalState.isOpen}
            onClose={handleModalClose}
            contractNo={modalState.contractNo}
            onSuccessfulAction={fetchData}
            setIsConfirmationLoading={setIsConfirmationLoading}
          />
        )}
      </div>
    </>
  );
}
