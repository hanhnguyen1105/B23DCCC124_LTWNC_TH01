import { useEffect, useMemo, useState } from 'react'
import { AssignmentForm } from './features/assignments/AssignmentForm'
import { AssignmentList } from './features/assignments/AssignmentList'
import FilterTabs from './features/assignments/FilterTabs'
import {
  assignmentFilters,
  useAssignments,
} from './features/assignments/useAssignments'
import type { AssignmentFilter } from './features/assignments/types'
import './App.css'

type AssignmentView = 'list' | 'board'
type AssignmentSort = 'dueDate' | 'priority'

function App() {
  const [filter, setFilter] = useState<AssignmentFilter>('all')
  const [view, setView] = useState<AssignmentView>('list')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<AssignmentSort>('dueDate')
  const {
    assignments,
    counts,
    isLoading,
    error,
    loadAssignments,
    addAssignment,
    toggleAssignment,
    deleteAssignment,
  } = useAssignments(filter)

  useEffect(() => {
    void loadAssignments()
  }, [loadAssignments])

  const totalCount = counts.all
  const doneCount = counts.completed
  const progress = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)
  const dueSoonCount = counts.dueSoon
  const visibleAssignments = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi')
    return assignments
      .filter((assignment) =>
        `${assignment.subject} ${assignment.title}`
          .toLocaleLowerCase('vi')
          .includes(normalizedSearch),
      )
      .toSorted((first, second) => {
        if (sort === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return (
            priorityOrder[first.priority] - priorityOrder[second.priority] ||
            first.dueDate.localeCompare(second.dueDate)
          )
        }
        return first.dueDate.localeCompare(second.dueDate)
      })
  }, [assignments, search, sort])

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Deadline — Trang chủ">
          <span className="brand-mark" aria-hidden="true">🎀</span>
          <span className="brand-name">deadline<span className="brand-period">.</span><small>KAWAII PLANNER</small></span>
        </a>
        <div className="topbar-tags">
          <span className="topbar-tag">🌸 PLANNER CÁ NHÂN</span>
          <span className="topbar-tag topbar-tag-note">💌 Không còn nỗi lo trễ hạn — Học kỳ này thật vui nhé!</span>
          <span className="topbar-tag">📚 HỌC KỲ 2026 – 2027</span>
          <span className="topbar-tag profile-tag"><span className="avatar">🐰</span> Sinh viên PTIT</span>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 🌸 HỌC KỲ NGỌT NGÀO, THẢNH THƠI NỘP BÀI</div>
          <h1>Việc cần làm,<br /><span>đúng hạn nha!</span><span className="hero-bow" aria-hidden="true">🎀✨</span></h1>
          <p>Góc nhỏ xinh xắn để bạn quản lý bài tập, sắp xếp mọi thứ gọn gàng và giữ cho tâm trạng luôn vui vẻ, rạng rỡ mỗi ngày đến trường 🧸💕</p>
          <div className="hero-actions">
            <a className="hero-link" href="#assignments">Xem kế hoạch chi tiết <span aria-hidden="true">👇</span></a>
            <a className="hero-add-link" href="#add-assignment">✨ Phím tắt: Thêm nhanh bài mới</a>
          </div>
        </div>
        <div className="progress-card" aria-label={`Đã hoàn thành ${doneCount} trên ${totalCount} bài tập`}>
          <div className="progress-card-top">
            <div>
              <span className="card-kicker">🌷 TIẾN ĐỘ HỌC TẬP</span>
              <div className="progress-number">{progress}<span>%</span></div>
            </div>
            <div className="progress-icon" aria-hidden="true">💝</div>
          </div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <div className="progress-caption">
            <span>{doneCount} / {totalCount} bài hoàn thành 🎉</span>
            <span>{totalCount - doneCount} còn lại 🔔</span>
          </div>
          <div className="progress-stats">
            <div><span>⏰ SẮP ĐẾN HẠN (48H)</span><strong>{dueSoonCount} bài</strong></div>
            <div><span>🔴 QUÁ HẠN</span><strong>{counts.overdue} bài</strong></div>
          </div>
          <div className="progress-note"><span aria-hidden="true">✨</span> “Cố gắng một chút mỗi ngày, nhận điểm 10 ngọt ngào nha!” 🌸</div>
        </div>
        <div className="hero-decoration" aria-hidden="true">♡<br />✿<br />♡</div>
      </section>

      <section className="workspace" id="assignments">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow"><span /> 🎀 BẢNG ĐIỀU KHIỂN XINH</div>
            <h2>Lịch bài tập &amp; đồ án 🍓</h2>
            <p className="section-subtitle">Gom hết deadline vào một chỗ, học phần tên mình mà không sợ quên bài.</p>
          </div>
          <div className="view-switch" role="group" aria-label="Kiểu hiển thị">
            <button className={view === 'list' ? 'view-button selected' : 'view-button'} type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>☰ Danh sách</button>
            <button className={view === 'board' ? 'view-button selected' : 'view-button'} type="button" aria-pressed={view === 'board'} onClick={() => setView('board')}>🎀 Kanban (Cute)</button>
          </div>
        </div>

        <div id="add-assignment">
          <AssignmentForm onSubmit={addAssignment} />
        </div>

        <div className="list-toolbar">
          <div className="filter-tabs-wrap">
            <FilterTabs value={filter} onChange={setFilter}>
              {assignmentFilters.map(({ value, label }) => (
                <FilterTabs.Option
                  key={value}
                  value={value}
                  label={label}
                  count={counts[value]}
                />
              ))}
            </FilterTabs>
          </div>
          <label className="search-field">
            <span aria-hidden="true">🔍</span>
            <input
              aria-label="Tìm môn học hoặc bài tập"
              placeholder="Tìm môn học hoặc bài tập..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="sort-field">
            <span>Sắp xếp:</span>
            <select
              value={sort}
              onChange={(event) => {
                const value = event.target.value
                if (value === 'dueDate' || value === 'priority') setSort(value)
              }}
            >
              <option value="dueDate">⏰ Hạn nộp: Gần nhất</option>
              <option value="priority">⭐ Ưu tiên: Cao nhất</option>
            </select>
          </label>
        </div>

        {error && (
          <div className="notice notice-error" role="alert">
            <span>{error}</span>
            <button className="text-button" type="button" onClick={() => void loadAssignments()}>Thử lại</button>
          </div>
        )}

        <AssignmentList
          assignments={visibleAssignments}
          isLoading={isLoading}
          filter={filter}
          view={view}
          search={search}
          onToggle={toggleAssignment}
          onDelete={deleteAssignment}
        />
      </section>

      <footer className="footer">
        <span className="footer-brand">deadline. 🎀 <span>Nền tảng quản lý deadline học tập xinh xắn ngọt ngào &amp; cute</span></span>
        <span className="footer-year">Made with 💗 • Student Planner 2026</span>
      </footer>
    </main>
  )
}

export default App
