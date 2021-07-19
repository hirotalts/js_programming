var numArray, numAll, index;

function init() {
  numArray = [
    [],
    [],
    [],
    [],
    []
  ];
  numAll = [];
  index = 0;
  document.getElementById("message").innerText = "";
  document.getElementById("card").innerHTML = "";
  document.getElementById("number").innerText = "";
  document.getElementById("next").disabled = false;
  document.getElementById("list").innerHTML = "";

  for (var n = 1; n <= 75; n++) {
    numAll.push(n);
    if (n <= 15) {
      numArray[0].push(n);
    } else if (n <= 30) {
      numArray[1].push(n);
    } else if (n <= 45) {
      numArray[2].push(n);
    } else if (n <= 60) {
      numArray[3].push(n);
    } else {
      numArray[4].push(n);
    }
  }

  for (var i = 0; i < 5; i++) {
    shuffle(numArray[i]);
    var cols = document.createElement("div");
    for (var j = 0; j < 5; j++) {
      var div = document.createElement("div");
      div.className = "masu";
      if ((i == 2) && (j == 2)) {
        div.classList.add("free");
        div.innerText = "FREE";
        numArray[i][j] = 0;
      } else {
        div.id = "num_" + numArray[i][j];
        div.innerText = numArray[i][j];
      }
      cols.appendChild(div);
    }
    document.getElementById("card").appendChild(cols);
  }
  shuffle(numAll);
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * i);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function showNumber() {
  document.getElementById("number").innerText = numAll[index];
  var div = document.createElement("div");
  div.className = "num";
  div.innerText = numAll[index];
  document.getElementById("list").appendChild(div);
  var num = document.getElementById("num_" + numAll[index]);
  if (num != null) {
    num.classList.add("hit");
    div.classList.add("hit");
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        if (numArray[i][j] == numAll[index]) {
          numArray[i][j] = 0;
        }
      }
    }
  }
  index++;
  if (checkBingo()) {
    document.getElementById("next").disabled = true;
    var message = "BINGO!! [" + index + "/75]";
    document.getElementById("message").innerText = message;
  }
}

function checkBingo() {
  var bingo = false,
    cnt1 = 0,
    cnt2 = 0;
  for (var i = 0; i < 5; i++) {
    if (numArray[i][i] == 0) cnt1++;
    if (numArray[4 - i][i] == 0) cnt2++;
    var cnt3 = 0,
      cnt4 = 0;
    for (var j = 0; j < 5; j++); {
      if (numArray[i][j] == 0) cnt3++;
      if (numArray[j][i] == 0) cnt4++;
    }
    if ((cnt1 == 5) || (cnt2 == 5) || (cnt3 == 5) || (cnt4 == 5)) {
      bingo = true;
    }
  }
  return bingo;
}