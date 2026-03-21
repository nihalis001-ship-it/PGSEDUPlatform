import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Search, 
  Info, 
  Briefcase, 
  Users, 
  AlertTriangle, 
  Clock, 
  Plane, 
  ChevronRight,
  Filter,
  X,
  FileText,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Language, translations } from '../i18n';

interface ReferenceItem {
  id: string;
  category: string;
  title: string;
  content: string;
  details?: string[];
  icon: any;
  color: string;
  image?: string;
}

export const QuickReference = ({ lang }: { lang: Language }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<ReferenceItem | null>(null);

  const referenceData: ReferenceItem[] = [
    {
      id: 'checkin-times',
      category: t.checkInRules,
      title: lang === 'tr' ? 'Check-in Zamanları' : 'Check-in Times',
      content: lang === 'tr' ? 'Açılış ve Kapanış' : 'Opening and Closing',
      details: lang === 'tr'
        ? [
            'Kontuar Açılış: STD-2 Saat',
            'Yurt İçi Kapanış: STD-45 Dakika',
            'Yurt Dışı Kapanış: STD-60 Dakika',
            'Kiosk ve Mobil işlemler de aynı sürelerde kapanır'
          ]
        : [
            'Counter Opening: STD-2 Hours',
            'Domestic Closing: STD-45 Minutes',
            'International Closing: STD-60 Minutes',
            'Kiosk and Mobile check-in close at the same time'
          ],
      icon: Clock,
      color: 'bg-emerald-700',
      image: 'https://picsum.photos/seed/checkin/400/300'
    },
    {
      id: 'no-custom-clearance',
      category: t.generalRules,
      title: 'No Custom Clearance',
      content: lang === 'tr' ? 'Gümrük İşlemi Olmayan İstasyonlar' : 'Stations without Custom Clearance',
      details: [
        'VAN, MARDİN(MQM), BATMAN(BAL), MUŞ(MSR)',
        'MERZİFON(MZH), BİNGÖL(BGG), AĞRI(AJI)',
        'ŞIRNAK(NKT), IĞDIR(IGD), ÇANAKKALE(CKZ), ADIYAMAN(ADF)'
      ],
      icon: AlertTriangle,
      color: 'bg-amber-700',
      image: 'https://picsum.photos/seed/customs/400/300'
    },
    {
      id: 'seating-rules',
      category: t.checkInRules,
      title: lang === 'tr' ? 'Koltuk Seçim Kuralları' : 'Seat Assignment Rules',
      content: lang === 'tr' ? 'Emniyet ve Konfor' : 'Safety and Comfort',
      details: lang === 'tr'
        ? [
            'Acil Çıkış: PRM, hamile, <18, bebekli yolcular oturamaz',
            'Bebekler: Her üçlü koltuk sırasında max 1 bebek',
            'PETC: Ön sıra ve acil çıkış yasaktır, cam kenarı tercih edilir',
            'Service Dog: İlk sıra veya en ön tercih edilir',
            'INAD/Deporte: En arka koltuklar, diğer yolculardan ayrı'
          ]
        : [
            'Emergency Exit: No PRM, pregnant, <18, or infants',
            'Infants: Max 1 infant per triple seat row',
            'PETC: No front row or emergency exit, window preferred',
            'Service Dog: First row or front of aircraft preferred',
            'INAD/Deportee: Rear seats, separate from other passengers'
          ],
      icon: Users,
      color: 'bg-blue-700',
      image: 'https://picsum.photos/seed/seating/400/300'
    },
    {
      id: 'through-checkin',
      category: t.checkInRules,
      title: 'Through Check-in',
      content: lang === 'tr' ? 'Bağlantılı Uçuş İşlemleri' : 'Connecting Flight Procedures',
      details: lang === 'tr'
        ? [
            'Minimum bağlantı süresi: 90 Dakika',
            '24 saat içindeki farklı PNR\'lar birleştirilebilir',
            'Bagajlar son noktaya kadar etiketlenebilir (Poolled)',
            'Ek bagaj ücreti her uçuş için ayrı hesaplanır'
          ]
        : [
            'Minimum connection time: 90 Minutes',
            'Different PNRs within 24 hours can be merged',
            'Baggage can be pooled to the final destination',
            'Excess baggage fee calculated separately for each flight'
          ],
      icon: Plane,
      color: 'bg-indigo-400',
      image: 'https://picsum.photos/seed/transit/400/300'
    },
    {
      id: 'boarding-rules',
      category: t.boardingProcedures,
      title: 'Boarding Kuralları',
      content: lang === 'tr' ? 'Zamanlama ve Öncelik' : 'Timing and Priority',
      details: lang === 'tr'
        ? [
            'Boarding bitişi: STD-20 Dakika (Hedef)',
            'Zone Boarding: Tüm körüklü uçuşlarda önerilir',
            'Pre-boarding: UM, PRM, bebekli aileler için',
            'Yakıt alımı: SAW ve ADB\'de itfaiye eşliğinde boarding yapılabilir',
            'Limit dışı kabin bagajı: Kapıda etiketlenip ambara verilir'
          ]
        : [
            'Boarding end: STD-20 Minutes (Target)',
            'Zone Boarding: Recommended for all bridge positions',
            'Pre-boarding: For UM, PRM, families with infants',
            'Refuelling: Boarding allowed with Fire Service at SAW/ADB',
            'Oversized cabin bag: Tagged at gate and loaded to hold'
          ],
      icon: Plane,
      color: 'bg-orange-600',
      image: 'https://picsum.photos/seed/boarding/400/300'
    },
    {
      id: 'travel-docs-domestic',
      category: t.travelDocuments,
      title: lang === 'tr' ? 'Yurt İçi Belgeler' : 'Domestic Documents',
      content: lang === 'tr' ? 'Kabul Edilen Kimlikler' : 'Accepted Identifications',
      details: lang === 'tr'
        ? [
            'Nüfus Cüzdanı / T.C. Kimlik Kartı',
            'Sürücü Belgesi (Ehliyet)',
            'Pasaport veya pasaport yerine geçen belgeler',
            'Evlilik Cüzdanı',
            'Resmi kurumlarca verilen soğuk damgalı kimlikler'
          ]
        : [
            'Identity Card / TR ID Card',
            'Driver\'s License',
            'Passport or substitute documents',
            'Marriage Certificate',
            'IDs issued by official institutions with photo'
          ],
      icon: FileText,
      color: 'bg-zinc-700',
      image: 'https://picsum.photos/seed/id-card/400/300'
    },
    {
      id: 'travel-docs-intl',
      category: t.travelDocuments,
      title: lang === 'tr' ? 'Yurt Dışı Belgeler' : 'International Documents',
      content: 'TIM / TIMATIC',
      details: lang === 'tr'
        ? [
            'Vize ve pasaport geçerliliği TIMATIC üzerinden kontrol edilmelidir',
            'Almanya: Pasaport 10 yıldan eski olmamalıdır',
            'Avrupa: Pasaport dönüşten itibaren en az 3 ay geçerli olmalıdır',
            'KKTC/Dış Hat: <18 tek başına uçuşlarda Muvafakatname zorunludur'
          ]
        : [
            'Visa and passport validity must be checked via TIMATIC',
            'Germany: Passport must not be older than 10 years',
            'Europe: Passport must be valid for 3 months from departure',
            'Intl/ECN: Consent letter mandatory for <18 traveling alone'
          ],
      icon: FileText,
      color: 'bg-zinc-900',
      image: 'https://picsum.photos/seed/passport/400/300'
    },
    {
      id: 'important-reminders',
      category: t.generalRules,
      title: lang === 'tr' ? 'Önemli Hatırlatmalar' : 'Important Reminders',
      content: lang === 'tr' ? 'Yaş ve Kimlik Kuralları' : 'Age and ID Rules',
      details: lang === 'tr'
        ? [
            '15 yaş üzeri: T.C. Kimlik Kartında fotoğraf zorunludur',
            'Bebek: 8 günlükten itibaren kabul edilir',
            'Çocuk: 2-12 yaş arası (13\'ten gün almamış)',
            'Şüpheli yolcu profili: Ortak akıl ve prosedüre göre reddedilebilir',
            'Jump Seat: Sadece görevli ekip veya yetkili personel içindir'
          ]
        : [
            'Age 15+: Photo is mandatory on TR ID card',
            'Infant: Accepted from 8 days old',
            'Child: Between 2-12 years old',
            'Suspicious profile: Can be rejected based on common sense',
            'Jump Seat: For operating crew or authorized personnel only'
          ],
      icon: AlertTriangle,
      color: 'bg-red-600',
      image: 'https://picsum.photos/seed/warning/400/300'
    },
    {
      id: 'companion-limits',
      category: t.specialPassengers,
      title: lang === 'tr' ? 'Grup Refakatçi Limitleri' : 'Group Companion Limits',
      content: lang === 'tr' ? 'PRM ve Çocuk Grupları' : 'PRM and Child Groups',
      details: lang === 'tr'
        ? [
            'Engelli Grubu (BLND hariç): 10 kişiye 1 refakatçi',
            'Görme Engelli (BLND) Grubu: 2 kişiye 1 refakatçi',
            'Çocuk Grubu: 12 çocuğa 1 yetişkin refakatçi',
            'Refakatçiler 18+ yaş, fiziksel/zihinsel olarak yeterli olmalıdır',
            'Refakatçiler refakat ettikleri yolcu ile yan yana oturmalıdır'
          ]
        : [
            'Handicapped Group (except BLND): 1 escort per 10 persons',
            'Blind (BLND) Group: 1 escort per 2 persons',
            'Child Group: 1 adult escort per 12 children',
            'Escorts must be 18+, physically and mentally capable',
            'Escorts must be seated with the passengers they escort'
          ],
      icon: Users,
      color: 'bg-indigo-600',
      image: 'https://picsum.photos/seed/group/400/300'
    },
    {
      id: 'notoc-form',
      category: t.dangerousGoods,
      title: 'NOTOC Formu',
      content: lang === 'tr' ? 'Kaptan Bilgilendirme Formu' : 'Notification to Captain',
      details: lang === 'tr'
        ? [
            'DGR, AVI, PER, HUM, COMAT ve silahlar için doldurulur',
            'Yükün tipi, ağırlığı ve hold (ambar) bilgisi belirtilmelidir',
            'Kaptana operasyon öncesi imzalatılmalıdır'
          ]
        : [
            'Filled for DGR, AVI, PER, HUM, COMAT and weapons',
            'Type, weight and hold info must be specified',
            'Must be signed by the Captain before operation'
          ],
      icon: FileText,
      color: 'bg-zinc-800',
      image: 'https://picsum.photos/seed/form/400/300'
    },
    {
      id: 'stroller-rules',
      category: t.baggageRules,
      title: lang === 'tr' ? 'Bebek Arabası / Oto Koltuğu' : 'Baby Stroller / Car Seat',
      content: lang === 'tr' ? 'Ücretsiz Taşıma Şartları' : 'Free Carriage Conditions',
      details: lang === 'tr'
        ? [
            'Bebek/Çocuk yolcu başına 1 adet ücretsiz (FOC)',
            'Birden fazla ekipman (Araba + Koltuk) varsa sadece biri ücretsizdir',
            'Kabin boy bebek arabası, el bagajı kuralına uygunsa kabine alınabilir',
            'Mini puset (max 75x50x45cm) ücretsizdir, kabine alınmaz'
          ]
        : [
            '1 piece free (FOC) per infant/child guest',
            'If multiple (Stroller + Seat), only one is free',
            'Cabin-sized stroller allowed in cabin if it fits hand bag rule',
            'Mini stroller (max 75x50x45cm) free, not allowed in cabin'
          ],
      icon: Briefcase,
      color: 'bg-emerald-400',
      image: 'https://picsum.photos/seed/stroller/400/300'
    },
    {
      id: 'live-animals-petc',
      category: t.liveAnimals,
      title: 'PETC (Kabin İçi Hayvan)',
      content: lang === 'tr' ? 'Kedi, Köpek ve Kuş (İç Hat)' : 'Cat, Dog and Bird (Domestic)',
      details: lang === 'tr'
        ? [
            'Max 8kg (kafes dahil), 32x32x50 cm boyutlar',
            'Dış hatlarda sadece kedi ve köpek kabul edilir (Kuş yasaktır)',
            'Çip ve pasaport zorunludur (Karne geçersizdir)',
            'Acil çıkış ve ön sıra koltuk verilemez, cam kenarı tercih edilir'
          ]
        : [
            'Max 8kg (incl. cage), 32x32x50 cm dimensions',
            'Only cats and dogs on intl flights (Birds forbidden)',
            'Chip and passport mandatory (Health cards invalid)',
            'No emergency exit or front row, window seat preferred'
          ],
      icon: Users,
      color: 'bg-amber-600',
      image: 'https://picsum.photos/seed/pet/400/300'
    },
    {
      id: 'live-animals-avih',
      category: t.liveAnimals,
      title: 'AVIH (Ambar İçi Hayvan)',
      content: lang === 'tr' ? 'Sadece İç Hat ve Kıbrıs' : 'Domestic and Cyprus Only',
      details: lang === 'tr'
        ? [
            'Dış hat uçuşlarında AVIH taşınmaz',
            'Max 3 AVIH (toplam 60kg) kabul edilebilir',
            'Ön ambara (Forward hold) yüklenmelidir',
            'Cenaze, bozulabilir gıda ve kuru buz ile aynı ambara konulmaz'
          ]
        : [
            'AVIH not carried on international flights',
            'Max 3 AVIH (total 60kg) can be accepted',
            'Must be loaded in the forward hold',
            'Cannot be loaded with HUM, PER or dry ice'
          ],
      icon: Users,
      color: 'bg-amber-800',
      image: 'https://picsum.photos/seed/animal/400/300'
    },
    {
      id: 'special-loads-hum',
      category: t.specialLoads,
      title: 'HUM (Cenaze Taşıma)',
      content: lang === 'tr' ? 'İnsani Yük Prosedürleri' : 'Human Remains Procedures',
      details: lang === 'tr'
        ? [
            'Sadece kargo olarak kabul edilir, max 4 adet',
            'Bulaşıcı hastalık (COVID-19 dahil) TR içi taşınmaz',
            'Yurt dışından TR\'ye bulaşıcı hastalık HUM kabul edilebilir',
            'Krematoryum külleri (Ashes) taşınması yasaktır'
          ]
        : [
            'Accepted as cargo only, max 4 pieces',
            'Infectious disease (incl. COVID-19) not carried within TR',
            'Infectious HUM from abroad to TR can be accepted',
            'Carriage of cremated remains/ashes is prohibited'
          ],
      icon: Info,
      color: 'bg-slate-600',
      image: 'https://picsum.photos/seed/cargo/400/300'
    },
    {
      id: 'weapon-carriage',
      category: t.dangerousGoods,
      title: lang === 'tr' ? 'Silah Taşıma' : 'Weapon Carriage',
      content: lang === 'tr' ? 'WPAY ve SPEQ İşlemleri' : 'WPAY and SPEQ Procedures',
      details: lang === 'tr'
        ? [
            'Dış hatlarda resmi izin yoksa silah taşınmaz',
            'Tüm silah ve mühimmat ön ambarda (Forward hold) taşınır',
            'Mühimmat (1.4S) kişi başı max 5kg olabilir',
            'Sportif silahlar SPEQ, şahsi silahlar WPAY SSR ile ücretlendirilir'
          ]
        : [
            'No weapons on intl flights without official authorization',
            'All weapons/ammo carried in forward hold',
            'Ammunition (1.4S) max 5kg per person',
            'Sporting weapons SPEQ, personal weapons WPAY SSR (fee)'
          ],
      icon: AlertTriangle,
      color: 'bg-red-900',
      image: 'https://picsum.photos/seed/security/400/300'
    },
    {
      id: 'poc-carriage',
      category: t.specialPassengers,
      title: 'POC (Oksijen Konsantratörü)',
      content: lang === 'tr' ? 'Kabin İçi Kullanım ve Taşıma' : 'In-Cabin Use and Carriage',
      details: lang === 'tr'
        ? [
            'FAA onaylı modeller kabul edilir',
            'Kullanım için MEDA-MEQT, sadece taşıma için MEQT SSR girilir',
            'Acil çıkış ve ön sıra koltuk verilemez, cam kenarı zorunludur',
            'Taksi, kalkış ve iniş esnasında kullanılamaz'
          ]
        : [
            'FAA approved models accepted',
            'MEDA-MEQT for use, MEQT SSR for carriage only',
            'No emergency exit or front row, window seat mandatory',
            'Cannot be used during taxi, take-off and landing'
          ],
      icon: Info,
      color: 'bg-blue-300'
    },
    {
      id: 'bag-tags',
      category: t.baggageRules,
      title: lang === 'tr' ? 'Özel Bagaj Etiketleri' : 'Special Baggage Tags',
      content: 'DAA, BBAG, Heavy, Priority',
      details: lang === 'tr'
        ? [
            'DAA (Delivery at Aircraft): Bebek arabası ve tekerlekli sandalye için',
            'Heavy: 23kg üzeri bagajlar için (Max 32kg)',
            'BBAG: Dayanıksız/uygunsuz paketlenmiş bagajlar için (Sınırlı sorumluluk)',
            'Manual Bag Tag: BRS sistemine manuel girilen etiketler'
          ]
        : [
            'DAA (Delivery at Aircraft): For strollers and wheelchairs',
            'Heavy: For items over 23kg (Max 32kg)',
            'BBAG: For fragile/unqualified packed bags (Limited liability)',
            'Manual Bag Tag: Labels entered manually into BRS'
          ],
      icon: FileText,
      color: 'bg-zinc-400'
    },
    {
      id: 'trans-limits',
      category: t.transportationLimits,
      title: lang === 'tr' ? 'Uçak Taşıma Limitleri' : 'Aircraft Transport Limits',
      content: 'B737-800 vs A320/21',
      details: lang === 'tr'
        ? [
            'Bebek Limiti: 20 (Can yeleği sayısına bağlı)',
            'Hamile: Tekil 36. hafta, Çoğul 32. haftaya kadar',
            'UM (Refakatsiz Çocuk) Limiti: 8',
            'PRM Toplam Limit: 23',
            'WCH (Tekerlekli Sandalye) Limiti: 18'
          ]
        : [
            'Infant Limit: 20 (Subject to life vest count)',
            'Pregnant: Up to 36th week single, 32nd week multiple',
            'UM (Unaccompanied Minor) Limit: 8',
            'PRM Total Limit: 23',
            'WCH (Wheelchair) Limit: 18'
          ],
      icon: Plane,
      color: 'bg-indigo-500'
    },
    {
      id: 'dcs-fallback',
      category: t.dcsProcedures,
      title: lang === 'tr' ? 'DCS Kesinti / Fallback' : 'DCS Interruption / Fallback',
      content: 'PG-MK-PR-006',
      details: lang === 'tr'
        ? [
            '5 dk içinde çözüm yoksa Fallback sistemine geçilir',
            'Online satışlar yansımaz, NOREC olarak eklenir',
            'Loadsheet manuel (Pades) hazırlanır',
            'Sync işlemi "Update Cranepax Data" ile yapılır'
          ]
        : [
            'Switch to Fallback if no solution within 5 mins',
            'Online sales not reflected, add as NOREC',
            'Manual loadsheet (Pades) required',
            'Sync via "Update Cranepax Data" button'
          ],
      icon: Clock,
      color: 'bg-slate-700'
    },
    {
      id: 'ssr-inad',
      category: t.specialPassengers,
      title: 'INAD / ENAD',
      content: lang === 'tr' ? 'Ülkeye Kabul Edilmeyen Yolcular' : 'Inadmissible Passengers',
      details: lang === 'tr'
        ? [
            'Uçağa en son alınır, en son indirilir',
            'Acil çıkışa oturtulamaz, en arka tercih edilir',
            'Dönüş bileti yolcuya aittir',
            'Diğer havayollarının INAD yolcuları taşınmaz'
          ]
        : [
            'Boarded last, disembarked last',
            'Cannot sit in emergency exit, rear seats preferred',
            'Return ticket covered by passenger',
            'INAD from other airlines not accepted'
          ],
      icon: Users,
      color: 'bg-red-700'
    },
    {
      id: 'ssr-depa',
      category: t.specialPassengers,
      title: 'DEPA / DEPU',
      content: lang === 'tr' ? 'Sınır Dışı Edilen Yolcular' : 'Deportee Passengers',
      details: lang === 'tr'
        ? [
            'DEPA: Güvenlik görevlisi eşliğinde',
            'DEPU: Eşliksiz (Pegasus kabul etmez)',
            'Güvenlik onayı zorunludur',
            'En az 2 refakatçi (Escort) gereklidir'
          ]
        : [
            'DEPA: Accompanied by security',
            'DEPU: Unaccompanied (Not accepted by Pegasus)',
            'Security approval mandatory',
            'Min 2 escorts required per DEPA'
          ],
      icon: Users,
      color: 'bg-red-800'
    },
    {
      id: 'preg-rules',
      category: t.specialPassengers,
      title: lang === 'tr' ? 'Hamile Yolcular' : 'Pregnant Passengers',
      content: lang === 'tr' ? 'Uçuş Uygunluk Limitleri' : 'Flight Fitness Limits',
      details: lang === 'tr'
        ? [
            'Tekil: 36. hafta sonuna kadar (Rapor gerekmez)',
            'Çoğul: 32. hafta sonuna kadar (Rapor gerekmez)',
            '36/32 hafta sonrası doktor raporu olsa dahi kabul edilmez',
            'Doğum sonrası ilk 48 saat kabul edilmez'
          ]
        : [
            'Single: Until end of 36th week (No report needed)',
            'Multiple: Until end of 32nd week (No report needed)',
            'Not accepted after 36/32 weeks even with report',
            'Not accepted within 48 hours after birth'
          ],
      icon: Users,
      color: 'bg-pink-500'
    },
    {
      id: 'petc-rules',
      category: t.specialPassengers,
      title: 'PETC / AVIH',
      content: lang === 'tr' ? 'Evcil Hayvan Taşıma' : 'Pet Transportation',
      details: lang === 'tr'
        ? [
            'PETC: Kabin içi, max 8kg (32x32x50cm)',
            'AVIH: Kargo kompartımanı (Sadece iç hat)',
            'Çipli ve pasaportlu olması zorunludur',
            '12 yaş altı (UM) tek başına taşıyamaz'
          ]
        : [
            'PETC: In cabin, max 8kg (32x32x50cm)',
            'AVIH: Cargo hold (Domestic only)',
            'Chip and passport mandatory',
            'Under 12 (UM) cannot carry alone'
          ],
      icon: Users,
      color: 'bg-amber-500'
    },
    {
      id: 'ssr-wchr',
      category: 'SSR Codes',
      title: 'WCHR',
      content: lang === 'tr' ? 'Tekerlekli Sandalye - Rampa için R' : 'Wheelchair - R for Ramp',
      details: lang === 'tr' 
        ? ['Yolcu basamakları inip çıkabilir', 'Kabin koltuğuna kendi başına gidebilir']
        : ['Passenger can ascend/descend steps', 'Can make own way to/from cabin seat'],
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'ssr-wchc',
      category: 'SSR Codes',
      title: 'WCHC',
      content: lang === 'tr' ? 'Tekerlekli Sandalye - Kabin Koltuğu için C' : 'Wheelchair - C for Cabin Seat',
      details: lang === 'tr'
        ? ['Yolcu tamamen hareketsizdir', 'Uçağa kadar tekerlekli sandalye gerektirir', 'Basamaklardan ve koltuğa kadar taşınmalıdır']
        : ['Passenger is completely immobile', 'Requires wheelchair to/from aircraft', 'Must be carried up/down steps and to/from seat'],
      icon: Users,
      color: 'bg-blue-600'
    },
    {
      id: 'bag-cabin',
      category: t.baggageRules,
      title: lang === 'tr' ? 'Kabin Bagajı' : 'Cabin Baggage',
      content: 'Max 55x40x20 cm',
      details: lang === 'tr'
        ? [
            'Maksimum ağırlık: 8kg',
            'Light Paket: Sadece koltuk altı (40x30x15cm, 3kg)',
            'Müzik aleti: 120cm (L+H) max'
          ]
        : [
            'Max weight: 8kg',
            'Light Package: Under seat only (40x30x15cm, 3kg)',
            'Musical instrument: 120cm (L+H) max'
          ],
      icon: Briefcase,
      color: 'bg-emerald-500'
    },
    {
      id: 'bag-checked',
      category: t.baggageRules,
      title: lang === 'tr' ? 'Kayıtlı Bagaj' : 'Checked Baggage',
      content: lang === 'tr' ? 'Standart: 20kg / 15kg' : 'Standard: 20kg / 15kg',
      details: lang === 'tr'
        ? [
            'Parça başı maksimum ağırlık: 32kg',
            'Sıvı gıda: Max 5lt, sızdırmaz paket',
            'Zamzam: Hac/Umre vizesi ile 5lt ücretsiz'
          ]
        : [
            'Max weight per piece: 32kg',
            'Liquid food: Max 5lt, leak-proof',
            'Zamzam: 5lt free with Hajj/Umrah visa'
          ],
      icon: Briefcase,
      color: 'bg-emerald-600'
    },
    {
      id: 'excess-baggage',
      category: t.excessBaggage,
      title: lang === 'tr' ? 'Fazla Bagaj Kuralları' : 'Excess Baggage Rules',
      content: lang === 'tr' ? 'Ücretlendirme ve Limitler' : 'Pricing and Limits',
      details: lang === 'tr'
        ? [
            'Bebekler için tüm uçuşlarda ücretsiz hak 10 kg\'dır.',
            'Bağlantılı uçuşlarda dış hat bagaj hakkı uygulanır.',
            'Satın alınan ek bagaj başkasına devredilemez.',
            'Kabin bagajı hakkı, kayıtlı bagaj hakkına eklenemez.',
            'Toplamda (ücretsiz dahil) 50 kg\'a kadar satın alınabilir.',
            'Küsuratlar aşağı yuvarlanır (Örn: 23.9 kg -> 23 kg).',
            'TR çıkışlı kapıda limit aşımı: GAEX SSR ile tahsilat.',
            'Yurt dışı çıkışlı kapıda limit aşımı: GAXB SSR ile tahsilat.'
          ]
        : [
            'Free allowance for infants is 10 kg on all flights.',
            'International baggage allowance applies on connecting flights.',
            'Purchased allowance cannot be transferred to another guest.',
            'Hand baggage allowance is not added to free allowance.',
            'Up to 50 kg (incl. free) can be purchased at discount.',
            'Fractional weights are rounded down (Ex: 23.9 kg -> 23 kg).',
            'Exceeding limit at gate (TR origin): GAEX SSR used.',
            'Exceeding limit at gate (Intl origin): GAXB SSR used.'
          ],
      icon: Briefcase,
      color: 'bg-emerald-700'
    },
    {
      id: 'boarding-1',
      category: 'Boarding',
      title: lang === 'tr' ? 'Öncelik 1' : 'Priority 1',
      content: lang === 'tr' ? 'WCHC / WCHS / Bebekli Aileler' : 'WCHC / WCHS / Families with Infants',
      details: lang === 'tr'
        ? ['Ön biniş gereklidir', 'Yardımın hazır olduğundan emin olun']
        : ['Pre-boarding required', 'Ensure assistance is ready'],
      icon: Plane,
      color: 'bg-orange-500'
    },
    {
      id: 'dgr-1',
      category: 'DGR',
      title: lang === 'tr' ? 'Sınıf 1: Patlayıcılar' : 'Class 1: Explosives',
      content: lang === 'tr' ? 'Yolcu Uçağında Yasaktır' : 'Forbidden on Passenger Aircraft',
      details: lang === 'tr'
        ? ['Havai fişekler, işaret fişekleri, mühimmat', 'Kesinlikle yasaktır']
        : ['Fireworks, flares, ammunition', 'Strictly prohibited'],
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      id: 'time-checkin',
      category: 'Timings',
      title: lang === 'tr' ? 'Check-in Kapanış' : 'Check-in Closure',
      content: lang === 'tr' ? 'Yurt İçi: 45dk / Yurt Dışı: 60dk' : 'Domestic: 45m / Intl: 60m',
      details: lang === 'tr'
        ? ['Kesin uyum gereklidir', 'Geç kalan yolcular yeniden rezerve edilmelidir']
        : ['Strict adherence required', 'Late passengers must be rebooked'],
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      id: 'pass-rights',
      category: t.passengerRights,
      title: lang === 'tr' ? 'Yolcu Hakları' : 'Passenger Rights',
      content: 'PG-MD-BK-002',
      details: lang === 'tr'
        ? [
            'Gecikme/İptal durumunda broşür dağıtılmalıdır',
            'Overbooking durumunda önce gönüllü aranır',
            'Standby Boarding Pass ve Standby Tag kullanılır',
            'Involuntary denied yolcular önceliklidir'
          ]
        : [
            'Brochure must be distributed in delay/cancellation',
            'Search for volunteers first in overbooking',
            'Standby Boarding Pass and Standby Tag used',
            'Involuntary denied passengers have priority'
          ],
      icon: Info,
      color: 'bg-blue-400'
    }
  ];


  const categories = ['All', ...Array.from(new Set(referenceData.map(item => item.category)))];

  const filteredData = referenceData.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(searchLower) || 
                         item.content.toLowerCase().includes(searchLower) ||
                         item.category.toLowerCase().includes(searchLower) ||
                         (item.details && item.details.some(detail => detail.toLowerCase().includes(searchLower)));
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-zinc-900">{t.quickReference}</h2>
          <p className="text-zinc-500 mt-2">{t.quickRefDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder={t.searchRefPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-64 dark:text-white transition-all"
            />
          </div>
          <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 gap-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  activeCategory === cat 
                    ? "bg-orange-600 text-white" 
                    : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                )}
              >
                {cat === 'All' ? (lang === 'tr' ? 'Tümü' : 'All') : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-100/20 dark:shadow-none transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-2xl text-white shadow-lg", item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                {item.category}
              </span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-serif font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                {item.content}
              </p>
              
              {item.details && (
                <ul className="pt-4 space-y-2 border-t border-zinc-50 dark:border-zinc-800">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      <div className="w-1 h-1 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button 
              onClick={() => setSelectedItem(item)}
              className="mt-6 w-full flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl group/btn hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
            >
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 group-hover/btn:text-orange-600 uppercase tracking-wider">{t.detailedProcedure}</span>
              <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover/btn:text-orange-400 transition-all" />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className={cn("h-32 flex items-center px-10 relative", selectedItem.color)}>
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                    <selectedItem.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">
                      {selectedItem.category}
                    </span>
                    <h3 className="text-3xl font-serif font-bold text-white mt-1">
                      {selectedItem.title}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4 text-orange-600" />
                    {t.generalInfo}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {selectedItem.content} {lang === 'tr' 
                      ? 'Bu prosedür, Pegasus Yer Hizmetleri standartlarına göre belirlenmiştir. Hatalı uygulama durumunda operasyonel gecikmeler ve güvenlik riskleri oluşabilir.'
                      : 'This procedure has been determined according to Pegasus Ground Services standards. Operational delays and security risks may occur in case of incorrect application.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    {t.applicationSteps}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.details?.map((detail, i) => (
                      <div key={i} className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-[10px] font-bold text-orange-600 shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{t.approvedByInstructors.replace('{count}', '12')}</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-orange-600 text-white rounded-2xl text-xs font-bold hover:bg-zinc-800 dark:hover:bg-orange-700 transition-all shadow-lg shadow-zinc-200 dark:shadow-orange-900/20">
                    <ExternalLink className="w-4 h-4" />
                    {t.openFullDoc}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filteredData.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-zinc-200" />
          </div>
          <h3 className="text-xl font-serif font-bold text-zinc-900">{t.noResultsFound}</h3>
          <p className="text-zinc-500 mt-2">{t.noResultsDesc}</p>
        </div>
      )}
    </div>
  );
};
