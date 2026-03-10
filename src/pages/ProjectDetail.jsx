import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';

// Tüm projelerin eksiksiz veri tabanı
const projectsData = {
  "vibot": {
    title: "ViBot - YouTube Video Özetleyici",
    tags: ["LLM", "Python", "Web", "NLP"],
    imageUrl: "/vibot_logo.png",
    about: "ViBot, uzun YouTube videolarını izlemek için vakti olmayan kullanıcılar için geliştirilmiş yapay zeka destekli bir web uygulamasıdır. Kullanıcıdan alınan video linki arka planda işlenerek, videonun en kritik noktaları ve genel özeti saniyeler içinde metne dökülür.",
    features: [
      "Videonun ses dosyasının otomatik olarak indirilip metne çevrilmesi (Speech-to-Text).",
      "Büyük Dil Modelleri (LLM) kullanılarak metnin anlamlı özetlere dönüştürülmesi.",
      "Kullanıcı dostu, hızlı yanıt veren modern web arayüzü."
    ],
    githubLink: "", 
    liveLink: ""    
  },
  "nebu": {
    title: "NeBu - Görme Engelliler İçin Yapay Zeka",
    tags: ["Bilgisayarlı Görü", "Mobil", "AI"],
    imageUrl: "/nebu_logo.png",
    about: "NeBu, görme engelli bireylerin günlük hayatlarını kolaylaştırmak amacıyla tasarlanmış bir mobil uygulamadır. Telefonun kamerası aracılığıyla çevreyi analiz eder ve nesneleri, engelleri veya metinleri sesli olarak betimler.",
    features: [
      "Gerçek zamanlı nesne tespiti ve sınıflandırma.",
      "Görüntüyü metne (Image Captioning) ve metni sese (TTS) çevirme mimarisi.",
      "Erişilebilirlik standartlarına uygun, kolay kullanılabilir mobil arayüz."
    ],
    githubLink: "",
    liveLink: ""
  },
  "1d-anomali": {
    title: "Tek Boyutlu Sensör Verilerinde Anomali Tespiti",
    tags: ["Sinyal İşleme", "Keras", "Derin Öğrenme"],
    imageUrl: "/1d-anomali_logo.png",
    about: "Endüstriyel sistemlerde arıza tespiti yapmak amacıyla tek kanallı titreşim sensörlerinden alınan zaman serisi verilerini analiz eden bir derin öğrenme modelidir. Normal dışı titreşim kalıplarını algılayarak olası anormallikleri tespit eder.",
    features: [
      "Zaman serisi verilerinin makine öğrenmesi algoritmaları ile işlenmesi.",
      "Keras tabanlı, yüksek doğruluk oranına sahip anomali tespit mimarisi.",
      "Gerçek dünya sensör verileri üzerinde eğitim ve test süreçleri."
    ],
    githubLink: "",
    liveLink: ""
  },
  "3d-anomali": {
    title: "Üç Boyutlu Sensör Verilerinde Anomali Tespiti",
    tags: ["Zaman Serisi", "Keras", "Veri Analizi"],
    imageUrl: "/3d-anomali_logo.png",
    about: "Üç eksenli (3D) sensör verilerini kullanarak daha karmaşık ve çok boyutlu endüstriyel anomalileri tespit etmek üzere geliştirilmiş kapsamlı bir yapay zeka projesidir.",
    features: [
      "Çok kanallı verilerin eşzamanlı analizi ve özellik çıkarımı (Feature Extraction).",
      "Gelişmiş derin öğrenme ağları kullanılarak yüksek tespit doğruluğu.",
      "Lotec Company stajı kapsamında sektörel ihtiyaçlara yönelik geliştirme."
    ],
    githubLink: "",
    liveLink: ""
  },
  "yuz-kirpma": {
    title: "Otomatik Yüz Tespiti ve Kırpma",
    tags: ["Bilgisayarlı Görü", "OpenCV", "TensorFlow"],
    imageUrl: "/yuz-kirpma_logo.png",
    about: "Büyük çaplı yüz tanıma modellerinin eğitimi öncesinde veri setini temizlemek ve standartlaştırmak için geliştirilmiş bir ön işleme (preprocessing) sistemidir. Karmaşık fotoğraflardaki yüzleri tespit edip sadece o bölgeyi kırparak kaydeder.",
    features: [
      "OpenCV tabanlı yüksek hızlı yüz tespiti algoritmaları.",
      "Farklı ışık ve açı koşullarında yüksek doğruluk oranı.",
      "Toplu (Batch) fotoğraf işleme ve boyutlandırma desteği."
    ],
    githubLink: "",
    liveLink: ""
  },
  "foto-siniflandirma": {
    title: "Görüntü Sınıflandırma Modeli",
    tags: ["CNN", "Derin Öğrenme", "TensorFlow"],
    imageUrl: "/foto-siniflandirma_logo.png",
    about: "Görsel verileri analiz ederek nesneleri veya kategorileri otomatik olarak tanıyabilen derin öğrenme tabanlı bir sınıflandırma sistemidir. Otonom sistemler veya görsel arama motorları gibi alanlarda kullanılabilecek temel bir altyapı sunar.",
    features: [
      "Evrişimli Sinir Ağları (CNN) kullanılarak yüksek performanslı model tasarımı.",
      "Görüntü ön işleme ve veri artırma (Data Augmentation) teknikleri.",
      "TensorFlow/Keras üzerinde uçtan uca eğitim (Training) ve doğrulama (Validation) boru hattı."
    ],
    githubLink: "",
    liveLink: ""
  },
  "turkiye-harita": {
    title: "Etkileşimli Türkiye Haritası",
    tags: ["JavaScript", "React", "Web Geliştirme"],
    imageUrl: "/turkiye-harita_logo.png",
    about: "Kullanıcıların harita üzerinden herhangi bir ile tıklayarak o bölge hakkındaki detaylı bilgilere ve ilgili web sitelerine ulaşmasını sağlayan interaktif ve dinamik bir web arayüzüdür.",
    features: [
      "SVG tabanlı, tamamen tıklanabilir ve ölçeklenebilir Türkiye haritası entegrasyonu.",
      "React state yönetimi ile tıklanan ile göre dinamik içerik renderlama.",
      "Modern, hızlı ve mobil uyumlu (Responsive) tasarım."
    ],
    githubLink: "",
    liveLink: ""
  }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projectsData[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="detail-container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Proje Bulunamadı</h2>
        <Link to="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">
        ← Ana Sayfaya Dön
      </Link>
      
      <div className="detail-header">
        <h1>{project.title}</h1>
        <div className="detail-tags">
          {project.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      {project.imageUrl && (
        <img src={project.imageUrl} alt={project.title} className="detail-image" />
      )}
      
      <div className="detail-content">
        <h3>Proje Hakkında</h3>
        <p>{project.about}</p>

        <h3>Öne Çıkan Özellikler</h3>
        <ul style={{ paddingLeft: '20px' }}>
          {project.features.map((feature, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="detail-links">
        {project.githubLink && (
          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            GitHub Repo
          </a>
        )}
        {project.liveLink && (
          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Projeyi İncele
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;