export const userAccountRoleToDisplayName = (role: 'owner' | 'member' | 'invited') => {
  switch (role) {
    case 'owner': return 'Владелец'
    case 'member': return 'Участник'
    case 'invited': return 'Приглашен'
    default:
      throw new Error('Unreachable')
  }
}
