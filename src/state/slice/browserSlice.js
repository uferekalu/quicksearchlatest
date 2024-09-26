import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  query: '',
  phaseCache: 1,
  engine: 'google',
}

const browserSlice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    setQueryState: (state, action) => {
      state.query = action.payload.query
    },
    setPhaseCacheState: (state, action) => {
      state.phaseCache = action.payload.phase
    },
    setEngineState: (state, action) => {
      state.engine = action.payload
    },
  },
})

export const { setQueryState, setPhaseCacheState, setEngineState } =
  browserSlice.actions

export default browserSlice.reducer
