// --- MATH FLOATING PARTICLES (Subtle Corporate Version) ---
function initMathParticles() {
    const container = document.getElementById('math-particles');
    const symbols = ['π', 'Σ', '∫', 'α', 'x', 'y', '='];
    
    for(let i=0; i<30; i++) { 
        const el = document.createElement('div');
        el.classList.add('math-symbol');
        el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        
        el.style.left = Math.random() * 100 + 'vw';
        el.style.fontSize = (Math.random() * 20 + 10) + 'px';
        el.style.animationDuration = (Math.random() * 10 + 10) + 's'; // Lenti
        el.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(el);
    }
}
initMathParticles();

// --- SCROLL REVEAL OBSERVER ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- UI LOGIC ---

// Cookie Banner
document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("cookiesAccepted")) {
        setTimeout(() => document.getElementById("cookie-banner").classList.remove("translate-y-full"), 1000);
    }
});
function acceptCookies() {
    localStorage.setItem("cookiesAccepted", "true");
    document.getElementById("cookie-banner").classList.add("translate-y-full");
}

// Mobile Menu
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        document.body.style.overflow = 'hidden'; 
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        document.body.style.overflow = ''; 
    }
}

// Tab Reparti
function toggleReparto(id) {
    const divs = ['content-superiori', 'content-universita', 'content-test', 'content-corsi'];
    divs.forEach(d => {
        const el = document.getElementById(d);
        if(d !== 'content-' + id && !el.classList.contains('hidden')) el.classList.add('hidden');
    });
    const target = document.getElementById('content-' + id);
    if(target) {
        target.classList.remove('hidden');
        // Scroll leggero
        const y = target.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}

// Auto-selezione materia nel form
function selectSubject(name) {
    const sel = document.getElementById('materiaSelect');
    const msg = document.getElementById('messaggioArea');
    
    // Logica di pre-selezione
    if(name.includes('Analisi') || name.includes('Fisica 1') || name.includes('Algebra') || name.includes('Uni') || name.includes('Statistica')) sel.value = 'Universita';
    else if (name.includes('TOLC') || name.includes('Polizia') || name.includes('Concorsi') || name.includes('Test')) sel.value = 'TestAmmissione';
    else if (name.includes('Excel') || name.includes('Office') || name.includes('PowerPoint')) sel.value = 'Corsi';
    else sel.value = 'Superiori';

    msg.value = "Salve, vorrei informazioni per: " + name;
    
    const y = document.getElementById('contact-area').getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({top: y, behavior: 'smooth'});
}

// Gestione Form (Google Script)
function submitForm(e, type) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.button-text') || btn;
    const originalText = btnText.innerHTML;
    
    btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Attendere...';
    btn.disabled = true;

    const formData = new FormData(form);
    if (type === 'review') formData.set('tipo_richiesta', 'RECENSIONE_SITO'); 
    else {
        let tel = formData.get('telefono');
        if(tel) formData.set('telefono', "'" + tel);
    }

    // URL del tuo Google Apps Script (invariato)
    fetch('https://script.google.com/macros/s/AKfycbwmTq73CrKn-ZB-qBibz6pW8zASyrNqc3QuzwGGkkrGg6SuZ2TprnMOCRPTg0dWqH-zCg/exec', { method: 'POST', body: formData })
        .then(() => {
            btnText.innerHTML = originalText;
            btn.disabled = false;
            showModal(type); 
            form.reset();
            if(type === 'review') document.getElementById('review-form-container').classList.add('hidden');
        })
        .catch(() => {
            alert("Errore di connessione. Riprova più tardi.");
            btnText.innerHTML = originalText;
            btn.disabled = false;
        });
}

function showModal(type) {
    const modal = document.getElementById('success-modal');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const waText = document.getElementById('modal-wa-text');
    const icon = document.getElementById('modal-icon');

    if (type === 'review') {
        title.innerText = "Grazie!";
        message.innerText = "Il tuo feedback è stato registrato.";
        waText.classList.add('hidden');
    } else {
        title.innerText = "Richiesta Inviata";
        message.innerText = "Abbiamo ricevuto i tuoi dati.";
        waText.classList.remove('hidden');
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}
