// window.location.reload();
document.getElementById("profile").innerText =
    window.sessionStorage.getItem("user-data").split(",")[1];
console.log("start");
document.addEventListener("keydown", function jump(event) {
    if (!is_pressed_jump && (event.which === 32 || event.which === 87 || event.which === 38)) {
        if (y_bird < JUMP_HEIGHT){
            next_y_bird = 0;
        }
        else {
            next_y_bird -= JUMP_HEIGHT;
        }
        is_pressed_jump = true;
        audio_jump.play();
    }
    else if(!is_pressed_fall && (event.which === 83 || event.which === 18 || event.which === 40)){
        next_y_bird += JUMP_HEIGHT;
        is_pressed_fall = true;
    }
});
document.addEventListener("keyup", function jump(event) {
    if (event.which === 32 || event.which === 87 || event.which === 38) {
        is_pressed_jump = false;
    }
    else if(event.which === 83 || event.which === 18 || event.which === 40){
        is_pressed_fall = false;
    }
});

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

const HEIGHT_OFF_PASSAGE = 90;
const GRAVITATION = 1;
const JUMP_HEIGHT = 20;
const SPEED = 1;

var pipes = [{
    x : canvas.width,
    y: 0
}];

var is_pressed_fall = false;
var is_pressed_jump = false;
var is_restart = false;
var x_bird = 20;
var y_bird = 200;
var next_y_bird = 200;
var score = 0;

var audio_point = new Audio();
var audio_jump = new Audio();
var bird = new Image();
var background = new Image();
var land = new Image();
var pipe_down = new Image();
var pipe_up = new Image();

audio_point.src = 'frontend/audio/score.mp3';
audio_jump.src = 'frontend/audio/fly.mp3';
background.src = 'frontend/images/background.png';
land.src = 'frontend/images/land.png';
pipe_down.src = 'frontend/images/pipe_down.png';
pipe_up.src = 'frontend/images/pipe_up.png';
bird.src = 'frontend/images/bird.png';
canvas.width = background.width ;

canvas.height = background.height;


function draw() {
    if (!is_restart) {
        if (y_bird > next_y_bird) {

            y_bird -= 5;

            if (y_bird < next_y_bird) {
                y_bird = next_y_bird;
            }
        } else if (y_bird < next_y_bird) {
            y_bird += 5;

            if (y_bird > next_y_bird) {
                y_bird = next_y_bird;
            }
        } else {
            next_y_bird += GRAVITATION;
        }
        context.drawImage(background, 0, 0);

        for (let pipe_index = 0; pipe_index < pipes.length; pipe_index++) {

            context.drawImage(pipe_up, pipes[pipe_index].x, pipes[pipe_index].y);
            context.drawImage(pipe_down, pipes[pipe_index].x,
                pipes[pipe_index].y + pipe_up.height + HEIGHT_OFF_PASSAGE);
            pipes[pipe_index].x -= SPEED;

            if (pipes[pipe_index].x === 125) {
                pipes.push({
                    x: canvas.width,
                    y: Math.floor(Math.random() * pipe_up.height) - pipe_up.height
                })

            }
            if (x_bird + bird.width >= pipes[pipe_index].x &&
                x_bird <= pipes[pipe_index].x + pipe_up.width &&
                (y_bird <= pipes[pipe_index].y + pipe_up.height ||
                    y_bird + bird.height >= pipes[pipe_index].y +
                    pipe_up.height + HEIGHT_OFF_PASSAGE) ||
                y_bird + bird.height >= canvas.height - land.height) {
                is_restart = true;
            }
            if (pipes[pipe_index].x + pipe_up.width === x_bird + 1){
                score ++;
                audio_point.play();
            }
        }

        if (pipes.length >= 4){
            pipes.shift();
        }

        context.drawImage(land, 0, canvas.height - land.height);
        context.drawImage(bird, x_bird, y_bird);
        context.fillStyle = "#000";
        context.font = "33px ALSAgrus";
        context.fillText("Score:" + score, 15, canvas.height - 25)
    }
    else{
        let xhr = new XMLHttpRequest();
        let user_data = window.sessionStorage.getItem("user-data").split(",");
        xhr.open("POST", "Save");
        let date = new Date();
        xhr.send(JSON.stringify({
            "user-id": user_data[0],
            "score": score,
            "time": date.getTime(),
            "token": user_data[3]
        }));
        is_restart = false;
        x_bird = 20;
        y_bird = 200;
        next_y_bird = 200;
        pipes = [{
            x : canvas.width,
            y: 0
        }];
        score = 0;
    }
    requestAnimationFrame(draw);
}
pipe_up.onload = draw;
