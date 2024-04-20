import { createSlice } from '@reduxjs/toolkit'

interface Collection {
  id: string
  password: string
  files: string[]
}

const uploadHistoryCollectionsSlice = createSlice({
  name: 'uploadHistoryCollections',
  initialState: [] as Collection[],
  reducers: {
    addCollection: (state, action) => {
      state.push(action.payload)
    },
    removeCollection: (state, action) => {
      return state.filter(collection => collection.id !== action.payload.id)
    }
  }
})

export const { addCollection, removeCollection } = uploadHistoryCollectionsSlice.actions

export default uploadHistoryCollectionsSlice.reducer