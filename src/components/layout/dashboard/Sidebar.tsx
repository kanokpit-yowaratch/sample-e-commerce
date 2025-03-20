'use client';

import React, { useEffect, useState } from 'react';
import { Home, Users, LogOut, Rocket, CircleDollarSign, Sun, Moon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [activeBg, setActiveBg] = useState(theme === 'dark' ? 'bg-fuchsia-900' : 'bg-sky-600');
  const [activeSection, setActiveSection] = useState(
    pathname.split('/').filter(Boolean).pop() ?? ''
  );

  const goPage = (section: string) => {
    setActiveSection(section);
    router.push(`/dashboard/${section}`);
  };

  useEffect(() => {
    setActiveBg(theme === 'dark' ? 'bg-fuchsia-900' : 'bg-sky-600');
  }, [theme]);

  return (
    <div
      className={`relative ${theme === 'dark' ? 'bg-fuchsia-950' : 'bg-sky-500'} h-screen z-20`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-md font-bold text-white">Sample E-Commerce</h2>
        </div>

        <nav className="space-y-2">
          {[
            { icon: Home, label: 'Dashboard', id: '' },
            { icon: Users, label: 'Users', id: 'users' },
            { icon: Rocket, label: 'Products', id: 'products' },
            { icon: CircleDollarSign, label: 'Orders', id: 'orders' },
          ].map(({ icon: Icon, label, id }) => (
            <button
              key={label}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer text-white ${activeSection === id ? activeBg : ''}`}
              onClick={() => goPage(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">
          <button
            className={`flex items-center space-x-3 w-full p-3 rounded-lg cursor-pointer ${activeBg} text-white transition-colors`}
            onClick={toggleTheme}
          >
            {
              theme === "light" ? (
                <>
                  <Sun size={20} />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={20} />
                  <span>Dark Mode</span>
                </>
              )
            }
          </button>
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer text-white">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;