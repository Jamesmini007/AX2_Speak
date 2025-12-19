        // 프로덕션 환경에서 console.log 비활성화
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const logger = {
            log: isDev ? console.log.bind(console) : () => {},
            error: console.error.bind(console),
            warn: isDev ? console.warn.bind(console) : () => {}
        };

        let videos = []; // 저장된 영상 목록
        let thumbnailLoadObserver = null; // Intersection Observer for lazy loading
        let renderCache = null; // 렌더링 캐시
        let isRendering = false; // 렌더링 중 플래그
        
        // 모바일 메뉴 토글
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (mobileMenuBtn && sidebar && sidebarOverlay) {
            // 모바일에서만 버튼 표시
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
            }
            
            // 윈도우 리사이즈 이벤트
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    mobileMenuBtn.style.display = 'block';
                } else {
                    mobileMenuBtn.style.display = 'none';
                    sidebar.classList.remove('mobile-open');
                    sidebarOverlay.classList.remove('active');
                }
            });
            
            // 메뉴 버튼 클릭
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                sidebarOverlay.classList.toggle('active');
            });
            
            // 오버레이 클릭 시 메뉴 닫기
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('mobile-open');
                sidebarOverlay.classList.remove('active');
            });
            
            // 사이드바 링크 클릭 시 메뉴 닫기 (모바일)
            const sidebarLinks = sidebar.querySelectorAll('.sidebar-item');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('mobile-open');
                        sidebarOverlay.classList.remove('active');
                    }
                });
            });
        }

        // 로컬 스토리지에서 데이터 로드
        function loadData() {
            try {
                const savedVideos = localStorage.getItem('savedVideos');
                
                if (savedVideos) {
                    videos = JSON.parse(savedVideos);
                    logger.log('영상 데이터 로드 완료:', videos.length, '개');
                    
                    // live_translation 타입 데이터 확인
                    const liveTranslations = videos.filter(v => v.type === 'live_translation');
                    logger.log('실시간 번역 기록:', liveTranslations.length, '개');
                    if (liveTranslations.length > 0) {
                        logger.log('실시간 번역 기록 샘플:', liveTranslations[0]);
                    }
                } else {
                    videos = [];
                    logger.log('저장된 번역 기록이 없습니다.');
                }
                
                renderVideos();
                // storage 업데이트는 storage.js에서 videosUpdated 이벤트를 통해 자동으로 처리됨
            } catch (error) {
                logger.error('데이터 로드 오류:', error);
                videos = [];
                renderVideos();
                // storage 업데이트는 storage.js에서 videosUpdated 이벤트를 통해 자동으로 처리됨
            }
        }

        // 디바운스 함수
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // 정렬 및 날짜 필터 상태
        let sortOrder = ''; // 빈 문자열 = 기본값 '정렬', 'latest' = 최신순, 'oldest' = 오래된순
        let currentDateFrom = '';
        let currentDateTo = '';
        
        // 영상 목록 렌더링 (검색 및 날짜 필터 적용)
        function renderVideos() {
            // 이미 렌더링 중이면 스킵
            if (isRendering) {
                logger.log('이미 렌더링 중입니다. 스킵');
                return;
            }
            
            const videoGrid = document.getElementById('video-grid');
            
            if (!videoGrid) {
                logger.error('video-grid 요소를 찾을 수 없습니다.');
                return;
            }
            
            isRendering = true;
            
            if (videos.length === 0) {
                videoGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-state-icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 2V8H20" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 13H8" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M16 17H8" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 9H9H8" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="empty-state-text">저장된 번역 기록이 없습니다</div>
                        <div class="empty-state-hint" style="margin-top: 10px; font-size: 0.85rem; color: #999;">
                            실시간 번역을 시작하고 종료하면 여기에 번역 기록이 표시됩니다.
                        </div>
                    </div>
                `;
                isRendering = false;
                return;
            }
            
            logger.log('영상 렌더링 시작:', videos.length, '개');
            
            // live_translation 타입 확인
            const liveTranslations = videos.filter(v => v.type === 'live_translation');
            logger.log('실시간 번역 기록:', liveTranslations.length, '개');
            if (liveTranslations.length > 0) {
                logger.log('실시간 번역 기록 샘플:', liveTranslations[0]);
            }

            // 현재 시간
            const now = new Date();

            // 정렬 (savedAt 또는 createdAt 기준)
            let sortedVideos = videos.slice().sort((a, b) => {
                const dateA = a.savedAt ? new Date(a.savedAt) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
                const dateB = b.savedAt ? new Date(b.savedAt) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
                if (sortOrder === 'latest') {
                    return dateB - dateA; // 내림차순 (최신이 먼저)
                } else if (sortOrder === 'oldest') {
                    return dateA - dateB; // 오름차순 (오래된 것이 먼저)
                } else {
                    // 기본값: 최신순 (내림차순)
                    return dateB - dateA;
                }
            });
            
            logger.log('정렬 후 videos:', sortedVideos.length, '개');
            
            // 필터 적용
            let filteredVideos = sortedVideos;
            
            // 날짜 필터 적용
            if (currentDateFrom || currentDateTo) {
                filteredVideos = filteredVideos.filter(video => {
                    const savedDate = new Date(video.savedAt || video.createdAt || Date.now());
                    const videoDate = new Date(savedDate.getFullYear(), savedDate.getMonth(), savedDate.getDate());
                    
                    if (currentDateFrom) {
                        const fromDate = new Date(currentDateFrom);
                        if (videoDate < fromDate) {
                            return false;
                        }
                    }
                    
                    if (currentDateTo) {
                        const toDate = new Date(currentDateTo);
                        if (videoDate > toDate) {
                            return false;
                        }
                    }
                    
                    return true;
                });
            }
            
            logger.log('필터링 후 videos:', filteredVideos.length, '개');

            // 원본 배열에서의 인덱스를 찾기 위해 ID로 매핑
            const videoIdMap = new Map();
            videos.forEach((v, idx) => videoIdMap.set(v.id, idx));

            videoGrid.innerHTML = filteredVideos.map((video) => {
                const originalIndex = videoIdMap.get(video.id);
                const savedDate = new Date(video.savedAt || video.createdAt || Date.now());
                const expiryDate = (video.expiresAt || video.expiryDate) ? new Date(video.expiresAt || video.expiryDate) : null;
                const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)) : null;
                
                let expiryBadge = '';
                if (expiryDate) {
                    if (daysUntilExpiry <= 0) {
                        expiryBadge = '<span class="expiry-badge warning">만료됨</span>';
                    } else if (daysUntilExpiry <= 3) {
                        expiryBadge = `<span class="expiry-badge warning">${daysUntilExpiry}일 후 만료</span>`;
                    } else if (daysUntilExpiry <= 7) {
                        expiryBadge = `<span class="expiry-badge">${daysUntilExpiry}일 후 만료</span>`;
                    }
                }

                // 번역 상태 표시
                let translationBadge = '';
                if (video.translated) {
                    const targetLangs = video.targetLanguages ? video.targetLanguages.map(l => l.name || l.code).join(', ') : '';
                    translationBadge = `<span class="translation-badge" style="display: inline-block; background: #FF9800; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 8px;">번역됨</span>`;
                }
                
                // 상태 배지 생성 (간결하게)
                let statusBadge = '';
                if (expiryDate && daysUntilExpiry !== null) {
                    if (daysUntilExpiry <= 0) {
                        statusBadge = '<span class="status-badge status-expired">만료됨</span>';
                    } else if (daysUntilExpiry <= 3) {
                        statusBadge = `<span class="status-badge status-warning">D-${daysUntilExpiry}</span>`;
                    }
                } else if (video.translated) {
                    statusBadge = '<span class="status-badge status-success">완료</span>';
                } else if (video.jobId) {
                    const job = JSON.parse(localStorage.getItem('jobs') || '[]').find(j => j.id === video.jobId);
                    if (job && job.status === 'processing') {
                        statusBadge = '<span class="status-badge status-processing">처리 중</span>';
                    }
                }
                
                // 사용 크레딧 계산
                const duration = video.duration || 0;
                const translationCount = video.targetLanguages ? video.targetLanguages.length : 0;
                const durationMinutes = Math.ceil(duration / 60);
                const usedCredits = durationMinutes * 10 + durationMinutes * 5 * translationCount;
                
                // 보관 정보 (간결하게)
                let expiryInfo = '';
                if (expiryDate && daysUntilExpiry !== null) {
                    const expiryDateStr = `${expiryDate.getFullYear()}.${String(expiryDate.getMonth() + 1).padStart(2, '0')}.${String(expiryDate.getDate()).padStart(2, '0')}`;
                    expiryInfo = `<div class="expiry-info">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${expiryDateStr}까지</span>
                    </div>`;
                }
                
                // 실시간 번역 타입인지 확인
                const isLiveTranslation = video.type === 'live_translation';
                const cardClickHandler = isLiveTranslation 
                    ? `onclick="showTranslationDetail('${video.id}')" style="cursor: pointer;"`
                    : '';
                
                // 실시간 번역 카드는 새로운 디자인 사용
                if (isLiveTranslation) {
                    // 만료 날짜 텍스트 추출
                    let expiryText = '';
                    if (expiryDate && daysUntilExpiry !== null) {
                        const expiryDateStr = `${expiryDate.getFullYear()}.${String(expiryDate.getMonth() + 1).padStart(2, '0')}.${String(expiryDate.getDate()).padStart(2, '0')}`;
                        expiryText = `<div class="translation-card-expiry">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${expiryDateStr}까지</span>
                        </div>`;
                    }
                    
                    // 시간 정보 추출
                    const createdDate = new Date(video.createdAt || video.savedAt || Date.now());
                    const timeStr = createdDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
                    const dateStr = `${createdDate.getFullYear()}. ${String(createdDate.getMonth() + 1).padStart(2, '0')}. ${String(createdDate.getDate()).padStart(2, '0')}.`;
                    
                    return `
                        <div class="translation-record-card" data-video-id="${video.id}" ${cardClickHandler}>
                            <div class="translation-card-content">
                                <div class="translation-card-title-row">
                                    <h3 class="translation-card-title">${video.title}</h3>
                                </div>
                                <div class="translation-card-time">${timeStr}</div>
                                ${expiryText}
                                <div class="translation-card-actions" onclick="event.stopPropagation()">
                                    <button class="translation-btn-download" onclick="event.stopPropagation(); downloadVideo(${originalIndex})">
                                        <i class="fas fa-download"></i>
                                        <span>다운로드</span>
                                    </button>
                                    <button class="translation-btn-delete" onclick="event.stopPropagation(); deleteVideo(${originalIndex})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                // 기존 비디오 카드 디자인 (비실시간 번역용)
                return `
                    <div class="video-card" data-video-id="${video.id}" ${daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry > 0 ? 'data-expiring="true"' : ''} ${cardClickHandler}>
                        <div class="video-thumbnail" data-video-id="${video.id}">
                            <video class="thumbnail-video" preload="metadata" muted>
                                <source src="" type="video/mp4">
                            </video>
                            <div class="thumbnail-placeholder">
                                <i class="fas fa-video"></i>
                            </div>
                            <div class="video-duration">${formatDuration(duration)}</div>
                            <div class="play-overlay">
                                <i class="fas fa-play"></i>
                            </div>
                            ${statusBadge ? `<div class="status-badge-overlay">${statusBadge}</div>` : ''}
                        </div>
                        <div class="video-info">
                            <div class="video-header">
                                <h3 class="video-title" onclick="editVideo('${video.id}')">${video.title}</h3>
                                ${expiryInfo}
                            </div>
                            
                            <div class="video-meta-grid">
                                <div class="meta-item">
                                    <i class="fas fa-clock"></i>
                                    <span>${formatDuration(duration)}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-hdd"></i>
                                    <span>${formatFileSize(video.size || 0)}</span>
                                </div>
                                <div class="meta-item">
                                    <i class="fas fa-coins"></i>
                                    <span>${usedCredits.toLocaleString()}</span>
                                </div>
                                ${translationCount > 0 ? `
                                <div class="meta-item">
                                    <i class="fas fa-language"></i>
                                    <span>${video.targetLanguages.map(l => l.name || l.code).join(', ')}</span>
                                </div>
                                ` : ''}
                            </div>
                            
                            <div class="video-actions" onclick="event.stopPropagation()">
                                ${(video.isFreeTrial || video.downloadable === false) 
                                    ? '<button class="btn-download disabled" disabled><i class="fas fa-download"></i> 다운로드</button>' 
                                    : `<button class="btn-download" onclick="event.stopPropagation(); downloadVideo(${originalIndex})"><i class="fas fa-download"></i> 다운로드</button>`}
                                <button class="btn-delete" onclick="event.stopPropagation(); deleteVideo(${originalIndex})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // videos 업데이트 이벤트 발생 (storage.js에서 자동으로 처리)
            document.dispatchEvent(new CustomEvent('videosUpdated', {
                detail: { videos: videos }
            }));
            
            // 렌더링 완료 플래그 설정
            isRendering = false;
            
            // 비디오 미리보기 로드 (Intersection Observer 사용)
            requestAnimationFrame(() => {
                loadVideoThumbnails();
            });
            
            // 추가로 즉시 로드 시도 (첫 3개는 즉시 표시)
            setTimeout(() => {
                const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
                thumbnailContainers.forEach((container, index) => {
                    if (index < 3) {
                        const videoId = container.dataset.videoId;
                        const videoElement = container.querySelector('.thumbnail-video');
                        const placeholder = container.querySelector('.thumbnail-placeholder');
                        
                        if (videoElement && videoId && placeholder && placeholder.style.display !== 'none') {
                            // localStorage에서 즉시 확인
                            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                            const video = savedVideos.find(v => v.id === videoId);
                            
                            if (video && video.videoUrl) {
                                // videoUrl이 있으면 즉시 사용
                                const url = video.videoUrl;
                                if (url.startsWith('blob:') || url.startsWith('http')) {
                                    videoElement.src = url;
                                    videoElement.addEventListener('loadedmetadata', () => {
                                        if (videoElement.duration > 0) {
                                            videoElement.currentTime = Math.min(
                                                Math.max(1, videoElement.duration * 0.15),
                                                videoElement.duration * 0.5
                                            );
                                        }
                                    }, { once: true });
                                    
                                    videoElement.addEventListener('seeked', () => {
                                        if (placeholder) {
                                            placeholder.style.display = 'none';
                                        }
                                        videoElement.style.display = 'block';
                                    }, { once: true });
                                }
                            }
                        }
                    }
                });
            }, 200);
        }
        
        // Intersection Observer를 사용한 지연 로딩 초기화
        function initThumbnailObserver() {
            if (!('IntersectionObserver' in window)) {
                // Intersection Observer를 지원하지 않는 브라우저는 기존 방식 사용
                return null;
            }
            
            return new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const container = entry.target;
                        const videoId = container.dataset.videoId;
                        const videoElement = container.querySelector('.thumbnail-video');
                        const placeholder = container.querySelector('.thumbnail-placeholder');
                        
                        if (videoElement && videoId) {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, 0);
                            // 로드 시작 후 관찰 중지
                            thumbnailLoadObserver.unobserve(container);
                        }
                    }
                });
            }, {
                rootMargin: '50px', // 뷰포트 50px 전에 미리 로드
                threshold: 0.1
            });
        }
        
        // 비디오 썸네일 로드 (최적화: Intersection Observer 사용)
        function loadVideoThumbnails() {
            const thumbnailContainers = document.querySelectorAll('.video-thumbnail[data-video-id]');
            
            if (thumbnailContainers.length === 0) {
                logger.log('썸네일 컨테이너를 찾을 수 없습니다.');
                return;
            }
            
            logger.log('썸네일 로드 시작:', thumbnailContainers.length, '개');
            
            // Intersection Observer 사용 (지연 로딩)
            if (thumbnailLoadObserver) {
                thumbnailContainers.forEach(container => {
                    thumbnailLoadObserver.observe(container);
                });
            } else {
                // Fallback: 기존 방식 (첫 3개만 즉시 로드)
                thumbnailContainers.forEach((container, index) => {
                    if (index < 3) {
                        const videoId = container.dataset.videoId;
                        const videoElement = container.querySelector('.thumbnail-video');
                        const placeholder = container.querySelector('.thumbnail-placeholder');
                        
                        if (videoElement && videoId) {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, 0);
                        }
                    }
                });
            }
        }
        
        // IndexedDB에서 비디오 썸네일 로드 (최적화 및 재시도 로직 추가)
        function loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount = 0) {
            const maxRetries = 3; // 최대 3번 재시도
            let thumbnailLoaded = false;
            let currentVideoElement = videoElement; // 현재 사용 중인 비디오 요소 추적
            
            // 타임아웃 설정 (8초로 증가)
            const timeout = setTimeout(() => {
                if (!thumbnailLoaded && placeholder) {
                    placeholder.innerHTML = '<i class="fas fa-video-slash" style="font-size: 2rem; color: #999;"></i><div style="margin-top: 8px; font-size: 14px; color: #999;">로드 중...</div>';
                }
            }, 8000);
            
            // 비디오 로드 성공 처리 함수
            const showThumbnail = () => {
                if (placeholder) {
                    placeholder.style.display = 'none';
                    placeholder.style.visibility = 'hidden';
                    placeholder.style.opacity = '0';
                }
                // 현재 사용 중인 비디오 요소에 스타일 적용
                if (currentVideoElement) {
                    currentVideoElement.style.display = 'block';
                    currentVideoElement.style.visibility = 'visible';
                    currentVideoElement.style.opacity = '1';
                    // 강제로 리플로우 트리거
                    currentVideoElement.offsetHeight;
                }
                thumbnailLoaded = true;
                clearTimeout(timeout);
                logger.log('썸네일 로드 성공:', videoId);
            };
            
            // 비디오 로드 실패 처리 함수
            const showError = (message) => {
                clearTimeout(timeout);
                if (placeholder) {
                    placeholder.innerHTML = `<i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #999;"></i><div style="margin-top: 8px; font-size: 14px; color: #999;">${message || '로드 실패'}</div>`;
                }
            };
            
            // 비디오 URL 설정 및 로드
            const setupVideoThumbnail = (url) => {
                // 이전 이벤트 리스너 제거
                const newVideoElement = videoElement.cloneNode(true);
                videoElement.parentNode.replaceChild(newVideoElement, videoElement);
                newVideoElement.id = videoElement.id;
                newVideoElement.className = videoElement.className;
                currentVideoElement = newVideoElement; // 현재 요소 업데이트
                
                newVideoElement.src = url;
                
                // 비디오 메타데이터 로드 후 특정 시간으로 이동하여 썸네일 생성
                newVideoElement.addEventListener('loadedmetadata', () => {
                    if (newVideoElement.duration > 0) {
                        // 비디오의 중간 지점 또는 10% 지점으로 이동 (더 나은 썸네일)
                        const seekTime = Math.min(
                            Math.max(1, newVideoElement.duration * 0.15), // 15% 지점
                            newVideoElement.duration * 0.5 // 최대 50% 지점
                        );
                        newVideoElement.currentTime = seekTime;
                    } else {
                        // duration을 가져올 수 없으면 첫 프레임 표시
                        showThumbnail();
                    }
                }, { once: true });
                
                newVideoElement.addEventListener('seeked', () => {
                    showThumbnail();
                }, { once: true });
                
                newVideoElement.addEventListener('loadeddata', () => {
                    // 메타데이터만 로드된 경우에도 표시 (fallback)
                    if (newVideoElement.readyState >= 2 && !thumbnailLoaded) {
                        showThumbnail();
                    }
                }, { once: true });
                
                newVideoElement.addEventListener('error', () => {
                    logger.error('비디오 썸네일 로드 오류:', videoId);
                    if (retryCount < maxRetries) {
                        // 재시도
                        logger.log(`썸네일 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                        setTimeout(() => {
                            loadVideoThumbnailFromIndexedDB(videoId, newVideoElement, placeholder, retryCount + 1);
                        }, 1000 * (retryCount + 1)); // 지수 백오프
                    } else {
                        showError('로드 실패');
                    }
                }, { once: true });
            };
            
            // IndexedDB에서 로드 시도
            const request = indexedDB.open('AX2_Videos', 1);
            
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readonly');
                const store = transaction.objectStore('videos');
                const getRequest = store.get(videoId);
                
                getRequest.onsuccess = () => {
                    if (getRequest.result && getRequest.result.data) {
                        try {
                            const blob = new Blob([getRequest.result.data], { 
                                type: getRequest.result.type || 'video/mp4' 
                            });
                            const url = URL.createObjectURL(blob);
                            if (!thumbnailLoaded) {
                                setupVideoThumbnail(url);
                            }
                        } catch (error) {
                            logger.error('Blob 생성 오류:', error);
                            if (!thumbnailLoaded) {
                                tryLoadFromLocalStorage();
                            }
                        }
                    } else {
                        // IndexedDB에 없으면 localStorage의 videoUrl 사용 또는 재시도
                        if (retryCount < maxRetries && !thumbnailLoaded) {
                            logger.log(`IndexedDB에 없음, 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                            setTimeout(() => {
                                if (!thumbnailLoaded) {
                                    loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                                }
                            }, 1000 * (retryCount + 1));
                        } else if (!thumbnailLoaded) {
                            tryLoadFromLocalStorage();
                        }
                    }
                };
                
                getRequest.onerror = () => {
                    logger.error('IndexedDB 조회 오류:', videoId);
                    if (retryCount < maxRetries && !thumbnailLoaded) {
                        setTimeout(() => {
                            if (!thumbnailLoaded) {
                                loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                            }
                        }, 1000 * (retryCount + 1));
                    } else if (!thumbnailLoaded) {
                        tryLoadFromLocalStorage();
                    }
                };
            };
            
            request.onerror = () => {
                logger.error('IndexedDB 열기 실패');
                if (retryCount < maxRetries && !thumbnailLoaded) {
                    setTimeout(() => {
                        if (!thumbnailLoaded) {
                            loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                        }
                    }, 1000 * (retryCount + 1));
                } else if (!thumbnailLoaded) {
                    tryLoadFromLocalStorage();
                }
            };
            
            // localStorage에서 videoUrl 로드 시도
            function tryLoadFromLocalStorage() {
                if (thumbnailLoaded) return; // 이미 로드되었으면 중단
                
                const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
                const video = savedVideos.find(v => v.id === videoId);
                
                if (video && video.videoUrl) {
                    // Blob URL이 만료되었을 수 있으므로 확인
                    if (video.videoUrl.startsWith('blob:')) {
                        // Blob URL이 만료되었을 수 있으므로 IndexedDB에서 다시 시도
                        if (retryCount < maxRetries) {
                            logger.log(`Blob URL 만료 가능, IndexedDB 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                            setTimeout(() => {
                                if (!thumbnailLoaded) {
                                    loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                                }
                            }, 1000 * (retryCount + 1));
                        } else {
                            // 마지막 시도로 Blob URL 사용
                            setupVideoThumbnail(video.videoUrl);
                        }
                    } else {
                        // 일반 URL인 경우
                        setupVideoThumbnail(video.videoUrl);
                    }
                } else {
                    // 재시도 로직: IndexedDB 저장이 아직 완료되지 않았을 수 있음
                    if (retryCount < maxRetries) {
                        logger.log(`localStorage에도 없음, 재시도 ${retryCount + 1}/${maxRetries}:`, videoId);
                        setTimeout(() => {
                            if (!thumbnailLoaded) {
                                loadVideoThumbnailFromIndexedDB(videoId, videoElement, placeholder, retryCount + 1);
                            }
                        }, 1000 * (retryCount + 1));
                    } else {
                        showError('영상 없음');
                    }
                }
            }
            
            // localStorage에서 즉시 확인 (Blob URL이 아닌 경우)
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            const video = savedVideos.find(v => v.id === videoId);
            
            if (video && video.videoUrl && !video.videoUrl.startsWith('blob:')) {
                // 일반 URL인 경우 즉시 사용 (IndexedDB보다 빠름)
                setupVideoThumbnail(video.videoUrl);
            } else {
                // Blob URL이거나 없으면 IndexedDB 시도 후 localStorage fallback
                // tryLoadFromLocalStorage는 IndexedDB 실패 시 호출됨
            }
        }

        // 날짜 포맷
        function formatDate(date) {
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // 시간 포맷
        // 시간 포맷 (시:분:초.밀리초)
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            const ms = Math.floor((seconds % 1) * 100);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        }

        function formatDuration(seconds) {
            // 소수점 제거: 초를 정수로 반올림
            const totalSeconds = Math.round(seconds);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;
            
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
        
        // 파일 크기 포맷 (소수점 제거)
        function formatFileSize(sizeGB) {
            if (!sizeGB || sizeGB === 0) {
                return '0GB';
            }
            
            // GB 단위가 1 이상이면 정수로 표시
            if (sizeGB >= 1) {
                return Math.round(sizeGB) + 'GB';
            }
            
            // 1GB 미만이면 MB 단위로 변환하여 정수로 표시
            const sizeMB = sizeGB * 1024;
            if (sizeMB >= 1) {
                return Math.round(sizeMB) + 'MB';
            }
            
            // 1MB 미만이면 KB 단위로 변환하여 정수로 표시
            const sizeKB = sizeMB * 1024;
            if (sizeKB >= 1) {
                return Math.round(sizeKB) + 'KB';
            }
            
            // 1KB 미만이면 바이트 단위로 표시
            return Math.round(sizeKB * 1024) + 'B';
        }

        // 카테고리 이름 반환
        function getCategoryName(category) {
            const categories = {
                'business': '비즈니스',
                'education': '교육',
                'technology': '기술',
                'marketing': '마케팅',
                'other': '기타'
            };
            return categories[category] || category;
        }

        // 번역 내용을 텍스트 파일로 다운로드
        function downloadTranslationAsText(video) {
            if (!video.translationContent) {
                alert('번역 내용이 없습니다.');
                return;
            }
            
            let textContent = `번역 기록: ${video.title}\n`;
            textContent += `입력 언어: ${video.inputLanguage || '한국어'}\n`;
            textContent += `번역 언어: ${video.targetLanguages ? video.targetLanguages.map(l => l.name || l.code).join(', ') : '-'}\n`;
            textContent += `번역 시간: ${formatDuration(video.duration || 0)}\n`;
            textContent += `생성일: ${new Date(video.createdAt || video.savedAt).toLocaleString('ko-KR')}\n`;
            textContent += `\n${'='.repeat(50)}\n\n`;
            
            const originalItems = video.translationContent.original || [];
            const translations = video.translationContent.translations || {};
            
            if (originalItems.length > 0) {
                originalItems.forEach((originalItem, index) => {
                    textContent += `[${index + 1}] 원문:\n${originalItem.text || ''}\n\n`;
                    
                    // 각 번역 언어별 번역문
                    if (translations && Object.keys(translations).length > 0) {
                        Object.keys(translations).forEach(langCode => {
                            const langTranslations = translations[langCode] || [];
                            if (langTranslations[index]) {
                                const langName = video.targetLanguages?.find(l => {
                                    const lCode = typeof l === 'object' ? (l.code || l) : l;
                                    return lCode === langCode;
                                })?.name || langCode;
                                
                                textContent += `[${index + 1}] ${langName}:\n${langTranslations[index].text || ''}\n\n`;
                            }
                        });
                    }
                    
                    textContent += `${'='.repeat(50)}\n\n`;
                });
            } else {
                textContent += '번역 내용이 없습니다.\n';
            }
            
            // 텍스트 파일로 다운로드
            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const fileName = `${video.title || '번역기록'}_${new Date(video.createdAt || video.savedAt).toISOString().split('T')[0]}.txt`;
            a.download = fileName.replace(/[<>:"/\\|?*]/g, '_'); // 파일명에 사용할 수 없는 문자 제거
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            logger.log('번역 내용 다운로드 완료:', fileName);
        }
        
        // 번역 내용을 JSON 파일로 다운로드
        function downloadTranslationAsJSON(video) {
            if (!video.translationContent) {
                alert('번역 내용이 없습니다.');
                return;
            }
            
            const jsonData = {
                title: video.title,
                inputLanguage: video.inputLanguage,
                targetLanguages: video.targetLanguages,
                duration: video.duration,
                createdAt: video.createdAt,
                savedAt: video.savedAt,
                translationContent: video.translationContent,
                usedCredits: video.usedCredits
            };
            
            const jsonContent = JSON.stringify(jsonData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const fileName = `${video.title || '번역기록'}_${new Date(video.createdAt || video.savedAt).toISOString().split('T')[0]}.json`;
            a.download = fileName.replace(/[<>:"/\\|?*]/g, '_');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            logger.log('번역 내용 JSON 다운로드 완료:', fileName);
        }
        
        // 영상 다운로드 (활성화 및 최적화)
        function downloadVideo(index) {
            if (event) {
                event.stopPropagation(); // 카드 클릭 이벤트 방지
            }
            const video = videos[index];
            
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            // 실시간 번역 기록인 경우 번역 내용 다운로드 (기본: 텍스트 파일)
            if (video.type === 'live_translation') {
                downloadTranslationAsText(video);
                return;
            }
            
            // 무료 체험 사용자는 다운로드 불가
            if (video.isFreeTrial || video.downloadable === false) {
                alert('무료 체험 사용자는 다운로드할 수 없습니다.\n크레딧을 충전하여 일반 사용자로 전환하시면 다운로드가 가능합니다.');
                return;
            }
            
            // 일반 비디오 파일 다운로드 (IndexedDB에서)
            const request = indexedDB.open('AX2_Videos', 1);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readonly');
                const store = transaction.objectStore('videos');
                const getRequest = store.get(video.id);
                
                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        const blob = new Blob([getRequest.result.data], { type: getRequest.result.type });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = video.fileName || video.title || 'video.mp4';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        alert(`"${video.title}" 다운로드가 시작되었습니다.`);
                    } else {
                        alert('파일을 찾을 수 없습니다.');
                    }
                };
                
                getRequest.onerror = () => {
                    alert('다운로드 중 오류가 발생했습니다.');
                };
            };
            
            request.onerror = () => {
                alert('저장소에 접근할 수 없습니다.');
            };
        }
        
        // 전역 함수로 등록
        window.downloadVideo = downloadVideo;


        // 영상 편집 - 번역 편집 페이지로 이동
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
        
        // 로그인 확인 팝업 표시
        function showLoginConfirmDialog() {
            return new Promise((resolve) => {
                // 커스텀 팝업 생성
                const popup = document.createElement('div');
                popup.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                `;
                
                const popupContent = document.createElement('div');
                popupContent.style.cssText = `
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    text-align: center;
                `;
                
                const title = document.createElement('h3');
                title.textContent = '로그인이 필요합니다';
                title.style.cssText = 'margin: 0 0 15px 0; font-size: 1.3rem; color: #333;';
                
                const message = document.createElement('p');
                message.textContent = '강의를 편집하려면 로그인이 필요합니다.\n로그인 페이지로 이동합니다.';
                message.style.cssText = 'margin: 0 0 25px 0; font-size: 1rem; color: #666; white-space: pre-line;';
                
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center;';
                
                const confirmBtn = document.createElement('button');
                confirmBtn.textContent = '확인';
                confirmBtn.style.cssText = `
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                `;
                
                confirmBtn.addEventListener('mouseenter', () => {
                    confirmBtn.style.transform = 'translateY(-2px)';
                    confirmBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                });
                
                confirmBtn.addEventListener('mouseleave', () => {
                    confirmBtn.style.transform = 'translateY(0)';
                    confirmBtn.style.boxShadow = 'none';
                });
                
                confirmBtn.addEventListener('click', () => {
                    document.body.removeChild(popup);
                    resolve(true);
                });
                
                buttonContainer.appendChild(confirmBtn);
                popupContent.appendChild(title);
                popupContent.appendChild(message);
                popupContent.appendChild(buttonContainer);
                popup.appendChild(popupContent);
                
                document.body.appendChild(popup);
                
                // 배경 클릭 시 닫기
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) {
                        document.body.removeChild(popup);
                        resolve(false);
                    }
                });
            });
        }
        
        function editVideo(videoId) {
            if (!videoId) {
                logger.error('비디오 ID가 없습니다.');
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            // 로그인 상태 확인
            if (!checkLoginStatus()) {
                logger.log('로그인하지 않은 사용자가 강의 편집 시도');
                showLoginConfirmDialog().then((confirmed) => {
                    if (confirmed) {
                        // 현재 페이지 URL을 저장하여 로그인 후 돌아올 수 있도록
                        const currentUrl = window.location.href;
                        sessionStorage.setItem('redirectAfterLogin', currentUrl);
                        window.location.href = 'login.html';
                    }
                });
                return;
            }
            
            logger.log('편집 페이지로 이동:', videoId);
            
            // 저장된 영상 확인
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            const video = savedVideos.find(v => v.id === videoId);
            
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            // 편집 페이지로 이동
            window.location.href = `edit.html?id=${videoId}`;
        }
        
        // 전역 스코프에 함수 등록 (HTML에서 onclick으로 호출하기 위해)
        window.editVideo = editVideo;

        function closeEditModal() {
            document.getElementById('edit-modal').classList.remove('show');
            currentEditVideoId = null;
        }

        function saveEdit() {
            if (!currentEditVideoId) return;

            const video = videos.find(v => v.id === currentEditVideoId);
            if (!video) return;

            // 편집된 내용 저장
            video.title = document.getElementById('edit-title').value.trim() || video.title;
            video.description = document.getElementById('edit-description').value.trim();
            
            // 태그 처리
            const tagsInput = document.getElementById('edit-tags').value.trim();
            video.tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
            
            video.category = document.getElementById('edit-category').value;
            video.updatedAt = new Date().toISOString();

            // 데이터 저장
            saveData();
            closeEditModal();
            renderVideos();
            
            alert('강의 정보가 저장되었습니다.');
        }

        // 영상 삭제 (활성화 및 최적화)
        function deleteVideo(index) {
            if (event) {
                event.stopPropagation(); // 카드 클릭 이벤트 방지
            }
            
            const video = videos[index];
            if (!video) {
                alert('영상을 찾을 수 없습니다.');
                return;
            }
            
            if (!confirm(`"${video.title}" 영상을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
                return;
            }
            
            // IndexedDB에서도 삭제
            const request = indexedDB.open('AX2_Videos', 1);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['videos'], 'readwrite');
                const store = transaction.objectStore('videos');
                const deleteRequest = store.delete(video.id);
                
                deleteRequest.onsuccess = () => {
                    logger.log('IndexedDB에서 영상 삭제 완료:', video.id);
                };
                
                deleteRequest.onerror = () => {
                    logger.error('IndexedDB 삭제 오류:', deleteRequest.error);
                };
            };
            
            // localStorage에서 삭제
            videos.splice(index, 1);
            saveData();
            renderVideos();
            
            alert('영상이 삭제되었습니다.');
        }
        

        // 자막 미리보기 표시/숨김
        function toggleSubtitlePreview(videoId) {
            const preview = document.getElementById(`subtitle-preview-${videoId}`);
            if (preview) {
                if (preview.style.display === 'none') {
                    preview.style.display = 'block';
                    loadSubtitlePreview(videoId);
                } else {
                    preview.style.display = 'none';
                }
            }
        }

        // 자막 미리보기 로드
        function loadSubtitlePreview(videoId) {
            const video = videos.find(v => v.id === videoId);
            if (!video || !video.transcriptions) {
                return;
            }

            const contentEl = document.getElementById(`subtitle-content-${videoId}`);
            if (!contentEl) return;

            // 첫 번째 언어의 자막만 미리보기로 표시 (최대 5개)
            const previews = video.transcriptions.slice(0, 5).map(segment => {
                const text = segment.korean || segment.english || segment[Object.keys(segment).find(k => k !== 'id' && k !== 'startTime' && k !== 'endTime' && k !== 'speaker')] || '';
                const time = formatTime(segment.startTime);
                return `<div class="subtitle-preview-item"><span class="subtitle-time">${time}</span> ${text}</div>`;
            }).join('');

            contentEl.innerHTML = previews || '<div class="subtitle-preview-empty">자막이 없습니다.</div>';
        }

        // 전역 함수로 등록
        window.toggleSubtitlePreview = toggleSubtitlePreview;
        window.deleteVideo = deleteVideo;

        // 데이터 저장
        function saveData() {
            localStorage.setItem('savedVideos', JSON.stringify(videos));
            // videos 업데이트 이벤트 발생 (storage.js에서 자동으로 처리)
            document.dispatchEvent(new CustomEvent('videosUpdated', {
                detail: { videos: videos }
            }));
        }
        
        // 전역 함수로 등록
        window.loadData = loadData;

        // 정렬 버튼 업데이트 함수
        function updateSortButton(btn, selectedSort) {
            if (!btn) return;
            
            const iconElement = btn.querySelector('i.fa-arrows-up-down, i.fa-arrows-alt-v, i.fa-sort, i.fa-filter, i.fa-sort-amount-down, i.fa-sort-amount-up');
            const textElement = btn.querySelector('span');
            
            if (selectedSort === 'latest') {
                if (iconElement) {
                    iconElement.className = 'fas fa-sort-amount-down';
                }
                if (textElement) {
                    textElement.textContent = '최신순';
                }
            } else if (selectedSort === 'oldest') {
                if (iconElement) {
                    iconElement.className = 'fas fa-sort-amount-up';
                }
                if (textElement) {
                    textElement.textContent = '오래된순';
                }
            } else {
                // 기본값: 정렬 (위아래 화살표 아이콘 - 나란히 배치)
                if (iconElement) {
                    iconElement.className = 'fas fa-arrows-up-down';
                }
                if (textElement) {
                    textElement.textContent = '정렬';
                }
            }
        }
        
        // 검색 및 날짜 필터 초기화
        function initializeSortAndDateFilter() {
            const sortBtn = document.getElementById('sort-btn');
            const sortDropdown = document.getElementById('sort-dropdown');
            const sortOptions = document.querySelectorAll('.sort-option');
            const dateFrom = document.getElementById('date-from');
            const dateTo = document.getElementById('date-to');
            const dateClearBtn = document.getElementById('date-clear-btn');
            
            // 초기 상태: 정렬 버튼을 기본값으로 설정
            if (sortBtn) {
                updateSortButton(sortBtn, '');
            }
            
            // 정렬 버튼 클릭 시 드롭다운 토글
            if (sortBtn && sortDropdown) {
                // 기존 이벤트 리스너 제거를 위해 클론 후 교체
                const newSortBtn = sortBtn.cloneNode(true);
                sortBtn.parentNode.replaceChild(newSortBtn, sortBtn);
                
                // 클릭 이벤트 (간단하게)
                newSortBtn.onclick = function(e) {
                    e.stopPropagation();
                    console.log('정렬 버튼 클릭됨');
                    const isShowing = sortDropdown.classList.contains('show');
                    if (isShowing) {
                        sortDropdown.classList.remove('show');
                    } else {
                        sortDropdown.classList.add('show');
                    }
                };
                
                // 드롭다운 옵션 클릭 이벤트
                if (sortOptions && sortOptions.length > 0) {
                    sortOptions.forEach(option => {
                        option.onclick = function(e) {
                            e.stopPropagation();
                            const selectedSort = this.getAttribute('data-sort');
                            sortOrder = selectedSort;
                            
                            // 선택된 옵션 표시 업데이트
                            sortOptions.forEach(opt => opt.classList.remove('active'));
                            this.classList.add('active');
                            
                            // 정렬 버튼 업데이트 (텍스트와 아이콘 변경)
                            updateSortButton(newSortBtn, selectedSort);
                            
                            // 드롭다운 닫기
                            if (sortDropdown) {
                                sortDropdown.classList.remove('show');
                            }
                            
                            renderVideos();
                        };
                    });
                }
                
                // 드롭다운 외부 클릭 시 닫기 (한 번만 등록)
                if (!window.sortDropdownClickHandler) {
                    window.sortDropdownClickHandler = function(e) {
                        if (sortDropdown && newSortBtn) {
                            if (!sortDropdown.contains(e.target) && !newSortBtn.contains(e.target)) {
                                sortDropdown.classList.remove('show');
                            }
                        }
                    };
                    document.addEventListener('click', window.sortDropdownClickHandler);
                }
            }
            
            // 초기 선택 상태 설정 (sortOrder가 있을 때만)
            if (sortOptions && sortOptions.length > 0 && sortOrder) {
                const currentOption = Array.from(sortOptions).find(opt => opt.getAttribute('data-sort') === sortOrder);
                if (currentOption) {
                    currentOption.classList.add('active');
                    if (sortBtn) {
                        updateSortButton(sortBtn, sortOrder);
                    }
                }
            }
            
            // 날짜 필터 이벤트
            if (dateFrom) {
                dateFrom.addEventListener('change', function(e) {
                    currentDateFrom = e.target.value;
                    if (currentDateFrom || currentDateTo) {
                        dateClearBtn.style.display = 'flex';
                    } else {
                        dateClearBtn.style.display = 'none';
                    }
                    renderVideos();
                });
            }
            
            if (dateTo) {
                dateTo.addEventListener('change', function(e) {
                    currentDateTo = e.target.value;
                    if (currentDateFrom || currentDateTo) {
                        dateClearBtn.style.display = 'flex';
                    } else {
                        dateClearBtn.style.display = 'none';
                    }
                    renderVideos();
                });
            }
            
            // 날짜 필터 초기화 버튼
            if (dateClearBtn) {
                dateClearBtn.addEventListener('click', function() {
                    if (dateFrom) {
                        dateFrom.value = '';
                        currentDateFrom = '';
                    }
                    if (dateTo) {
                        dateTo.value = '';
                        currentDateTo = '';
                    }
                    dateClearBtn.style.display = 'none';
                    renderVideos();
                });
            }
            
            logger.log('검색 및 날짜 필터 초기화 완료');
        }
        
        // 검색 및 날짜 필터 초기화 (DOMContentLoaded 또는 즉시 실행)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSortAndDateFilter);
        } else {
            // DOM이 이미 로드된 경우 즉시 실행
            initializeSortAndDateFilter();
        }

        // 자동 삭제 체크 (만료된 영상 삭제)
        function checkAndDeleteExpired() {
            const now = new Date();
            let deleted = false;
            
            videos = videos.filter(video => {
                if (video.expiresAt || video.expiryDate) {
                    const expiry = new Date(video.expiresAt || video.expiryDate);
                    if (expiry <= now) {
                        deleted = true;
                        return false;
                    }
                }
                return true;
            });
            
            if (deleted) {
                saveData();
                renderVideos();
            }
        }

        // 모달 외부 클릭 시 닫기
        document.getElementById('edit-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeEditModal();
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeEditModal();
            }
        });

        // 남은 시간 초기화 및 표시 (초 단위로 관리)
        function initializeRemainingTime() {
            let remainingSeconds = parseInt(localStorage.getItem('remainingSeconds') || '0');
            const lastUpdate = parseInt(localStorage.getItem('lastTimeUpdate') || '0');
            const now = Date.now();
            
            // 기존 분 단위 데이터 마이그레이션
            const oldMinutes = parseInt(localStorage.getItem('remainingMinutes') || '0');
            if (oldMinutes > 0 && remainingSeconds === 0) {
                remainingSeconds = oldMinutes * 60;
                localStorage.removeItem('remainingMinutes');
            }
            
            // 초기화되지 않은 경우 5분(300초)으로 설정
            if (remainingSeconds === 0 && !localStorage.getItem('timeInitialized')) {
                remainingSeconds = 5 * 60;
                localStorage.setItem('remainingSeconds', remainingSeconds.toString());
                localStorage.setItem('lastTimeUpdate', now.toString());
                localStorage.setItem('timeInitialized', 'true');
            }
            
            // 마지막 업데이트 이후 경과 시간 계산하여 차감
            if (lastUpdate > 0 && remainingSeconds > 0) {
                const elapsedSeconds = Math.floor((now - lastUpdate) / 1000);
                remainingSeconds = Math.max(0, remainingSeconds - elapsedSeconds);
                localStorage.setItem('remainingSeconds', remainingSeconds.toString());
            }
            localStorage.setItem('lastTimeUpdate', now.toString());
        }
        
        // URL 파라미터 확인 (저장 완료 후 이동)
        const urlParams = new URLSearchParams(window.location.search);
        const refresh = urlParams.get('refresh');
        const savedVideoId = urlParams.get('saved');
        
        if (refresh === 'true' || savedVideoId) {
            // 강제 새로고침
            logger.log('저장 완료 후 이동 감지, 데이터 새로고침, 영상 ID:', savedVideoId);
            // 즉시 로드
            loadData();
            // IndexedDB 저장 완료를 기다린 후 추가 새로고침 및 하단 스크롤
            setTimeout(() => {
                loadData();
                // URL 정리 (히스토리 업데이트)
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, '', 'storage.html');
                }
                // 상단으로 스크롤 (최신 기록이 상단에 표시되므로)
                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 300);
            }, 500);
        }
        
        // 해시가 #top이면 상단으로 스크롤 (최신 기록이 상단에 표시되므로)
        if (window.location.hash === '#top') {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                // 해시 제거
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, '', window.location.pathname + window.location.search);
                }
            }, 1000);
        }
        
        // 디바운스된 데이터 로드 함수
        const debouncedLoadData = debounce(() => {
            loadData();
        }, 300);
        
        // 페이지 포커스 시 데이터 새로고침 (디바운스 적용)
        window.addEventListener('focus', debouncedLoadData);
        
        // 페이지 가시성 변경 시 데이터 새로고침 (디바운스 적용)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                debouncedLoadData();
            }
        });
        
        // 저장 완료 플래그 확인
        const videoSaved = localStorage.getItem('videoSaved');
        if (videoSaved === 'true') {
            const lastSavedVideoId = localStorage.getItem('lastSavedVideoId');
            logger.log('저장 완료 플래그 확인, 영상 ID:', lastSavedVideoId);
            
            // localStorage에서 직접 확인
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            logger.log('저장된 videos 개수:', savedVideos.length);
            if (lastSavedVideoId) {
                const savedVideo = savedVideos.find(v => v.id === lastSavedVideoId);
                logger.log('저장된 번역 기록:', savedVideo);
                if (savedVideo) {
                    logger.log('번역 기록 타입:', savedVideo.type);
                    logger.log('번역 기록 제목:', savedVideo.title);
                }
            }
            
            localStorage.removeItem('videoSaved');
            localStorage.removeItem('lastSavedVideoId');
            
            // 즉시 데이터 새로고침
            loadData();
            
            // IndexedDB 저장 완료를 기다린 후 추가 새로고침
            setTimeout(() => {
                loadData();
            }, 1000);
        }
        
        // 비디오 카드 클릭 이벤트 (동적으로 생성된 카드에 이벤트 위임)
        document.addEventListener('click', (e) => {
            const videoCard = e.target.closest('.video-card');
            if (videoCard && !e.target.closest('.video-actions') && !e.target.closest('button')) {
                const videoId = videoCard.dataset.videoId || videoCard.getAttribute('data-video-id');
                if (videoId) {
                    editVideo(videoId);
                }
            }
        });
        
        // Intersection Observer 초기화
        thumbnailLoadObserver = initThumbnailObserver();
        
        // 초기화
        loadData();
        checkAndDeleteExpired();
        initializeRemainingTime();
        
        // 검색 및 날짜 필터 초기화 (데이터 로드 후)
        requestAnimationFrame(() => {
            initializeSortAndDateFilter();
        });
        
        // 주기적으로 만료된 영상 체크 (1시간마다) - 최적화: 페이지가 보일 때만 실행
        let expiredCheckInterval;
        let refreshInterval;
        
        function startIntervals() {
            // 기존 인터벌 정리
            if (expiredCheckInterval) clearInterval(expiredCheckInterval);
            if (refreshInterval) clearInterval(refreshInterval);
            
            expiredCheckInterval = setInterval(checkAndDeleteExpired, 60 * 60 * 1000);
            
            // 주기적으로 데이터 새로고침 (60초마다로 변경하여 부하 감소) - 페이지가 활성화되어 있을 때만
            refreshInterval = setInterval(() => {
                if (!document.hidden && !isRendering) {
                    debouncedLoadData();
                }
            }, 60000); // 30초 -> 60초로 변경
        }
        
        function stopIntervals() {
            if (expiredCheckInterval) clearInterval(expiredCheckInterval);
            if (refreshInterval) clearInterval(refreshInterval);
        }
        
        // 페이지 가시성 변경 시 인터벌 관리
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopIntervals();
            } else {
                startIntervals();
                // 페이지가 다시 보일 때 즉시 로드 (디바운스 적용)
                debouncedLoadData();
            }
        });
        
        // storage 관련 모든 업데이트는 storage.js에서 자동으로 처리됨
        // - videosUpdated 이벤트를 통해 자동 감지 및 업데이트
        // - loadData 호출 시 자동으로 storage 정보 업데이트
        
        startIntervals();
        
        // 번역 기록 상세 팝업 표시 함수
        window.showTranslationDetail = function(videoId) {
            const savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');
            const video = savedVideos.find(v => v.id === videoId);
            
            if (!video || video.type !== 'live_translation') {
                logger.error('번역 기록을 찾을 수 없습니다.');
                return;
            }
            
            const modal = document.getElementById('translation-detail-modal');
            const titleEl = document.getElementById('translation-detail-title');
            const contentEl = document.getElementById('translation-detail-content');
            
            if (!modal || !titleEl || !contentEl) {
                logger.error('모달 요소를 찾을 수 없습니다.');
                return;
            }
            
            // 제목 설정
            titleEl.textContent = video.title || '번역 기록 상세';
            
            // 언어 이름 매핑 (script.js의 inputLanguageNames와 동일)
            const languageNames = {
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
            
            // 입력 언어 표시 이름 가져오기
            const getInputLanguageName = (langCode) => {
                if (!langCode) return '한국어';
                return languageNames[langCode] || langCode.toUpperCase();
            };
            
            // 번역 언어 표시 이름 가져오기
            const getTargetLanguageNames = (targetLangs) => {
                if (!targetLangs || targetLangs.length === 0) {
                    return '-';
                }
                
                return targetLangs.map(lang => {
                    if (typeof lang === 'string') {
                        return languageNames[lang] || lang.toUpperCase();
                    } else if (typeof lang === 'object') {
                        return lang.name || languageNames[lang.code] || lang.code || '-';
                    }
                    return '-';
                }).filter(name => name !== '-').join(', ') || '-';
            };
            
            // 번역 내용 표시
            let html = `
                <div style="margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">입력 언어</div>
                            <div style="font-weight: 600; color: #333;">${getInputLanguageName(video.inputLanguage)}</div>
                        </div>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">번역 언어</div>
                            <div style="font-weight: 600; color: #333;">${getTargetLanguageNames(video.targetLanguages)}</div>
                        </div>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">번역 시간</div>
                            <div style="font-weight: 600; color: #333;">${formatDuration(video.duration || 0)}</div>
                        </div>
                        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 5px;">사용 크레딧</div>
                            <div style="font-weight: 600; color: #333;">${(video.usedCredits || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            `;
            
            // 번역 내용 표시 (원문과 번역문을 쌍으로 표시)
            if (video.translationContent) {
                html += '<div style="margin-top: 30px;">';
                html += '<h3 style="font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #333;">번역 내용</h3>';
                
                const originalItems = video.translationContent.original || [];
                const translations = video.translationContent.translations || {};
                
                if (originalItems.length > 0) {
                    // 번역 내용 컨테이너 (스크롤 가능)
                    html += '<div style="max-height: 60vh; overflow-y: auto; overflow-x: hidden; padding-right: 8px;">';
                    
                    // 원문과 번역문을 인덱스별로 매칭하여 표시
                    originalItems.forEach((originalItem, index) => {
                        html += '<div style="margin-bottom: 30px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">';
                        
                        // 원문 표시
                        html += '<div style="background: #f9f9f9; padding: 15px; border-bottom: 1px solid #e0e0e0;">';
                        html += '<div style="font-size: 12px; font-weight: 600; color: #666; margin-bottom: 8px;">원문</div>';
                        html += `<div style="font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap; word-wrap: break-word;">${(originalItem.text || '').replace(/\n/g, '<br>')}</div>`;
                        html += '</div>';
                        
                        // 각 번역 언어별 번역문 표시
                        if (translations && Object.keys(translations).length > 0) {
                            Object.keys(translations).forEach(langCode => {
                                const langTranslations = translations[langCode] || [];
                                if (langTranslations[index]) {
                                    const langName = video.targetLanguages?.find(l => {
                                        const lCode = typeof l === 'object' ? (l.code || l) : l;
                                        return lCode === langCode;
                                    })?.name || langCode;
                                    
                                    html += '<div style="background: #fff; padding: 15px; border-bottom: 1px solid #e0e0e0;">';
                                    html += `<div style="font-size: 12px; font-weight: 600; color: #666; margin-bottom: 8px;">${langName}</div>`;
                                    html += `<div style="font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap; word-wrap: break-word;">${(langTranslations[index].text || '').replace(/\n/g, '<br>')}</div>`;
                                    html += '</div>';
                                }
                            });
                        }
                        
                        html += '</div>';
                    });
                    
                    html += '</div>'; // 번역 내용 컨테이너 닫기
                } else {
                    html += '<div style="text-align: center; padding: 40px; color: #999;">번역 내용이 없습니다.</div>';
                }
                
                html += '</div>';
            } else {
                html += '<div style="text-align: center; padding: 40px; color: #999;">번역 내용이 없습니다.</div>';
            }
            
            contentEl.innerHTML = html;
            modal.style.display = 'flex';
            
            // 모달이 표시될 때 body 스크롤 방지
            document.body.style.overflow = 'hidden';
        };
        
        // 번역 기록 상세 팝업 닫기 함수
        window.closeTranslationDetailModal = function() {
            const modal = document.getElementById('translation-detail-modal');
            if (modal) {
                modal.style.display = 'none';
                // 모달이 닫힐 때 body 스크롤 복원
                document.body.style.overflow = '';
            }
        };
        
        // 모달 외부 클릭 시 닫기 및 ESC 키로 닫기
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('translation-detail-modal');
            if (modal) {
                // 모달 외부 클릭 시 닫기
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        closeTranslationDetailModal();
                    }
                });
                
                // ESC 키로 모달 닫기
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && modal.style.display === 'flex') {
                        closeTranslationDetailModal();
                    }
                });
            }
        });
    