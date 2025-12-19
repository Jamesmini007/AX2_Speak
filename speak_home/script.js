// 번역 데이터
const translations = {
    ko: {
        nav: {
            realtime: "실시간 번역",
            languages: "언어 지원",
            pricing: "가격정책",
            enterprise: "기업 솔루션",
            start: "지금 시작하기"
        },
        hero: {
            title: "실시간 강의 번역의 새로운 기준,<br><span class=\"highlight\">AX2</span>",
            description: "AI 기반 실시간 번역으로 언어의 장벽을 넘어서세요. 강의를 듣는 순간, 실시간으로 정확한 번역과 자막을 제공하여 글로벌 교육 환경을 만들어갑니다.",
            startFree: "무료로 시작하기",
            requestDemo: "데모 신청하기"
        },
        features: {
            title: "혁신적인 번역 기술",
            subtitle: "다음 시대의 교육 플랫폼",
            realtime: {
                title: "실시간 번역,<br>지연 없는 학습",
                description: "강의가 진행되는 동시에 실시간으로 번역과 자막을 제공합니다. AX2는 강의 시간, 언어, 번역 품질에 제한을 두지 않습니다. 원하는 만큼 많은 강의를 번역하고 무제한으로 학습 데이터를 수집할 수 있습니다. 유연한 번역 환경은 더 많은 가능성과 학습 효과로 이어집니다."
            },
            multilang: {
                title: "50+개 언어 지원으로<br>글로벌 교육의 한계를 넘다",
                description: "50가지 이상의 언어를 실시간으로 번역하여, 어떤 언어의 강의든 자유롭게 학습할 수 있습니다.",
                feature1: "영어, 중국어, 일본어, 스페인어 등 주요 언어 지원",
                feature2: "전문 용어 사전 및 컨텍스트 인식 번역"
            },
            api: {
                title: "API 연동 및 통합",
                description: "다양한 플랫폼과 쉽게 통합할 수 있는 RESTful API를 제공합니다. 기존 교육 시스템과 원활하게 연동하여 실시간 번역 기능을 빠르게 도입할 수 있습니다.",
                feature1: "다양한 플랫폼과 쉽게 통합",
                feature2: "RESTful API로 원활한 연동"
            }
        },
        form: {
            title: "업무용 컴퓨터에서도,<br>이동 중 스마트폰에서도",
            subtitle: "부드럽게 작동하는 번역 인터페이스",
            description: "언제 어디서나, 어떤 기기에서든 실시간 번역을 경험하세요. 기기에 맞춰 자동으로 레이아웃이 조정되어 접근성과 학습 효율을 높이고, 더 나은 교육 경험을 제공합니다.",
            panel1: "기기 상관없이 최적화된 번역 경험",
            panel2: "강의 종료 후 복습까지 매끄럽게 이어지도록"
        },
        analysis: {
            title: "실시간으로 번역 품질을 분석하고,<br>학습 효과를 최적화하세요",
            description: "번역 품질과 학습 데이터를 실시간으로 분석하고, 숨어 있는 패턴과 의미 있는 인사이트를 빠르게 파악할 수 있습니다."
        },
        security: {
            title: "보안",
            subtitle: "데이터 보호 및 프라이버시",
            item1: {
                title: "민감한 정보를 숨기고 필요한 것만 표시",
                description: "주민등록번호나 연락처 같은 민감한 정보는 자동으로 마스킹되어 보안이 유지됩니다. 기밀 정보를 안전하게 수집하고 관리할 수 있습니다."
            },
            item2: {
                title: "세밀한 권한 관리로 안전한 접근 제어",
                description: "사용자와 프로젝트별로 세밀한 접근 권한을 설정할 수 있습니다. 중요한 번역 작업은 권한이 있는 사용자만 접근할 수 있으며, 모든 접근 기록이 추적됩니다."
            },
            item3: {
                title: "로그 기록으로 보안과 투명성 향상",
                description: "모든 중요한 작업이 기록되며, 데이터 마스킹 해제 같은 강한 변경은 사유가 필요합니다. 접근권한을 명확하게 추적하고 관리할 수 있는 환경을 제공합니다."
            },
            item4: {
                title: "안전한 API 통신으로 데이터 보호",
                description: "모든 API 요청은 인증 토큰으로 보호되며, 요청 및 속도 제한을 통해 무단 접근을 방지합니다. API 키 관리와 자동 갱신으로 보안을 강화합니다."
            },
            item5: {
                title: "OWASP Top 10 기반 보안 코딩",
                description: "개발은 OWASP 보안 가이드라인을 준수하며, 정기적인 코드 보안 검토와 취약점 스캔을 실시합니다. SQL Injection, XSS, CSRF 등 주요 취약점으로부터 보호하는 안전한 코드를 작성합니다."
            },
            item6: {
                title: "자동 백업으로 데이터 손실 방지",
                description: "모든 데이터는 매일 자동으로 백업되며 최대 30일간 보관됩니다. 실수로 삭제되거나 손상된 데이터도 언제든지 복구할 수 있어 안심하고 서비스를 이용할 수 있습니다."
            }
        },
        blog: {
            title: "blog",
            subtitle: "AX2 실시간 번역을 200% 활용하는 방법",
            description: "AX2에서 확인하세요",
            blog1: "온라인 강의 플랫폼, 왜 'AX2' 실시간 번역이 필수일까?",
            blog2: "대학 vs 기업 교육: 실시간 번역으로 글로벌 교육 확대하기",
            blog3: "청주대학교, AX2로 완성한 글로벌 온라인 강의 운영기",
            date1: "2025년 10월 31일",
            date2: "2025년 10월 1일",
            button: "블로그 바로가기"
        },
        faq: {
            title: "FAQ",
            subtitle: "궁금한 점이 있다면",
            description: "AX2팀에게 알려주세요",
            text: "헬프센터에서 AX2 실시간 번역의 기본적인 사용 가이드를 제공하고 있어요. AX2팀에게 직접 문의를 하고 답장을 받을 수도 있어요.",
            community: "AX2 커뮤니티 바로가기",
            help: "헬프센터"
        },
        cta: {
            title: "당신이 그토록 찾던 실시간 번역, 무료로 사용하세요.",
            subtitle: "바로 여기 AX2에서",
            button: "바로 시작하기"
        },
        footer: {
            guide: "사용 가이드",
            updates: "업데이트",
            pricing: "가격정책",
            company: "파프리카데이터랩",
            blog: "블로그",
            careers: "채용",
            terms: "이용 약관",
            privacy: "개인정보처리방침",
            refund: "환불정책",
            customer: "고객",
            partner: "제휴",
            start: "지금 시작하기"
        }
    },
    en: {
        nav: {
            realtime: "Real-time Translation",
            languages: "Language Support",
            pricing: "Pricing",
            enterprise: "Enterprise",
            start: "Get Started"
        },
        hero: {
            title: "The New Standard for Real-time Lecture Translation,<br><span class=\"highlight\">AX2</span>",
            description: "Break through language barriers with AI-based real-time translation. From the moment you listen to a lecture, we provide accurate real-time translation and captions to create a global educational environment.",
            startFree: "Start Free",
            requestDemo: "Request Demo"
        },
        features: {
            title: "Innovative Translation Technology",
            subtitle: "The Educational Platform of the Next Generation",
            realtime: {
                title: "Real-time Translation,<br>Learning Without Delay",
                description: "We provide real-time translation and captions simultaneously as lectures proceed. AX2 has no limits on lecture time, language, or translation quality. You can translate as many lectures as you want and collect unlimited learning data. A flexible translation environment leads to more possibilities and better learning outcomes."
            },
            multilang: {
                title: "Overcoming Global Education Limits<br>with 50+ Language Support",
                description: "Translate over 50 languages in real-time, allowing you to freely learn lectures in any language.",
                feature1: "Support for major languages including English, Chinese, Japanese, Spanish",
                feature2: "Specialized terminology dictionary and context-aware translation"
            },
            api: {
                title: "API Integration",
                description: "Easily integrate with various platforms through our RESTful API. Seamlessly connect with your existing educational systems to quickly implement real-time translation features.",
                feature1: "Easy integration with various platforms",
                feature2: "Seamless connection with RESTful API"
            }
        },
        form: {
            title: "On Work Computers,<br>On Mobile Phones While Moving",
            subtitle: "Smoothly Operating Translation Interface",
            description: "Experience real-time translation anytime, anywhere, on any device. The layout automatically adjusts to your device, increasing accessibility and learning efficiency for a better educational experience.",
            panel1: "Optimized Translation Experience on Any Device",
            panel2: "Seamlessly Connect from Lecture End to Review"
        },
        analysis: {
            title: "Analyze Translation Quality in Real-time<br>and Optimize Learning Effectiveness",
            description: "Analyze translation quality and learning data in real-time to quickly identify hidden patterns and meaningful insights."
        },
        security: {
            title: "Security",
            subtitle: "Data Protection and Privacy",
            item1: {
                title: "Hide sensitive information and show only what's needed",
                description: "Sensitive information like resident registration numbers or contact information is automatically masked for security, allowing for safe collection and management of confidential information."
            },
            item2: {
                title: "Secure access control with granular permission management",
                description: "Granular access permissions can be set per user and project. Important translation tasks are only accessible to authorized users, and all access records are tracked."
            },
            item3: {
                title: "Enhance security and transparency with log records",
                description: "All important operations are recorded, and sensitive changes like unmasking data require a reason. This environment allows for strict tracking and management of data changes and access permissions."
            },
            item4: {
                title: "Protect data with secure API communication",
                description: "All API requests are protected by authentication tokens, and unauthorized access is prevented through request and rate limiting. API key management and automatic renewal enhance security."
            },
            item5: {
                title: "OWASP Top 10 based secure coding",
                description: "Development adheres to OWASP security guidelines, with regular code security reviews and vulnerability scans. Secure code is written to protect against major web vulnerabilities like SQL Injection, XSS, and CSRF."
            },
            item6: {
                title: "Prevent data loss with automatic backup",
                description: "All data is automatically backed up daily and retained for up to 30 days. Users can confidently use the service knowing that accidentally deleted or damaged data can be recovered at any time."
            }
        },
        blog: {
            title: "Blog",
            subtitle: "How to Get 200% Out of AX2 Real-time Translation",
            description: "Check it out on AX2",
            blog1: "Why is 'AX2' Real-time Translation Essential for Online Lecture Platforms?",
            blog2: "University vs Corporate Education: Expanding Global Education with Real-time Translation",
            blog3: "Stanford University's Story of Operating Global Online Lectures with AX2",
            date1: "October 31, 2025",
            date2: "October 1, 2025",
            button: "Go to Blog"
        },
        faq: {
            title: "FAQ",
            subtitle: "If you have any questions",
            description: "Please let the AX2 team know",
            text: "The help center provides basic usage guides for AX2 real-time translation. You can also directly contact the AX2 team and receive a reply.",
            community: "Go to AX2 Community",
            help: "Help Center"
        },
        cta: {
            title: "Use the Real-time Translation You've Been Looking For, Free.",
            subtitle: "Right here at AX2",
            button: "Get Started Now"
        },
        footer: {
            guide: "User Guide",
            updates: "Updates",
            pricing: "Pricing",
            company: "Paprika Data Lab",
            blog: "Blog",
            careers: "Careers",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            refund: "Refund Policy",
            customer: "Customer",
            partner: "Partner",
            start: "Get Started"
        }
    },
    ja: {
        nav: {
            realtime: "リアルタイム翻訳",
            languages: "言語サポート",
            pricing: "料金プラン",
            enterprise: "エンタープライズ",
            start: "今すぐ始める"
        },
        hero: {
            title: "リアルタイム講義翻訳の新しい基準、<br><span class=\"highlight\">AX2</span>",
            description: "AIベースのリアルタイム翻訳で言語の壁を越えてください。講義を聞く瞬間から、リアルタイムで正確な翻訳と字幕を提供し、グローバルな教育環境を作り上げます。",
            startFree: "無料で始める",
            requestDemo: "デモを申請"
        },
        features: {
            title: "革新的な翻訳技術",
            subtitle: "次世代の教育プラットフォーム",
            realtime: {
                title: "リアルタイム翻訳、<br>遅延のない学習",
                description: "講義が進行するのと同時にリアルタイムで翻訳と字幕を提供します。AX2は講義時間、言語、翻訳品質に制限を設けません。希望するだけ多くの講義を翻訳し、無制限に学習データを収集できます。柔軟な翻訳環境は、より多くの可能性と学習効果につながります。"
            },
            multilang: {
                title: "50以上の言語サポートで<br>グローバル教育の限界を超える",
                description: "50以上の言語をリアルタイムで翻訳し、どの言語の講義でも自由に学習できます。",
                feature1: "英語、中国語、日本語、スペイン語などの主要言語をサポート",
                feature2: "専門用語辞典とコンテキスト認識翻訳"
            },
            api: {
                title: "API連携および統合",
                description: "様々なプラットフォームと簡単に統合できるRESTful APIを提供します。既存の教育システムとシームレスに連携し、リアルタイム翻訳機能を迅速に導入できます。",
                feature1: "様々なプラットフォームとの簡単な統合",
                feature2: "RESTful APIによるスムーズな連携"
            }
        },
        form: {
            title: "業務用コンピュータでも、<br>移動中のスマートフォンでも",
            subtitle: "スムーズに動作する翻訳インターフェース",
            description: "いつでもどこでも、どのデバイスでもリアルタイム翻訳を体験してください。デバイスに合わせて自動的にレイアウトが調整され、アクセシビリティと学習効率を高め、より良い教育体験を提供します。",
            panel1: "デバイスに関係なく最適化された翻訳体験",
            panel2: "講義終了後から復習までシームレスに接続"
        },
        analysis: {
            title: "リアルタイムで翻訳品質を分析し、<br>学習効果を最適化する",
            description: "翻訳品質と学習データをリアルタイムで分析し、隠れたパターンと意味のあるインサイトを迅速に把握できます。"
        },
        security: {
            title: "セキュリティ",
            subtitle: "データ保護とプライバシー",
            item1: {
                title: "機密情報を隠し、必要なものだけを表示",
                description: "住民登録番号や連絡先などの機密情報は自動的にマスキングされ、セキュリティが維持されます。機密情報を安全に収集・管理できます。"
            },
            item2: {
                title: "細かい権限管理による安全なアクセス制御",
                description: "ユーザーとプロジェクトごとに細かいアクセス権限を設定できます。重要な翻訳作業は権限のあるユーザーのみアクセス可能で、すべてのアクセス記録が追跡されます。"
            },
            item3: {
                title: "ログ記録でセキュリティと透明性を向上",
                description: "すべての重要な操作が記録され、データマスキング解除などの機密変更には理由が必要です。データ変更とアクセス権限を厳密に追跡・管理できる環境を提供します。"
            },
            item4: {
                title: "安全なAPI通信でデータを保護",
                description: "すべてのAPIリクエストは認証トークンで保護され、リクエストとレート制限により不正アクセスを防止します。APIキー管理と自動更新によりセキュリティを強化します。"
            },
            item5: {
                title: "OWASP Top 10ベースのセキュアコーディング",
                description: "開発はOWASPセキュリティガイドラインに準拠し、定期的なコードセキュリティレビューと脆弱性スキャンを実施します。SQL Injection、XSS、CSRFなどの主要なウェブ脆弱性から保護する安全なコードを記述します。"
            },
            item6: {
                title: "自動バックアップでデータ損失を防止",
                description: "すべてのデータは毎日自動的にバックアップされ、最大30日間保管されます。誤って削除または破損したデータもいつでも復元できるため、安心してサービスを利用できます。"
            }
        },
        blog: {
            title: "ブログ",
            subtitle: "AX2リアルタイム翻訳を200%活用する方法",
            description: "AX2で確認してください",
            blog1: "オンライン講義プラットフォーム、なぜ'AX2'リアルタイム翻訳が必須なのか？",
            blog2: "大学vs企業教育：リアルタイム翻訳でグローバル教育を拡大",
            blog3: "スタンフォード大学、AX2で完成させたグローバルオンライン講義運営記",
            date1: "2025年10月31日",
            date2: "2025年10月1日",
            button: "ブログへ"
        },
        faq: {
            title: "FAQ",
            subtitle: "質問がある場合",
            description: "AX2チームにお知らせください",
            text: "ヘルプセンターでAX2リアルタイム翻訳の基本的な使用ガイドを提供しています。AX2チームに直接問い合わせて返信を受けることもできます。",
            community: "AX2コミュニティへ",
            help: "ヘルプセンター"
        },
        cta: {
            title: "あなたが探していたリアルタイム翻訳を無料で使用してください。",
            subtitle: "ここAX2で",
            button: "今すぐ始める"
        },
        footer: {
            guide: "使用ガイド",
            updates: "アップデート",
            pricing: "料金プラン",
            company: "パプリカデータラボ",
            blog: "ブログ",
            careers: "採用",
            terms: "利用規約",
            privacy: "プライバシーポリシー",
            refund: "返金ポリシー",
            customer: "お客様",
            partner: "パートナー",
            start: "今すぐ始める"
        }
    },
    zh: {
        nav: {
            realtime: "实时翻译",
            languages: "语言支持",
            pricing: "价格政策",
            enterprise: "企业解决方案",
            start: "立即开始"
        },
        hero: {
            title: "实时讲座翻译的新标准，<br><span class=\"highlight\">AX2</span>",
            description: "通过基于AI的实时翻译突破语言障碍。从您听讲座的那一刻起，我们提供准确的实时翻译和字幕，以创建全球教育环境。",
            startFree: "免费开始",
            requestDemo: "申请演示"
        },
        features: {
            title: "创新翻译技术",
            subtitle: "下一代教育平台",
            realtime: {
                title: "实时翻译，<br>无延迟学习",
                description: "在讲座进行的同时实时提供翻译和字幕。AX2对讲座时间、语言和翻译质量没有限制。您可以翻译任意数量的讲座，并无限收集学习数据。灵活的翻译环境带来更多可能性和更好的学习效果。"
            },
            multilang: {
                title: "通过50+语言支持<br>突破全球教育限制",
                description: "实时翻译50多种语言，让您可以自由学习任何语言的讲座。",
                feature1: "支持英语、中文、日语、西班牙语等主要语言",
                feature2: "专业术语词典和上下文感知翻译"
            },
            api: {
                title: "API集成和连接",
                description: "提供可与各种平台轻松集成的RESTful API。与现有教育系统无缝连接，快速引入实时翻译功能。",
                feature1: "与各种平台轻松集成",
                feature2: "通过RESTful API无缝连接"
            }
        },
        form: {
            title: "在工作电脑上，<br>在移动中的智能手机上",
            subtitle: "流畅运行的翻译界面",
            description: "随时随地、在任何设备上体验实时翻译。布局会根据您的设备自动调整，提高可访问性和学习效率，提供更好的教育体验。",
            panel1: "在任何设备上优化的翻译体验",
            panel2: "从讲座结束到复习无缝连接"
        },
        analysis: {
            title: "实时分析翻译质量<br>并优化学习效果",
            description: "实时分析翻译质量和学习数据，快速识别隐藏的模式和有意义的见解。"
        },
        security: {
            title: "安全",
            subtitle: "数据保护和隐私",
            item1: {
                title: "隐藏敏感信息，只显示需要的内容",
                description: "居民登记号码或联系信息等敏感信息会自动进行掩码处理以维护安全性，可以安全地收集和管理机密信息。"
            },
            item2: {
                title: "通过细粒度权限管理实现安全访问控制",
                description: "可以为每个用户和项目设置细粒度的访问权限。重要的翻译任务只有授权用户才能访问，所有访问记录都会被跟踪。"
            },
            item3: {
                title: "通过日志记录提高安全性和透明度",
                description: "所有重要操作都会被记录，取消数据掩码等敏感更改需要提供理由。此环境允许严格跟踪和管理数据更改和访问权限。"
            },
            item4: {
                title: "通过安全的API通信保护数据",
                description: "所有API请求都通过身份验证令牌进行保护，通过请求和速率限制防止未经授权的访问。API密钥管理和自动续订增强了安全性。"
            },
            item5: {
                title: "基于OWASP Top 10的安全编码",
                description: "开发遵循OWASP安全指南，定期进行代码安全审查和漏洞扫描。编写安全代码以防范SQL注入、XSS和CSRF等主要Web漏洞。"
            },
            item6: {
                title: "通过自动备份防止数据丢失",
                description: "所有数据每天自动备份，最多保留30天。用户可以放心使用服务，因为意外删除或损坏的数据可以随时恢复。"
            }
        },
        blog: {
            title: "博客",
            subtitle: "如何充分利用AX2实时翻译",
            description: "在AX2上查看",
            blog1: "在线讲座平台为什么'AX2'实时翻译是必需的？",
            blog2: "大学vs企业教育：通过实时翻译扩展全球教育",
            blog3: "斯坦福大学使用AX2完成全球在线讲座运营记录",
            date1: "2025年10月31日",
            date2: "2025年10月1日",
            button: "前往博客"
        },
        faq: {
            title: "常见问题",
            subtitle: "如果您有任何问题",
            description: "请告知AX2团队",
            text: "帮助中心提供AX2实时翻译的基本使用指南。您也可以直接联系AX2团队并收到回复。",
            community: "前往AX2社区",
            help: "帮助中心"
        },
        cta: {
            title: "免费使用您一直在寻找的实时翻译。",
            subtitle: "就在这里，在AX2",
            button: "立即开始"
        },
        footer: {
            guide: "使用指南",
            updates: "更新",
            pricing: "价格政策",
            company: "Paprika数据实验室",
            blog: "博客",
            careers: "招聘",
            terms: "服务条款",
            privacy: "隐私政策",
            refund: "退款政策",
            customer: "客户",
            partner: "合作伙伴",
            start: "立即开始"
        }
    }
};

// 현재 언어 설정 (기본값: 한국어)
let currentLanguage = 'ko';

// 언어 변경 함수
function changeLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];
    
    if (!t) return;
    
    // 네비게이션
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks.length >= 4) {
        navLinks[0].textContent = t.nav.realtime;
        navLinks[1].textContent = t.nav.languages;
        navLinks[2].textContent = t.nav.enterprise;
        navLinks[3].textContent = t.nav.blog || "블로그";
    }
    const startBtn = document.querySelector('.nav-actions .btn-primary');
    if (startBtn) startBtn.textContent = t.nav.start;
    
    // Hero 섹션
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = t.hero.title;
    const heroDesc = document.querySelector('.hero-description');
    if (heroDesc) heroDesc.textContent = t.hero.description;
    const heroBtns = document.querySelectorAll('.hero-actions .btn');
    if (heroBtns.length >= 2) {
        heroBtns[0].textContent = t.hero.startFree;
        heroBtns[1].textContent = t.hero.requestDemo;
    }
    
    // Features 섹션
    const sectionTitle = document.querySelector('.features-card .section-title');
    if (sectionTitle) sectionTitle.textContent = t.features.title;
    const sectionSubtitle = document.querySelector('.features-card .section-subtitle');
    if (sectionSubtitle) sectionSubtitle.textContent = t.features.subtitle;
    
    // Feature 1: Real-time
    const feature1Title = document.querySelector('.feature-unlimited .feature-title');
    if (feature1Title) feature1Title.innerHTML = t.features.realtime.title;
    const feature1Desc = document.querySelector('.feature-unlimited .feature-description');
    if (feature1Desc) feature1Desc.textContent = t.features.realtime.description;
    
    // Feature 2: Multi-language
    const feature2Title = document.querySelector('.feature-question-type .feature-title');
    if (feature2Title) feature2Title.innerHTML = t.features.multilang.title;
    const feature2Desc = document.querySelector('.feature-question-type .feature-description');
    if (feature2Desc) feature2Desc.textContent = t.features.multilang.description;
    const feature2List = document.querySelectorAll('.feature-question-type .feature-list li');
    if (feature2List.length >= 2) {
        feature2List[0].innerHTML = '<span class="check-icon">✓</span> ' + t.features.multilang.feature1;
        feature2List[1].innerHTML = '<span class="check-icon">✓</span> ' + t.features.multilang.feature2;
    }
    
    // Feature 3: API Integration
    const feature3Title = document.querySelector('.feature-custom-design .feature-title');
    if (feature3Title) feature3Title.innerHTML = t.features.api.title;
    const feature3Desc = document.querySelector('.feature-custom-design .feature-description');
    if (feature3Desc) feature3Desc.textContent = t.features.api.description;
    const feature3List = document.querySelectorAll('.feature-custom-design .feature-list li');
    if (feature3List.length >= 2) {
        feature3List[0].innerHTML = '<span class="check-icon">✓</span> ' + t.features.api.feature1;
        feature3List[1].innerHTML = '<span class="check-icon">✓</span> ' + t.features.api.feature2;
    }
    
    // Form 섹션
    const formTitle = document.querySelector('.form-section .section-title');
    if (formTitle) formTitle.innerHTML = t.form.title;
    const formSubtitle = document.querySelector('.form-section .section-subtitle');
    if (formSubtitle) formSubtitle.textContent = t.form.subtitle;
    const formDesc = document.querySelector('.form-description');
    if (formDesc) formDesc.textContent = t.form.description;
    const panelTitles = document.querySelectorAll('.form-feature-panel .panel-title');
    if (panelTitles.length >= 2) {
        panelTitles[0].textContent = t.form.panel1;
        panelTitles[1].textContent = t.form.panel2;
    }
    
    // Analysis 섹션
    const analysisTitle = document.querySelector('.analysis-section .section-title');
    if (analysisTitle) analysisTitle.innerHTML = t.analysis.title;
    const analysisDesc = document.querySelector('.analysis-description');
    if (analysisDesc) analysisDesc.textContent = t.analysis.description;
    
    // Security 섹션
    const securityTitle = document.querySelector('.security-section .section-title');
    if (securityTitle) securityTitle.textContent = t.security.title;
    const securitySubtitle = document.querySelector('.security-section .section-subtitle');
    if (securitySubtitle) securitySubtitle.textContent = t.security.subtitle;
    const securityItems = document.querySelectorAll('.security-item');
    if (securityItems.length >= 4) {
        const sec1Title = securityItems[0].querySelector('.security-title');
        const sec1Desc = securityItems[0].querySelector('.security-description');
        if (sec1Title) sec1Title.textContent = t.security.item1.title;
        if (sec1Desc) sec1Desc.textContent = t.security.item1.description;
        
        const sec2Title = securityItems[1].querySelector('.security-title');
        const sec2Desc = securityItems[1].querySelector('.security-description');
        if (sec2Title) sec2Title.textContent = t.security.item3.title;
        if (sec2Desc) sec2Desc.textContent = t.security.item3.description;
        
        const sec3Title = securityItems[2].querySelector('.security-title');
        const sec3Desc = securityItems[2].querySelector('.security-description');
        if (sec3Title) sec3Title.textContent = t.security.item4.title;
        if (sec3Desc) sec3Desc.textContent = t.security.item4.description;
        
        const sec4Title = securityItems[3].querySelector('.security-title');
        const sec4Desc = securityItems[3].querySelector('.security-description');
        if (sec4Title) sec4Title.textContent = t.security.item5.title;
        if (sec4Desc) sec4Desc.textContent = t.security.item5.description;
    }
    
    // Blog 섹션
    const blogTitle = document.querySelector('.blog .section-title');
    if (blogTitle) blogTitle.textContent = t.blog.title;
    const blogSubtitle = document.querySelector('.blog .section-subtitle');
    if (blogSubtitle) blogSubtitle.textContent = t.blog.subtitle;
    const blogDesc = document.querySelector('.blog .section-description');
    if (blogDesc) blogDesc.textContent = t.blog.description;
    const blogTitles = document.querySelectorAll('.blog-title');
    if (blogTitles.length >= 3) {
        blogTitles[0].textContent = t.blog.blog1;
        blogTitles[1].textContent = t.blog.blog2;
        blogTitles[2].textContent = t.blog.blog3;
    }
    const blogDates = document.querySelectorAll('.blog-date');
    if (blogDates.length >= 3) {
        blogDates[0].textContent = t.blog.date1;
        blogDates[1].textContent = t.blog.date1;
        blogDates[2].textContent = t.blog.date2;
    }
    const blogBtn = document.querySelector('.blog-action .btn');
    if (blogBtn) blogBtn.textContent = t.blog.button;
    
    // FAQ 섹션
    const faqTitle = document.querySelector('.faq .section-title');
    if (faqTitle) faqTitle.textContent = t.faq.title;
    const faqSubtitle = document.querySelector('.faq .section-subtitle');
    if (faqSubtitle) faqSubtitle.textContent = t.faq.subtitle;
    const faqDesc = document.querySelector('.faq .section-description');
    if (faqDesc) faqDesc.textContent = t.faq.description;
    const faqText = document.querySelector('.faq-description');
    if (faqText) faqText.textContent = t.faq.text;
    const faqBtns = document.querySelectorAll('.faq-actions .btn');
    if (faqBtns.length >= 2) {
        faqBtns[0].textContent = t.faq.community;
        faqBtns[1].textContent = t.faq.help;
    }
    
    // CTA 섹션
    const ctaTitle = document.querySelector('.cta-title');
    if (ctaTitle) ctaTitle.textContent = t.cta.title;
    const ctaSubtitle = document.querySelector('.cta-subtitle');
    if (ctaSubtitle) ctaSubtitle.textContent = t.cta.subtitle;
    const ctaBtn = document.querySelector('.btn-cta');
    if (ctaBtn) ctaBtn.textContent = t.cta.button;
    
    // Footer
    const footerBtns = document.querySelectorAll('.footer-links a');
    if (footerBtns.length >= 8) {
        footerBtns[0].textContent = t.footer.guide;
        footerBtns[1].textContent = t.footer.updates;
        footerBtns[2].textContent = t.footer.company;
        footerBtns[3].textContent = t.footer.blog;
        footerBtns[4].textContent = t.footer.careers;
        footerBtns[5].textContent = t.footer.terms;
        footerBtns[6].textContent = t.footer.privacy;
        footerBtns[7].textContent = t.footer.refund;
    }
    const footerStartBtn = document.querySelector('.btn-footer');
    if (footerStartBtn) footerStartBtn.textContent = t.footer.start;
    
    // HTML lang 속성 변경
    document.documentElement.lang = lang === 'ko' ? 'ko-KR' : lang === 'zh' ? 'zh-CN' : lang === 'ja' ? 'ja-JP' : 'en-US';
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Header scroll effect - removed border on scroll
    // 헤더는 항상 동일한 스타일 유지

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and other elements
    const animatedElements = document.querySelectorAll('.feature-card, .security-item, .blog-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 비디오 재생 속도 조정
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // 재생 속도를 1.5배로 설정 (1.0이 기본 속도)
        heroVideo.playbackRate = 1.5;
        
        // 비디오가 로드된 후에도 속도 유지
        heroVideo.addEventListener('loadedmetadata', function() {
            heroVideo.playbackRate = 1.5;
        });
    }

    // GIF (video) 재생 속도 조정 - iphone-screen-gif
    const iphoneGif = document.querySelector('.iphone-screen-gif');
    if (iphoneGif) {
        // 비디오가 로드되고 재생 가능해질 때까지 기다림
        iphoneGif.addEventListener('canplay', function() {
            iphoneGif.playbackRate = 2.0;
            iphoneGif.play().catch(function(error) {
                console.log('Video autoplay failed:', error);
            });
        });
        
        // 재생 속도를 2.0배로 설정 (더 빠르게)
        if (iphoneGif.readyState >= 2) {
            iphoneGif.playbackRate = 2.0;
        }
        
        // 비디오가 로드된 후에도 속도 유지
        iphoneGif.addEventListener('loadedmetadata', function() {
            iphoneGif.playbackRate = 2.0;
        });
        
        // 에러 처리
        iphoneGif.addEventListener('error', function(e) {
            console.error('Video loading error:', e, iphoneGif.error);
        });
    }

    // 언어 선택 드롭다운 이벤트 리스너
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            const selectedLang = e.target.value;
            changeLanguage(selectedLang);
        });
    }

    // 언어 목록 표시 기능
    const languages = [
        '한국어', '영어', '중국어 (간체)', '중국어 (번체)', '일본어', '스페인어', '프랑스어', '독일어', '이탈리아어', '포르투갈어',
        '러시아어', '아랍어', '힌디어', '태국어', '베트남어', '인도네시아어', '말레이어', '필리핀어', '터키어', '폴란드어',
        '네덜란드어', '그리스어', '체코어', '스웨덴어', '노르웨이어', '덴마크어', '핀란드어', '헝가리어', '루마니아어', '불가리아어',
        '크로아티아어', '세르비아어', '슬로바키아어', '슬로베니아어', '우크라이나어', '히브리어', '페르시아어', '벵골어', '타밀어', '텔루구어',
        '마라티어', '구자라트어', '칸나다어', '말라얄람어', '펀자브어', '우르두어', '네팔어', '스리랑카어', '미얀마어', '캄보디아어',
        '라오어', '몽골어', '카자흐어', '우즈베크어', '아제르바이잔어', '조지아어', '아르메니아어', '아프리칸스어', '스와힐리어', '요루바어'
    ];

    const showLanguagesBtn = document.getElementById('show-languages-btn');
    const closeLanguagesBtn = document.getElementById('close-languages-btn');
    const languagesContainer = document.getElementById('languages-container');
    const languagesGrid = document.getElementById('languages-grid');

    if (showLanguagesBtn && languagesContainer && languagesGrid) {
        // 언어 목록 생성
        languages.forEach(lang => {
            const langItem = document.createElement('div');
            langItem.className = 'language-item';
            langItem.textContent = lang;
            languagesGrid.appendChild(langItem);
        });

        // 언어 목록 표시
        showLanguagesBtn.addEventListener('click', function() {
            languagesContainer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // 언어 목록 닫기
        closeLanguagesBtn.addEventListener('click', function() {
            languagesContainer.classList.remove('active');
            document.body.style.overflow = '';
        });

        // 배경 클릭 시 닫기
        languagesContainer.addEventListener('click', function(e) {
            if (e.target === languagesContainer) {
                languagesContainer.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Analytics Charts
    if (typeof Chart !== 'undefined') {
        // Mini charts for stat cards
        const miniChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                point: { radius: 0 },
                line: { tension: 0.4, borderWidth: 2 }
            }
        };

        // Translation Accuracy Chart
        const accuracyCtx = document.getElementById('accuracy-chart');
        if (accuracyCtx) {
            new Chart(accuracyCtx, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [96, 97, 97.5, 98, 98.3, 98.6, 98.8],
                        borderColor: '#FF9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        fill: true
                    }]
                },
                options: miniChartOptions
            });
        }

        // Latency Chart
        const latencyCtx = document.getElementById('latency-chart');
        if (latencyCtx) {
            new Chart(latencyCtx, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [0.5, 0.45, 0.4, 0.35, 0.32, 0.31, 0.3],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        fill: true
                    }]
                },
                options: miniChartOptions
            });
        }

        // Language Coverage Chart
        const coverageCtx = document.getElementById('coverage-chart');
        if (coverageCtx) {
            new Chart(coverageCtx, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [30, 35, 40, 45, 48, 49, 50],
                        borderColor: '#9C27B0',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        fill: true
                    }]
                },
                options: miniChartOptions
            });
        }

        // User Satisfaction Chart
        const satisfactionCtx = document.getElementById('satisfaction-chart');
        if (satisfactionCtx) {
            new Chart(satisfactionCtx, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [4.5, 4.6, 4.7, 4.75, 4.8, 4.85, 4.9],
                        borderColor: '#FF9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        fill: true
                    }]
                },
                options: miniChartOptions
            });
        }

        // Main Analytics Chart
        const mainChartCtx = document.getElementById('main-chart');
        if (mainChartCtx) {
            const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
            
            new Chart(mainChartCtx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Lectures',
                            data: [120, 180, 220, 280, 320, 380, 450, 520, 600, 680, 750, 850],
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3
                        },
                        {
                            label: 'Translations',
                            data: [80, 140, 180, 240, 290, 350, 420, 480, 550, 620, 690, 780],
                            borderColor: '#FF9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3
                        },
                        {
                            label: 'Users',
                            data: [500, 800, 1200, 1800, 2500, 3200, 4000, 4800, 5200, 5300, 5400, 5432],
                            borderColor: '#F44336',
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 13
                            },
                            displayColors: true
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 12
                                },
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }
    }
});

