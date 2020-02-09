function incrementToNextAngle(curAng, nextAngle, setAng, intervalTime, right) {
  var interval = setInterval(() => {
    var inc = 0;
    if (curAng === nextAngle) {
      clearInterval(interval);
    } else {
      inc = right ? ++curAng : --curAng;
      setAng(inc);
      console.log("rotating right 1 deg");
    }
  }, intervalTime);
}

export default incrementToNextAngle;
