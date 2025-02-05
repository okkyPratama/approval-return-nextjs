export interface DetailContractData {
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

export interface DetailKontrakProps {
  isOpen: boolean;
  onClose: () => void;
  contractNo: string;
  onSuccessfulAction: () => void;
  setIsConfirmationLoading: (loading: boolean) => void;
}