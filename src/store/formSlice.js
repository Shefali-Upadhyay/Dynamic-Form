import { createSlice } from "@reduxjs/toolkit";

const initialFormState = {
  values: {},
  errors: {},
};

const formSlice = createSlice({
  name: "form",
  initialState: initialFormState,
  reducers: {
    setValue(state, action) {
      const { id, value } = action.payload;
      state.values[id] = value;
    },
    setValues(state, action) {
      state.values = { ...state.values, ...action.payload };
    },
    setError(state, action) {
      const { id, error } = action.payload;
      if (error) state.errors[id] = error;
      else delete state.errors[id];
    },
    clearErrors(state) {
      state.errors = {};
    },
    resetForm(state) {
      state.values = {};
      state.errors = {};
    },
  },
});

export const { setValue, setValues, setError, clearErrors, resetForm } =
  formSlice.actions;
export default formSlice.reducer;
