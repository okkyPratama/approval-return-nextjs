import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { approvalReturnApi } from "@/service/api";
import { DetailContractData } from "@/types/detailContract";

type ActionType = 'reject' | 'confirm' | null;

export function useModal(
  contractNo: string,
  onClose: () => void,
  onSuccessfulAction: () => void,
  setIsConfirmationLoading: (loading: boolean) => void,
  detailData?: DetailContractData | null
) {
  const { user } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<ActionType>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [shouldCloseMainModal, setShouldCloseMainModal] = useState(false);

  const handleActionClick = useCallback((action: ActionType) => {
    if (!detailData?.return_request_reason) {
      setSuccessMessage('Reason Return Tidak Boleh Kosong!');
      setIsSuccess(false);
      return;
    }

    setConfirmationAction(action);
    setShowConfirmation(true);
  }, [detailData]);

  const handleConfirmAction = useCallback(async () => {
    setIsConfirmationLoading(true);
    try {
      if (!user?.nik) throw new Error('User not authenticated');
      if (!detailData) throw new Error('Contract detail data not available');

      let response;
      if (confirmationAction === "confirm") {
        if(detailData?.return_request_process === 'RFDE') {
          response = await approvalReturnApi.confirmApproval({
            branch_code: user.branchCode,
            nik: user.nik,
            contract_no: contractNo,
          });
        } else {
          response = await approvalReturnApi.confirmApprovalRTRE({
            branch_code: user.branchCode,
            contract_no: contractNo,
            nik: user.nik
          });
        }
      } else {
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

      if (response.data.flagValidasi === 0) {
        const returnType = detailData.return_request_process === 'RFDE' ? 'FDE' : 'RTRE';
        const actionType = confirmationAction === "confirm" ? "Confirm" : "Reject";
        
        setSuccessMessage(
          `Data No. Kontrak ${contractNo} Berhasil dilakukan ${actionType} Return ${returnType}`
        );
        setIsSuccess(true);
        setShouldCloseMainModal(true);

        setTimeout(async () => {
          setShowConfirmation(false);
          setIsSuccess(null);
          await onSuccessfulAction();
          onClose(); 
        }, 1500);
      } else {
        setSuccessMessage(response.data.message);
        setIsSuccess(false);
        setShouldCloseMainModal(true);
        
        setTimeout(async () => {
          setShowConfirmation(false);
          setIsSuccess(null);
          await onSuccessfulAction();
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setSuccessMessage('Terjadi Kesalahan, Silahkan Hubungi IT');
      setIsSuccess(false);
      setShouldCloseMainModal(true);
      
      setTimeout(async () => {
        setShowConfirmation(false);
        setIsSuccess(null);
        await onSuccessfulAction();
        onClose();
      }, 1500);
    } finally {
      setIsConfirmationLoading(false);
    }
  }, [confirmationAction, contractNo, user, onClose, onSuccessfulAction, detailData, setIsConfirmationLoading]);

  const handleCancelAction = useCallback(() => {
    setShowConfirmation(false);
    setIsSuccess(null);
    if (shouldCloseMainModal) {
      onClose();
      setShouldCloseMainModal(false);
    }
  }, [onClose, shouldCloseMainModal]);

  return {
    showConfirmation,
    confirmationAction,
    isSuccess,
    successMessage,
    handleActionClick,
    handleConfirmAction,
    handleCancelAction,
    shouldCloseMainModal
  };
}