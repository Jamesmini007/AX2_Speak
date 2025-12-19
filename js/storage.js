// 저장공간 관리 관련 함수들
(function() {
    // 프로덕션 환경에서 console.log 비활성화
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const logger = {
        log: isDev ? console.log.bind(console) : () => {},
        error: console.error.bind(console),
        warn: isDev ? console.warn.bind(console) : () => {}
    };

    // 저장공간 대시보드 업데이트 (최적화 및 실제 데이터 반영)
    function updateStorageDashboard(videos) {
        // 보관 용량 결정: 크레딧 충전 여부에 따라
        const totalCharged = parseInt(localStorage.getItem('totalCharged') || '0');
        let baseStorageGB = totalCharged > 0 ? 5 : 1; // 충전 사용자: 5GB, 무료: 1GB
        
        // 확장 옵션 확인
        const storageExtensionData = JSON.parse(localStorage.getItem('storageExtension') || 'null');
        if (storageExtensionData) {
            if (storageExtensionData.type === 'plus') {
                baseStorageGB += 5; // +5GB
            } else if (storageExtensionData.type === 'pro') {
                baseStorageGB += 20; // +20GB
            }
        }
        
        const freeStorageGB = baseStorageGB;
        
        // 현재 사용량 계산
        let totalSizeGB = 0;
        let totalDurationSeconds = 0;
        
        videos.forEach(video => {
            // 파일 크기 계산 (GB 단위)
            if (video.size) {
                // size가 이미 GB 단위인지 확인
                if (video.size < 1) {
                    // 1보다 작으면 GB 단위로 간주
                    totalSizeGB += video.size;
                } else if (video.size < 1024) {
                    // 1~1024 사이면 MB로 간주하고 GB로 변환
                    totalSizeGB += video.size / 1024;
                } else if (video.size < 1024 * 1024) {
                    // KB로 간주하고 GB로 변환
                    totalSizeGB += video.size / (1024 * 1024);
                } else if (video.size < 1024 * 1024 * 1024) {
                    // 바이트로 간주하고 GB로 변환
                    totalSizeGB += video.size / (1024 * 1024 * 1024);
                } else {
                    // 이미 GB 단위
                    totalSizeGB += video.size;
                }
            } else if (video.fileSize) {
                // fileSize가 있으면 바이트 단위로 간주하고 GB로 변환
                totalSizeGB += video.fileSize / (1024 * 1024 * 1024);
            }
            
            // 재생 시간 계산 (초 단위로 저장되어 있다고 가정)
            if (video.duration) {
                // duration이 초 단위인지 분 단위인지 확인
                // 일반적으로 비디오 duration은 초 단위
                if (video.duration < 1000) {
                    // 1000보다 작으면 초 단위로 간주
                    totalDurationSeconds += video.duration;
                } else {
                    // 1000보다 크면 밀리초 단위로 간주하고 초로 변환
                    totalDurationSeconds += video.duration / 1000;
                }
            }
            
        });
        
        // GB로 변환 및 제한
        const usedGB = Math.min(totalSizeGB, freeStorageGB);
        const usedPercentage = Math.min(100, (usedGB / freeStorageGB) * 100);
        
        // 초를 분으로 변환 (소수점 제거, 올림 처리)
        const totalDurationMinutes = Math.ceil(totalDurationSeconds / 60);
        
        // 완료된 작업 수 계산
        const completedVideos = videos.filter(v => v.translated === true).length;
        
        // 보관 기간 계산 (모든 영상 7일, 확장 옵션 제외)
        const storageExtensionPeriod = JSON.parse(localStorage.getItem('storageExtension') || 'null');
        let storagePeriod = 7; // 기본 7일
        if (storageExtensionPeriod && storageExtensionPeriod.expiresAt) {
            const expiryDate = new Date(storageExtensionPeriod.expiresAt);
            const now = new Date();
            if (expiryDate > now) {
                if (storageExtensionPeriod.type === 'plus') {
                    storagePeriod = 30;
                } else if (storageExtensionPeriod.type === 'pro') {
                    storagePeriod = 90;
                }
            }
        }
        
        // UI 업데이트
        const storageUsedEl = document.getElementById('storage-used');
        const storageTotalEl = document.getElementById('storage-total');
        const storageProgressFillEl = document.getElementById('storage-progress-fill');
        const storagePercentageEl = document.getElementById('storage-percentage');
        const totalVideosEl = document.getElementById('total-videos');
        const completedVideosEl = document.getElementById('completed-videos');
        const totalDurationEl = document.getElementById('total-duration');
        const storagePeriodInfoEl = document.getElementById('storage-period-info');
        
        if (storageUsedEl) {
            storageUsedEl.textContent = Math.round(usedGB * 100) / 100 + ' GB';
        }
        if (storageTotalEl) {
            storageTotalEl.textContent = freeStorageGB + ' GB';
        }
        if (storageProgressFillEl) {
            storageProgressFillEl.style.width = usedPercentage + '%';
            // 사용량에 따라 색상 변경
            if (usedPercentage >= 90) {
                storageProgressFillEl.style.background = '#f44336';
            } else if (usedPercentage >= 70) {
                storageProgressFillEl.style.background = '#ff9800';
            } else {
                storageProgressFillEl.style.background = '#4caf50';
            }
        }
        if (storagePercentageEl) {
            storagePercentageEl.textContent = Math.round(usedPercentage) + '% 사용';
        }
        if (totalVideosEl) {
            totalVideosEl.textContent = videos.length;
        }
        if (completedVideosEl) {
            completedVideosEl.textContent = completedVideos;
        }
        if (totalDurationEl) {
            // 분 단위로만 표시 (소수점 제거, 정수로 표시)
            totalDurationEl.textContent = totalDurationMinutes + '분';
        }
        if (storagePeriodInfoEl) {
            // 항상 7일로 표시
            storagePeriodInfoEl.textContent = `보관 기간: 7일 (만료 시 자동 삭제)`;
        }
        
        logger.log('저장공간 대시보드 업데이트:', {
            totalVideos: videos.length,
            usedGB: usedGB.toFixed(2),
            totalDuration: `${totalDurationMinutes}분`
        });
    }

    // 만료 알림 배너 업데이트
    function updateExpiryBanner(videos) {
        const expiryBanner = document.getElementById('expiry-banner');
        const expiryBannerText = document.getElementById('expiry-banner-text');
        
        if (!expiryBanner || !expiryBannerText) return;
        
        const now = new Date();
        const expiringVideos = videos.filter(video => {
            if (!video.expiresAt && !video.expiryDate) return false;
            const expiry = new Date(video.expiresAt || video.expiryDate);
            const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
            return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
        });
        
        if (expiringVideos.length > 0) {
            expiryBanner.style.display = 'flex';
            expiryBannerText.textContent = `⚠ ${expiringVideos.length}개의 영상이 곧 삭제됩니다`;
        } else {
            expiryBanner.style.display = 'none';
        }
    }
    
    // 보관 확장 옵션 섹션 표시 여부 업데이트
    function updateStorageExtensionSection() {
        const storageExtensionSection = document.getElementById('storage-extension-section');
        if (!storageExtensionSection) return;
        
        // 크레딧 충전 사용자에게만 표시
        const totalCharged = parseInt(localStorage.getItem('totalCharged') || '0');
        if (totalCharged > 0) {
            // 확장 옵션 만료 확인
            const storageExtension = JSON.parse(localStorage.getItem('storageExtension') || 'null');
            if (storageExtension && storageExtension.expiresAt) {
                const expiryDate = new Date(storageExtension.expiresAt);
                const now = new Date();
                if (expiryDate <= now) {
                    // 만료된 확장 옵션 제거
                    localStorage.removeItem('storageExtension');
                    storageExtensionSection.style.display = 'block';
                } else {
                    // 활성 확장 옵션이 있으면 섹션 숨김
                    storageExtensionSection.style.display = 'none';
                }
            } else {
                storageExtensionSection.style.display = 'block';
            }
        } else {
            storageExtensionSection.style.display = 'none';
        }
    }
    
    // 보관 확장 옵션 구매 함수
    function purchaseStorageOption(type, onUpdate) {
        if (type === 'plus') {
            if (confirm('Storage Plus를 구매하시겠습니까?\n\n• 추가 용량: +5GB\n• 보관 기간: 30일\n\n구매 후 즉시 적용됩니다.')) {
                const storageExtension = {
                    type: 'plus',
                    purchasedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                };
                localStorage.setItem('storageExtension', JSON.stringify(storageExtension));
                alert('Storage Plus가 적용되었습니다!');
                
                // storage 업데이트 이벤트 발생
                document.dispatchEvent(new CustomEvent('storageUpdated'));
                
                if (onUpdate) {
                    onUpdate();
                }
            }
        } else if (type === 'pro') {
            if (confirm('Storage Pro를 구매하시겠습니까?\n\n• 추가 용량: +20GB\n• 보관 기간: 90일\n\n구매 후 즉시 적용됩니다.')) {
                const storageExtension = {
                    type: 'pro',
                    purchasedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
                };
                localStorage.setItem('storageExtension', JSON.stringify(storageExtension));
                alert('Storage Pro가 적용되었습니다!');
                
                // storage 업데이트 이벤트 발생
                document.dispatchEvent(new CustomEvent('storageUpdated'));
                
                if (onUpdate) {
                    onUpdate();
                }
            }
        }
    }
    
    // 전역 함수로 등록
    window.StorageManager = {
        updateStorageDashboard: updateStorageDashboard,
        updateExpiryBanner: updateExpiryBanner,
        updateStorageExtensionSection: updateStorageExtensionSection,
        purchaseStorageOption: purchaseStorageOption
    };
    
    // 기존 전역 함수 유지 (하위 호환성)
    window.purchaseStorageOption = purchaseStorageOption;
    
    // storage 관련 업데이트 함수들 (mypage.js에서 호출되는 부분을 자동화)
    function updateStorageInfo(videos) {
        if (!videos) {
            // videos가 없으면 localStorage에서 로드
            try {
                const savedVideos = localStorage.getItem('savedVideos');
                videos = savedVideos ? JSON.parse(savedVideos) : [];
            } catch (error) {
                logger.error('저장된 영상 데이터 로드 오류:', error);
                videos = [];
            }
        }
        
        // 저장공간 대시보드 업데이트
        updateStorageDashboard(videos);
        updateExpiryBanner(videos);
        updateStorageExtensionSection();
    }
    
    // storage 업데이트 이벤트 리스너 (mypage.js에서 발생하는 이벤트 감지)
    document.addEventListener('storageUpdated', () => {
        // 저장공간 확장 옵션 구매 후 업데이트
        updateStorageInfo();
        
        // mypage.js의 loadData 함수가 있으면 호출
        if (window.loadData && typeof window.loadData === 'function') {
            window.loadData();
        }
    });
    
    // videos 데이터가 변경될 때 자동으로 업데이트하도록 이벤트 리스너 추가
    // 이벤트 기반으로 자동 처리되므로 mypage.js에서 직접 호출할 필요 없음
    document.addEventListener('videosUpdated', (e) => {
        const videos = e.detail?.videos;
        if (videos) {
            updateStorageInfo(videos);
        } else {
            updateStorageInfo();
        }
    });
    
    // 페이지 로드 시 초기 업데이트
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateStorageInfo();
        });
    } else {
        // DOM이 이미 로드된 경우
        updateStorageInfo();
    }
    
    // 전역 함수로 등록 (필요시 직접 호출 가능하지만, 이벤트 기반으로 자동 처리됨)
    window.updateStorageInfo = updateStorageInfo;
    
    // storage 관련 모든 관리 함수를 전역으로 노출
    window.StorageManager = {
        ...window.StorageManager,
        updateStorageInfo: updateStorageInfo,
        // videos 데이터 직접 업데이트 (필요시 사용)
        updateFromVideos: function(videos) {
            if (videos) {
                updateStorageInfo(videos);
            } else {
                updateStorageInfo();
            }
        },
        // videos 데이터 강제 새로고침 (localStorage에서 직접 로드)
        refreshFromStorage: function() {
            try {
                const savedVideos = localStorage.getItem('savedVideos');
                const videos = savedVideos ? JSON.parse(savedVideos) : [];
                updateStorageInfo(videos);
            } catch (error) {
                logger.error('Storage 새로고침 오류:', error);
                updateStorageInfo([]);
            }
        }
    };
})();


