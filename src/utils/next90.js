import _ from "lodash";

function next90(curAng, right) {
  var rightDegs = [0, 90, 180, 270, 360];
  var nextAngle = right
    ? _.find(rightDegs, d => curAng < d)
    : _.findLast(rightDegs, d => curAng > d);
  nextAngle = nextAngle === undefined ? curAng : nextAngle;
  return nextAngle;
}

export default next90;
