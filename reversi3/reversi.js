document.addEventListener('DOMContentLoaded', () => {

    const boardSize = 6;
    const board = document.getElementById('board');
    const gameRegister = document.getElementById('gameRegister');
    const cells = [];
    let currentPlayer = 'purple';

    document.querySelector('.startBtn').addEventListener('click', function() {
        initializeBoard();
        document.querySelector('.startBtn').setAttribute('disabled', true);
    });

    document.querySelector('.hint').addEventListener('click', function() {
        currentPlayerValidCells(currentPlayer);
    });

    document.ready(function (){
        gameRegister.scrollTop(gameRegister[0].scrollHeight);
    });

    // ボードの初期設定
    function initializeBoard() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', onCellClick);
                board.appendChild(cell);
                cells.push(cell);
                
            }
        }

        // 初期の石を配置する
        
        setCell(2, 1, 'black');
        setCell(3, 3, 'black');
        setCell(2, 2, 'white');
        setCell(3, 1, 'white');
        setCell(2, 3, 'purple');
        setCell(3, 2, 'purple');
        

        updateScores();
    }

    // セルに石を置く関数
    function setCell(row, col, player) {
        const cell = getCell(row, col);
        if (cell) {
            cell.classList.remove('black', 'white', 'purple');
            cell.classList.add(player);
        }
        
    }

    // セルを取得する関数
    function getCell(row, col) {
        return cells.find(c => c.dataset.row == row && c.dataset.col == col);
    }

    // セルがクリックされたときの処理
    function onCellClick(event) {

        if (currentPlayer !== 'purple') {
            return; 
        }

        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (isValidMove(row, col, currentPlayer)) {
            makeMove(row, col, currentPlayer);
            switchPlayer();
            let areValidCells = tellValidCells(currentPlayer);
            gameOver(areValidCells);
            updateScores();
            cellsRestoration();
            setTimeout(function() {pcTurn1();},900);
        }

    }

    // 有効な手かどうかをチェックする関数
    function isValidMove(row, col, player) {
        // 既に石が置かれている場合は無効
        const cell = getCell(row, col);
        if (cell.classList.contains('black') || cell.classList.contains('white') || cell.classList.contains('purple')) {
            return false;
        }

        // 各方向へのフリップを確認
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0], 
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        return directions.some(dir => checkDirection(row, col, dir[0], dir[1], player));

    }

    // ある方向へのフリップを確認する関数
    function checkDirection(row, col, rowDir, colDir, player) {
        const [opp1, opp2] = checkOpponents(player);
        let r = row + rowDir;
        let c = col + colDir;
        let hasOpponentPiece = false;

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
            const cell = getCell(r, c);
            if (!cell) {
                return false;
            }
            if (!cell.classList.contains('black') && !cell.classList.contains('white') && !cell.classList.contains('purple')) {
                return false;
            }
            if (cell.classList.contains(opp1) || cell.classList.contains(opp2) ) {
                hasOpponentPiece = true;
            } else if (cell.classList.contains(player)) {
                return hasOpponentPiece;
            } else {
                break;
            }
            r += rowDir;
            c += colDir;
        }

        return false;
    }

    ////

    function checkOpponents(player){
        let opponents = [];
        if(player === 'black'){
            opponents.push('white');
            opponents.push('purple');
        } else if(player === 'white'){
            opponents.push('black');
            opponents.push('purple');
        } else if(player === 'purple'){
            opponents.push('white');
            opponents.push('black');
        }
        return opponents;
    }

    // 指定された方向へ石を置く関数
    function makeMove(row, col, player) {
        const directions = [
            [0, 1], [1, 0], [0, -1], [-1, 0], 
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];

        setCell(row, col, player);
        showRegister(player, row, col);

        directions.forEach(dir => {
            if (checkDirection(row, col, dir[0], dir[1], player)) {
                flipDirection(row, col, dir[0], dir[1], player);
            }
        });
    }

    // 指定された方向の石を裏返す関数
    function flipDirection(row, col, rowDir, colDir, player) {
        const [opp1, opp2] = checkOpponents(player);
        let r = row + rowDir;
        let c = col + colDir;

        while (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
            const cell = getCell(r, c);
            if (cell.classList.contains(opp1) || cell.classList.contains(opp2)) {
                cell.classList.remove(opp1, opp2);
                cell.classList.add(player);
                showRegister(player, r, c);
            } else {
                break;
            }
            r += rowDir;
            c += colDir;
        }
    }

    //////

    function showRegister(player, r, c){
        const reg = document.createElement('li');
        reg.innerHTML = player + ' ' + r + ', ' + c;
        gameRegister.appendChild(reg);
    }

    function updateScores() {
        document.getElementById('turn').innerText = currentPlayer;
        document.getElementById('BlackNumber').innerText = countPlayerCells('black');
        document.getElementById('WhiteNumber').innerText = countPlayerCells('white');
        document.getElementById('PurpleNumber').innerText = countPlayerCells('purple');
    }

    function countPlayerCells(player){
        let count = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = getCell(row, col);
                if(cell.classList.contains(player)){
                    count++;
                }
            }
        }
        return count;
    }


    function tellValidCells(player){
        let validCells = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if(isValidMove(row, col, player)){
                    validCells++;
                }
            }
        }
         if(validCells === 0){
            setTimeout(function() {alert(player + " no valid cells");},500);
            return false;
        } else return true;
    }

    function gameOver(areValidCells){
        if(!areValidCells || fullBoard()){
            winLose();
        }
    }

    function checkValidCells(player){
        let validCellsList = [];
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if(isValidMove(row, col, player)){
                    validCellsList.push([row,col]);
                }
            }
        }
        return validCellsList;
    }

    function fullBoard(){
        let fullBoard = 0;
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                let cell = getCell(row, col);
                if(cell.classList.contains('black') || cell.classList.contains('white') || cell.classList.contains('purple')){
                    fullBoard++;
                }
            }
        }
        if(fullBoard === boardSize*boardSize){
            return true;
        } else return false;
    }

    function winLose(){
            if(countPlayerCells('black') > countPlayerCells('white') && countPlayerCells('black') > countPlayerCells('purple')){
                setTimeout(function() {alert('Black勝ち');},500); //alert("Black勝ち");
            } else if(countPlayerCells('white') > countPlayerCells('black') && countPlayerCells('white') > countPlayerCells('purple')){
                setTimeout(function() {alert('White勝ち');},500); //alert("White勝ち");
            } else if(countPlayerCells('purple') > countPlayerCells('black') && countPlayerCells('purple') > countPlayerCells('white')){
                setTimeout(function() {alert('Purple勝ち');},500);
            } else if(countPlayerCells('purple') === countPlayerCells('black') === countPlayerCells('white') ||
                        countPlayerCells('purple') === countPlayerCells('black') ||
                        countPlayerCells('purple') === countPlayerCells('white') ||
                        countPlayerCells('white') === countPlayerCells('black')){
                setTimeout(function() {alert('引き分け');},500); //alert("draw");
            }
    }

    function currentPlayerValidCells(player){
        cells.forEach(cell => cell.classList.remove('lightgreen'));
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if(isValidMove(row, col, player)){
                    const cell = getCell(row, col);
                    cell.classList.add('lightgreen');
                }
            }
        }
    }

    function cellsRestoration(){
        cells.forEach(cell => cell.classList.remove('lightgreen'));
    }


    function switchPlayer() {
        if(currentPlayer === 'purple'){
            currentPlayer = 'black';
        } else if(currentPlayer === 'black'){
            currentPlayer = 'white';
        } else if(currentPlayer === 'white'){
            currentPlayer = 'purple';
        }
    }

    function pcTurn1(){
        pcTurn();
        setTimeout(function() {pcTurn2();},1000);
    }

    function pcTurn2(){
        pcTurn();
    }

    function pcTurn() {
        const validMoves = checkValidCells(currentPlayer);
        if (validMoves.length > 0) {
            const [row, col] = validMoves[Math.floor(Math.random() * validMoves.length)];
            if (isValidMove(row, col, currentPlayer)) {
                makeMove(row, col, currentPlayer);
                switchPlayer();
                let areValidCells = tellValidCells(currentPlayer);
                gameOver(areValidCells);
                updateScores();
                cellsRestoration();
            }

           
        }
    }


});
   
