import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  token: string;
}

const initialState: CounterState = {
  value: 0,
  token: "eyJraWQiOiJFa0I1SkxyV0R3R0NpV2xvWHl6dEVVUCtqcU9wSDlYNlFoN2t5dHZoU2d3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2YzFjOWQ5Ni1jZmVkLTQ2OGUtOWZkNC01Mjc0NjU1MGM1NGMiLCJjdXN0b206cm9sZXMiOiJHUk9VUF9BRE1JTiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9md1A5aU5NZ0EiLCJjb2duaXRvOnVzZXJuYW1lIjoiNmMxYzlkOTYtY2ZlZC00NjhlLTlmZDQtNTI3NDY1NTBjNTRjIiwib3JpZ2luX2p0aSI6IjUzNjE3NTI5LTUyNTMtNGMyMy04ODlhLWNiOGQxMTAwNjMyOCIsImF1ZCI6IjVsM2hlNmJwN3BrNWxibzQ1Nmw3MmMzZmxuIiwiZXZlbnRfaWQiOiJhZmQ3ZjM2OC0wMDBhLTQwZTMtYmQzZC02OWY0YWE2NGMzMWIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc3Nzk5MjI3NiwibmFtZSI6IlByaXlhbmthIiwiZXhwIjoxNzc4MDc4Njc2LCJpYXQiOjE3Nzc5OTIyNzYsImp0aSI6ImRiZWZlMDc0LTcyOGItNGQ0My1hOTQwLTExMDI1OTZlM2I2OSIsImVtYWlsIjoicHJpeWFua2Euc2hhcm1hQGZhcmVuZXh1cy5jb20ifQ.i5UwIFih7SjtLACs3kiIee9AcrMB-9T8lq5Qd33yptpB1eW776V4oZB21XUeqgVNwBr6PbSABSI0akMODkH7RMwbSFrAg063Etg7v1XskvxjK2qABSlERvO-ewJ6Dgvu6VQSRePC3kwoLMmS6wRHKtTTLSYaXbX8MF_QEeNIUisJ7swcsj_TJaTuOJILThpdnaLhpQv2WZYNIYOcjqg0APdWb1hTpn4Qw-wae5jcwSUHxtatIYmG9PZUPGmpbKqXWJNj0P-KKjuvpulINkJMhxUayuRZu9GQ5wSUH_h5VPQCR71wGiZV30_A87SOtuvKMXy2766KGHom3XlAy22IeQ"
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