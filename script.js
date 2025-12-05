// AX2 실시간 번역·자막 생성 인터페이스 JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // 입자 효과
    const particlesCanvas = document.getElementById('particles-canvas');
    if (particlesCanvas) {
        const pCtx = particlesCanvas.getContext('2d');
        particlesCanvas.width = window.innerWidth;
        particlesCanvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 30;
        
        class Particle {
            constructor() {
                this.x = Math.random() * particlesCanvas.width;
                this.y = Math.random() * particlesCanvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.3 + 0.1;
                const colors = [
                    'rgba(33, 150, 243, 0.2)',
                    'rgba(156, 39, 176, 0.2)',
                    'rgba(233, 30, 99, 0.2)'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
            }
            
            draw() {
                pCtx.fillStyle = this.color;
                pCtx.globalAlpha = this.opacity;
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pCtx.fill();
            }
        }
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        function animateParticles() {
            pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        window.addEventListener('resize', () => {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
        });
    }
    
    // Confetti 효과
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (confettiCanvas) {
        const cCtx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
        
        const confetti = [];
        const confettiCount = 20;
        
        class Confetti {
            constructor() {
                this.x = Math.random() * confettiCanvas.width;
                this.y = -10;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = Math.random() * 2 + 1;
                this.size = Math.random() * 4 + 2;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.1;
                this.opacity = Math.random() * 0.5 + 0.3;
                const colors = [
                    'rgba(33, 150, 243, 0.3)',
                    'rgba(156, 39, 176, 0.3)',
                    'rgba(233, 30, 99, 0.3)',
                    'rgba(255, 215, 0, 0.3)'
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.vy += 0.05;
            }
            
            draw() {
                cCtx.save();
                cCtx.globalAlpha = this.opacity;
                cCtx.translate(this.x, this.y);
                cCtx.rotate(this.rotation);
                cCtx.fillStyle = this.color;
                cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                cCtx.restore();
            }
            
            isDead() {
                return this.y > confettiCanvas.height;
            }
        }
        
        function createConfetti() {
            if (confetti.length < confettiCount) {
                confetti.push(new Confetti());
            }
        }
        
        function animateConfetti() {
            cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            confetti.forEach((c, index) => {
                c.update();
                c.draw();
                if (c.isDead()) {
                    confetti.splice(index, 1);
                }
            });
            
            if (Math.random() < 0.1) {
                createConfetti();
            }
            
            requestAnimationFrame(animateConfetti);
        }
        
        animateConfetti();
        
        window.addEventListener('resize', () => {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        });
    }
    
    // 드래그 앤 드롭
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const translationModal = document.getElementById('translationModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeTranslationModal = document.getElementById('closeTranslationModal');
    
    // 클릭으로 업로드
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 드래그 오버
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
    
    // 드롭
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // 파일 선택
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    function handleFile(file) {
        if (file.type.startsWith('video/')) {
            // 번역 설정 모달 팝업 표시
            showTranslationModal();
        } else {
            alert('영상 파일을 업로드해주세요.');
        }
    }
    
    // 번역 설정 모달 표시 함수
    function showTranslationModal() {
        if (translationModal) {
            translationModal.style.display = 'flex';
            // 페이드인 애니메이션
            setTimeout(() => {
                translationModal.style.opacity = '0';
                translationModal.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    translationModal.style.opacity = '1';
                }, 10);
            }, 10);
        }
    }
    
    // 번역 설정 모달 닫기 함수
    function closeTranslationModalFunc() {
        if (translationModal) {
            translationModal.style.opacity = '0';
            translationModal.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                translationModal.style.display = 'none';
            }, 300);
        }
    }
    
    // 모달 닫기 이벤트
    if (closeTranslationModal) {
        closeTranslationModal.addEventListener('click', closeTranslationModalFunc);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeTranslationModalFunc);
    }
    
    
    // 언어 칩 제거
    const languageChips = document.querySelectorAll('.language-chip');
    languageChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-times')) {
                chip.remove();
            }
        });
    });
    
    // 언어 추가 모달
    const addLanguageBtn = document.querySelector('.add-language-btn');
    const languageModal = document.getElementById('languageModal');
    const closeModal = document.getElementById('closeModal');
    const modalLanguageItems = document.querySelectorAll('.modal-language-item');
    
    addLanguageBtn.addEventListener('click', () => {
        languageModal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', () => {
        languageModal.style.display = 'none';
    });
    
    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            languageModal.style.display = 'none';
        }
    });
    
    // 모달에서 언어 선택
    modalLanguageItems.forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.dataset.lang;
            const langName = item.querySelector('span').textContent;
            
            // 이미 추가된 언어인지 확인
            const existingChips = Array.from(document.querySelectorAll('.language-chip'));
            const alreadyAdded = existingChips.some(chip => chip.dataset.lang === lang);
            
            if (!alreadyAdded) {
                const chip = document.createElement('div');
                chip.className = 'language-chip';
                chip.dataset.lang = lang;
                chip.innerHTML = `
                    <span>${langName}</span>
                    <i class="fas fa-times"></i>
                `;
                
                chip.addEventListener('click', (e) => {
                    if (e.target.classList.contains('fa-times')) {
                        chip.remove();
                    }
                });
                
                addLanguageBtn.parentElement.insertBefore(chip, addLanguageBtn);
                languageModal.style.display = 'none';
            }
        });
    });
    
    // Translate Now 버튼
    const translateBtn = document.getElementById('translateBtn');
    translateBtn.addEventListener('click', () => {
        // 번역 시작 애니메이션
        translateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            translateBtn.style.transform = 'scale(1)';
        }, 150);
        
        // 실제 번역 로직은 여기에 구현
        console.log('번역이 시작되었습니다');
    });
    
    // 스크롤 시 네비게이션 효과
    let lastScroll = 0;
    const nav = document.querySelector('.glass-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.8)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
        lastScroll = currentScroll;
    });
    
    // Floating 애니메이션
    const floatingElements = document.querySelectorAll('.upload-icon, .logo-circle');
    floatingElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.animation = 'float-icon 2s ease-in-out infinite';
        });
    });
    
    // 사이드바 아이템 클릭 이벤트
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = item.dataset.page;
            
            // 마이페이지인 경우 mypage.html로 이동
            if (page === 'projects') {
                window.location.href = 'mypage.html';
                return;
            }
            
            // 다른 페이지는 기본 동작 허용 또는 처리
            if (item.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // 모든 아이템에서 active 제거
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // 클릭한 아이템에 active 추가
            item.classList.add('active');
            
            // 페이지 전환 로직 (필요시 구현)
            console.log(`${page} 페이지로 이동`);
        });
    });
});

