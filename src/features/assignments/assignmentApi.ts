import type { Assignment } from './types'
import { isAssignmentArray } from './types'

const today = new Date()
const dateAfter = (days: number) => {
  const date = new Date(today)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const sampleAssignments: Assignment[] = [
  {
    id: 'sample-1',
    subject: 'Lập trình Web nâng cao',
    title: 'Xây dựng ứng dụng quản lý deadline',
    dueDate: dateAfter(2),
    priority: 'high',
    completed: false,
  },
  {
    id: 'sample-2',
    subject: 'Cơ sở dữ liệu',
    title: 'Thiết kế và chuẩn hóa cơ sở dữ liệu',
    dueDate: dateAfter(5),
    priority: 'medium',
    completed: false,
  },
  {
    id: 'sample-3',
    subject: 'Phân tích thiết kế hệ thống',
    title: 'Vẽ sơ đồ use case cho hệ thống',
    dueDate: dateAfter(-2),
    priority: 'high',
    completed: false,
  },
  {
    id: 'sample-4',
    subject: 'Tiếng Anh chuyên ngành',
    title: 'Thuyết trình nhóm: Công nghệ tương lai',
    dueDate: dateAfter(9),
    priority: 'low',
    completed: false,
  },
  {
    id: 'sample-5',
    subject: 'Toán rời rạc',
    title: 'Bài tập chương 4 — Đồ thị',
    dueDate: dateAfter(-1),
    priority: 'medium',
    completed: true,
  },
]

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds))

export const assignmentApi = {
  async getAssignments(): Promise<Assignment[]> {
    await delay(500)

    const response: unknown = structuredClone(sampleAssignments)
    if (!isAssignmentArray(response)) {
      throw new Error('Dữ liệu bài tập từ API không hợp lệ.')
    }

    return response
  },
}
