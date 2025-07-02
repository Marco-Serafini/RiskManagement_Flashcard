// Application State
let currentUser = null;
let currentSession = null;
let flashcardData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize app with data
async function initializeApp() {
    // Load flashcard data from provided JSON
    flashcardData = {
        "domains": [
            {
                "name": "Principi di Risk management",
                "id": "principles", 
                "description": "Fondamenti e concetti base del risk management",
                "topics": ["Definizione di rischio", "Obiettivi del risk management", "Risk appetite e risk tolerance", "Stakeholder management nel risk management", "Governance dei rischi"]
            },
            {
                "name": "Contesto e concetti fondamentali di Risk management", 
                "id": "context",
                "description": "Il contesto in cui si applica il risk management e i concetti chiave",
                "topics": ["Analisi del contesto organizzativo", "Fattori ambientali dell'impresa", "Asset organizzativi", "Categorie di rischio", "Cultura del rischio"]
            },
            {
                "name": "Risk strategy and planning",
                "id": "strategy", 
                "description": "Pianificazione e strategia per la gestione dei rischi",
                "topics": ["Risk management plan", "Strategie di risposta ai rischi", "Pianificazione delle contingenze", "Prioritizzazione dei rischi", "Integrazione del risk management nel project management"]
            }
        ],
        "flashcards": [
            {
                "domain": "principles",
                "front": "Qual è la definizione di rischio secondo il PMI?",
                "back": "Un evento o condizione incerta che, se si verifica, ha un effetto positivo o negativo su uno o più obiettivi del progetto."
            },
            {
                "domain": "principles", 
                "front": "Quali sono i due tipi principali di rischio?",
                "back": "Rischi negativi (minacce) e rischi positivi (opportunità)."
            },
            {
                "domain": "principles",
                "front": "Cos'è il risk appetite?", 
                "back": "Il grado di incertezza che un'entità è disposta ad accettare in previsione di una ricompensa."
            },
            {
                "domain": "principles",
                "front": "Qual è la differenza tra risk appetite e risk tolerance?",
                "back": "Risk appetite è il livello di rischio che un'organizzazione è disposta ad accettare, mentre risk tolerance è la deviazione quantificabile che l'organizzazione è disposta a tollerare rispetto ai suoi obiettivi."
            },
            {
                "domain": "principles", 
                "front": "Quali sono i principali stakeholder nel risk management?",
                "back": "Sponsor del progetto, project manager, team di progetto, esperti di dominio, clienti, utenti finali, fornitori, e autorità di regolamentazione."
            },
            {
                "domain": "context",
                "front": "Quali sono i fattori ambientali dell'impresa rilevanti per il risk management?",
                "back": "Cultura organizzativa, standard e regolamenti di settore, infrastruttura esistente, risorse umane, condizioni di mercato, clima politico, tolleranza al rischio degli stakeholder."
            },
            {
                "domain": "context",
                "front": "Quali sono le principali categorie di rischio?", 
                "back": "Rischi tecnici, rischi esterni, rischi organizzativi, rischi di project management."
            },
            {
                "domain": "context",
                "front": "Cosa si intende per cultura del rischio?",
                "back": "L'insieme di valori, credenze, conoscenze e comprensione del rischio condivisi da un gruppo di persone con un obiettivo comune, in particolare i membri di un'organizzazione."
            },
            {
                "domain": "context",
                "front": "Quali sono gli asset organizzativi rilevanti per il risk management?",
                "back": "Processi e procedure, conoscenze basate sull'esperienza, lezioni apprese da progetti precedenti, database di rischi, template e checklist."
            },
            {
                "domain": "context", 
                "front": "Perché è importante l'analisi del contesto organizzativo nel risk management?",
                "back": "Perché aiuta a identificare i fattori interni ed esterni che possono influenzare il modo in cui i rischi vengono gestiti e fornisce una base per la definizione dei criteri di rischio."
            },
            {
                "domain": "strategy",
                "front": "Quali sono i componenti principali di un risk management plan?",
                "back": "Metodologia, ruoli e responsabilità, budget, tempistiche, categorie di rischio, definizioni di probabilità e impatto, matrice di probabilità e impatto, formati di reporting."
            },
            {
                "domain": "strategy",
                "front": "Quali sono le quattro strategie principali per rispondere alle minacce?",
                "back": "Evitare, trasferire, mitigare, accettare."
            },
            {
                "domain": "strategy", 
                "front": "Quali sono le quattro strategie principali per rispondere alle opportunità?",
                "back": "Sfruttare, condividere, migliorare, accettare."
            },
            {
                "domain": "strategy",
                "front": "Cos'è un piano di contingenza?",
                "back": "Un piano che identifica strategie e azioni alternative da implementare se determinati eventi si verificano."
            },
            {
                "domain": "strategy",
                "front": "Come si integra il risk management nel project management?", 
                "back": "Attraverso l'inclusione di attività di risk management nel piano di project management, l'allocazione di risorse, la definizione di responsabilità, e l'integrazione nei processi di monitoraggio e controllo del progetto."
            }
        ]
    };
    
    // Initialize user data if not exists
    initializeUserData();
    
    // Show login screen
    showScreen('login-screen');
}

// User Management
function selectProfile(profileType) {
    if (profileType === 'admin') {
        document.getElementById('admin-code-input').classList.remove('hidden');
    } else {
        currentUser = { type: 'student', id: 'student_1' };
        showDashboard();
    }
}

function verifyAdminCode() {
    const code = document.getElementById('admin-code').value;
    if (code === 'RMP-ADMIN-2025') {
        currentUser = { type: 'admin', id: 'admin_1' };
        showDashboard();
    } else {
        alert('Codice amministratore non valido');
    }
}

function logout() {
    currentUser = null;
    currentSession = null;
    document.getElementById('admin-code').value = '';
    document.getElementById('admin-code-input').classList.add('hidden');
    showScreen('login-screen');
}

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showDashboard() {
    if (currentUser.type === 'student') {
        updateStudentDashboard();
        showScreen('student-dashboard');
    } else {
        updateAdminDashboard();
        showScreen('admin-dashboard');
    }
}

// Data Management
function initializeUserData() {
    if (!localStorage.getItem('pmi-rmp-cards')) {
        const cardsWithSM2 = flashcardData.flashcards.map((card, index) => ({
            ...card,
            id: index,
            state: 'new', // new, learning, review
            easeFactor: 2.5,
            interval: 0,
            repetitions: 0,
            dueDate: new Date().toISOString(),
            lastReviewed: null,
            quality: null
        }));
        
        localStorage.setItem('pmi-rmp-cards', JSON.stringify(cardsWithSM2));
        localStorage.setItem('pmi-rmp-progress', JSON.stringify({
            principles: { studied: 0, total: 5 },
            context: { studied: 0, total: 5 },
            strategy: { studied: 0, total: 5 },
            sessionsCompleted: 0,
            totalStudyTime: 0
        }));
    }
}

function getCards() {
    return JSON.parse(localStorage.getItem('pmi-rmp-cards') || '[]');
}

function saveCards(cards) {
    localStorage.setItem('pmi-rmp-cards', JSON.stringify(cards));
}

function getProgress() {
    return JSON.parse(localStorage.getItem('pmi-rmp-progress') || '{}');
}

function saveProgress(progress) {
    localStorage.setItem('pmi-rmp-progress', JSON.stringify(progress));
}

// SuperMemo 2 Algorithm
function calculateSM2(card, quality) {
    let { easeFactor, interval, repetitions } = card;
    
    if (quality >= 3) {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions++;
    } else {
        repetitions = 0;
        interval = 1;
    }
    
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
    
    // Calculate due date based on quality
    let dueDate = new Date();
    switch (quality) {
        case 0:
        case 1:
            dueDate.setMinutes(dueDate.getMinutes() + 10);
            card.state = 'learning';
            break;
        case 2:
            dueDate.setDate(dueDate.getDate() + 1);
            card.state = 'learning';
            break;
        case 3:
        case 4:
            dueDate.setDate(dueDate.getDate() + 3);
            card.state = 'review';
            break;
        case 5:
            dueDate.setDate(dueDate.getDate() + 7);
            card.state = 'review';
            break;
    }
    
    return {
        ...card,
        easeFactor,
        interval,
        repetitions,
        dueDate: dueDate.toISOString(),
        lastReviewed: new Date().toISOString(),
        quality
    };
}

// Student Dashboard Functions
function updateStudentDashboard() {
    const cards = getCards();
    const progress = getProgress();
    
    // Update stats
    document.getElementById('total-cards').textContent = cards.length;
    document.getElementById('studied-cards').textContent = cards.filter(c => c.state !== 'new').length;
    document.getElementById('learning-cards').textContent = cards.filter(c => c.state === 'learning').length;
    document.getElementById('review-cards').textContent = cards.filter(c => c.state === 'review').length;
    
    // Update progress areas
    updateProgressAreas(cards);
    
    // Update area selection
    updateAreaSelection();
    
    // Update today's review cards
    updateTodayCards(cards);
}

function updateProgressAreas(cards) {
    const progressContainer = document.getElementById('progress-areas');
    progressContainer.innerHTML = '';
    
    flashcardData.domains.forEach(domain => {
        const domainCards = cards.filter(c => c.domain === domain.id);
        const studiedCards = domainCards.filter(c => c.state !== 'new');
        const percentage = domainCards.length > 0 ? (studiedCards.length / domainCards.length) * 100 : 0;
        
        const progressItem = document.createElement('div');
        progressItem.className = 'progress-item';
        progressItem.innerHTML = `
            <div class="progress-header">
                <h3>${domain.name}</h3>
                <span>${studiedCards.length}/${domainCards.length} (${Math.round(percentage)}%)</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        progressContainer.appendChild(progressItem);
    });
}

function updateAreaSelection() {
    const areaContainer = document.getElementById('area-selection');
    areaContainer.innerHTML = '';
    
    flashcardData.domains.forEach(domain => {
        const areaDiv = document.createElement('div');
        areaDiv.className = 'area-checkbox';
        areaDiv.innerHTML = `
            <input type="checkbox" id="area-${domain.id}" value="${domain.id}">
            <label for="area-${domain.id}">
                <strong>${domain.name}</strong><br>
                <small>${domain.description}</small>
            </label>
        `;
        areaContainer.appendChild(areaDiv);
        
        // Add click handler for the entire div
        const checkbox = areaDiv.querySelector('input[type="checkbox"]');
        areaDiv.addEventListener('click', function(e) {
            // Prevent double-triggering when clicking directly on checkbox
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            // Update visual state
            updateAreaCheckboxState(areaDiv, checkbox.checked);
        });
        
        // Also handle direct checkbox clicks
        checkbox.addEventListener('change', function() {
            updateAreaCheckboxState(areaDiv, checkbox.checked);
        });
    });
}

function updateAreaCheckboxState(areaDiv, isChecked) {
    if (isChecked) {
        areaDiv.classList.add('selected');
    } else {
        areaDiv.classList.remove('selected');
    }
}

function updateTodayCards(cards) {
    const todayContainer = document.getElementById('today-cards');
    const now = new Date();
    const todayCards = cards.filter(card => {
        const dueDate = new Date(card.dueDate);
        return dueDate <= now;
    });
    
    todayContainer.innerHTML = '';
    
    if (todayCards.length === 0) {
        todayContainer.innerHTML = '<p>Nessuna carta da ripassare oggi!</p>';
        return;
    }
    
    todayCards.slice(0, 6).forEach(card => {
        const domain = flashcardData.domains.find(d => d.id === card.domain);
        const cardDiv = document.createElement('div');
        cardDiv.className = 'today-card card';
        cardDiv.innerHTML = `
            <div class="card__body">
                <div class="card-status card-status--${card.state}">${card.state.toUpperCase()}</div>
                <h4>${domain.name}</h4>
                <p>${card.front.substring(0, 60)}...</p>
            </div>
        `;
        todayContainer.appendChild(cardDiv);
    });
}

// Admin Dashboard Functions
function updateAdminDashboard() {
    const cards = getCards();
    const progress = getProgress();
    
    // Update admin stats
    document.getElementById('active-students').textContent = '1';
    document.getElementById('admin-total-cards').textContent = cards.length;
    document.getElementById('total-sessions').textContent = progress.sessionsCompleted || 0;
    
    // Update areas analytics
    updateAdminAreas(cards);
}

function updateAdminAreas(cards) {
    const adminAreasContainer = document.getElementById('admin-areas');
    adminAreasContainer.innerHTML = '';
    
    flashcardData.domains.forEach(domain => {
        const domainCards = cards.filter(c => c.domain === domain.id);
        const newCards = domainCards.filter(c => c.state === 'new').length;
        const learningCards = domainCards.filter(c => c.state === 'learning').length;
        const reviewCards = domainCards.filter(c => c.state === 'review').length;
        const avgQuality = domainCards.filter(c => c.quality !== null).reduce((sum, c) => sum + c.quality, 0) / domainCards.filter(c => c.quality !== null).length || 0;
        
        const areaDiv = document.createElement('div');
        areaDiv.className = 'admin-area-card';
        areaDiv.innerHTML = `
            <div class="admin-area-header">
                <h3>${domain.name}</h3>
                <span class="status--info">Media Qualità: ${avgQuality.toFixed(1)}</span>
            </div>
            <div class="admin-area-stats">
                <div class="admin-area-stat">
                    <span class="number">${newCards}</span>
                    <span class="label">Nuove</span>
                </div>
                <div class="admin-area-stat">
                    <span class="number">${learningCards}</span>
                    <span class="label">Apprendimento</span>
                </div>
                <div class="admin-area-stat">
                    <span class="number">${reviewCards}</span>
                    <span class="label">Ripasso</span>
                </div>
                <div class="admin-area-stat">
                    <span class="number">${domainCards.length}</span>
                    <span class="label">Totali</span>
                </div>
            </div>
        `;
        adminAreasContainer.appendChild(areaDiv);
    });
}

// Study Session Functions
function startStudySession() {
    // Get selected areas
    const selectedCheckboxes = document.querySelectorAll('#area-selection input[type="checkbox"]:checked');
    const selectedAreas = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    if (selectedAreas.length === 0) {
        alert('Seleziona almeno un\'area di studio!');
        return;
    }
    
    const cards = getCards();
    const now = new Date();
    
    // Get cards due for review or new cards from selected areas
    const availableCards = cards.filter(card => {
        if (!selectedAreas.includes(card.domain)) return false;
        
        // Include new cards and cards due for review
        if (card.state === 'new') return true;
        
        const dueDate = new Date(card.dueDate);
        return dueDate <= now;
    });
    
    if (availableCards.length === 0) {
        alert('Nessuna carta disponibile per lo studio nelle aree selezionate!');
        return;
    }
    
    // Shuffle and limit to 10 cards
    const shuffled = availableCards.sort(() => Math.random() - 0.5);
    const sessionCards = shuffled.slice(0, Math.min(10, shuffled.length));
    
    currentSession = {
        cards: sessionCards,
        currentIndex: 0,
        startTime: new Date(),
        responses: []
    };
    
    showStudySession();
}

function showStudySession() {
    showScreen('study-screen');
    displayCurrentCard();
}

function displayCurrentCard() {
    if (!currentSession || currentSession.currentIndex >= currentSession.cards.length) {
        endStudySession();
        return;
    }
    
    const card = currentSession.cards[currentSession.currentIndex];
    
    document.getElementById('question-text').textContent = card.front;
    document.getElementById('answer-text').textContent = card.back;
    document.getElementById('current-card').textContent = currentSession.currentIndex + 1;
    document.getElementById('total-study-cards').textContent = currentSession.cards.length;
    
    // Reset card state
    const flashcard = document.getElementById('flashcard');
    const flipBtn = document.getElementById('flip-btn');
    const difficultyButtons = document.getElementById('difficulty-buttons');
    
    flashcard.classList.remove('flipped');
    flipBtn.textContent = 'Mostra Risposta';
    flipBtn.classList.remove('hidden');
    difficultyButtons.classList.add('hidden');
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    const flipBtn = document.getElementById('flip-btn');
    const difficultyButtons = document.getElementById('difficulty-buttons');
    
    if (!flashcard.classList.contains('flipped')) {
        flashcard.classList.add('flipped');
        flipBtn.classList.add('hidden');
        difficultyButtons.classList.remove('hidden');
    }
}

function rateCard(quality) {
    if (!currentSession) return;
    
    const cards = getCards();
    const currentCard = currentSession.cards[currentSession.currentIndex];
    
    // Find and update the card with SM-2 algorithm
    const cardIndex = cards.findIndex(c => c.id === currentCard.id);
    if (cardIndex !== -1) {
        cards[cardIndex] = calculateSM2(cards[cardIndex], quality);
        saveCards(cards);
    }
    
    // Record response
    currentSession.responses.push({
        cardId: currentCard.id,
        quality: quality,
        responseTime: new Date() - currentSession.startTime
    });
    
    // Move to next card or end session
    currentSession.currentIndex++;
    
    // Add a small delay for better UX
    setTimeout(() => {
        if (currentSession.currentIndex >= currentSession.cards.length) {
            endStudySession();
        } else {
            displayCurrentCard();
        }
    }, 500);
}

function endStudySession() {
    if (currentSession) {
        // Update progress
        const progress = getProgress();
        progress.sessionsCompleted = (progress.sessionsCompleted || 0) + 1;
        progress.totalStudyTime = (progress.totalStudyTime || 0) + Math.floor((new Date() - currentSession.startTime) / 60000);
        saveProgress(progress);
        
        // Show results
        showSessionResults();
    } else {
        showDashboard();
    }
}

function showSessionResults() {
    const sessionTime = Math.floor((new Date() - currentSession.startTime) / 60000);
    const cardsStudied = currentSession.responses.length;
    
    document.getElementById('session-cards').textContent = cardsStudied;
    document.getElementById('session-time').textContent = `${sessionTime} min`;
    document.getElementById('next-review').textContent = 'Vedi dashboard per dettagli';
    
    showScreen('results-screen');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
}

function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}