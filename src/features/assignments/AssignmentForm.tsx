import { useState, type FormEvent } from 'react'
import { isPriority, type AssignmentDraft } from './types'

interface AssignmentFormProps {
  onSubmit: (assignment: AssignmentDraft) => void
}

const initialForm: AssignmentDraft = {
  subject: '',
  title: '',
  dueDate: '',
  priority: 'medium',
}

export function AssignmentForm({ onSubmit }: AssignmentFormProps) {
  const [form, setForm] = useState<AssignmentDraft>(initialForm)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({
      subject: form.subject.trim(),
      title: form.title.trim(),
      dueDate: form.dueDate,
      priority: form.priority,
    })
    setForm(initialForm)
  }

  return (
    <form className="assignment-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div className="form-icon" aria-hidden="true">📝</div>
        <div>
          <h3>Thêm bài tập mới dễ thương</h3>
          <p>Ghi lại ngay để bạn luôn an tâm thảnh thơi nha! 🧸</p>
        </div>
      </div>
      <div className="form-fields">
        <label className="form-field subject-field">
          <span>🌸 MÔN HỌC</span>
          <input
            required
            maxLength={80}
            placeholder="Ví dụ: Lập trình Web"
            value={form.subject}
            onChange={(event) => setForm({ ...form, subject: event.target.value })}
          />
        </label>
        <label className="form-field title-field">
          <span>💌 NHIỆM VỤ CẦN LÀM</span>
          <input
            required
            maxLength={120}
            placeholder="Bạn cần hoàn thành việc gì?"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
        </label>
        <label className="form-field date-field">
          <span>🗓️ HẠN NỘP</span>
          <input
            required
            type="date"
            value={form.dueDate}
            onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
          />
        </label>
        <label className="form-field priority-field">
          <span>🌼 ƯU TIÊN</span>
          <select
            value={form.priority}
            onChange={(event) => {
              const priority = event.target.value
              if (isPriority(priority)) setForm({ ...form, priority })
            }}
          >
            <option value="high">🔥 Cao</option>
            <option value="medium">⭐ Vừa</option>
            <option value="low">🌱 Thấp</option>
          </select>
        </label>
        <button className="add-button" type="submit">
          <span aria-hidden="true">💖</span> Thêm bài tập liền!
        </button>
      </div>
    </form>
  )
}
