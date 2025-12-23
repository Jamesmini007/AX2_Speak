// 다국어 지원 (i18n - internationalization)
(function() {
    'use strict';

    // 번역 데이터
    const translations = {
        ko: {
            // 네비게이션
            'nav.subtitle': '실시간 번역',
            'nav.pricing': '크레딧/충전',
            'nav.guide': '사용방법',
            'nav.login': '로그인',
            'nav.signup': '가입하기',
            'nav.logout': '로그아웃',
            'nav.mywork': '번역기록',
            'nav.remaining': '분 남음',
            
            // 더보기 메뉴
            'menu.products': '기타 제품',
            'menu.subtitle_gen': '자막 생성',
            'menu.subtitle_desc': '영상 자막 자동 생성',
            'menu.lecture': '실시간 번역',
            'menu.lecture_desc': '라이브 번역 및 자막',
            'menu.price': '가격',
            'menu.security': '보안',
            'menu.features': '기능',
            'menu.about': '회사 소개',
            'menu.help': '도움',
            'menu.language': '언어',
            'menu.faq': '자주 묻는 질문',
            'menu.tools': '도구',
            'menu.legal': '법률',
            'menu.privacy': '개인정보보호',
            'menu.contact': '문의',
            
            // 메인 페이지
            'main.title': '실시간 언어 번역',
            'main.subtitle': '음성을 실시간으로 인식하고 다국어로 번역합니다.',
            'main.dropzone': '여기로 파일을 드래그하거나 클릭하세요',
            'main.supported': '지원 형식: MP4, AVI, MOV, MKV (최대 500MB)',
            
            // 드롭다운 메뉴
            'dropdown.edit': '정보수정',
            'dropdown.password': '비밀번호변경',
            'dropdown.payment': '결제정보',
            
            // 공통
            'common.free': 'Free',
            'common.student': '학생',
            'common.general': '일반',
            'common.pro': '프로',
            
            // index.html (메인 페이지)
            'index.title': '실시간 언어 번역',
            'index.subtitle': '음성을 실시간으로 인식하고 다국어로 번역합니다.',
            'index.dropzone': '여기로 파일을 드래그하거나 클릭하세요',
            'index.fileinfo': 'MP4, MOV, AVI (최대 2GB)',
            'index.settings': '번역 설정',
            'index.original': '원본 언어',
            'index.target': '번역 언어',
            'index.autodetect': '자동 감지',
            'index.generate': '실시간 번역 시작',
            
            // guide.html (사용방법)
            'guide.title': '사용방법',
            'guide.subtitle.title': '실시간 번역하기',
            'guide.step1.title': '언어 설정',
            'guide.step1.desc': '원본 언어와 번역할 언어(최대 3개)를 선택합니다.',
            'guide.step2.title': '번역 시작',
            'guide.step2.desc': '실시간 번역 시작 버튼을 클릭하여 마이크 입력을 시작합니다.',
            'guide.step3.title': '실시간 번역',
            'guide.step3.desc': '실시간 번역 버튼을 클릭하면 AI가 자동으로 음성을 인식하고 실시간으로 번역합니다.',
            
            // mypage.html (마이페이지)
            'mypage.title': '마이페이지',
            'mypage.profile': '정보수정',
            'mypage.password': '비밀번호 변경',
            'mypage.payment': '결제정보',
            'mypage.withdraw': '회원탈퇴',
            'mypage.nickname': '닉네임',
            'mypage.email': '이메일',
            'mypage.save': '저장하기',
            'mypage.current_pw': '현재 비밀번호',
            'mypage.new_pw': '새 비밀번호',
            'mypage.confirm_pw': '새 비밀번호 확인',
            'mypage.change': '변경하기',
            
            // storage.html (나의 작업)
            'storage.title': '번역기록',
            'storage.new': '새 작업 시작',
            'storage.total': '전체 실시간 번역 기록',
            'storage.completed': '완료된 실시간 번역',
            'storage.video_time': '총 실시간 번역 시간',
            'storage.monthly': '이번 달 작업',
            'storage.space': '저장공간',
            'storage.used': '사용 중',
            
            // pricing.html (요금제)
            'pricing.title': '요금제',
            'pricing.free': '무료',
            'pricing.student': '학생',
            'pricing.general': '일반',
            'pricing.pro': '프로',
            'pricing.subscribe': '구독하기',
            'pricing.current': '현재 플랜',
            
            // faq.html
            'faq.title': '자주 묻는 질문',
            'faq.subtitle': 'AX2 서비스에 대해 자주 묻는 질문과 답변을 확인하세요.',
            'faq.search.placeholder': '질문 검색...',
            'faq.category.all': '전체',
            'faq.category.general': '일반',
            'faq.category.payment': '결제',
            'faq.category.refund': '환불',
            'faq.category.error': '오류',
            'faq.empty.title': '검색 결과가 없습니다',
            'faq.empty.desc': '다른 검색어를 시도해주세요.',
            
            // tools.html
            'tools.title': '도구',
            'tools.subtitle': 'AX2 실시간 언어 번역 서비스의 다양한 도구와 유틸리티를 확인하세요.',
            
            // legal.html
            'legal.title': '법률',
            'legal.subtitle': 'AX2 서비스 이용약관 및 법적 고지를 확인하세요.',
            
            // privacy.html
            'privacy.title': '개인정보보호',
            'privacy.subtitle': 'AX2는 귀하의 개인정보를 소중히 여기며 투명하고 안전하게 관리합니다.',
            
            // contact.html
            'contact.title': '문의',
            'contact.subtitle': 'AX2 실시간 언어 번역 서비스에 대한 문의사항을 남겨주세요.',
            
            // features.html
            'features.title': '기능',
            'features.subtitle': 'AX2의 다양한 기능을 확인하세요. 실시간 음성 인식, 다국어 번역, 실시간 번역 세션 저장 및 관리 등 강력한 기능을 제공합니다.',
            
            // security.html
            'security.title': '보안',
            'security.subtitle': 'AX2의 보안 정책과 개인정보 보호 방안을 확인하세요.',
            
            // login.html
            'login.welcome.title': 'AX2에 오신 것을 환영합니다',
            'login.welcome.subtitle': '한 번의 클릭으로 언어를 넘어서세요',
            'login.google.btn': 'Google로 시작하기',
            'login.kakao.btn': '카카오톡으로 시작하기',
            'login.naver.btn': '네이버로 시작하기',
            'login.main.headline': '만들고, 번역하고, 소통하세요',
            'login.sub.headline': '한 번의 클릭으로 언어의 장벽을 넘어보세요',
            'login.tagline': '고품질 영상, 촬영 불필요 - 간단한 클릭 한 번으로 복제하고 번역하세요.',
            'login.feature1': '실시간 음성 인식 및 번역',
            'login.feature2': '다국어 자막 자동 생성',
            'login.feature3': '강의 자동 저장 및 관리',
            'login.feature4': '간편한 공유 및 다운로드',
            
            // signup.html
            'signup.welcome.title': '회원가입',
            'signup.welcome.subtitle': 'AX2와 함께 언어의 장벽을 넘어보세요',
            'signup.google.btn': 'Google로 가입하기',
            'signup.kakao.btn': '카카오톡으로 가입하기',
            'signup.naver.btn': '네이버로 가입하기',
            
            // used.html
            'used.title': '사용방법',
            'used.subtitle': '간단하고 빠르게 실시간 번역 시작하기',
            'used.guide.badge': '사용 가이드',
            'used.main.title': '간단하고 빠르게',
            'used.main.subtitle': '실시간 번역 시작하기',
            'used.main.desc': '복잡한 설정 없이 언어만 선택하면 실시간으로 음성을 인식하고 번역합니다.',
            'used.cta.start': '무료로 시작하기',
            'used.scroll.hint': '스크롤하여 사용방법 확인',
            'used.stats.languages': '지원 언어',
            'used.stats.accuracy': '번역 정확도',
            'used.stats.realtime': '즉시 번역',
            'used.step1.title': '언어 설정',
            'used.step1.desc': '원본 언어와 번역할 언어 선택',
            'used.step2.title': '번역 시작',
            'used.step2.desc': '마이크 입력을 시작하여 실시간 번역 진행',
            'used.step3.title': '번역 확인 및 저장',
            'used.step3.desc': '실시간 번역 결과를 확인하고 저장'
        },
        en: {
            // Navigation
            'nav.subtitle': 'Subtitles',
            'nav.pricing': 'Pricing',
            'nav.guide': 'Guide',
            'nav.login': 'Login',
            'nav.signup': 'Sign Up',
            'nav.logout': 'Logout',
            'nav.mywork': 'My Work',
            'nav.remaining': 'min left',
            
            // More menu
            'menu.products': 'Other Products',
            'menu.subtitle_gen': 'Subtitles',
            'menu.subtitle_desc': 'Automatic video subtitle generation',
            'menu.lecture': 'Real-time Translation',
            'menu.lecture_desc': 'Live translation & subtitles',
            'menu.price': 'Pricing',
            'menu.security': 'Security',
            'menu.features': 'Features',
            'menu.about': 'About Us',
            'menu.help': 'Help',
            'menu.language': 'Language',
            'menu.faq': 'FAQ',
            'menu.tools': 'Tools',
            'menu.legal': 'Legal',
            'menu.privacy': 'Privacy',
            'menu.contact': 'Contact',
            
            // Main page
            'main.title': 'Real-time Language Translation',
            'main.subtitle': 'Recognize speech in real-time and translate to multiple languages.',
            'main.dropzone': 'Drag files here or click to upload',
            'main.supported': 'Supported: MP4, AVI, MOV, MKV (Max 500MB)',
            
            // Dropdown menu
            'dropdown.edit': 'Edit Profile',
            'dropdown.password': 'Change Password',
            'dropdown.payment': 'Payment Info',
            
            // Common
            'common.free': 'Free',
            'common.student': 'Student',
            'common.general': 'Standard',
            'common.pro': 'Pro',
            
            // index.html
            'index.title': 'Real-time Language Translation',
            'index.subtitle': 'Recognize speech in real-time and translate to multiple languages.',
            'index.dropzone': 'Drag files here or click to upload',
            'index.fileinfo': 'MP4, MOV, AVI (Max 2GB)',
            'index.settings': 'Translation Settings',
            'index.original': 'Original Language',
            'index.target': 'Target Language',
            'index.autodetect': 'Auto Detect',
            'index.generate': 'Start Real-time Translation',
            
            // guide.html
            'guide.title': 'User Guide',
            'guide.subtitle.title': 'Real-time Translation',
            'guide.step1.title': 'Language Settings',
            'guide.step1.desc': 'Select the original language and target languages (up to 3).',
            'guide.step2.title': 'Start Translation',
            'guide.step2.desc': 'Click the start button to begin microphone input.',
            'guide.step3.title': 'Real-time Translation',
            'guide.step3.desc': 'AI will automatically recognize speech and translate in real-time.',
            
            // mypage.html
            'mypage.title': 'My Page',
            'mypage.profile': 'Edit Profile',
            'mypage.password': 'Change Password',
            'mypage.payment': 'Payment Info',
            'mypage.withdraw': 'Delete Account',
            'mypage.nickname': 'Nickname',
            'mypage.email': 'Email',
            'mypage.save': 'Save',
            'mypage.current_pw': 'Current Password',
            'mypage.new_pw': 'New Password',
            'mypage.confirm_pw': 'Confirm Password',
            'mypage.change': 'Change',
            
            // storage.html
            'storage.title': 'My Work',
            'storage.new': 'Start New',
            'storage.total': 'Total Tasks',
            'storage.completed': 'Completed',
            'storage.video_time': 'Total Video Time',
            'storage.monthly': 'This Month',
            'storage.space': 'Storage',
            'storage.used': 'Used',
            
            // pricing.html
            'pricing.title': 'Pricing',
            'pricing.free': 'Free',
            'pricing.student': 'Student',
            'pricing.general': 'Standard',
            'pricing.pro': 'Pro',
            'pricing.subscribe': 'Subscribe',
            'pricing.current': 'Current Plan',
            
            // faq.html
            'faq.title': 'Frequently Asked Questions',
            'faq.subtitle': 'Check frequently asked questions and answers about AX2 service.',
            'faq.search.placeholder': 'Search questions...',
            'faq.category.all': 'All',
            'faq.category.general': 'General',
            'faq.category.payment': 'Payment',
            'faq.category.refund': 'Refund',
            'faq.category.error': 'Error',
            'faq.empty.title': 'No search results',
            'faq.empty.desc': 'Please try a different search term.',
            
            // tools.html
            'tools.title': 'Tools',
            'tools.subtitle': 'Check out various tools and utilities for AX2 real-time language translation service.',
            
            // legal.html
            'legal.title': 'Legal',
            'legal.subtitle': 'Check AX2 service terms and legal notices.',
            
            // privacy.html
            'privacy.title': 'Privacy',
            'privacy.subtitle': 'AX2 values your personal information and manages it transparently and securely.',
            
            // contact.html
            'contact.title': 'Contact',
            'contact.subtitle': 'Please leave your inquiries about AX2 real-time language translation service.',
            
            // features.html
            'features.title': 'Features',
            'features.subtitle': 'Check out the various features of AX2. We provide powerful features such as real-time voice recognition, multilingual translation, and real-time translation session storage and management.',
            
            // security.html
            'security.title': 'Security',
            'security.subtitle': 'Check AX2\'s security policies and personal information protection measures.',
            
            // login.html
            'login.welcome.title': 'Welcome to AX2',
            'login.welcome.subtitle': 'Go beyond language with one click',
            'login.google.btn': 'Start with Google',
            'login.kakao.btn': 'Start with KakaoTalk',
            'login.naver.btn': 'Start with Naver',
            'login.main.headline': 'Create, translate, communicate',
            'login.sub.headline': 'Break through language barriers with one click',
            'login.tagline': 'High-quality videos, no filming required - copy and translate with a simple click.',
            'login.feature1': 'Real-time voice recognition and translation',
            'login.feature2': 'Automatic multilingual subtitle generation',
            'login.feature3': 'Automatic lecture storage and management',
            'login.feature4': 'Easy sharing and downloading',
            
            // signup.html
            'signup.welcome.title': 'Sign Up',
            'signup.welcome.subtitle': 'Go beyond language barriers with AX2',
            'signup.google.btn': 'Sign up with Google',
            'signup.kakao.btn': 'Sign up with KakaoTalk',
            'signup.naver.btn': 'Sign up with Naver',
            
            // used.html
            'used.title': 'How to Use',
            'used.subtitle': 'Start real-time translation easily and quickly',
            'used.guide.badge': 'User Guide',
            'used.main.title': 'Easy and fast',
            'used.main.subtitle': 'Start real-time translation',
            'used.main.desc': 'Recognize and translate speech in real-time by simply selecting a language without complicated settings.',
            'used.cta.start': 'Start for Free',
            'used.scroll.hint': 'Scroll to see how to use',
            'used.stats.languages': 'Supported Languages',
            'used.stats.accuracy': 'Translation Accuracy',
            'used.stats.realtime': 'Instant Translation',
            'used.step1.title': 'Language Settings',
            'used.step1.desc': 'Select the original language and languages to translate',
            'used.step2.title': 'Start Translation',
            'used.step2.desc': 'Start microphone input to proceed with real-time translation',
            'used.step3.title': 'Check and Save Translation',
            'used.step3.desc': 'Check real-time translation results and save them'
        },
        ja: {
            // ナビゲーション
            'nav.subtitle': 'リアルタイム翻訳',
            'nav.pricing': '料金プラン',
            'nav.guide': 'ガイド',
            'nav.login': 'ログイン',
            'nav.signup': '新規登録',
            'nav.logout': 'ログアウト',
            'nav.mywork': 'マイワーク',
            'nav.remaining': '分残り',
            
            // その他メニュー
            'menu.products': 'その他の製品',
            'menu.subtitle_gen': '字幕生成',
            'menu.subtitle_desc': '動画字幕自動生成',
            'menu.lecture': 'リアルタイム翻訳',
            'menu.lecture_desc': 'ライブ翻訳と字幕',
            'menu.price': '料金',
            'menu.security': 'セキュリティ',
            'menu.features': '機能',
            'menu.about': '会社概要',
            'menu.help': 'ヘルプ',
            'menu.language': '言語',
            'menu.faq': 'よくある質問',
            'menu.tools': 'ツール',
            'menu.legal': '法律',
            'menu.privacy': 'プライバシー',
            'menu.contact': 'お問い合わせ',
            
            // メインページ
            'main.title': 'リアルタイム言語翻訳',
            'main.subtitle': '音声をリアルタイムで認識し、多言語に翻訳します。',
            'main.dropzone': 'ファイルをドラッグまたはクリック',
            'main.supported': '対応形式: MP4, AVI, MOV, MKV (最大500MB)',
            
            // ドロップダウンメニュー
            'dropdown.edit': '情報編集',
            'dropdown.password': 'パスワード変更',
            'dropdown.payment': '決済情報',
            
            // 共通
            'common.free': '無料',
            'common.student': '学生',
            'common.general': '一般',
            'common.pro': 'プロ',
            
            // index.html
            'index.title': 'リアルタイム言語翻訳',
            'index.subtitle': '音声をリアルタイムで認識し、多言語に翻訳します。',
            'index.dropzone': 'ファイルをドラッグまたはクリック',
            'index.fileinfo': 'MP4, MOV, AVI (最大2GB)',
            'index.settings': '翻訳設定',
            'index.original': '元の言語',
            'index.target': '対象言語',
            'index.autodetect': '自動検出',
            'index.generate': 'リアルタイム翻訳開始',
            
            // guide.html
            'guide.title': '使用ガイド',
            'guide.subtitle.title': 'リアルタイム翻訳',
            'guide.step1.title': '言語設定',
            'guide.step1.desc': '元の言語と翻訳対象言語（最大3つ）を選択します。',
            'guide.step2.title': '翻訳開始',
            'guide.step2.desc': '開始ボタンをクリックしてマイク入力を開始します。',
            'guide.step3.title': 'リアルタイム翻訳',
            'guide.step3.desc': 'AIが自動的に音声を認識し、リアルタイムで翻訳します。',
            
            // mypage.html
            'mypage.title': 'マイページ',
            'mypage.profile': '情報編集',
            'mypage.password': 'パスワード変更',
            'mypage.payment': '決済情報',
            'mypage.withdraw': '退会',
            'mypage.nickname': 'ニックネーム',
            'mypage.email': 'メール',
            'mypage.save': '保存',
            'mypage.current_pw': '現在のパスワード',
            'mypage.new_pw': '新しいパスワード',
            'mypage.confirm_pw': 'パスワード確認',
            'mypage.change': '変更',
            
            // storage.html
            'storage.title': 'マイワーク',
            'storage.new': '新規作成',
            'storage.total': '全タスク',
            'storage.completed': '完了',
            'storage.video_time': '総動画時間',
            'storage.monthly': '今月',
            'storage.space': 'ストレージ',
            'storage.used': '使用中',
            
            // pricing.html
            'pricing.title': '料金プラン',
            'pricing.free': '無料',
            'pricing.student': '学生',
            'pricing.general': '一般',
            'pricing.pro': 'プロ',
            'pricing.subscribe': '購読する',
            'pricing.current': '現在のプラン',
            
            // faq.html
            'faq.title': 'よくある質問',
            'faq.subtitle': 'AX2サービスに関するよくある質問と回答をご確認ください。',
            'faq.search.placeholder': '質問を検索...',
            'faq.category.all': 'すべて',
            'faq.category.general': '一般',
            'faq.category.payment': '決済',
            'faq.category.refund': '返金',
            'faq.category.error': 'エラー',
            'faq.empty.title': '検索結果がありません',
            'faq.empty.desc': '別の検索語を試してください。',
            
            // tools.html
            'tools.title': 'ツール',
            'tools.subtitle': 'AX2リアルタイム言語翻訳サービスの各種ツールとユーティリティをご確認ください。',
            
            // legal.html
            'legal.title': '法律',
            'legal.subtitle': 'AX2サービス利用規約と法的通知をご確認ください。',
            
            // privacy.html
            'privacy.title': 'プライバシー',
            'privacy.subtitle': 'AX2はお客様の個人情報を大切にし、透明かつ安全に管理します。',
            
            // contact.html
            'contact.title': 'お問い合わせ',
            'contact.subtitle': 'AX2リアルタイム言語翻訳サービスに関するお問い合わせをお願いします。',
            
            // features.html
            'features.title': '機能',
            'features.subtitle': 'AX2の多様な機能をご確認ください。リアルタイム音声認識、多言語翻訳、リアルタイム翻訳セッションの保存と管理などの強力な機能を提供します。',
            
            // security.html
            'security.title': 'セキュリティ',
            'security.subtitle': 'AX2のセキュリティポリシーと個人情報保護対策をご確認ください。',
            
            // login.html
            'login.welcome.title': 'AX2へようこそ',
            'login.welcome.subtitle': 'ワンクリックで言語を超えてください',
            'login.google.btn': 'Googleで始める',
            'login.kakao.btn': 'カカオトークで始める',
            'login.naver.btn': 'ネイバーで始める',
            'login.main.headline': '作成、翻訳、コミュニケーション',
            'login.sub.headline': 'ワンクリックで言語の壁を越えてください',
            'login.tagline': '高品質の動画、撮影不要 - 簡単なクリックで複製して翻訳してください。',
            'login.feature1': 'リアルタイム音声認識と翻訳',
            'login.feature2': '多言語字幕の自動生成',
            'login.feature3': '講義の自動保存と管理',
            'login.feature4': '簡単な共有とダウンロード',
            
            // signup.html
            'signup.welcome.title': '会員登録',
            'signup.welcome.subtitle': 'AX2と一緒に言語の壁を越えてください',
            'signup.google.btn': 'Googleで登録',
            'signup.kakao.btn': 'カカオトークで登録',
            'signup.naver.btn': 'ネイバーで登録',
            
            // used.html
            'used.title': '使用方法',
            'used.subtitle': '簡単かつ迅速にリアルタイム翻訳を開始',
            'used.guide.badge': 'ユーザーガイド',
            'used.main.title': '簡単かつ迅速',
            'used.main.subtitle': 'リアルタイム翻訳を開始',
            'used.main.desc': '複雑な設定なしで言語を選択するだけで、リアルタイムで音声を認識して翻訳します。',
            'used.cta.start': '無料で始める',
            'used.scroll.hint': 'スクロールして使用方法を確認',
            'used.stats.languages': 'サポート言語',
            'used.stats.accuracy': '翻訳精度',
            'used.stats.realtime': '即時翻訳',
            'used.step1.title': '言語設定',
            'used.step1.desc': '元の言語と翻訳する言語を選択',
            'used.step2.title': '翻訳開始',
            'used.step2.desc': 'マイク入力を開始してリアルタイム翻訳を進行',
            'used.step3.title': '翻訳確認と保存',
            'used.step3.desc': 'リアルタイム翻訳結果を確認して保存'
        },
        zh: {
            // 导航
            'nav.subtitle': '实时翻译',
            'nav.pricing': '价格/支付',
            'nav.guide': '使用指南',
            'nav.login': '登录',
            'nav.signup': '注册',
            'nav.logout': '退出',
            'nav.mywork': '我的工作',
            'nav.remaining': '分钟剩余',
            
            // 更多菜单
            'menu.products': '其他产品',
            'menu.subtitle_gen': '字幕生成',
            'menu.subtitle_desc': '视频字幕自动生成',
            'menu.lecture': '实时翻译',
            'menu.lecture_desc': '实时翻译和字幕',
            'menu.price': '价格',
            'menu.security': '安全',
            'menu.features': '功能',
            'menu.about': '关于我们',
            'menu.help': '帮助',
            'menu.language': '语言',
            'menu.faq': '常见问题',
            'menu.tools': '工具',
            'menu.legal': '法律',
            'menu.privacy': '隐私',
            'menu.contact': '联系我们',
            
            // 主页
            'main.title': '实时语言翻译',
            'main.subtitle': '实时识别语音并翻译成多种语言。',
            'main.dropzone': '拖放文件或点击上传',
            'main.supported': '支持格式: MP4, AVI, MOV, MKV (最大500MB)',
            
            // 下拉菜单
            'dropdown.edit': '编辑资料',
            'dropdown.password': '修改密码',
            'dropdown.payment': '支付信息',
            
            // 通用
            'common.free': '免费',
            'common.student': '学生',
            'common.general': '普通',
            'common.pro': '专业',
            
            // index.html
            'index.title': '实时语言翻译',
            'index.subtitle': '实时识别语音并翻译成多种语言。',
            'index.dropzone': '拖放文件或点击上传',
            'index.fileinfo': 'MP4, MOV, AVI (最大2GB)',
            'index.settings': '翻译设置',
            'index.original': '原始语言',
            'index.target': '目标语言',
            'index.autodetect': '自动检测',
            'index.generate': '开始实时翻译',
            
            // guide.html
            'guide.title': '使用指南',
            'guide.subtitle.title': '实时翻译',
            'guide.step1.title': '语言设置',
            'guide.step1.desc': '选择原始语言和目标语言（最多3种）。',
            'guide.step2.title': '开始翻译',
            'guide.step2.desc': '点击开始按钮以开始麦克风输入。',
            'guide.step3.title': '实时翻译',
            'guide.step3.desc': 'AI将自动识别语音并实时翻译。',
            
            // mypage.html
            'mypage.title': '我的页面',
            'mypage.profile': '编辑资料',
            'mypage.password': '修改密码',
            'mypage.payment': '支付信息',
            'mypage.withdraw': '注销账户',
            'mypage.nickname': '昵称',
            'mypage.email': '邮箱',
            'mypage.save': '保存',
            'mypage.current_pw': '当前密码',
            'mypage.new_pw': '新密码',
            'mypage.confirm_pw': '确认密码',
            'mypage.change': '修改',
            
            // storage.html
            'storage.title': '我的工作',
            'storage.new': '新建',
            'storage.total': '全部任务',
            'storage.completed': '已完成',
            'storage.video_time': '总视频时长',
            'storage.monthly': '本月',
            'storage.space': '存储空间',
            'storage.used': '已使用',
            
            // pricing.html
            'pricing.title': '价格方案',
            'pricing.free': '免费',
            'pricing.student': '学生',
            'pricing.general': '普通',
            'pricing.pro': '专业',
            'pricing.subscribe': '订阅',
            'pricing.current': '当前方案',
            
            // faq.html
            'faq.title': '常见问题',
            'faq.subtitle': '查看关于AX2服务的常见问题和答案。',
            'faq.search.placeholder': '搜索问题...',
            'faq.category.all': '全部',
            'faq.category.general': '一般',
            'faq.category.payment': '支付',
            'faq.category.refund': '退款',
            'faq.category.error': '错误',
            'faq.empty.title': '没有搜索结果',
            'faq.empty.desc': '请尝试其他搜索词。',
            
            // tools.html
            'tools.title': '工具',
            'tools.subtitle': '查看AX2实时语言翻译服务的各种工具和实用程序。',
            
            // legal.html
            'legal.title': '法律',
            'legal.subtitle': '查看AX2服务条款和法律通知。',
            
            // privacy.html
            'privacy.title': '隐私',
            'privacy.subtitle': 'AX2重视您的个人信息，并透明安全地管理。',
            
            // contact.html
            'contact.title': '联系我们',
            'contact.subtitle': '请留下您对AX2实时语言翻译服务的咨询。',
            
            // features.html
            'features.title': '功能',
            'features.subtitle': '查看AX2的各种功能。我们提供强大的功能，如实时语音识别、多语言翻译和实时翻译会话存储和管理。',
            
            // security.html
            'security.title': '安全',
            'security.subtitle': '查看AX2的安全政策和个人信息保护措施。',
            
            // login.html
            'login.welcome.title': '欢迎来到AX2',
            'login.welcome.subtitle': '一键超越语言',
            'login.google.btn': '使用Google开始',
            'login.kakao.btn': '使用KakaoTalk开始',
            'login.naver.btn': '使用Naver开始',
            'login.main.headline': '创建、翻译、交流',
            'login.sub.headline': '一键突破语言障碍',
            'login.tagline': '高质量视频，无需拍摄 - 只需简单点击即可复制和翻译。',
            'login.feature1': '实时语音识别和翻译',
            'login.feature2': '自动生成多语言字幕',
            'login.feature3': '讲座自动保存和管理',
            'login.feature4': '轻松分享和下载',
            
            // signup.html
            'signup.welcome.title': '注册',
            'signup.welcome.subtitle': '与AX2一起超越语言障碍',
            'signup.google.btn': '使用Google注册',
            'signup.kakao.btn': '使用KakaoTalk注册',
            'signup.naver.btn': '使用Naver注册',
            
            // used.html
            'used.title': '使用方法',
            'used.subtitle': '轻松快速地开始实时翻译',
            'used.guide.badge': '用户指南',
            'used.main.title': '轻松快速',
            'used.main.subtitle': '开始实时翻译',
            'used.main.desc': '只需选择语言，无需复杂设置，即可实时识别和翻译语音。',
            'used.cta.start': '免费开始',
            'used.scroll.hint': '滚动查看使用方法',
            'used.stats.languages': '支持语言',
            'used.stats.accuracy': '翻译准确度',
            'used.stats.realtime': '即时翻译',
            'used.step1.title': '语言设置',
            'used.step1.desc': '选择原始语言和要翻译的语言',
            'used.step2.title': '开始翻译',
            'used.step2.desc': '开始麦克风输入以进行实时翻译',
            'used.step3.title': '确认并保存翻译',
            'used.step3.desc': '查看实时翻译结果并保存'
        },
        es: {
            // Navigation
            'nav.subtitle': 'Traducción en tiempo real',
            'nav.pricing': 'Precios',
            'nav.guide': 'Guía',
            'nav.login': 'Iniciar sesión',
            'nav.signup': 'Registrarse',
            'nav.logout': 'Cerrar sesión',
            'nav.mywork': 'Mi trabajo',
            'nav.remaining': 'min restantes',
            
            // More menu
            'menu.products': 'Otros productos',
            'menu.subtitle_gen': 'Generación de subtítulos',
            'menu.subtitle_desc': 'Generación automática de subtítulos de video',
            'menu.lecture': 'Traducción en tiempo real',
            'menu.lecture_desc': 'Traducción en vivo y subtítulos',
            'menu.price': 'Precios',
            'menu.security': 'Seguridad',
            'menu.features': 'Características',
            'menu.about': 'Acerca de',
            'menu.help': 'Ayuda',
            'menu.language': 'Idioma',
            'menu.faq': 'Preguntas frecuentes',
            'menu.tools': 'Herramientas',
            'menu.legal': 'Legal',
            'menu.privacy': 'Privacidad',
            'menu.contact': 'Contacto',
            
            // Main page
            'main.title': 'Traducción de idiomas en tiempo real',
            'main.subtitle': 'Reconoce el habla en tiempo real y traduce a múltiples idiomas.',
            'main.dropzone': 'Arrastra archivos aquí o haz clic para subir',
            'main.supported': 'Soportado: MP4, AVI, MOV, MKV (Máx. 500MB)',
            
            // Dropdown menu
            'dropdown.edit': 'Editar perfil',
            'dropdown.password': 'Cambiar contraseña',
            'dropdown.payment': 'Información de pago',
            
            // Common
            'common.free': 'Gratis',
            'common.student': 'Estudiante',
            'common.general': 'Estándar',
            'common.pro': 'Pro',
            
            // index.html
            'index.title': 'Traducción de idiomas en tiempo real',
            'index.subtitle': 'Reconoce el habla en tiempo real y traduce a múltiples idiomas.',
            'index.dropzone': 'Arrastra archivos aquí o haz clic para subir',
            'index.fileinfo': 'MP4, MOV, AVI (Máx. 2GB)',
            'index.settings': 'Configuración de traducción',
            'index.original': 'Idioma original',
            'index.target': 'Idioma objetivo',
            'index.autodetect': 'Detección automática',
            'index.generate': 'Iniciar traducción en tiempo real',
            
            // guide.html
            'guide.title': 'Guía de usuario',
            'guide.subtitle.title': 'Traducción en tiempo real',
            'guide.step1.title': 'Configuración de idioma',
            'guide.step1.desc': 'Selecciona el idioma original y los idiomas objetivo (hasta 3).',
            'guide.step2.title': 'Iniciar traducción',
            'guide.step2.desc': 'Haz clic en el botón de inicio para comenzar la entrada del micrófono.',
            'guide.step3.title': 'Traducción en tiempo real',
            'guide.step3.desc': 'La IA reconocerá automáticamente el habla y traducirá en tiempo real.',
            
            // mypage.html
            'mypage.title': 'Mi página',
            'mypage.profile': 'Editar perfil',
            'mypage.password': 'Cambiar contraseña',
            'mypage.payment': 'Información de pago',
            'mypage.withdraw': 'Eliminar cuenta',
            'mypage.nickname': 'Apodo',
            'mypage.email': 'Correo electrónico',
            'mypage.save': 'Guardar',
            'mypage.current_pw': 'Contraseña actual',
            'mypage.new_pw': 'Nueva contraseña',
            'mypage.confirm_pw': 'Confirmar contraseña',
            'mypage.change': 'Cambiar',
            
            // storage.html
            'storage.title': 'Mi trabajo',
            'storage.new': 'Comenzar nuevo',
            'storage.total': 'Tareas totales',
            'storage.completed': 'Completado',
            'storage.video_time': 'Tiempo total de video',
            'storage.monthly': 'Este mes',
            'storage.space': 'Almacenamiento',
            'storage.used': 'Usado',
            
            // pricing.html
            'pricing.title': 'Precios',
            'pricing.free': 'Gratis',
            'pricing.student': 'Estudiante',
            'pricing.general': 'Estándar',
            'pricing.pro': 'Pro',
            'pricing.subscribe': 'Suscribirse',
            'pricing.current': 'Plan actual',
            
            // faq.html
            'faq.title': 'Preguntas frecuentes',
            'faq.subtitle': 'Consulte las preguntas y respuestas frecuentes sobre el servicio AX2.',
            'faq.search.placeholder': 'Buscar preguntas...',
            'faq.category.all': 'Todas',
            'faq.category.general': 'General',
            'faq.category.payment': 'Pago',
            'faq.category.refund': 'Reembolso',
            'faq.category.error': 'Error',
            'faq.empty.title': 'No hay resultados de búsqueda',
            'faq.empty.desc': 'Por favor, pruebe con otro término de búsqueda.',
            
            // tools.html
            'tools.title': 'Herramientas',
            'tools.subtitle': 'Consulte varias herramientas y utilidades para el servicio de traducción de idiomas en tiempo real AX2.',
            
            // legal.html
            'legal.title': 'Legal',
            'legal.subtitle': 'Consulte los términos de servicio y avisos legales de AX2.',
            
            // privacy.html
            'privacy.title': 'Privacidad',
            'privacy.subtitle': 'AX2 valora su información personal y la gestiona de manera transparente y segura.',
            
            // contact.html
            'contact.title': 'Contacto',
            'contact.subtitle': 'Por favor, deje sus consultas sobre el servicio de traducción de idiomas en tiempo real AX2.',
            
            // features.html
            'features.title': 'Características',
            'features.subtitle': 'Consulte las diversas características de AX2. Proporcionamos características poderosas como reconocimiento de voz en tiempo real, traducción multilingüe y almacenamiento y gestión de sesiones de traducción en tiempo real.',
            
            // security.html
            'security.title': 'Seguridad',
            'security.subtitle': 'Consulte las políticas de seguridad y las medidas de protección de información personal de AX2.',
            
            // login.html
            'login.welcome.title': 'Bienvenido a AX2',
            'login.welcome.subtitle': 'Vaya más allá del idioma con un clic',
            'login.google.btn': 'Comenzar con Google',
            'login.kakao.btn': 'Comenzar con KakaoTalk',
            'login.naver.btn': 'Comenzar con Naver',
            'login.main.headline': 'Crear, traducir, comunicar',
            'login.sub.headline': 'Rompa las barreras del idioma con un clic',
            'login.tagline': 'Videos de alta calidad, sin necesidad de filmar - copie y traduzca con un simple clic.',
            'login.feature1': 'Reconocimiento y traducción de voz en tiempo real',
            'login.feature2': 'Generación automática de subtítulos multilingües',
            'login.feature3': 'Almacenamiento y gestión automática de conferencias',
            'login.feature4': 'Compartir y descargar fácilmente',
            
            // signup.html
            'signup.welcome.title': 'Registrarse',
            'signup.welcome.subtitle': 'Vaya más allá de las barreras del idioma con AX2',
            'signup.google.btn': 'Registrarse con Google',
            'signup.kakao.btn': 'Registrarse con KakaoTalk',
            'signup.naver.btn': 'Registrarse con Naver',
            
            // used.html
            'used.title': 'Cómo usar',
            'used.subtitle': 'Comience la traducción en tiempo real de manera fácil y rápida',
            'used.guide.badge': 'Guía del usuario',
            'used.main.title': 'Fácil y rápido',
            'used.main.subtitle': 'Comience la traducción en tiempo real',
            'used.main.desc': 'Reconozca y traduzca el habla en tiempo real simplemente seleccionando un idioma sin configuraciones complicadas.',
            'used.cta.start': 'Comenzar gratis',
            'used.scroll.hint': 'Desplácese para ver cómo usar',
            'used.stats.languages': 'Idiomas soportados',
            'used.stats.accuracy': 'Precisión de traducción',
            'used.stats.realtime': 'Traducción instantánea',
            'used.step1.title': 'Configuración de idioma',
            'used.step1.desc': 'Seleccione el idioma original y los idiomas para traducir',
            'used.step2.title': 'Iniciar traducción',
            'used.step2.desc': 'Inicie la entrada del micrófono para proceder con la traducción en tiempo real',
            'used.step3.title': 'Verificar y guardar traducción',
            'used.step3.desc': 'Verifique los resultados de traducción en tiempo real y guárdelos'
        },
        fr: {
            // Navigation
            'nav.subtitle': 'Traduction en temps réel',
            'nav.pricing': 'Tarifs',
            'nav.guide': 'Guide',
            'nav.login': 'Connexion',
            'nav.signup': 'S\'inscrire',
            'nav.logout': 'Déconnexion',
            'nav.mywork': 'Mon travail',
            'nav.remaining': 'min restantes',
            
            // More menu
            'menu.products': 'Autres produits',
            'menu.subtitle_gen': 'Génération de sous-titres',
            'menu.subtitle_desc': 'Génération automatique de sous-titres vidéo',
            'menu.lecture': 'Traduction en temps réel',
            'menu.lecture_desc': 'Traduction en direct et sous-titres',
            'menu.price': 'Tarifs',
            'menu.security': 'Sécurité',
            'menu.features': 'Fonctionnalités',
            'menu.about': 'À propos',
            'menu.help': 'Aide',
            'menu.language': 'Langue',
            'menu.faq': 'Questions fréquentes',
            'menu.tools': 'Outils',
            'menu.legal': 'Légal',
            'menu.privacy': 'Confidentialité',
            'menu.contact': 'Contact',
            
            // Main page
            'main.title': 'Traduction de langues en temps réel',
            'main.subtitle': 'Reconnaît la parole en temps réel et traduit en plusieurs langues.',
            'main.dropzone': 'Glissez les fichiers ici ou cliquez pour télécharger',
            'main.supported': 'Supporté: MP4, AVI, MOV, MKV (Max 500MB)',
            
            // Dropdown menu
            'dropdown.edit': 'Modifier le profil',
            'dropdown.password': 'Changer le mot de passe',
            'dropdown.payment': 'Informations de paiement',
            
            // Common
            'common.free': 'Gratuit',
            'common.student': 'Étudiant',
            'common.general': 'Standard',
            'common.pro': 'Pro',
            
            // index.html
            'index.title': 'Traduction de langues en temps réel',
            'index.subtitle': 'Reconnaît la parole en temps réel et traduit en plusieurs langues.',
            'index.dropzone': 'Glissez les fichiers ici ou cliquez pour télécharger',
            'index.fileinfo': 'MP4, MOV, AVI (Max 2GB)',
            'index.settings': 'Paramètres de traduction',
            'index.original': 'Langue originale',
            'index.target': 'Langue cible',
            'index.autodetect': 'Détection automatique',
            'index.generate': 'Démarrer la traduction en temps réel',
            
            // guide.html
            'guide.title': 'Guide de l\'utilisateur',
            'guide.subtitle.title': 'Traduction en temps réel',
            'guide.step1.title': 'Paramètres de langue',
            'guide.step1.desc': 'Sélectionnez la langue originale et les langues cibles (jusqu\'à 3).',
            'guide.step2.title': 'Démarrer la traduction',
            'guide.step2.desc': 'Cliquez sur le bouton de démarrage pour commencer la saisie du microphone.',
            'guide.step3.title': 'Traduction en temps réel',
            'guide.step3.desc': 'L\'IA reconnaîtra automatiquement la parole et traduira en temps réel.',
            
            // mypage.html
            'mypage.title': 'Ma page',
            'mypage.profile': 'Modifier le profil',
            'mypage.password': 'Changer le mot de passe',
            'mypage.payment': 'Informations de paiement',
            'mypage.withdraw': 'Supprimer le compte',
            'mypage.nickname': 'Pseudonyme',
            'mypage.email': 'E-mail',
            'mypage.save': 'Enregistrer',
            'mypage.current_pw': 'Mot de passe actuel',
            'mypage.new_pw': 'Nouveau mot de passe',
            'mypage.confirm_pw': 'Confirmer le mot de passe',
            'mypage.change': 'Changer',
            
            // storage.html
            'storage.title': 'Mon travail',
            'storage.new': 'Commencer nouveau',
            'storage.total': 'Tâches totales',
            'storage.completed': 'Terminé',
            'storage.video_time': 'Temps total de vidéo',
            'storage.monthly': 'Ce mois',
            'storage.space': 'Stockage',
            'storage.used': 'Utilisé',
            
            // pricing.html
            'pricing.title': 'Tarifs',
            'pricing.free': 'Gratuit',
            'pricing.student': 'Étudiant',
            'pricing.general': 'Standard',
            'pricing.pro': 'Pro',
            'pricing.subscribe': 'S\'abonner',
            'pricing.current': 'Plan actuel',
            
            // faq.html
            'faq.title': 'Questions fréquentes',
            'faq.subtitle': 'Consultez les questions et réponses fréquentes sur le service AX2.',
            'faq.search.placeholder': 'Rechercher des questions...',
            'faq.category.all': 'Tout',
            'faq.category.general': 'Général',
            'faq.category.payment': 'Paiement',
            'faq.category.refund': 'Remboursement',
            'faq.category.error': 'Erreur',
            'faq.empty.title': 'Aucun résultat de recherche',
            'faq.empty.desc': 'Veuillez essayer un autre terme de recherche.',
            
            // tools.html
            'tools.title': 'Outils',
            'tools.subtitle': 'Découvrez divers outils et utilitaires pour le service de traduction de langues en temps réel AX2.',
            
            // legal.html
            'legal.title': 'Légal',
            'legal.subtitle': 'Consultez les conditions de service et les avis légaux d\'AX2.',
            
            // privacy.html
            'privacy.title': 'Confidentialité',
            'privacy.subtitle': 'AX2 valorise vos informations personnelles et les gère de manière transparente et sécurisée.',
            
            // contact.html
            'contact.title': 'Contact',
            'contact.subtitle': 'Veuillez laisser vos questions sur le service de traduction de langues en temps réel AX2.',
            
            // features.html
            'features.title': 'Fonctionnalités',
            'features.subtitle': 'Découvrez les diverses fonctionnalités d\'AX2. Nous fournissons des fonctionnalités puissantes telles que la reconnaissance vocale en temps réel, la traduction multilingue et le stockage et la gestion de sessions de traduction en temps réel.',
            
            // security.html
            'security.title': 'Sécurité',
            'security.subtitle': 'Consultez les politiques de sécurité et les mesures de protection des informations personnelles d\'AX2.',
            
            // login.html
            'login.welcome.title': 'Bienvenue sur AX2',
            'login.welcome.subtitle': 'Allez au-delà de la langue en un clic',
            'login.google.btn': 'Commencer avec Google',
            'login.kakao.btn': 'Commencer avec KakaoTalk',
            'login.naver.btn': 'Commencer avec Naver',
            'login.main.headline': 'Créer, traduire, communiquer',
            'login.sub.headline': 'Franchissez les barrières linguistiques en un clic',
            'login.tagline': 'Vidéos de haute qualité, pas besoin de filmer - copiez et traduisez en un simple clic.',
            'login.feature1': 'Reconnaissance et traduction vocale en temps réel',
            'login.feature2': 'Génération automatique de sous-titres multilingues',
            'login.feature3': 'Stockage et gestion automatiques des conférences',
            'login.feature4': 'Partage et téléchargement faciles',
            
            // signup.html
            'signup.welcome.title': 'S\'inscrire',
            'signup.welcome.subtitle': 'Allez au-delà des barrières linguistiques avec AX2',
            'signup.google.btn': 'S\'inscrire avec Google',
            'signup.kakao.btn': 'S\'inscrire avec KakaoTalk',
            'signup.naver.btn': 'S\'inscrire avec Naver',
            
            // used.html
            'used.title': 'Comment utiliser',
            'used.subtitle': 'Commencez la traduction en temps réel facilement et rapidement',
            'used.guide.badge': 'Guide de l\'utilisateur',
            'used.main.title': 'Facile et rapide',
            'used.main.subtitle': 'Commencez la traduction en temps réel',
            'used.main.desc': 'Reconnaissez et traduisez la parole en temps réel en sélectionnant simplement une langue sans configurations compliquées.',
            'used.cta.start': 'Commencer gratuitement',
            'used.scroll.hint': 'Faites défiler pour voir comment utiliser',
            'used.stats.languages': 'Langues prises en charge',
            'used.stats.accuracy': 'Précision de traduction',
            'used.stats.realtime': 'Traduction instantanée',
            'used.step1.title': 'Paramètres de langue',
            'used.step1.desc': 'Sélectionnez la langue originale et les langues à traduire',
            'used.step2.title': 'Démarrer la traduction',
            'used.step2.desc': 'Démarrez l\'entrée du microphone pour procéder à la traduction en temps réel',
            'used.step3.title': 'Vérifier et enregistrer la traduction',
            'used.step3.desc': 'Vérifiez les résultats de traduction en temps réel et enregistrez-les'
        }
    };

    // 현재 언어 가져오기
    function getCurrentLanguage() {
        return localStorage.getItem('siteLanguage') || 'ko';
    }

    // 번역 텍스트 가져오기
    function t(key) {
        const lang = getCurrentLanguage();
        return translations[lang]?.[key] || translations['ko'][key] || key;
    }

    // 페이지 텍스트 업데이트
    function updatePageLanguage() {
        const lang = getCurrentLanguage();
        const trans = translations[lang];
        if (!trans) return;
        
        // data-i18n 속성이 있는 모든 요소 업데이트
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) {
                el.textContent = trans[key];
            }
        });
        
        // data-i18n-placeholder 속성이 있는 모든 요소 업데이트
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (trans[key]) {
                el.placeholder = trans[key];
            }
        });

        // 네비게이션 바 업데이트 (동적으로 생성된 요소)
        updateNavBarLanguage(lang);
        
        // 현재 페이지에 따른 텍스트 업데이트
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        updateCurrentPageLanguage(lang, currentPage);
        
        // HTML lang 속성 업데이트
        document.documentElement.lang = lang;
        
        // 언어 변경 이벤트 발생
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
    
    // 현재 페이지 텍스트 업데이트
    function updateCurrentPageLanguage(lang, page) {
        const trans = translations[lang];
        if (!trans) return;
        
        // index.html
        if (page === 'index.html' || page === '') {
            const title = document.querySelector('.upload-title');
            const subtitle = document.querySelector('.upload-subtitle');
            const dropzone = document.querySelector('.drop-zone-text');
            const fileinfo = document.querySelector('.drop-zone-file-info');
            const settings = document.querySelector('.panel-title');
            const originalLabel = document.querySelector('.setting-label');
            
            if (title) title.textContent = trans['index.title'];
            if (subtitle) subtitle.textContent = trans['index.subtitle'];
            if (dropzone) dropzone.textContent = trans['index.dropzone'];
            if (fileinfo) fileinfo.textContent = trans['index.fileinfo'];
        }
        
        // mypage.html
        if (page === 'mypage.html') {
            // 탭 버튼들
            const tabs = document.querySelectorAll('.tab-btn');
            if (tabs[0]) tabs[0].textContent = trans['mypage.profile'];
            if (tabs[1]) tabs[1].textContent = trans['mypage.password'];
            if (tabs[2]) tabs[2].textContent = trans['mypage.payment'];
            if (tabs[3]) tabs[3].textContent = trans['mypage.withdraw'];
            
            // 섹션 타이틀
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach((title, index) => {
                if (index === 0) title.textContent = trans['mypage.profile'];
                if (index === 1) title.textContent = trans['mypage.password'];
            });
            
            // 폼 라벨
            const labels = document.querySelectorAll('.form-label');
            if (labels[0]) labels[0].textContent = trans['mypage.nickname'];
            if (labels[1]) labels[1].textContent = trans['mypage.email'];
            
            // 버튼
            const saveBtn = document.querySelector('.submit-btn');
            if (saveBtn && saveBtn.textContent.includes('저장') || saveBtn?.textContent.includes('Save')) {
                saveBtn.textContent = trans['mypage.save'];
            }
            
            // 비밀번호 입력 필드 placeholder
            const currentPw = document.getElementById('current-password');
            const newPw = document.getElementById('new-password');
            const confirmPw = document.getElementById('confirm-password');
            if (currentPw) currentPw.placeholder = trans['mypage.current_pw'];
            if (newPw) newPw.placeholder = trans['mypage.new_pw'];
            if (confirmPw) confirmPw.placeholder = trans['mypage.confirm_pw'];
        }
        
        // storage.html
        if (page === 'storage.html') {
            const title = document.querySelector('.page-title');
            if (title) title.textContent = trans['storage.title'];
            
            const newBtn = document.querySelector('.new-task-btn');
            if (newBtn) {
                const icon = newBtn.querySelector('i');
                newBtn.innerHTML = '';
                if (icon) newBtn.appendChild(icon);
                newBtn.appendChild(document.createTextNode(' ' + trans['storage.new']));
            }
            
            const statLabels = document.querySelectorAll('.stat-label');
            if (statLabels[0]) statLabels[0].textContent = trans['storage.total'];
            if (statLabels[1]) statLabels[1].textContent = trans['storage.completed'];
            if (statLabels[2]) statLabels[2].textContent = trans['storage.video_time'];
            if (statLabels[3]) statLabels[3].textContent = trans['storage.monthly'];
            
            const storageTitle = document.querySelector('.storage-title');
            if (storageTitle) storageTitle.textContent = trans['storage.space'];
        }
        
        // pricing.html
        if (page === 'pricing.html') {
            const planNames = document.querySelectorAll('.plan-name');
            if (planNames[0]) planNames[0].textContent = trans['pricing.free'];
            if (planNames[1]) planNames[1].textContent = trans['pricing.student'];
            if (planNames[2]) planNames[2].textContent = trans['pricing.general'];
            if (planNames[3]) planNames[3].textContent = trans['pricing.pro'];
        }
    }

    // 네비게이션 바 언어 업데이트
    function updateNavBarLanguage(lang) {
        const trans = translations[lang];
        if (!trans) return;

        // 서비스 탭
        const serviceTabs = document.querySelectorAll('.service-tab span');
        if (serviceTabs[0]) serviceTabs[0].textContent = trans['nav.subtitle'];
        if (serviceTabs[1]) serviceTabs[1].textContent = trans['nav.pricing'];
        if (serviceTabs[2]) serviceTabs[2].textContent = trans['nav.guide'];

        // 로그인/가입 버튼
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        if (loginBtn && !loginBtn.style.display !== 'none') {
            if (loginBtn.textContent === '로그인' || loginBtn.textContent === 'Login' || 
                loginBtn.textContent === 'ログイン' || loginBtn.textContent === '登录') {
                loginBtn.textContent = trans['nav.login'];
            }
        }
        if (signupBtn && signupBtn.style.display !== 'none') {
            signupBtn.textContent = trans['nav.signup'];
        }

        // 나의 작업 버튼
        const myWorkLink = document.querySelector('.my-work-link');
        if (myWorkLink) myWorkLink.textContent = trans['nav.mywork'];

        // 메가 메뉴
        const sectionTitle = document.querySelector('.mega-menu-section-title');
        if (sectionTitle) sectionTitle.textContent = trans['menu.products'];

        const menuItems = document.querySelectorAll('.mega-menu-item');
        if (menuItems[0]) {
            const title0 = menuItems[0].querySelector('.mega-menu-item-title');
            const desc0 = menuItems[0].querySelector('.mega-menu-item-desc');
            if (title0) title0.textContent = trans['menu.subtitle_gen'];
            if (desc0) desc0.textContent = trans['menu.subtitle_desc'];
        }
        if (menuItems[1]) {
            const title1 = menuItems[1].querySelector('.mega-menu-item-title');
            const desc1 = menuItems[1].querySelector('.mega-menu-item-desc');
            if (title1) title1.textContent = trans['menu.lecture'];
            if (desc1) desc1.textContent = trans['menu.lecture_desc'];
        }

        // 링크 메뉴 (a 태그들)
        const menuLinksA = document.querySelectorAll('.mega-menu-links > a.mega-menu-link span');
        if (menuLinksA[0]) menuLinksA[0].textContent = trans['menu.price'];
        if (menuLinksA[1]) menuLinksA[1].textContent = trans['menu.security'];
        if (menuLinksA[2]) menuLinksA[2].textContent = trans['menu.features'];
        if (menuLinksA[3]) menuLinksA[3].textContent = trans['menu.about'];

        // 도움, 언어 버튼
        const helpBtn = document.getElementById('helpMenuBtn');
        const langBtn = document.getElementById('languageMenuBtn');
        if (helpBtn) {
            const helpSpan = helpBtn.querySelector('span');
            if (helpSpan) helpSpan.textContent = trans['menu.help'];
        }
        if (langBtn) {
            const langSpan = langBtn.querySelector('span');
            if (langSpan) langSpan.textContent = trans['menu.language'];
        }

        // 도움 서브메뉴
        const helpSubmenu = document.getElementById('helpSubmenu');
        if (helpSubmenu) {
            const helpItems = helpSubmenu.querySelectorAll('.mega-submenu-item span');
            if (helpItems[0]) helpItems[0].textContent = trans['menu.faq'];
            if (helpItems[1]) helpItems[1].textContent = trans['menu.tools'];
            if (helpItems[2]) helpItems[2].textContent = trans['menu.legal'];
            if (helpItems[3]) helpItems[3].textContent = trans['menu.privacy'];
            if (helpItems[4]) helpItems[4].textContent = trans['menu.contact'];
        }
        
        // 사용자 드롭다운 메뉴
        const dropdownItems = document.querySelectorAll('.user-dropdown-item span');
        if (dropdownItems[0]) dropdownItems[0].textContent = trans['dropdown.edit'];
        if (dropdownItems[1]) dropdownItems[1].textContent = trans['dropdown.password'];
        if (dropdownItems[2]) dropdownItems[2].textContent = trans['dropdown.payment'];
    }

    // 언어 변경
    function setLanguage(lang) {
        if (!translations[lang]) {
            console.warn('Unsupported language:', lang);
            return;
        }
        
        localStorage.setItem('siteLanguage', lang);
        updatePageLanguage();
        
        // 언어 선택 UI 업데이트 (체크 표시)
        document.querySelectorAll('#languageSubmenu .language-option').forEach(opt => {
            const check = opt.querySelector('.fa-check');
            if (check) {
                check.style.visibility = opt.dataset.lang === lang ? 'visible' : 'hidden';
            }
        });
    }

    // 초기화
    function init() {
        // 페이지 로드 시 저장된 언어 적용
        const currentLang = getCurrentLanguage();
        updatePageLanguage();
        
        // 체크 표시 초기화
        setTimeout(function() {
            document.querySelectorAll('#languageSubmenu .language-option').forEach(opt => {
                const check = opt.querySelector('.fa-check');
                if (check) {
                    check.style.visibility = opt.dataset.lang === currentLang ? 'visible' : 'hidden';
                }
            });
        }, 100);
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // navBarLoaded 이벤트 수신
    document.addEventListener('navBarLoaded', function() {
        const currentLang = getCurrentLanguage();
        setTimeout(function() {
            updatePageLanguage();
            // 체크 표시 업데이트
            document.querySelectorAll('#languageSubmenu .language-option').forEach(opt => {
                const check = opt.querySelector('.fa-check');
                if (check) {
                    check.style.visibility = opt.dataset.lang === currentLang ? 'visible' : 'hidden';
                }
            });
        }, 50);
    });

    // 전역으로 내보내기
    window.i18n = {
        t: t,
        setLanguage: setLanguage,
        getCurrentLanguage: getCurrentLanguage,
        updatePageLanguage: updatePageLanguage
    };

})();

