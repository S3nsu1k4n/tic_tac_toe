//Factories: Player

const Player = (name, token) => {
  return {
    name,
    token,
  }
}

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

  const place_token = (token='', x=0, y=0) => gameboard[y][x] = token

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

  const is_full = () => {
    return gameboard.flat().join('').length == 9;
  }

  const reset = () => {
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        gameboard[i][j] = '';
      }
    }
  }

  return {
    get_gameboard,
    place_token,
    has_no_token,
    check_someone_won,
    reset,
    is_full,
  };

})();

const Dialog = (() =>{
  const element = document.querySelector('dialog');
  const text = document.querySelector('.dialog-text');
  const button = document.querySelector('.dialog-button');

  const set_text = string => text.innerHTML = string;
  button.addEventListener('click', (e) => {
    element.close();
  })

  const show = string => {
    set_text(string);
    element.showModal();
  }

  return {
    show,
  }
})();

const HTMLGameboard = (() => {
  const gameboard = document.querySelector('.gameboard');
  const info = document.querySelector('.info');
  let token = 'X'

  const create_gameboard = () => {
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = `${i}_${j}`;
        cell.addEventListener('click', (e) => {
          
          let xy = e.target.id.split('_');
          if(Game.make_move(xy[0], xy[1])){
            e.target.innerHTML = token;
          }
        })
        gameboard.appendChild(cell);
      }
    }
  }

  const set_token = char => token = char;

  const set_info = string => info.innerHTML = string;
  const get_info = () => info.innerHTML;

  const reset = () => {
    for (child of gameboard.children){
      child.innerHTML = '';
    }
  }

  create_gameboard();

  return {
    set_token,
    set_info,
    get_info,
    reset,
  }
})();

const ResetButton =(() => {
  button = document.querySelector('.reset-button');
  button.addEventListener('click', () => {
    GameBoard.reset();
    HTMLGameboard.reset();
    Game.reset();
    console.log(GameBoard.get_gameboard());
  })
})();

const Game = (() => {
  // Initialization
  const p1 = Player('Player1', 'X');
  const p2 = Player('Player2', 'O');
  let current_player = p1;
  let winner = ''
  let finish = false;
  
  const next_player_info = () => HTMLGameboard.set_info(`Next move: ${current_player.name} (${current_player.token})`);
  const player_won_info = () => HTMLGameboard.set_info(`${current_player.name} (${current_player.token}) WON!!`);
  const no_winner_info = () => HTMLGameboard.set_info(`Tie! No one wins...`);

  const make_move = (x, y) => {
    if(winner != '' || finish){
      return false;
    }
    if(GameBoard.has_no_token(x, y)){
      GameBoard.place_token(current_player.token, x, y);
      HTMLGameboard.set_token(current_player.token);

      winner = GameBoard.check_someone_won();
      if(winner == ''){
        current_player = current_player === p1 ? p2 : p1;
        next_player_info();
      }
      else{
        player_won_info();
        Dialog.show(HTMLGameboard.get_info());
      }
      if(GameBoard.is_full()){
        no_winner_info();
        Dialog.show(HTMLGameboard.get_info());
        finish = true;
      }
      return true;
    }
    return false;
  }

  const reset = () => {
    winner = '';
    finish = false;
    current_player = p1;
    next_player_info();
  }

  next_player_info();

  return {
    make_move,
    winner,
    reset,
  }
})();
