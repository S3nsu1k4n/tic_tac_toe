//Factories: Player

const Player = () => {

}

//Modules: Gameboard, Game
const Game = (() => {

})();

const GameBoard = (() => {

  const gameboard = [];

  const create_gameboard = () => {
    for (let i = 0; i < 3; i++){
      gameboard.push([]);
      for (let j = 0; j < 3; j++){
        gameboard[i].push('');
      }
    }
  }
  create_gameboard();

  const get_gameboard = () => gameboard;

  const place_token = (token, x, y) => gameboard[y][x] = token

  const has_no_token = (x, y) => gameboard[y][x] == ''

  const check_uniqueness = (array) => {
    const s = new Set(array);
    if (s.size == 1){
      let token = [...s][0];
      if (token != '') {return token};
    }
    return '';
  }
  

  const check_horizontal = () => {
    for (let i = 0; i < gameboard.length; i++){
      let token = check_uniqueness(gameboard[i]);
      if (token != '') return token;
    }
    return '';
  }
    
  
  const check_vertical = () => {
    for (let i = 0; i < gameboard.length; i++){
      let a = new Array(gameboard.length);
      for (let j = 0; j < gameboard.length; j++){
        a[j] = gameboard[j][i];
      }
      let token = check_uniqueness(a);
      if (token != '') return token;
    }
    return '';
  }

  const check_diagonal = () => {
    let a = new Array(gameboard.length);
    for (let i = 0; i < gameboard.length; i++){
      a[i] = gameboard[i][i];
    }
    let token = check_uniqueness(a);
    if (token != '') return token;

    a = new Array(gameboard.length);

    i = 0;
    for (let j = gameboard.length - 1; j >= 0; j--){
      a[i] = gameboard[i][j];
      i++;
    }
    return check_uniqueness(a);
  }

  const check_someone_won = () => {
    let winner = check_horizontal();
    if (winner != '') return winner;
    winner = check_vertical();
    if (winner != '') return winner;
    winner = check_diagonal();
    if (winner != '') return winner;
    return '';
    
  }

  return {
    get_gameboard,
    place_token,
    has_no_token,
    check_someone_won,
  };

})();

console.log(GameBoard.get_gameboard());
GameBoard.place_token('x', 2, 0);
GameBoard.place_token('x', 1, 1);
GameBoard.place_token('x', 0, 2);
console.log(GameBoard.get_gameboard());
console.log(GameBoard.check_board());