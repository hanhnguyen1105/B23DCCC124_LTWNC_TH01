import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import { assignmentApi } from './assignmentApi'
import type { Assignment, AssignmentDraft, AsyncState } from './types'

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async () => assignmentApi.getAssignments(),
)

const initialState: AsyncState<Assignment[]> = {
  data: [],
  status: 'idle',
  error: null,
}

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: (state, action: { payload: AssignmentDraft }) => {
      state.data.unshift({
        ...action.payload,
        id: nanoid(),
        completed: false,
      })
    },
    toggleAssignment: (state, action: { payload: string }) => {
      const assignment = state.data.find(({ id }) => id === action.payload)
      if (assignment) assignment.completed = !assignment.completed
    },
    deleteAssignment: (state, action: { payload: string }) => {
      state.data = state.data.filter(({ id }) => id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Không thể tải danh sách bài tập.'
      })
  },
})

export const { addAssignment, toggleAssignment, deleteAssignment } =
  assignmentSlice.actions

export default assignmentSlice.reducer
