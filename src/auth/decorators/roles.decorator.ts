import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles' as const;


export const Roles = (...roles: Role[]) => {
    if (roles.length === 0) {
        throw new Error('At least one role must be provided to @Roles decorator');
    }
    return SetMetadata(ROLES_KEY, roles);
};
