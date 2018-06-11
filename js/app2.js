/*TODO:

- Implement collision

- Implement obstacles

- Implement diamonds

- Implement Score

- Implement key first

- Add comments

- Refactor

*/

//Game Settings
const settings = {
    sprites: {
        enemy: 'images/enemy-bug.png',
        player: 'images/char-boy.png',
        key: 'images/Key.png'
    },

    difficulty: 'easy'
};

//Difficulty config
const difficulty = {
    easy: {
        enemy: {
            numEnemies: 3,
            enemySpeed: {
                min: 2,
                max: 6
            }
        },

        numObstacles: 0
    },
    medium: {
        enemy: {
            numEnemies: 4,
            enemySpeed: {
                min: 3,
                max: 7
            }
        },

        numObstacles: 2
    },
    hard: {
        enemy: {
            numEnemies: 5,
            enemySpeed: {
                min: 4,
                max: 8
            }
        },

        numObstacles: 4
    }
};

//Setting column width & row height for game background
const gameBoundaries = {
    columnWidth: 101,
    rowHeight: 83,
    topBoundary: 60,
    bottomBoundary: 60 + 4 * 83, //topBoundary + 4 rows x rowHright
    leftBoundary: 0,
    rightBoundary: 5 * 101, // 5 columns x columnWidth
    numberEnemyLanes: 3
};

class Game {
    constructor() {
        this.score = 0;

        this.updateScore();

        //Flag when game is stopped
        this.stopped = false;
    }

    playerLose() {
        this.score -= 1;
        this.updateScore();
        this.stopGame();
        this.showMessage('You Loose :(', 'loose');
        setTimeout(() => {
            this.restartGame();
        }, 2000);
    }

    stopGame() {
        this.stopped = true;
    }

    playerWin() {

    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    showMessage( message, messageClass ) {
        const div = document.createElement('div');
        div.textContent = message;
        div.id = 'message';
        div.classList.add(messageClass);
        document.body.appendChild(div);
    }

    restartGame() {
        document.getElementById('message').remove();
        this.stopped = false;
        player.reset();
        allEnemies.forEach( enemy => enemy.reset() );

    }

}

class Enemy {
    constructor() {
        this.sprite = settings.sprites.enemy;

        //Setting y-positions of allowed lanes
        this.allowedY = [];
        for (let i = 0; i < gameBoundaries.numberEnemyLanes; i++) {
            this.allowedY.push( gameBoundaries.topBoundary + gameBoundaries.rowHeight * i );
        }

        //Setting width & height of enemy from sprite image once loaded
        Resources.onReady( () => {
            this.width = Resources.get( this.sprite ).width;
            this.height = Resources.get( this.sprite ).height;

            this.setup();
        } );
    }

    setup() {
        //Start at left of canvas from outside. i.e. negative width of enemy
        this.x = -1 * this.width;

        //Setting y-position to random lane
        this.y = this.getRandomLane();

        //Setting random speed
        this.speed = this.getRandomSpeed();
    }

    update() {
        //Check if game is stopped
        if( game.stopped ) {
            return;
        }

        this.x += this.speed;

        //Check if reached end of canvas width
        if( this.x >= 505 ) {
            //Reset to beginning of canvas
            this.x = -171;

            //Choose different lane
            this.y = this.getRandomLane();

            //Choose different speed
            this.speed = this.getRandomSpeed();
        }

        //Check if enemy collide with player
        const[playerX, playerY, playerWidth, playerHeight] = player.getPlayerDimensions();
        if( this.x + this.width - playerWidth / 4 >= playerX &&
            this.x <= playerX + playerWidth  - playerWidth / 4 &&
            this.y >= playerY &&
            this.y <= playerY
        ) {
            game.playerLose();
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    getRandomLane() {
        const randomIndex = Math.floor( Math.random() * gameBoundaries.numberEnemyLanes );
        return this.allowedY[ randomIndex ];
    }

    getRandomSpeed() {
        //Setting maximum and minimum speed using setting & difficulty objects
        const max = difficulty[settings.difficulty].enemy.enemySpeed.max;
        const min = difficulty[settings.difficulty].enemy.enemySpeed.min;

        return Math.floor(Math.random() * ( max - min + 1)) + min;
    }

    reset() {
        this.setup();
    }
}

class Player {
    constructor() {
        this.sprite = settings.sprites.player;

        //Setting width & height of player from sprite image once loaded
        Resources.onReady( () => {
            this.width = Resources.get( this.sprite ).width;
            this.height = Resources.get( this.sprite ).height;

            this.setup();
        } );
    }

    setup() {
        //Start at center bottom of grass
        this.x = gameBoundaries.columnWidth * 2;
        this.y = gameBoundaries.bottomBoundary;

        //Setting playr speed
        this.speedX = gameBoundaries.columnWidth;
        this.speedY = gameBoundaries.rowHeight;
    }

    update() {}

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput( direction ) {
        if( game.stopped ) {
            return;
        }

        this.movePlayer();
    }

    movePlayer() {
        //Create local copies of x & y
        let [x, y] = [this.x, this.y];

        switch( direction ) {
            case 'up':
                y -= this.speedY;
            break;
            case 'down':
                y += this.speedY;
            break;
            case 'left':
                x -= this.speedX;
            break;
            case 'right':
                x += this.speedX;
            break;
            default: //any other key => return
                return;
        }

        //Check x & y positions to strict player movement within the game boundries
        x = (x >= gameBoundaries.leftBoundary)               ? x : gameBoundaries.leftBoundary;
        x = (x + this.width <= gameBoundaries.rightBoundary) ? x : gameBoundaries.rightBoundary - this.width;
        y = (y >= gameBoundaries.topBoundary)                ? y : gameBoundaries.topBoundary;
        y = (y <= gameBoundaries.bottomBoundary)             ? y : gameBoundaries.bottomBoundary;

        this.x = x;
        this.y = y;
    }

    getPlayerDimensions() {
        return [this.x, this.y, this.width, this.height];
    }

    reset() {
        this.setup();
    }
}

class Key {
    constructor() {
        this.sprite = settings.sprites.key;

        //Setting width & height of player from sprite image once loaded
        Resources.onReady( () => {
            this.width = Resources.get( this.sprite ).width;
            this.height = Resources.get( this.sprite ).height;

            this.setup();
        } );
    }

    setup() {
        //Start at random box
        [this.x, this.y] = this.getRandomBox();
    }

    getRandomBox() {
        const randomX = ( Math.floor(Math.random() * 5) ) * gameBoundaries.columnWidth;
        const randomY = ( Math.floor(Math.random() * 3) ) * gameBoundaries.rowHeight + gameBoundaries.topBoundary;
        return [randomX, randomY];
    }

    update() {}

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    reset() {
        this.setup();
    }
}

//Creating new game
const game = new Game();

//Creating enemies
const allEnemies = [];
const numEnemies = difficulty[settings.difficulty].enemy.numEnemies;

for (let index = 0; index < numEnemies; index++) {
    allEnemies.push( new Enemy() );
}

//Creating player
const player = new Player();

//Creating key
const key = new Key();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});