
// (function() {
    function randNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    $("canvas").click(function(){
        roomRef.set({
            start: false,
            ready: false
        }, { merge: true });
    })

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let cw = canvas.width;
    let ch = canvas.height;
    let player = -1;
    let otherPlayer;
    let mySnake;
    $(".player").click(function() {
        let id = $(this).attr('id');
        player = Number(id);
        otherPlayer = player == 1 ? 2 : 1;
        mySnake = `snake${player}`;

        $('.choosePlayer').addClass('display_none')
        roomRef.set({
            ready: true
        }, { merge: true });
    })

    

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyB_c5Et9Nzg2stUwZODR_6ePqdATWyTf48",
        authDomain: "snake-e128c.firebaseapp.com",
        databaseURL: "https://snake-e128c.firebaseio.com",
        projectId: "snake-e128c",
        storageBucket: "snake-e128c.appspot.com",
        messagingSenderId: "623100631311",
        appId: "1:623100631311:web:8f152ad1a49c993f8dc67a",
        measurementId: "G-4GG0G368Y1"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    var db = firebase.firestore();
    // db.settings({timestampInSnapshots: true})
    let roomRef = db.collection("rooms").doc('room1');

    roomRef.onSnapshot((doc) => {
        let data = doc.data();
        let otherPlayer = `snake${player === 1 ? 2 : 1}`
        let snakeDirection = data[otherPlayer].direction;
        game[otherPlayer].direction = snakeDirection;
        game.start = data.start;
        if (game.start) {
            $('.choosePlayer').addClass('display_none')
            window.setInterval(function() {
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                console.log(time);
            }, 1000);
        }
        // console.log(game.start);
    })
    let game = {
        start: false,
        snake1: {
            vx: 10,
            vy: 0,
            h: 10,
            w: 10,
            hearts: 4,
            speed: 10,
            total: 0,
            color: 'white',
            direction: {
                current: 'right',
                up: false,
                down: false,
                left: false,
                right: true
            },
            tails: [
                {
                    x: 0,
                    y: ch / 2,
                },
                {
                    x: 10,
                    y: ch / 2,
                },
                {
                    x: 20,
                    y: ch / 2,
                }
            ]
        },

        snake2: {
            vx: -10,
            vy: 0,
            h: 10,
            w: 10,
            hearts: 4,
            speed: 10,
            total: 0,
            color: 'red',
            direction: {
                current: 'left',
                up: false,
                down: false,
                left: true,
                right: false
            },
            tails: [
                {
                    x: cw,
                    y: ch / 2,
                },
                {
                    x: cw - 10,
                    y: ch / 2,
                },
                {
                    x: cw - 20,
                    y: ch / 2,
                },
            ]
        },

        food: {
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
        },

        drawSnake() {
            for(let i = 1; i <= 2; i++) {
                let snake = this[`snake${i}`];
                for (let i = 0; i < snake.tails.length; i++) {
                    let tail = snake.tails[i];
                    ctx.beginPath();
                    ctx.fillStyle = snake.color;
                    ctx.fillRect(tail.x, tail.y, snake.w, snake.h)
                }
            }
        },

        updateSnake() {
            for(let i = 1; i <= 2; i++) {
                let snake = this[`snake${i}`];
                this.moveSnake(`snake${i}`, snake.direction.current)

                snake.tails.pop();
                let newSnakeX = snake.tails[0].x;
                let newSnakeY = snake.tails[0].y;

                newSnakeX += snake.vx
                newSnakeY += snake.vy

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
                }

                snake.tails.unshift(newHead);
                if (this.eatFood()) {
                    this.food.addFood();
                    snake.tails.push({
                        x: snake.x,
                        y: snake.y,
                    });
                }

                //check collision with tail
                if (this.checkCollision(snake, snake.tails)) {
                    $(`#player${i}Info #heart` + snake.hearts).removeClass('full');
                    snake.hearts -= 1;
                }

                //Check Collision with other snake
                if (this.checkCollision(snake, this[`snake${i == 1 ? 2 : 1}`].tails)) {
                    $(`#player${i}Info #heart` + snake.hearts).removeClass('full');
                    snake.hearts -= 1;
                }
            }
        },

        checkCollision(object1, object2) {
            for (let j = 1; j < object2.length; j++) {
                if (object1.tails[0].x === object2[j].x &&
                    object1.tails[0].y === object2[j].y) {
                    return true;
                }
            }
            return false;
        },

        eatFood() {
            for(let i = 1; i <= 2; i++) {
                let snake = this[`snake${i}`];
                if (snake.tails[0].x === this.food.x &&
                    snake.tails[0].y === this.food.y) {
                        snake.total++;
                        // let wait;
                        // let plus1 = '<span class="plus">+<span class="value">1</span></span>';
                        // wait = window.setTimeout(function() {
                            
                            // })
                            // $('.addScore1').prepend(plus1);
                            // console.log(snake)
                    document.getElementById(`score${i}`).innerHTML = snake.total
                    return true;
                }
            }
            return false;
        },

        moveSnake(snake, position) {
            // if(isOpposite(position, this[snake].direction.current)) {return}
            this[snake].vx = 0;
            this[snake].vy = 0;
            // for (const item in this[snake].direction) {
            //     if(item !== 'current') {
            //         this[snake].direction[item] = false;
            //     }
            // }
            switch (position) {
                case 'up':
                    this[snake].vy = -this[snake].speed
                    // this[snake].direction.up = true;
                    break;
                case 'down':
                    this[snake].vy = this[snake].speed;
                    // this[snake].direction.down = true;
                    break;
                case 'left':
                    this[snake].vx = -this[snake].speed;
                    // this[snake].direction.left = true;
                    break;
                case 'right':
                    this[snake].vx = this[snake].speed;
                    // this[snake].direction.right = true;
                    break;
                default:
                    break;
            }
            
            // console.log(game[`snake${otherPlayer}`].direction);
            this[snake].direction.current = position;
        },

        changeDirection(snake, newDirection) {
            if (isOpposite(newDirection, this[snake].direction.current)) { return }
            game[snake].direction[this[snake].direction.current] = false;
            game[snake].direction[newDirection] = true;
            game[snake].direction.current = newDirection;
            setWithMerge = roomRef.set({
                [mySnake]: {
                    direction: game[mySnake].direction
                }
            }, { merge: true });
            // console.log(game[snake].direction);
        }
    }

    function isOpposite (item1, item2) {
        opposites = [['up', 'down'], ['left', 'right']];
        for (let i = 0; i < opposites.length; i++) {
            if (opposites[i].includes(item1) && opposites[i].includes(item2)) {
                return true;
            }
        }

        return false
    }

    document.body.onkeydown = function (e) {
        if (e.keyCode == 87) {
            game.changeDirection(mySnake, 'up')
        } else if (e.keyCode == 83) {
            game.changeDirection(mySnake, 'down')
        } else if (e.keyCode == 65) {
            game.changeDirection(mySnake, 'left');
        } else if (e.keyCode == 68) {
            game.changeDirection(mySnake, 'right')
        }
    }

    window.setInterval(function () {
        if(game.start) {
            ctx.clearRect(0, 0, cw, ch);
            // snake.drawSnake();
            // snake2.drawSnake();
            // snake2.updateSnake();
            game.drawSnake();
            game.food.drawFood();
            game.updateSnake();
        }
    }, 50)
// })()