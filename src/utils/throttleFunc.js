function throttleFunc(param, dispFunc, throttleLimitRef) {
  throttleLimitRef.current = true;
  dispFunc(param);
  setTimeout(() => {
    throttleLimitRef.current = false;
  }, 10);
}
export default throttleFunc;
