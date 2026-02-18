import React, { useState } from 'react';
import { useCrm } from '../hooks/useCrm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import UserModal from '../components/modals/UserModal';
import { ICONS } from '../constants';
import { User } from '../types';
import Avatar from '../components/ui/Avatar';

const Users: React.FC = () => {
  const { users, currentUser, deleteUser } = useCrm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const handleOpenModal = (user?: User) => {
    setUserToEdit(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUser(userId);
    }
  };

  return (
    <>
      <Card title="Users & Roles" headerActions={currentUser.role === 'Admin' ? <Button onClick={() => handleOpenModal()}>Add User</Button> : null}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => {
            const isCurrentUser = user.id === currentUser.id;
            const isAdmin = currentUser.role === 'Admin';

            // Edit allowed if: Admin OR Current User
            // View allowed for everyone (implied by rendering)
            // Edit Button Action: 
            // - If Admin: Can edit (full access, but can't likely edit role of self if we enforce that rule, but here we just mean opening the modal)
            // - If Self: Can edit (restricted fields in modal)
            // - If Other & Not Admin: Cannot edit (or View Only)

            const canEdit = isAdmin || isCurrentUser;
            const canDelete = isAdmin && !isCurrentUser; // Prevent deleting self

            return (
              <div key={user.id} className="relative p-6 border rounded-lg bg-light hover:shadow-md transition-shadow group">
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Show Edit button if canEdit. If it's another user and we are not admin, maybe make it read-only? 
                      The requirement says: "other user role can view the user page and they can edit their own detils"
                      So for others, maybe show nothing or a view icon?
                      I'll show the edit icon but if !canEdit (which includes !isAdmin && !isCurrentUser), I won't show it.
                      Wait, if I am a User seeing another User, `canEdit` is false. So button is hidden.
                  */}
                  {canEdit && (
                    <button onClick={() => handleOpenModal(user)} className="text-gray-400 hover:text-primary-600" title={isAdmin ? "Edit User" : "Edit Profile"}>
                      {ICONS.edit}
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => handleDeleteUser(user.id)} className="text-gray-400 hover:text-red-500" title="Delete User">
                      {ICONS.trash}
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <Avatar src={user.avatar} name={user.name} size="xl" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg text-gray-800">{user.name}</h3>
                    <p className="text-primary-600 text-sm">{user.email}</p>
                    <div className="mt-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'Admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-800'}`}>{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userToEdit={userToEdit}
        />
      )}
    </>
  );
};

export default Users;