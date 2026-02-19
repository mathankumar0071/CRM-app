import React, { useState, useRef } from 'react';
import { useCrm } from '../../hooks/useCrm';
import { useToast } from '../../hooks/useToast';
import { ICONS } from '../../constants';
import Button from '../ui/Button';
import { User } from '../../types';

interface HeaderProps {
  onLogout: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, toggleSidebar }) => {
  const { currentUser, updateCurrentUser } = useCrm();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(currentUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    setEditedUser(currentUser);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditedUser(prev => ({ ...prev, avatar: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    updateCurrentUser(editedUser);
    addToast('Profile updated successfully!', 'success');
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setIsEditMode(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {ICONS.menu}
        </button>
        <div className="flex items-center gap-4 ml-auto">
          <button onClick={openModal} className="flex items-center gap-2 group">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full ring-2 ring-offset-2 ring-transparent group-hover:ring-primary-300 transition-all" />
            <div className="text-left hidden sm:block">
              <span className="text-sm font-semibold text-gray-800">{currentUser.name || 'User'}</span>
              <p className="text-xs text-gray-500">{currentUser.role || 'Member'}</p>
            </div>
          </button>
          <div className="w-px h-8 bg-slate-200"></div>
          <button onClick={onLogout} className="text-slate-500 hover:text-primary-600" title="Logout">
            <div className="w-6 h-6">{ICONS.logout}</div>
          </button>
        </div>
      </header>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 animate-fade-in-right" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{isEditMode ? 'Edit Profile' : 'My Profile'}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">{ICONS.close}</button>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img src={editedUser.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                  {isEditMode && (
                    <>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1.5 hover:bg-primary-700">
                        <div className="w-4 h-4">{ICONS.upload}</div>
                      </button>
                    </>
                  )}
                </div>

                {!isEditMode ? (
                  <div className="text-center w-full">
                    <h3 className="text-2xl font-semibold">{currentUser.name}</h3>
                    <p className="text-gray-500">{currentUser.role}</p>
                    <div className="mt-4 text-left space-y-2">
                      <p><span className="font-semibold">Email:</span> {currentUser.email}</p>
                      <p><span className="font-semibold">Phone:</span> {currentUser.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-3">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} className="w-full p-2 border rounded mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <input type="email" name="email" value={editedUser.email} onChange={handleInputChange} className="w-full p-2 border rounded mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <input type="tel" name="phone" value={editedUser.phone} onChange={handleInputChange} className="w-full p-2 border rounded mt-1" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
              {!isEditMode ? (
                <Button onClick={() => setIsEditMode(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
