// Find every gallery on the page
const galleries = document.querySelectorAll('.gallery');

galleries.forEach(function (gallery) {
  const track = gallery.querySelector('.gallery-track');
  const total = track.children.length;             // how many pictures
  const delay = Number(gallery.dataset.delay) || 0; // this gallery's start offset
  let index = 0;                                    // which picture is showing now

  // Move to the next picture
  function next() {
    index = (index + 1) % total;                    // after the last one, go back to 0
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
  }

  // Wait for the offset, then switch every 3 seconds
  setTimeout(function () {
    setInterval(next, 12000);
  }, delay);
});


// ---------- BACKGROUND PARALLAX ----------
const drawings = document.querySelectorAll('.drawing');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (drawings.length > 0 && !reduceMotion) {
  let current = window.scrollY;   // where the drawings currently are
  let target = window.scrollY;    // where the page actually is
  let running = false;

  function update() {
    current += (target - current) * 0.08;   // move 8% of the remaining distance each frame

    drawings.forEach(function (drawing) {
      const speed = Number(drawing.dataset.speed) || 0.2;
      drawing.style.translate = '0 ' + (-current * speed) + 'px';
      drawing.style.rotate = (current * speed * 0.02) + 'deg';
    });

    if (Math.abs(target - current) > 0.5) {
      requestAnimationFrame(update);        // keep going until it catches up
    } else {
      running = false;                      // then stop, so it uses no power while idle
    }
  }

  window.addEventListener('scroll', function () {
    target = window.scrollY;
    if (!running) {
      running = true;
      requestAnimationFrame(update);
    }
  });
}

// ---------- RANDOM DRAWING POSITIONS ----------
const allDrawings = document.querySelectorAll('.drawing');

// Helper: a random number between min and max
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// Only place drawings that are actually visible (some are hidden on phones)
const visible = Array.from(allDrawings).filter(function (d) {
  return d.offsetParent !== null;
});

if (visible.length > 0) {
  // Divide the screen into a grid of cells, one cell per drawing
  const cols = Math.ceil(Math.sqrt(visible.length * 2));
  const rows = Math.ceil(visible.length / cols);

  // Make a list of all cells, then shuffle it
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r: r, c: c });
    }
  }
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  visible.forEach(function (drawing, i) {
    const cell = cells[i];

    // Random spot inside this drawing's own cell (kept away from the right/bottom edge)
    const left = (cell.c + rand(0.05, 0.75)) * (100 / cols);
    const top = (cell.r + rand(0.05, 0.75)) * (100 / rows);
    drawing.style.left = left + '%';
    drawing.style.top = top + '%';

    // Random movement: distance, rotation, speed, and starting point in the loop
    const duration = rand(10, 16);
    drawing.style.setProperty('--dx', rand(-100, 100) + 'px');
    drawing.style.setProperty('--dy', rand(-100, 100) + 'px');
    drawing.style.setProperty('--dr', rand(-9, 9) + 'deg');
    drawing.style.animationDuration = duration + 's';
    drawing.style.animationDelay = '-' + rand(0, duration) + 's';
  });
}