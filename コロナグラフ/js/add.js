let canvas, context;
let titleData = new Array();
let numData = new Array();
let sDate = new Date(),
  eDate = new Date("2000/01/01");
let max = 100;
const week = ["日", "月", "火", "水", "木", "金", "土"];
const color = ["red", "green", "blue", "magenta", "gray"];

const init = () => {
  canvas = document.getElementById("graph");
  context = canvas.getContext("2d");
}

const loadData = files => {
  for (file of files) {
    const reader = new FileReader();
    reader.onload = () => {
      const rows = reader.result.split("\n");
      const header = rows[0].split(",");
      if ((header.length == 2) && (header[0] == "日付") && titleData.indexOf(header[1] == -1)) {
        const index = titleData.length;
        titleData[index] = header[1];
        const title = document.createElement("span");
        title.innerHTML = `■${header[1]}`;
        title.style.color = color[index];
        document.getElementById("guide").appendChild(title);

        numData[index] = new Array();
        for (let i = 1; i < rows.length; i++) {
          const data = rows[i].split(",");
          const target = new Date(data[0]);
          const num = Number(data[1]);
          numData[index][getYMD(target)] = num;
          if (sDate > target) sDate = target;
          if (eDate < target) eDate = target;
          if (max < num) max = num;
        }
      }
      drawGraph();
    }
    reader.readAsText(file);
  }
}

const getYMD = (targetDate, format = "ymd") => {
  const yyyy = targetDate.getFullYear();
  const mm = ("00" + (targetDate.getMonth() + 1)).slice(-2);
  const dd = ("00" + (targetDate.getDate())).slice(-2);
  const day = targetDate.getDay();
  let ret = `${yyyy}/${mm}/${dd} (${week[day]})`;
  return ret;
}

const drawText = (text, x, y, base, align) => {
  context.font = "10px sans-selif";
  context.textBaseline = base;
  context.textAlign = align;
  context.fillText(text, x, y);
}

const drawGraph = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "black";
  context.beginPath();
  context.moveTo(50, 0);
  context.lineTo(50, 350);
  context.lineTo(750, 350);
  context.stroke();

  const h = Math.ceil(max / 1000) * 1000;
  drawText(h / 4, 45, 350 * (1 - (h / 4) / max), "middle", "right");
  drawText(h / 2, 45, 350 * (1 - (h / 2) / max), "middle", "right");
  drawText(h / 4 * 3, 45, 350 * (1 - (h / 4 * 3) / max), "middle", "right");

  let [target, cnt] = [new Date(sDate), 0];
  const w = Math.floor((eDate - sDate) / (60 * 60 * 24 * 1000));
  while (target <= eDate) {
    drawText(getYMD(target, "md"), 50 + cnt / w * 700, 360, "top", "center");
    target.setDate(target.getDate() + 14);
    cnt += 14;
  }

  for (let i = 0; i < titleData.length; i++) {
    context.strokeStyle = color[i];
    context.beginPath();
    [target, cnt] = [new Date(sDate), 0];
    while (target <= eDate) {
      let num = numData[i][getYMD(target)];
      if (num == undefined) num = 0;
      const x = 50 + cnt / w * 700;
      const y = 350 * (1 - num / max);
      if (target == sDate) context.moveTo(x, y);
      if (target > sDate) context.lineTo(x, y);
      target.setDate(target.getDate() + 1);
      cnt++;
    }
    context.stroke();
  }
  const table = document.getElementById("dataTable");
  table.innerHTML = "";
  const header = document.createElement("tr");
  const td = document.createElement("td");
  td.innerText = "日付";
  header.appendChild(td);
  for (let i = 0; i < titleData.length; i++) {
    const td = document.createElement("td");
    td.innerText = titleData[i];
    header.appendChild(td);
  }
  table.appendChild(header);
  target = new Date(sDate);
  while (target <= eDate) {
    const data = document.createElement("tr");
    const td = document.createElement("td");
    td.style.textAlign = "left";
    td.innerText = getYMD(target, "ymdd");
    data.appendChild(td);

    for (let i = 0; i < titleData.length; i++) {
      const td = document.createElement("td");
      td.style.textAlign = "right";
      let num = numData[i][getYMD(target)];
      if (num == undefined) num = "--";
      td.innerText = num;
      data.appendChild(td);
    }
    table.appendChild(data);
    target.setDate(target.getDate() + 1);
  }
}