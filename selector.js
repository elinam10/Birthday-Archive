const canvas = document.querySelector('#matrixCanvas');
const ctx = canvas.getContext('2d');
const glyphs = '01アイウエオカキクケコサシスセソЖДЙФΣλ{}[]<>/';
let cols = [];

document.querySelector('#prototypeVersionLabel').textContent = 'ПРОТОТИП ' + window.PROTOTYPE_VERSION;
document.querySelector('#activeBuild').textContent = window.PROTOTYPE_VERSION;

function resize() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  cols = Array.from({ length: Math.ceil(innerWidth / 18) }, () => Math.random() * -70);
}

function rain() {
  ctx.fillStyle = 'rgba(1,5,2,.12)';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  ctx.font = '14px monospace';
  cols.forEach((position, index) => {
    ctx.fillStyle = Math.random() > .96 ? '#d5ffe0' : '#3b9858';
    ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], index * 18, position * 18);
    cols[index] = position * 18 > innerHeight && Math.random() > .975
      ? Math.random() * -30
      : position + .48;
  });
  requestAnimationFrame(rain);
}

addEventListener('resize', resize);
resize();
rain();
