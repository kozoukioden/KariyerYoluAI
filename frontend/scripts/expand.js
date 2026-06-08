const fs = require('fs');
const path = require('path');

const tracksPath = path.join(__dirname, '../data/tracks.json');
const quizzesPath = path.join(__dirname, '../data/quizzes.json');

const tracksData = JSON.parse(fs.readFileSync(tracksPath, 'utf-8'));
const quizzesData = JSON.parse(fs.readFileSync(quizzesPath, 'utf-8'));

const targetLength = 5; // units
const words = {
  general: ['İleri', 'Uzmanlık', 'Proje', 'Derin', 'Mimari', 'Uygulamalar', 'Pratik', 'Masterclass', 'Zirvesi', 'Ekosistem'],
  topics: ['Güvenlik', 'Performans', 'Ölçeklenebilirlik', 'Test', 'Dağıtım', 'Süreçleri', 'Stratejileri', 'Analitik', 'Altyapı']
};

const shortTracks = [
  'data_scientist', 'ml_engineer', 'database_admin', 'ui_ux_designer', 
  'blockchain_developer', 'mobile_cross_developer', 'devops_engineer'
];

Object.entries(tracksData).forEach(([trackId, trackInfo]) => {
  if (shortTracks.includes(trackId) || (trackInfo.units && trackInfo.units.length < 4)) {
    console.log(`Expanding track: ${trackId}`);
    let currentUnitsCount = trackInfo.units.length;
    let color = trackInfo.units[trackInfo.units.length - 1]?.color || 'blue';
    
    for (let i = currentUnitsCount + 1; i <= targetLength; i++) {
        let newUnit = {
            id: `${trackId}_unit_${i}`,
            title: `Bölüm ${i}: ${words.general[Math.floor(Math.random() * words.general.length)]} ${words.topics[Math.floor(Math.random() * words.topics.length)]}`,
            description: `Bu bölümde ${trackInfo.title} alanındaki ileri seviye pratikleri öğreneceğiz.`,
            color: color,
            nodes: []
        };
        
        let numNodes = Math.floor(Math.random() * 2) + 4; // 4 to 5 nodes
        for (let j = 1; j <= numNodes; j++) {
            let isQuiz = j === numNodes - 1;
            let isBoss = j === numNodes;
            
            let nodeType = isBoss ? 'boss' : (isQuiz ? 'quiz' : 'lesson');
            let nodeId = `${trackId}_unit_${i}_node_${j}`;
            
            newUnit.nodes.push({
                id: nodeId,
                type: nodeType,
                title: isBoss ? `Bölüm ${i} Sonu Projesi` : (isQuiz ? `Bölüm ${i} Değerlendirme` : `İleri İçerik ${i}.${j}`),
                description: `Piyasa standartlarına uygun profesyonel ${trackInfo.title} yetkinlikleri.`,
                content: `Müfredatımızdaki en önemli yetkinlik setlerinden birine hoş geldiniz.\n\n## Kapsam\nBu konuda pratik uygulamalar ve sektörel best practice'leri inceleyeceğiz.\n\n- Teorik temeller\n- Uygulama adımları\n- Gerçek dünya senaryosu\n\nÖğrenim sürecinizi başarıyla tamamlamak için pratik yapmayı unutmayın.`
            });
            
            if (isQuiz || isBoss) {
                // Add dummy quiz
                quizzesData[nodeId] = [
                    {
                        "id": `${nodeId}_q1`,
                        "text": `Bu bölümde işlenen ana konu nedir?`,
                        "options": [
                            "Teorik Kavramlar",
                            "İleri Pratikler",
                            "Temel Bilgiler",
                            "Hiçbiri"
                        ],
                        "correctOptionIndex": 1,
                        "explanation": "Bu bölüm tamamen ileri pratiklere odaklanmaktadır."
                    },
                    {
                        "id": `${nodeId}_q2`,
                        "text": "Sektörel uygulamalarda en çok dikkat edilmesi gereken nokta nedir?",
                        "options": [
                            "Sadece hız",
                            "Sadece tasarım",
                            "Performans ve Ölçeklenebilirlik",
                            "Maliyet"
                        ],
                        "correctOptionIndex": 2,
                        "explanation": "Gerçek dünya projelerinde performans ve ölçeklenebilirlik kritik faktörlerdir."
                    }
                ];
            }
        }
        
        trackInfo.units.push(newUnit);
    }
  }
});

fs.writeFileSync(tracksPath, JSON.stringify(tracksData, null, 2), 'utf-8');
fs.writeFileSync(quizzesPath, JSON.stringify(quizzesData, null, 2), 'utf-8');
console.log('Tracks and Quizzes expanded successfully.');
