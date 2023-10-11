import React from "react";

function Spinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black opacity-70">
      <div className="w-8 h-8 border-4 border-white border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
}

export default Spinner;
