"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { DetailKontrakProps } from "@/types/detailContract";
import { useDetailContract } from "@/hooks/useDetailContract";
import { useModal } from "@/hooks/useModal";
import { FormField } from "./Form/FormField";
import { formatDate } from "@/helper/date";
import { ConfirmationPopup } from "./util/ConfirmationPopup";

export default function DetailKontrakModal({
  isOpen,
  onClose,
  contractNo,
  onSuccessfulAction,
  setIsConfirmationLoading,
}: DetailKontrakProps) {
  const {
    detailData,
    isLoading: detailLoading,
    error,
    fetchDetailData,
  } = useDetailContract(contractNo);

  const {
    showConfirmation,
    confirmationAction,
    isSuccess,
    successMessage,
    handleActionClick,
    handleConfirmAction,
    handleCancelAction,
    shouldCloseMainModal,
  } = useModal(
    contractNo,
    onClose,
    onSuccessfulAction,
    setIsConfirmationLoading,
    detailData
  );

  useEffect(() => {
    if (isOpen && contractNo) {
      fetchDetailData();
    }
  }, [isOpen, contractNo, fetchDetailData]);

  if (!isOpen || (shouldCloseMainModal && !showConfirmation)) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        {/* Header */}
        <div className="border-b">
          <div className="flex justify-between items-center px-4 py-2.5">
            <h2 className="text-lg font-semibold text-gray-800">
              Detail Contract
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-3">
          {detailLoading ? (
            <div className="text-center py-2">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-2">{error}</div>
          ) : detailData ? (
            <div className="space-y-0">
              <FormField label="No. Aplikasi:" value={detailData.application_no} />
              <FormField label="No. Kontrak:" value={detailData.contract_no} />
              <FormField 
                label="Tanggal Aplikasi:" 
                value={formatDate(detailData.application_date)}
                isBold 
              />
              <FormField label="Nama Customer:" value={detailData.customer_name} />
              <FormField 
                label="Alamat" 
                value={detailData.customer_address} 
                fullWidth 
                multiline 
                rows={2}
              />
              <FormField label="Tipe Nasabah:" value={detailData.customer_type} />
              <FormField label="Outlet:" value={detailData.outlet_desc} isBold />
              <FormField label="Nama Dealer:" value={detailData.supplier_desc} />
              <FormField label="Merk Objek:" value={detailData.brand_desc} />
              <FormField label="Model Objek:" value={detailData.model_desc} />
              <FormField 
                label="Request Return:" 
                value={detailData.return_request_process}
                isBold 
              />
              <FormField 
                label="Reason:" 
                value={detailData.return_request_reason} 
                fullWidth 
                multiline 
                rows={2}
                isBold
              />
            </div>
          ) : (
            <div className="text-center py-2">No data available</div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2.5 flex justify-end space-x-2">
          <button
            onClick={() => handleActionClick("reject")}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
          >
            Reject
          </button>
          <button
            onClick={() => handleActionClick("confirm")}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showConfirmation}
        action={confirmationAction}
        isSuccess={isSuccess}
        successMessage={successMessage}
        onCancel={handleCancelAction}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
