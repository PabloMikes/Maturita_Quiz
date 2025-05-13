let questions = [];
let correctCount = 0;
let totalCount = 0;
let selectedTopics = [];

// Načtení otázek z JSON podle kategorie
async function loadCategory(category) {
  const file = category === 'site' ? 'questions-site.json' : 'questions-java.json';
  const res = await fetch(file);
  questions = await res.json();
  correctCount = 0;
  totalCount = questions.length;
  document.getElementById('result').classList.add('hidden');
  
  if (category === 'java') {
    // Pro Javu rovnou spustíme test
    renderQuestions();
  } else {
    // Pro Sítě ukážeme výběr možností
    document.getElementById('category-select').classList.add('hidden');
    document.getElementById('topic-selection').classList.remove('hidden');
  }
}

// Zobrazí výběr témat pro Sítě
function showTopicSelection() {
  document.getElementById('topic-checkboxes').classList.remove('hidden');
  document.getElementById('start-selected-btn').classList.remove('hidden');
  
  const topicCheckboxes = document.getElementById('topic-checkboxes');
  topicCheckboxes.innerHTML = '';
  
  // Vytvoření checkboxů pro každé téma
  const topics = [...new Set(questions.map(q => q.topic))];
  topics.forEach(topic => {
    const container = document.createElement('div');
    container.classList.add('topic-item');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `topic-${topic}`;
    checkbox.value = topic;
    checkbox.checked = true;
    
    const label = document.createElement('label');
    label.htmlFor = `topic-${topic}`;
    label.textContent = topic;
    
    container.appendChild(checkbox);
    container.appendChild(label);
    topicCheckboxes.appendChild(container);
  });
}

// Spustí test s vybranými tématy
function startQuizWithSelectedTopics() {
  const checkboxes = document.querySelectorAll('#topic-checkboxes input[type="checkbox"]:checked');
  selectedTopics = Array.from(checkboxes).map(cb => cb.value);
  
  if (selectedTopics.length === 0) {
    alert('Vyberte alespoň jedno téma!');
    return;
  }
  
  // Filtrovat otázky podle vybraných témat
  const filteredQuestions = questions.filter(q => selectedTopics.includes(q.topic));
  
  // Pro každé téma vybrat náhodně 5 otázek
  const questionsPerTopic = 5;
  const selectedQuestions = [];
  
  selectedTopics.forEach(topic => {
    const topicQuestions = filteredQuestions.filter(q => q.topic === topic);
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, questionsPerTopic));
  });
  
  startQuiz(selectedQuestions);
}

// Spustí finální test pro Sítě - 5 otázek z každého tématu
function startFinalSiteTest() {
  const questionsPerTopic = 5;
  const selectedQuestions = [];
  
  // Projít všechna témata v SÍTĚ
  const topics = [...new Set(questions.map(q => q.topic))];
  topics.forEach(topic => {
    const topicQuestions = questions.filter(q => q.topic === topic);
    const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, questionsPerTopic));
  });
  
  startQuiz(selectedQuestions);
}

// Spustí quiz s vybranými otázkami
function startQuiz(selectedQuestions) {
  questions = selectedQuestions;
  correctCount = 0;
  totalCount = questions.length;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('topic-selection').classList.add('hidden');
  renderQuestions();
}

// Vykreslení otázek do kvízu
function renderQuestions() {
  const quiz = document.getElementById('quiz');
  quiz.innerHTML = '';
  document.getElementById('category-select').classList.add('hidden');

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

// Zbytek kódu (particles, space cats atd.) zůstává stejný

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

// ... (all your existing functions remain the same)

// Reset to main menu
function resetToMainMenu() {
  // Reset všeho na výchozí stav
  document.getElementById('category-select').classList.remove('hidden');
  document.getElementById('topic-selection').classList.add('hidden');
  document.getElementById('quiz').innerHTML = '';
  document.getElementById('result').classList.add('hidden');
  
  // Zajistíme, že tlačítko "SPUSTIT TEST" je viditelné
  document.getElementById('start-selected-btn').classList.remove('hidden');
  
  // Reset počítadel
  correctCount = 0;
  totalCount = 0;
}


function promptForCertificate() {
  const name = prompt("Zadejte své jméno pro certifikát:", "Jan Novák");
  if (name) {
    generateCertificate(name);
  }
}

function generateCertificate(name) {
  const percent = ((correctCount / totalCount) * 100).toFixed(1);
  const certificateContent = `
    <div class="certificate">
      <div class="certificate-border">
        <h1>Certifikát o úspěšném absolvování</h1>
        <div class="certificate-body">
          <p>Uživatel <strong>${name}</strong> úspěšně dokončil test s výsledkem:</p>
          <div class="certificate-score">${correctCount}/${totalCount} (${percent}%)</div>
          <p>Datum: ${new Date().toLocaleDateString('cs-CZ')}</p>
          <div class="certificate-stamp"></div>
        </div>
      </div>
    </div>
  `;

  // Skryjeme výsledek a zobrazíme certifikát
  document.getElementById('result').classList.add('hidden');
  document.getElementById('quiz').innerHTML = certificateContent;
}
