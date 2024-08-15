//  assigning permissions for each role player

export const roles = [
    {
        role: 'superadmin',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_user',
            'read_users',
            'update_user',
            'delete_user',
            'create_letter', /*  letter has been placed there as a placeholder for when the backend partner works on his part*/
            'update_letter',
            'delete_letter',
        ]
    },
    {
        role: 'admin',
        permissions: [
            'update_profile',
            'delete_profile',
            'read_users',
            'update_user',
            'create_letter',
            'update_letter',
        ]
    },
    {
        role: 'manager',
        permissions: [
            'update_profile',
            'delete_profile',
            'create_letter',
        ]
    },
    {
        role: 'user',
        permissions: [
            'update_profile',
            'delete_profile',
        ]
    }
];

//  to work on admin cont and routes later