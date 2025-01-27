import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { approvalReturnApi } from "@/service/api";

type ActionType = 'reject' | 'confirm' | null;

export function useModal(contractNo: string, onClose: () => void, onSuccessfulAction: () => void) {
    const { user } = useAuth();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState<ActionType>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
  
    const handleActionClick = useCallback((action: ActionType) => {
      setConfirmationAction(action);
      setShowConfirmation(true);
    }, []);
  
    const handleConfirmAction = useCallback(async () => {
      try {
        if (!user?.nik) throw new Error('User not authenticated');
  
        const response = confirmationAction === "confirm"
          ? await approvalReturnApi.confirmApproval({
              branch_code: user.branchCode,
              nik: user.nik,
              contract_no: contractNo,
            })
          : await approvalReturnApi.rejectApproval({
              contract_no: contractNo,
              nik: user.nik,
            });
  
        if (response.data.flagValidasi === 0) {
          setSuccessMessage(
            `${confirmationAction === "confirm" ? "Approval" : "Rejection"} successful`
          );
          setIsSuccess(true);
          setTimeout(() => {
            setShowConfirmation(false);
            setIsSuccess(false);
            onClose();
            onSuccessfulAction();
          }, 2000);
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error during API call:", error);
        setSuccessMessage(
          `Failed to ${confirmationAction} the contract. Please try again.`
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