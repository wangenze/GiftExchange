module.exports = {
  setEquals,
}

function setEquals(a, b) {
  return Array.isArray(a) && Array.isArray(b) &&
  a.length === b.length &&
  a.every((val) => b.includes(val))
}
