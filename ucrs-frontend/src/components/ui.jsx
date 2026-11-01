import { useEffect } from 'react'
import { X, CircleCheck, CircleX } from 'lucide-react'

const LABELS = {
  pending: 'Pending', approved: 'Approved', rejected: 'Rejected', dropped: 'Dropped',
  open: 'Open', closed: 'Closed', active: 'Active', inactive: 'Inactive',
}

export const StatusBadge = ({ status }) => <span className={`badge ${status}`}>{LABELS[status] || status}</span>

export function CapacityBar({ taken, capacity }) {
  const pct = Math.min(100, Math.round((taken / capacity) * 100))
  const cls = pct >= 100 ? 'full' : pct >= 85 ? 'warn' : ''
  return (
    <div className="cap" aria-label={`${taken} of ${capacity} seats taken`}>
      <div className="cap-text">
        <span>{taken} / {capacity} seats</span>
        <span>{pct >= 100 ? 'Full' : `${capacity - taken} left`}</span>
      </div>
      <div className="cap-track"><div className={`cap-fill ${cls}`} style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="actions">{children}</div>}
    </div>
  )
}

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export const Empty = ({ title, text, children }) => (
  <div className="empty">
    <h3>{title}</h3>
    <p>{text}</p>
    {children}
  </div>
)

export const Check = ({ ok }) =>
  ok ? <CircleCheck size={20} className="ico ok" /> : <CircleX size={20} className="ico bad" />

export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`toast ${toast.type === 'error' ? 'error' : ''}`} role="status" key={toast.id}>
      {toast.type === 'error' ? <CircleX size={18} /> : <CircleCheck size={18} />}
      <span>{toast.message}</span>
    </div>
  )
}
