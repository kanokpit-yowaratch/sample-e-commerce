type Id = 'id';
export type IdParams = Record<Id, string>;

export type IdParamProps = {
	params: Promise<IdParams>;
};

export const SortOrder: {
	asc: 'asc';
	desc: 'desc';
} = {
	asc: 'asc',
	desc: 'desc',
};

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export type PaginationParams = {
	page: number;
	perPage: number;
	search?: string;
};

export type Pagination = {
	pagination: {
		total: number;
		page: number;
		perPage: number;
	};
};

export type PaginationResponse<T> = Pagination & {
	data: T[];
};

export type PaginationComponentProps = {
	currentPage: number;
	rowsPerPage: number;
	pageItems: number;
	totalItems: number;
	setCurrentPage: (page: number) => void;
	setRowsPerPage: (size: number) => void;
};
