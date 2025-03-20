'use client';
import { createContext, useContext, useMemo, useState } from 'react';

interface DrawerContextType {
	isDrawerOpen: boolean;
	toggleDrawer: () => void;
}

// 1. Create Context
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

// 2. Provider สำหรับแชร์ข้อมูล
export const DrawerProvider = ({ children }: { children: React.ReactNode }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(true);
	const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

	const contextValue = useMemo(() => ({ isDrawerOpen, toggleDrawer }), [isDrawerOpen, toggleDrawer]);

	return (
		<DrawerContext.Provider value={contextValue}>
			{children}
		</DrawerContext.Provider>
	)
};

// 3. Hook สำหรับเรียกใช้ Context ใน Function Component
export const useDrawer = () => {
	const context = useContext(DrawerContext);
	if (!context) {
		throw new Error('useDrawer must be used within a DrawerProvider');
	}
	return context;
};
