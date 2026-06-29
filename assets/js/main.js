// 핵심 로직
document.addEventListener('DOMContentLoaded', function() {
    console.log('Blackspike Ltd website loaded');
    
    // 네비게이션 활성화
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // 스크롤 애니메이션
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = '#0a0a0a';
        } else {
            header.style.backgroundColor = '#0d0d0d';
        }
    });
});
