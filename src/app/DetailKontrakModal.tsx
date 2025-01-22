'use client'

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { X, CheckCircle } from 'lucide-react';

interface DetailKontrakProps {
  isOpen: boolean;
  contractNo: string;
  onClose: () => void;
  onSuccessfulAction: () => void; 
}

interface DetailContractData {
  application_no: string;
  contract_no: string;
  application_date: string;
  customer_name: string;
  customer_type: string;
  customer_address: string;
  model_desc: string;
  brand_desc: string;
  supplier_desc: string;
  outlet_desc: string;
  return_request_process: string;
  return_request_form: string;
  return_request_reason: string;
}

export default function DetailKontrakModal({
  isOpen,
  onClose,
  contractNo,
  onSuccessfulAction, 
}: DetailKontrakProps) {
  const [detailData, setDetailData] = useState<DetailContractData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<'reject' | 'confirm' | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen && contractNo) {
      console.log("Fetching data for contract number:", contractNo);
      fetchDetailData();
    }
  }, [isOpen, contractNo]);

  const fetchDetailData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Making API call with contract_no:", contractNo);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APPROVAL_RETURN_API_URL}/getDetailContract`,
        { contract_no: contractNo }
      );
      console.log("API response:", response.data);
      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setDetailData(response.data.data[0]);
      } else {
        setError("No data returned from the API");
      }
    } catch (error) {
      console.error("Error fetching detail data:", error);
      setError("Failed to fetch detail data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: 'reject' | 'confirm') => {
    setConfirmationAction(action);
    setShowConfirmation(true);
  };

  const handleConfirmAction = async () => {
    try {
      let response;
      if (confirmationAction === 'confirm') {
        console.log("Confirming contract with contract_no:", contractNo);
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_APPROVAL_RETURN_API_URL}/confirmApproval`,
          {
            branch_code: "0104",
            nik: "123456",
            contract_no: contractNo
          }
        );
        console.log("API response:", response.data);
      } else {
        console.log("Rejecting contract with contract_no:", contractNo);
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_APPROVAL_RETURN_API_URL}/rejectApproval`,
          {
            contract_no: contractNo,
            nik: "123456"
          }
        );
      }
      console.log("API response:", response.data);

      if (response.status === 200) {
        if (response.data.flagValidasi === 0) {
          setSuccessMessage(`${confirmationAction === 'confirm' ? 'Approval' : 'Rejection'} successful`);
          setIsSuccess(true);

          setTimeout(() => {
            setShowConfirmation(false);
            setIsSuccess(false);
            onClose();
            onSuccessfulAction();
          }, 2000);
          await fetchDetailData();
        } else {
          setSuccessMessage(response.data.message || `Failed to ${confirmationAction} the contract. Please try again.`);
          setIsSuccess(false);
        }
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      setSuccessMessage(`Failed to ${confirmationAction} the contract. Please try again.`);
      setIsSuccess(false);
    }
    
    // Wait for 2 seconds before hiding the confirmation modal
    setTimeout(() => {
      setShowConfirmation(false);
      setIsSuccess(null);
    }, 2000);
  };

  const handleCancelAction = () => {
    setShowConfirmation(false);
  };

  if (!isOpen) return null;

  return ( 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh]">
       
       <div className="sticky top-0 z-10">
        <div className="flex justify-between items-center p-6 bg-[#204A7E] border-b-4 border-[#F7AD00]">
          <h2 className="text-2xl font-bold text-white">DETAIL KONTRAK</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
       </div>

       <div className='overflow-y-auto max-h-[calc(90vh-88px)] custom-scrollbar'>
        {isLoading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : detailData ? (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    No. Aplikasi:
                  </label>
                  <input
                    type="text"
                    value={detailData.application_no}
                    disabled
                    className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    No. Kontrak:
                  </label>
                  <input
                    type="text"
                    value={detailData.contract_no}
                    disabled
                    className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                  Tanggal Aplikasi:
                  </label>
                  <input
                      type="text"
                      value={
                        detailData.application_date
                          ? new Date(detailData.application_date)
                              .toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                              .replace(/,/g, "")
                              .toUpperCase()
                          : ""
                      }
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">CUSTOMER</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Nama Customer:
                    </label>
                    <input
                      type="text"
                      value={detailData.customer_name}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Tipe Nasabah:
                    </label>
                    <input
                      type="text"
                      value={detailData.customer_type}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Alamat:
                    </label>
                    <textarea
                      value={detailData.customer_address}
                      disabled
                      className="form-textarea rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3 resize-none w-full"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">OBJEK PEMBIAYAAN</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Model Objek:
                    </label>
                    <input
                      type="text"
                      value={detailData.model_desc}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Merk Objek:
                    </label>
                    <input
                      type="text"
                      value={detailData.brand_desc}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Nama Dealer:
                    </label>
                    <input
                      type="text"
                      value={detailData.supplier_desc}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Outlet:
                    </label>
                    <input
                      type="text"
                      value={detailData.outlet_desc}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-500 mb-2">RTRE</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Return Request Process:
                    </label>
                    <input
                      type="text"
                      value={detailData.return_request_process}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Return Request Form:
                    </label>
                    <input
                      type="text"
                      value={detailData.return_request_form}
                      disabled
                      className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
                    />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Reason:
                    </label>
                    <textarea
                      value={detailData.return_request_reason}
                      disabled
                      className="form-textarea rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3 resize-vertical"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
        ) : (
          <div className="p-6 text-center">No data available</div>
        )}

        <div className="flex justify-end space-x-4 p-6 border-t">
          <button
            onClick={() => handleActionClick('reject')}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={() => handleActionClick('confirm')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Confirm
          </button>
        </div>
       </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            {isSuccess !== null ? (
              <div className="flex flex-col items-center">
                {isSuccess ? (
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                ) : (
                  <X className="w-16 h-16 text-red-500 mb-4" />
                )}
                <p className="text-lg font-semibold text-center">{successMessage}</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">
                  {confirmationAction === 'reject' ? 'Reject' : 'Confirm'} Action
                </h3>
                <p className="mb-6">
                  Are you sure you want to {confirmationAction} this contract?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={handleCancelAction}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    className={`px-4 py-2 text-white rounded-md transition-colors ${
                      confirmationAction === 'reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {confirmationAction === 'reject' ? 'Reject' : 'Confirm'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
    );
}
