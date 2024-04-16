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
      return state.filter(file => file.id !== action.payload.id)
    }
  }
})

export const { addFile, removeFile } = uploadHistoryFilesSlice.actions

export default uploadHistoryFilesSlice.reducer