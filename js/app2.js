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

(function () {
    class Enemy {
        constructor() {
            this.sprite = 'images/enemy-bug.png';
        }

        update() {

        }

        render() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }

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
})();