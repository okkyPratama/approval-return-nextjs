import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { approvalReturnApi } from "@/service/api";
import { DetailContractData } from "@/types/detailContract";

type ActionType = 'reject' | 'confirm' | null;

export function useModal(
  contractNo: string,
  onClose: () => void,
  onSuccessfulAction: () => void,
  detailData?: DetailContractData | null
) {
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<ActionType>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleActionClick = useCallback((action: ActionType) => {
    console.log('🔵 Action clicked:', action);

    if (!detailData?.return_request_reason) {
      setSuccessMessage('Reason Return Tidak Boleh Kosong!');
      setIsSuccess(false);
      return;
    }

    setConfirmationAction(action);
    setShowConfirmation(true);
  }, [detailData]);

  const handleConfirmAction = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!user?.nik) throw new Error('User not authenticated');
      if (!detailData) throw new Error('Contract detail data not available');

      console.log('📝 Current contract details:', {
        contractNo,
        return_request_process: detailData.return_request_process,
        user: { nik: user.nik, branchCode: user.branchCode }
      });

      let response;
      if (confirmationAction === "confirm") {
          
          if(detailData?.return_request_process === 'RFDE') {
            console.log('🚀 Calling confirmApproval endpoint')
            response = await approvalReturnApi.confirmApproval({
              branch_code: user.branchCode,
              nik: user.nik,
              contract_no: contractNo,
            })
            
          } else {
            console.log('🚀 Calling confirmApprovalRTRE endpoint');
            response = await approvalReturnApi.confirmApprovalRTRE({
              branch_code: user.branchCode,
              contract_no: contractNo,
              nik: user.nik
            })
          }
      } else {
        console.log('🚀 Calling rejectApproval endpoint');
        response = await approvalReturnApi.rejectApproval({
          contract_no: contractNo,
          nik: user.nik,
        });
      }

      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error('Data Tidak Ditemukan, Silahkan Hubungi IT');
      }

      if (response.data.status !== true) {
        const returnType = detailData.return_request_process === 'RFDE' ? 'FDE' : 'RTRE';
        const actionType = confirmationAction === "confirm" ? "Confirm" : "Reject";
        throw new Error(`Gagal Melakukan ${actionType} Return ${returnType}, Silahkan Hubungi IT`);
      }

      console.log('✅ API Response:', response.data);
      if (response.data.flagValidasi === 0) {
        const returnType = detailData.return_request_process === 'RFDE' ? 'FDE' : 'RTRE';
        const actionType = confirmationAction === "confirm" ? "Confirm" : "Reject";
        
        console.log(`✅ ${actionType} ${returnType} successful`);
        setSuccessMessage(
          `Data No. Kontrak ${contractNo} Berhasil dilakukan ${actionType} Return ${returnType}`
        );
        setIsSuccess(true);


        setTimeout(() => {
          setShowConfirmation(false);
          setIsSuccess(false);
          onClose();
          onSuccessfulAction();
          window.location.reload();
        }, 2000);
      } else {
        console.error('❌ API Validation Error:', response.data.message);
        setSuccessMessage(response.data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setSuccessMessage('Terjadi Kesalahan, Silahkan Hubungi IT');
      setIsSuccess(false);
    } finally {
      setIsLoading(false)
    }

    if (!isSuccess) {
      setTimeout(() => {
        setShowConfirmation(false);
        setIsSuccess(null);
      }, 2000);
    }
  }, [confirmationAction, contractNo, user, onClose, onSuccessfulAction,detailData]);

  return {
    showConfirmation,
    confirmationAction,
    isSuccess,
    successMessage,
    isLoading,
    handleActionClick,
    handleConfirmAction,
    handleCancelAction: () => setShowConfirmation(false)
  };
}