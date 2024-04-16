import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    backendUrl: ''
  },
  reducers: {
    setBackendUrl: (state, action) => {
      state.backendUrl = action.payload
    }
  }
})

export const { setBackendUrl } = settingsSlice.actions

export default settingsSlice.reducer