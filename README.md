# KariyerYolu AI

Yazılım kariyerine yön veren, kişiselleştirilmiş öğrenme deneyimi sunan modern bir web uygulaması.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

## Özellikler

- **14 Kariyer Yolu**: Frontend, Backend, Full Stack, iOS, Android, DevOps, Data Science, ML, ve daha fazlası
- **Duolingo Tarzı UI**: Gamification ile eğlenceli öğrenme deneyimi
- **Kişiselleştirilmiş Öneri**: 12 soruluk anket ile size uygun kariyer yolu önerisi
- **AI Mentor**: Groq API (Llama 3.3 70B) ile gerçek zamanlı sohbet desteği
- **İlerleme Takibi**: XP, streak, seviye ve rozetler ile motivasyon
- **Quiz Sistemi**: Her konuda bilginizi test edin

## Teknolojiler

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **State**: Zustand, localStorage
- **AI**: Groq API (Llama 3.3 70B)
- **Deployment**: Vercel

## Kurulum

```bash
# Repoyu klonla
git clone https://github.com/kozoukioden/KariyerYoluAI.git

# Dizine gir
cd KariyerYoluAI/frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## Ortam Değişkenleri

`frontend/.env.local` dosyası oluşturun:

```env
GROQ_API_KEY=your_groq_api_key_here
```

## Proje Yapısı

```
frontend/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── chat/         # AI Chat endpoint
│   │   ├── recommend/    # Kariyer önerisi
│   │   └── ...
│   └── page.tsx          # Ana sayfa
├── components/
│   ├── chat/             # AI Sohbet widget
│   ├── gamification/     # XP, streak, rozetler
│   ├── onboarding/       # Anket wizard
│   ├── quiz/             # Quiz sistemi
│   └── roadmap/          # Kariyer yol haritası
├── data/
│   ├── tracks.json       # Kariyer yolları içeriği
│   └── quizzes.json      # Quiz soruları
└── lib/
    └── storage.ts        # localStorage yönetimi
```

## Kariyer Yolları

| Kariyer | Teknolojiler |
|---------|-------------|
| Frontend Developer | HTML, CSS, JavaScript, React |
| Backend Developer | Node.js, Express, PostgreSQL |
| Full Stack Developer | React, Node.js, MongoDB |
| iOS Developer | Swift, SwiftUI |
| Android Developer | Kotlin, Jetpack Compose |
| Cross-Platform | React Native, Flutter |
| DevOps Engineer | Docker, Kubernetes, CI/CD |
| Data Scientist | Python, Pandas, Matplotlib |
| ML Engineer | Scikit-learn, PyTorch |
| Database Admin | SQL, PostgreSQL |
| UI/UX Designer | Figma, User Research |
| Siber Güvenlik | Network Security, Pentesting |
| Game Developer | Unity, C# |
| Blockchain Developer | Solidity, Web3 |

## Deployment

Vercel ile tek tıkla deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kozoukioden/KariyerYoluAI)

## Lisans

MIT License
