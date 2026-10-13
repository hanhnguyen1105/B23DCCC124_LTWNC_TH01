import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  addAssignment as addAssignmentAction,
  deleteAssignment as deleteAssignmentAction,
  fetchAssignments,
  toggleAssignment as toggleAssignmentAction,
} from './assignmentSlice'
import { getDaysUntilDue } from './dateUtils'
import type { AssignmentDraft, AssignmentFilter } from './types'

export const assignmentFilters: {
  value: AssignmentFilter
  label: string
}[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'active', label: 'Chưa hoàn thành' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'completed', label: 'Đã hoàn thành' },
]

export const useAssignments = (filter: AssignmentFilter) => {
  const dispatch = useAppDispatch()
  const { data, status, error } = useAppSelector((state) => state.assignments)

  const counts = useMemo(() => {
    const activeAssignments = data.filter((item) => !item.completed)
    return {
      all: data.length,
      active: activeAssignments.length,
      overdue: activeAssignments.filter(
        (item) => getDaysUntilDue(item.dueDate) < 0,
      ).length,
      dueSoon: activeAssignments.filter((item) => {
        const daysRemaining = getDaysUntilDue(item.dueDate)
        return daysRemaining >= 0 && daysRemaining <= 2
      }).length,
      completed: data.filter((item) => item.completed).length,
    }
  }, [data])

  const assignments = useMemo(() => {
    switch (filter) {
      case 'active':
        return data.filter((item) => !item.completed)
      case 'overdue':
        return data.filter(
          (item) => !item.completed && getDaysUntilDue(item.dueDate) < 0,
        )
      case 'completed':
        return data.filter((item) => item.completed)
      case 'all':
        return data
    }
  }, [data, filter])

  const loadAssignments = useCallback(
    () => dispatch(fetchAssignments()),
    [dispatch],
  )
  const addAssignment = useCallback(
    (assignment: AssignmentDraft) => dispatch(addAssignmentAction(assignment)),
    [dispatch],
  )
  const toggleAssignment = useCallback(
    (id: string) => dispatch(toggleAssignmentAction(id)),
    [dispatch],
  )
  const deleteAssignment = useCallback(
    (id: string) => dispatch(deleteAssignmentAction(id)),
    [dispatch],
  )

  return {
    assignments,
    counts,
    isLoading: status === 'loading',
    error,
    loadAssignments,
    addAssignment,
    toggleAssignment,
    deleteAssignment,
  }
}
