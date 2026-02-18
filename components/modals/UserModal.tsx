import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../../types';
import { useCrm } from '../../hooks/useCrm';
import { useToast } from '../../hooks/useToast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { ICONS } from '../../constants';
// import { useAuth } from '../../context/AuthContext'; // If needed for currentUser check, but specific logic passed via props or context

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userToEdit?: User | null;
    readOnly?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit, readOnly }) => {
    const { addUser, updateUser, currentUser } = useCrm();
    const { addToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitialState = () => ({
        name: '',
        email: '',
        phone: '',
        role: 'User' as UserRole,
        avatar: '',
        password: '',
    });

    const [userData, setUserData] = useState(getInitialState());

    useEffect(() => {
        if (userToEdit) {
            // When editing, we don't need password field generally unless we want to allow password reset (complex)
            // For now, let's keep it simple: Password only on creation.
            setUserData({ ...userToEdit, password: '' });
        } else {
            setUserData(getInitialState());
        }
    }, [userToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUserData(prev => ({ ...prev, avatar: event.target!.result as string }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (readOnly) return;

        if (!userData.name || !userData.email) {
            addToast('Name and Email are required.', 'error');
            return;
        }

        // Validate password for new users
        if (!userToEdit && (!userData.password || userData.password.length < 6)) {
            addToast('Password is required and must be at least 6 characters.', 'error');
            return;
        }

        if (userToEdit) {
            // Remove password from update payload to avoid sending it to profiles table erroneously
            const { password, ...updatePayload } = userData;
            updateUser({ ...userToEdit, ...updatePayload });
            addToast('User updated successfully!', 'success');
        } else {
            addUser(userData);
            addToast('User creation started...', 'info');
        }
        onClose();
    };

    const isReadOnly = readOnly;
    const isAdmin = currentUser.role === 'Admin';
    // Role editing is allowed only if current user is Admin
    const canEditRole = isAdmin && !isReadOnly;


    return (
        <Modal title={userToEdit ? (isReadOnly ? 'View User Details' : 'Edit User') : 'Add New User'} isOpen={isOpen} onClose={onClose} size="lg">
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <Avatar src={userData.avatar} name={userData.name} size="xl" />

                            {!isReadOnly && (
                                <>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1.5 hover:bg-primary-700">
                                        <div className="w-4 h-4">{ICONS.upload}</div>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" name="name" value={userData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required disabled={isReadOnly} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={userData.email} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required disabled={isReadOnly} />
                        </div>

                        {!userToEdit && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={userData.password}
                                    onChange={handleChange}
                                    className="mt-1 w-full p-2 border rounded"
                                    required
                                    disabled={isReadOnly}
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" value={userData.phone} onChange={handleChange} className="mt-1 w-full p-2 border rounded" disabled={isReadOnly} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select name="role" value={userData.role} onChange={handleChange} className="mt-1 w-full p-2 border rounded bg-white" disabled={!canEditRole}>
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
                    {!isReadOnly && <Button type="submit">{userToEdit ? 'Save Changes' : 'Add User'}</Button>}
                </div>
            </form>
        </Modal>
    );
};

export default UserModal;
