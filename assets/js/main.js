const root = document.documentElement;
const body = document.body;
const progressBar = document.getElementById('progress-bar');
const loadingScreen = document.querySelector('.loading-screen');
const cursorGlow = document.querySelector('.cursor-glow');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('projectSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const revealItems = document.querySelectorAll('.reveal');
const backToTop = document.getElementById('backToTop');

const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    body.classList.add('light');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light');
        localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
    });
}

window.addEventListener('load', () => {
    setTimeout(() => loadingScreen?.classList.add('hidden'), 700);
});

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = `${percent}%`;
    backToTop.classList.toggle('visible', scrollTop > 600);
    revealItems.forEach((item) => {
        const top = item.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) item.classList.add('visible');
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        projectCards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
}

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter || 'all';
        projectCards.forEach((card) => {
            const type = card.dataset.category || 'all';
            card.style.display = filter === 'all' || type === filter ? 'block' : 'none';
        });
    });
});

window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
    cursorGlow.classList.add('active');
});

document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));

document.querySelectorAll('.btn, .socials a, .nav-links a, .project-card, .skill-card, .team-card').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
});

const particles = document.querySelector('.particles');
if (particles) {
    for (let i = 0; i < 24; i += 1) {
        const span = document.createElement('span');
        span.style.left = `${Math.random() * 100}%`;
        span.style.top = `${Math.random() * 100}%`;
        span.style.setProperty('--x', `${(Math.random() - 0.5) * 160}px`);
        span.style.setProperty('--y', `${(Math.random() - 0.5) * 160}px`);
        span.style.animationDelay = `${Math.random() * 6}s`;
        particles.appendChild(span);
    }
}

const typeTarget = document.getElementById('typedText');
const roles = ['Software Developer', 'Python Developer', 'Backend Developer', 'AI & Systems Enthusiast'];
let index = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
    if (!typeTarget) return;
    const current = roles[index];
    typeTarget.textContent = deleting ? current.slice(0, charIndex--) : current.slice(0, charIndex++);
    if (!deleting && charIndex === current.length + 1) {
        deleting = true;
        setTimeout(typeLoop, 1100);
        return;
    }
    if (deleting && charIndex === 0) {
        deleting = false;
        index = (index + 1) % roles.length;
    }
    setTimeout(typeLoop, deleting ? 60 : 90);
}

typeLoop();

const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const duration = 1200;
        const startTime = performance.now();
        const step = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = `${value}${el.dataset.suffix || ''}`;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countObserver.unobserve(el);
    });
}, { threshold: 0.6 });

counters.forEach((counter) => countObserver.observe(counter));

const cards = document.querySelectorAll('.skill-card, .project-card, .team-card, .certificate-card');
cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--rx', `${(1 - (y / rect.height)) * 8}deg`);
        card.style.setProperty('--ry', `${(x / rect.width - 0.5) * 10}deg`);
        card.style.transform = `perspective(1000px) rotateX(${(1 - (y / rect.height)) * 6}deg) rotateY(${(x / rect.width - 0.5) * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
