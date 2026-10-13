import type { Assignment, AssignmentFilter } from './types'
import { formatDueDate, getDaysUntilDue } from './dateUtils'

type AssignmentView = 'list' | 'board'

interface AssignmentListProps {
  assignments: Assignment[]
  isLoading: boolean
  filter: AssignmentFilter
  view: AssignmentView
  search: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

const priorityLabels: Record<Assignment['priority'], string> = {
  high: 'Cao',
  medium: 'Vừa',
  low: 'Thấp',
}

const emptyMessages: Record<AssignmentFilter, string> = {
  all: 'Danh sách đang trống. Thêm bài tập đầu tiên của bạn nhé!',
  active: 'Tuyệt vời! Bạn đã hoàn thành tất cả bài tập.',
  overdue: 'Không có bài tập nào quá hạn. Bạn đang làm rất tốt!',
  completed: 'Bài tập đã hoàn thành sẽ xuất hiện ở đây.',
}

function AssignmentItem({
  assignment,
  onToggle,
  onDelete,
}: {
  assignment: Assignment
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  const daysRemaining = getDaysUntilDue(assignment.dueDate)
  const isOverdue = !assignment.completed && daysRemaining < 0

  let dueLabel = 'Hạn nộp hôm nay'
  if (daysRemaining > 0) dueLabel = `Còn ${daysRemaining} ngày`
  if (daysRemaining < 0) dueLabel = `Quá hạn ${Math.abs(daysRemaining)} ngày`
  if (assignment.completed) dueLabel = 'Đã hoàn thành'

  return (
    <>
      <div className="assignment-status-cell">
        <button
          aria-label={assignment.completed ? `Bỏ hoàn thành ${assignment.title}` : `Đánh dấu hoàn thành ${assignment.title}`}
          aria-pressed={assignment.completed}
          className={`complete-toggle${assignment.completed ? ' checked' : ''}`}
          onClick={() => onToggle(assignment.id)}
          type="button"
        >
          {assignment.completed ? '✓' : ''}
        </button>
      </div>
      <div className="assignment-name-cell">
        <h4 className="assignment-title">{assignment.title}</h4>
        {isOverdue && <span className="overdue-flag">⚠ Đang trễ hạn</span>}
      </div>
      <div className="assignment-subject-cell">
        <span className="subject-emoji" aria-hidden="true">🍓</span>
        {assignment.subject}
      </div>
      <div className="assignment-priority-cell">
        <span className={`priority-pill priority-${assignment.priority}`}>
          <span aria-hidden="true">{assignment.priority === 'high' ? '🔥' : assignment.priority === 'medium' ? '⭐' : '🌱'}</span>
          {priorityLabels[assignment.priority]}
        </span>
      </div>
      <div className="assignment-due-cell">
        <span className={`due-label${isOverdue ? ' overdue' : ''}${assignment.completed ? ' complete-label' : ''}`}>
          <strong>{formatDueDate(assignment.dueDate)}</strong>
          <small>{!assignment.completed && <span className="due-dot" aria-hidden="true" />}{dueLabel}</small>
        </span>
      </div>
      <div className="assignment-delete-cell">
        <button
          aria-label={`Xóa ${assignment.title}`}
          className="delete-button"
          onClick={() => onDelete(assignment.id)}
          title="Xóa bài tập"
          type="button"
        >
          🗑️
        </button>
      </div>
    </>
  )
}

const boardColumns = [
  { key: 'active', label: '💌 Đang thực hiện', className: 'board-active' },
  { key: 'overdue', label: '⏰ Sắp/quá hạn', className: 'board-overdue' },
  { key: 'completed', label: '🌸 Đã hoàn thành', className: 'board-completed' },
] as const

export function AssignmentList({
  assignments,
  isLoading,
  filter,
  view,
  search,
  onToggle,
  onDelete,
}: AssignmentListProps) {
  if (isLoading && assignments.length === 0) {
    return <div className="list-message" role="status">Đang gom những bài tập xinh xắn của bạn<span className="loading-dots">...</span> 💌</div>
  }

  if (assignments.length === 0) {
    return (
      <div className="list-message empty-message">
        <span className="empty-icon" aria-hidden="true">🧸</span>
        <p>{search.trim() ? 'Không tìm thấy bài tập phù hợp, thử từ khóa khác nhé! 🔍' : emptyMessages[filter]}</p>
      </div>
    )
  }

  if (view === 'board') {
    return (
      <div className="kanban-board">
        {boardColumns.map((column) => {
          const columnAssignments = assignments.filter((assignment) => {
            if (column.key === 'completed') return assignment.completed
            if (column.key === 'overdue') {
              return !assignment.completed && getDaysUntilDue(assignment.dueDate) < 0
            }
            return !assignment.completed && getDaysUntilDue(assignment.dueDate) >= 0
          })

          return (
            <section className={`kanban-column ${column.className}`} key={column.key}>
              <h3>{column.label}<span>{columnAssignments.length}</span></h3>
              <div className="kanban-column-items">
                {columnAssignments.length === 0 ? (
                  <p className="kanban-empty">Chưa có bài tập nè 🌷</p>
                ) : columnAssignments.map((assignment) => (
                  <article
                    className={`kanban-card${assignment.completed ? ' is-complete' : ''}`}
                    key={assignment.id}
                  >
                    <div className="kanban-card-top">
                      <span className={`priority-pill priority-${assignment.priority}`}>
                        {assignment.priority === 'high' ? '🔥' : assignment.priority === 'medium' ? '⭐' : '🌱'} {priorityLabels[assignment.priority]}
                      </span>
                      <button
                        aria-label={`Xóa ${assignment.title}`}
                        className="delete-button"
                        onClick={() => onDelete(assignment.id)}
                        type="button"
                      >🗑️</button>
                    </div>
                    <button
                      aria-label={assignment.completed ? `Bỏ hoàn thành ${assignment.title}` : `Đánh dấu hoàn thành ${assignment.title}`}
                      aria-pressed={assignment.completed}
                      className="kanban-title-button"
                      onClick={() => onToggle(assignment.id)}
                      type="button"
                    >
                      {assignment.title}
                    </button>
                    <span className="kanban-subject">🍓 {assignment.subject}</span>
                    <span className={`kanban-due${!assignment.completed && getDaysUntilDue(assignment.dueDate) < 0 ? ' overdue' : ''}`}>
                      📅 {formatDueDate(assignment.dueDate)} · {assignment.completed ? 'Đã xong' : getDaysUntilDue(assignment.dueDate) < 0 ? `Trễ ${Math.abs(getDaysUntilDue(assignment.dueDate))} ngày` : getDaysUntilDue(assignment.dueDate) === 0 ? 'Hôm nay' : `Còn ${getDaysUntilDue(assignment.dueDate)} ngày`}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  return (
    <div className="assignment-table">
      <div className="assignment-table-header">
        <span>TRẠNG THÁI</span>
        <span>BÀI TẬP / NHIỆM VỤ 💌</span>
        <span>MÔN HỌC 🍓</span>
        <span>ƯU TIÊN 🌼</span>
        <span>HẠN CHÓT &amp; COUNTDOWN ⏰</span>
        <span>XÓA 🗑️</span>
      </div>
      {assignments.map((assignment) => (
        <article
          className={`assignment-row${assignment.completed ? ' is-complete' : ''}`}
          key={assignment.id}
        >
          <AssignmentItem
            assignment={assignment}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </article>
      ))}
    </div>
  )
}
