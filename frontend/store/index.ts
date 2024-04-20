import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import settingsReducer from './settings'
import uploadHistoryCollectionsReducer from './uploadHistoryCollections'
import uploadHistoryFilesReducer from './uploadHistoryFiles'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const reducers = combineReducers({
  uploadHistoryFiles: uploadHistoryFilesReducer,
  uploadHistoryCollections: uploadHistoryCollectionsReducer,
  settings: settingsReducer,
})

const persistConfig = {
  key: 'fdl',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>