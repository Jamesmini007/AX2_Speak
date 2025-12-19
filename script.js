// AX2 실시간 언어 번역 인터페이스 JavaScript

// 프로덕션 환경에서 console.log 비활성화
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const logger = {
    log: isDev ? console.log.bind(console) : () => {},
    error: console.error.bind(console), // 에러는 항상 표시
    warn: isDev ? console.warn.bind(console) : () => {}
};

// ============================================
// 크레딧 관리 시스템
// ============================================
const CreditSystem = {
    // 실시간 번역 크레딧 단위: 시간 기반 차감
    // 기본: 초당 1 크레딧, 번역 언어당 추가 0.5 크레딧/초
    CREDIT_PER_SECOND: 1, // 초당 기본 크레딧
    TRANSLATION_CREDIT_PER_SECOND: 0.5, // 번역 언어당 초당 추가 크레딧
    
    /**
     * 실시간 번역 예상 크레딧 계산 (시간 기반)
     * @param {number} estimatedSeconds - 예상 사용 시간 (초)
     * @param {number} translationLanguageCount - 번역 언어 수 (최대 3개)
     * @returns {number} 예상 필요한 크레딧
     */
    calculateEstimatedCredits(estimatedSeconds, translationLanguageCount = 0) {
        // 기본 크레딧: 시간(초) × 초당 크레딧
        const baseCredits = estimatedSeconds * this.CREDIT_PER_SECOND;
        
        // 번역 크레딧: 시간(초) × 번역 언어 수 × 언어당 초당 크레딧
        const translationCredits = estimatedSeconds * this.TRANSLATION_CREDIT_PER_SECOND * translationLanguageCount;
        
        return Math.ceil(baseCredits + translationCredits);
    },
    
    /**
     * 실제 사용된 크레딧 계산 (실시간 차감용)
     * @param {number} elapsedSeconds - 경과 시간 (초)
     * @param {number} translationLanguageCount - 번역 언어 수
     * @returns {number} 사용된 크레딧
     */
    calculateUsedCredits(elapsedSeconds, translationLanguageCount = 0) {
        const baseCredits = elapsedSeconds * this.CREDIT_PER_SECOND;
        const translationCredits = elapsedSeconds * this.TRANSLATION_CREDIT_PER_SECOND * translationLanguageCount;
        return Math.ceil(baseCredits + translationCredits);
    },
    
    /**
     * 크레딧 잔액 조회
     * @returns {number} 현재 크레딧 잔액
     */
    getBalance() {
        return parseInt(localStorage.getItem('creditBalance') || '0');
    },
    
    /**
     * 크레딧 예약 (선차감)
     * @param {string} jobId - 작업 ID
     * @param {number} amount - 예약할 크레딧
     * @returns {Object} 예약 결과 {success: boolean, reservedId: string, balance: number}
     */
    reserveCredits(jobId, amount) {
        const currentBalance = this.getBalance();
        
        if (currentBalance < amount) {
            return {
                success: false,
                error: 'INSUFFICIENT_CREDITS',
                required: amount,
                balance: currentBalance
            };
        }
        
        // 예약 ID 생성
        const reservedId = `reserve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // 잔액 차감
        const newBalance = currentBalance - amount;
        localStorage.setItem('creditBalance', newBalance.toString());
        
        // 예약 내역 저장
        const reservations = JSON.parse(localStorage.getItem('creditReservations') || '[]');
        reservations.push({
            id: reservedId,
            jobId: jobId,
            amount: amount,
            reservedAt: new Date().toISOString(),
            status: 'reserved'
        });
        localStorage.setItem('creditReservations', JSON.stringify(reservations));
        
        logger.log(`크레딧 예약: ${amount} 크레딧 (작업 ID: ${jobId}, 예약 ID: ${reservedId})`);
        
        return {
            success: true,
            reservedId: reservedId,
            balance: newBalance
        };
    },
    
    /**
     * 예약된 크레딧 확정 차감
     * @param {string} reservedId - 예약 ID
     * @param {string} jobId - 작업 ID
     * @param {string} description - 설명
     */
    confirmDeduction(reservedId, jobId, description) {
        const reservations = JSON.parse(localStorage.getItem('creditReservations') || '[]');
        const reservation = reservations.find(r => r.id === reservedId && r.jobId === jobId);
        
        if (!reservation) {
            logger.error('예약을 찾을 수 없습니다:', reservedId);
            return false;
        }
        
        // 예약 상태를 확정으로 변경
        reservation.status = 'confirmed';
        reservation.confirmedAt = new Date().toISOString();
        localStorage.setItem('creditReservations', JSON.stringify(reservations));
        
        // 크레딧 사용 내역 저장
        const creditHistory = JSON.parse(localStorage.getItem('creditHistory') || '[]');
        const currentBalance = this.getBalance();
        creditHistory.unshift({
            date: new Date().toISOString(),
            type: '사용',
            description: description,
            amount: reservation.amount,
            balance: currentBalance,
            jobId: jobId,
            reservedId: reservedId
        });
        localStorage.setItem('creditHistory', JSON.stringify(creditHistory));
        
        logger.log(`크레딧 확정 차감: ${reservation.amount} 크레딧 (작업 ID: ${jobId})`);
        return true;
    },
    
    /**
     * 예약된 크레딧 환불
     * @param {string} reservedId - 예약 ID
     * @param {string} jobId - 작업 ID
     * @param {string} reason - 환불 사유
     * @param {number} partialAmount - 부분 환불 금액 (전액 환불 시 null)
     */
    refundCredits(reservedId, jobId, reason, partialAmount = null) {
        const reservations = JSON.parse(localStorage.getItem('creditReservations') || '[]');
        const reservation = reservations.find(r => r.id === reservedId && r.jobId === jobId);
        
        if (!reservation) {
            logger.error('예약을 찾을 수 없습니다:', reservedId);
            return false;
        }
        
        // 환불할 크레딧 계산
        const refundAmount = partialAmount !== null ? partialAmount : reservation.amount;
        
        // 잔액 복구
        const currentBalance = this.getBalance();
        const newBalance = currentBalance + refundAmount;
        localStorage.setItem('creditBalance', newBalance.toString());
        
        // 예약 상태를 환불로 변경
        reservation.status = 'refunded';
        reservation.refundedAt = new Date().toISOString();
        reservation.refundReason = reason;
        reservation.refundAmount = refundAmount;
        localStorage.setItem('creditReservations', JSON.stringify(reservations));
        
        // 환불 내역 저장
        const creditHistory = JSON.parse(localStorage.getItem('creditHistory') || '[]');
        creditHistory.unshift({
            date: new Date().toISOString(),
            type: '환불',
            description: reason,
            amount: refundAmount,
            balance: newBalance,
            jobId: jobId,
            reservedId: reservedId
        });
        localStorage.setItem('creditHistory', JSON.stringify(creditHistory));
        
        logger.log(`크레딧 환불: ${refundAmount} 크레딧 (작업 ID: ${jobId}, 사유: ${reason})`);
        return true;
    }
};

// ============================================
// 무료 체험 관리 시스템
// ============================================
const FreeTrialSystem = {
    FREE_TRIAL_CREDITS: 100,
    FREE_TRIAL_MAX_DURATION: 600, // 10분 (초)
    FREE_TRIAL_MAX_LANGUAGES: 1,
    FREE_TRIAL_STORAGE_HOURS: 3,
    
    /**
     * 무료 체험 사용 여부 확인
     * @returns {boolean} 무료 체험 사용 여부
     */
    isUsed() {
        return localStorage.getItem('freeTrialUsed') === 'true';
    },
    
    /**
     * 무료 체험 사용 표시
     */
    markAsUsed() {
        localStorage.setItem('freeTrialUsed', 'true');
        localStorage.setItem('freeTrialUsedAt', new Date().toISOString());
    },
    
    /**
     * 무료 체험 자격 확인 (실시간 번역용)
     * @param {number} estimatedSeconds - 예상 사용 시간 (초, 실시간 번역에서는 선택적)
     * @param {number} languageCount - 번역 언어 수
     * @returns {Object} {eligible: boolean, reason: string}
     */
    checkEligibility(estimatedSeconds = 0, languageCount) {
        if (this.isUsed()) {
            return {
                eligible: false,
                reason: '이미 무료 체험을 사용하셨습니다.'
            };
        }
        
        // 실시간 번역에서는 시간 제한을 선택적으로 적용 (0이면 시간 제한 없음)
        if (estimatedSeconds > 0 && estimatedSeconds > this.FREE_TRIAL_MAX_DURATION) {
            return {
                eligible: false,
                reason: `무료 체험은 최대 ${this.FREE_TRIAL_MAX_DURATION / 60}분까지 가능합니다.`
            };
        }
        
        if (languageCount > this.FREE_TRIAL_MAX_LANGUAGES) {
            return {
                eligible: false,
                reason: `무료 체험은 최대 ${this.FREE_TRIAL_MAX_LANGUAGES}개 언어까지 가능합니다.`
            };
        }
        
        return { eligible: true };
    },
    
    /**
     * 무료 체험 크레딧 지급
     */
    grantFreeCredits() {
        const currentBalance = parseInt(localStorage.getItem('creditBalance') || '0');
        const newBalance = currentBalance + this.FREE_TRIAL_CREDITS;
        localStorage.setItem('creditBalance', newBalance.toString());
        
        // 크레딧 내역 저장
        const creditHistory = JSON.parse(localStorage.getItem('creditHistory') || '[]');
        creditHistory.unshift({
            date: new Date().toISOString(),
            type: 'charge',
            description: '무료 체험 크레딧',
            amount: this.FREE_TRIAL_CREDITS,
            balance: newBalance
        });
        localStorage.setItem('creditHistory', JSON.stringify(creditHistory));
        
        this.markAsUsed();
        logger.log(`무료 체험 크레딧 지급: ${this.FREE_TRIAL_CREDITS} 크레딧`);
    }
};

// ============================================
// 작업 상태 관리 시스템
// ============================================
const JobStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

const JobManager = {
    /**
     * 작업 생성
     * @param {string} videoId - 번역 세션 ID (또는 비디오 ID, 레거시 호환)
     * @param {Object} jobData - 작업 데이터
     * @returns {string} 작업 ID
     */
    createJob(videoId, jobData) {
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const job = {
            id: jobId,
            videoId: videoId,
            status: JobStatus.PENDING,
            createdAt: new Date().toISOString(),
            ...jobData
        };
        
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        jobs.push(job);
        localStorage.setItem('jobs', JSON.stringify(jobs));
        
        logger.log('작업 생성:', jobId);
        return jobId;
    },
    
    /**
     * 작업 상태 업데이트
     * @param {string} jobId - 작업 ID
     * @param {string} status - 새 상태
     * @param {Object} data - 추가 데이터
     */
    updateJobStatus(jobId, status, data = {}) {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const job = jobs.find(j => j.id === jobId);
        
        if (!job) {
            logger.error('작업을 찾을 수 없습니다:', jobId);
            return false;
        }
        
        job.status = status;
        job.updatedAt = new Date().toISOString();
        Object.assign(job, data);
        
        localStorage.setItem('jobs', JSON.stringify(jobs));
        logger.log(`작업 상태 업데이트: ${jobId} → ${status}`);
        return true;
    },
    
    /**
     * 작업 조회
     * @param {string} jobId - 작업 ID
     * @returns {Object|null} 작업 데이터
     */
    getJob(jobId) {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        return jobs.find(j => j.id === jobId) || null;
    }
};

// ============================================
// 보관 기간 관리 시스템
// ============================================
const StorageManager = {
    /**
     * 크레딧 충전 여부 확인
     * @returns {boolean} 크레딧 충전 여부
     */
    hasChargedCredits() {
        const totalCharged = parseInt(localStorage.getItem('totalCharged') || '0');
        return totalCharged > 0;
    },
    
    /**
     * 보관 용량 조회
     * @returns {number} 보관 용량 (GB)
     */
    getStorageCapacity() {
        const baseCapacity = this.hasChargedCredits() ? 5 : 1; // 충전 사용자: 5GB, 무료: 1GB
        
        // 확장 옵션 확인 (만료 확인 포함)
        const storageExtension = JSON.parse(localStorage.getItem('storageExtension') || 'null');
        if (storageExtension && storageExtension.expiresAt) {
            const expiryDate = new Date(storageExtension.expiresAt);
            const now = new Date();
            if (expiryDate > now) {
                // 활성 확장 옵션
                if (storageExtension.type === 'plus') {
                    return baseCapacity + 5; // +5GB
                } else if (storageExtension.type === 'pro') {
                    return baseCapacity + 20; // +20GB
                }
            } else {
                // 만료된 확장 옵션 제거
                localStorage.removeItem('storageExtension');
            }
        }
        
        return baseCapacity;
    },
    
    /**
     * 보관 기간 조회 (일 단위)
     * @returns {number} 보관 기간 (일)
     */
    getStoragePeriod() {
        // 확장 옵션 확인 (만료 확인 포함)
        const storageExtension = JSON.parse(localStorage.getItem('storageExtension') || 'null');
        if (storageExtension && storageExtension.expiresAt) {
            const expiryDate = new Date(storageExtension.expiresAt);
            const now = new Date();
            if (expiryDate > now) {
                // 활성 확장 옵션
                if (storageExtension.type === 'plus') {
                    return 30; // Storage Plus: 30일
                } else if (storageExtension.type === 'pro') {
                    return 90; // Storage Pro: 90일
                }
            } else {
                // 만료된 확장 옵션 제거
                localStorage.removeItem('storageExtension');
            }
        }
        
        // 기본 보관 기간: 번역 세션 7일
        return 7;
    },
    
    /**
     * 보관 만료 시간 계산
     * @param {boolean} isFreeTrial - 무료 체험 여부
     * @returns {Date} 만료 시간
     */
    calculateExpiryDate(isFreeTrial = false) {
        const now = new Date();
        
        // 번역 세션 7일 보관 (확장 옵션 제외)
        const storagePeriod = this.getStoragePeriod();
        now.setDate(now.getDate() + storagePeriod);
        
        return now.toISOString();
    },
    
    /**
     * 만료된 번역 세션 자동 삭제
     */
    cleanupExpiredVideos() {
        const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
        const translationSessions = JSON.parse(localStorage.getItem('translationSessions') || '[]');
        const now = new Date();
        let deletedCount = 0;
        
        // 저장된 번역 데이터 정리 (비디오 및 번역 세션)
        const activeVideos = savedVideos.filter(video => {
            if (!video.expiresAt) {
                return true; // 만료 시간이 없으면 유지
            }
            
            const expiryDate = new Date(video.expiresAt);
            if (expiryDate <= now) {
                deletedCount++;
                logger.log(`만료된 번역 세션 삭제: ${video.id} (${video.title})`);
                return false;
            }
            return true;
        });
        
        // 번역 세션 정리
        const activeSessions = translationSessions.filter(session => {
            if (!session.expiresAt) {
                return true;
            }
            
            const expiryDate = new Date(session.expiresAt);
            if (expiryDate <= now) {
                deletedCount++;
                logger.log(`만료된 번역 세션 삭제: ${session.sessionId}`);
                return false;
            }
            return true;
        });
        
        if (deletedCount > 0) {
            localStorage.setItem('savedVideos', JSON.stringify(activeVideos));
            localStorage.setItem('translationSessions', JSON.stringify(activeSessions));
            logger.log(`만료된 데이터 ${deletedCount}개 삭제 완료`);
        }
        
        return deletedCount;
    }
};

// 보관 기간 관리 초기화 (페이지 로드 시 실행)
if (typeof window !== 'undefined') {
    // 만료된 번역 세션 정리 (페이지 로드 시)
    StorageManager.cleanupExpiredVideos();
    
    // 주기적으로 만료된 번역 세션 정리 (1시간마다)
    setInterval(() => {
        StorageManager.cleanupExpiredVideos();
    }, 60 * 60 * 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    // 드롭다운 스크롤 문제 해결 (드롭다운 크기 고정 및 모달 스크롤 차단)
    const originalLangSelect = document.getElementById('originalLang');
    const modalContentWrapper = document.querySelector('.modal-content-wrapper');
    
    let isSelectActive = false;
    let modalScrollPosition = 0;
    
    // select가 포커스를 받을 때 (드롭다운이 열릴 때)
    const handleSelectFocus = (e) => {
        if (e.target === originalLangSelect) {
            isSelectActive = true;
            // 현재 모달 스크롤 위치 저장
            if (modalContentWrapper) {
                modalScrollPosition = modalContentWrapper.scrollTop;
                // 모달 스크롤을 막기 위해 overflow를 임시로 조정
                modalContentWrapper.style.overflow = 'hidden';
                // 모달 위치 고정 (드롭다운이 위로 커지지 않도록)
                modalContentWrapper.style.position = 'fixed';
                const rect = modalContentWrapper.getBoundingClientRect();
                modalContentWrapper.style.top = rect.top + 'px';
                modalContentWrapper.style.left = rect.left + 'px';
                modalContentWrapper.style.width = rect.width + 'px';
            }
        }
    };
    
    // select가 포커스를 잃을 때 (드롭다운이 닫힐 때)
    const handleSelectBlur = (e) => {
        if (e.target === originalLangSelect) {
            // 약간의 지연을 두어 드롭다운이 완전히 닫힐 때까지 대기
            setTimeout(() => {
                isSelectActive = false;
                if (modalContentWrapper) {
                    // 원래 상태로 복원
                    modalContentWrapper.style.overflow = '';
                    modalContentWrapper.style.position = '';
                    modalContentWrapper.style.top = '';
                    modalContentWrapper.style.left = '';
                    modalContentWrapper.style.width = '';
                    // 스크롤 위치 복원
                    modalContentWrapper.scrollTop = modalScrollPosition;
                }
            }, 300);
        }
    };
    
    // 모달의 wheel 이벤트를 캡처하여 select가 포커스되어 있을 때 완전 차단
    if (modalContentWrapper) {
        modalContentWrapper.addEventListener('wheel', (e) => {
            if (isSelectActive) {
                // select가 포커스되어 있으면 모달 스크롤 완전 차단
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { passive: false, capture: true });
    }
    
    // select 요소에 포커스/블러 이벤트 추가
    if (originalLangSelect) {
        originalLangSelect.addEventListener('focus', handleSelectFocus);
        originalLangSelect.addEventListener('blur', handleSelectBlur);
    }
    
    // 번역 설정 모달
    const translationModal = document.getElementById('translationModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const closeTranslationModal = document.getElementById('closeTranslationModal');
    
    // 실시간 번역 시스템에서는 비디오 업로드가 필요 없음
    // 드래그 앤 드롭 관련 코드는 제거됨
    
    // 로그인 상태 확인 함수
    function checkLoginStatus() {
        try {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const currentUser = localStorage.getItem('currentUser');
            return isLoggedIn && currentUser;
        } catch (error) {
            logger.error('로그인 상태 확인 오류:', error);
            return false;
        }
    }
    
    // 로그인 페이지로 리디렉션
    function redirectToLogin() {
        // 현재 페이지 URL을 저장하여 로그인 후 돌아올 수 있도록
        const currentUrl = window.location.href;
        sessionStorage.setItem('redirectAfterLogin', currentUrl);
        window.location.href = 'html/login.html';
    }
    
    // 번역 설정 모달 표시 함수 (실시간 번역용)
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
            
            // 크레딧 정보 업데이트 (실시간 번역은 예상 시간 기준)
            updateCreditInfo();
        }
    }
    
    // 실시간 번역 시스템에서는 비디오 미리보기가 필요 없음
    // 비디오 미리보기 관련 함수는 제거됨
    
    // 번역 설정 모달 닫기 함수 (실시간 번역용)
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
                // 크레딧 정보 업데이트
                updateCreditInfo();
            }
        });
    });
    
    // 언어 추가 모달
    const addLanguageBtn = document.querySelector('.add-language-btn');
    const languageModal = document.getElementById('languageModal');
    const closeModal = document.getElementById('closeModal');
    const modalLanguageItems = document.querySelectorAll('.modal-language-item');
    
    // 모달이 열릴 때 현재 선택된 언어들을 표시
    addLanguageBtn.addEventListener('click', () => {
        // 현재 선택된 언어 칩들 가져오기
        const existingChips = Array.from(document.querySelectorAll('.language-chip'));
        const selectedLangs = existingChips.map(chip => chip.dataset.lang);
        
        // 모달의 언어 아이템들에 선택 상태 표시
        modalLanguageItems.forEach(item => {
            const lang = item.dataset.lang;
            if (selectedLangs.includes(lang)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
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
    
    // 해당 언어 원어 이름 매핑
    function getLanguageDisplayName(langCode) {
        const langMap = {
            'ko': '한국어',
            'en': 'English',
            'ja': '日本語',
            'zh': '中文(간체)',
            'zh-TW': '中文(번체)',
            'es': 'Español',
            'fr': 'Français',
            'de': 'Deutsch',
            'pt': 'Português',
            'it': 'Italiano',
            'ru': 'Русский',
            'vi': 'Tiếng Việt',
            'th': 'ไทย',
            'id': 'Bahasa Indonesia',
            'hi': 'हिन्दी',
            'ar': 'العربية',
            'tr': 'Türkçe',
            'pl': 'Polski',
            'nl': 'Nederlands',
            'sv': 'Svenska',
            'no': 'Norsk',
            'da': 'Dansk',
            'fi': 'Suomi',
            'cs': 'Čeština',
            'hu': 'Magyar',
            'el': 'Ελληνικά',
            'he': 'עברית',
            'uk': 'Українська',
            'ms': 'Bahasa Melayu',
            'ro': 'Română'
        };
        return langMap[langCode] || langCode;
    }
    
    // 크레딧 정보 업데이트 함수 (실시간 번역용)
    function updateCreditInfo() {
        const creditInfoEl = document.getElementById('creditInfo');
        if (!creditInfoEl) {
            return;
        }
        
        // 선택된 언어 수 계산
        const selectedLanguages = Array.from(document.querySelectorAll('.language-chip'));
        const translationCount = selectedLanguages.length;
        
        // 실시간 번역은 예상 시간(1분) 기준으로 크레딧 계산
        const estimatedMinutes = 1; // 기본 예상 시간 1분
        const requiredCredits = CreditSystem.calculateEstimatedCredits(estimatedMinutes * 60, translationCount);
        
        // 크레딧 정보 표시
        creditInfoEl.textContent = `예상: ${requiredCredits.toLocaleString()} 크레딧/분`;
        creditInfoEl.style.display = 'inline-block';
    }
    
    // 모달에서 언어 선택/해제 토글 - 즉시 적용
    modalLanguageItems.forEach(item => {
        item.addEventListener('click', () => {
            const lang = item.dataset.lang;
            
            // 현재 언어 칩들 가져오기
            const existingChips = Array.from(document.querySelectorAll('.language-chip'));
            const alreadyAdded = existingChips.some(chip => chip.dataset.lang === lang);
            
            if (alreadyAdded) {
                // 이미 추가된 언어면 제거
                const chipToRemove = existingChips.find(chip => chip.dataset.lang === lang);
                if (chipToRemove) {
                    chipToRemove.remove();
                }
                // 선택 상태 제거
                item.classList.remove('selected');
            } else {
                // 번역 언어 최대 3개 제한 확인
                const existingChips = Array.from(document.querySelectorAll('.language-chip'));
                if (existingChips.length >= 3) {
                    alert('번역 언어는 최대 3개까지 선택할 수 있습니다.');
                    return;
                }
                
                // 추가되지 않은 언어면 추가
                const chip = document.createElement('div');
                chip.className = 'language-chip';
                chip.dataset.lang = lang;
                const displayName = getLanguageDisplayName(lang);
                chip.innerHTML = `
                    <span>${displayName}</span>
                    <i class="fas fa-times"></i>
                `;
                
                chip.addEventListener('click', (e) => {
                    if (e.target.classList.contains('fa-times')) {
                        chip.remove();
                        // 칩 제거 시 모달의 선택 상태도 업데이트
                        const modalItem = Array.from(modalLanguageItems).find(i => i.dataset.lang === lang);
                        if (modalItem) {
                            modalItem.classList.remove('selected');
                        }
                        // 크레딧 정보 업데이트
                        updateCreditInfo();
                    }
                });
                
                addLanguageBtn.parentElement.insertBefore(chip, addLanguageBtn);
                // 선택 상태 추가
                item.classList.add('selected');
            }
            
            // 크레딧 정보 업데이트
            updateCreditInfo();
        });
    });
    
    // 실시간 번역 시작 버튼 (번역 설정 모달 내)
    const translateBtn = document.getElementById('translateBtn');
    if (!translateBtn) {
        logger.warn('번역 버튼을 찾을 수 없습니다.');
    } else {
        translateBtn.addEventListener('click', async () => {
        // 실시간 번역은 비디오 업로드 없이 바로 시작 가능
        
        // 번역 시작 애니메이션
        translateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            translateBtn.style.transform = 'scale(1)';
        }, 150);
        
        // 번역 설정 가져오기
        const inputLangDisplay = document.getElementById('inputLanguageDisplay')?.textContent || 'Korean(한국어)';
        const inputLangCode = getLanguageCodeFromDisplay(inputLangDisplay);
        
        // 선택된 번역 언어들 가져오기 (최대 3개)
        const targetLanguages = Array.from(document.querySelectorAll('.language-chip'))
            .map(chip => chip.dataset.lang)
            .slice(0, 3); // 최대 3개만
        
        if (targetLanguages.length === 0) {
            alert('최소 하나의 번역 언어를 선택해주세요.');
            return;
        }
        
        if (targetLanguages.length > 3) {
            alert('번역 언어는 최대 3개까지 선택할 수 있습니다.');
            return;
        }
        
        // 크레딧 확인 (실시간 번역은 시간 기반)
        const currentBalance = CreditSystem.getBalance();
        if (currentBalance <= 0) {
            alert('크레딧이 부족합니다. 크레딧을 충전해주세요.');
            return;
        }
        
        // 번역 설정 모달 닫기
        closeTranslationModalFunc();
        
        // 실시간 번역 시작
        startLiveTranslation();
    });
    }
    
    // 실시간 번역 시스템에서는 비디오 업로드 기반 시뮬레이션이 필요 없음
    // 아래 함수들은 레거시 코드로, 현재는 사용되지 않음
    // 필요시 제거 가능
    
    // 번역 시뮬레이션 (레거시 - 사용되지 않음)
    function simulateTranslation(duration) {
        return new Promise((resolve) => {
            // 실시간 번역에서는 사용되지 않는 함수
            const translationTime = Math.min(5000, Math.max(2000, duration * 100));
            setTimeout(resolve, translationTime);
        });
    }
    
    // 진행률 콜백이 있는 번역 시뮬레이션 (레거시 - 사용되지 않음)
    function simulateTranslationWithProgress(duration, onProgress) {
        return new Promise((resolve) => {
            // 실시간 번역에서는 사용되지 않는 함수
            const translationTime = Math.min(5000, Math.max(2000, duration * 100));
            const steps = 20;
            const stepTime = translationTime / steps;
            let currentStep = 0;
            
            const interval = setInterval(() => {
                currentStep++;
                const progress = (currentStep / steps) * 100;
                onProgress(progress);
                
                if (currentStep >= steps) {
                    clearInterval(interval);
                    resolve();
                }
            }, stepTime);
        });
    }
    
    // IndexedDB에 파일 저장
    function saveFileToIndexedDB(videoId, file) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AX2_Videos', 1);
            
            request.onerror = () => {
                logger.error('IndexedDB 열기 실패:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readwrite');
                const store = transaction.objectStore('videos');
                
                const fileReader = new FileReader();
                
                fileReader.onload = (e) => {
                    const fileData = {
                        id: videoId,
                        data: e.target.result,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        savedAt: new Date().toISOString()
                    };
                    
                    // 최적화: 저장 확인 단계 제거하여 속도 향상
                    const putRequest = store.put(fileData);
                    putRequest.onsuccess = () => {
                        logger.log('IndexedDB 파일 저장 성공:', videoId);
                        resolve(); // 저장 확인 단계 제거하여 속도 향상
                    };
                    putRequest.onerror = () => {
                        logger.error('IndexedDB 저장 실패:', putRequest.error);
                        reject(putRequest.error);
                    };
                };
                
                fileReader.onerror = () => {
                    logger.error('파일 읽기 실패:', fileReader.error);
                    reject(fileReader.error);
                };
                
                fileReader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        logger.log(`파일 읽기 진행률: ${percent.toFixed(1)}%`);
                    }
                };
                
                fileReader.readAsArrayBuffer(file);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('videos')) {
                    const objectStore = db.createObjectStore('videos', { keyPath: 'id' });
                    objectStore.createIndex('savedAt', 'savedAt', { unique: false });
                    logger.log('IndexedDB objectStore 생성 완료');
                }
            };
        });
    }
    
    // 샘플 트랜스크립션 생성 (레거시 - 실시간 번역에서는 사용되지 않음, 번역 세션 저장 시 필요할 수 있음)
    function generateSampleTranscriptions(duration, originalLang, targetLanguages) {
        const transcriptions = [];
        const segmentDuration = 5; // 각 세그먼트 5초
        let currentTime = 0;
        let segmentId = 1;
        
        // 원본 언어 텍스트 샘플
        const originalTexts = {
            'ko': ['안녕하세요', '오늘은 좋은 날씨네요', '이 강의는 매우 유용합니다', '감사합니다', '다음 시간에 뵙겠습니다'],
            'en': ['Hello', 'Nice weather today', 'This lecture is very useful', 'Thank you', 'See you next time'],
            'auto': ['안녕하세요', 'Hello', 'こんにちは', 'Hola']
        };
        
        // 번역 언어별 번역 텍스트 샘플
        const translations = {
            'en': ['Hello', 'Nice weather today', 'This lecture is very useful', 'Thank you', 'See you next time'],
            'es': ['Hola', 'Buen tiempo hoy', 'Esta conferencia es muy útil', 'Gracias', 'Hasta la próxima'],
            'fr': ['Bonjour', 'Beau temps aujourd\'hui', 'Cette conférence est très utile', 'Merci', 'À la prochaine'],
            'ko': ['안녕하세요', '오늘은 좋은 날씨네요', '이 강의는 매우 유용합니다', '감사합니다', '다음 시간에 뵙겠습니다'],
            'ja': ['こんにちは', '今日は良い天気ですね', 'この講義は非常に有用です', 'ありがとうございます', 'また次回お会いしましょう'],
            'zh': ['你好', '今天天气不错', '这个讲座非常有用', '谢谢', '下次见'],
            'vi': ['Xin chào', 'Thời tiết hôm nay đẹp', 'Bài giảng này rất hữu ích', 'Cảm ơn bạn', 'Hẹn gặp lại lần sau']
        };
        
        const originalTextArray = originalTexts[originalLang] || originalTexts['auto'];
        let textIndex = 0;
        
        while (currentTime < duration) {
            const endTime = Math.min(currentTime + segmentDuration, duration);
            const originalText = originalTextArray[textIndex % originalTextArray.length];
            
            // 번역 데이터 생성
            const translationData = {
                id: segmentId++,
                speaker: '화자 1',
                startTime: currentTime,
                endTime: endTime,
                korean: originalLang === 'ko' ? originalText : `번역된 텍스트 (${Math.floor(currentTime)}s-${Math.floor(endTime)}s)`,
                english: ''
            };
            
            // 번역 언어별 번역 추가
            targetLanguages.forEach(targetLang => {
                const langCode = targetLang.code;
                const translatedText = translations[langCode] ? 
                    translations[langCode][textIndex % translations[langCode].length] : 
                    `Translated text (${Math.floor(currentTime)}s-${Math.floor(endTime)}s)`;
                
                if (langCode === 'en') {
                    translationData.english = translatedText;
                } else if (langCode === 'ko') {
                    translationData.korean = translatedText;
                } else {
                    // 다른 언어는 동적으로 추가 가능
                    translationData[langCode] = translatedText;
                }
            });
            
            transcriptions.push(translationData);
            currentTime = endTime;
            textIndex++;
        }
        
        return transcriptions;
    }
    
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
    
    // 남은 시간 초기화 및 표시
    function initializeRemainingTime() {
        let remainingMinutes = parseInt(localStorage.getItem('remainingMinutes') || '0');
        
        // 기존에 100분으로 설정된 경우 60분으로 업데이트
        if (remainingMinutes === 100) {
            remainingMinutes = 60;
            localStorage.setItem('remainingMinutes', '60');
        }
        
        // 초기화되지 않은 경우 60분으로 설정
        if (remainingMinutes === 0 && !localStorage.getItem('timeInitialized')) {
            remainingMinutes = 60;
            localStorage.setItem('remainingMinutes', '60');
            localStorage.setItem('timeInitialized', 'true');
        }
        
        const remainingTimeEl = document.getElementById('remaining-time');
        if (remainingTimeEl) {
            remainingTimeEl.textContent = `${remainingMinutes}분 남음`;
        }
    }
    
    // 페이지 로드 시 남은 시간 초기화
    initializeRemainingTime();

    // ============================================
    // 실시간 강의 번역 기능
    // ============================================
    const liveTranslationContainer = document.getElementById('liveTranslationContainer');
    const eyeButtons = document.querySelectorAll('.eye-btn');
    const controlButtonsTop = document.getElementById('controlButtonsTop');
    const startLectureBtn = document.getElementById('startLectureBtn');
    const stopLectureBtn = document.getElementById('stopLectureBtn');
    const languageSettingsBtn = document.getElementById('languageSettingsBtn');
    
    // 현재 선택된 번역 언어들 (기본값: 영어)
    let selectedTranslationLanguages = ['en'];
    
    // 초기 상태 설정: 원문 패널(한국어) + 번역 패널(영어) 표시
    function initializeDefaultPanels() {
        const originalPanel = document.querySelector('.language-panel.original-panel[data-lang="ko"]');
        const englishPanel = document.querySelector('.language-panel.translation-panel[data-lang="en"]');
        const panelsGrid = document.querySelector('.language-panels-grid');
        
        // 원문 패널 표시
        if (originalPanel) {
            originalPanel.style.display = 'flex';
        }
        
        // 영어 번역 패널 표시
        if (englishPanel) {
            englishPanel.style.display = 'flex';
        }
        
        // 나머지 번역 패널 숨기기
        const otherTranslationPanels = document.querySelectorAll('.language-panel.translation-panel:not([data-lang="en"])');
        otherTranslationPanels.forEach(panel => {
            panel.style.display = 'none';
        });
        
        // 그리드 레이아웃을 2개 패널에 맞게 설정
        if (panelsGrid) {
            panelsGrid.classList.remove('single-panel', 'two-panels', 'three-panels', 'four-panels');
            panelsGrid.classList.add('two-panels');
            panelsGrid.style.gridTemplateColumns = '1fr 1fr';
        }
        
        // 선택된 번역 언어 초기화 (영어만)
        selectedTranslationLanguages = ['en'];
        
        logger.log('기본 패널 초기화: 원문(한국어) + 번역(영어)');
    }
    
    // 페이지 로드 시 초기화
    initializeDefaultPanels();
    
    // 메인 컨테이너에 클래스 추가 (스타일링용)
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer && liveTranslationContainer) {
        mainContainer.classList.add('has-live-translation');
    }
    
    // 눈 버튼 클릭 시 상단에 버튼 생성
    const createdButtons = new Map(); // 생성된 버튼 추적
    
    // 눈 버튼 이벤트 핸들러 함수
    function setupEyeButtonHandler(eyeBtn) {
        // 기존 이벤트 리스너 제거 (중복 방지)
        const newEyeBtn = eyeBtn.cloneNode(true);
        eyeBtn.parentNode.replaceChild(newEyeBtn, eyeBtn);
        
        newEyeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const lang = this.getAttribute('data-lang');
            const type = this.getAttribute('data-type');
            const icon = this.querySelector('i');
            const panel = this.closest('.language-panel');
            
            if (!panel || !icon) {
                logger.error('패널 또는 아이콘을 찾을 수 없습니다');
                return;
            }
            
            // 눈 아이콘 토글
            if (icon.classList.contains('fa-eye')) {
                // 패널 숨기기
                panel.style.display = 'none';
                
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.classList.add('active');
                
                // 상단에 버튼 생성
                if (!createdButtons.has(lang) && controlButtonsTop) {
                    const button = createTopButton(lang, type);
                    controlButtonsTop.appendChild(button);
                    createdButtons.set(lang, button);
                    logger.log('상단 버튼 생성:', lang);
                }
            } else {
                // 패널 다시 표시
                panel.style.display = 'flex';
                
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.classList.remove('active');
                
                // 상단 버튼 제거
                if (createdButtons.has(lang)) {
                    const button = createdButtons.get(lang);
                    if (button && button.parentNode) {
                        button.remove();
                    }
                    createdButtons.delete(lang);
                    logger.log('상단 버튼 제거:', lang);
                }
            }
            
            // 그리드 레이아웃 업데이트
            updatePanelsGridLayout();
        });
    }
    
    // 모든 눈 버튼에 이벤트 리스너 추가
    eyeButtons.forEach(eyeBtn => {
        setupEyeButtonHandler(eyeBtn);
    });
    
    // 상단 버튼 생성 함수
    function createTopButton(lang, type) {
        const button = document.createElement('button');
        button.className = 'dynamic-top-button';
        
        // 언어 이름 매핑 (이미지 스타일: "English(영어)" 형식)
        const langNames = {
            'ko': 'Korean(한국어)',
            'en': 'English(영어)',
            'ja': '日本語(일본어)',
            'es': 'ESPAÑOL(스페인어)',
            'zh': '中文(간체)',
            'zh-TW': '中文(번체)',
            'fr': 'Français(프랑스어)',
            'de': 'Deutsch(독일어)',
            'pt': 'Português(포르투갈어)',
            'it': 'Italiano(이탈리아어)',
            'ru': 'Русский(러시아어)',
            'vi': 'Tiếng Việt(베트남어)',
            'th': 'ไทย(태국어)',
            'id': 'Bahasa Indonesia(인도네시아어)',
            'hi': 'हिन्दी(힌디어)',
            'ar': 'العربية(아랍어)',
            'tr': 'Türkçe(터키어)',
            'pl': 'Polski(폴란드어)',
            'nl': 'Nederlands(네덜란드어)',
            'sv': 'Svenska(스웨덴어)',
            'no': 'Norsk(노르웨이어)',
            'da': 'Dansk(덴마크어)',
            'fi': 'Suomi(핀란드어)',
            'cs': 'Čeština(체코어)',
            'hu': 'Magyar(헝가리어)',
            'el': 'Ελληνικά(그리스어)',
            'he': 'עברית(히브리어)',
            'uk': 'Українська(우크라이나어)',
            'ms': 'Bahasa Melayu(말레이어)',
            'ro': 'Română(로마니아어)'
        };
        
        const langName = langNames[lang] || lang;
        button.textContent = langName;
        button.setAttribute('data-lang', lang);
        button.setAttribute('data-type', type);
        
        // 버튼 클릭 이벤트: 패널 다시 표시
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const panel = document.querySelector(`.language-panel[data-lang="${lang}"]`);
            const eyeBtn = panel ? panel.querySelector('.eye-btn') : null;
            
            if (panel && eyeBtn) {
                // 패널 다시 표시
                panel.style.display = 'flex';
                
                // 눈 아이콘 복원
                const icon = eyeBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    eyeBtn.classList.remove('active');
                }
                
                // 상단 버튼 제거
                if (createdButtons.has(lang)) {
                    const btn = createdButtons.get(lang);
                    if (btn && btn.parentNode) {
                        btn.remove();
                    }
                    createdButtons.delete(lang);
                }
                
                // 그리드 레이아웃 업데이트
                updatePanelsGridLayout();
                
                logger.log('패널 다시 표시:', lang);
            } else {
                logger.error('패널 또는 눈 버튼을 찾을 수 없습니다:', lang);
            }
        });
        
        return button;
    }
    
    // 그리드 레이아웃 업데이트 함수
    function updatePanelsGridLayout() {
        const panelsGrid = document.querySelector('.language-panels-grid');
        const controlsContainer = document.querySelector('.live-translation-controls');
        if (!panelsGrid) return;
        
        // 표시 중인 패널 개수 계산
        const visiblePanels = Array.from(document.querySelectorAll('.language-panel'))
            .filter(panel => panel.style.display !== 'none');
        const visibleCount = visiblePanels.length;
        
        // 모든 패널 개수 클래스 제거
        panelsGrid.classList.remove('single-panel', 'two-panels', 'three-panels', 'four-panels');
        
        // 컨트롤 버튼 정렬 클래스 제거
        if (controlsContainer) {
            controlsContainer.classList.remove('align-single-panel', 'align-two-panels', 'align-three-panels', 'align-four-panels');
        }
        
        // 패널 개수에 따라 클래스 추가 및 그리드 설정
        if (visibleCount === 1) {
            panelsGrid.classList.add('single-panel');
            panelsGrid.style.gridTemplateColumns = '1fr';
            if (controlsContainer) {
                controlsContainer.classList.add('align-single-panel');
            }
        } else if (visibleCount === 2) {
            panelsGrid.classList.add('two-panels');
            panelsGrid.style.gridTemplateColumns = '1fr 1fr';
            if (controlsContainer) {
                controlsContainer.classList.add('align-two-panels');
            }
        } else if (visibleCount === 3) {
            panelsGrid.classList.add('three-panels');
            panelsGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
            if (controlsContainer) {
                controlsContainer.classList.add('align-three-panels');
            }
        } else if (visibleCount >= 4) {
            panelsGrid.classList.add('four-panels');
            panelsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            if (controlsContainer) {
                controlsContainer.classList.add('align-four-panels');
            }
        }
    }
    
    // 강의 시작 버튼
    if (startLectureBtn) {
        startLectureBtn.addEventListener('click', function() {
            // 강의 시작 로직 (실제 구현 필요)
            startLiveTranslation();
            
            // UI 업데이트
            startLectureBtn.style.display = 'none';
            if (stopLectureBtn) stopLectureBtn.style.display = 'inline-flex';
        });
    }
    
    // 강의 종료 버튼
    if (stopLectureBtn) {
        stopLectureBtn.addEventListener('click', function() {
            // 번역 세션 저장 확인
            if (confirm('번역을 종료하고 기록을 저장하시겠습니까?')) {
                // 강의 종료 로직
                stopLiveTranslation();
                
                // UI 업데이트
                stopLectureBtn.style.display = 'none';
            }
            if (startLectureBtn) startLectureBtn.style.display = 'inline-flex';
        });
    }
    
    // 언어 설정 버튼
    const liveLanguageModal = document.getElementById('liveLanguageModal');
    const closeLiveLanguageModal = document.getElementById('closeLiveLanguageModal');
    const liveLanguageModalBackdrop = document.getElementById('liveLanguageModalBackdrop');
    const confirmLanguageSelection = document.getElementById('confirmLanguageSelection');
    const selectedCountEl = document.getElementById('selectedCount');
    const liveLanguageItems = liveLanguageModal ? liveLanguageModal.querySelectorAll('.modal-language-item') : [];
    
    // 언어 설정 모달 초기화: 영어 기본 선택
    function initializeLanguageModal() {
        liveLanguageItems.forEach(item => {
            const lang = item.getAttribute('data-lang');
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (lang === 'en') {
                // 영어는 기본 선택
                item.classList.add('selected');
                if (checkbox) checkbox.checked = true;
            } else {
                item.classList.remove('selected');
                if (checkbox) checkbox.checked = false;
            }
        });
        
        updateSelectedCount();
        updateLanguageItemStates();
    }
    
    // 페이지 로드 시 언어 설정 모달 초기화
    if (liveLanguageModal) {
        initializeLanguageModal();
    }
    
    // 입력 언어 필드 기능
    const inputLanguageField = document.getElementById('inputLanguageField');
    const inputLanguageDropdown = document.getElementById('inputLanguageDropdown');
    const inputLanguageDisplay = document.getElementById('inputLanguageDisplay');
    const inputLanguageOptionsContainer = inputLanguageDropdown ? inputLanguageDropdown.querySelector('.input-language-options') : null;
    const inputLanguageOptions = inputLanguageOptionsContainer ? inputLanguageOptionsContainer.querySelectorAll('.input-language-option') : [];
    
    // 현재 선택된 입력 언어 (기본값: 한국어)
    let currentInputLanguage = 'ko';
    
    // 입력 언어 이름 매핑
    const inputLanguageNames = {
        'ko': 'Korean(한국어)',
        'en': 'English(영어)',
        'ja': '日本語(일본어)',
        'zh': '中文(간체)',
        'zh-TW': '中文(번체)',
        'es': 'ESPAÑOL(스페인어)',
        'fr': 'Français(프랑스어)',
        'de': 'Deutsch(독일어)',
        'pt': 'Português(포르투갈어)',
        'it': 'Italiano(이탈리아어)',
        'ru': 'Русский(러시아어)',
        'vi': 'Tiếng Việt(베트남어)',
        'th': 'ไทย(태국어)',
        'id': 'Bahasa Indonesia(인도네시아어)',
        'hi': 'हिन्दी(힌디어)',
        'ar': 'العربية(아랍어)',
        'tr': 'Türkçe(터키어)',
        'pl': 'Polski(폴란드어)',
        'nl': 'Nederlands(네덜란드어)',
        'sv': 'Svenska(스웨덴어)',
        'no': 'Norsk(노르웨이어)',
        'da': 'Dansk(덴마크어)',
        'fi': 'Suomi(핀란드어)',
        'cs': 'Čeština(체코어)',
        'hu': 'Magyar(헝가리어)',
        'el': 'Ελληνικά(그리스어)',
        'he': 'עברית(히브리어)',
        'uk': 'Українська(우크라이나어)',
        'ms': 'Bahasa Melayu(말레이어)',
        'ro': 'Română(로마니아어)'
    };
    
    // 입력 언어 필드 클릭 시 드롭다운 토글
    if (inputLanguageField && inputLanguageDropdown) {
        inputLanguageField.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            const isActive = inputLanguageDropdown.classList.contains('show');
            
            // 다른 드롭다운 닫기
            document.querySelectorAll('.input-language-dropdown.show').forEach(dropdown => {
                if (dropdown !== inputLanguageDropdown) {
                    dropdown.classList.remove('show');
                }
            });
            document.querySelectorAll('.input-language-field.active').forEach(field => {
                if (field !== inputLanguageField) {
                    field.classList.remove('active');
                }
            });
            
            if (isActive) {
                inputLanguageDropdown.classList.remove('show');
                inputLanguageField.classList.remove('active');
            } else {
                inputLanguageDropdown.classList.add('show');
                inputLanguageField.classList.add('active');
            }
        });
        
        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', function(e) {
            if (inputLanguageField && inputLanguageDropdown) {
                if (!inputLanguageField.contains(e.target) && !inputLanguageDropdown.contains(e.target)) {
                    inputLanguageDropdown.classList.remove('show');
                    inputLanguageField.classList.remove('active');
                }
            }
        });
        
        // ESC 키로 드롭다운 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && inputLanguageDropdown && inputLanguageDropdown.classList.contains('show')) {
                inputLanguageDropdown.classList.remove('show');
                if (inputLanguageField) {
                    inputLanguageField.classList.remove('active');
                }
            }
        });
    }
    
    // 입력 언어 옵션 선택
    inputLanguageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const lang = this.getAttribute('data-lang');
            const langName = inputLanguageNames[lang] || lang;
            
            // 선택된 언어 업데이트
            currentInputLanguage = lang;
            
            // 표시 텍스트 업데이트
            if (inputLanguageDisplay) {
                inputLanguageDisplay.textContent = langName;
            }
            
            // 원문 패널 업데이트
            const originalPanel = document.querySelector('.language-panel.original-panel');
            if (originalPanel) {
                // 언어 배지 업데이트
                const languageBadge = originalPanel.querySelector('.language-badge .language-name');
                if (languageBadge) {
                    const badgeText = lang === 'ko' ? 'KOREAN(한국어)' : 
                                    lang === 'en' ? 'ENGLISH(영어)' :
                                    lang === 'ja' ? '日本語(일본어)' :
                                    lang === 'es' ? 'ESPAÑOL(스페인어)' :
                                    lang === 'fr' ? 'Français(프랑스어)' :
                                    lang === 'de' ? 'Deutsch(독일어)' :
                                    lang === 'zh' ? '中文(간체)' :
                                    lang === 'zh-TW' ? '中文(번체)' :
                                    inputLanguageNames[lang] || lang.toUpperCase();
                    languageBadge.textContent = `| ${badgeText}`;
                }
                
                // 패널의 data-lang 속성 업데이트
                originalPanel.setAttribute('data-lang', lang);
            }
            
            // 옵션 선택 상태 업데이트
            inputLanguageOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // 드롭다운 닫기
            if (inputLanguageDropdown) {
                inputLanguageDropdown.classList.remove('show');
            }
            if (inputLanguageField) {
                inputLanguageField.classList.remove('active');
            }
            
            logger.log('입력 언어 변경:', lang, langName);
        });
    });
    
    // 초기 선택 상태 설정 (한국어)
    if (inputLanguageOptions.length > 0) {
        const koreanOption = Array.from(inputLanguageOptions).find(opt => opt.getAttribute('data-lang') === 'ko');
        if (koreanOption) {
            koreanOption.classList.add('selected');
        }
    }
    
    // 입력 언어 검색 기능
    const inputLanguageSearch = document.getElementById('inputLanguageSearch');
    if (inputLanguageSearch && inputLanguageDropdown) {
        inputLanguageSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const options = inputLanguageOptionsContainer ? inputLanguageOptionsContainer.querySelectorAll('.input-language-option') : [];
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    option.classList.remove('hidden');
                } else {
                    option.classList.add('hidden');
                }
            });
        });
        
        // 드롭다운이 열릴 때 검색어 초기화
        if (inputLanguageField) {
            const originalClickHandler = inputLanguageField.onclick;
            inputLanguageField.addEventListener('click', function() {
                setTimeout(() => {
                    if (inputLanguageDropdown.classList.contains('show')) {
                        if (inputLanguageSearch) {
                            inputLanguageSearch.value = '';
                            if (inputLanguageOptionsContainer) {
                                inputLanguageOptionsContainer.querySelectorAll('.input-language-option').forEach(opt => {
                                    opt.classList.remove('hidden');
                                });
                            }
                        }
                    }
                }, 10);
            });
        }
    }
    
    // 출력 언어 필드 기능
    const outputLanguageField = document.getElementById('outputLanguageField');
    const outputLanguageDropdown = document.getElementById('outputLanguageDropdown');
    const outputLanguageDisplay = document.getElementById('outputLanguageDisplay');
    const outputLanguageOptionsContainer = outputLanguageDropdown ? outputLanguageDropdown.querySelector('.output-language-options') : null;
    const outputLanguageOptions = outputLanguageOptionsContainer ? outputLanguageOptionsContainer.querySelectorAll('.output-language-option') : [];
    const outputLanguageSearch = document.getElementById('outputLanguageSearch');
    
    // 출력 언어 이름 매핑 (입력 언어와 동일)
    const outputLanguageNames = inputLanguageNames;
    
    // 출력 언어 필드 클릭 시 드롭다운 토글
    if (outputLanguageField && outputLanguageDropdown) {
        outputLanguageField.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            const isActive = outputLanguageDropdown.classList.contains('show');
            
            // 다른 드롭다운 닫기
            document.querySelectorAll('.input-language-dropdown.show, .output-language-dropdown.show').forEach(dropdown => {
                if (dropdown !== outputLanguageDropdown) {
                    dropdown.classList.remove('show');
                }
            });
            document.querySelectorAll('.input-language-field.active, .output-language-field.active').forEach(field => {
                if (field !== outputLanguageField) {
                    field.classList.remove('active');
                }
            });
            
            if (isActive) {
                outputLanguageDropdown.classList.remove('show');
                outputLanguageField.classList.remove('active');
            } else {
                outputLanguageDropdown.classList.add('show');
                outputLanguageField.classList.add('active');
                updateOutputLanguageDisplay();
                
                // 검색어 초기화
                if (outputLanguageSearch && outputLanguageOptionsContainer) {
                    outputLanguageSearch.value = '';
                    outputLanguageOptionsContainer.querySelectorAll('.output-language-option').forEach(opt => {
                        opt.classList.remove('hidden');
                    });
                }
            }
        });
        
        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', function(e) {
            if (outputLanguageField && outputLanguageDropdown) {
                if (!outputLanguageField.contains(e.target) && !outputLanguageDropdown.contains(e.target)) {
                    outputLanguageDropdown.classList.remove('show');
                    outputLanguageField.classList.remove('active');
                }
            }
        });
        
        // ESC 키로 드롭다운 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && outputLanguageDropdown && outputLanguageDropdown.classList.contains('show')) {
                outputLanguageDropdown.classList.remove('show');
                if (outputLanguageField) {
                    outputLanguageField.classList.remove('active');
                }
            }
        });
    }
    
    // 출력 언어 검색 기능
    if (outputLanguageSearch && outputLanguageDropdown) {
        outputLanguageSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const options = outputLanguageOptionsContainer ? outputLanguageOptionsContainer.querySelectorAll('.output-language-option') : [];
            
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    option.classList.remove('hidden');
                } else {
                    option.classList.add('hidden');
                }
            });
        });
        
    }
    
    // 출력 언어 옵션 선택 (다중 선택 가능, 최대 3개)
    outputLanguageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const lang = this.getAttribute('data-lang');
            const langName = outputLanguageNames[lang] || lang;
            const isSelected = this.classList.contains('selected');
            
            if (isSelected) {
                // 선택 해제
                this.classList.remove('selected');
                selectedTranslationLanguages = selectedTranslationLanguages.filter(l => l !== lang);
            } else {
                // 최대 3개 제한
                if (selectedTranslationLanguages.length >= 3) {
                    alert('번역 언어는 최대 3개까지 선택할 수 있습니다.');
                    return;
                }
                
                // 선택
                this.classList.add('selected');
                selectedTranslationLanguages.push(lang);
            }
            
            updateOutputLanguageDisplay();
            updateSelectedCount();
            updateLanguageItemStates();
            
            logger.log('출력 언어 변경:', selectedTranslationLanguages);
        });
    });
    
    // 출력 언어 표시 업데이트 함수
    function updateOutputLanguageDisplay() {
        if (!outputLanguageDisplay) return;
        
        if (selectedTranslationLanguages.length === 0) {
            outputLanguageDisplay.textContent = '언어를 선택하세요';
        } else {
            const langNames = selectedTranslationLanguages.map(lang => {
                return outputLanguageNames[lang] || lang;
            });
            outputLanguageDisplay.textContent = langNames.join(', ');
        }
        
        // 선택된 옵션 표시 업데이트
        outputLanguageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (selectedTranslationLanguages.includes(lang)) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // 체크박스도 동기화
        liveLanguageItems.forEach(item => {
            const lang = item.getAttribute('data-lang');
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (selectedTranslationLanguages.includes(lang)) {
                item.classList.add('selected');
                if (checkbox) checkbox.checked = true;
            } else {
                item.classList.remove('selected');
                if (checkbox) checkbox.checked = false;
            }
        });
    }
    
    // 언어 설정 버튼 클릭 이벤트 (강화된 버전)
    function setupLanguageSettingsButton() {
        const btn = document.getElementById('languageSettingsBtn');
        if (!btn) {
            logger.error('언어 설정 버튼을 찾을 수 없습니다.');
            return;
        }
        
        // 기존 이벤트 리스너 제거 (중복 방지)
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // 새 버튼에 이벤트 등록
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            logger.log('언어 설정 버튼 클릭됨');
            
            const modal = document.getElementById('liveLanguageModal');
            if (!modal) {
                logger.error('언어 설정 모달을 찾을 수 없습니다.');
                alert('언어 설정 모달을 찾을 수 없습니다.');
                return;
            }
            
            // 현재 표시 중인 언어 패널 확인
            const visiblePanels = Array.from(document.querySelectorAll('.language-panel.translation-panel'))
                .filter(panel => {
                    return panel.style.display !== 'none' && panel.style.display !== '';
                })
                .map(panel => panel.getAttribute('data-lang'));
            
            // 선택된 언어 업데이트
            selectedTranslationLanguages = visiblePanels.length > 0 ? visiblePanels : ['en'];
            
            // 모달의 언어 아이템들에 선택 상태 표시
            const items = modal.querySelectorAll('.modal-language-item');
            items.forEach(item => {
                const lang = item.getAttribute('data-lang');
                const checkbox = item.querySelector('input[type="checkbox"]');
                
                if (selectedTranslationLanguages.includes(lang)) {
                    item.classList.add('selected');
                    if (checkbox) checkbox.checked = true;
                } else {
                    item.classList.remove('selected');
                    if (checkbox) checkbox.checked = false;
                }
            });
            
            // 출력 언어 표시 업데이트
            if (typeof updateOutputLanguageDisplay === 'function') {
                updateOutputLanguageDisplay();
            }
            
            updateSelectedCount();
            updateLanguageItemStates();
            
            modal.style.display = 'flex';
        });
        
        // 추가 이벤트: mousedown, touchstart
        newBtn.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
        
        newBtn.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
        
        logger.log('언어 설정 버튼 이벤트 등록 완료');
    }
    
    // 즉시 실행 및 DOMContentLoaded에서도 실행
    setupLanguageSettingsButton();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLanguageSettingsButton);
    }
    
    // 모달 닫기
    if (closeLiveLanguageModal) {
        closeLiveLanguageModal.addEventListener('click', closeLiveLanguageModalFunc);
    }
    
    if (liveLanguageModalBackdrop) {
        liveLanguageModalBackdrop.addEventListener('click', closeLiveLanguageModalFunc);
    }
    
    function closeLiveLanguageModalFunc() {
        if (liveLanguageModal) {
            liveLanguageModal.style.display = 'none';
        }
    }
    
    // 언어 선택/해제 (최대 3개 제한) - 체크박스 기반
    liveLanguageItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const lang = item.getAttribute('data-lang');
        
        // 체크박스 변경 이벤트
        if (checkbox) {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    // 최대 3개 체크
                    if (selectedTranslationLanguages.length >= 3) {
                        this.checked = false;
                        alert('번역 언어는 최대 3개까지 선택할 수 있습니다.');
                        return;
                    }
                    
                    // 선택
                    item.classList.add('selected');
                    selectedTranslationLanguages.push(lang);
                } else {
                    // 선택 해제
                    item.classList.remove('selected');
                    selectedTranslationLanguages = selectedTranslationLanguages.filter(l => l !== lang);
                }
                
                updateSelectedCount();
                updateLanguageItemStates();
                
                // 출력 언어 드롭다운도 업데이트
                if (typeof updateOutputLanguageDisplay === 'function') {
                    updateOutputLanguageDisplay();
                }
            });
        }
        
        // 아이템 클릭 이벤트 (체크박스 토글)
        item.addEventListener('click', function(e) {
            // 체크박스 자체를 클릭한 경우는 제외
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
                return;
            }
            
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });
    
    // 선택된 개수 업데이트
    function updateSelectedCount() {
        if (selectedCountEl) {
            selectedCountEl.textContent = selectedTranslationLanguages.length;
        }
    }
    
    // 언어 아이템 상태 업데이트 (3개 선택 시 나머지 비활성화)
    function updateLanguageItemStates() {
        const isMaxSelected = selectedTranslationLanguages.length >= 3;
        
        liveLanguageItems.forEach(item => {
            const lang = item.getAttribute('data-lang');
            const isSelected = selectedTranslationLanguages.includes(lang);
            const checkbox = item.querySelector('input[type="checkbox"]');
            
            if (isMaxSelected && !isSelected) {
                item.classList.add('disabled');
                if (checkbox) checkbox.disabled = true;
            } else {
                item.classList.remove('disabled');
                if (checkbox) checkbox.disabled = false;
            }
        });
    }
    
    // 언어 패널 템플릿 데이터
    const languagePanelTemplates = {
        'en': { name: 'ENGLISH(영어)', displayId: 'englishTextDisplay' },
        'ja': { name: '日本語(일본어)', displayId: 'japaneseTextDisplay' },
        'es': { name: 'ESPAÑOL(스페인어)', displayId: 'spanishTextDisplay' },
        'zh': { name: '中文(간체)', displayId: 'chineseTextDisplay' },
        'zh-TW': { name: '中文(번체)', displayId: 'chineseTradTextDisplay' },
        'fr': { name: 'Français(프랑스어)', displayId: 'frenchTextDisplay' },
        'de': { name: 'Deutsch(독일어)', displayId: 'germanTextDisplay' },
        'pt': { name: 'Português(포르투갈어)', displayId: 'portugueseTextDisplay' },
        'it': { name: 'Italiano(이탈리아어)', displayId: 'italianTextDisplay' },
        'ru': { name: 'Русский(러시아어)', displayId: 'russianTextDisplay' },
        'vi': { name: 'Tiếng Việt(베트남어)', displayId: 'vietnameseTextDisplay' },
        'th': { name: 'ไทย(태국어)', displayId: 'thaiTextDisplay' },
        'id': { name: 'Bahasa Indonesia(인도네시아어)', displayId: 'indonesianTextDisplay' },
        'hi': { name: 'हिन्दी(힌디어)', displayId: 'hindiTextDisplay' },
        'ar': { name: 'العربية(아랍어)', displayId: 'arabicTextDisplay' },
        'tr': { name: 'Türkçe(터키어)', displayId: 'turkishTextDisplay' },
        'pl': { name: 'Polski(폴란드어)', displayId: 'polishTextDisplay' },
        'nl': { name: 'Nederlands(네덜란드어)', displayId: 'dutchTextDisplay' },
        'sv': { name: 'Svenska(스웨덴어)', displayId: 'swedishTextDisplay' },
        'no': { name: 'Norsk(노르웨이어)', displayId: 'norwegianTextDisplay' },
        'da': { name: 'Dansk(덴마크어)', displayId: 'danishTextDisplay' },
        'fi': { name: 'Suomi(핀란드어)', displayId: 'finnishTextDisplay' },
        'cs': { name: 'Čeština(체코어)', displayId: 'czechTextDisplay' },
        'hu': { name: 'Magyar(헝가리어)', displayId: 'hungarianTextDisplay' },
        'el': { name: 'Ελληνικά(그리스어)', displayId: 'greekTextDisplay' },
        'he': { name: 'עברית(히브리어)', displayId: 'hebrewTextDisplay' },
        'uk': { name: 'Українська(우크라이나어)', displayId: 'ukrainianTextDisplay' },
        'ms': { name: 'Bahasa Melayu(말레이어)', displayId: 'malayTextDisplay' },
        'ro': { name: 'Română(로마니아어)', displayId: 'romanianTextDisplay' }
    };
    
    // 언어 패널 생성 함수
    function createLanguagePanel(lang) {
        const template = languagePanelTemplates[lang];
        if (!template) return null;
        
        const panel = document.createElement('div');
        panel.className = 'language-panel translation-panel';
        panel.setAttribute('data-lang', lang);
        panel.style.display = 'flex';
        
        panel.innerHTML = `
            <div class="panel-header">
                <div class="panel-header-left">
                    <div class="language-badge translation-badge">
                        <span class="language-name">| ${template.name}</span>
                    </div>
                    <div class="panel-label">번역</div>
                </div>
                <button class="eye-btn" data-lang="${lang}" data-type="translation">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="panel-content">
                <div class="text-display" id="${template.displayId}"></div>
            </div>
        `;
        
        // 눈 버튼 이벤트 리스너 추가
        const eyeBtn = panel.querySelector('.eye-btn');
        if (eyeBtn) {
            setupEyeButtonHandler(eyeBtn);
        }
        
        return panel;
    }
    
    // 확인 버튼 클릭
    if (confirmLanguageSelection) {
        confirmLanguageSelection.addEventListener('click', function() {
            // 출력 언어 드롭다운에서 선택된 언어 확인
            const selectedFromDropdown = Array.from(outputLanguageOptions)
                .filter(opt => opt.classList.contains('selected'))
                .map(opt => opt.getAttribute('data-lang'));
            
            // 드롭다운에서 선택한 언어가 있으면 그것을 사용
            if (selectedFromDropdown.length > 0) {
                selectedTranslationLanguages = selectedFromDropdown;
            }
            
            if (selectedTranslationLanguages.length === 0) {
                alert('최소 1개의 번역 언어를 선택해주세요.');
                return;
            }
            
            const panelsGrid = document.querySelector('.language-panels-grid');
            if (!panelsGrid) return;
            
            // 기존 번역 패널 모두 제거 (원문 패널 제외)
            const existingPanels = document.querySelectorAll('.language-panel.translation-panel');
            existingPanels.forEach(panel => panel.remove());
            
            // 선택된 언어에 맞게 언어 패널 생성/표시
            selectedTranslationLanguages.forEach(lang => {
                let panel = document.querySelector(`.language-panel.translation-panel[data-lang="${lang}"]`);
                
                if (!panel) {
                    // 패널이 없으면 생성
                    panel = createLanguagePanel(lang);
                    if (panel) {
                        // 원문 패널 다음에 삽입
                        const originalPanel = document.querySelector('.language-panel.original-panel');
                        if (originalPanel && originalPanel.nextSibling) {
                            originalPanel.parentNode.insertBefore(panel, originalPanel.nextSibling);
                        } else {
                            panelsGrid.appendChild(panel);
                        }
                    }
                } else {
                    panel.style.display = 'flex';
                }
            });
            
            // 그리드 레이아웃 조정 (표시되는 패널 수에 따라)
            const visibleCount = selectedTranslationLanguages.length;
            const totalVisible = 1 + visibleCount; // 원문 + 번역 패널
            
            // 모든 패널 개수 클래스 제거
            panelsGrid.classList.remove('single-panel', 'two-panels', 'three-panels', 'four-panels');
            
            // 패널 개수에 따라 클래스 추가 및 그리드 설정
            if (totalVisible === 1) {
                panelsGrid.classList.add('single-panel');
                panelsGrid.style.gridTemplateColumns = '1fr';
            } else if (totalVisible === 2) {
                panelsGrid.classList.add('two-panels');
                panelsGrid.style.gridTemplateColumns = '1fr 1fr';
            } else if (totalVisible === 3) {
                panelsGrid.classList.add('three-panels');
                panelsGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
            } else if (totalVisible >= 4) {
                panelsGrid.classList.add('four-panels');
                panelsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            }
            
            // 레이아웃 업데이트 함수 호출
            updatePanelsGridLayout();
            
            // 눈 버튼 이벤트 리스너 재등록
            const newEyeButtons = document.querySelectorAll('.eye-btn');
            newEyeButtons.forEach(eyeBtn => {
                // 기존 이벤트 리스너 제거 후 새로 추가 (중복 방지)
                const newEyeBtn = eyeBtn.cloneNode(true);
                eyeBtn.parentNode.replaceChild(newEyeBtn, eyeBtn);
                setupEyeButtonHandler(newEyeBtn);
            });
            
            logger.log('선택된 번역 언어:', selectedTranslationLanguages);
            
            // 모달 닫기
            closeLiveLanguageModalFunc();
        });
    }
    
    // 실시간 언어 번역 시작 함수
    function startLiveTranslation() {
        logger.log('실시간 언어 번역 시작');
        
        // 번역 언어 확인
        if (selectedTranslationLanguages.length === 0) {
            alert('번역 언어를 먼저 선택해주세요.');
            return;
        }
        
        // 번역 언어 최대 3개 제한 확인
        if (selectedTranslationLanguages.length > 3) {
            alert('번역 언어는 최대 3개까지 선택할 수 있습니다.');
            return;
        }
        
        // 입력 언어 가져오기
        const inputLanguage = document.getElementById('inputLanguageDisplay')?.textContent || 'Korean(한국어)';
        const inputLangCode = getLanguageCodeFromDisplay(inputLanguage);
        
        // 크레딧 확인
        const currentBalance = CreditSystem.getBalance();
        if (currentBalance <= 0) {
            alert('크레딧이 부족합니다. 크레딧을 충전해주세요.');
            return;
        }
        
        // WebSocket 연결 (실제 서버 URL로 변경 필요)
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/api/translation/stream`;
        
        try {
            const ws = new WebSocket(wsUrl);
            window.currentWebSocket = ws;
            window.translationSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            window.translationStartTime = Date.now();
            window.translationCreditInterval = null;
            
            // WebSocket 연결 성공
            ws.onopen = () => {
                logger.log('WebSocket 연결 성공');
                
                // 세션 시작 메시지 전송
                ws.send(JSON.stringify({
                    type: 'start',
                    sessionId: window.translationSessionId,
                    inputLanguage: inputLangCode,
                    targetLanguages: selectedTranslationLanguages,
                    userId: localStorage.getItem('currentUser') || 'guest'
                }));
                
                // 크레딧 실시간 차감 시작 (5초마다)
                startCreditDeduction();
            };
            
            // 메시지 수신
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                switch (data.type) {
                    case 'stt_result':
                        // 원문을 박스로 표시
                        const originalDisplay = document.getElementById('originalTextDisplay');
                        if (originalDisplay && data.text) {
                            const textBox = document.createElement('div');
                            textBox.className = 'text-box original-box';
                            textBox.textContent = data.text;
                            originalDisplay.appendChild(textBox);
                            originalDisplay.scrollTop = originalDisplay.scrollHeight;
                        }
                        break;
                        
                    case 'translation_result':
                        // 번역 결과를 박스로 표시
                        const langCode = data.language;
                        const displayId = getTextDisplayId(langCode);
                        const translationDisplay = document.getElementById(displayId);
                        if (translationDisplay && data.text) {
                            const textBox = document.createElement('div');
                            textBox.className = 'text-box translation-box';
                            textBox.textContent = data.text;
                            translationDisplay.appendChild(textBox);
                            translationDisplay.scrollTop = translationDisplay.scrollHeight;
                        }
                        break;
                        
                    case 'error':
                        logger.error('번역 오류:', data.message);
                        alert('번역 중 오류가 발생했습니다: ' + data.message);
                        break;
                }
            };
            
            // 연결 종료
            ws.onclose = () => {
                logger.log('WebSocket 연결 종료');
                stopCreditDeduction();
                saveTranslationSession();
            };
            
            // 오류 처리
            ws.onerror = (error) => {
                logger.error('WebSocket 오류:', error);
                // WebSocket 오류가 있어도 시뮬레이션은 계속 진행
                logger.log('WebSocket 연결 실패했지만 시뮬레이션 모드로 계속 진행합니다.');
            };
            
            // 마이크 입력 시작 (시뮬레이션 모드 - 권한 요청 없음)
            startMicrophoneInput(ws);
            
        } catch (error) {
            logger.error('WebSocket 연결 실패:', error);
            // WebSocket 연결 실패해도 시뮬레이션은 진행
            logger.log('시뮬레이션 모드로 번역을 시작합니다.');
            window.translationSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            window.translationStartTime = Date.now();
            window.translationCreditInterval = null;
            // 가짜 WebSocket 객체 생성 (시뮬레이션용)
            const mockWs = {
                readyState: WebSocket.CLOSED,
                send: () => {},
                close: () => {}
            };
            window.currentWebSocket = mockWs;
            startMicrophoneInput(mockWs);
        }
    }
    
    // 텍스트를 점진적으로 표시하는 함수 (STT 시뮬레이션)
    function typeTextProgressively(element, fullText, speed = 50, onComplete = null) {
        if (!element) return;
        
        let currentIndex = 0;
        element.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (currentIndex < fullText.length) {
                element.textContent = fullText.substring(0, currentIndex + 1);
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                if (onComplete) {
                    onComplete();
                }
            }
        }, speed);
        
        return typeInterval;
    }
    
    // 인터미디어트 결과를 표시하는 함수 (실제 STT처럼)
    function showInterimResult(element, fullText, currentProgress) {
        if (!element) return;
        const displayed = fullText.substring(0, currentProgress);
        const remaining = fullText.substring(currentProgress);
        // 인터미디어트 부분은 회색으로 표시 (실제 STT처럼)
        element.innerHTML = displayed + '<span style="opacity: 0.5;">' + remaining + '</span>';
    }
    
    // 마이크 입력 시작 (시뮬레이션 모드 - 권한 요청 없이 자동 번역)
    async function startMicrophoneInput(ws) {
        // 시뮬레이션 모드: 마이크 권한 요청 없이 자동으로 번역 시뮬레이션
        logger.log('번역 시뮬레이션 모드 시작 (마이크 권한 요청 없음)');
        
        // 샘플 한국어 텍스트 배열 (실제 번역 시뮬레이션용)
        const sampleTexts = [
            '안녕하세요. 오늘은 실시간 번역 시스템에 대해 설명드리겠습니다.',
            '이 시스템은 음성을 인식하고 여러 언어로 자동 번역합니다.',
            '마이크 권한 없이도 번역 기능을 테스트할 수 있습니다.',
            '번역은 실시간으로 진행되며 여러 언어를 동시에 지원합니다.',
            '각 언어별로 정확한 번역 결과를 확인할 수 있습니다.'
        ];
        
        // 번역 시뮬레이션 데이터
        const translations = {
            'en': [
                'Hello. Today I will explain the real-time translation system.',
                'This system recognizes speech and automatically translates into multiple languages.',
                'You can test the translation function without microphone permission.',
                'Translation is done in real-time and supports multiple languages simultaneously.',
                'You can check accurate translation results for each language.'
            ],
            'ja': [
                'こんにちは。今日はリアルタイム翻訳システムについて説明します。',
                'このシステムは音声を認識し、複数の言語に自動翻訳します。',
                'マイクの許可なしでも翻訳機能をテストできます。',
                '翻訳はリアルタイムで行われ、複数の言語を同時にサポートします。',
                '各言語ごとに正確な翻訳結果を確認できます。'
            ],
            'es': [
                'Hola. Hoy explicaré el sistema de traducción en tiempo real.',
                'Este sistema reconoce el habla y traduce automáticamente a varios idiomas.',
                'Puede probar la función de traducción sin permiso de micrófono.',
                'La traducción se realiza en tiempo real y admite varios idiomas simultáneamente.',
                'Puede verificar resultados de traducción precisos para cada idioma.'
            ]
        };
        
        let textIndex = 0;
        window.currentTypeInterval = null;
        window.translationIntervals = []; // 모든 번역 타이핑 인터벌 추적
        
        // 시뮬레이션: 텍스트를 점진적으로 표시
        function startNextText() {
            if (textIndex >= sampleTexts.length) {
                textIndex = 0; // 반복
            }
            
            const originalText = sampleTexts[textIndex];
            const originalDisplay = document.getElementById('originalTextDisplay');
            
            // 기존 타이핑 인터벌 정리
            if (window.currentTypeInterval) {
                clearInterval(window.currentTypeInterval);
                window.currentTypeInterval = null;
            }
            
            // 모든 번역 인터벌 정리
            window.translationIntervals.forEach(interval => clearInterval(interval));
            window.translationIntervals = [];
            
            // 원문을 박스로 생성하고 STT처럼 점진적으로 표시 (한 단어씩)
            if (originalDisplay) {
                // 새로운 박스 생성
                const textBox = document.createElement('div');
                textBox.className = 'text-box original-box typing';
                textBox.textContent = '';
                originalDisplay.appendChild(textBox);
                
                // 스크롤을 맨 아래로
                setTimeout(() => {
                    originalDisplay.scrollTop = originalDisplay.scrollHeight;
                }, 100);
                
                // 텍스트를 단어로 분리 (공백과 구두점 포함)
                const words = originalText.match(/\S+|\s+/g) || [];
                let wordIndex = 0;
                let displayedText = '';
                
                window.currentTypeInterval = setInterval(() => {
                    if (wordIndex < words.length) {
                        // 한 단어씩 추가
                        displayedText += words[wordIndex];
                        textBox.textContent = displayedText;
                        wordIndex++;
                        
                        // 스크롤 유지
                        originalDisplay.scrollTop = originalDisplay.scrollHeight;
                        
                        // WebSocket으로 STT 진행 상황 전송 시뮬레이션
                        if (ws.readyState === WebSocket.OPEN && wordIndex % 3 === 0) {
                            ws.send(JSON.stringify({
                                type: 'stt_interim',
                                text: displayedText,
                                sessionId: window.translationSessionId
                            }));
                        }
                    } else {
                        clearInterval(window.currentTypeInterval);
                        window.currentTypeInterval = null;
                        
                        // 타이핑 완료 - 박스 스타일 변경
                        textBox.classList.remove('typing');
                        
                        // 원문 완성 후 WebSocket으로 최종 STT 결과 전송
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({
                                type: 'stt_text',
                                text: originalText,
                                sessionId: window.translationSessionId
                            }));
                        }
                        
                        // 원문이 완성되면 번역 시작 (약간의 지연 후)
                        setTimeout(() => {
                            startTranslations(originalText, textIndex, textBox);
                        }, 300);
                    }
                }, 150); // 한 단어당 150ms (실제 STT 속도 시뮬레이션)
            }
            
            textIndex++;
        }
        
        // 번역을 점진적으로 표시하는 함수
        function startTranslations(originalText, idx, originalTextBox) {
            selectedTranslationLanguages.forEach((targetLang, langIndex) => {
                const translatedText = translations[targetLang] ? translations[targetLang][idx] : `[Translation to ${targetLang}] ${originalText}`;
                const displayId = getTextDisplayId(targetLang);
                const translationDisplay = document.getElementById(displayId);
                
                if (translationDisplay) {
                    // 각 언어별로 약간의 지연 후 번역 시작
                    setTimeout(() => {
                        // 새로운 번역 박스 생성
                        const translationBox = document.createElement('div');
                        translationBox.className = 'text-box translation-box typing';
                        translationBox.textContent = '';
                        translationDisplay.appendChild(translationBox);
                        
                        // 스크롤을 맨 아래로
                        setTimeout(() => {
                            translationDisplay.scrollTop = translationDisplay.scrollHeight;
                        }, 100);
                        
                        // 텍스트를 단어로 분리 (공백과 구두점 포함)
                        const words = translatedText.match(/\S+|\s+/g) || [];
                        let wordIndex = 0;
                        let displayedText = '';
                        
                        const translationInterval = setInterval(() => {
                            if (wordIndex < words.length) {
                                // 한 단어씩 추가
                                displayedText += words[wordIndex];
                                translationBox.textContent = displayedText;
                                wordIndex++;
                                
                                // 스크롤 유지
                                translationDisplay.scrollTop = translationDisplay.scrollHeight;
                                
                                // WebSocket으로 번역 진행 상황 전송 시뮬레이션
                                if (ws.readyState === WebSocket.OPEN && wordIndex % 3 === 0) {
                                    ws.send(JSON.stringify({
                                        type: 'translation_interim',
                                        language: targetLang,
                                        text: displayedText,
                                        sessionId: window.translationSessionId
                                    }));
                                }
                            } else {
                                clearInterval(translationInterval);
                                
                                // 타이핑 완료 - 박스 스타일 변경
                                translationBox.classList.remove('typing');
                                
                                // 완료된 인터벌을 배열에서 제거
                                const index = window.translationIntervals.indexOf(translationInterval);
                                if (index > -1) {
                                    window.translationIntervals.splice(index, 1);
                                }
                                
                                // 번역 완성 후 WebSocket으로 최종 번역 결과 전송
                                if (ws.readyState === WebSocket.OPEN) {
                                    ws.send(JSON.stringify({
                                        type: 'translation_result',
                                        language: targetLang,
                                        text: translatedText,
                                        sessionId: window.translationSessionId
                                    }));
                                }
                            }
                        }, 120); // 한 단어당 120ms (번역은 조금 더 빠르게)
                        
                        // 인터벌을 추적 배열에 추가 (생성 직후)
                        window.translationIntervals.push(translationInterval);
                    }, 200 + (langIndex * 150)); // 각 언어별로 약간의 지연
                }
            });
        }
        
        // 첫 번째 텍스트 시작
        startNextText();
        
        // 원문이 완성되고 번역이 완료된 후 다음 텍스트 시작
        // 평균 텍스트 길이와 번역 시간을 고려하여 적절한 간격 설정
        window.simulationInterval = setInterval(() => {
            // 현재 진행 중인 타이핑이 없을 때만 다음 텍스트 시작
            if (!window.currentTypeInterval && window.translationIntervals.length === 0) {
                startNextText();
            }
        }, 10000); // 10초마다 새로운 텍스트 (원문 + 번역 시간 고려)
        
        logger.log('번역 시뮬레이션이 시작되었습니다. (STT 점진적 표시 모드)');
    }
    
    // 크레딧 실시간 차감 시작
    function startCreditDeduction() {
        const translationCount = selectedTranslationLanguages.length;
        
        // 5초마다 크레딧 차감
        window.translationCreditInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - window.translationStartTime) / 1000);
            const usedCredits = CreditSystem.calculateUsedCredits(5, translationCount); // 5초 기준
            
            const currentBalance = CreditSystem.getBalance();
            if (currentBalance < usedCredits) {
                // 크레딧 부족 시 자동 종료
                alert('크레딧이 부족하여 번역이 종료됩니다.');
                stopLiveTranslation();
                return;
            }
            
            // 크레딧 차감
            const newBalance = currentBalance - usedCredits;
            localStorage.setItem('creditBalance', newBalance.toString());
            
            // 크레딧 사용 내역 저장
            const creditHistory = JSON.parse(localStorage.getItem('creditHistory') || '[]');
            creditHistory.unshift({
                date: new Date().toISOString(),
                type: '사용',
                description: `실시간 번역 (${translationCount}개 언어)`,
                amount: usedCredits,
                balance: newBalance,
                sessionId: window.translationSessionId
            });
            localStorage.setItem('creditHistory', JSON.stringify(creditHistory));
            
        }, 5000); // 5초마다
    }
    
    // 크레딧 차감 중지
    function stopCreditDeduction() {
        if (window.translationCreditInterval) {
            clearInterval(window.translationCreditInterval);
            window.translationCreditInterval = null;
        }
    }
    
    // 번역 세션 저장
    function saveTranslationSession() {
        // 세션 ID가 없으면 생성
        if (!window.translationSessionId) {
            window.translationSessionId = 'translation_' + Date.now();
        }
        
        // 시작 시간이 없으면 현재 시간으로 설정
        if (!window.translationStartTime) {
            window.translationStartTime = Date.now() - 1000; // 최소 1초로 설정
        }
        
        const elapsedSeconds = Math.max(1, Math.floor((Date.now() - window.translationStartTime) / 1000));
        const translationCount = selectedTranslationLanguages && selectedTranslationLanguages.length > 0 
            ? selectedTranslationLanguages.length 
            : 1;
        const usedCredits = CreditSystem ? CreditSystem.calculateUsedCredits(elapsedSeconds, translationCount) : 0;
        
        // 번역 내용 수집
        const translationContent = collectTranslationContent();
        
        const inputLangCode = getLanguageCodeFromDisplay(document.getElementById('inputLanguageDisplay')?.textContent || 'Korean(한국어)');
        const inputLangDisplay = document.getElementById('inputLanguageDisplay')?.textContent || 'Korean(한국어)';
        
        // 번역 언어 정보
        const targetLangs = selectedTranslationLanguages && selectedTranslationLanguages.length > 0
            ? selectedTranslationLanguages
            : [{ code: 'en', name: 'English(영어)' }];
        
        // savedVideos 형식으로 저장
        const videoData = {
            id: window.translationSessionId,
            title: `실시간 번역 - ${new Date().toLocaleString('ko-KR')}`,
            description: `입력 언어: ${inputLangDisplay}, 번역 언어: ${targetLangs.map(l => l.name || l.code).join(', ')}`,
            duration: elapsedSeconds,
            size: 0, // 실시간 번역은 파일 크기 없음
            createdAt: new Date().toISOString(),
            savedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후 만료
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 하위 호환성
            translated: true,
            inputLanguage: inputLangCode,
            targetLanguages: targetLangs,
            translationContent: translationContent, // 원문과 번역문 저장
            usedCredits: usedCredits,
            type: 'live_translation', // 실시간 번역 타입 구분
            downloadable: true // 다운로드 가능
        };
        
        // savedVideos에 추가
        const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
        
        // 중복 체크 (같은 ID가 있으면 업데이트)
        const existingIndex = savedVideos.findIndex(v => v.id === videoData.id);
        if (existingIndex >= 0) {
            savedVideos[existingIndex] = videoData;
        } else {
            savedVideos.unshift(videoData);
        }
        
        localStorage.setItem('savedVideos', JSON.stringify(savedVideos));
        
        // 기존 translationSessions에도 저장 (하위 호환성)
        const sessionData = {
            sessionId: window.translationSessionId,
            userId: localStorage.getItem('currentUser') || 'guest',
            inputLanguage: inputLangCode,
            targetLanguages: targetLangs,
            duration: elapsedSeconds,
            usedCredits: usedCredits,
            createdAt: new Date().toISOString(),
            translationContent: translationContent
        };
        
        const savedSessions = JSON.parse(localStorage.getItem('translationSessions') || '[]');
        const existingSessionIndex = savedSessions.findIndex(s => s.sessionId === sessionData.sessionId);
        if (existingSessionIndex >= 0) {
            savedSessions[existingSessionIndex] = sessionData;
        } else {
            savedSessions.unshift(sessionData);
        }
        localStorage.setItem('translationSessions', JSON.stringify(savedSessions));
        
        logger.log('번역 세션 저장 완료:', videoData);
        
        // 저장 완료 플래그 설정
        localStorage.setItem('videoSaved', 'true');
        localStorage.setItem('lastSavedVideoId', videoData.id);
        
        // storage 업데이트 이벤트 발생
        document.dispatchEvent(new CustomEvent('storageUpdated'));
        
        return videoData;
    }
    
    // 번역 내용 수집 함수
    function collectTranslationContent() {
        const content = {
            original: [],
            translations: {}
        };
        
        // 원문 수집
        const originalDisplay = document.getElementById('originalTextDisplay');
        if (originalDisplay) {
            const originalBoxes = originalDisplay.querySelectorAll('.text-box.original-box');
            originalBoxes.forEach((box, index) => {
                const text = box.textContent.trim();
                if (text) {
                    content.original.push({
                        text: text,
                        timestamp: Date.now() + index // 간단한 타임스탬프
                    });
                }
            });
        }
        
        // 원문이 없으면 빈 배열로 초기화
        if (content.original.length === 0) {
            content.original = [];
        }
        
        // 각 번역 언어별로 번역문 수집
        if (selectedTranslationLanguages && selectedTranslationLanguages.length > 0) {
            selectedTranslationLanguages.forEach((lang, langIndex) => {
                const langCode = typeof lang === 'object' ? (lang.code || lang) : lang;
                const displayId = getTextDisplayId(langCode);
                const translationDisplay = document.getElementById(displayId);
                
                if (translationDisplay) {
                    const translationBoxes = translationDisplay.querySelectorAll('.text-box.translation-box');
                    content.translations[langCode] = [];
                    translationBoxes.forEach((box, index) => {
                        const text = box.textContent.trim();
                        if (text) {
                            content.translations[langCode].push({
                                text: text,
                                timestamp: Date.now() + langIndex * 1000 + index
                            });
                        }
                    });
                } else {
                    // display가 없어도 빈 배열로 초기화
                    content.translations[langCode] = [];
                }
            });
        }
        
        logger.log('수집된 번역 내용:', {
            original: content.original.length,
            translations: Object.keys(content.translations).length
        });
        
        return content;
    }
    
    // 언어 코드 가져오기 (표시 이름에서)
    function getLanguageCodeFromDisplay(displayName) {
        const langMap = {
            'Korean(한국어)': 'ko',
            'English(영어)': 'en',
            '日本語(일본어)': 'ja',
            '中文(간체)': 'zh',
            '中文(번체)': 'zh-TW',
            'ESPAÑOL(스페인어)': 'es',
            'Français(프랑스어)': 'fr',
            'Deutsch(독일어)': 'de',
            'Português(포르투갈어)': 'pt',
            'Italiano(이탈리아어)': 'it',
            'Русский(러시아어)': 'ru',
            'Tiếng Việt(베트남어)': 'vi',
            'ไทย(태국어)': 'th',
            'Bahasa Indonesia(인도네시아어)': 'id',
            'हिन्दी(힌디어)': 'hi',
            'العربية(아랍어)': 'ar',
            'Türkçe(터키어)': 'tr',
            'Polski(폴란드어)': 'pl',
            'Nederlands(네덜란드어)': 'nl',
            'Svenska(스웨덴어)': 'sv',
            'Norsk(노르웨이어)': 'no',
            'Dansk(덴마크어)': 'da',
            'Suomi(핀란드어)': 'fi',
            'Čeština(체코어)': 'cs',
            'Magyar(헝가리어)': 'hu',
            'Ελληνικά(그리스어)': 'el',
            'עברית(히브리어)': 'he',
            'Українська(우크라이나어)': 'uk',
            'Bahasa Melayu(말레이어)': 'ms',
            'Română(로마니아어)': 'ro'
        };
        
        for (const [key, code] of Object.entries(langMap)) {
            if (displayName.includes(key) || displayName.includes(key.split('(')[0])) {
                return code;
            }
        }
        return 'ko'; // 기본값
    }
    
    // 텍스트 표시 ID 가져오기
    function getTextDisplayId(langCode) {
        const displayIdMap = {
            'en': 'englishTextDisplay',
            'ja': 'japaneseTextDisplay',
            'es': 'spanishTextDisplay',
            'zh': 'chineseTextDisplay',
            'zh-TW': 'chineseTraditionalTextDisplay',
            'fr': 'frenchTextDisplay',
            'de': 'germanTextDisplay',
            'pt': 'portugueseTextDisplay',
            'it': 'italianTextDisplay',
            'ru': 'russianTextDisplay',
            'vi': 'vietnameseTextDisplay',
            'th': 'thaiTextDisplay',
            'id': 'indonesianTextDisplay',
            'hi': 'hindiTextDisplay',
            'ar': 'arabicTextDisplay',
            'tr': 'turkishTextDisplay',
            'pl': 'polishTextDisplay',
            'nl': 'dutchTextDisplay',
            'sv': 'swedishTextDisplay',
            'no': 'norwegianTextDisplay',
            'da': 'danishTextDisplay',
            'fi': 'finnishTextDisplay',
            'cs': 'czechTextDisplay',
            'hu': 'hungarianTextDisplay',
            'el': 'greekTextDisplay',
            'he': 'hebrewTextDisplay',
            'uk': 'ukrainianTextDisplay',
            'ms': 'malayTextDisplay',
            'ro': 'romanianTextDisplay'
        };
        return displayIdMap[langCode] || `${langCode}TextDisplay`;
    }
    
    // 실시간 언어 번역 종료 함수
    function stopLiveTranslation() {
        logger.log('실시간 언어 번역 종료');
        
        // 시뮬레이션 인터벌 중지
        if (window.simulationInterval) {
            clearInterval(window.simulationInterval);
            window.simulationInterval = null;
        }
        
        // 원문 타이핑 인터벌 중지
        if (window.currentTypeInterval) {
            clearInterval(window.currentTypeInterval);
            window.currentTypeInterval = null;
        }
        
        // 모든 번역 타이핑 인터벌 중지
        if (window.translationIntervals) {
            window.translationIntervals.forEach(interval => clearInterval(interval));
            window.translationIntervals = [];
        }
        
        // WebSocket 연결 종료
        if (window.currentWebSocket) {
            if (window.currentWebSocket.readyState === WebSocket.OPEN) {
                window.currentWebSocket.send(JSON.stringify({
                    type: 'stop',
                    sessionId: window.translationSessionId
                }));
            }
            window.currentWebSocket.close();
            window.currentWebSocket = null;
        }
        
        // 음성 인식 중지
        if (window.currentRecognition) {
            window.currentRecognition.stop();
            window.currentRecognition = null;
        }
        
        // 크레딧 차감 중지
        stopCreditDeduction();
        
        // 번역 세션 저장
        const savedData = saveTranslationSession();
        
        if (savedData) {
            logger.log('번역 기록이 저장되었습니다:', savedData.id);
            
            // 저장 완료 메시지
            alert('번역 기록이 저장되었습니다.\n번역 기록 페이지로 이동합니다.');
            
            // 저장 완료 후 storage.html로 이동
            setTimeout(() => {
                const currentPath = window.location.pathname;
                const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
                window.location.href = basePath + '/html/storage.html?saved=' + savedData.id;
            }, 500);
        } else {
            logger.warn('번역 기록 저장 실패');
            alert('번역 기록 저장에 실패했습니다.');
        }
        
        // 생성된 상단 버튼 모두 제거
        if (createdButtons) {
            createdButtons.forEach((button, lang) => {
                button.remove();
                createdButtons.delete(lang);
            });
        }
        
        // 눈 버튼 상태 초기화
        if (eyeButtons) {
            eyeButtons.forEach(eyeBtn => {
                const icon = eyeBtn.querySelector('i');
                if (icon && icon.classList.contains('fa-eye-slash')) {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    eyeBtn.classList.remove('active');
                }
            });
        }
        
        // 모든 텍스트 박스 초기화
        const allTextDisplays = document.querySelectorAll('.text-display');
        allTextDisplays.forEach(display => {
            // 모든 박스 제거
            const boxes = display.querySelectorAll('.text-box');
            boxes.forEach(box => box.remove());
        });
    }
    
    // 텍스트 번역 함수 (시뮬레이션)
    function translateText(text) {
        // 실제로는 번역 API 호출 필요
        const translations = {
            'en': `Translation: ${text}`,
            'ja': `翻訳: ${text}`,
            'es': `Traducción: ${text}`
        };
        
        // 각 언어 패널에 번역 표시
        Object.keys(translations).forEach(lang => {
            const display = document.getElementById(`${lang === 'en' ? 'english' : lang === 'ja' ? 'japanese' : 'spanish'}TextDisplay`);
            if (display) {
                display.textContent = translations[lang];
            }
        });
    }
    
    // 시뮬레이션 모드 (음성 인식 미지원 시)
    function simulateLiveTranslation() {
        const sampleTexts = [
            '안녕하세요, 오늘 강의를 시작하겠습니다.',
            '이번 시간에는 실시간 번역 기능에 대해 알아보겠습니다.',
            '질문이 있으시면 언제든지 말씀해 주세요.',
            '감사합니다.'
        ];
        
        let textIndex = 0;
        const interval = setInterval(() => {
            if (textIndex < sampleTexts.length) {
                const text = sampleTexts[textIndex];
                const originalDisplay = document.getElementById('originalTextDisplay');
                if (originalDisplay) {
                    originalDisplay.textContent = text;
                }
                translateText(text);
                textIndex++;
            } else {
                clearInterval(interval);
            }
        }, 3000);
        
        // 전역 변수로 저장하여 종료 시 사용
        window.simulationInterval = interval;
    }
});

