import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import settingsReducer from './settings'
import uploadHistoryCollectionsReducer from './uploadHistoryCollections'
import uploadHistoryFilesReducer from './uploadHistoryFiles'

export const store = configureStore({
  reducer: combineReducers({
    uploadHistoryFiles: uploadHistoryFilesReducer,
    uploadHistoryCollections: uploadHistoryCollectionsReducer,
    settings: settingsReducer,
  })
})