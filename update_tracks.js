const fs = require('fs');

const data = JSON.parse(fs.readFileSync('frontend/data/tracks.json', 'utf8'));

for (const trackId in data) {
  data[trackId].units.forEach((unit, unitIdx) => {
    unit.nodes.forEach((node, nodeIdx) => {
      node.learnedSkills = [`${node.title} temelleri`, 'Pratik kod yazımı'];
      node.applications = ['Temel projeler geliştirebilme'];
      
      if (node.title.toLowerCase().includes('html')) {
        node.learnedSkills = ['Semantik HTML yapıları', 'Erişilebilirlik (a11y)', 'Form yönetimi'];
        node.applications = ['Kişisel blog iskeleti', 'Kayıt formları'];
      } else if (node.title.toLowerCase().includes('css')) {
        node.learnedSkills = ['Flexbox & Grid', 'Responsive tasarım'];
        node.applications = ['Mobil uyumlu siteler'];
      } else if (node.title.toLowerCase().includes('javascript')) {
        node.learnedSkills = ['DOM Manipülasyonu', 'ES6+'];
        node.applications = ['İnteraktif web bileşenleri'];
      } else if (node.title.toLowerCase().includes('react')) {
        node.learnedSkills = ['Component mimarisi', 'Hooks'];
        node.applications = ['Modern SPA uygulamaları'];
      } else if (node.type === 'quiz') {
        node.learnedSkills = ['Bilgi pekiştirme', 'Hatalardan öğrenme'];
        node.applications = ['Eksikleri tespit edip giderme'];
      }

      if (unitIdx === 0) {
        node.difficultyLevel = 'beginner';
      } else if (unitIdx === 1) {
        node.difficultyLevel = 'intermediate';
      } else {
        node.difficultyLevel = 'advanced';
      }
    });
  });
}

fs.writeFileSync('frontend/data/tracks.json', JSON.stringify(data, null, 2));
console.log('Successfully updated tracks.json');
