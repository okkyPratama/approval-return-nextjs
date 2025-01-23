"use client";

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className="w-16 h-16 mb-4 mx-auto"
  >
    <path
      d="M32 4L4 56h56L32 4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
      className="text-red-600"
    />
    <path
      d="M32 22v18"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      className="text-red-600"
    />
    <circle cx="32" cy="48" r="2.5" className="fill-red-600" />
  </svg>
);

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg">
        <WarningIcon />
        <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="mt-2">Looks like you're have no permission to access this page!</p>
      </div>
    </div>
  );
}
