export const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

export const initials = (name = '') =>
  name
    .replace(/^(Dr|Prof|Mr|Ms|Mrs)\.?\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

export const daysUntil = (iso) => {
  const end = new Date(iso + 'T23:59:59')
  return Math.max(0, Math.ceil((end - new Date()) / 86400000))
}

export const downloadCsv = (filename, rows) => {
  const csv = rows
    .map((r) => r.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const ROLE_LABEL = {
  student: 'Student',
  advisor: 'Academic advisor',
  staff: 'Department staff',
  lecturer: 'Lecturer',
  head: 'Department head',
  admin: 'System administrator',
}
