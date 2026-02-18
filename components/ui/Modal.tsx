import React from 'react';
import { ICONS } from '../../constants';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 p-4 pt-10 overflow-y-auto animate-fade-in-right" 
      style={{ animationDuration: '0.2s' }} 
      onClick={onClose}
    >
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} my-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            {ICONS.close}
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;