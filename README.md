# Reresume - AI-Powered Resume Feedback Tool

🌐 **Live Demo:** [https://ai-reresume.vercel.app](https://ai-reresume.vercel.app)

Merhaba! Bu proje, CV'lerinizi yükleyip AI ile detaylı geri bildirim alabileceğiniz bir web uygulaması. İş başvurularınız için CV'nizi optimize etmenize yardımcı oluyor.

## Neden Bu Projeyi Yaptım?

İş başvurularında CV'nin ne kadar önemli olduğunu biliyorum. ATS sistemlerinden geçmek, doğru formatı kullanmak, içeriği optimize etmek... Bunların hepsi zaman alıyor ve çoğu zaman neyin eksik olduğunu anlamak zor. Bu yüzden AI'ı kullanarak otomatik bir feedback sistemi yapmaya karar verdim.

## Teknoloji Seçimlerim

### React Router 7
Full-stack React uygulaması için React Router kullandım. Server-side rendering desteği, kolay routing ve modern React patterns'i bir arada sunuyor. TypeScript ile birlikte type-safe bir geliştirme ortamı sağlıyor.

### Puter Platform
Backend işlemleri için Puter'ı seçtim çünkü:
- **Hızlı prototipleme**: Backend kurulumu, database yapılandırması gibi işlerle uğraşmadan direkt geliştirmeye başlayabiliyorum
- **Dosya yönetimi**: CV'leri ve görselleri yüklemek, saklamak için hazır bir file system API'si var
- **AI entegrasyonu**: Claude AI'ı direkt kullanabiliyorum, ayrı bir API key yönetimi gerekmiyor
- **Authentication**: Kullanıcı girişi için hazır auth sistemi
- **KV Store**: Basit veri saklama için key-value store

Kısacası, backend altyapısıyla uğraşmak yerine direkt ürün geliştirmeye odaklanmak istedim. Puter bunu mümkün kıldı.

### Tailwind CSS
Hızlı ve tutarlı UI geliştirmek için Tailwind kullandım. Utility-first yaklaşımı sayesinde custom CSS yazmadan hızlıca arayüz oluşturabiliyorum.

### Zustand
State management için Zustand seçtim. Redux'a göre çok daha hafif ve basit. Puter store'u için ideal bir çözüm oldu.

### jsPDF
Feedback raporlarını PDF olarak indirmek için jsPDF kullandım. Client-side PDF oluşturma yapıyor, backend'e ihtiyaç duymuyor.

## Proje Yapısı

```
app/
├── components/          # React bileşenleri
│   ├── feedback/       # Feedback gösterim bileşenleri
│   └── ...
├── lib/                # Utility fonksiyonları
│   ├── puter.ts       # Puter store ve API wrapper'ları
│   ├── generateFeedbackPdf.ts  # PDF oluşturma
│   └── pdf2img.ts     # PDF'den görsel çıkarma
├── routes/            # Sayfa route'ları
│   ├── home.tsx       # Ana sayfa (CV listesi)
│   ├── upload.tsx     # CV yükleme sayfası
│   ├── resume.tsx     # Feedback görüntüleme sayfası
│   └── auth.tsx       # Giriş sayfası
└── ...
```

## Nasıl Çalışıyor?

1. **CV Yükleme**: Kullanıcı PDF formatında CV'sini yüklüyor, şirket adı, pozisyon ve iş tanımı giriyor
2. **AI Analizi**: CV, Puter'ın AI servisi üzerinden Claude'a gönderiliyor ve detaylı feedback alınıyor
3. **Feedback Gösterimi**: 
   - Overall score ve kategori skorları (Tone & Style, Content, Structure, Skills)
   - ATS uyumluluk skoru
   - Güçlü yönler ve iyileştirme alanları
   - Detaylı öneriler ve tips
4. **PDF İndirme**: Tüm feedback detaylı bir PDF raporu olarak indirilebiliyor

## Özellikler

- ✅ PDF CV yükleme ve görselleştirme
- ✅ AI-powered detaylı feedback analizi
- ✅ ATS uyumluluk skoru
- ✅ Kategori bazlı değerlendirme (Tone & Style, Content, Structure, Skills)
- ✅ Detaylı PDF rapor indirme
- ✅ Kullanıcı bazlı CV takibi
- ✅ Kullanım limiti göstergesi

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build
```

## Puter Kurulumu

Bu proje Puter platformunu kullanıyor. Puter SDK'sı browser'da otomatik yükleniyor (`root.tsx` içinde script tag'i var). Giriş yapmak için Puter hesabı gerekiyor.

## Notlar

- CV'ler Puter'ın file system'inde saklanıyor
- Feedback verileri KV store'da tutuluyor
- AI analizi için Puter'ın Claude entegrasyonu kullanılıyor
- Tüm işlemler client-side'da gerçekleşiyor, ayrı bir backend server'a ihtiyaç yok

## Gelecek Planlar

- [ ] CV'leri düzenleme özelliği
- [ ] Birden fazla CV karşılaştırma
- [ ] CV şablonları
- [ ] Daha detaylı ATS optimizasyon önerileri

---

Bu projeyi geliştirirken öğrendiğim en önemli şey: Bazen en iyi çözüm, en karmaşık olan değil, en hızlı prototip yapmanıza izin veren çözümdür. Puter sayesinde backend karmaşası olmadan direkt ürün geliştirmeye odaklanabildim.
