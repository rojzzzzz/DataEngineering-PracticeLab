declare module "*?worker&inline" {
  const Constructor: { new (): Worker };
  export default Constructor;
}
