import { useEffect, useMemo, useRef, useState } from 'react';
import './portfolio.css';

const copy = {
  tr: {
    nav: {
      about: 'Hakkımda',
      work: 'Projeler',
      journey: 'Deneyim',
      skills: 'Yetenekler',
      contact: 'İletişim',
    },
    hero: {
      eyebrow: 'Bilgisayar mühendisi adayı · Yapay zeka geliştiricisi',
      title: 'Fikirleri çalışan',
      titleAccent: 'ürünlere dönüştürüyorum.',
      description:
        'Yapay zeka, bilgisayarlı görü ve modern web teknolojilerini bir araya getirerek gerçek problemlere odaklanan ürünler geliştiriyorum.',
      projects: 'Projeleri keşfet',
      github: 'GitHub profilim',
      locationLabel: 'Konum',
      location: 'Ankara, Türkiye',
      focusLabel: 'Odak',
      focus: 'AI · Computer Vision · Web',
      statusLabel: 'Durum',
      status: 'Yeni fikirlere açık',
      scroll: 'Keşfet',
    },
    about: {
      eyebrow: 'Benim hikayem',
      title: 'Merakla başlayan, üreterek ilerleyen bir yolculuk.',
      intro:
        'Teknik yolculuğum yalnızca kullandığım araçlardan değil; öğrendiklerimi gerçek problemlere uygulama isteğimden oluşuyor.',
      note:
        'Yapay Zeka Topluluğu yönetiminde eğitim ve proje çalışmalarını koordine ediyor, Python ve makine öğrenmesi eğitimleri veriyorum.',
      stats: [
        ['7+', 'Tamamlanan proje'],
        ['2', 'Sektör deneyimi'],
        ['C1', 'İngilizce seviyesi'],
      ],
      chapters: [
        {
          number: '01',
          title: 'Başlangıç ve eğitim',
          paragraphs: [
            'Merhaba, ben Yavuz. Ankara Medipol Üniversitesi Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Teknolojiye olan tutkumla yazılım dünyasında sürekli kendimi geliştirmeye odaklanıyor, özellikle yapay zeka ve web teknolojileri alanında değer üreten projeler üzerinde çalışıyorum.',
            "Eğitim hayatıma doğup büyüdüğüm Ankara'da başladım. Çok kısa bir süreliğine bulunduğum Van'dan tekrar memleketim Ankara'ya dönerek eğitimime kaldığım yerden devam ettim. İlkokul eğitimimi Gülten Kösemen İlkokulu'nda tamamlarken, bu süreçte Montessori Vakfı ve çeşitli kurumlardan aldığım eğitimlerle İngilizce altyapımı erken yaşta sağlamlaştırdım. Gaziosmanpaşa Necla İlhan İpekçi Ortaokulu'nun ardından, LGS'de %7'lik dilime girerek Yavuz Sultan Selim Anadolu Lisesi'ni kazandım ve buradan 90,9 ortalama ile mezun oldum. 2023 YKS'de elde ettiğim dereceyle üniversiteme yerleştim ve şu an akademik hayatıma 2.85 GANO ile devam etmekteyim.",
          ],
        },
        {
          number: '02',
          title: 'Web ile üretmeye başlamak',
          paragraphs: [
            'Üniversitedeki ilk yılımda ağırlıklı olarak web geliştirme dünyasına odaklandım; Java, JavaScript, HTML/CSS ve React teknolojileri üzerine çalışarak çeşitli projeler ürettim. Edindiğim bu teorik bilgileri pratiğe dökmek amacıyla, ikinci sınıfa geçmeden önceki yaz Key Yazılım Çözümleri’nde gönüllü stajyer olarak görev aldım. Yaklaşık bir buçuk ay süren bu stajda, web sitelerinin tasarımı, geliştirilmesi ve canlıya alınması süreçlerinde sektörel anlamda kritik tecrübeler edindim.',
          ],
        },
        {
          number: '03',
          title: 'Yapay zekaya yönelmek',
          paragraphs: [
            "İkinci sınıfla birlikte kariyer odak noktamı en büyük ilgi alanlarımdan biri olan Yapay Zeka'ya çevirdim. Python programlama dilini temel alarak NumPy, Pandas, Scikit-Learn ve TensorFlow/Keras gibi kütüphanelerde uzmanlaşmaya başladım. Makine öğrenmesi, derin öğrenme, doğal dil işleme ve bilgisayarlı görü gibi konularda teknik altyapımı güçlendirdim. İkinci sınıfın sonunda Lotec bünyesinde gerçekleştirdiğim stajımda, bu teorik bilgileri gerçek dünya projelerine entegre etme fırsatı buldum.",
          ],
        },
        {
          number: '04',
          title: 'Bilgiyi paylaşmak',
          paragraphs: [
            'Akademik ve profesyonel gelişimimin yanı sıra, bilgi paylaşımına da büyük önem veriyorum. Ankara Medipol Üniversitesi Yapay Zeka Topluluğu yönetim kurulunda Eğitim ve Proje departmanında aktif rol alarak, öğrenci arkadaşlarıma Python ve Makine Öğrenmesi eğitimleri veren ekibin koordinasyonunu üstlendim ve eğitmen olarak görev yaptım. Yenilikçi teknolojileri takip etmeye ve bu ekosisteme katkı sağlamaya devam ediyorum.',
          ],
        },
      ],
    },
    work: {
      eyebrow: 'Seçili çalışmalar',
      title: 'Koddan fazlası: çözüme dönüşen projeler.',
      description:
        'Her proje farklı bir problemi, farklı bir teknik yaklaşımla ele alıyor.',
      filters: {
        all: 'Tümü',
        ai: 'Yapay zeka',
        web: 'Web',
      },
      inspect: 'Projeyi incele',
      close: 'Detay panelini kapat',
      challenge: 'Amaç',
      highlights: 'Öne çıkanlar',
      github: 'GitHub reposu',
      live: 'Canlı projeyi aç',
    },
    journey: {
      eyebrow: 'Yolculuk',
      title: 'Teoriden gerçek dünya problemlerine.',
      description:
        'Her deneyim, bugün geliştirdiğim ürünlere farklı bir bakış açısı kazandırdı.',
      items: [
        {
          date: '2025 — Bugün',
          role: 'Eğitmen · Eğitim ve Proje Departmanı',
          company: 'Ankara Medipol Üniversitesi Yapay Zeka Topluluğu',
          text:
            'Python ve makine öğrenmesi eğitimleri veriyor, öğrenci projelerinin fikirden uygulamaya ilerlemesini koordine ediyorum.',
        },
        {
          date: 'Ağu — Eyl 2025',
          role: 'Yapay Zeka Stajyeri',
          company: 'Lotec Company',
          text:
            'Endüstriyel sensör verileri üzerinde çalışan anomali tespit modelleri geliştirdim ve test süreçlerini yürüttüm.',
        },
        {
          date: 'Tem — Eyl 2024',
          role: 'Web Geliştirme Stajyeri',
          company: 'Key Yazılım Çözümleri',
          text:
            'Modern web arayüzlerinin tasarım, geliştirme ve canlıya alınma süreçlerinde aktif rol aldım.',
        },
      ],
    },
    skills: {
      eyebrow: 'Teknik araç kutusu',
      title: 'Probleme göre doğru aracı seçiyorum.',
      groups: [
        {
          title: 'Yapay zeka ve veri',
          items: ['TensorFlow', 'Keras', 'Scikit-Learn', 'Pandas', 'NumPy', 'OpenCV'],
        },
        {
          title: 'Programlama',
          items: ['Python', 'Java', 'JavaScript', 'Verilog'],
        },
        {
          title: 'Web ve üretim',
          items: ['React', 'HTML5', 'CSS3', 'Git', 'GitHub'],
        },
      ],
    },
    contact: {
      eyebrow: 'İletişim',
      title: 'Bir fikir, proje veya iş birliği için konuşalım.',
      description:
        'Yapay zeka, web geliştirme ve üretmekte olduğum projeler hakkında benimle doğrudan iletişime geçebilirsin.',
      emailLabel: 'E-posta',
      email: 'yyavuzsarac@gmail.com',
      linkedinLabel: 'LinkedIn',
      linkedin: 'linkedin.com/in/myavuzsarac',
    },
    footer: {
      eyebrow: 'Yeni bir fikir mi var?',
      title: 'Bir sonraki ürünü birlikte düşünelim.',
      text:
        'Yapay zeka, web geliştirme ve öğrenci projeleri üzerine konuşmaya her zaman açığım.',
      action: 'GitHub üzerinden ulaş',
      back: 'Başa dön',
      note: 'Yavuz Saraç · Tasarlandı ve geliştirildi',
    },
  },
  en: {
    nav: {
      about: 'About',
      work: 'Projects',
      journey: 'Experience',
      skills: 'Skills',
      contact: 'Contact',
    },
    hero: {
      eyebrow: 'Computer engineering student · AI developer',
      title: 'I turn ideas into',
      titleAccent: 'products that work.',
      description:
        'I combine artificial intelligence, computer vision and modern web technologies to build products focused on real-world problems.',
      projects: 'Explore projects',
      github: 'My GitHub profile',
      locationLabel: 'Based in',
      location: 'Ankara, Türkiye',
      focusLabel: 'Focus',
      focus: 'AI · Computer Vision · Web',
      statusLabel: 'Status',
      status: 'Open to new ideas',
      scroll: 'Explore',
    },
    about: {
      eyebrow: 'My story',
      title: 'A journey driven by curiosity and shaped through building.',
      intro:
        'My technical journey is not only about the tools I use. It is driven by a desire to apply what I learn to real problems.',
      note:
        'I coordinate education and project work in the university AI community, where I teach Python and machine learning.',
      stats: [
        ['7+', 'Completed projects'],
        ['2', 'Industry experiences'],
        ['C1', 'English proficiency'],
      ],
      chapters: [
        {
          number: '01',
          title: 'Beginnings and education',
          paragraphs: [
            'Hello, I am Yavuz, a third-year Computer Engineering student at Ankara Medipol University. Driven by my passion for technology, I continuously improve my software development skills and build projects that create value, particularly in artificial intelligence and web technologies.',
            'I began my education in Ankara, where I was born and raised. After spending a short period in Van, I returned to Ankara and continued my studies. I completed primary school at Gülten Kösemen Primary School and strengthened my English foundation at an early age through programs offered by the Montessori Foundation and other institutions. After Gaziosmanpaşa Necla İlhan İpekçi Middle School, I placed in the top 7% in the LGS entrance exam and attended Yavuz Sultan Selim Anatolian High School, graduating with an average of 90.9. My 2023 YKS result led me to Ankara Medipol University, where I currently continue my academic life with a 2.85 GPA.',
          ],
        },
        {
          number: '02',
          title: 'Building with the web',
          paragraphs: [
            'During my first year at university, I focused mainly on web development and built several projects using Java, JavaScript, HTML/CSS and React. To turn this theoretical knowledge into practical experience, I joined Key Software Solutions as a volunteer intern during the summer before my second year. Over approximately six weeks, I gained valuable industry experience in the design, development and deployment of websites.',
          ],
        },
        {
          number: '03',
          title: 'Moving into artificial intelligence',
          paragraphs: [
            'In my second year, I shifted my career focus toward one of my strongest interests: artificial intelligence. Using Python as my foundation, I began specializing in libraries such as NumPy, Pandas, Scikit-Learn and TensorFlow/Keras. I strengthened my technical background in machine learning, deep learning, natural language processing and computer vision. At the end of my second year, my internship at Lotec gave me the opportunity to integrate this knowledge into real-world projects.',
          ],
        },
        {
          number: '04',
          title: 'Sharing what I learn',
          paragraphs: [
            'Alongside my academic and professional growth, I care deeply about sharing knowledge. As an active member of the Education and Projects department on the board of Ankara Medipol University’s Artificial Intelligence Community, I coordinated the team providing Python and machine learning training to fellow students and worked as an instructor. I continue to follow emerging technologies and contribute to this ecosystem.',
          ],
        },
      ],
    },
    work: {
      eyebrow: 'Selected work',
      title: 'Beyond code: projects shaped into solutions.',
      description:
        'Each project approaches a different problem with a different technical perspective.',
      filters: {
        all: 'All',
        ai: 'Artificial intelligence',
        web: 'Web',
      },
      inspect: 'View project',
      close: 'Close project details',
      challenge: 'Purpose',
      highlights: 'Highlights',
      github: 'GitHub repository',
      live: 'Open live project',
    },
    journey: {
      eyebrow: 'The journey',
      title: 'From theory to real-world problems.',
      description:
        'Every experience has added a new perspective to the products I build today.',
      items: [
        {
          date: '2025 — Present',
          role: 'Instructor · Education and Projects',
          company: 'Ankara Medipol University AI Community',
          text:
            'I teach Python and machine learning while coordinating student projects from early ideas to working applications.',
        },
        {
          date: 'Aug — Sep 2025',
          role: 'Artificial Intelligence Intern',
          company: 'Lotec Company',
          text:
            'I developed anomaly detection models for industrial sensor data and managed their testing workflows.',
        },
        {
          date: 'Jul — Sep 2024',
          role: 'Web Development Intern',
          company: 'Key Software Solutions',
          text:
            'I contributed to the design, development and deployment of modern web interfaces.',
        },
      ],
    },
    skills: {
      eyebrow: 'Technical toolkit',
      title: 'I choose the right tool for the problem.',
      groups: [
        {
          title: 'AI and data',
          items: ['TensorFlow', 'Keras', 'Scikit-Learn', 'Pandas', 'NumPy', 'OpenCV'],
        },
        {
          title: 'Programming',
          items: ['Python', 'Java', 'JavaScript', 'Verilog'],
        },
        {
          title: 'Web and delivery',
          items: ['React', 'HTML5', 'CSS3', 'Git', 'GitHub'],
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Let us talk about an idea, project or collaboration.',
      description:
        'You can reach me directly to discuss artificial intelligence, web development or the projects I am building.',
      emailLabel: 'Email',
      email: 'yyavuzsarac@gmail.com',
      linkedinLabel: 'LinkedIn',
      linkedin: 'linkedin.com/in/myavuzsarac',
    },
    footer: {
      eyebrow: 'Have a new idea?',
      title: 'Let us think about the next product together.',
      text:
        'I am always open to conversations about AI, web development and student projects.',
      action: 'Reach me on GitHub',
      back: 'Back to top',
      note: 'Yavuz Saraç · Designed and developed',
    },
  },
};

const projects = [
  {
    id: 'vibot',
    category: ['ai', 'web'],
    image: '/vibot_logo.png',
    links: {
      github: 'https://github.com/yavuzsarac/ViBot',
      live: 'https://vibot10.streamlit.app/',
    },
    tr: {
      title: 'ViBot',
      summary: 'Uzun YouTube videolarını saniyeler içinde anlaşılır özetlere dönüştüren yapay zeka ürünü.',
      purpose:
        'Kullanıcıların uzun videolardaki önemli bilgilere, videonun tamamını izlemek zorunda kalmadan ulaşmasını sağlamak.',
      highlights: ['Otomatik ses ve metin işleme', 'LLM tabanlı anlamlı özetler', 'Hızlı web arayüzü'],
      tags: ['LLM', 'NLP', 'Python', 'Web'],
    },
    en: {
      title: 'ViBot',
      summary: 'An AI product that turns long YouTube videos into clear summaries in seconds.',
      purpose:
        'Help users reach the key information in long videos without having to watch the entire recording.',
      highlights: ['Automated audio and text processing', 'LLM-powered summaries', 'Fast web interface'],
      tags: ['LLM', 'NLP', 'Python', 'Web'],
    },
  },
  {
    id: 'nebu',
    category: ['ai'],
    image: '/nebu_logo.png',
    links: {
      github: 'https://github.com/yavuzsarac/NeBu-Backend',
      live: 'https://play.google.com/store/apps/details?id=com.yavuzsarac.mobile&hl=tr',
    },
    tr: {
      title: 'NeBu',
      summary: 'Görme engelli kullanıcılar için çevreyi analiz edip sesli olarak betimleyen mobil deneyim.',
      purpose:
        'Telefon kamerasını, çevredeki nesne ve metinleri anlaşılır biçimde anlatan erişilebilir bir yardımcıya dönüştürmek.',
      highlights: ['Gerçek zamanlı nesne tespiti', 'Görüntüden metne ve sese akış', 'Erişilebilir mobil arayüz'],
      tags: ['Computer Vision', 'Mobile', 'AI'],
    },
    en: {
      title: 'NeBu',
      summary: 'A mobile experience that analyzes and describes the environment for visually impaired users.',
      purpose:
        'Turn a phone camera into an accessible assistant that clearly describes nearby objects and text.',
      highlights: ['Real-time object detection', 'Image-to-text-to-speech flow', 'Accessible mobile interface'],
      tags: ['Computer Vision', 'Mobile', 'AI'],
    },
  },
  {
    id: '1d-anomali',
    category: ['ai'],
    image: '/1d-anomali_logo.png',
    links: {
      github: 'https://github.com/yavuzsarac/sensor-anomaly-detector',
    },
    tr: {
      title: '1D Anomali Tespiti',
      summary: 'Tek kanallı titreşim verilerinden sistem anormalliklerini yakalayan derin öğrenme modeli.',
      purpose:
        'Endüstriyel sistemlerde olağan dışı titreşim kalıplarını erken aşamada tespit etmek.',
      highlights: ['Zaman serisi analizi', 'Keras tabanlı mimari', 'Gerçek sensör verileri'],
      tags: ['Keras', 'Time Series', 'Deep Learning'],
    },
    en: {
      title: '1D Anomaly Detection',
      summary: 'A deep learning model that detects system anomalies in single-channel vibration data.',
      purpose:
        'Detect unusual vibration patterns in industrial systems before they become critical failures.',
      highlights: ['Time-series analysis', 'Keras-based architecture', 'Real sensor data'],
      tags: ['Keras', 'Time Series', 'Deep Learning'],
    },
  },
  {
    id: '3d-anomali',
    category: ['ai'],
    image: '/3d-anomali_logo.png',
    tr: {
      title: '3D Anomali Tespiti',
      summary: 'Üç eksenli sensör verilerindeki karmaşık anomalileri analiz eden çok kanallı model.',
      purpose:
        'Birden fazla eksenden gelen hareket verisini birlikte değerlendirerek daha hassas arıza sinyalleri üretmek.',
      highlights: ['Çok kanallı veri analizi', 'Özellik çıkarımı', 'Endüstriyel kullanım senaryosu'],
      tags: ['Data Analysis', 'Keras', 'Time Series'],
    },
    en: {
      title: '3D Anomaly Detection',
      summary: 'A multi-channel model for analyzing complex anomalies in three-axis sensor data.',
      purpose:
        'Evaluate motion data from multiple axes together to produce more precise failure signals.',
      highlights: ['Multi-channel analysis', 'Feature extraction', 'Industrial use case'],
      tags: ['Data Analysis', 'Keras', 'Time Series'],
    },
  },
  {
    id: 'yuz-kirpma',
    category: ['ai'],
    image: '/yuz-kirpma_logo.png',
    tr: {
      title: 'Otomatik Yüz Kırpma',
      summary: 'Fotoğraflardaki yüzleri tespit edip veri setine uygun biçimde otomatik hazırlayan sistem.',
      purpose:
        'Yüz tanıma modelleri için büyük görsel veri setlerini hızlı ve tutarlı biçimde ön işlemek.',
      highlights: ['Toplu görsel işleme', 'Farklı açı ve ışık desteği', 'Otomatik boyutlandırma'],
      tags: ['OpenCV', 'TensorFlow', 'Vision'],
    },
    en: {
      title: 'Automatic Face Cropping',
      summary: 'A system that detects faces and automatically prepares them for training datasets.',
      purpose:
        'Preprocess large image datasets quickly and consistently for face recognition models.',
      highlights: ['Batch image processing', 'Lighting and angle support', 'Automatic resizing'],
      tags: ['OpenCV', 'TensorFlow', 'Vision'],
    },
  },
  {
    id: 'foto-siniflandirma',
    category: ['ai'],
    image: '/foto-siniflandirma_logo.png',
    tr: {
      title: 'Görüntü Sınıflandırma',
      summary: 'Görselleri nesne veya kategori bazında sınıflandıran CNN tabanlı derin öğrenme ağı.',
      purpose:
        'Otonom sistemler ve görsel arama deneyimleri için yeniden kullanılabilir bir sınıflandırma altyapısı oluşturmak.',
      highlights: ['CNN mimarisi', 'Veri artırma teknikleri', 'Uçtan uca eğitim akışı'],
      tags: ['CNN', 'TensorFlow', 'Deep Learning'],
    },
    en: {
      title: 'Image Classification',
      summary: 'A CNN-based deep learning network that classifies images by object or category.',
      purpose:
        'Create a reusable classification foundation for autonomous systems and visual search experiences.',
      highlights: ['CNN architecture', 'Data augmentation', 'End-to-end training pipeline'],
      tags: ['CNN', 'TensorFlow', 'Deep Learning'],
    },
  },
  {
    id: 'turkiye-harita',
    category: ['web'],
    image: '/turkiye-harita_logo.png',
    links: {
      github: 'https://github.com/yavuzsarac/turkiye-map',
    },
    tr: {
      title: 'Etkileşimli Türkiye Haritası',
      summary: 'İlleri keşfetmeyi ve ilgili kaynaklara ulaşmayı kolaylaştıran dinamik React arayüzü.',
      purpose:
        'Bölgesel bilgileri görsel, hızlı ve mobil uyumlu bir keşif deneyimi içinde sunmak.',
      highlights: ['Tıklanabilir SVG harita', 'Dinamik React içeriği', 'Mobil uyumlu yapı'],
      tags: ['React', 'JavaScript', 'Web'],
    },
    en: {
      title: 'Interactive Türkiye Map',
      summary: 'A dynamic React interface for exploring cities and reaching related resources.',
      purpose:
        'Present regional information through a visual, fast and mobile-friendly discovery experience.',
      highlights: ['Interactive SVG map', 'Dynamic React content', 'Responsive layout'],
      tags: ['React', 'JavaScript', 'Web'],
    },
  },
  {
    id: 'resumematch-ai',
    category: ['ai', 'web'],
    image: '/resumematch-ai.png',
    imageFit: 'contain',
    links: {
      github: 'https://github.com/yavuzsarac/resumematchai',
    },
    tr: {
      title: 'ResumeMatch AI',
      summary:
        'CV ile iş ilanı arasındaki uyumu; ATS puanı, beceri eşleşmesi ve yapay zeka destekli önerilerle analiz eden full-stack platform.',
      purpose:
        'İş arayanların CV’lerini hedefledikleri pozisyona göre nesnel biçimde değerlendirmelerini sağlamak. Kullanıcı PDF, DOCX veya TXT formatındaki CV’sini yükleyip iş ilanını eklediğinde sistem; eşleşen ve eksik becerileri, anlamsal benzerliği ve ağırlıklı ATS puanını hesaplayarak kişiselleştirilmiş geliştirme önerileri üretir.',
      highlights: [
        'Next.js, TypeScript ve Tailwind CSS ile modern iki dilli arayüz',
        'FastAPI, SQLAlchemy ve PostgreSQL tabanlı full-stack mimari',
        'JWT kimlik doğrulama ve kullanıcıya özel analiz geçmişi',
        'PDF, DOCX ve TXT dosyalarını kalıcı olarak saklamadan ayrıştırma',
        'Beceri açığı, anlamsal benzerlik ve ATS skor analizi',
      ],
      tags: ['Next.js', 'FastAPI', 'PostgreSQL', 'NLP'],
    },
    en: {
      title: 'ResumeMatch AI',
      summary:
        'A full-stack platform that evaluates resume and job-description fit through ATS scoring, skill matching and AI-assisted feedback.',
      purpose:
        'Help job seekers evaluate and improve their resumes for a specific role with clear, objective signals. After a user uploads a PDF, DOCX or TXT resume and adds a job description, the platform calculates matched and missing skills, semantic similarity and a weighted ATS score before producing personalized improvement suggestions.',
      highlights: [
        'Modern bilingual interface built with Next.js, TypeScript and Tailwind CSS',
        'Full-stack architecture powered by FastAPI, SQLAlchemy and PostgreSQL',
        'JWT authentication and private analysis history for each user',
        'In-memory parsing for PDF, DOCX and TXT files without permanent storage',
        'Skill-gap, semantic similarity and ATS score analysis',
      ],
      tags: ['Next.js', 'FastAPI', 'PostgreSQL', 'NLP'],
    },
  },
];

function Reveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('is-visible');
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`demo-reveal ${className}`}>
      {children}
    </div>
  );
}

function Portfolio() {
  const [language, setLanguage] = useState(() => localStorage.getItem('portfolio-language') || 'tr');
  const [filter, setFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);
  const [activeSection, setActiveSection] = useState('about');
  const heroRef = useRef(null);
  const t = copy[language];

  const filteredProjects = useMemo(
    () => projects.filter((project) => filter === 'all' || project.category.includes(filter)),
    [filter],
  );
  const visibleProjectCount = filteredProjects.length;
  const totalProjectCount = projects.length;

  useEffect(() => {
    document.body.classList.add('demo-active');
    document.documentElement.lang = language;
    document.title = language === 'tr' ? 'Yavuz Saraç · Portföy' : 'Yavuz Saraç · Portfolio';
    localStorage.setItem('portfolio-language', language);

    return () => {
      document.body.classList.remove('demo-active');
    };
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? window.scrollY / height : 0;
      document.documentElement.style.setProperty('--demo-scroll', progress);

      const sections = ['about', 'work', 'journey', 'skills', 'contact'];
      const current =
        sections
          .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity }))
          .filter((item) => item.top <= 180)
          .at(-1)?.id || 'about';
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeProject ? 'hidden' : '';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveProject(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [activeProject]);

  const moveHero = (event) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroRef.current.style.setProperty('--pointer-x', `${x * 14}px`);
    heroRef.current.style.setProperty('--pointer-y', `${y * 10}px`);
  };

  const resetHero = () => {
    heroRef.current?.style.setProperty('--pointer-x', '0px');
    heroRef.current?.style.setProperty('--pointer-y', '0px');
  };

  return (
    <div className="portfolio-demo">
      <div className="demo-progress" aria-hidden="true" />

      <header className="demo-nav">
        <a className="demo-brand" href="#top" aria-label="Yavuz Saraç">
          YS<span>.</span>
        </a>

        <nav className="demo-nav-links" aria-label="Portfolio">
          {Object.entries(t.nav).map(([id, label]) => (
            <a key={id} className={activeSection === id ? 'is-active' : ''} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <div className="language-switch" aria-label="Language">
          <button
            type="button"
            className={language === 'tr' ? 'is-active' : ''}
            aria-pressed={language === 'tr'}
            onClick={() => setLanguage('tr')}
          >
            TR
          </button>
          <button
            type="button"
            className={language === 'en' ? 'is-active' : ''}
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
        </div>
      </header>

      <main key={language} className="demo-language-layer">
        <section
          id="top"
          ref={heroRef}
          className="demo-hero"
          onPointerMove={moveHero}
          onPointerLeave={resetHero}
        >
          <div className="hero-lines" aria-hidden="true">
            {Array.from({ length: 7 }, (_, index) => (
              <span key={`vertical-${index}`} className="line-vertical" />
            ))}
            {Array.from({ length: 4 }, (_, index) => (
              <span key={`horizontal-${index}`} className="line-horizontal" />
            ))}
          </div>

          <div className="hero-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="demo-shell hero-content">
            <div className="hero-copy">
              <p className="demo-eyebrow">{t.hero.eyebrow}</p>
              <h1>
                {t.hero.title}
                <span>{t.hero.titleAccent}</span>
              </h1>
              <p className="hero-description">{t.hero.description}</p>
              <div className="hero-actions">
                <a className="demo-button demo-button-primary" href="#work">
                  {t.hero.projects} <span aria-hidden="true">↓</span>
                </a>
                <a
                  className="demo-button demo-button-secondary"
                  href="https://github.com/yavuzsarac"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.hero.github} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="portrait-index">01 / 04</div>
              <div className="portrait-frame">
                <img src="/profil.png" alt="" />
              </div>
              <div className="portrait-caption">YAVUZ SARAÇ · 2026</div>
            </div>

            <div className="hero-meta">
              <div>
                <span>{t.hero.locationLabel}</span>
                <strong>{t.hero.location}</strong>
              </div>
              <div>
                <span>{t.hero.focusLabel}</span>
                <strong>{t.hero.focus}</strong>
              </div>
              <div>
                <span>{t.hero.statusLabel}</span>
                <strong className="status-line">{t.hero.status}</strong>
              </div>
            </div>
          </div>

          <a className="scroll-cue" href="#about">
            <span>{t.hero.scroll}</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <section id="about" className="demo-section about-section">
          <div className="demo-shell">
            <div className="about-heading-row">
              <Reveal className="section-heading about-heading">
                <p className="demo-eyebrow">{t.about.eyebrow}</p>
                <h2>{t.about.title}</h2>
                <p className="about-intro">{t.about.intro}</p>
              </Reveal>

              <Reveal className="about-stats">
                {t.about.stats.map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </Reveal>
            </div>

            <div className="biography-layout">
              <Reveal className="biography-aside">
                <span className="biography-code">PROFILE / 04</span>
                <p>{t.about.note}</p>
                <div className="biography-track" aria-hidden="true">
                  {t.about.chapters.map((chapter) => (
                    <span key={chapter.number}>{chapter.number}</span>
                  ))}
                </div>
              </Reveal>

              <div className="biography-content">
                {t.about.chapters.map((chapter) => (
                  <Reveal key={chapter.number} className="biography-chapter">
                    <div className="biography-chapter-heading">
                      <span>{chapter.number}</span>
                      <h3>{chapter.title}</h3>
                    </div>
                    <div className="biography-paragraphs">
                      {chapter.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="demo-section work-section">
          <div className="demo-shell">
            <Reveal className="section-heading work-heading">
              <div>
                <p className="demo-eyebrow">{t.work.eyebrow}</p>
                <h2>{t.work.title}</h2>
              </div>
              <p>{t.work.description}</p>
            </Reveal>

            <Reveal className="project-toolbar">
              <div className="project-filters" aria-label="Project filters">
                {Object.entries(t.work.filters).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={filter === id ? 'is-active' : ''}
                    aria-pressed={filter === id}
                    onClick={() => setFilter(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <span>
                {String(visibleProjectCount).padStart(2, '0')} / {String(totalProjectCount).padStart(2, '0')}
              </span>
            </Reveal>

            <div className="demo-project-grid">
              {filteredProjects.map((project, index) => {
                const content = project[language];
                return (
                  <Reveal key={project.id} className="project-reveal">
                    <button
                      type="button"
                      className="demo-project-card"
                      onClick={() => setActiveProject(project)}
                    >
                      <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
                      <div className={`project-media ${project.imageFit === 'contain' ? 'is-contain' : ''}`}>
                        <img src={project.image} alt={content.title} />
                      </div>
                      <div className="project-card-copy">
                        <h3>{content.title}</h3>
                        <p>{content.summary}</p>
                        <div className="project-card-footer">
                          <span>{content.tags.slice(0, 2).join(' · ')}</span>
                          <strong>{t.work.inspect} <i aria-hidden="true">↗</i></strong>
                        </div>
                      </div>
                    </button>
                  </Reveal>
                );
              })}

            </div>
          </div>
        </section>

        <section id="journey" className="demo-section journey-section">
          <div className="demo-shell">
            <Reveal className="section-heading journey-heading">
              <p className="demo-eyebrow">{t.journey.eyebrow}</p>
              <h2>{t.journey.title}</h2>
              <p>{t.journey.description}</p>
            </Reveal>

            <div className="journey-list">
              {t.journey.items.map((item, index) => (
                <Reveal key={item.date} className="journey-item">
                  <span className="journey-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="journey-date">{item.date}</span>
                  <div>
                    <h3>{item.role}</h3>
                    <h4>{item.company}</h4>
                  </div>
                  <p>{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="demo-section skills-section">
          <div className="demo-shell">
            <Reveal className="section-heading skills-heading">
              <p className="demo-eyebrow">{t.skills.eyebrow}</p>
              <h2>{t.skills.title}</h2>
            </Reveal>

            <div className="skills-grid">
              {t.skills.groups.map((group, index) => (
                <Reveal key={group.title} className="skill-group">
                  <div className="skill-group-title">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{group.title}</h3>
                  </div>
                  <div className="skill-cloud">
                    {group.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="demo-section contact-section">
          <div className="demo-shell contact-layout">
            <Reveal className="section-heading contact-heading">
              <p className="demo-eyebrow">{t.contact.eyebrow}</p>
              <h2>{t.contact.title}</h2>
              <p>{t.contact.description}</p>
            </Reveal>

            <Reveal className="contact-links">
              <a href={`mailto:${t.contact.email}`}>
                <span>{t.contact.emailLabel}</span>
                <strong>{t.contact.email}</strong>
                <i aria-hidden="true">↗</i>
              </a>
              <a href="https://linkedin.com/in/myavuzsarac" target="_blank" rel="noreferrer">
                <span>{t.contact.linkedinLabel}</span>
                <strong>{t.contact.linkedin}</strong>
                <i aria-hidden="true">↗</i>
              </a>
            </Reveal>
          </div>
        </section>

        <footer className="demo-footer">
          <div className="demo-shell">
            <Reveal>
              <p className="demo-eyebrow">{t.footer.eyebrow}</p>
              <h2>{t.footer.title}</h2>
              <p>{t.footer.text}</p>
              <a
                className="demo-button demo-button-primary"
                href="https://github.com/yavuzsarac"
                target="_blank"
                rel="noreferrer"
              >
                {t.footer.action} <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} · {t.footer.note}</span>
              <a href="#top">{t.footer.back} ↑</a>
            </div>
          </div>
        </footer>
      </main>

      {activeProject && (
        <div
          className="project-dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveProject(null);
          }}
        >
          <div className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title">
            <button
              type="button"
              className="dialog-close"
              aria-label={t.work.close}
              onClick={() => setActiveProject(null)}
            >
              ×
            </button>
            <div className={`dialog-media ${activeProject.imageFit === 'contain' ? 'is-contain' : ''}`}>
              <img src={activeProject.image} alt={activeProject[language].title} />
            </div>
            <div className="dialog-content">
              <p className="demo-eyebrow">{activeProject[language].tags.join(' · ')}</p>
              <h2 id="project-dialog-title">{activeProject[language].title}</h2>
              <p className="dialog-summary">{activeProject[language].summary}</p>
              <h3>{t.work.challenge}</h3>
              <p>{activeProject[language].purpose}</p>
              <h3>{t.work.highlights}</h3>
              <ul>
                {activeProject[language].highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              {activeProject.links && (
                <div className="dialog-actions">
                  {activeProject.links.github && (
                    <a href={activeProject.links.github} target="_blank" rel="noreferrer">
                      {t.work.github} ↗
                    </a>
                  )}
                  {activeProject.links.live && (
                    <a href={activeProject.links.live} target="_blank" rel="noreferrer">
                      {t.work.live} ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
