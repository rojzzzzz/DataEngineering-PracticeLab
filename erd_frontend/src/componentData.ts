// A one-item JSON envelope bypasses Streamlit's dataframe auto-detection and
// its costly first-use imports. Accept old payloads during rolling reloads.
export function componentData<T>(data: T | [T]): T {
  return Array.isArray(data) ? data[0] : data;
}
