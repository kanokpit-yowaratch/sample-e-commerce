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
