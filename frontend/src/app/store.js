import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../features/user/userSlicer.js'
import { persistReducer , persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const rootReducer = combineReducers({user:userSlice.reducer})

const persistConfig= {
    key: 'root',
    storage,
    version: 1

}

const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=> 
  getDefaultMiddleware({
    serializableCheck: false
    })
})

export const persistor = persistStore(store);