const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const velocidadInput = document.getElementById("v0");
const alturaInicialInput = document.getElementById("h0");
const gravedadInput = document.getElementById("g");
const btn = document.getElementById("start");
const selector = document.getElementById("selector");
const alturaMaxEl = document.getElementById("alturaMax");

let container = document.querySelector(".container");


let escala = canvas.height / 200;

let modo = "caida_libre";
let animando = false;

let propsBall = {
  x: 380,
  y: canvas.height - 0 * escala,
  radius: 15,
  vy: 0,
  gravity: 9.8 / 60,
  bounce: -0.7
};

function drawRegla() {
  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.lineTo(50, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "14px Arial";
  ctx.fillStyle = "black";

  for (let i = 0; i <= 200; i += 10) {
    let y = canvas.height - i * escala;
    ctx.beginPath();
    ctx.moveTo(45, y);
    ctx.lineTo(55, y);
    ctx.stroke();

    ctx.fillText(i + "m", 10, y + 5);
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(propsBall.x, propsBall.y, propsBall.radius, 0, Math.PI * 2);
  ctx.fillStyle = "lightblue";
  ctx.fill();
  ctx.closePath();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRegla();

  if (animando) {
    propsBall.vy += propsBall.gravity;
    propsBall.y += propsBall.vy;

    if (propsBall.y + propsBall.radius > canvas.height) {
      propsBall.y = canvas.height - propsBall.radius;
      propsBall.vy *= propsBall.bounce;
    }

    if (propsBall.y - propsBall.radius < 0) {
      propsBall.y = propsBall.radius;
      propsBall.vy = 0;
    }
  }

  drawBall();

  // Scroll automático
  let scrollY = propsBall.y - container.clientHeight / 2;
  if (scrollY < 0) scrollY = 0;
  container.scrollTop = scrollY;

  requestAnimationFrame(update);
}

alturaInicialInput.addEventListener("input", () => {
  let h0 = parseFloat(alturaInicialInput.value);
  if (!isNaN(h0)) {
    if (modo === "caida_libre") {
      propsBall.y = canvas.height - h0 * escala;
      if (propsBall.y < propsBall.radius) propsBall.y = propsBall.radius;
      if (propsBall.y > canvas.height - propsBall.radius) propsBall.y = canvas.height - propsBall.radius;

      animando = false;
      propsBall.vy = 0;
    }
  }
});

selector.addEventListener("change", () => {
  modo = selector.value;
  animando = false;
  propsBall.vy = 0;


  if (modo == "caida_libre") {
        alert("Modo de Caida Libre activado" + 
          `Para iniciar, puedes colocar como velocidad inicial 25, altura inicial 100 y gravedad 9.8`
        )
        alturaInicialInput.disabled = false; // Habilita altura inicial

    propsBall.x = 380;
    alturaMaxEl.textContent = "0";
  } 
  else if( modo == "tiro_vertical") {
     alert("Modo de tiro vertical activado" + 
          `Para iniciar, puedes colocar como velocidad inicial 45 y gravedad 9.8`
        )
        alturaInicialInput.disabled = true

    propsBall.x = 380;
    propsBall.y = canvas.height - propsBall.radius;
    alturaMaxEl.textContent = "0";

  }
});

btn.addEventListener("click", () => {


  let v0 = parseFloat(velocidadInput.value);
  let h0 = parseFloat(alturaInicialInput.value);
  let g = parseFloat(gravedadInput.value);

  if (isNaN(v0)) v0 = 0;
  if (isNaN(h0)) h0 = 0;
  if (isNaN(g)) g = 9.8;

  propsBall.gravity = g / 60;

  if (modo === "caida_libre") {
    propsBall.y = canvas.height - h0 * escala;
    propsBall.vy = v0; // Aumenta velocidad notoria (antes era /60)
    animando = true;

  } else {
    propsBall.y = canvas.height - propsBall.radius;
    propsBall.vy = -v0; // Aumenta velocidad notoria (antes era /60)
    animando = true;

    let hmax = (v0 * v0) / (2 * g);
    alturaMaxEl.textContent = hmax.toFixed(2);
    alert("La altura máxima es: " + alturaMaxEl.tex + " m");
  }
});

update();
