import { Category } from "@prisma/client";

export type CategoryCreate = Pick<Category, "name">;
