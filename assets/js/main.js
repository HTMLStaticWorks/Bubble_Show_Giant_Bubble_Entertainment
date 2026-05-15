// Initialize AOS when present on the page
if (window.AOS && typeof window.AOS.init === 'function') {
    window.AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
}

// Sticky Header Logic
const header = document.querySelector('header.nav-sticky');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Dark/Light Mode Toggle Logic
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') document.documentElement.classList.add('dark');
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function normalizePagePath(pathname) {
    const normalized = (pathname || '/').toLowerCase();
    if (normalized === '/' || normalized.endsWith('/')) return '/index.html';
    return normalized;
}

function setActiveMenuItem() {
    const currentPath = normalizePagePath(window.location.pathname);
    const navLinks = document.querySelectorAll('header.nav-sticky ul a[href]');

    navLinks.forEach((link) => {
        let linkPath = '';

        try {
            linkPath = normalizePagePath(new URL(link.getAttribute('href'), window.location.href).pathname);
        } catch (e) {
            return;
        }

        if (linkPath === currentPath) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

let mobileMenuScrollY = 0;
let isBodyScrollLocked = false;

function lockBodyScroll() {
    if (isBodyScrollLocked) return;
    mobileMenuScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${mobileMenuScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    isBodyScrollLocked = true;
}

function unlockBodyScroll() {
    if (!isBodyScrollLocked) return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, mobileMenuScrollY);
    isBodyScrollLocked = false;
}

function setupMobileMenuScrollLock() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    const syncMenuState = () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
            lockBodyScroll();
        } else {
            unlockBodyScroll();
        }
    };

    const closeMobileMenu = () => {
        mobileMenu.classList.add('hidden');
        syncMenuState();
    };

    window.toggleMobileMenu = () => {
        mobileMenu.classList.toggle('hidden');
        syncMenuState();
    };

    window.closeMobileMenu = closeMobileMenu;

    const observer = new MutationObserver(syncMenuState);
    observer.observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });

    mobileMenu.addEventListener('click', (event) => {
        const menuItem = event.target.closest('a, button');
        if (!menuItem) return;
        closeMobileMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1280) {
            closeMobileMenu();
        }
    });

    syncMenuState();
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setActiveMenuItem();
    setupMobileMenuScrollLock();
});
