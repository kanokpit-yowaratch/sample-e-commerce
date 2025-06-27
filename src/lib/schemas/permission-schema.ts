import { z } from 'zod';

export const permissionSchema = z.object({
	roleId: z
		.number(),
	resource: z
		.string()
		.max(50, 'Maximum 125 characters')
		.nonempty('Resource is required'),
	action: z
		.string()
		.max(50, 'Maximum 125 characters')
		.nonempty('Action is required'),
});

export type PermissionSchema = z.infer<typeof permissionSchema>;
