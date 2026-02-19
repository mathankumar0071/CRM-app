import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white text-gray-800 flex flex-col border-r border-gray-200 fixed md:static inset-y-0 left-0 z-30 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="h-16 flex items-center justify-center text-2xl font-bold text-primary-600 border-b border-gray-200">
          Dronetribes
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => {
                // Close sidebar on mobile when a link is clicked
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 group ${isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className={`mr-3 h-6 w-6 ${'text-gray-400 group-hover:text-gray-600'}`}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;