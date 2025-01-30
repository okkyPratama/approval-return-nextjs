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

  const handleActionClick = useCallback((action: ActionType) => {
    console.log('🔵 Action clicked:', action);
    setConfirmationAction(action);
    setShowConfirmation(true);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    try {
      if (!user?.nik) throw new Error('User not authenticated');
      if (!detailData) throw new Error('Contract detail data not available');

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
              nik: user.nik,
              contract_no: contractNo,
            })
          }
      } else {
        console.log('🚀 Calling rejectApproval endpoint');
        response = await approvalReturnApi.rejectApproval({
          contract_no: contractNo,
          nik: user.nik,
        });
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
        }, 2000);
      } else {
        console.error('❌ API Error:', response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      const returnType = detailData?.return_request_process === 'RFDE' ? 'FDE' : 'RTRE';
      const actionType = confirmationAction === "confirm" ? "Confirm" : "Reject";
        
      setSuccessMessage(
        `Gagal melakukan ${actionType} Return ${returnType}. Silahkan hubungi tim IT`
      );
      setIsSuccess(false);
    }

    setTimeout(() => {
      setShowConfirmation(false);
      setIsSuccess(null);
    }, 2000);
  }, [confirmationAction, contractNo, user, onClose, onSuccessfulAction]);

  return {
    showConfirmation,
    confirmationAction,
    isSuccess,
    successMessage,
    handleActionClick,
    handleConfirmAction,
    handleCancelAction: () => setShowConfirmation(false)
  };
}