'use client';

import React, { useState } from 'react';
import { Home, Users, LogOut, Rocket, CircleDollarSign, Sun, Moon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(
    pathname.split('/').filter(Boolean).pop() ?? ''
  );

  const goPage = (section: string) => {
    setActiveSection(section);
    router.push(`/dashboard/${section}`);
  };

  return (
    <div
      className={`bg-fuchsia-950 h-screen z-20`}>
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
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors cursor-pointer text-white ${activeSection === id ? 'bg-fuchsia-900' : ''}`}
              onClick={() => goPage(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4 space-y-2">

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