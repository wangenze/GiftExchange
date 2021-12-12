
module.exports = {
  randomPlan,
}

function randomPlan(size) {
  if (!size || size < 2) {
    throw new Error("Size too small")
  }
  let arr = arrayOfRange(size);
  do {
    shuffleArray(arr)
  } while (!isValidShuffle(arr))
  console.log(arr)
  return arr;
}

function arrayOfRange(size) {
  return [...Array(size).keys()]
}

function isValidShuffle(array) {
  return array.every((value, index) => value != index)
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}