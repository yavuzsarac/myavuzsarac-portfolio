import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

const FadeInSection = ({ children, id }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      });
    });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => { if (domRef.current) observer.disconnect(); };
  }, []);

  return (
    <section id={id} ref={domRef} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
      {children}
    </section>
  );
};

function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <a href="#hakkimda">Hakkımda</a>
        <a href="#projeler">Projelerim</a>
        <a href="#kariyer">Kariyerim</a>
        <a href="#yetenekler">Yetenekler</a>
      </nav>

      <FadeInSection id="hakkimda">
        <div className="profile-wrapper">
          <img src="/profil.png" alt="Yavuz Saraç" className="profile-photo" />
          <div className="intro-text">
            <h1>Yavuz Saraç</h1>
            <h3>Bilgisayar Mühendisliği Öğrencisi & Yapay Zeka Geliştiricisi</h3>
          </div>
        </div>
        
        <p>Merhaba, ben Yavuz. Ankara Medipol Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Teknolojiye olan tutkumla yazılım dünyasında sürekli kendimi geliştirmeye odaklanıyor, özellikle <span className="highlight">yapay zeka ve web teknolojileri</span> alanında değer üreten projeler üzerinde çalışıyorum.</p>
        
        <p>Eğitim hayatıma doğup büyüdüğüm Ankara'da başladım. Çok kısa bir süreliğine bulunduğum Van'dan tekrar memleketim Ankara'ya dönerek eğitimime kaldığım yerden devam ettim. İlkokul eğitimimi Gülten Kösemen İlkokulu'nda tamamlarken, bu süreçte Montessori Vakfı ve çeşitli kurumlardan aldığım eğitimlerle İngilizce altyapımı erken yaşta sağlamlaştırdım. Gaziosmanpaşa Necla İlhan İpekçi Ortaokulu'nun ardından, LGS'de %7'lik dilime girerek Yavuz Sultan Selim Anadolu Lisesi'ni kazandım ve buradan 90,9 ortalama ile mezun oldum. 2023 YKS'de elde ettiğim dereceyle üniversiteme yerleştim ve şu an akademik hayatıma 2.85 GANO ile devam etmekteyim.</p>
        
        <p>Üniversitedeki ilk yılımda ağırlıklı olarak web geliştirme dünyasına odaklandım; <span className="highlight">Java, JavaScript, HTML/CSS ve React</span> teknolojileri üzerine çalışarak çeşitli projeler ürettim. Edindiğim bu teorik bilgileri pratiğe dökmek amacıyla, ikinci sınıfa geçmeden önceki yaz <span className="highlight">Key Yazılım Çözümleri</span>'nde gönüllü stajyer olarak görev aldım. Yaklaşık bir buçuk ay süren bu stajda, web sitelerinin tasarımı, geliştirilmesi ve canlıya alınması süreçlerinde sektörel anlamda kritik tecrübeler edindim.</p>

        <p>İkinci sınıfla birlikte kariyer odak noktamı en büyük ilgi alanlarımdan biri olan Yapay Zeka'ya çevirdim. Python programlama dilini temel alarak <span className="highlight">NumPy, Pandas, Scikit-Learn ve TensorFlow/Keras</span> gibi kütüphanelerde uzmanlaşmaya başladım. Makine öğrenmesi, derin öğrenme, doğal dil işleme ve bilgisayarlı görü gibi konularda teknik altyapımı güçlendirdim. İkinci sınıfın sonunda Lotec bünyesinde gerçekleştirdiğim stajımda, bu teorik bilgileri gerçek dünya projelerine entegre etme fırsatı buldum.</p>
        
        <p>Akademik ve profesyonel gelişimimin yanı sıra, bilgi paylaşımına da büyük önem veriyorum. Ankara Medipol Üniversitesi Yapay Zeka Topluluğu yönetim kurulunda Eğitim ve Proje departmanında aktif rol alarak, öğrenci arkadaşlarıma Python ve Makine Öğrenmesi eğitimleri veren ekibin koordinasyonunu üstlendim ve eğitmen olarak görev yaptım. Yenilikçi teknolojileri takip etmeye ve bu ekosisteme katkı sağlamaya devam ediyorum.</p>
      </FadeInSection>

     <FadeInSection id="projeler">
        <h2>Projelerim</h2>
        <p>Geliştirdiğim yapay zeka, makine öğrenmesi ve web odaklı çalışmalardan bazıları.</p>
        
        <div className="projects-grid">
          <ProjectCard 
            id="vibot"
            title="ViBot"
            description="YouTube videolarını otomatik olarak özetleyen ve analiz eden yapay zeka destekli web uygulaması."
            tags={["LLM", "Python", "Web", "NLP"]}
            imageUrl="/vibot_logo.png"
          />
          
          <ProjectCard 
            id="nebu"
            title="NeBu"
            description="Görme engelli bireylerin hayatını kolaylaştırmak amacıyla tasarlanmış, çevreyi analiz edip betimleyen mobil uygulama."
            tags={["Bilgisayarlı Görü", "Mobil", "AI"]}
            imageUrl="/nebu_logo.png"
          />

          <ProjectCard 
            id="1d-anomali"
            title="Tek Boyutlu Sensör Verilerinde Anomali Tespiti"
            description="Tek kanallı titreşim sensöründen elde edilen zaman serisi verilerini analiz ederek makine veya sistem anormalliklerini tespit eden model."
            tags={["Sinyal İşleme", "Keras", "Derin Öğrenme"]}
            imageUrl="/1d-anomali_logo.png"
          />

          <ProjectCard 
            id="3d-anomali"
            title="Üç Boyutlu Sensör Verilerinde Anomali Tespiti"
            description="Üç eksenli (3D) sensör verilerini işleyerek daha karmaşık anomalileri yüksek doğrulukla tespit edebilen derin öğrenme mimarisi."
            tags={["Zaman Serisi", "Keras", "Veri Analizi"]}
            imageUrl="/3d-anomali_logo.png"
          />

          <ProjectCard 
            id="yuz-kirpma"
            title="Otomatik Yüz Tespiti ve Kırpma"
            description="Yüz tanıma sistemleri için ön işleme adımı olarak fotoğraflardaki yüzleri yüksek hassasiyetle tespit edip otomatik olarak kırpan yapay zeka modeli."
            tags={["Bilgisayarlı Görü", "OpenCV", "TensorFlow"]}
            imageUrl="/yuz-kirpma_logo.png"
          />

          <ProjectCard 
            id="foto-siniflandirma"
            title="Görüntü Sınıflandırma Modeli"
            description="Görüntüleri analiz ederek nesne veya yüz bazlı sınıflandırma yapabilen, çeşitli otonom sistemlerde kullanıma uygun derin öğrenme ağı."
            tags={["CNN", "Derin Öğrenme", "TensorFlow"]}
            imageUrl="/foto-siniflandirma_logo.png"
          />

          <ProjectCard 
            id="turkiye-harita"
            title="Etkileşimli Türkiye Haritası"
            description="Kullanıcıların harita üzerinden illere tıklayarak o bölge hakkındaki detaylı verilere ve sitelere ulaşmasını sağlayan dinamik web arayüzü."
            tags={["JavaScript", "React", "Web Geliştirme"]}
            imageUrl="/turkiye-harita_logo.png"
          />
        </div>
      </FadeInSection>

      <FadeInSection id="kariyer">
        <h2>Kariyerim & Deneyimlerim</h2>
        <p>Akademik eğitimimi pratiğe döktüğüm ve profesyonel yeteneklerimi geliştirdiğim serüvenim.</p>
        
        <div className="timeline">
          {/* Güncel olan en üstte (Ters kronolojik sıra profesyonel standarttır) */}
          <div className="timeline-item">
            <span className="timeline-date">Eylül 2025 - Devam Ediyor</span>
            <h3 className="timeline-title">Eğitim ve Proje Departmanı / Eğitmen</h3>
            <h4 className="timeline-company">Ankara Medipol Üniversitesi Yapay Zeka Topluluğu</h4>
            <p className="timeline-desc">
              Yönetim kurulu üyesi olarak topluluğun eğitim stratejilerini ve projelerini koordine eden ekipteyim. Öğrenci arkadaşlarıma Python programlama ve Makine Öğrenmesi (Machine Learning) temelleri üzerine eğitimler veriyor, teorik bilgilerin projelere dönüşmesi sürecinde mentörlük yapıyorum.
            </p>
          </div>

          <div className="timeline-item">
            <span className="timeline-date">Ağustos 2025 - Eylül 2025</span>
            <h3 className="timeline-title">Yapay Zeka Stajyeri (Zorunlu Staj)</h3>
            <h4 className="timeline-company">Lotec Company</h4>
            <p className="timeline-desc">
              Makine öğrenmesi ve derin öğrenme algoritmalarını gerçek dünya verileri üzerinde uyguladım. Özellikle tek kanallı 1 boyutlu ve 3 boyutlu titreşim sensörü verilerini analiz ederek endüstriyel anomali tespiti yapan yapay zeka modelleri (TensorFlow/Keras) eğittim ve test süreçlerini yürüttüm.
            </p>
          </div>

          <div className="timeline-item">
            <span className="timeline-date">Temmuz 2024 - Eylül 2024</span>
            <h3 className="timeline-title">Web Geliştirme Stajyeri (Gönüllü Staj)</h3>
            <h4 className="timeline-company">Key Yazılım Çözümleri</h4>
            <p className="timeline-desc">
              Yazılım dünyasına ilk profesyonel adımımı atarak modern web teknolojileri üzerine çalıştım. HTML, CSS, JavaScript ve React kullanarak kullanıcı dostu web arayüzleri tasarladım ve bu projelerin canlıya alınma (deployment) süreçlerinde aktif rol alarak sektörel iş akışını tecrübe ettim.
            </p>
          </div>
        </div>
      </FadeInSection>

      <FadeInSection id="yetenekler">
        <h2>Yetenekler & Teknolojiler</h2>
        <p>Projelerimde ve akademik çalışmalarımda aktif olarak kullandığım araçlar ve teknolojiler.</p>

        <div className="skills-container">
          
          <div className="skill-category">
            <h3>Yapay Zeka & Veri Bilimi</h3>
            <div className="skill-list">
              <span className="skill-item">TensorFlow</span>
              <span className="skill-item">Keras</span>
              <span className="skill-item">Scikit-Learn</span>
              <span className="skill-item">Pandas</span>
              <span className="skill-item">NumPy</span>
              <span className="skill-item">OpenCV</span>
            </div>
          </div>

          <div className="skill-category">
            <h3>Programlama Dilleri</h3>
            <div className="skill-list">
              <span className="skill-item">Python</span>
              <span className="skill-item">Java</span>
              <span className="skill-item">JavaScript</span>
              <span className="skill-item">Verilog</span>
            </div>
          </div>

          <div className="skill-category">
            <h3>Web Geliştirme</h3>
            <div className="skill-list">
              <span className="skill-item">React</span>
              <span className="skill-item">HTML5</span>
              <span className="skill-item">CSS3</span>
            </div>
          </div>

          <div className="skill-category">
            <h3>Araçlar & Diğer</h3>
            <div className="skill-list">
              <span className="skill-item">Git / GitHub</span>
              <span className="skill-item">Veri Yapıları & Algoritmalar</span>
            </div>
          </div>

        </div>
      </FadeInSection>
    </>
  );
}

export default Home;