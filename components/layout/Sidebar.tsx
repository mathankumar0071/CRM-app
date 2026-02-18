import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white text-gray-800 flex flex-col border-r border-gray-200">
      <div className="h-16 flex items-center justify-center text-2xl font-bold text-primary-600 border-b border-gray-200">
        Dronetribes
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {NAV_LINKS.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 group ${
                isActive
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
  );
};

export default Sidebar;