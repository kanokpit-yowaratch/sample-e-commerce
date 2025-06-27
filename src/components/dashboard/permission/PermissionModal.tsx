'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { PermissionSchema, permissionSchema } from '@/lib/schemas/permission-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/stores/zustand/modalStore';
import { useForm } from 'react-hook-form';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { initialPermission, PermissionSet, roleIdMap } from '@/types/permission';
import { useCreateItem, useItem, usePatchItem } from '@/hooks/useQueryProtected';

export const PermissionModal = () => {
	const { isOpen, selectedId, close } = useModal();
	const { mutate: mutateCreate } = useCreateItem('permissions');
	const { mutate: mutateUpdate } = usePatchItem('permissions', selectedId ?? '');
	const { data, isLoading, error } = useItem<PermissionSet>('permissions', selectedId ?? '');
	const [permission, setPermission] = useState<PermissionSet>(initialPermission);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
		clearErrors,
	} = useForm<PermissionSchema>({
		resolver: zodResolver(permissionSchema),
		reValidateMode: 'onChange',
		defaultValues: initialPermission,
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		manageChange(name, value);
	};

	const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		manageChange(name, parseInt(value, 10));
	};

	const manageChange = (name: string, value: string | number) => {
		setPermission({ ...permission, [name]: value });
		clearErrors(name as keyof PermissionSchema);
		Object.entries({ [name]: value }).forEach(([fieldName, fieldValue]) => {
			setValue(fieldName as keyof PermissionSchema, fieldValue, {
				shouldValidate: true,
				shouldDirty: true,
				shouldTouch: true
			});
		});
	}

	const handleCloseModal = () => {
		reset();
		close();
	};

	const onSubmit = () => {
		if (selectedId) {
			console.log(selectedId);
			mutateUpdate(permission, {
				onSuccess: () => {
					reset();
					close();
				},
				onError: (error) => {
					console.log(error);
				},
			});
		} else {
			mutateCreate(permission, {
				onSuccess: () => {
					reset();
					close();
				},
				onError: (error) => {
					console.log(error);
				},
			});
		}
	};

	// For update
	useEffect(() => {
		if (data) {
			(Object.keys(data) as Array<keyof typeof data>).forEach(key => {
				setValue(key, data[key] ?? '');
			});

			setPermission(prevData => ({
				...prevData,
				roleId: data.roleId ?? 0,
				resource: data.resource ?? '',
				action: data.action ?? '',
			}));
		}
	}, [data, setValue]);

	return (
		<Dialog open={isOpen} onClose={close} className="relative z-50">
			<div className="fixed inset-0 bg-black/50" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-xl font-semibold">
							{selectedId ? 'Edit permission' : 'Create permission'}
						</DialogTitle>
						<button className="cursor-pointer" onClick={() => handleCloseModal()}>
							<X className="h-5 w-5" />
						</button>
					</div>
					<div className="h-10">{selectedId && isLoading && <span>Loading...</span>}</div>
					{error && <div>Error: {error.message}</div>}
					{selectedId && !data && !isLoading && !error && <div>Permission not found</div>}

					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
						<div className="flex flex-col gap-1">
							<span>roleId</span>
							<select
								{...register('roleId', { valueAsNumber: true })}
								className="border rounded-md p-2"
								onChange={handleRoleChange}>
								<option value="0">Select a role</option>
								{Object.entries(roleIdMap).map(([role, id]) => (
									<option key={role} value={id}>
										{role.charAt(0).toUpperCase() + role.slice(1)}
									</option>
								))}
							</select>
							{errors.roleId && <p className="text-red-500">{errors.roleId.message}</p>}
						</div>

						{
							!selectedId &&
							(
								<>
									<div>
										<label htmlFor="resource" className="block text-sm font-medium text-gray-700">
											Resource
										</label>
										<input
											{...register('resource')}
											className="w-full border p-2 rounded-md"
											placeholder="Resource"
											onChange={handleChange}
										/>
										<div className="w-full h-6 text-sm">
											{errors.resource && <span className="text-red-500">{errors.resource.message}</span>}
										</div>
									</div>

									<div>
										<label htmlFor="action" className="block text-sm font-medium text-gray-700">
											Action
										</label>
										<input
											{...register('action')}
											className="w-full border p-2 rounded-md"
											placeholder="Action"
											onChange={handleChange}
										/>
										<div className="w-full h-6 text-sm">
											{errors.action && <span className="text-red-500">{errors.action.message}</span>}
										</div>
									</div>
								</>
							)
						}

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={(selectedId && isLoading) || (!selectedId && [0, 4].includes(permission.roleId))}
								className={`flex items-center justify-center px-4 py-2 text-white rounded-md transition-all
            ${(selectedId && isLoading) || (!selectedId && [0, 4].includes(permission.roleId))
										? 'bg-blue-600/80 cursor-not-allowed'
										: 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
									}`}>
								{selectedId ? 'Update' : 'Create'}
							</button>
						</div>
					</form>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
