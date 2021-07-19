let canvas, context;
let current, stones = new Array();
let playerNo = 0,
  name = ["RED", "YELLOW"];
let cnt = 0,
  speed = 0,
  angle = 0;
let status = "ready";

class Stone {
  constructor(no) {
    this.no = no;
    this.x = 750 - no * 700;
    this.y = 200;
    this.v = 0;
    this.angle = 0;
  }
  move() {
    this.v -= 0.3;
    if (this.v < 0) this.v = 0;
    this.x += this.v * Math.cos(this.angle);
    this.y += this.v * Math.sin(this.angle);
  }
  collide(target) {
    const [dx, dy] = [target.x - this.x, target.y - this.y];
    const d = (dx ** 2 + dy ** 2) ** 0.5;
    if (d < 30) {
      target.angle = Math.atan2(dy, dx);
      this.angle = Math.PI - this.angle + target.angle * 2;
      target.v = (target.v + this.v) / 2;
      this.v = target.v;
      this.move();
      target.move();
    }
  }
  draw() {
    let color = "#FF00000";
    if (this.no == 1) color = "#FFFF00";
    drawCircle(this.x, this.y, 15, "#999999", "#000000");
    drawCircle(this.x, this.y, 10, color, "#FFFFFF");
  }
}

const init = () => {
  canvas = document.getElementById("rink");
  context = canvas.getContext("2d");

  canvas.addEventListener("mousedown", charge);
  canvas.addEventListener("mousemove", setAngle);
  canvas.addEventListener("mouseup", shoot);
  canvas.addEventListener("mouseleave", canselShoot);

  initGame();
  setInterval(main, 20);
}
const initGame = () => {
  [status, playerNo, cnt, speed, angle] = ["ready", 0, 0, 0, 0];
  stones = [];
  current = new Stone(playerNo);
  stones.push(current);
}

const drawLine = (x1, y1, x2, y2, color = "#000000") => {
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}
const drawCircle = (x, y, r, color1, color2 = null) => {
  context.fillStyle = color1;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = color2;
  if (color2 != null) context.stroke();
}

const main = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawCircle(400, 200, 100, "#0000FF");
  drawCircle(400, 200, 70, "#FFFFFF");
  drawCircle(400, 200, 40, "#FF0000");
  drawCircle(400, 200, 10, "#FFFFFF");
  drawLine(100, 0, 100, 400);
  drawLine(400, 0, 400, 400);
  drawLine(700, 0, 700, 400);
  context.strokeRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < stones.length; i++) {
    stones[i].move();
    for (let j = 0; j < stones.length; j++) {
      if (i != j) stones[i].collide(stones[j]);
    }
  }
  let checkStop = true;
  for (stone of stones) {
    stone.draw();
    if (stone.v > 0) checkStop = false;
  }
  if (status == "charge") speed += 0.2;
  if (speed > 20) speed = 5;
  const x = current.x + speed * 20 * Math.cos(angle);
  const y = current.y + speed * 20 * Math.sin(angle);
  drawLine(current.x, current.y, x, y, "#00cc00");

  if ((status = "shoot") && (checkStop)) {
    cnt++;
    if (cnt = 10) {
      status = "end";
    } else {
      [status.playerNo] = ["ready", 1 - playerNo];
      current = new staone(pyayerNo);
      stones.push(current);
    }
  }
  let message = `プレイヤー【${name[playerNo]}}】のターン`;
  if (status == "end") {
    let [win, minD] = [-1, 800];
    for (stone of stones) {
      const [dx, dy] = [stone.x - 400, stone.y - 200];
      const d = (dx ** 2 + dy ** 2) ** 0.5;
      if (d < minD)[win, minD] = [stone.no, d];
    }
    message = `プレイヤー【${name[win]}】の勝ち！`;
  }
  document.getElementById("message").innerText = message;
}

const charge = event => {
  setAngle(event);
  if (status == "ready") status = "charge";
}

const shoot = event => {
  if (status == "charge") {
    setAngle(event);
    [current.v, current.angle] = [speed, angle];
    [status, speed] = ["shoot", 0];
  }
}

const setAngle = event => {
  const rect = event.target.getBoundingClientRect();
  const [x, y] = [event.clientX - rect.left, event.clientY - rect.top];
  angle = Math.atan2(y - current.y, x - current.x);
}

const canselShoot = event => {
  if (status == "charge") [status, speed] = ["ready", 0];
}
