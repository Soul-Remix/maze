export function shuffle(arr) {
  let counter = arr.length;
  while (counter > 0) {
    const i = Math.floor(Math.random() * counter);
    counter -= 1;
    let tmp = arr[counter];
    arr[counter] = arr[i];
    arr[i] = tmp;
  }
  return arr;
}
