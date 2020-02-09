import { easePolyInOut } from "d3";

function getRotationArray(totalDegrees, rotationStepTime, rotationStep) {
  if (typeof easePolyInOut === "undefined") {
    console.error(`import {easePolyInOut} from "d3"`);
  }
  if (totalDegrees === 0) {
    console.log("totalDegrees === 0", totalDegrees === 0);
    return;
  }
  var clockwise = totalDegrees > 0 ? true : false;

  console.log("totalDegrees, rotationStep", totalDegrees, rotationStep);
  var frames = Array(Math.abs(totalDegrees / rotationStep));
  frames.fill(1);
  var numFrames = frames.length;
  var interpFrams = 1 / numFrames;

  var rotationArray = frames.reduce((acc, cur, idx, arr) => {
    idx += 1;
    var interpN = Math.round(100000 * interpFrams * idx) / 100000;
    acc.push({
      msLinear: idx * rotationStepTime,
      totRotLinear: clockwise ? idx * rotationStep : -idx * rotationStep,
      rotIncLinear: clockwise ? rotationStep : -rotationStep,
      interpLinear: interpN,
      interpEase: Math.round(easePolyInOut(interpN) * 1000000000) / 1000000000
    });
    return acc;
  }, []);

  //put two following map function into 1 reduce function
  var easeRotationArray = rotationArray.map((cur, idx) => {
    var msEase =
      Math.round(10000000 * cur.msLinear * cur.interpEase) / 10000000;
    var totRotEase =
      Math.round(10000000 * cur.totRotLinear * cur.interpEase) / 10000000;
    return {
      msEase,
      totRotEase,
      ...cur
    };
  });

  easeRotationArray = easeRotationArray.map((cur, idx, arr) => {
    if (idx === 0) {
      return {
        ...cur,
        rotIncEase: null
      };
    }
    return {
      ...cur,
      rotIncEase:
        Math.round(1000000 * (cur.totRotEase - arr[idx - 1].totRotEase)) /
        1000000
    };
  });

  console.log("easeRotationArray", easeRotationArray);

  return easeRotationArray;
}

export default getRotationArray;
