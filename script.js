let questions = [];
let correctCount = 0;
let totalCount = 0;

// Načtení otázek z JSON podle kategorie
async function loadCategory(category) {
  const res = await fetch('questions.json');
  const data = await res.json();
  questions = data[category];
  correctCount = 0;
  totalCount = questions.length;
  document.getElementById('result').classList.add('hidden');
  renderQuestions();
}

// Vykreslení otázek do kvízu
function renderQuestions() {
  const quiz = document.getElementById('quiz');
  quiz.innerHTML = '';

  questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-block');

    const title = document.createElement('h3');
    title.textContent = `${index + 1}. ${question.question}`;
    questionDiv.appendChild(title);

    const options = [...question.options];
    shuffleArray(options);

    options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      button.classList.add('option-button');
      button.addEventListener('click', () => handleAnswer(button, question, option, questionDiv));
      questionDiv.appendChild(button);
    });

    quiz.appendChild(questionDiv);
  });
}

// Zpracování odpovědi uživatele
function handleAnswer(selectedButton, question, selectedOption, container) {
  const buttons = container.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);

  const correctAnswer = question.answer;

  buttons.forEach(btn => {
    if (btn.textContent === correctAnswer) {
      btn.classList.add('correct');
    } else if (btn === selectedButton && btn.textContent !== correctAnswer) {
      btn.classList.add('incorrect');
    }
  });

  if (selectedOption === correctAnswer) {
    correctCount++;
  }

  showResult();
}

// Zobrazení výsledků kvízu
function showResult() {
  const result = document.getElementById('result');
  result.classList.remove('hidden');
  
  const percent = ((correctCount / totalCount) * 100).toFixed(1);
  const resultDigits = result.querySelector('.result-digits');
  const resultText = result.querySelector('.result-text');
  
  resultDigits.textContent = `${correctCount}/${totalCount}`;
  resultText.textContent = `Úspěšnost: ${percent}%`;
  
  resultDigits.classList.add('animate-glow');
  setTimeout(() => {
    resultDigits.classList.remove('animate-glow');
  }, 1000);
}

// Náhodné zamíchání pole odpovědí
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Interaktivní částicový systém
const particlesContainer = document.querySelector('.particles');
const maxCats = 5;
let cats = [];

function createParticle(x, y) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particlesContainer.appendChild(particle);
  
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  const speed = 2 + Math.random() * 3;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  
  let life = 60;
  
  function updateParticle() {
    x += vx;
    y += vy;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    life--;
    if (life <= 0) {
      particle.remove();
    } else {
      requestAnimationFrame(updateParticle);
    }
  }
  
  updateParticle();
}

// Reakce na pohyb myši
document.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.1) {
    createParticle(e.clientX, e.clientY);
  }
});

// Reakce na kliknutí
document.addEventListener('click', (e) => {
  for (let i = 0; i < 10; i++) {
    createParticle(e.clientX, e.clientY);
  }
});

// Funkce pro vytvoření vesmírné kočky
function createSpaceCat() {
  if (cats.length >= maxCats) return;

  const cat = document.createElement('div');
  cat.classList.add('space-cat');
  cat.innerHTML = '🐱';
  particlesContainer.appendChild(cat);
  cats.push(cat);

  let x = Math.random() * (window.innerWidth - 40);
  let y = Math.random() * (window.innerHeight - 40);
  cat.style.left = `${x}px`;
  cat.style.top = `${y}px`;

  const speed = 1 + Math.random() * 2;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  function updateCat() {
    x += vx;
    y += vy;

    if (x < -40 || x > window.innerWidth || y < -40 || y > window.innerHeight) {
      cat.remove();
      cats = cats.filter(c => c !== cat);
    } else {
      cat.style.left = `${x}px`;
      cat.style.top = `${y}px`;
      requestAnimationFrame(updateCat);
    }
  }

  updateCat();

  cat.addEventListener('click', () => {
    createExplosion(x + 20, y + 20);
    cat.remove();
    cats = cats.filter(c => c !== cat);
  });
}

// Funkce pro vytvoření exploze
function createExplosion(x, y) {
  const colors = ['var(--primary)', 'var(--secondary)', 'var(--tertiary)', 'var(--correct)'];
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.classList.add('explosion-particle');
    particlesContainer.appendChild(particle);

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;

    const speed = 3 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    let life = 30;

    function updateParticle() {
      x += vx;
      y += vy;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      life--;
      if (life <= 0) {
        particle.remove();
      } else {
        requestAnimationFrame(updateParticle);
      }
    }

    updateParticle();
  }
}

// Periodické vytváření koček
setInterval(() => {
  if (Math.random() < 0.3) {
    createSpaceCat();
  }
}, 1000);