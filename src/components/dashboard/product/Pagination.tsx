'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationComponentProps } from '@/types/common';

const ProductPagination = ({
	currentPage,
	rowsPerPage,
	pageItems,
	totalItems,
	setCurrentPage,
	setRowsPerPage,
}: PaginationComponentProps) => {
	const totalPages = Math.ceil(totalItems / rowsPerPage);
	const startIndex = (currentPage - 1) * rowsPerPage;
	const endIndex = startIndex + pageItems;

	return (
		<div className="mt-6 flex items-center justify-between">
			<div className="text-sm text-muted-foreground">
				Showing {startIndex + 1}
				<span> to </span>
				{endIndex}
				<span> of </span>
				{totalItems}
				<span> entries</span>
			</div>
			<div className="flex items-center gap-2">
				<div>
					<button
						onClick={() => setCurrentPage(currentPage - 1)}
						disabled={currentPage === 1}
						className="p-2 rounded-md bg-secondary text-secondary-foreground disabled:opacity-50 hover:bg-opacity-90 transition-all"
						aria-label="Previous page">
						<ChevronLeft />
					</button>
					<span className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
						{currentPage} of {totalPages}
					</span>
					<button
						onClick={() => setCurrentPage(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="p-2 rounded-md bg-secondary text-secondary-foreground disabled:opacity-50 hover:bg-opacity-90 transition-all"
						aria-label="Next page">
						<ChevronRight />
					</button>
				</div>
				<select
					value={rowsPerPage}
					onChange={(e) => setRowsPerPage(Number(e.target.value))}
					className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
					<option value="5">5 per page</option>
					<option value="10">10 per page</option>
					<option value="20">20 per page</option>
				</select>
			</div>
		</div>
	);
};

export default ProductPagination;
