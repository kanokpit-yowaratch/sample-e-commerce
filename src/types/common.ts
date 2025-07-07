import { LucideIcon } from 'lucide-react';
import { ProductDetail } from './product';

type Id = 'id';
type name = 'name';
type Product = 'product';
export type IdParams = Record<Id, string>;
export type NameParams = Record<name, string>;
export type ProductParams = Record<Product, ProductDetail>;
export type IdParamProps = {
	params: Promise<IdParams>;
};
export type NameParamProps = {
	params: Promise<NameParams>;
};
export type ProductParamProps = {
	params: Promise<ProductParams>;
};
export type QueryParamsProps = {
	searchParams: Promise<{ from?: string }>
}

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

export type ModalState = {
	isOpen: boolean;
	selectedId: string | null;
	open: (id?: string) => void;
	close: () => void;
};

export type MenuType = {
	id: string;
	label: string;
	icon: LucideIcon;
}
