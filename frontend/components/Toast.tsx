"use client";

interface Props {
  message: string;
}

export default function Toast({
  message,
}: Props) {
  return (
    <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-xl">
      {message}
    </div>
  );
}