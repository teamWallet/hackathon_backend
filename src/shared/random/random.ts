
function randomWord(randomFlag, min, max) {
  let str = '',
    range = min;
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  console.log('%s', str);
  return str;
}
function RandomCode() {
  return randomWord(true, 6, 6);
}

function ValidAccount(accountname: string) {
  const re = /^[a-z1-5.]{1,12}$/;
  return re.test(accountname);
}

function RandomName() {
  let name = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz12345';
  for (let i = 0; i < 12; i++) {
    name += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return name;
}
export { RandomCode, RandomName, ValidAccount };
