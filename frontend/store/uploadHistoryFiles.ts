import { createSlice } from '@reduxjs/toolkit'

interface File {
  id: string
  name: string
  size: number
  password: string
}

const uploadHistoryFilesSlice = createSlice({
  name: 'uploadHistoryFiles',
  initialState: [] as File[],
  reducers: {
    addFile: (state, action) => {
      state.push(action.payload)
    },
    removeFile: (state, action) => {
      const index = state.findIndex(file => file.id === action.payload)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }
  }
})

export const { addFile, removeFile } = uploadHistoryFilesSlice.actions

export default uploadHistoryFilesSlice.reducer