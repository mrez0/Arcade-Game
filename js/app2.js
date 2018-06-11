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
        player: 'images/char-boy.png'
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

class Enemy {
    constructor() {
        this.sprite = settings.sprites.enemy;

        //Setting width & height of enemy from sprite image once loaded
        Resources.onReady( () => {
            this.width = Resources.get( this.sprite ).width;
            this.height = Resources.get( this.sprite ).height;

            //Start at left of canvas from outside. i.e. negative width of enemy
            this.x = -1 * this.width;
        } );

        //Setting y-positions of allowed lanes
        this.allowedY = [];
        for (let i = 0; i < gameBoundaries.numberEnemyLanes; i++) {
            this.allowedY.push( gameBoundaries.topBoundary + gameBoundaries.rowHeight * i );
        }

        //Setting y-position to random lane
        this.y = this.getRandomLane();

        //Setting random speed: from 2 to 6
        this.speed = this.getRandomSpeed();
    }

    update() {
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
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    getRandomLane() {
        const randomIndex = Math.floor( Math.random() * 3 );
        return this.allowedY[ randomIndex ];
    }

    getRandomSpeed() {
        return Math.floor(Math.random() * (6 - 2 + 1)) + 2;
    }
}

class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';

        //Start at center bottom of grass
        this.x = 202;
        this.y = 392;
    }

    update() {

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput( direction ) {
        this.y += 1;
    }
}


const allEnemies = [];
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());
allEnemies.push(new Enemy());

const player = new Player();









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