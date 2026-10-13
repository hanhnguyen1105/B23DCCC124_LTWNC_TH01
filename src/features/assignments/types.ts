export const priorities = ['low', 'medium', 'high'] as const

export type Priority = (typeof priorities)[number]
export type AssignmentFilter = 'all' | 'active' | 'overdue' | 'completed'

interface AssignmentFields {
  subject: string
  title: string
  dueDate: string
  priority: Priority
}

export type AssignmentDraft = Pick<
  AssignmentFields,
  'subject' | 'title' | 'dueDate' | 'priority'
>

export interface Assignment extends AssignmentFields {
  id: string
  completed: boolean
}

export interface AsyncState<T> {
  data: T
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

export const isPriority = (value: unknown): value is Priority =>
  typeof value === 'string' && priorities.some((priority) => priority === value)

export const isAssignment = (value: unknown): value is Assignment => {
  if (typeof value !== 'object' || value === null) return false

  const assignment = value as Record<string, unknown>
  return (
    typeof assignment.id === 'string' &&
    typeof assignment.subject === 'string' &&
    typeof assignment.title === 'string' &&
    typeof assignment.dueDate === 'string' &&
    isPriority(assignment.priority) &&
    typeof assignment.completed === 'boolean'
  )
}

export const isAssignmentArray = (value: unknown): value is Assignment[] =>
  Array.isArray(value) && value.every(isAssignment)
