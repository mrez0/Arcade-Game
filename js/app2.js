/*TODO:

- Implement Enemy class:
    - constructor
    - update method
    - render method

- Implement Player class
    - constructor
    - update method
    - render method

- Add key listeners

- Add comments

- Refactor

*/

class Enemy {
    constructor() {
        this.sprite = 'images/enemy-bug.png';

        //Start at edge of canvas from outside. i.e. -width of enemy
        this.x = -171;

        //Setting y-positions of allowed lanes
        this.allowedY = [60, 140, 220];
        this.allowedY = [60, 143, 226];

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
        this.x = 200;
        this.y = 0;
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