"use client";

import { useEffect, useState, useCallback } from "react";
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
}: DetailKontrakProps)  {

  const { detailData, isLoading, error, fetchDetailData } = useDetailContract(contractNo);
  const { 
    showConfirmation,
    confirmationAction,
    isSuccess,
    successMessage,
    handleActionClick,
    handleConfirmAction,
    handleCancelAction
  } = useModal(contractNo, onClose, onSuccessfulAction);

  useEffect(() => {
    if (isOpen && contractNo) {
      fetchDetailData();
    }
  }, [isOpen, contractNo,fetchDetailData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh]">
        <div className="sticky top-0 z-10">
          <div className="relative flex justify-between items-center p-6 border-b-2">
            <h2 className="text-2xl font-bold text-dark">
              DETAIL CONTRACT
            </h2>
            <button
              onClick={onClose}
              className="text-dark hover:text-red-500"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-88px)] custom-scrollbar">
          {isLoading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : detailData ? (
            <div className="p-8 space-y-4">
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
                  rows={4}
                  isBold
                />

            </div>
          ) : (
            <div className="p-6 text-center">No data available</div>
          )}

          <div className="flex justify-end space-x-4 p-6 border-t">
            <button
              onClick={() => handleActionClick("reject")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => handleActionClick("confirm")}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Confirm
            </button>
          </div>
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
