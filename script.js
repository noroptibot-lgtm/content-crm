// Global variables
let cards = [];
let currentCardId = null;
let draggedCard = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderCards();
    updateCardCounts();
    
    // Add event listeners
    setupEventListeners();
    
    // Pre-populate with sample Instagram scripts if no data exists
    if (cards.length === 0) {
        populateSampleData();
    }
});

function setupEventListeners() {
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('card-modal');
        if (event.target === modal) {
            closeModal();
        }
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            addNewCard();
        }
    });
}

// Data persistence
function saveData() {
    localStorage.setItem('content-crm-data', JSON.stringify(cards));
}

function loadData() {
    const savedData = localStorage.getItem('content-crm-data');
    if (savedData) {
        cards = JSON.parse(savedData);
    }
}

function exportData() {
    const dataStr = JSON.stringify(cards, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-crm-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Card management
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createCard(cardData) {
    const defaultCard = {
        id: generateId(),
        title: '',
        hook: '',
        platform: 'IG',
        viralityScore: 5,
        content: '',
        notes: '',
        status: 'ideas',
        createdAt: new Date().toISOString(),
        analytics: {
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0
        }
    };
    
    return { ...defaultCard, ...cardData };
}

function addNewCard() {
    currentCardId = null;
    clearModalForm();
    document.getElementById('modal-title').textContent = 'Add New Card';
    document.getElementById('analytics-section').style.display = 'none';
    document.getElementById('card-modal').style.display = 'block';
}

function editCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    currentCardId = cardId;
    populateModalForm(card);
    document.getElementById('modal-title').textContent = 'Edit Card';
    
    // Show analytics section only for posted/analytics cards
    const showAnalytics = card.status === 'posted' || card.status === 'analytics';
    document.getElementById('analytics-section').style.display = showAnalytics ? 'block' : 'none';
    
    document.getElementById('card-modal').style.display = 'block';
}

function saveCard() {
    const cardData = getModalFormData();
    
    if (!cardData.title.trim()) {
        alert('Please enter a title for the card');
        return;
    }
    
    if (currentCardId) {
        // Update existing card
        const cardIndex = cards.findIndex(c => c.id === currentCardId);
        if (cardIndex !== -1) {
            cards[cardIndex] = { ...cards[cardIndex], ...cardData };
        }
    } else {
        // Create new card
        const newCard = createCard(cardData);
        cards.push(newCard);
    }
    
    saveData();
    renderCards();
    updateCardCounts();
    closeModal();
}

function deleteCard() {
    if (!currentCardId) return;
    
    if (confirm('Are you sure you want to delete this card?')) {
        cards = cards.filter(c => c.id !== currentCardId);
        saveData();
        renderCards();
        updateCardCounts();
        closeModal();
    }
}

function getModalFormData() {
    return {
        title: document.getElementById('card-title').value,
        hook: document.getElementById('card-hook').value,
        platform: document.getElementById('card-platform').value,
        viralityScore: parseInt(document.getElementById('card-virality').value) || 5,
        content: document.getElementById('card-content').value,
        notes: document.getElementById('card-notes').value,
        analytics: {
            views: parseInt(document.getElementById('views').value) || 0,
            likes: parseInt(document.getElementById('likes').value) || 0,
            comments: parseInt(document.getElementById('comments').value) || 0,
            shares: parseInt(document.getElementById('shares').value) || 0
        }
    };
}

function populateModalForm(card) {
    document.getElementById('card-title').value = card.title;
    document.getElementById('card-hook').value = card.hook;
    document.getElementById('card-platform').value = card.platform;
    document.getElementById('card-virality').value = card.viralityScore;
    document.getElementById('card-content').value = card.content;
    document.getElementById('card-notes').value = card.notes;
    
    if (card.analytics) {
        document.getElementById('views').value = card.analytics.views;
        document.getElementById('likes').value = card.analytics.likes;
        document.getElementById('comments').value = card.analytics.comments;
        document.getElementById('shares').value = card.analytics.shares;
    }
}

function clearModalForm() {
    document.getElementById('card-title').value = '';
    document.getElementById('card-hook').value = '';
    document.getElementById('card-platform').value = 'IG';
    document.getElementById('card-virality').value = '5';
    document.getElementById('card-content').value = '';
    document.getElementById('card-notes').value = '';
    document.getElementById('views').value = '0';
    document.getElementById('likes').value = '0';
    document.getElementById('comments').value = '0';
    document.getElementById('shares').value = '0';
}

function closeModal() {
    document.getElementById('card-modal').style.display = 'none';
    currentCardId = null;
}

// Rendering
function renderCards() {
    const containers = {
        'ideas': document.getElementById('ideas-container'),
        'ready': document.getElementById('ready-container'),
        'filmed': document.getElementById('filmed-container'),
        'posted': document.getElementById('posted-container'),
        'analytics': document.getElementById('analytics-container')
    };
    
    // Clear all containers
    Object.values(containers).forEach(container => {
        container.innerHTML = '';
    });
    
    // Render cards in their respective columns
    cards.forEach(card => {
        const cardElement = createCardElement(card);
        const container = containers[card.status];
        if (container) {
            container.appendChild(cardElement);
        }
    });
}

function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.draggable = true;
    cardEl.dataset.cardId = card.id;
    
    cardEl.innerHTML = `
        <div class="card-title">${escapeHtml(card.title)}</div>
        <div class="card-hook">${escapeHtml(card.hook)}</div>
        <div class="card-meta">
            <span class="platform-tag ${card.platform.toLowerCase()}">${card.platform}</span>
            <div class="virality-score">
                <span>🔥</span>
                <span class="score-value">${card.viralityScore}/10</span>
            </div>
        </div>
        ${card.notes ? `<div class="card-notes">${escapeHtml(card.notes)}</div>` : ''}
        ${card.status === 'analytics' ? createAnalyticsDisplay(card.analytics) : ''}
    `;
    
    // Add event listeners
    cardEl.addEventListener('click', () => editCard(card.id));
    cardEl.addEventListener('dragstart', dragStart);
    cardEl.addEventListener('dragend', dragEnd);
    
    return cardEl;
}

function createAnalyticsDisplay(analytics) {
    if (!analytics || Object.values(analytics).every(v => v === 0)) {
        return '';
    }
    
    return `
        <div class="analytics-display" style="margin-top: 0.5rem; padding: 0.5rem; background: #333; border-radius: 6px; font-size: 0.8rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.25rem;">
                <div>👁️ ${formatNumber(analytics.views)}</div>
                <div>❤️ ${formatNumber(analytics.likes)}</div>
                <div>💬 ${formatNumber(analytics.comments)}</div>
                <div>🔄 ${formatNumber(analytics.shares)}</div>
            </div>
        </div>
    `;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateCardCounts() {
    const counts = {
        'ideas': 0,
        'ready': 0,
        'filmed': 0,
        'posted': 0,
        'analytics': 0
    };
    
    cards.forEach(card => {
        if (counts.hasOwnProperty(card.status)) {
            counts[card.status]++;
        }
    });
    
    Object.keys(counts).forEach(status => {
        const countEl = document.getElementById(`${status}-count`);
        if (countEl) {
            countEl.textContent = counts[status];
        }
    });
}

// Drag and Drop functionality
function dragStart(e) {
    draggedCard = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    draggedCard = null;
}

function allowDrop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const container = e.currentTarget;
    container.classList.add('drag-over');
    
    // Remove drag-over class after a delay
    setTimeout(() => {
        container.classList.remove('drag-over');
    }, 100);
}

function drop(e) {
    e.preventDefault();
    
    if (!draggedCard) return;
    
    const container = e.currentTarget;
    const newStatus = container.id.replace('-container', '');
    const cardId = draggedCard.dataset.cardId;
    
    // Update card status
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.status = newStatus;
        saveData();
        renderCards();
        updateCardCounts();
    }
    
    container.classList.remove('drag-over');
}

// Sample data population
function populateSampleData() {
    const sampleCards = [
        {
            title: "Why Your Brain Craves Junk Food",
            hook: "Your brain has a hidden weakness that makes junk food irresistible. Here's the science behind why you can't stop eating chips...",
            platform: "IG",
            viralityScore: 8,
            content: "Did you know your brain is literally wired to crave junk food? It's not a lack of willpower - it's biology working against you.\n\nHere's what happens:\n\n1. Sugar + Fat = Addiction\nJunk food combines sugar and fat in ratios that don't exist in nature. Your brain releases dopamine when it detects this 'superstimulus.'\n\n2. The Bliss Point\nFood companies engineer products to hit your 'bliss point' - the perfect combination of salt, sugar, and fat that makes you want more.\n\n3. Hijacked Reward System\nProcessed foods trigger the same neural pathways as drugs, creating genuine addiction patterns.\n\n4. Portion Distortion\nLarge portions become your new normal, resetting your brain's fullness signals.\n\nThe solution? Understand that it's not about willpower - it's about making your environment work FOR you, not against you.\n\nWhat junk food do you find hardest to resist? 👇",
            status: "ideas",
            notes: ""
        },
        {
            title: "The 60-Second Rule That Changed My Life",
            hook: "This one simple rule has saved me hours every day and completely transformed how I approach productivity...",
            platform: "IG",
            viralityScore: 9,
            content: "The 60-Second Rule: If something takes less than 60 seconds to do, do it immediately.\n\nHere's why this works:\n\n✅ Prevents small tasks from becoming overwhelming piles\n✅ Builds momentum throughout your day\n✅ Reduces mental load and decision fatigue\n✅ Creates a sense of accomplishment\n\nExamples of 60-second tasks:\n• Reply to a text message\n• File that document\n• Wash your coffee cup\n• Make your bed\n• Send that quick email\n• Put clothes in the hamper\n\nThe magic happens when you stop negotiating with yourself about tiny tasks. Just do them.\n\nTry it for one week and watch how it changes your entire relationship with productivity.\n\nWhat small task have you been putting off that would take less than 60 seconds? 👇",
            status: "ready",
            notes: "Albert approved - great hook, very actionable"
        },
        {
            title: "The Hidden Psychology of Color in Marketing",
            hook: "Companies spend millions studying how colors manipulate your buying decisions. Here's what they don't want you to know...",
            platform: "IG",
            viralityScore: 7,
            content: "Color psychology isn't just theory - it's a $4 billion industry secret.\n\nHere's how brands manipulate you:\n\n🔴 RED = Urgency & Appetite\nFast food chains use red to make you hungry and buy quickly. McDonald's, KFC, Wendy's - notice the pattern?\n\n🔵 BLUE = Trust & Security\nBanks and tech companies use blue to appear trustworthy. Facebook, Chase, IBM - they want you to feel safe.\n\n🟢 GREEN = Health & Money\nStarbucks uses green for 'natural' vibes. Financial apps use green for prosperity.\n\n🟡 YELLOW = Happiness & Caution\nAmazon's smile logo, Best Buy's cheerful yellow - but also warning signs.\n\n🟣 PURPLE = Luxury & Creativity\nCadbury, Crown Royal, Hallmark - purple screams premium.\n\n🟠 ORANGE = Energy & Confidence\nHarley Davidson, Home Depot, Nickelodeon - bold and energetic.\n\nNext time you shop, notice how colors influence your mood and decisions.\n\nWhat brand color tricks have you noticed? 👇",
            status: "filmed",
            notes: ""
        },
        {
            title: "Why Smart People Make Bad Decisions",
            hook: "Intelligence doesn't protect you from making terrible choices. In fact, it might make you more vulnerable to these cognitive traps...",
            platform: "IG",
            viralityScore: 8,
            content: "High IQ ≠ Good Decisions. Here's why smart people often make worse choices:\n\n1. OVERCONFIDENCE BIAS\nSmart people trust their reasoning too much. They skip research and go with their gut, thinking they can figure it out.\n\n2. ANALYSIS PARALYSIS\nThey see every angle, every possibility, every risk. This leads to overthinking simple decisions or delaying important ones.\n\n3. SUNK COST FALLACY\nThey're more likely to stick with bad investments or relationships because they've 'invested so much thought' into them.\n\n4. CONFIRMATION BIAS\nSmart people are better at finding evidence that supports what they already believe. They can rationalize anything.\n\n5. COMPLEXITY ADDICTION\nThey prefer complex solutions even when simple ones work better. They can't believe the answer could be that easy.\n\n6. EGO PROTECTION\nAdmitting they were wrong feels like admitting they're not smart. So they double down on bad decisions.\n\nThe smartest move? Recognizing you're not immune to these traps.\n\nWhich cognitive bias do you struggle with most? 👇",
            status: "posted",
            notes: "Posted yesterday - good engagement so far"
        },
        {
            title: "The 3-Minute Morning Routine That Beats Meditation",
            hook: "Forget 20-minute meditation sessions. This 3-minute routine is scientifically proven to reduce stress and boost focus better than traditional meditation...",
            platform: "IG",
            viralityScore: 9,
            content: "The 3-3-3 Morning Reset:\n\n3 DEEP BREATHS\nInhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system instantly.\n\n3 THINGS YOU'RE GRATEFUL FOR\nNot generic stuff. Be specific: 'I'm grateful for the warm coffee in my hands right now.' Specificity rewires your brain for positivity.\n\n3 INTENTIONS FOR TODAY\nNot goals or tasks. Intentions are about how you want to FEEL and SHOW UP. 'I intend to be present in conversations.'\n\nWhy this beats meditation:\n✅ Takes only 3 minutes (sustainable)\n✅ Combines breathing, gratitude, and intention\n✅ Immediately actionable\n✅ Scientifically backed for stress reduction\n✅ Works even if you're not a 'meditation person'\n\nStudies show this routine reduces cortisol levels by 23% and improves focus for up to 6 hours.\n\nTry it tomorrow morning and tell me how you feel.\n\nWhat's your current morning routine? 👇",
            status: "analytics",
            notes: "Great performance - lots of saves and shares",
            analytics: {
                views: 847392,
                likes: 23847,
                comments: 1832,
                shares: 4721
            }
        }
    ];
    
    cards = sampleCards.map(card => createCard(card));
    saveData();
    renderCards();
    updateCardCounts();
}

// Auto-populate function (placeholder for future API integration)
function autoPopulateNewScripts() {
    // This function would be called by a daily cron job
    // It would fetch new script ideas from your content generation system
    // and add them to the "Script Ideas" column
    
    console.log('Auto-populate function called - ready for API integration');
    
    // Example of how new scripts would be added:
    // const newScripts = await fetchNewScripts();
    // newScripts.forEach(script => {
    //     const card = createCard({...script, status: 'ideas'});
    //     cards.push(card);
    // });
    // saveData();
    // renderCards();
    // updateCardCounts();
}

// Export functions for potential API integration
window.ContentCRM = {
    addCard: (cardData) => {
        const card = createCard({...cardData, status: 'ideas'});
        cards.push(card);
        saveData();
        renderCards();
        updateCardCounts();
        return card.id;
    },
    
    updateCard: (cardId, updates) => {
        const cardIndex = cards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
            cards[cardIndex] = {...cards[cardIndex], ...updates};
            saveData();
            renderCards();
            updateCardCounts();
            return true;
        }
        return false;
    },
    
    getCards: () => cards,
    
    autoPopulate: autoPopulateNewScripts
};