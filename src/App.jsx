import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart,
} from "recharts";

const C = {
  bg:"#05050d", bg1:"#0b0b18", bg2:"#111125", panel:"#14142a",
  border:"#1e1e3a", bright:"#252550",
  blue:"#1C69D4", blueL:"#4d8de8", blueD:"#0a3a80",
  white:"#FFFFFF", silver:"#c8c8dc", dim:"#7070a0", faint:"#2a2a48",
  red:"#E60026", green:"#00C851", amber:"#FF9500", purple:"#9b59f4",
  teal:"#00bcd4", pink:"#e91e8c",
  txt:"#eeeeff",
};

const BRAND_COLORS = {
  BMW:"#1C69D4", Mercedes:"#c8c8dc", Audi:"#FF9500",
  Volvo:"#00C851", Jaguar:"#9b59f4", Lexus:"#00bcd4",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Josefin+Sans:wght@300;400;600;700&family=Share+Tech+Mono&display=swap');`;

const GS = `
${FONT_IMPORT}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body,#root{background:#05050d;min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:#05050d;}
::-webkit-scrollbar-thumb{background:#0a3a80;border-radius:3px;}
.bmw-btn{font-family:'Josefin Sans',sans-serif;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;border:1.5px solid #1C69D4;background:transparent;color:#FFFFFF;cursor:pointer;transition:all 0.25s;padding:12px 28px;font-size:13px;white-space:nowrap;}
.bmw-btn:hover{background:#1C69D4;}
.bmw-btn.active{background:#1C69D4;}
.bmw-btn.small{padding:7px 11px;font-size:9px;letter-spacing:1px;}
.section-fade{animation:fadeUp 0.7s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@media(max-width:767px){.hide-tablet{display:none!important;}}
@media(max-width:479px){.hide-mobile{display:none!important;}}
.tab-scroll{display:flex;flex-wrap:wrap;gap:5px;}
@media(max-width:767px){.tab-scroll{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;}}
@media(max-width:479px){.tab-scroll{grid-template-columns:repeat(2,1fr);}}
`;

function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// Breakpoint helpers
function useBP() {
  const w = useWidth();
  return {
    mob: w < 480,      // phones
    tab: w < 768,      // tablets + phones
    desk: w >= 768,    // desktop/laptop
    w,
  };
}

const inrFmt = (n) => {
  if (n >= 1e12) return `₹${(n/1e12).toFixed(2)}L Cr`;
  if (n >= 1e9)  return `₹${(n/1e9).toFixed(1)}K Cr`;
  if (n >= 1e7)  return `₹${(n/1e7).toFixed(1)}Cr`;
  if (n >= 1e5)  return `₹${(n/1e5).toFixed(1)}L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

/* ── DATA ── */
const brandSalesIndia = [
  { year:"2019", BMW:10001, Mercedes:13786, Audi:4022, Volvo:1610, Jaguar:940,  Lexus:370  },
  { year:"2020", BMW:8083,  Mercedes:11715, Audi:3018, Volvo:1200, Jaguar:720,  Lexus:290  },
  { year:"2021", BMW:9512,  Mercedes:11889, Audi:3545, Volvo:1423, Jaguar:810,  Lexus:340  },
  { year:"2022", BMW:10801, Mercedes:15822, Audi:5206, Volvo:1820, Jaguar:910,  Lexus:450  },
  { year:"2023", BMW:13926, Mercedes:19701, Audi:7931, Volvo:2360, Jaguar:1150, Lexus:590  },
  { year:"2024", BMW:14856, Mercedes:21200, Audi:8500, Volvo:2600, Jaguar:1300, Lexus:680  },
];

const brandRevenueIndia = [
  { year:"2020", BMW:8083,  Mercedes:16458, Audi:3621, Volvo:1440, Jaguar:1296, Lexus:522  },
  { year:"2021", BMW:10463, Mercedes:17241, Audi:4254, Volvo:1708, Jaguar:1458, Lexus:612  },
  { year:"2022", BMW:12449, Mercedes:22761, Audi:5986, Volvo:2184, Jaguar:1638, Lexus:810  },
  { year:"2023", BMW:16632, Mercedes:29552, Audi:9517, Volvo:2832, Jaguar:2070, Lexus:1062 },
  { year:"2024", BMW:18257, Mercedes:33920, Audi:10200,Volvo:3120, Jaguar:2340, Lexus:1224 },
];

const globalRevenue = [
  { year:"2019", BMW:855,  Mercedes:958,  Audi:612 },
  { year:"2020", BMW:752,  Mercedes:854,  Audi:536 },
  { year:"2021", BMW:936,  Mercedes:981,  Audi:678 },
  { year:"2022", BMW:1109, Mercedes:1116, Audi:742 },
  { year:"2023", BMW:1121, Mercedes:1037, Audi:736 },
  { year:"2024", BMW:1098, Mercedes:1023, Audi:710 },
];

const globalProfit = [
  { year:"2019", BMW:52,  Mercedes:86,  Audi:39  },
  { year:"2020", BMW:43,  Mercedes:38,  Audi:22  },
  { year:"2021", BMW:127, Mercedes:235, Audi:100 },
  { year:"2022", BMW:162, Mercedes:250, Audi:130 },
  { year:"2023", BMW:131, Mercedes:140, Audi:97  },
  { year:"2024", BMW:98,  Mercedes:110, Audi:72  },
];

const profitMargin = [
  { year:"2019", BMW:6.1, Mercedes:9.0, Audi:6.4  },
  { year:"2020", BMW:5.7, Mercedes:4.5, Audi:4.1  },
  { year:"2021", BMW:13.6,Mercedes:23.9,Audi:14.7 },
  { year:"2022", BMW:14.6,Mercedes:22.4,Audi:17.5 },
  { year:"2023", BMW:11.7,Mercedes:13.5,Audi:13.2 },
  { year:"2024", BMW:8.9, Mercedes:10.8,Audi:10.1 },
];

const luxuryVsTotal = [
  { year:"2019", luxury:36,  massMarket:2960, premium:180 },
  { year:"2020", luxury:27,  massMarket:2441, premium:148 },
  { year:"2021", luxury:32,  massMarket:2690, premium:165 },
  { year:"2022", luxury:40,  massMarket:3379, premium:210 },
  { year:"2023", luxury:54,  massMarket:3900, premium:280 },
  { year:"2024", luxury:62,  massMarket:4100, premium:320 },
];

const luxuryShare = [
  { brand:"Mercedes", share:41, color:"#c8c8dc" },
  { brand:"BMW",      share:29, color:"#1C69D4" },
  { brand:"Audi",     share:17, color:"#FF9500" },
  { brand:"Volvo",    share:5,  color:"#00C851" },
  { brand:"Jaguar",   share:3,  color:"#9b59f4" },
  { brand:"Lexus",    share:2,  color:"#00bcd4" },
  { brand:"Others",   share:3,  color:"#7070a0" },
];

const assemblyProduction = [
  { year:"2009", produced:1200, capacity:6000  },
  { year:"2011", produced:2800, capacity:7000  },
  { year:"2013", produced:4500, capacity:9000  },
  { year:"2015", produced:6200, capacity:10000 },
  { year:"2017", produced:7100, capacity:11000 },
  { year:"2019", produced:8900, capacity:12000 },
  { year:"2020", produced:6100, capacity:12000 },
  { year:"2021", produced:8200, capacity:13000 },
  { year:"2022", produced:9800, capacity:14000 },
  { year:"2023", produced:12400,capacity:14000 },
  { year:"2024", produced:13200,capacity:14500 },
];

const modelMix = [
  { model:"3 Series", pct:30, color:"#1C69D4" },
  { model:"5 Series", pct:18, color:"#4d8de8" },
  { model:"7 Series", pct:8,  color:"#9b59f4"  },
  { model:"X1",       pct:14, color:"#FF9500" },
  { model:"X3",       pct:12, color:"#00C851" },
  { model:"X5",       pct:10, color:"#00bcd4" },
  { model:"iX1 EV",   pct:8,  color:"#e91e8c" },
];

const segmentShare = [
  { segment:"Economy (<₹10L)",    share:52, revenue:1230, growth:4.2  },
  { segment:"Mid (₹10–25L)",      share:31, revenue:920,  growth:8.7  },
  { segment:"Premium (₹25–50L)",  share:10, revenue:390,  growth:18.3 },
  { segment:"Luxury (₹50L–1Cr)", share:4,  revenue:185,  growth:24.6 },
  { segment:"Ultra (>₹1Cr)",      share:3,  revenue:96,   growth:31.2 },
];

const globalVolumes = [
  { year:"2019", BMW:2520, Mercedes:2340, Audi:1846 },
  { year:"2020", BMW:2327, Mercedes:2164, Audi:1693 },
  { year:"2021", BMW:2521, Mercedes:2093, Audi:1685 },
  { year:"2022", BMW:2399, Mercedes:2045, Audi:1613 },
  { year:"2023", BMW:2554, Mercedes:2042, Audi:1897 },
  { year:"2024", BMW:2450, Mercedes:1980, Audi:1820 },
];

const avgPrice = [
  { brand:"BMW",      asp:110 },
  { brand:"Mercedes", asp:128 },
  { brand:"Audi",     asp:92  },
  { brand:"Volvo",    asp:78  },
  { brand:"Jaguar",   asp:145 },
  { brand:"Lexus",    asp:85  },
];

/* ── UI COMPONENTS ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#14142a", border:"1px solid #1e1e3a", padding:"10px 14px", borderRadius:4 }}>
      <p style={{ color:"#c8c8dc", fontFamily:"'Josefin Sans',sans-serif", fontSize:12, marginBottom:6 }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color||"#1C69D4", fontFamily:"'Share Tech Mono',monospace", fontSize:12, marginBottom:2 }}>
          {p.name}: {typeof p.value === "number" && p.value > 999 ? p.value.toLocaleString("en-IN") : p.value}
        </p>
      ))}
    </div>
  );
};

const KPICard = ({ label, value, sub, color="#1C69D4" }) => (
  <div style={{ background:"#14142a", border:"1px solid #1e1e3a", borderTop:`2px solid ${color}`, padding:"12px 14px", borderRadius:2 }}>
    <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:9, letterSpacing:1.5, color:"#7070a0", textTransform:"uppercase", display:"block", marginBottom:4 }}>{label}</span>
    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#FFFFFF", letterSpacing:2, display:"block" }}>{value}</span>
    {sub && <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color }}>{sub}</span>}
  </div>
);

const SectionHeader = ({ title, sub }) => (
  <div style={{ marginBottom:20, borderLeft:"3px solid #1C69D4", paddingLeft:14 }}>
    <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(20px,5vw,28px)", letterSpacing:4, color:"#FFFFFF" }}>{title}</h2>
    {sub && <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(10px,2.5vw,12px)", color:"#7070a0", marginTop:4, lineHeight:1.5 }}>{sub}</p>}
  </div>
);

const ChartBox = ({ title, note, children }) => (
  <div style={{ background:"#14142a", border:"1px solid #1e1e3a", padding:"20px 18px", borderRadius:2, marginBottom:18 }}>
    <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:11, letterSpacing:2, color:"#7070a0", textTransform:"uppercase", marginBottom:16 }}>{title}</p>
    {children}
    {note && <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:11, color:"#2a2a48", marginTop:10 }}>* {note}</p>}
  </div>
);

const CLegend = ({ items }) => (
  <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 16px", marginBottom:12 }}>
    {items.map((item,i) => (
      <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ width:9, height:9, borderRadius:2, background:item.color, display:"inline-block" }} />
        <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:11, color:"#7070a0" }}>{item.label}</span>
      </span>
    ))}
  </div>
);

/* ══════════════ LANDING ══════════════ */
function LandingPage({ onNavigate }) {
  const { mob, tab } = useBP();

  const worldTL = [
    { year:"1916", text:"Bayerische Flugzeugwerke AG founded in Munich — aircraft engine manufacturer." },
    { year:"1923", text:"BMW R 32 motorcycle debuts, launching the iconic drivetrain tradition." },
    { year:"1936", text:"BMW 328 sports car dominates European racing circuits." },
    { year:"1959", text:"BMW pivots fully to automobiles, launching the iconic 700 series." },
    { year:"1975", text:"BMW M GmbH founded — performance engineering becomes a brand pillar." },
    { year:"2000", text:"BMW acquires Rolls-Royce Motor Cars, entering ultra-luxury segment." },
    { year:"2013", text:"BMW i3 launches — first purpose-built EV signals the electrification era." },
    { year:"2023", text:"BMW Group delivers 2.55 million vehicles globally — all-time sales record." },
  ];
  const indiaTL = [
    { year:"1994", text:"BMW India Pvt. Ltd. established; first official BMW vehicles arrive." },
    { year:"2007", text:"Chennai assembly plant inaugurated — local production begins." },
    { year:"2012", text:"3 Series Gran Turismo launched, tailored for Indian road preferences." },
    { year:"2018", text:"BMW Group Financial Services India begins retail financing operations." },
    { year:"2021", text:"BMW iX3 introduced — first locally-positioned electric SUV." },
    { year:"2023", text:"Record 13,926 units sold — 28.9% YoY growth, best year ever." },
    { year:"2024", text:"EV mix reaches ~10%; iX, i4, iX1 portfolio expands aggressively." },
  ];

  return (
    <div className="section-fade">
      {/* HERO */}
      <div style={{ minHeight:mob?240:tab?360:460, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", padding:mob?"40px 16px":tab?"52px 28px":"68px 40px", position:"relative", overflow:"hidden", borderBottom:"1px solid #1e1e3a" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(#252550 1px,transparent 1px),linear-gradient(90deg,#252550 1px,transparent 1px)", backgroundSize:"48px 48px", opacity:0.18, zIndex:0 }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:mob?300:600, height:mob?200:300, borderRadius:"50%", background:"radial-gradient(ellipse,#0a3a8066 0%,transparent 70%)", zIndex:0 }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <svg width={mob?50:tab?64:76} height={mob?50:tab?64:76} viewBox="0 0 80 80" style={{ marginBottom:14 }}>
            <circle cx="40" cy="40" r="38" fill="none" stroke="#1C69D4" strokeWidth="3"/>
            <path d="M40 10 A30 30 0 0 0 10 40 L40 40 Z" fill="#FFFFFF"/>
            <path d="M40 40 L70 40 A30 30 0 0 0 40 10 Z" fill="#1C69D4"/>
            <path d="M10 40 A30 30 0 0 0 40 70 L40 40 Z" fill="#1C69D4"/>
            <path d="M40 40 L40 70 A30 30 0 0 0 70 40 Z" fill="#FFFFFF"/>
          </svg>
          <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?9:11, letterSpacing:mob?4:8, color:"#1C69D4", textTransform:"uppercase", marginBottom:10 }}>Analytical Report — India Market</div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:mob?36:tab?56:76, letterSpacing:mob?4:tab?8:12, color:"#FFFFFF", lineHeight:1, marginBottom:14 }}>DRIVEN BY DATA</h1>
          <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?12:tab?13:15, color:"#c8c8dc", maxWidth:mob?"100%":560, lineHeight:1.7, marginBottom:24 }}>
            A comprehensive strategic view of BMW's journey — from Munich to Mumbai — covering global legacy, Indian growth story, 12 data visualisations, and forward-looking recommendations.
          </p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
            <button className="bmw-btn" onClick={() => onNavigate("data")} style={{ fontSize:mob?11:13, padding:mob?"10px 20px":"12px 28px" }}>View Data Dashboard</button>
            <button className="bmw-btn" onClick={() => onNavigate("findings")} style={{ borderColor:"#c8c8dc", color:"#c8c8dc", fontSize:mob?11:13, padding:mob?"10px 20px":"12px 28px" }}>Key Findings</button>
          </div>
        </div>
      </div>

      {/* WORLD HISTORY */}
      <div style={{ padding:mob?"24px 14px":tab?"36px 28px":"52px 48px", borderBottom:"1px solid #1e1e3a" }}>
        <SectionHeader title="BMW — A Global Legacy" sub="From aircraft engines to the world's leading premium automobile brand" />
        <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:14, color:"#c8c8dc", lineHeight:1.8, maxWidth:800, marginBottom:30 }}>
          Founded in 1916 in Munich, Germany, Bayerische Motoren Werke began making aircraft engines. The distinctive blue-and-white roundel evokes a spinning propeller — a symbol of aviation heritage. Over a century later, BMW Group is the world's largest premium automotive manufacturer, selling under BMW, MINI, and Rolls-Royce. The brand philosophy, <span style={{ color:"#1C69D4" }}>"Sheer Driving Pleasure"</span>, permeates every product decision.
        </p>
        <div style={{ display:"flex", flexDirection:"column" }}>
          {worldTL.map((item,i) => (
            <div key={i} style={{ display:"flex", gap:18, paddingBottom:16, borderLeft:`2px solid ${i===worldTL.length-1?"transparent":"#1e1e3a"}`, marginLeft:20, paddingLeft:18, position:"relative" }}>
              <div style={{ position:"absolute", left:-9, top:2, width:16, height:16, borderRadius:"50%", background:i%2===0?"#1C69D4":"#111125", border:"2px solid #1C69D4" }} />
              <div>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"#1C69D4", letterSpacing:3, display:"block", marginBottom:2 }}>{item.year}</span>
                <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc", lineHeight:1.6 }}>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INDIA HISTORY */}
      <div style={{ padding:mob?"24px 14px":tab?"36px 28px":"52px 48px", background:"#0b0b18", borderBottom:"1px solid #1e1e3a" }}>
        <SectionHeader title="BMW in India" sub="Three decades of premium aspiration, localisation, and record growth" />
        <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?12:14, color:"#c8c8dc", lineHeight:1.8, maxWidth:800, marginBottom:24 }}>
          BMW entered India in 1994 at a time when economic liberalisation was barely three years old. The 2007 opening of a local assembly plant in Chennai changed the equation — local production reduced costs, shortened delivery cycles, and allowed BMW to price more competitively. With India projected to become the world's third-largest auto market by 2030, BMW's strategic investments position it for its most pivotal decade in the country.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr", gap:12 }}>
          {indiaTL.map((item,i) => (
            <div key={i} style={{ background:"#14142a", border:"1px solid #1e1e3a", borderLeft:"3px solid #1C69D4", padding:"14px 18px", borderRadius:2 }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:"#1C69D4", letterSpacing:3, display:"block", marginBottom:4 }}>{item.year}</span>
              <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc", lineHeight:1.6 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={{ padding:mob?"16px 14px":tab?"22px 28px":"34px 48px", borderBottom:"1px solid #1e1e3a" }}>
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":tab?"repeat(2,1fr)":"repeat(4,1fr)", gap:10 }}>
          <KPICard label="India Units (2024)"    value="14,856"    sub="+6.7% YoY"             color="#1C69D4" />
          <KPICard label="Chennai Output (2024)" value="13,200"    sub="Units assembled"        color="#FF9500" />
          <KPICard label="India Luxury Share"    value="29%"       sub="of luxury segment"      color="#00C851" />
          <KPICard label="EV Mix India"          value="~10%"      sub="Target 25% by 2027"     color="#4d8de8" />
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:mob?"28px 14px":tab?"36px 28px":"52px 48px", textAlign:"center" }}>
        <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:mob?22:26, letterSpacing:4, color:"#FFFFFF", marginBottom:10 }}>Explore the Full Analysis</h3>
        <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?11:13, color:"#7070a0", marginBottom:20 }}>12 interactive data visualisations, competitive benchmarks, key findings & strategic recommendations.</p>
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="bmw-btn" onClick={() => onNavigate("data")} style={{ fontSize:mob?11:13, padding:mob?"9px 18px":"12px 28px" }}>Data Visualisation</button>
          <button className="bmw-btn" onClick={() => onNavigate("findings")} style={{ borderColor:"#FF9500", color:"#FF9500", fontSize:mob?11:13, padding:mob?"9px 18px":"12px 28px" }}>Key Findings</button>
          <button className="bmw-btn" onClick={() => onNavigate("recommendations")} style={{ borderColor:"#00C851", color:"#00C851", fontSize:mob?11:13, padding:mob?"9px 18px":"12px 28px" }}>Recommendations</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ DATA PAGE ══════════════ */
function DataPage() {
  const { mob, tab } = useBP();
  const [activeViz, setActiveViz] = useState("sales");

  const tabs = [
    { id:"sales",     label:"Sales Trend"      },
    { id:"brandcomp", label:"Brand Comparison"  },
    { id:"luxshare",  label:"Luxury Share"      },
    { id:"segment",   label:"Industry Segments" },
    { id:"assembly",  label:"Assembly Unit"     },
    { id:"price",     label:"Pricing"           },
    { id:"region",    label:"Regional"          },
    { id:"ev",        label:"EV Growth"         },
    { id:"revenue",   label:"Revenue"           },
    { id:"profit",    label:"Net Profit"        },
    { id:"radar",     label:"Competition"       },
    { id:"seg",       label:"Model Mix"         },
  ];

  const tick = { fill:"#7070a0", fontFamily:"'Share Tech Mono',monospace", fontSize:mob?8:10 };
  const tickSm = { fill:"#7070a0", fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?8:tab?9:11 };
  const ch = (d=260, t=220, m=180) => mob?m:tab?t:d; // chart height helper

  return (
    <div className="section-fade" style={{ padding:mob?"16px 10px":tab?"24px 18px":"34px 38px" }}>
      <SectionHeader title="Data Visualisation" sub="12 charts — BMW India & Global: Sales, Market Share, Revenue, Profit, Assembly & Competitive Benchmarks (INR)" />

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr 1fr":tab?"repeat(2,1fr)":"repeat(4,1fr)", gap:8, marginBottom:20 }}>
        <KPICard label="India Peak Sales"   value="14,856"     sub="Units FY2024"          color="#1C69D4" />
        <KPICard label="India Rev (2024)"   value="₹18,257Cr"  sub="Estimated gross"       color="#FF9500" />
        <KPICard label="Global Revenue"     value="₹10.98L Cr" sub="BMW Group FY2024"      color="#00C851" />
        <KPICard label="Global Net Profit"  value="₹98K Cr"    sub="BMW Group FY2024"      color="#4d8de8" />
      </div>

      {/* TABS */}
      <div className="tab-scroll" style={{ marginBottom:18 }}>
        {tabs.map(t => (
          <button key={t.id} className={`bmw-btn small ${activeViz===t.id?"active":""}`} onClick={() => setActiveViz(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* ─── SALES TREND ─── */}
      {activeViz==="sales" && <>
        <ChartBox title="BMW India — Annual Unit Sales & Estimated Revenue (₹ Cr)">
          <ResponsiveContainer width="100%" height={ch(260,220,180)}>
            <ComposedChart data={[
              {year:"2018",units:9453, revenue:10858},{year:"2019",units:10001,revenue:11501},
              {year:"2020",units:8083, revenue:9296}, {year:"2021",units:9512, revenue:10939},
              {year:"2022",units:10801,revenue:12449},{year:"2023",units:13926,revenue:16632},
              {year:"2024",units:14856,revenue:18257},
            ]} margin={{ left:0, right:20, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis yAxisId="l" tick={tick} axisLine={false} tickLine={false} />
              <YAxis yAxisId="r" orientation="right" tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}Cr`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="l" dataKey="units" fill="#1C69D4" name="Units Sold" radius={[2,2,0,0]} />
              <Line yAxisId="r" type="monotone" dataKey="revenue" stroke="#FF9500" strokeWidth={2} dot={{ fill:"#FF9500", r:4 }} name="Revenue ₹Cr" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Year-on-Year Growth (%)">
          <ResponsiveContainer width="100%" height={ch(180,160,140)}>
            <AreaChart data={[
              {year:"2019",g:5.8},{year:"2020",g:-19.2},{year:"2021",g:17.7},
              {year:"2022",g:13.5},{year:"2023",g:28.9},{year:"2024",g:6.7},
            ]} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
              <Tooltip formatter={v=>[`${v}%`,"Growth"]} />
              <Area type="monotone" dataKey="g" stroke="#00C851" fill="#00C85125" strokeWidth={2} name="Growth %" dot={{ fill:"#00C851", r:4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>
      </>}

      {/* ─── BRAND COMPARISON ─── */}
      {activeViz==="brandcomp" && <>
        <ChartBox title="Premium Brand India Sales — Units Over Time (2019–2024)">
          <CLegend items={Object.entries(BRAND_COLORS).map(([k,v])=>({label:k,color:v}))} />
          <ResponsiveContainer width="100%" height={ch(300,250,200)}>
            <LineChart data={brandSalesIndia} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(BRAND_COLORS).map(([brand,color]) => (
                <Line key={brand} type="monotone" dataKey={brand} stroke={color} strokeWidth={brand==="BMW"?3:1.5} dot={{ fill:color, r:brand==="BMW"?5:3 }} name={brand} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="2024 India Units — All Brands Side by Side">
          <ResponsiveContainer width="100%" height={ch(240,200,180)}>
            <BarChart data={[brandSalesIndia[5]]} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:11, color:"#7070a0" }} />
              {Object.entries(BRAND_COLORS).map(([brand,color]) => (
                <Bar key={brand} dataKey={brand} fill={color} radius={[2,2,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Average Selling Price by Brand — India 2024 (₹ Lakh)" note="ASP estimated from reported volumes and disclosed revenue ranges.">
          <ResponsiveContainer width="100%" height={ch(240,210,200)}>
            <BarChart data={avgPrice} layout="vertical" margin={{ left:0, right:50, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" horizontal={false} />
              <XAxis type="number" tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}L`} />
              <YAxis type="category" dataKey="brand" tick={tickSm} axisLine={false} tickLine={false} width={65} />
              <Tooltip formatter={v=>[`₹${v}L`,"ASP"]} />
              {avgPrice.map((d,i) => (
                <Bar key={i} dataKey="asp" data={[d]} fill={Object.values(BRAND_COLORS)[i]} name={d.brand} radius={[0,2,2,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </>}

      {/* ─── LUXURY SHARE ─── */}
      {activeViz==="luxshare" && <>
        <ChartBox title="India Luxury Car Market Share — 2024 (%)">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr", gap:22 }}>
            <ResponsiveContainer width="100%" height={ch(300,260,240)}>
              <PieChart>
                <Pie data={luxuryShare} dataKey="share" nameKey="brand" cx="50%" cy="50%" outerRadius={120} innerRadius={60} stroke="none">
                  {luxuryShare.map((s,i)=><Cell key={i} fill={s.color}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:10 }}>
              {luxuryShare.map((s,i)=>(
                <div key={i}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc", display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ width:8, height:8, borderRadius:2, background:s.color, display:"inline-block" }} />{s.brand}
                    </span>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:s.color, letterSpacing:2 }}>{s.share}%</span>
                  </div>
                  <div style={{ height:4, background:"#2a2a48", borderRadius:2 }}>
                    <div style={{ height:4, width:`${Math.min(s.share*2.2,100)}%`, background:s.color, borderRadius:2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartBox>
        <ChartBox title="Global Volume Comparison — BMW vs Mercedes vs Audi ('000 units)" note="BMW Group includes BMW, MINI & Rolls-Royce combined.">
          <CLegend items={[{label:"BMW Group",color:"#1C69D4"},{label:"Mercedes-Benz",color:"#c8c8dc"},{label:"Audi Group",color:"#FF9500"}]} />
          <ResponsiveContainer width="100%" height={ch(260,220,190)}>
            <BarChart data={globalVolumes} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`${v}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="BMW"      fill="#1C69D4" radius={[2,2,0,0]} name="BMW" />
              <Bar dataKey="Mercedes" fill="#c8c8dc" radius={[2,2,0,0]} name="Mercedes" />
              <Bar dataKey="Audi"     fill="#FF9500" radius={[2,2,0,0]} name="Audi" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </>}

      {/* ─── INDUSTRY SEGMENTS ─── */}
      {activeViz==="segment" && <>
        <ChartBox title="India Auto Industry — Segment Volumes ('000 units, Stacked) 2019–2024">
          <CLegend items={[{label:"Economy <₹10L",color:"#7070a0"},{label:"Premium ₹25–50L",color:"#4d8de8"},{label:"Luxury ₹50L+",color:"#1C69D4"}]} />
          <ResponsiveContainer width="100%" height={ch(300,250,200)}>
            <AreaChart data={luxuryVsTotal} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`${v}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="massMarket" stackId="a" stroke="#7070a0" fill="#7070a040" name="Economy" strokeWidth={1} />
              <Area type="monotone" dataKey="premium"    stackId="a" stroke="#4d8de8" fill="#4d8de850" name="Premium" strokeWidth={1} />
              <Area type="monotone" dataKey="luxury"     stackId="a" stroke="#1C69D4" fill="#1C69D470" name="Luxury"  strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Segment Revenue Share & Growth — India 2024" note="Revenue is estimated gross market size in ₹ Thousand Crore.">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr", gap:18 }}>
            <ResponsiveContainer width="100%" height={ch(260,230,220)}>
              <BarChart data={segmentShare} layout="vertical" margin={{ left:0, right:40, top:8, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" horizontal={false} />
                <XAxis type="number" tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
                <YAxis type="category" dataKey="segment" tick={{ fill:"#c8c8dc", fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?7:10 }} axisLine={false} tickLine={false} width={mob?95:130} />
                <Tooltip formatter={(v,n)=>[n==="share"?`${v}%`:`₹${v}K Cr`,n==="share"?"Vol. Share":"Revenue"]} />
                <Bar dataKey="share" fill="#1C69D4" radius={[0,2,2,0]} name="share" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {segmentShare.map((s,i)=>(
                <div key={i} style={{ background:"#111125", border:"1px solid #1e1e3a", padding:"10px 13px", borderRadius:2 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:11, color:"#c8c8dc" }}>{s.segment}</span>
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#00C851" }}>+{s.growth}%</span>
                  </div>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#1C69D4", letterSpacing:2 }}>₹{s.revenue}K Cr</span>
                </div>
              ))}
            </div>
          </div>
        </ChartBox>
      </>}

      {/* ─── ASSEMBLY ─── */}
      {activeViz==="assembly" && <>
        <ChartBox title="BMW Chennai Assembly Plant — Production vs Capacity (Units, 2009–2024)">
          <CLegend items={[{label:"Capacity",color:"#252550"},{label:"Units Produced",color:"#1C69D4"},{label:"Production Trend",color:"#00C851"}]} />
          <ResponsiveContainer width="100%" height={ch(300,250,200)}>
            <ComposedChart data={assemblyProduction} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>v.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="capacity" fill="#252550" name="Capacity" radius={[2,2,0,0]} />
              <Bar dataKey="produced" fill="#1C69D4" name="Produced" radius={[2,2,0,0]} />
              <Line type="monotone" dataKey="produced" stroke="#00C851" strokeWidth={2} dot={{ fill:"#00C851", r:4 }} name="Trend" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Capacity Utilisation — Chennai Plant (%)">
          <ResponsiveContainer width="100%" height={ch(200,170,150)}>
            <AreaChart data={assemblyProduction.map(d=>({ year:d.year, util:Math.round(d.produced/d.capacity*100) }))} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis domain={[0,100]} tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
              <Tooltip formatter={v=>[`${v}%`,"Utilisation"]} />
              <Area type="monotone" dataKey="util" stroke="#FF9500" fill="#FF950025" strokeWidth={2} name="Utilisation %" dot={{ fill:"#FF9500", r:4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Chennai Plant — Model Mix Assembled 2024 Estimate">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr", gap:18 }}>
            <ResponsiveContainer width="100%" height={ch(260,230,220)}>
              <PieChart>
                <Pie data={modelMix} dataKey="pct" cx="50%" cy="50%" outerRadius={105} innerRadius={50} stroke="none">
                  {modelMix.map((m,i)=><Cell key={i} fill={m.color}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:10 }}>
              {modelMix.map((m,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:m.color, flexShrink:0 }} />
                  <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc", flex:1 }}>{m.model}</span>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:13, color:m.color }}>{m.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartBox>
      </>}

      {/* ─── PRICING ─── */}
      {activeViz==="price" && (
        <ChartBox title="BMW vs Competitor Ex-Showroom Pricing — India (₹)" note="Competitor avg. based on Mercedes-Benz & Audi equivalent segment pricing.">
          <ResponsiveContainer width="100%" height={ch(360,320,300)}>
            <BarChart data={[
              {model:"3 Series",BMW:4900000,Rival:4200000},
              {model:"5 Series",BMW:7200000,Rival:6800000},
              {model:"7 Series",BMW:17500000,Rival:16200000},
              {model:"X1",BMW:4600000,Rival:4100000},
              {model:"X3",BMW:6800000,Rival:6200000},
              {model:"X5",BMW:9500000,Rival:8900000},
              {model:"X7",BMW:14000000,Rival:13000000},
              {model:"iX",BMW:13100000,Rival:11800000},
            ]} layout="vertical" margin={{ left:0, right:mob?20:50, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" horizontal={false} />
              <XAxis type="number" tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>inrFmt(v)} />
              <YAxis type="category" dataKey="model" tick={tickSm} axisLine={false} tickLine={false} width={mob?55:65} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?9:11, color:"#7070a0" }} />
              <Bar dataKey="BMW"   fill="#1C69D4" name="BMW (₹)"       radius={[0,2,2,0]} />
              <Bar dataKey="Rival" fill="#7070a0" name="Avg Rival (₹)" radius={[0,2,2,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      )}

      {/* ─── REGIONAL ─── */}
      {activeViz==="region" && (
        <ChartBox title="BMW India — Regional Sales Distribution 2024">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr", gap:22 }}>
            <ResponsiveContainer width="100%" height={ch(260,230,200)}>
              <BarChart data={[{r:"North",u:4159},{r:"West",u:5199},{r:"South",u:3714},{r:"East",u:1784}]} margin={{ left:0, right:16, top:8, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                <XAxis dataKey="r" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="u" fill="#1C69D4" name="Units" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[{r:"West",p:35,u:5199,c:"#1C69D4"},{r:"North",p:28,u:4159,c:"#4d8de8"},{r:"South",p:25,u:3714,c:"#FF9500"},{r:"East",p:12,u:1784,c:"#7070a0"}].map((r,i)=>(
                <div key={i} style={{ background:"#111125", border:"1px solid #1e1e3a", padding:"12px 14px", borderRadius:2 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc" }}>{r.r} India</span>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:r.c, letterSpacing:2 }}>{r.p}%</span>
                  </div>
                  <div style={{ height:4, background:"#2a2a48", borderRadius:2 }}>
                    <div style={{ height:4, width:`${r.p*2.5}%`, background:r.c, borderRadius:2 }} />
                  </div>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#7070a0", marginTop:4, display:"block" }}>{r.u.toLocaleString()} units</span>
                </div>
              ))}
            </div>
          </div>
        </ChartBox>
      )}

      {/* ─── EV ─── */}
      {activeViz==="ev" && (
        <ChartBox title="BMW EV Portfolio — India Sales Growth (Units)" note="Estimated from public disclosures and industry reports.">
          <CLegend items={[{label:"BMW iX",color:"#1C69D4"},{label:"BMW i4",color:"#00C851"},{label:"BMW iX1",color:"#FF9500"}]} />
          <ResponsiveContainer width="100%" height={ch(280,240,200)}>
            <AreaChart data={[
              {year:"2021",iX:0,i4:0,iX1:0},
              {year:"2022",iX:210,i4:180,iX1:0},
              {year:"2023",iX:520,i4:490,iX1:310},
              {year:"2024",iX:780,i4:720,iX1:650},
            ]} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="iX"  stroke="#1C69D4" fill="#1C69D430" strokeWidth={2} name="BMW iX"  />
              <Area type="monotone" dataKey="i4"  stroke="#00C851" fill="#00C85120" strokeWidth={2} name="BMW i4"  />
              <Area type="monotone" dataKey="iX1" stroke="#FF9500" fill="#FF950020" strokeWidth={2} name="BMW iX1" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartBox>
      )}

      {/* ─── REVENUE ─── */}
      {activeViz==="revenue" && <>
        <ChartBox title="India Revenue Comparison — All Premium Brands (₹ Crore)" note="Revenue = estimated units × average transaction price per brand.">
          <CLegend items={Object.entries(BRAND_COLORS).map(([k,v])=>({label:k,color:v}))} />
          <ResponsiveContainer width="100%" height={ch(300,260,220)}>
            <BarChart data={brandRevenueIndia} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}Cr`} />
              <Tooltip content={<CustomTooltip />} />
              {Object.entries(BRAND_COLORS).map(([brand,color]) => (
                <Bar key={brand} dataKey={brand} fill={color} radius={[2,2,0,0]} name={brand} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Global Revenue — BMW vs Mercedes vs Audi (₹ Thousand Crore)" note="Converted from EUR at ~₹90/€. BMW = BMW Group total.">
          <CLegend items={[{label:"BMW Group",color:"#1C69D4"},{label:"Mercedes-Benz",color:"#c8c8dc"},{label:"Audi Group",color:"#FF9500"}]} />
          <ResponsiveContainer width="100%" height={ch(280,240,200)}>
            <ComposedChart data={globalRevenue} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}K Cr`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="BMW"      fill="#1C69D4" name="BMW"      radius={[2,2,0,0]} />
              <Bar dataKey="Mercedes" fill="#c8c8dc" name="Mercedes" radius={[2,2,0,0]} />
              <Bar dataKey="Audi"     fill="#FF9500" name="Audi"     radius={[2,2,0,0]} />
              <Line type="monotone" dataKey="BMW" stroke="#4d8de8" strokeWidth={2} dot={{ fill:"#4d8de8", r:4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartBox>
      </>}

      {/* ─── NET PROFIT ─── */}
      {activeViz==="profit" && <>
        <ChartBox title="Global Net Profit — BMW vs Mercedes vs Audi (₹ Thousand Crore)" note="Net profit converted from reported EUR at ₹90/€. 2021–22 boom driven by supply constraints + strong pricing power.">
          <CLegend items={[{label:"BMW Group",color:"#1C69D4"},{label:"Mercedes-Benz",color:"#c8c8dc"},{label:"Audi Group",color:"#FF9500"}]} />
          <ResponsiveContainer width="100%" height={ch(280,240,200)}>
            <BarChart data={globalProfit} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}K Cr`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="BMW"      fill="#1C69D4" name="BMW Net Profit"      radius={[2,2,0,0]} />
              <Bar dataKey="Mercedes" fill="#c8c8dc" name="Mercedes Net Profit" radius={[2,2,0,0]} />
              <Bar dataKey="Audi"     fill="#FF9500" name="Audi Net Profit"     radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Net Profit Margin (%) — BMW vs Mercedes vs Audi">
          <CLegend items={[{label:"BMW",color:"#1C69D4"},{label:"Mercedes",color:"#c8c8dc"},{label:"Audi",color:"#FF9500"}]} />
          <ResponsiveContainer width="100%" height={ch(240,210,180)}>
            <LineChart data={profitMargin} margin={{ left:0, right:16, top:8, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
              <XAxis dataKey="year" tick={tick} axisLine={{ stroke:"#1e1e3a" }} tickLine={false} />
              <YAxis tick={tick} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
              <Tooltip formatter={v=>[`${v}%`,"Margin"]} />
              <Line type="monotone" dataKey="BMW"      stroke="#1C69D4" strokeWidth={2.5} dot={{ fill:"#1C69D4",  r:5 }} name="BMW"      />
              <Line type="monotone" dataKey="Mercedes" stroke="#c8c8dc" strokeWidth={2}   dot={{ fill:"#c8c8dc", r:4 }} name="Mercedes" />
              <Line type="monotone" dataKey="Audi"     stroke="#FF9500" strokeWidth={2}   dot={{ fill:"#FF9500", r:4 }} name="Audi"     />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"repeat(3,1fr)", gap:12 }}>
          {[
            {brand:"BMW Group",     profit:"₹98K Cr",  margin:"8.9%",  rev:"₹10.98L Cr", color:"#1C69D4"},
            {brand:"Mercedes-Benz", profit:"₹110K Cr", margin:"10.8%", rev:"₹10.23L Cr", color:"#c8c8dc"},
            {brand:"Audi Group",    profit:"₹72K Cr",  margin:"10.1%", rev:"₹7.10L Cr",  color:"#FF9500"},
          ].map((b,i)=>(
            <div key={i} style={{ background:"#14142a", border:"1px solid #1e1e3a", borderTop:`2px solid ${b.color}`, padding:"14px 16px", borderRadius:2 }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:3, color:b.color, display:"block", marginBottom:8 }}>{b.brand}</span>
              {[["Net Profit",b.profit,b.color],["Margin",b.margin,"#00C851"],["Revenue",b.rev,"#c8c8dc"]].map(([l,v,c],j)=>(
                <div key={j} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:11, color:"#7070a0" }}>{l}</span>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:c }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>}

      {/* ─── RADAR ─── */}
      {activeViz==="radar" && (
        <ChartBox title="Competitive Benchmark — BMW vs Mercedes vs Audi (India, Composite Score 0–100)" note="Analyst-composite indices based on brand perception, reviews, and consumer surveys.">
          <CLegend items={[{label:"BMW",color:"#1C69D4"},{label:"Mercedes",color:"#c8c8dc"},{label:"Audi",color:"#FF9500"}]} />
          <ResponsiveContainer width="100%" height={ch(340,300,280)}>
            <RadarChart data={[
              {axis:"Performance",BMW:92,Mercedes:88,Audi:85},
              {axis:"Luxury",     BMW:88,Mercedes:93,Audi:86},
              {axis:"Technology", BMW:90,Mercedes:89,Audi:92},
              {axis:"Safety",     BMW:89,Mercedes:91,Audi:88},
              {axis:"Value",      BMW:72,Mercedes:68,Audi:75},
              {axis:"EV Range",   BMW:78,Mercedes:80,Audi:82},
              {axis:"Aftersales", BMW:80,Mercedes:85,Audi:78},
            ]} cx="50%" cy="50%" outerRadius={mob?80:tab?100:120}>
              <PolarGrid stroke="#1e1e3a" />
              <PolarAngleAxis dataKey="axis" tick={{ fill:"#c8c8dc", fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?9:12 }} />
              <PolarRadiusAxis tick={{ fill:"#7070a0", fontSize:8 }} axisLine={false} tickCount={4} />
              <Radar name="BMW"      dataKey="BMW"      stroke="#1C69D4" fill="#1C69D440" strokeWidth={2} />
              <Radar name="Mercedes" dataKey="Mercedes" stroke="#c8c8dc" fill="#c8c8dc20" strokeWidth={2} />
              <Radar name="Audi"     dataKey="Audi"     stroke="#FF9500" fill="#FF950020" strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartBox>
      )}

      {/* ─── MODEL MIX ─── */}
      {activeViz==="seg" && (
        <ChartBox title="BMW India Sales by Model Segment — 2024 Estimate">
          <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr", gap:20 }}>
            <ResponsiveContainer width="100%" height={ch(280,250,230)}>
              <PieChart>
                <Pie data={[
                  {name:"3 Series",value:32,color:"#1C69D4"},
                  {name:"5 Series",value:22,color:"#4d8de8"},
                  {name:"X5/X7",   value:20,color:"#FF9500"},
                  {name:"7 Series",value:12,color:"#c8c8dc"},
                  {name:"Electric",value:8, color:"#00C851"},
                  {name:"Others",  value:6, color:"#7070a0"},
                ]} dataKey="value" cx="50%" cy="50%" outerRadius={mob?90:110} innerRadius={mob?45:55} stroke="none">
                  {["#1C69D4","#4d8de8","#FF9500","#c8c8dc","#00C851","#7070a0"].map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex", flexDirection:"column", justifyContent:mob?"flex-start":"center", gap:10 }}>
              {[{n:"3 Series",v:32,c:"#1C69D4"},{n:"5 Series",v:22,c:"#4d8de8"},{n:"X5/X7",v:20,c:"#FF9500"},{n:"7 Series",v:12,c:"#c8c8dc"},{n:"Electric",v:8,c:"#00C851"},{n:"Others",v:6,c:"#7070a0"}].map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:s.c, flexShrink:0 }} />
                  <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:mob?11:13, color:"#c8c8dc", flex:1 }}>{s.n}</span>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:mob?11:13, color:s.c }}>{s.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartBox>
      )}
    </div>
  );
}

/* ══════════════ FINDINGS ══════════════ */
function FindingsPage() {
  const { mob, tab } = useBP();
  const findings = [
    {icon:"↑",color:"#00C851",title:"Explosive Post-Pandemic Recovery",body:"BMW India's 2023 surge of 28.9% (13,926 units) was the strongest single-year growth in the brand's India history. The trajectory signals India is transitioning from a niche to a core BMW growth market."},
    {icon:"⚡",color:"#4d8de8",title:"EV Adoption is Real, But Fragile",body:"The iX1 at ₹66L ex-showroom catalysed genuine EV interest. However, charging infrastructure outside Tier-1 cities remains critical. BMW's ~10% EV mix is impressive but will stall without deeper charger networks."},
    {icon:"₹",color:"#FF9500",title:"Pricing Premium is Justifiable but Narrow",body:"BMW commands a 10–15% average price premium over Audi and Mercedes in India. If BMW reduces CKD import dependency further, there is room to either widen margin or gain volume."},
    {icon:"🗺",color:"#1C69D4",title:"Western India is BMW's Home Ground",body:"The West (Mumbai, Pune, Ahmedabad) contributes 35% of volumes. North India at 28% is underperforming relative to Mercedes. Penetrating Bengaluru more aggressively should be the next geographic priority."},
    {icon:"📉",color:"#E60026",title:"3 Series Dependence is a Strategic Risk",body:"The 3 Series accounts for ~32% of total BMW India sales. This concentration leaves BMW exposed — Genesis GV70, Volvo S60, and refreshed Audi A4 are all targeting the same ₹45–55L wallet."},
    {icon:"★",color:"#c8c8dc",title:"Mercedes Holds Market Share Lead",body:"Mercedes commands 41% of India's luxury segment vs BMW's 29%. The gap is structural — Mercedes has a wider dealer footprint in Tier-2 cities and a stronger corporate fleet presence."},
  ];
  return (
    <div className="section-fade" style={{ padding:mob?"16px 10px":tab?"24px 18px":"34px 38px" }}>
      <SectionHeader title="Key Findings" sub="My perspective on BMW India's market dynamics — strengths, gaps, and emerging signals" />
      <div style={{ display:"grid", gridTemplateColumns:mob?"1fr":tab?"1fr":"1fr 1fr", gap:12, marginBottom:16 }}>
        {findings.map((f,i)=>(
          <div key={i} style={{ background:"#14142a", border:"1px solid #1e1e3a", borderLeft:`3px solid ${f.color}`, padding:"18px 20px", borderRadius:2 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, color:f.color }}>{f.icon}</span>
              <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontWeight:700, fontSize:14, color:"#FFFFFF" }}>{f.title}</h3>
            </div>
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc", lineHeight:1.75 }}>{f.body}</p>
          </div>
        ))}
      </div>
      <div style={{ background:"#0a3a8033", border:"1px solid #1C69D4", padding:"20px 22px", borderRadius:2 }}>
        <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:3, color:"#1C69D4", marginBottom:8 }}>Overall Assessment</h3>
        <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:14, color:"#c8c8dc", lineHeight:1.8 }}>
          BMW India is in its strongest competitive position ever, but growth is becoming harder to sustain on volume alone. The next phase of leadership will be defined by geographic expansion beyond Top-5 cities, deeper EV infrastructure ownership, and leverage of the BMW M halo effect. Strategic decisions over 2025–28 will determine whether BMW consolidates No.1 status or cedes ground to Mercedes-Benz.
        </p>
      </div>
    </div>
  );
}

/* ══════════════ RECOMMENDATIONS ══════════════ */
function RecommendationsPage() {
  const { mob, tab } = useBP();
  const recs = [
    {priority:"HIGH",   color:"#E60026",title:"Build a Tier-2 City Dealer Network",       detail:"Cities like Jaipur, Lucknow, Chandigarh, Coimbatore, and Kochi have rapidly expanding HNI populations but limited BMW touchpoints. A lightweight 'BMW Studio' format — smaller footprint, digital-first test-drive booking — could profitably expand reach without full dealership capex.",impact:"Volume +12–18% over 3 years"},
    {priority:"HIGH",   color:"#E60026",title:"Invest Directly in Charging Infrastructure",detail:"BMW should partner with Tata Power and Reliance BP Pulse to co-brand 150+ fast-chargers along India's top 10 highway corridors by 2027. Position it as 'BMW Charge' — seamless, app-integrated. This reduces range anxiety and directly accelerates iX/i4/iX1 uptake.",impact:"EV mix 10% → 25% by 2027"},
    {priority:"MEDIUM", color:"#FF9500",title:"Launch BMW M India Festival",               detail:"An annual 'BMW M Experience India' event at Buddh International Circuit or MMRT Chennai — with M car track drives, M Sport kit customisation, and invited media — would generate organic social media worth ₹15–20Cr in equivalent ad spend.",impact:"Brand equity & M variant sales lift"},
    {priority:"MEDIUM", color:"#FF9500",title:"Introduce Subscription & Flexi-Ownership",  detail:"A BMW Signature subscription (e.g., ₹1.2L/month, swap between 3 Series and X5 quarterly) would open a new demand pool, generate recurring revenue, and reduce used-car price volatility by managing inventory.",impact:"New customer segment: 30–40 age group"},
    {priority:"MEDIUM", color:"#FF9500",title:"Localise iX1 Battery Pack Assembly",        detail:"Battery packs are currently imported, making EVs vulnerable to GST changes. Partnering with Exide Energy or Amara Raja for local pack assembly would qualify for FAME-III benefits and reduce iX1 cost by ₹3–5L.",impact:"iX1 price competitiveness, margin defence"},
    {priority:"LOW",    color:"#00C851",title:"BMW India Heritage Programme",              detail:"A BMW Klassik India wing — curated restored vehicles, heritage storytelling events, and certified pre-owned classics — would build community and generate earned media. India's collector car culture is nascent but growing fast.",impact:"Community & loyalty, low capex"},
    {priority:"LOW",    color:"#00C851",title:"Strengthen Corporate Fleet Sales",           detail:"BMW's corporate fleet penetration is significantly lower than Mercedes. A dedicated fleet team targeting MNCs and consulting firms for 5 Series and 7 Series executive transport would add a predictable, lower-CAC volume channel.",impact:"Volume stability, B2B revenue"},
  ];
  return (
    <div className="section-fade" style={{ padding:mob?"16px 10px":tab?"24px 18px":"34px 38px" }}>
      <SectionHeader title="My Recommendations" sub="Strategic suggestions for BMW India's next growth chapter — prioritised by impact & urgency" />
      <div style={{ display:"flex", gap:14, marginBottom:18, flexWrap:"wrap" }}>
        {[["HIGH","#E60026"],["MEDIUM","#FF9500"],["LOW","#00C851"]].map(([p,c])=>(
          <div key={p} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }} />
            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:12, color:"#7070a0" }}>{p} Priority</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:18 }}>
        {recs.map((r,i)=>(
          <div key={i} style={{ background:"#14142a", border:"1px solid #1e1e3a", borderLeft:`4px solid ${r.color}`, padding:"16px 18px", borderRadius:2 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:10, letterSpacing:2, fontWeight:700, color:r.color, background:`${r.color}22`, padding:"3px 10px", borderRadius:2 }}>{r.priority}</span>
              <h3 style={{ fontFamily:"'Josefin Sans',sans-serif", fontWeight:700, fontSize:14, color:"#FFFFFF" }}>{r.title}</h3>
            </div>
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc", lineHeight:1.75, marginBottom:8 }}>{r.detail}</p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:"#1C69D4" }}>Expected Impact →</span>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:11, color:r.color }}>{r.impact}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:"#0b0b18", border:"1px solid #1e1e3a", padding:"18px 20px", borderRadius:2, display:"flex", gap:14, alignItems:"flex-start" }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, color:"#1C69D4", lineHeight:1, flexShrink:0 }}>!</div>
        <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:13, color:"#c8c8dc", lineHeight:1.8 }}>
          These recommendations are based on publicly available market data, BMW's disclosed strategies, and personal analytical perspective. They are intended as directional strategic inputs — execution feasibility, regulatory context, and internal BMW priorities would need to be factored in for any real-world application.
        </p>
      </div>
    </div>
  );
}

/* ══════════════ APP SHELL ══════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const { mob, tab } = useBP();
  const topRef = useRef(null);
  const navigate = (p) => { setPage(p); topRef.current?.scrollIntoView({ behavior:"smooth" }); };
  const navItems = [{id:"home",label:"Home"},{id:"data",label:"Data"},{id:"findings",label:"Findings"},{id:"recommendations",label:"Recs"}];

  return (
    <>
      <style>{GS}</style>
      <div ref={topRef} style={{ minHeight:"100vh", background:"#05050d", color:"#eeeeff", fontFamily:"'Josefin Sans',sans-serif" }}>
        <nav style={{ position:"sticky", top:0, zIndex:100, background:"#05050dee", backdropFilter:"blur(12px)", borderBottom:"1px solid #1e1e3a", display:"flex", alignItems:"center", justifyContent:"space-between", padding:mob?"10px 12px":tab?"12px 20px":"14px 40px", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0 }} onClick={() => navigate("home")}>
            <svg width={mob?24:30} height={mob?24:30} viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="38" fill="none" stroke="#1C69D4" strokeWidth="3"/>
              <path d="M40 10 A30 30 0 0 0 10 40 L40 40 Z" fill="#FFFFFF"/>
              <path d="M40 40 L70 40 A30 30 0 0 0 40 10 Z" fill="#1C69D4"/>
              <path d="M10 40 A30 30 0 0 0 40 70 L40 40 Z" fill="#1C69D4"/>
              <path d="M40 40 L40 70 A30 30 0 0 0 70 40 Z" fill="#FFFFFF"/>
            </svg>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:mob?13:tab?16:20, letterSpacing:mob?2:4, color:"#FFFFFF", whiteSpace:"nowrap" }}>{mob?"BMW":"BMW INDIA"}</span>
          </div>
          <div style={{ display:"flex", gap:mob?0:4 }}>
            {navItems.map(n=>(
              <button key={n.id} onClick={() => navigate(n.id)} style={{ fontFamily:"'Josefin Sans',sans-serif", fontWeight:600, fontSize:mob?9:tab?10:12, letterSpacing:mob?1:2, textTransform:"uppercase", background:"transparent", border:"none", cursor:"pointer", padding:mob?"6px 7px":tab?"7px 10px":"8px 14px", color:page===n.id?"#FFFFFF":"#7070a0", borderBottom:page===n.id?"2px solid #1C69D4":"2px solid transparent", transition:"all 0.2s", whiteSpace:"nowrap" }}>{n.label}</button>
            ))}
          </div>
        </nav>
        {page==="home"            && <LandingPage       onNavigate={navigate} />}
        {page==="data"            && <DataPage          />}
        {page==="findings"        && <FindingsPage      />}
        {page==="recommendations" && <RecommendationsPage />}
        <footer style={{ borderTop:"1px solid #1e1e3a", padding:mob?"12px 12px":tab?"16px 20px":"20px 48px", display:"flex", flexDirection:mob?"column":"row", justifyContent:"space-between", alignItems:mob?"flex-start":"center", gap:6 }}>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:mob?9:11, color:"#7070a0" }}>BMW India Analytics Dashboard — Personal Academic Report</span>
          <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:mob?9:11, color:"#2a2a48" }}>Data: Public sources & industry estimates • Not affiliated with BMW AG</span>
        </footer>
      </div>
    </>
  );
}
