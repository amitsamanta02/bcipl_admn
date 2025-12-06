import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserCheck,
  Package,
  BarChart3,
  Calendar,
  Kanban,
  Settings,
  Edit3,
  ChevronDown,
  ChevronRight,
  House,
  Database,
  Zap,
  Brain,
  Box,
  MessageSquare,
  ChartNoAxesCombined,
  DollarSign,
  Headphones,
  NotebookTabs
} from 'lucide-react';
import useStore from '../../store/useStore';

const Sidebar = () => {
  const { sidebarOpen } = useStore();
  const [openMenu, setOpenMenu] = useState(null); // Track which menu is open

  const menuItems = [
    { icon: House, label: 'Leads', path: '/home' },
    // { icon: Brain, label: 'AI Knowledge Base', path: '/ai-knowledge-base' },
    // { icon: Box, label: 'Integrations', path: '/integrations', hasSubmenu: true },
    // { icon: UserCheck, label: 'Lead Management', path: '/leads' },
    // { icon: Zap, label: 'Auto Follow ups', path: '/followups' },
    // { icon: MessageSquare, label: 'Channels', path: '/channels', hasSubmenu: true },
    // { icon: NotebookTabs, label: 'Contacts', path: '/contacts' },
    // { icon: ChartNoAxesCombined, label: 'Analytics', path: '/analytics' },
    // { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
    // { icon: Settings, label: 'Setting', path: '/admin-settings' },
    // { icon: Users, label: 'Users & Roles', path: '/users-roles' },
    // { icon: DollarSign, label: 'Price & Plan', path: '/pricing' },
    // { icon: Headphones, label: 'Customer Support', path: '/support' },
  ];

  // Submenus
  const integrationSubItems = [
    { label: 'Meta Ads Manager', path: '/integrations/meta-ads' },
    { label: 'Google Ads', path: '/integrations/google-ads' },
    { label: 'Google Sheets', path: '/integrations/google-sheets' },
    { label: 'Indiamart', path: '/integrations/indiamart' },
    { label: 'JustDial', path: '/integrations/justdial' },
    { label: 'Webhooks', path: '/integrations/webhooks' },
  ];

  const channelSubItems = [
    { label: 'WhatsApp', path: '/channels/whatsapp' },
    { label: 'Twitter', path: '/channels/twitter' },
    { label: 'Facebook', path: '/channels/facebook' },
    { label: 'Instagram', path: '/channels/instagram' },
  ];

  const handleMenuClick = (menuLabel) => {
    setOpenMenu(openMenu === menuLabel ? null : menuLabel);
  };

  return (
    <aside
      className={`
        bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'w-64' : 'w-16'}
        min-h-screen fixed left-0 top-0 z-40
      `}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            {/* <LayoutDashboard className="w-5 h-5 text-white" /> */}
            <span className="text-xl font-bold text-white dark:text-white">B</span>
          </div>
          {sidebarOpen && (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              BCIPL
            </span>
          )}
        </div>
      </div>

      {/* Navigation (Scrollable) */}
      <nav className="p-4 overflow-y-auto max-h-[calc(100vh-4rem)] custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            if (item.hasSubmenu) {
              const isOpen = openMenu === item.label;
              const subItems =
                item.label === 'Integrations'
                  ? integrationSubItems
                  : item.label === 'Channels'
                    ? channelSubItems
                    : [];

              return (
                <li key={item.path}>

                  <button
                    onClick={() => handleMenuClick(item.label)}
                    className={`
                      flex items-center w-full px-3 py-2 rounded-lg transition-colors
                     ${sidebarOpen ? 'justify-between space-x-3' : 'justify-center'}
                         ${openMenu === item.label
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                      }
                        `}
                  >
                    <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center w-full'}`}>
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>

                    {/* Chevron icons only when expanded */}
                    {sidebarOpen &&
                      (openMenu === item.label ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      ))}
                  </button>

                  {/* Submenu */}
                  {isOpen && sidebarOpen && (
                    <ul className="mt-2 ml-9 space-y-1">
                      {subItems.map((sub) => (
                        <li key={sub.path}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) => `
                              block px-2 py-1.5 rounded-md text-sm transition-colors
                              ${isActive
                                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
                              }
                            `}
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            // Normal menu items
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    
                     flex items-center ${sidebarOpen ? 'justify-start space-x-3' : 'justify-center'} 
    px-3 py-2 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }
                  `}
                  onClick={() => setOpenMenu(null)} // Close submenu when another menu clicked
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;