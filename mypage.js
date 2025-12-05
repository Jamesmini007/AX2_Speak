
        let videos = []; // 저장된 영상 목록

        // 로컬 스토리지에서 데이터 로드
        function loadData() {
            const savedVideos = localStorage.getItem('savedVideos');
            
            if (savedVideos) {
                videos = JSON.parse(savedVideos);
            }
            
            renderVideos();
        }

        // 영상 목록 렌더링
        function renderVideos(filter = 'all') {
            const videoGrid = document.getElementById('video-grid');
            
            if (videos.length === 0) {
                videoGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-state-icon">📹</div>
                        <div class="empty-state-text">저장된 영상이 없습니다</div>
                    </div>
                `;
                return;
            }

            // 기본적으로 최근 순으로 정렬 (savedAt 또는 createdAt 기준 내림차순)
            let sortedVideos = videos.slice().sort((a, b) => {
                const dateA = a.savedAt ? new Date(a.savedAt) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
                const dateB = b.savedAt ? new Date(b.savedAt) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
                return dateB - dateA;
            });
            
            let filteredVideos = sortedVideos;
            
            if (filter === 'recent') {
                filteredVideos = sortedVideos.slice(0, 10);
            } else if (filter === 'expiring') {
                const now = new Date();
                filteredVideos = sortedVideos.filter(video => {
                    if (!video.expiryDate) return false;
                    const expiry = new Date(video.expiryDate);
                    const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                });
            }

            // 원본 배열에서의 인덱스를 찾기 위해 ID로 매핑
            const videoIdMap = new Map();
            videos.forEach((v, idx) => videoIdMap.set(v.id, idx));

            videoGrid.innerHTML = filteredVideos.map((video) => {
                const originalIndex = videoIdMap.get(video.id);
                const savedDate = new Date(video.savedAt || video.createdAt || Date.now());
                const expiryDate = video.expiryDate ? new Date(video.expiryDate) : null;
                const now = new Date();
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

                return `
                    <div class="video-card" onclick="editVideo('${video.id}')" data-video-id="${video.id}">
                        <div class="video-thumbnail">
                            영상 미리보기
                            <div class="video-duration">${formatDuration(video.duration || 0)}</div>
                        </div>
                        <div class="video-info">
                            <div class="video-title">${video.title}${expiryBadge}</div>
                            ${video.description ? `<div class="video-description" style="font-size: 13px; color: #666666; margin-bottom: 8px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${video.description}</div>` : ''}
                            <div class="video-meta">
                                저장일: ${formatDate(savedDate)}<br>
                                크기: ${(video.size || 0).toFixed(2)} GB
                                ${video.category ? `<br>카테고리: ${getCategoryName(video.category)}` : ''}
                            </div>
                            <div class="video-actions" onclick="event.stopPropagation()">
                                <button class="action-btn primary" onclick="downloadVideo(${originalIndex})">다운로드</button>
                                <button class="action-btn danger" onclick="deleteVideo(${originalIndex})">삭제</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
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
        function formatDuration(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

        // 영상 다운로드
        function downloadVideo(index) {
            event.stopPropagation(); // 카드 클릭 이벤트 방지
            const video = videos[index];
            // 실제 구현 시 서버에서 영상 파일을 다운로드
            alert(`"${video.title}" 다운로드를 시작합니다.`);
            // 여기에 실제 다운로드 로직 추가
        }


        // 영상 편집 - 번역 편집 페이지로 이동
        function editVideo(videoId) {
            window.location.href = `edit.html?id=${videoId}`;
        }

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

        // 영상 삭제
        function deleteVideo(index) {
            event.stopPropagation(); // 카드 클릭 이벤트 방지
            if (!confirm('정말 이 영상을 삭제하시겠습니까?')) return;
            
            videos.splice(index, 1);
            
            saveData();
            renderVideos();
        }

        // 데이터 저장
        function saveData() {
            localStorage.setItem('savedVideos', JSON.stringify(videos));
        }

        // 필터 버튼 이벤트
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                renderVideos(this.dataset.filter);
            });
        });

        // 자동 삭제 체크 (만료된 영상 삭제)
        function checkAndDeleteExpired() {
            const now = new Date();
            let deleted = false;
            
            videos = videos.filter(video => {
                if (video.expiryDate) {
                    const expiry = new Date(video.expiryDate);
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

        // 남은 시간 초기화 및 표시
        function initializeRemainingTime() {
            let remainingMinutes = parseInt(localStorage.getItem('remainingMinutes') || '0');
            
            if (remainingMinutes === 0 && !localStorage.getItem('timeInitialized')) {
                remainingMinutes = 100;
                localStorage.setItem('remainingMinutes', '100');
                localStorage.setItem('timeInitialized', 'true');
            }
            
            const remainingTimeEl = document.getElementById('remaining-time');
            if (remainingTimeEl) {
                remainingTimeEl.textContent = `${remainingMinutes}분 남음`;
            }
        }
        
        // 초기화
        loadData();
        checkAndDeleteExpired();
        initializeRemainingTime();
        
        // 주기적으로 만료된 영상 체크 (1시간마다)
        setInterval(checkAndDeleteExpired, 60 * 60 * 1000);
    