var canvas, contex, canvasRect;
var x, y, ox, oy, angle, speed, a = 1;
var hole = [700, 200, 20];
var bk = new Array(4);
var status = "ready";
var stroke = 0;

function init() {
  canvas = document.getElementById("green");
  context = canvas.getContext("2d");
  canvasRect = canvas.getBoundingClientRect();

  startGame(0);
  setInterval(update, 50);
}

function startGame(n) {
  x = 50;
  y = canvas.height / 2;
  angle = 0;
  speed = 0;
  a = 1;
  status = "ready";
  stroke = 0;
  document.getElementById("stroke").innerText = stroke;
  document.getElementById("message").innerText = "";

  if (n == 0) {
    hole[0] = Math.random() * 50 + canvas.width - 100;
    hole[1] = Math.random() * 100 + canvas.height / 2 - 50;
    hole[2] = Math.random() * 5 + 15;
    for (var i = 0; i < bk.length; i++) {
      bk[i] = new Array(3);
      bk[i][0] = Math.random() * 100 + 100 * (i + 2);
      bk[i][1] = Math.random() * 80 * (i + 1);
      bk[i][2] = Math.random() * 50 + 50;
    }
  }
}

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  var inBunker = false;
  for (var i = 0; i < bk.length; i++) {
    drawCircle(bk[i][0], bk[i][1], bk[i][2], null, "#CC9966");
    inBunker = inBunker || context.isPointInPath(x, y);
  }
  if (status == "shot") {
    if (inBunker) {
      speed -= 2;
    } else {
      speed -= 0.2;
    }
    if (speed < 0) {
      speed = 0;
      status = "ready";
    }
    x += speed * Math.cos(angle);
    y += speed * Math.sin(angle);
    if ((x < 0) || (x > canvas.width) || (y < 0) || (y > canvas.height)) {
      document.getElementById("message").innerText = "OB!!";
      status = "ready";
      x = ox;
      y = oy;
      speed = 0;
      a = 1;
    }
  } else if (status == "charge") {
    speed += a;
    if ((speed > 20) || (speed < 0)) a *= -1;
  }
  drawCircle(hole[0], hole[1], hole[2], null, "#000000");
  if (context.isPointInPath(x, y)) {
    document.getElementById("message").innerText = "カップイン！";
    status = "end";
  }
  if (status != "end") drawCircle(x, y, 8, null, "#FFFFFF");
  if ((status == "ready") || (status == "charge")) drawAngle();
}

function drawCircle(x, y, r, strokeColor, fillColor) {
  context.lineWidth = 1;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  if (fillColor != null) {
    context.fillStyle = fillColor;
    context.fill();
  }
  if (strokeColor != null) {
    context.strokeStyle = strokeColor;
    context.stroke();
  }
}

function drawLine(x1, y1, x2, y2, color, width) {
  context.strokeStyle = color;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

function drawAngle() {
  drawCircle(x, y, 50, "#00FFFF", null);
  var tx = x + 50 * Math.cos(angle);
  var ty = y + 50 * Math.sin(angle);
  drawLine(x, y, tx, ty, "#00FFFF", 1);

  tx = x + speed * 5 * Math.cos(angle);
  ty = y + speed * 5 * Math.cos(angle);
  var color = "#FF9900";
  if (speed > 10) color = "#FF3333";
  drawLine(x, y, tx, ty, color, 2);
}

function charge(event) {
  if (status == "ready") status = "charge";
}

function aim(event) {
  if (status != "shot") {
    var tx = event.clientX - canvasRect.left;
    var ty = event.clientY - canvasRect.top;
    angle = Math.atan2(ty - y, tx - x);
  }
}

function shot(event) {
  if (status == "charge") {
    stroke++;
    document.getElementById("stroke").innerText = stroke;
    document.getElementById("message").innerText = "";
    ox = x;
    oy = y;
    status = "shot";
    if (speed > 10) angle += Math.random() * 0.4 - 0.2;
  }
}