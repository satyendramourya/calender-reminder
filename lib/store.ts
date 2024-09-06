
import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import reminderSlice from './reminder-slice'
import { persistStore, persistReducer } from 'redux-persist'

// Create a root reducer
const rootReducer = combineReducers({
    reminders: reminderSlice,
})

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
}

// Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store with persisted reducer
export const store = configureStore({
    reducer: persistedReducer
})

// Create persistor
export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>