
import React, { useEffect } from 'react';
import { ToastMessage } from '../../types';
import { ICONS } from '../../constants';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const toastConfig = {
  success: {
    icon: ICONS.toastSuccess,
    bg: 'bg-green-50',
    border: 'border-green-400',
  },
  error: {
    icon: ICONS.toastError,
    bg: 'bg-red-50',
    border: 'border-red-400',
  },
  info: {
    icon: ICONS.toastInfo,
    bg: 'bg-blue-50',
    border: 'border-blue-400',
  },
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, message, type } = toast;
  const config = toastConfig[type];

  return (
    <div className={`w-full max-w-sm rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${config.bg} ${config.border} animate-fade-in-right`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{config.icon}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={() => onClose(id)} className="inline-flex text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              {ICONS.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
