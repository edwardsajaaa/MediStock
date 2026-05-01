const normalizeRole = (value) => {
  const raw = String(value || '').trim().toLowerCase()

  if (!raw) return 'Staf Farmasi'
  if (['admin', 'administrator', 'superadmin'].includes(raw)) return 'Admin'
  if (['staf', 'staff', 'staf farmasi', 'farmasi'].includes(raw)) return 'Staf Farmasi'

  return String(value)
}

export const useAuthRole = () => {
  const user = useSupabaseUser()

  const role = computed(() => {
    const metadataRole = user.value?.user_metadata?.role || user.value?.app_metadata?.role || user.value?.user_metadata?.user_role
    return normalizeRole(metadataRole)
  })

  const isAdmin = computed(() => role.value === 'Admin')
  const isStaff = computed(() => role.value === 'Staf Farmasi')

  return {
    user,
    role,
    isAdmin,
    isStaff,
  }
}