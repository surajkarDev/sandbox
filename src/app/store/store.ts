import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  token: string;
}

const initialState: CounterState = {
  value: 0,
  token: "eyJraWQiOiJFa0I1SkxyV0R3R0NpV2xvWHl6dEVVUCtqcU9wSDlYNlFoN2t5dHZoU2d3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4ZDYzYzUwMC1hMWRmLTRjZTEtOTQ1Ny0zMmEzMjliNDg4NzUiLCJjdXN0b206cm9sZXMiOiJHUk9VUF9BRE1JTiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9md1A5aU5NZ0EiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGQ2M2M1MDAtYTFkZi00Y2UxLTk0NTctMzJhMzI5YjQ4ODc1Iiwib3JpZ2luX2p0aSI6IjRkYTU0ZmRjLTdlM2QtNDI1Ni04MzQ0LTE1MWNlN2Q3Yjg5NCIsImF1ZCI6IjVsM2hlNmJwN3BrNWxibzQ1Nmw3MmMzZmxuIiwiZXZlbnRfaWQiOiI1OTU4ZjJjMS1mMWM3LTQzOTktYWExMi03ZmUyM2MwNTZlN2UiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc3NTQ5NzMxOCwibmFtZSI6IkhpbWFuc2h1IFBhbCIsImV4cCI6MTc3NTU4MzcxOCwiaWF0IjoxNzc1NDk3MzE4LCJqdGkiOiI3ZjRhMmM1Mi1mMGIxLTRjM2YtYjc2NC04ZDk5MTNkNDQ1MTAiLCJlbWFpbCI6ImhpbWFuc2h1LnBhbEBmYXJlbmV4dXMuY29tIn0.k5wYHG6xb338H5e34lAoLAEwlRNHvD0UgXVBG6h3GzJ2DwTPaIiULLLGbDyvUEYaYn21HEegT8cwJbUQAJQXFs5CKt6Qbccu0JkLyw8FMI1MUPajRhd8Y8J-i8njdfq1ayt2Lz52YIrcii6QmTDEajd0NBPhK82XiS93fqz9HQxgm24oiUpkTRJbg5TlLyjinKGLGLdSORk0AOYIhiFSGic4NRqeJUu-aaBUZZfXTU27Od14Mm0j3JPePE2lWkgoLKGrUqiEgx4eopvX73MyYCVfOzruYxmHx1kC-e1b2vqX_X58z6efuT7VkBhEAk7Ucxne3CHRdjc77qtTn29dBw"
};

// 3. Create Slice
const centeralStore = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// 4. Export Actions
export const { increment, decrement, incrementByAmount } = centeralStore.actions;

// 5. Export Reducer
export default centeralStore.reducer;