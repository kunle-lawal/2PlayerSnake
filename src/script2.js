function randNum(min, max) {
    return Math.random() * (max - min) + min;
}

(function(){
    var canvas = document.getElementById("canvas"); //get canvas element
    var ctx = canvas.getContext("2d"); //get the 2d canvas context
    var cw = canvas.width;
    var ch = canvas.height;
    var map_w = cw * 1.3; //Full map view
    var map_h = ch * 1.3; //Full map view

    let snake = {
        tails: [
            {
                x: cw / 2,
                y: ch / 2,
            },
            {
                x: (cw / 2) - 10,
                y: ch / 2,
            },
            {
                x: (cw / 2) - 20,
                y: ch / 2,
            }
        ],
        hearts: 3,
        w: 10,
        h: 10,
        vx: 10,
        vy: 0,
        speed: 10,
        total: 0,
        direction: {
            up:  false, 
            down: false,
            left: false,
            right: false
        },

        drawSnake ()  {
            for(let i = 0; i < this.tails.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = 'white';
                let tail = this.tails[i];
                ctx.fillRect(tail.x, tail.y, tail.w, tail.h) //Draw tail
            }
        },

        updateSnake () {
            this.tails.pop();
            let newSnakeX = this.tails[0].x;
            let newSnakeY = this.tails[0].y;
            
            newSnakeX += this.vx
            newSnakeY += this.vy

            if (newSnakeX > cw) {
                newSnakeX = 0;
            }

            if (newSnakeY > ch) {
                newSnakeY = 0;
            }

            if (newSnakeX < 0) {
                newSnakeX = cw;
            }

            if (newSnakeY < 0) {
                newSnakeY = ch;
            }

            let newHead = {
                x: newSnakeX,
                y: newSnakeY,
                h: 10,
                w: 10
            }

            this.tails.unshift(newHead);
            if(this.eatFood()) {
                food.addFood();
                this.tails.push({
                    x: this.x,
                    y: this.y,
                    h: 10,
                    w: 10
                });
            }

            if(this.checkCollision(this.tails)) {
                $('#heart' + this.hearts).removeClass('full');
                this.hearts -= 1;
            }
        },

        checkCollision(object) {
            for (let i = 1; i < object.length; i++) {
                if (this.tails[0].x === object[i].x &&
                    this.tails[0].y === object[i].y) {
                    return true;
                }
            }
            return false;
        },

        eatFood() {
            if (this.tails[0].x === food.x &&
                this.tails[0].y === food.y) {
                this.total++;
                // let wait;
                // let plus1 = '<span class="plus">+<span class="value">1</span></span>';
                // wait = window.setTimeout(function() {
                    
                // })
                // $('.addScore1').prepend(plus1);
                document.getElementById('score1').innerHTML = this.total
                return true;
            }

            return false;
        },

        moveSnake (position) {
            this.vx = 0;
            this.vy = 0;
            for (const item in this.direction) {
                this.direction[item] = false;
            }
            switch (position) {
                case 'up':
                    this.vy = -this.speed
                    this.direction.up = true;
                    break;
                case 'down':
                    this.vy = this.speed;
                    this.direction.down = true;
                    break;
                case 'left':
                    this.vx = -this.speed;
                    this.direction.left = true;
                    break;
                case 'right':
                    this.vx = this.speed;
                    this.direction.right = true;
                    break;
                default:
                    break;
            }
        }
    }

    let snake2 = {
        tails: [
            {
                x: cw / 2,
                y: ch / 2,
            },
            {
                x: (cw / 2) - 10,
                y: ch / 2,
            },
            {
                x: (cw / 2) - 20,
                y: ch / 2,
            }
        ],
        hearts: 3,
        w: 10,
        h: 10,
        vx: 10,
        vy: 0,
        speed: 10,
        total: 0,
        direction: {
            up: false,
            down: false,
            left: false,
            right: false
        },

        drawSnake() {
            for (let i = 0; i < this.tails.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = 'white';
                let tail = this.tails[i];
                ctx.fillRect(tail.x, tail.y, tail.w, tail.h) //Draw tail
            }
        },

        updateSnake() {
            this.tails.pop();
            let newSnakeX = this.tails[0].x;
            let newSnakeY = this.tails[0].y;

            newSnakeX += this.vx
            newSnakeY += this.vy

            if (newSnakeX > cw) {
                newSnakeX = 0;
            }

            if (newSnakeY > ch) {
                newSnakeY = 0;
            }

            if (newSnakeX < 0) {
                newSnakeX = cw;
            }

            if (newSnakeY < 0) {
                newSnakeY = ch;
            }

            let newHead = {
                x: newSnakeX,
                y: newSnakeY,
                h: 10,
                w: 10
            }

            this.tails.unshift(newHead);
            if (this.eatFood()) {
                food.addFood();
                this.tails.push({
                    x: this.x,
                    y: this.y,
                    h: 10,
                    w: 10
                });
            }

            if (this.checkCollision(this.tails)) {
                $('#heart' + this.hearts).removeClass('full');
                this.hearts -= 1;
            }
        },

        checkCollision(object) {
            for (let i = 1; i < object.length; i++) {
                if (this.tails[0].x === object[i].x &&
                    this.tails[0].y === object[i].y) {
                    return true;
                }
            }
            return false;
        },

        eatFood() {
            if (this.tails[0].x === food.x &&
                this.tails[0].y === food.y) {
                this.total++;
                // let wait;
                // let plus1 = '<span class="plus">+<span class="value">1</span></span>';
                // wait = window.setTimeout(function() {

                // })
                // $('.addScore1').prepend(plus1);
                document.getElementById('score1').innerHTML = this.total
                return true;
            }

            return false;
        },

        moveSnake(position) {
            this.vx = 0;
            this.vy = 0;
            for (const item in this.direction) {
                this.direction[item] = false;
            }
            switch (position) {
                case 'up':
                    this.vy = -this.speed
                    this.direction.up = true;
                    break;
                case 'down':
                    this.vy = this.speed;
                    this.direction.down = true;
                    break;
                case 'left':
                    this.vx = -this.speed;
                    this.direction.left = true;
                    break;
                case 'right':
                    this.vx = this.speed;
                    this.direction.right = true;
                    break;
                default:
                    break;
            }
        }
    }

    let food = {
        x: Math.round((randNum(0, cw) / 10)) * 10,
        y: Math.round((randNum(0, ch) / 10)) * 10,
        w: 10,
        h: 10,

        drawFood() {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h)
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.restore();
        },

        addFood() {
            this.x = Math.round((randNum(10, cw - 100) / 10)) * 10;
            this.y = Math.round((randNum(10, ch - 100) / 10)) * 10;
        },
    }

    food.addFood()

    document.body.onkeydown = function (e) {
        if (e.keyCode == 87) {
            if (!snake.direction.down) {
                snake.moveSnake('up')
            }
        } else if (e.keyCode == 83) {
            if (!snake.direction.up) {
                snake.moveSnake('down')
            }
        } else if (e.keyCode == 65) {
            if (!snake.direction.right) {
                snake.moveSnake('left');
            }
        } else if (e.keyCode == 68) {
            if (!snake.direction.left) {
                snake.moveSnake('right')
            }
        }
    }

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // function start() {
    //     window.requestAnimationFrame(start);
    //     ctx.clearRect(0, 0, map_w, map_h);
    //     snake.drawSnake();
    //     snake.updateSnake();
    //     food.drawFood();
    // }


    window.setInterval(function() {
        ctx.clearRect(0, 0, map_w, map_h);
        snake.drawSnake();
        snake.updateSnake();
        snake2.drawSnake();
        snake2.updateSnake();
        food.drawFood();
    }, 50)
    // start();
})()
