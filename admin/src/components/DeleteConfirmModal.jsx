import React from "react";

export default function DeleteConfirmModal({ isOpen, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Deletion</h3>
          <p className="text-slate-500 text-sm">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button 
            type="button"
            className="px-4 py-2 font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-4 py-2 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
