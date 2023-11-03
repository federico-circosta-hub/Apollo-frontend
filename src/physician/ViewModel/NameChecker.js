export default function nameChecker(s) {
  if (!s) return "N/A";
  let words = s.split(" ");
  let newString = "";
  words.forEach((e) => {
    e = e.toLowerCase();
    e.indexOf("'") !== -1
      ? (newString +=
          e.charAt(0).toUpperCase() +
          e.slice(1, e.indexOf("'")) +
          "'" +
          e.charAt(e.indexOf("'") + 1).toUpperCase() +
          e.slice(e.indexOf("'") + 2) +
          " ")
      : (newString += e.charAt(0).toUpperCase() + e.slice(1) + " ");
  });
  return newString.trim();
}
