import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantService {
	getModuleNameList() {
		return [
			{
				value: 'role-permission',
				label: 'Role Management',
			},
			{ value: 'user', label: 'User Management' },
			{ value: 'file', label: 'File Management' },
		];
	}

	getPermissionTypeList() {
		return [
			{ value: 'create', label: 'Create' },
			{ value: 'read', label: 'Read' },
			{ value: 'update', label: 'Update' },
			{ value: 'delete', label: 'Delete' },
		];
	}
}
