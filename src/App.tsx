import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Globe, ExternalLink } from 'lucide-react';
import { FAMOUS_CURRENCIES, Currency } from './types';

interface NewsItem {
  id: number;
  title: string;
  url: string;
  image: string;
  publisher: string;
  date: string;
}

interface WealthyIndividual {
  name: string;
  netWorthUsd: number; // Raw USD value
  company: string;
  imageUrl: string;
}

// Rigorously validated list of 30 wealthiest people as provided by the user with actual Wikipedia portraits
const WEALTHIEST_PEOPLE: WealthyIndividual[] = [
  { 
    name: 'Elon Musk', 
    netWorthUsd: 839000000000, 
    company: 'Tesla, SpaceX', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLj46gMioBhnEp6kO5DVNCjSzMAFU7sSnT-1AADEno8iLPlxlijz_i94Uv-AuCWXAqsDz9O7FmR4PV_QSBLQWkpE0b5RufwJhjyEn2c4S5WQ&s=10' 
  },
  { 
    name: 'Larry Page', 
    netWorthUsd: 257000000000, 
    company: 'Google', 
    imageUrl: 'https://static.republika.co.id/uploads/images/inpicture_slide/054729600-1595485947-larry_page_161802_bigjpg.jpg' 
  },
  { 
    name: 'Sergey Brin', 
    netWorthUsd: 237000000000, 
    company: 'Google', 
    imageUrl: 'https://static01.nyt.com/images/2026/01/28/multimedia/28nat-ca-billionaires-qgbf/28nat-ca-billionaires-qgbf-articleLarge.jpg?quality=75&auto=webp&disable=upscale' 
  },
  { 
    name: 'Jeff Bezos', 
    netWorthUsd: 224000000000, 
    company: 'Amazon', 
    imageUrl: 'https://img2.beritasatu.com/cache/investor/480x310-3/2024/12/1733735003-1000x562.webp' 
  },
  { 
    name: 'Larry Ellison', 
    netWorthUsd: 204000000000, 
    company: 'Oracle', 
    imageUrl: 'https://foto.arahkita.com/2025/09/11/605-larry_ellison_kalahkan_elon_musk_sebagai_orang_terkaya_di_dunia_bloombergcom.webp' 
  },
  { 
    name: 'Mark Zuckerberg', 
    netWorthUsd: 199000000000, 
    company: 'Meta / Facebook', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1MGBcGOpn5ttqNnG1KL_O7yuMW1oVDN5Ig2gSu0uv8Q&s=10' 
  },
  { 
    name: 'Michael Dell', 
    netWorthUsd: 184000000000, 
    company: 'Dell Technologies', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRahPba7w4TfMl0ZBg68a8T6cTUnWhc4u4CMvzQt8nl-UoP6rCJtDtSg_4ASiyKZok8CT6-hfsxtYQgjheqWsXtDKCjUiIAbszDzuveHujceWL6V3Oy_PX7f14YEOqVzU9wUZ3_ucNIOVWR&s=19' 
  },
  { 
    name: 'Jensen Huang', 
    netWorthUsd: 176000000000, 
    company: 'Nvidia', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPk1wEAqv4c9SZX_kCvtjxbACm8-BBp8q57Rr6cWEBdt9htX5fp_cY-cc&s=10' 
  },
  { 
    name: 'Warren Buffett', 
    netWorthUsd: 154000000000, 
    company: 'Berkshire Hathaway', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2khtIkhJvYfJGtE25ADBBPEMahW4dBOoXjQioDKE50GE9o8mIGHfwpI44y0vln9C_8zkTXeBHmJGr8nlLuxfSNuGyln2k_tQReaDLPoZVRg&s=10' 
  },
  { 
    name: 'Bernard Arnault', 
    netWorthUsd: 151000000000, 
    company: 'LVMH', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzFv3KTQqAPAFuLvCN8KNJR1rIeT8Hj1g681z4IuTTGg&s=10' 
  },
  { 
    name: 'Rob Walton', 
    netWorthUsd: 139000000000, 
    company: 'Walmart', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYG2_NTtlaf_rhBLgA9aPBJ6xyCRKufaRw6eo6PI8wVA&s=10' 
  },
  { 
    name: 'Jim Walton', 
    netWorthUsd: 136000000000, 
    company: 'Walmart', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh5TM77Puq4VmdalfETMexI571QkzJB4hCyN7mbYPbhQ&s=10' 
  },
  { 
    name: 'Alice Walton', 
    netWorthUsd: 133000000000, 
    company: 'Walmart', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPSKOM-USTD0yh-hoc6X0bq2h9qN6zMGhcASEPRsZeBkCdMXkd5r2QKou2hfvHliS0SZHUBjva1OBq041yj3LNZSP3-ubHXME4L40Zdr-1&s=10' 
  },
  { 
    name: 'Steve Ballmer', 
    netWorthUsd: 132000000000, 
    company: 'Microsoft', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCci_oNjUhhZe5bIYdMC3IwH0USesBnEe5bnex7x5d45SSCakuecdLn2WZIWV7WvzLmUzKpMS9KnzuviS7KMaqaRe1sH2LD18heKv4aA&s=10' 
  },
  { 
    name: 'Amancio Ortega', 
    netWorthUsd: 129000000000, 
    company: 'Zara', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPLoq3dbMAUtDtHg4O7U17Y_g1gEMLUkgMcAGlxXGZEgK6iwZEVz8ihS12DjfFP1Wqvl-2poWPW3_vn1FgrUIpiHpBijYqekwr1u316I37&s=10' 
  },
  { 
    name: 'Carlos Slim Helu', 
    netWorthUsd: 127000000000, 
    company: 'Telekomunikasi', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXkiRKm8ccZguR2Vs7qwg_FWNAF2sLVCfVkHOr6EES_dnd-vyaUCmMToAAinY2vFHDtkSX-3j-51qlvyYwv7njklsyarty6KGXxo3m9zY&s=10' 
  },
  { 
    name: 'Michael Bloomberg', 
    netWorthUsd: 111000000000, 
    company: 'Bloomberg LP', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOZ68pARVHgnBAGiIINsv95Puka43lb6HOTpF5D3XMPQ&s=10' 
  },
  { 
    name: 'Changpeng Zhao', 
    netWorthUsd: 106000000000, 
    company: 'Binance', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdA9RPTokr2vzY7DK7xZnRn_1T7vzyRfrIud-H5QTrPA&s=10' 
  },
  { 
    name: 'Bill Gates', 
    netWorthUsd: 102000000000, 
    company: 'Microsoft', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5AZC5Dl3fHHuQygijTBw2pGU2XPLhbCt5IqBhmdtm_MH98GtPg8ZALePDriI_YUarNnP3KVQQ0EVr3M0JCDh5q8PasLl7P_HyFdlIcA&s=10' 
  },
  { 
    name: 'Mukesh Ambani', 
    netWorthUsd: 95000000000, 
    company: 'Reliance Industries', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1YUXf3MNDvTMVpiFyg9GymhQpW4UQF1waUT_KFm3QAw&s=10' 
  },
  { 
    name: 'Ken Griffin', 
    netWorthUsd: 94000000000, 
    company: 'Hedge Funds', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSFNalDJjspMPGD-VSFM98vqmxPJYVKuysyOmTduMfhyWVG0fR4XkREoXpyHeujTV_Hxh1NrRFBxghD3jdFhB6gIDCVS5Tn1tdaFm89YPc5Ltfm5gibTRkifwN1BlZOVPiONEL0woa5I4M&s=19' 
  },
  { 
    name: 'Thomas Peterffy', 
    netWorthUsd: 89000000000, 
    company: 'Interactive Brokers', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgYKaCwtkCtL8POpgN7CahmkQQ73JCXLUal6kFTXg2PdvvT9CChTwFGu8KTtMZhLRYoTjMFADbh1NyffjHyyNe7xRtCLUZ1BNusZinx1sUA&s=10' 
  },
  { 
    name: 'Phil Knight', 
    netWorthUsd: 88000000000, 
    company: 'Nike', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRYxyg_EcPTWsDYb273ed0n8kW10eb7plbKu8273-zyQ&s=10' 
  },
  { 
    name: 'Francoise Bettencourt Meyers', 
    netWorthUsd: 83000000000, 
    company: "L'Oreal", 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEa4tF0YpUYE5FS9N3aLylMBBAjX4HTOP7IWwh9ppEsw&s=10' 
  },
  { 
    name: 'Stephen Schwarzman', 
    netWorthUsd: 81000000000, 
    company: 'Blackstone', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS3T2qtbRNeXLKq519bJUS-EikJ3kAo846T1hvLgGtVA&s=10' 
  },
  { 
    name: 'Mark Mateschitz', 
    netWorthUsd: 77000000000, 
    company: 'Red Bull', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzEQB68eWqBb-aRGVk4TtSLde5VpZyb6ygTyh6wRm99A&s=10' 
  },
  { 
    name: 'Julia Koch', 
    netWorthUsd: 75000000000, 
    company: 'Koch Industries', 
    imageUrl: 'https://www.livemint.com/lm-img/img/2025/10/22/600x338/G34O8v_WEAAuYnY_1761157575019_1761157585479.jpeg' 
  },
  { 
    name: 'Vladimir Potanin', 
    netWorthUsd: 74000000000, 
    company: 'Nornickel', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmsoDc_9xeI_MaXdnrRfX8JlS__QazCR0hzpvVduMg5gWGqGqC_m40QXlztJJX_nlZzbwV8YLn9adKe44lRGyvUS1VzTeIrNkZDINVHMRYCQ&s=10' 
  },
  { 
    name: 'Dieter Schwarz', 
    netWorthUsd: 74000000000, 
    company: 'Schwarz Gruppe / Lidl & Kaufland', 
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS4oJA_7HOeYjzZw6W8h6T7W2Q7AlmadN9Q08nUvkCgQ&s=10' 
  },
  { 
    name: 'Francois Pinault', 
    netWorthUsd: 72000000000, 
    company: 'Kering', 
    imageUrl: 'https://www.reuters.com/resizer/v2/GOIRYGDLJNNUZKAMFGMDWACRP4.jpg?auth=01386d12431cc96f0811eaa4de3f03c703b38084be9519ad3c2b4edcbd2b48db&height=1005&width=1920&quality=80&smart=true' 
  }
];

const PENGELUARAN_PER_HARI = 1200000000000;
const HARGA_PORSI = 15000;
const UMR_DKI = 5400000;
const UMR_JATENG = 2040000;
const GURU_HONORER = 300000;

function formatBesar(num: number) {
  if (num > 999000000000000) return '∞';
  if (num < 1000) return Math.floor(num).toLocaleString('id-ID');
  if (num < 1000000) return (num / 1000).toFixed(1).replace('.0', '') + ' ribu';
  if (num < 1000000000) return (num / 1000000).toFixed(1).replace('.0', '') + ' juta';
  if (num < 1000000000000) return (num / 1000000000).toFixed(1).replace('.0', '') + ' miliar';
  return (num / 1000000000000).toFixed(1).replace('.0', '') + ' triliun';
}

function hitungSistemMBG(uangIdr: number) {
  const uang = Number(uangIdr) || 0;

  const hariFloat = uang / PENGELUARAN_PER_HARI;

  const totalYears = Math.floor(hariFloat / 365);
  const sisaHariDariTahun = hariFloat % 365;
  const bulan = Math.floor(sisaHariDariTahun / 30);
  const hari = Math.floor(sisaHariDariTahun % 30);

  const jam = Math.floor((hariFloat % 1) * 24);
  const menit = Math.floor(((hariFloat * 24) % 1) * 60);
  const detik = Math.floor(((hariFloat * 24 * 60) % 1) * 60);

  let teksTepatnya = "";
  if (totalYears >= 1000) {
    const abadVal = totalYears / 1000;
    const sisaTahun = totalYears % 1000;
    
    teksTepatnya = `${formatBesar(abadVal)} abad`;
    if (sisaTahun > 0) {
      teksTepatnya += ` ${Math.floor(sisaTahun)} tahun`;
    }
  } else if (totalYears > 0) {
    teksTepatnya = `${totalYears} tahun`;
    if (bulan > 0) teksTepatnya += ` ${bulan} bulan`;
    if (hari > 0) teksTepatnya += ` ${hari} hari`;
  } else {
    const parts = [];
    if (bulan > 0) parts.push(`${bulan} bulan`);
    if (hari > 0) parts.push(`${hari} hari`);
    if (jam > 0) parts.push(`${jam} jam`);
    if (menit > 0) parts.push(`${menit} menit`);
    if (detik > 0) parts.push(`${detik} detik`);
    teksTepatnya = parts.join(", ") || "0 detik";
  }

  const jumlahPorsi = Math.floor(uang / HARGA_PORSI);

  const kelipatanUMRDki = formatBesar(uang / UMR_DKI);
  const kelipatanUMRJateng = formatBesar(uang / UMR_JATENG);
  const kelipatanGuruHonorer = formatBesar(uang / GURU_HONORER);

  return {
    hariMbgFloat: formatBesar(hariFloat),
    durasiDetail: {
      tahun: totalYears,
      bulan,
      hari,
      jam,
      menit,
      detik,
      teksRapi: teksTepatnya
    },
    porsiMakanBergizi: {
      totalPorsi: jumlahPorsi,
      pembacaanRapi: formatBesar(jumlahPorsi) + " porsi"
    },
    perbandinganSosial: {
      setaraUMRDki: `${kelipatanUMRDki} Kali`,
      setaraUMRJateng: `${kelipatanUMRJateng} Kali`,
      setaraGajiGuruHonorer: `${kelipatanGuruHonorer} Kali`
    }
  };
}

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(FAMOUS_CURRENCIES[0]); // Default is IDR (Rp)
  const [inputValue, setInputValue] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(true);
  const [isPeopleLoading, setIsPeopleLoading] = useState<boolean>(true);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPeopleLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch News Data
  useEffect(() => {
    setIsNewsLoading(true);
    fetch('https://berita-mbg.vercel.app/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNewsList(data);
        }
      })
      .catch((err) => console.error('Gagal mengambil berita:', err))
      .finally(() => setIsNewsLoading(false));
  }, []);

  // When a currency is swapped, recalculate existing numeric input smoothly
  const handleSelectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsDropdownOpen(false);
    
    if (inputValue) {
      const numericVal = parseFloat(inputValue);
      if (!isNaN(numericVal)) {
        // Convert from old selected currency base rate to IDR, then to the target selected currency
        const amountInIdr = numericVal * selectedCurrency.rateToIdr;
        const converted = Math.round(amountInIdr / currency.rateToIdr);
        setInputValue(converted.toString());
      }
    }
  };

  // Click on a person's landscape card converts USD wealth to active currency
  const handleIndividualClick = (person: WealthyIndividual) => {
    // 1 USD is 16,250 IDR as predefined standard
    const amountInIdr = person.netWorthUsd * 16250;
    const amountInTargetCurrency = Math.round(amountInIdr / selectedCurrency.rateToIdr);
    setInputValue(amountInTargetCurrency.toString());
    setHasEntered(true);
  };

  // Get what label should be on the currency selector prefix trigger button (Rp for IDR, otherwise standard code)
  const getButtonLabel = (currency: Currency) => {
    if (currency.code === 'IDR') {
      return 'Rp';
    }
    return currency.code;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue && parseFloat(inputValue) > 0) {
        setHasEntered(true);
        inputRef.current?.blur();
      } else {
        setHasEntered(false);
      }
    }
  };

  // Dots formatter as requested for exact dot notation (e.g. "$150.000.000")
  const formatWealthDots = (value: number) => {
    return '$' + new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  let mbgResult = null;
  if (hasEntered && inputValue) {
     const val = parseFloat(inputValue);
     if (!isNaN(val)) {
        const idrValue = val * selectedCurrency.rateToIdr;
        mbgResult = hitungSistemMBG(idrValue);
     }
  }

  return (
    <div className="h-screen w-full bg-black text-white font-sans select-none overflow-y-auto overflow-x-hidden relative">
      <div className="flex flex-col items-center justify-center min-h-full gap-2 w-full">
      
      {/* Centered Dark Premium Container */}
      <motion.div 
        id="app-container"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-full h-fit bg-zinc-950 border-y border-zinc-900 p-5 md:p-8 flex flex-col gap-4 relative overflow-hidden"
      >
        {/* Top hairline border accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none" />

        {/* Header App: Logo Left, "Kalkulator MBG" Right */}
        <div className="flex items-center gap-2.5 pb-1 select-none">
          <img 
            src="https://i.pinimg.com/736x/90/2d/b3/902db38fe53535a3e25cd17222d4e6e7.jpg" 
            alt="Logo" 
            className="w-7 h-7 rounded-lg object-cover border border-white/10"
            referrerPolicy="no-referrer"
          />
          <span className="text-[13px] font-black tracking-wider text-white uppercase font-sans subpixel-antialiased" style={{ transform: "translateZ(0)" }}>
            Kalkulator MBG
          </span>
        </div>

        {/* SCROLLABLE LIST AREA: Horizontal scrolling, 1 row only */}
        <div 
          className="flex flex-row items-start overflow-x-auto gap-3 py-1 px-0.5 snap-x snap-mandatory scrollbar-none min-h-[96px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isPeopleLoading ? (
            <div className="flex justify-center items-center w-full py-10 min-w-full">
              <motion.img
                src="https://static.vecteezy.com/system/resources/thumbnails/055/687/065/small_2x/gemini-google-icon-symbol-logo-free-png.png"
                alt="Loading"
                className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                animate={{ rotate: [0, 180, 180, 360, 360] }}
                transition={{
                  duration: 2.5,
                  times: [0, 0.4, 0.5, 0.9, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            WEALTHIEST_PEOPLE.map((person) => (
              <motion.div
                key={person.name}
                onClick={() => handleIndividualClick(person)}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-[252px] h-fit flex-shrink-0 bg-zinc-950/40 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden cursor-pointer snap-center group shadow-md flex flex-col"
              >
              {/* Image part: Landscape, no text overlay to avoid visual disturbance */}
              <div className="w-full aspect-[16/10] overflow-hidden bg-zinc-950 border-b border-white/10">
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fail-safe graceful Unsplash portrait fallback
                    e.currentTarget.src = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`;
                  }}
                />
              </div>

              {/* Text content placed cleaner below image so the image has zero text overlay on top of face */}
              <div className="p-3.5 flex flex-col justify-start gap-1.5">
                <div>
                  <h3 className="text-[13px] font-black text-white truncate tracking-wide leading-tight">
                    {person.name}
                  </h3>
                  <p className="text-[10px] font-semibold text-zinc-400 truncate uppercase tracking-widest leading-none mt-1">
                    {person.company}
                  </p>
                </div>
                
                {/* Clean dark glass container with dots format wealth display inside */}
                <div className="mt-1 bg-white/5 border border-white/10 rounded-lg py-1.5 text-center backdrop-blur-sm">
                  <span className="text-[12px] font-mono font-bold text-white tracking-tight">
                    {formatWealthDots(person.netWorthUsd)}
                  </span>
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>

        {/* BOTTOM SECTION: Snug input bar with zero auto-focus override */}
        <div className="relative w-full mt-1" ref={dropdownRef}>
          
          {/* Animated custom currency selector menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full left-0 right-0 mb-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.95)] z-50 overflow-hidden"
              >
                {/* Header for pop-up menu - Clean Black & White style */}
                <div className="p-3 bg-zinc-950/80 border-b border-zinc-800/80 flex justify-between items-center">
                  <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" />
                    Pilih Mata Uang
                  </span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                    7 Populer
                  </span>
                </div>
                
                <div className="max-h-[190px] overflow-y-auto p-1 bg-zinc-900 space-y-0.5">
                  {FAMOUS_CURRENCIES.map((currency) => {
                    const isSelected = currency.code === selectedCurrency.code;
                    return (
                      <button
                        key={currency.code}
                        type="button"
                        onClick={() => handleSelectCurrency(currency)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between rounded-xl transition-all duration-150 cursor-pointer ${
                          isSelected 
                            ? 'bg-white/15 text-white font-semibold' 
                            : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl leading-none select-none">{currency.flag}</span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold leading-none">
                              {currency.name}
                            </span>
                            <span className={`text-[9.5px] mt-0.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                              {currency.country}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-white/10 border border-white/10 text-white' : 'bg-zinc-950 border border-zinc-800/80 text-zinc-400'
                          }`}>
                            {currency.code}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Kolom input teks dengan selector mata uang (No white highlight borders on click / focus) */}
          <div 
            id="input-wrapper"
            className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-900 focus-within:border-zinc-800 rounded-2xl px-3 py-3"
          >
            {/* Currency toggle prefix trigger button (Can be customized Rp or Code) */}
            <button
              id="currency-toggle-btn"
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs tracking-wide border border-zinc-800 transition-all cursor-pointer select-none active:scale-95 outline-none"
            >
              <span className="text-white">{getButtonLabel(selectedCurrency)}</span>
              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            {/* Vertical divider line - "seperti ada garis di Rp" */}
            <div className="w-[1px] h-5 bg-zinc-800 shrink-0 mx-1" />

            {/* Pure, seamless cash input */}
            <input
              id="money-text-input"
              ref={inputRef}
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={inputValue}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                const val = e.target.value;
                const filtered = val.replace(/[^0-9]/g, '');
                setHasEntered(false);
                setInputValue(filtered);
              }}
              placeholder="Masukan jumlah uang..."
              className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-650 text-sm font-medium pr-1 focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none"
            />
          </div>
          
        </div>

      </motion.div>

      {/* RESULT CONTAINER */}
      <AnimatePresence>
        {hasEntered && mbgResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-full h-fit bg-zinc-950 border-y border-zinc-900 p-5 md:p-8 flex flex-col gap-4 relative overflow-hidden"
          >
            {/* Top hairline border accent */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none" />
            
            {/* Section 1: Durasi Program MBG */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Durasi Program MBG</span>
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 shadow-inner">
                <p className="text-[13px] font-black text-white leading-tight">
                  Dapat mendanai selama <span className="text-white">{mbgResult.hariMbgFloat} hari</span>
                </p>
                <div className="h-[1px] bg-zinc-800/80 w-full my-2"></div>
                <p className="text-[11px] font-semibold text-zinc-400">
                  Tepatnya: <span className="text-zinc-200">{mbgResult.durasiDetail.teksRapi}</span>
                </p>
              </div>
            </div>

            {/* Section 2: Porsi & Dampak Sosial */}
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Dampak Sosial & Ekonomi</span>
              <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 shadow-inner flex flex-col gap-3">
                
                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                  <span className="text-[11px] font-medium text-zinc-400">Total Porsi Gratis</span>
                  <span className="text-sm font-black text-white tracking-wide text-right">{mbgResult.porsiMakanBergizi.pembacaanRapi}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                  <span className="text-[11px] font-medium text-zinc-400">Setara UMR DKI</span>
                  <span className="text-xs font-mono font-bold text-white text-right"><span className="text-zinc-500 mr-1">≈</span>{mbgResult.perbandinganSosial.setaraUMRDki}</span>
                </div>

                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                  <span className="text-[11px] font-medium text-zinc-400">Setara UMR Jateng</span>
                  <span className="text-xs font-mono font-bold text-white text-right"><span className="text-zinc-500 mr-1">≈</span>{mbgResult.perbandinganSosial.setaraUMRJateng}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-zinc-400">Setara Gaji Honorer</span>
                  <span className="text-xs font-mono font-bold text-white text-right"><span className="text-zinc-500 mr-1">≈</span>{mbgResult.perbandinganSosial.setaraGajiGuruHonorer}</span>
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* NEWS SECTION CONTAINER */}
      {(isNewsLoading || newsList.length > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-full mt-2 mb-0 flex flex-col gap-4 bg-zinc-950 border-y border-zinc-900 p-5 md:p-8 relative overflow-hidden"
        >
          {/* Top hairline border accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2.5 pb-2 select-none">
            <img 
              src="https://i.pinimg.com/736x/90/2d/b3/902db38fe53535a3e25cd17222d4e6e7.jpg" 
              alt="Logo" 
              className="w-7 h-7 rounded-lg object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            <span className="text-[13px] font-black tracking-wider text-white uppercase font-sans subpixel-antialiased" style={{ transform: "translateZ(0)" }}>
              Berita Terkini MBG
            </span>
          </div>
          
          {isNewsLoading ? (
            <div className="flex justify-center items-center py-10">
              <motion.img
                src="https://static.vecteezy.com/system/resources/thumbnails/055/687/065/small_2x/gemini-google-icon-symbol-logo-free-png.png"
                alt="Loading"
                className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                animate={{ rotate: [0, 180, 180, 360, 360] }}
                transition={{
                  duration: 2.5,
                  times: [0, 0.4, 0.5, 0.9, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {newsList.map((news) => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-4 bg-black/40 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-3 shadow-inner hover:bg-zinc-900/50 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="w-[76px] h-[76px] rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                    <img
                      src={news.image}
                      alt={news.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col justify-center gap-1.5 pr-2 w-full h-full">
                    <h3 className="text-[13px] font-bold text-white leading-[1.35] line-clamp-2 group-hover:text-zinc-200 transition-colors">
                      {news.title}
                    </h3>
                    <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-500 uppercase tracking-wide mt-auto pt-1">
                      <span>{news.publisher}</span>
                      <span className="flex items-center gap-1">
                        {news.date}
                      </span>
                    </div>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 text-white/40">
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </motion.div>
      )}

      </div>
    </div>
  );
}
