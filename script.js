let questions = [];
let correctCount = 0;
let totalCount = 0;
let selectedTopics = [];
let currentCategory = '';

function showTopicSelection() {
  const topicButtons = document.getElementById('topic-buttons');
  topicButtons.innerHTML = '';
  const topics = [...new Set(questions.map(q => q.topic))];
  topics.forEach(topic => {
    const button = document.createElement('button');
    button.className = 'topic-btn'; // No 'selected' class initially
    button.textContent = topic;
    button.dataset.topic = topic;
    button.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
    topicButtons.appendChild(button);
  });
}

async function loadCategory(category) {
  currentCategory = category;
  const file = 
    category === 'site' ? 'questions-site.json' :
    category === 'java' ? 'questions-java.json' :
    'questions-cestina.json';
    
  const res = await fetch(file);
  questions = await res.json();
  correctCount = 0;
  totalCount = questions.length;
  document.getElementById('result').classList.add('hidden');
  
  document.getElementById('category-select').classList.add('hidden');
  document.getElementById('topic-selection').classList.remove('hidden');
  showTopicSelection();
}

function startQuizWithSelectedTopics() {
  const selectedButtons = document.querySelectorAll('.topic-btn.selected');
  if (selectedButtons.length === 0) {
    alert('Vyberte alespoň jedno téma!');
    return;
  }
  
  const selectedTopics = Array.from(selectedButtons).map(btn => btn.dataset.topic);
  let selectedQuestions = [];
  
  if (currentCategory === 'site') {
    // Pro SÍTĚ: 10 otázek z každého tématu
    const questionsPerTopic = 10;
    selectedTopics.forEach(topic => {
      const topicQuestions = questions.filter(q => q.topic === topic);
      const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, questionsPerTopic));
    });
  } else {
    // Pro JAVU a ČEŠTINU: všechny otázky z vybraných témat
    selectedQuestions = questions.filter(q => selectedTopics.includes(q.topic));
  }
  
  startQuiz(selectedQuestions);
}

function startFinalTest() {
  let selectedQuestions = [];
  
  if (currentCategory === 'site') {
    // Pro SÍTĚ: 10 otázek z každého tématu
    const questionsPerTopic = 10;
    const topics = [...new Set(questions.map(q => q.topic))];
    topics.forEach(topic => {
      const topicQuestions = questions.filter(q => q.topic === topic);
      const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, questionsPerTopic));
    });
  } else {
    // Pro JAVU a ČEŠTINU: všechny otázky
    selectedQuestions = [...questions];
  }
  
  startQuiz(selectedQuestions);
}

function startQuiz(selectedQuestions) {
  // Dále zamíchá celý výběr otázek, aby nebyly seřazené po tématech
  questions = [...selectedQuestions].sort(() => 0.5 - Math.random());
  correctCount = 0;
  totalCount = questions.length;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('topic-selection').classList.add('hidden');
  renderQuestions();
}

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
  
  document.getElementById('certificate-btn').classList.remove('hidden');
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function resetToMainMenu() {
  document.getElementById('category-select').classList.remove('hidden');
  document.getElementById('topic-selection').classList.add('hidden');
  document.getElementById('quiz').innerHTML = '';
  document.getElementById('result').classList.add('hidden');
  document.getElementById('certificate-btn').classList.add('hidden');
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
  
  // Determine the subject name based on currentCategory
  let subjectName;
  switch(currentCategory) {
    case 'site':
      subjectName = 'SÍTĚ';
      break;
    case 'java':
      subjectName = 'JAVA';
      break;
    case 'cestina':
      subjectName = 'CEŠTINA'; // Změněno na obecnější název
      break;
    default:
      subjectName = 'TEST';
  }
  
  // Get selected topics - upraveno pro lepší formátování
  const selectedButtons = document.querySelectorAll('.topic-btn.selected');
  let topicsText = '';
  
  if (selectedButtons.length > 0) {
    const topics = Array.from(selectedButtons).map(btn => {
      // Pro českou literaturu zobrazíme pouze název díla (pokud obsahuje číslo a tečku na začátku)
      if (currentCategory === 'cestina') {
        return btn.textContent.replace(/^\d+\.\s*/, ''); // Odstraní číslo a tečku na začátku
      }
      return btn.textContent;
    });
    
    topicsText = `<div class="certificate-topics">
      <h3>Probraná témata:</h3>
      <ul>${topics.map(topic => `<li>${topic}</li>`).join('')}</ul>
    </div>`;
  }

  const certificateHTML = `
    <div class="certificate">
      <div class="certificate-border">
        <h1>Certifikát o úspěšném absolvování</h1>
        <div class="certificate-body">
          <p>Uživatel <strong>${name}</strong> úspěšně dokončil:</p>
          <div class="certificate-subject">${subjectName}</div>
          ${topicsText}
          <div class="certificate-score">${correctCount}/${totalCount} (${percent}%)</div>
          <p>Datum: ${new Date().toLocaleDateString('cs-CZ')}</p>
          <div class="certificate-stamp"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('quiz').innerHTML = certificateHTML;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('certificate-btn').classList.add('hidden');
}

// Particle system and space cats effects
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

document.addEventListener('mousemove', (e) => {
  if (Math.random() < 0.1) {
    createParticle(e.clientX, e.clientY);
  }
});

document.addEventListener('click', (e) => {
  for (let i = 0; i < 10; i++) {
    createParticle(e.clientX, e.clientY);
  }
});

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

setInterval(() => {
  if (Math.random() < 0.3) {
    createSpaceCat();
  }
}, 850);