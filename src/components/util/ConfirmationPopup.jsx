import { CheckCircle, X } from "lucide-react";

export function ConfirmationPopup({
    isOpen,
    action,
    isSuccess,
    successMessage,
    onCancel,
    onConfirm,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
                {isSuccess !== null ? (
                    <div className="flex flex-col items-center">
                        {isSuccess ? (
                            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        ) : (
                            <X className="w-16 h-16 text-red-500 mb-4" />
                        )}
                        <p className="text-lg font-semibold text-center">
                            {successMessage}
                        </p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold mb-4">
                            {action === "reject" ? "Reject" : "Confirm"} Action
                        </h3>
                        <p className="mb-6">
                            Are you sure you want to {action} this contract?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`px-4 py-2 text-white rounded-md transition-colors ${
                                    action === "reject"
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                {action === "reject" ? "Reject" : "Confirm"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}