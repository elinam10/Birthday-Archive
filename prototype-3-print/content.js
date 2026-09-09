/* =========================================================================
   CONTENT — весь текст проекта в одном месте.
   Правки текста делаются ТОЛЬКО здесь, вёрстку трогать не нужно.
   ========================================================================= */

window.CONTENT = {

  subject: "JOSÉ ANTONIO CUENCA CAÑO",

  /* ---------- КАДР 1 ---------- */
  s1: {
    boot: "BOOT SEQUENCE 01",
    lines: [
      { t: "ACCESSING PERSONAL ARCHIVE", v: "ACCEPTED" },
      { t: "YEAR: 2025–2026",            v: "ACCEPTED" },
      { t: "DATA FOUND: 87%",            v: "DENIED"   },
      { t: "RANDOM FACTS: 100%",         v: "ACCEPTED" },
      { t: "POKER FACE: 0%",             v: "ACCEPTED" },
      { t: "SUBJECT IDENTIFIED",         v: "ACCEPTED" },
      { t: "JOSÉ ANTONIO CUENCA CAÑO",   v: "ACCEPTED" },
      { t: "CURRENT VERSION 41.0",       v: "ACCEPTED" }
    ],
    loadLabel: "LOADING PERSONAL DATA...",
    loadTo: 87
  },

  /* ---------- КАДР 2 ---------- */
  s2: {
    boot: "BOOT SEQUENCE 02",
    broken: "DATA FOUND: 87%",
    fixed:  "DATA FOUND: RECOVERING",
    lines: [
      "WARNING: LIMITED DATA DETECTED",
      "DATE RANGE: OCTOBER 2025 — JANUARY 2026",
      "AVAILABLE EVIDENCE SUGGESTS: SPANISH · DEVELOPER · HANDSOME",
      "PRIMARY OBSERVER: NOT YET ENTERED THE SYSTEM",
      "DATA SOURCE: REPORTED STORIES",
      "VERIFICATION STATUS: PARTIAL"
    ],
    observer: "THE OBSERVER",
    lines2: [
      "ENTERED THE SYSTEM: FEBRUARY 2026",
      "MISSION:"
    ],
    mission: "GET TO KNOW JOSÉ ANTONIO CUENCA CAÑO",
    lines3: [
      "DIRECT OBSERVATION: STARTING FEBRUARY 2026…"
    ],
    prompt: "CONTINUE? [ YES ]",
    warn: "SYSTEM WARNING: LIMITED DATA — PROCEEDING WITH CAUTION"
  },

  /* ---------- КАДР 3 ---------- */
  s3: {
    boot: "BOOT SEQUENCE 03",
    rows: [
      ["NAME",            "JOSÉ ANTONIO CUENCA CAÑO"],
      ["FIRST RELEASE",   "19.09.1984"],
      ["PRODUCED BY",     "MARÍA CARMEN & JOSÉ ANTONIO"],
      ["CURRENT VERSION", "41.0"],
      ["UPCOMING VERSION","42.0"],
      ["UPDATE STATUS",   "PENDING"]
    ],
    sysLines: [
      "MOUNTING ARCHIVE VOLUME ......... OK",
      "DECOMPRESSING MEMORIES .......... OK",
      "INDEXING RANDOM FACTS ........... OK",
      "RUNNING FACE RECOGNITION ........"
    ],
    alert: "DETECTED",
    scanCaption: "BIOMETRIC SCAN — SUBJECT CONFIRMED ✓",
    photo: { src: "photos/s3-portrait.jpg", label: "PHOTO / SCAN", title: "SUBJECT PORTRAIT" },
    dinoNote: "SYSTEM IDLE — RUNNING OFFLINE MODE"
  },

  /* ---------- КАДР 4 ---------- */
  s4: {
    title: "12 MONTHS OF VERSION 41.0",
    meta: ["YEAR IN REVIEW · OCTOBER 2025 – SEPTEMBER 2026", "12 ENTRIES", "2 GAPS IN THE LOG", "ONE EPIC VERSION"],
    noteA: "DATA SOURCE: STORIES • GOSSIPS • ASSUMPTIONS",
    noteB: "OBSERVER HAS ENTERED THE SYSTEM",
    footer: "",
    months: [
      { id:"oct", n:"01", m:"OCTOBER 2025", icon:"⚠", gap:true,
        head:"DATA MISSED",
        body:["HISTORICAL DATA UNAVAILABLE","","THE OBSERVER HAS NOT ENTERED THE SYSTEM YET"] },

      { id:"nov", n:"02", m:"NOVEMBER 2025", icon:"⚠", gap:true,
        head:"DATA MISSED",
        body:["HISTORICAL DATA UNAVAILABLE","","THE OBSERVER HAS NOT ENTERED THE SYSTEM YET"] },

      { id:"dec", n:"03", m:"DECEMBER 2025", icon:"🐶",
        head:"NEW IDEA DETECTED",
        body:["POTENTIAL NEW LIFE COMPANION: DOG 🐶","STATUS: CONSIDERING","FUTURE DOG OWNER: MAYBE"],
        lock:{ from:"DECISION: PENDING", to:"DECISION: PENDING" },
        photo:{ src:"photos/s4-december-dog.png", label:"DOG PHOTO", title:"DECEMBER — NEW IDEA" },
        quote:"[ A NEW CHAPTER UNDER CONSIDERATION: ? ]" },

      { id:"jan", n:"04", m:"JANUARY 2026", icon:"🔄",
        head:"DECISION UPDATED",
        body:["DOG: ❌","","ACTIVE DATING MODE: 🟢 ON","","PREVIOUS PLAN: DEPRECATED"],
        lock:{ from:"NEW OBJECTIVE: MEET SOMEONE INTERESTING", to:"NEW OBJECTIVE: MEET SOMEONE INTERESTING" } },

      { id:"feb", n:"05", m:"FEBRUARY 2026", icon:"💘",
        head:"QUEST STARTED",
        body:["FIRST PROPER SUCCESSFUL DATE: DETECTED","","🗺️ MÁLAGA EXPLORATION: UNLOCKED","","🍰 PISTACHIO CHEESECAKE EATING: ACTIVATED","","☕ COFFEE CONSUMPTION: INCREASED"],
        lock:{ from:"NEW CHAPTER: STARTED", to:"NEW CHAPTER: STARTED" } },

      { id:"mar", n:"06", m:"MARCH 2026", icon:"💋", ribbon:"FIRST KISS OF 2026",
        head:"NEW ACHIEVEMENT",
        body:["🏆 FIRST KISS OF 2026","🍰 PISTACHIO CHEESECAKE: UNLIMITED","☕ COFFEE TIME: INCREASED RAPIDLY"],
        photo:{ src:"photos/s4-march-kiss.png", label:"KISS PHOTO", title:"MARCH — FIRST KISS" },
        lock:{ from:"ACHIEVEMENT: UNLOCKED", to:"ACHIEVEMENT: UNLOCKED" } },

      { id:"apr", n:"07", m:"APRIL 2026", icon:"🛥️",
        head:"NEW SKILL TREE",
        body:["🛥️ SAILING — TRAINING STARTED"],
        bar:{ label:"PROGRESS", to:72 },
        body2:["NEW ERA: DETECTED","🔓 NEW EXPERIENCES","🔓 NEW ROUTINES","🔓 NEW POSSIBILITIES"],
        lock:{ from:"BACHELOR LIFE: CHANGED", to:"BACHELOR LIFE: CHANGED" } },

      { id:"may", n:"08", m:"MAY 2026", icon:"📚",
        head:"STUDY MODE: ACTIVE",
        body:["📚 STUDY HOURS: HIGH","EXAMS: INCOMING"],
        bar:{ label:"FOCUS", to:90 },
        bar2:{ label:"FREE TIME", to:20 },
        lock:{ from:"STUDY MODE: ACTIVATED", to:"STUDY MODE: ACTIVATED" } },

      { id:"jun", n:"09", m:"JUNE 2026", icon:"🏆",
        head:"MAJOR ACHIEVEMENT — BOAT LICENSE",
        body:["SAILING EXAMS: PASSED ✅","BOAT DRIVER LICENSE: UNLOCKED","NEW STATUS: ⛵ PATRÓN","PREVIOUS SKILL LEVEL: BEGINNER","CURRENT SKILL LEVEL: BOAT PATRON"],
        lock:{ from:"LICENSE: LOCKED", to:"LICENSE: UNLOCKED ✓" },
        photo:{ src:"photos/s4-june-boat.jpg", label:"PHOTO / SCAN", title:"PATRÓN — JUNE 2026" } },

      { id:"jul", n:"10", m:"JULY 2026", icon:"⚽",
        head:"SUMMER CHALLENGE",
        body:["🌡️ CITY EXPLORATION — HARD MODE","TEMPERATURE: 🔥🔥🔥🔥🔥","THE HIGHEST DEGREE OF THE YEAR","OBJECTIVE: EXPLORE THE CITIES ANYWAY"],
        lock:{ from:"STATUS: COMPLETED ✅", to:"STATUS: COMPLETED ✅" },
        sub:{ head:"🏆 WORLD CUP MODE",
              body:["🇪🇸 TEAM SELECTED: SPAIN","MATCHES WATCHED: NO DATA AVAILABLE"],
              lock:"EMOTIONAL INVESTMENT: 100%" } },

      { id:"aug", n:"11", m:"AUGUST 2026", icon:"🏖️",
        head:"CHILL MODE ACTIVATED",
        body:["🌊 TORREMOLINOS BEACH TIME","🍧 SOLERO: MANY","👯 FRIENDS TIME: PLENTY","🌾 BUCKWHEAT: TRIED"],
        lock:{ from:"VIBES: CHILL 😎", to:"VIBES: CHILL 😎" },
        photo:{ src:"photos/s4-august-beach.jpg", label:"PHOTO / SCAN", title:"TORREMOLINOS — AUGUST 2026" } },

      { id:"sep", n:"12", m:"SEPTEMBER 2026", icon:"🎂",
        head:"PREVIOUS VERSION: COMPLETED ✅",
        body:["UPCOMING RELEASE: VERSION 42.0","RELEASE DATE: 19.09.2026","NEW VERSION LOADING…"],
        loaders:["NEW SKILLS","NEW PLACES","NEW STORIES","NEW ACHIEVEMENTS"],
        lock:{ from:"STATUS: READY TO DEPLOY", to:"STATUS: READY TO DEPLOY" } }
    ]
  },

  /* ---------- КАДР 5 ---------- */
  s5: {
    title: "PEOPLE AND CONNECTIONS",
    quote: ["A YEAR IS NOT JUST WHAT YOU DO.", "IT IS ALSO WHO YOU SPEND IT WITH…"],
    blocks: [
      { key:"FAMILY",       caption:"FAMILY IMPORTANCE: HIGH",        src:"photos/s5-family.jpg" },
      { key:"COLLEAGUES",   caption:"COLLEAGUES CONNECTION: ACTIVE",  src:"photos/s5-colleagues.jpg", logo:"photos/logo.png" },
      { key:"FRIENDSHIP",   caption:"FRIENDSHIP LEVEL: HIGH",         src:"photos/s5-friends.jpg", collage:true },
      { key:"RELATIONSHIP", caption:"RELATIONSHIP SKILL LEVEL: MAX",  src:"photos/s5-relationship.jpg" }
    ],
    summary: ["SOCIAL MODULE: 4 OF 4 CONNECTIONS ACTIVE ✓", "POSITIVE IMPACT: CONFIRMED ✓", "MAKING LIFE BETTER: ALWAYS ✓"],
    footer: ""
  },

  /* ---------- КАДР 6 ---------- */
  s6: {
    title: "KNOWN LOCATIONS",
    region: "ANDALUCÍA, SPAIN",
    status: ["EXPLORATION STATUS: ACTIVE", "BEYOND THE USUAL ROUTES"],
    /* порядок появления строго по ТЗ */
    pins: [
      { name:"NERJA",        x:612, y:428 },
      { name:"ÚBEDA",        x:689, y:182 },
      { name:"RONDA",        x:400, y:400, side:"left" },
      { name:"GRANADA",      x:653, y:330 },
      { name:"CÓRDOBA",      x:472, y:203 },
      { name:"BENALMÁDENA",  x:487, y:437, side:"left" },
      { name:"TORREMOLINOS", x:515, y:458, hot:true }
    ],
    malaga: { name:"MÁLAGA", x:534, y:386 },
    zoomTitle: "MÁLAGA",
    /* фон карты города — реальный кроп (photos/s6-malaga-base.png,
       исходник 1564×1006, см. s6-malaga-source.png) без пяти POI-маркеров.
       Каждый POI — готовый растровый слой pin+label, вырезанный из ТОГО ЖЕ
       исходника (координаты — его собственные пиксели, x/y/width/height —
       это именно тот прямоугольник, откуда вырезан слой), поэтому наложение
       поверх base ложится геометрически идеально без пересчёта. Порядок —
       порядок появления в SC6.play(), менять нельзя */
    zoomPins: [
      { name:"BOTANICAL GARDEN", src:"photos/s6-malaga-botanical.png",   x:522, y:183, width:227, height:66 },
      { name:"GIBRALFARO",       src:"photos/s6-malaga-gibralfaro.png",  x:973, y:357, width:162, height:52 },
      { name:"ALCAZABA",         src:"photos/s6-malaga-alcazaba.png",    x:925, y:405, width:140, height:53 },
      { name:"PICASSO MUSEUM",   src:"photos/s6-malaga-picasso.png",     x:935, y:452, width:214, height:54 },
      { name:"CITY CENTRE",      src:"photos/s6-malaga-city-centre.png", x:731, y:439, width:176, height:54 }
    ],
    summary: ["TOTAL LOCATIONS: 8", "MÁLAGA SUB-LOCATIONS: 5"],
    highlight: ["TORREMOLINOS", "THE MOST VISITED LOCATION OF VERSION 41.0"]
  },

  /* ---------- КАДР 7 ---------- */
  s7: {
    title: "JOSE'S LEGACY FEATURES",
    sub: "SOME FEATURES HAVE BEEN RUNNING FOR YEARS",
    opinion: "OPINION DATABASE: EXTREMELY SPECIFIC ✓",
    footnote: ["END OF LOG", "SAVING DATA", "DATA SAVED"],
    version: "version 41.0",
    legacy: {
      title: "LEGACY STATUS",
      lines: ["FEATURES TRACKED: 06/06", "MEMORIES STORED: ∞", "REALITY: STILL GOOD"]
    },
    blocks: [
      { n:"01", t:"DECISIONS 🔄", items:[
        "🐶 DOG — CONSIDERED → CANCELLED ✓",
        "❤️ RELATIONSHIP STATUS: UPDATED ✓",
        "🛥️ SAILING: LICENSE UNLOCKED ✓",
        "🩴 CRITICAL DECISION:",
        "   RICK & MORTY FLIP-FLOPS: DEPRECATED ❌"
      ]},
      { n:"02", t:"LANGUAGE UPDATE", items:[
        "🔓 BOUNDARIES — NEW MEANING: INSTALLED ✓",
        "🔓 COMMITMENT — NEW MEANING: INSTALLED ✓",
        "🔓 GOSSIP (GOSSIP ERA) — NEW MEANING: INSTALLED ✓",
        "GOSSIP VOCABULARY SUCCESSFULLY INSTALLED ✓"
      ]},
      { n:"03", t:"SKILLS & DISCOVERIES", items:[
        "🛥️ SAILING — LICENSE: UNLOCKED ✓",
        "💃 DANCING — SALSA / BACHATA: ENJOYED ✓",
        "🏋️ GYM: DETECTED ✓",
        "TARTAR FAMILY PIE RECIPE: TRIED ✓"
      ]},
      { n:"04", t:"JOSÉ'S OFFICIAL OPINIONS™ 🗣️", items:[
        "📱 WHATSAPP: QUESTIONABLE COMMUNICATION TECHNOLOGY",
        "🕊️ PIGEONS: PREFERRED COMMUNICATION PROTOCOL",
        "   WHY USE WHATSAPP IF PIGEONS EXIST?",
        "   STATUS: PENDING INVESTIGATION",
        "🥘 PAELLA — TIME-SENSITIVE FOOD",
        "   BEFORE 16:00: ACCEPTABLE ✓",
        "   AFTER 16:00: ABSOLUTELY NOT ❌",
        "   PERSONAL RULE: PAELLA.EXE HAS WORKING HOURS",
        "🍚 LOMO CON PATATA + COFFEE: REJECTED ❌",
        "🍰 PISTACHIO CHEESECAKE + COFFEE: SUCCESSFUL ✓"
      ]},
      { n:"05", t:"FAMILY TECH SUPPORT", items:[
        "HELPS HIS FAMILY WITH TECHNICAL PROBLEMS",
        "STATUS: ALWAYS AVAILABLE ✓"
      ]},
      { n:"06", t:"JOSÉ'S QUIRKS", items:[
        "😐 POKER FACE: STILL UNAVAILABLE",
        "RICK & MORTY FAN STATUS: CONFIRMED — APRIL 2026",
        "🎮 FINAL FANTASY VII & 🦖 TRICERATOPS",
        "   STATUS: ALL-TIME FAVOURITE ✓",
        "💬 DEEP THINKING MODE: OFTEN ACTIVE",
        "🧠 DEVELOPER BRAIN: 24/7 MODE",
        "🫒 OLIVES: DISGUSTING"
      ]}
    ]
  },

  /* ---------- КАДР 8 ---------- */
  s8: {
    title: "JOSE'S CORE CHARACTER",
    sub: "BEYOND THE DATA",
    status: "PERSONALITY SYSTEM: ANALYZED ✓",
    photo: { src:"photos/s8-portrait.jpg", label:"PHOTO / SCAN", title:"CORE CHARACTER" },
    traits: [
      { i:"🫶", t:"KIND, THOUGHTFUL & CARING", d:"KIND BY NATURE, THOUGHTFUL IN THE WAY YOU TREAT OTHERS, AND ALWAYS THERE FOR THE PEOPLE YOU LOVE" },
      { i:"👂", t:"ATTENTIVE",             d:"YOU LISTEN, YOU NOTICE THE LITTLE THINGS, AND YOU REMEMBER" },
      { i:"💡", t:"PROBLEM SOLVER",        d:"WHATEVER LIFE THROWS YOUR WAY, YOU KEEP A COOL HEAD, FIGURE THINGS OUT, AND FIND A WAY FORWARD" },
      { i:"😄", t:"A GREAT SENSE OF HUMOUR", d:"YOU MAKE PEOPLE LAUGH, AND SOMEHOW, LIFE WITH YOU IS NEVER BORING" },
      { i:"🌿", t:"WARM & GENUINE",        d:"YOU MAKE PEOPLE FEEL ACCEPTED, VALUED, AND FREE TO BE THEMSELVES" },
      { i:"🧠", t:"CURIOUS & OPEN-MINDED", d:"YOU ARE CURIOUS ABOUT PEOPLE, LIFE, AND EVERYTHING THERE IS TO DISCOVER" },
      { i:"🌱", t:"ALWAYS GROWING",        d:"YOU KEEP LEARNING, EXPLORING, AND BECOMING AN EVEN BETTER VERSION OF YOURSELF" },
      { i:"👨‍👩‍👦", t:"FAMILY-ORIENTED",  d:"YOUR PEOPLE MATTER TO YOU, AND FAMILY ALWAYS HAS A SPECIAL PLACE IN YOUR HEART" }
    ],
    centerTop: "CHARACTER DEVELOPMENT +100%",
    centerLog: [
      "PERSONALITY SCAN: COMPLETE ✓",
      "CORE FEATURES DETECTED: 8",
      "POSITIVE TRAITS: TOO MANY TO LIST",
      "SECRET FEATURES: FRIENDS & FAMILY ONLY 🔓"
    ],
    centerMid: ["AND SOMEHOW YOU BECAME EVEN BETTER", "EVEN COOLER · EVEN KINDER · AND STILL KRASAFCHIK 🫶"],
    centerStatus: "> STATUS: AMAZING HUMAN ✓",
    score: "PERSONALITY SCORE",
    note: ["SYSTEM NOTE: KEEP BEING YOU. THE WORLD NEEDS IT."],
    secret: ["PRIMARY OBSERVER'S NOTE",
             "AFTER ALL THE DATA, STORIES, PLACES, ACHIEVEMENTS AND RANDOM FACTS…",
             "I HAVE TO ADMIT, I ADMIRE YOU 🫶"]
  },

  /* ---------- КАДР 9 ---------- */
  s9: {
    title: "JOSE'S NUMBERS & STATISTICS",
    trendsTitle: "MONTHLY TRENDS · OCTOBER 2025 – SEPTEMBER 2026",
    monthLabels: ["O","N","D","J","F","M","A","M","J","J","A","S"],
    trends: [
      { i:"🍰", name:"PISTACHIO CHEESECAKE", data:[2,3,6,12,58,92,96,74,66,60,46,44] },
      { i:"😴", name:"SLEEP",                data:[90,88,91,86,82,78,62,55,52,50,51,56] },
      { i:"🎮", name:"GAMING",               data:[80,82,78,80,70,64,45,35,30,28,25,31] },
      { i:"🍳", name:"BREAKFASTS",           data:[20,18,22,20,31,42,74,85,88,92,95,90] }
    ],
    shift: "LIFESTYLE SHIFT DETECTED — APRIL 2026 → SEPTEMBER 2026",
    statsTitle: "KEY STATISTICS",
    stats: [
      { label:"POKER FACES MASTERED",        value:0,      suffix:"" },
      { label:"OLIVES EATEN",                value:0,      suffix:"" },
      { label:"PUMBAS SEEN AND HEARD",       value:3,      prefix:"~", suffix:" 🐗" },
      { label:"MUSIC FESTIVALS ATTENDED",    value:4,      raw:"3–4 ???" },
      { label:"MOVIES WATCHED IN THE CINEMA",value:4 },
      { label:"NEW PLACES DISCOVERED",       value:8 },
      { label:"TINTO DE VERANO",             value:81,     suffix:" LITRES 🍷" },
      { label:"ESPETOS EATEN",               value:98,     suffix:" PIECES 🍢" },
      { label:"DRIVING DISTANCE",            value:10923,  prefix:"≈", suffix:" KM 🚗" },
      { label:"STEPS TAKEN",                 value:999999, prefix:"≈", suffix:" STEPS 👟" }
    ],
    coffee: { label:"COFFEE CONSUMED", value:1113, unit:"CUPS ☕", alert:"CRITICAL AMOUNT" },
    repairsTitle: "REPAIRS COMPLETED",
    repairs: [
      { i:"🔥", label:"LIGHTER IN THE FRIDGE", v:"1" },
      { i:"🚿", label:"SINK",                  v:"1" },
      { i:"🍽️", label:"DISHWASHER",           v:"1" },
      { i:"🔥", label:"BOILER",                v:"1" },
      { i:"🖼️", label:"PAINTINGS & STUFF HUNG", v:"OBSERVER LOST COUNT" }
    ],
    footnote: ["PRIMARY OBSERVER: DATA COLLECTION ONGOING...",
               "DISCLAIMER: SOME DATA POINTS MAY BE INCOMPLETE OR INACCURATE"],
    progress: { label:"VERSION 42.0 IN PROGRESS · UPDATE", to:89 }
  },

  /* ---------- КАДР 10 ---------- */
  s10: {
    boot: "ARCHIVE MODE",
    head: ["VERSION 41.0", "RELEASE ARCHIVED ✓"],
    period: [["RELEASE PERIOD","SEPT 2025 → SEPT 2026"],["STATUS","COMPLETED ✓"]],
    highlightsTitle: "HIGHLIGHTS",
    highlights: [
      "🌍 NEW PLACES: DISCOVERED",
      "🛥️ SAILING LICENSE: UNLOCKED",
      "🧠 NEW MEANINGS: INSTALLED",
      "❤️ PEOPLE & CONNECTIONS: CONFIRMED",
      "🛠️ PROBLEMS: SOLVED",
      "😄 GOOD MEMORIES: COLLECTED"
    ],
    saved: ["MEMORIES:  SAVED ✓","EXPERIENCES: STORED ✓","LESSONS:  LEARNED ✓","DATA: ARCHIVED ✓"],
    thanks: "THANK YOU, VERSION 41.0",
    prompt: ["VERSION 42.0 →", "INSTALL UPDATE? → [ YES ]"],
    installLabel: "INSTALLING VERSION 42.0",
    systems: ["ALL SYSTEMS: ONLINE ✓","NEW FEATURES: INSTALLED ✓","LEGACY FEATURES: PRESERVED ✓","CHARACTER DEVELOPMENT: CONTINUOUS ✓"],
    installLog: [
      "INSTALLING NEW POSITIVE EXPERIENCES... OK",
      "INSTALLING NEW PLACES TO DISCOVER... OK",
      "INSTALLING NEW HAPPY STORIES TO TELL... OK",
      "INSTALLING NEW ADVENTURES... OK",
      "INSTALLING NEW BEAUTIFUL MEMORIES... OK"
    ],
    done: "VERSION 42.0 SUCCESSFULLY INSTALLED",
    hbd: "HAPPY BIRTHDAY, JOSÉ ANTONIO CUENCA CAÑO!!!",
    wishes: [
      "THE BEST IS YET TO COME!",
      "EVERY NEW VERSION OF YOU MAKES THE WORLD A LITTLE BETTER ❤️",
      "KEEP EXPLORING! KEEP LAUGHING! KEEP BEING YOU!"
    ],
    tail: ["> LIFE: IN PROGRESS   > NEXT UPDATE: 43.0"]
  },

  /* ---------- ПОДПИСИ СЦЕН ДЛЯ МЕНЮ ---------- */
  menu: [
    "ACCESSING PERSONAL ARCHIVE",
    "LIMITED DATA / THE OBSERVER",
    "SUBJECT CARD",
    "12 MONTHS OF VERSION 41.0",
    "PEOPLE AND CONNECTIONS",
    "KNOWN LOCATIONS",
    "JOSE'S LEGACY FEATURES",
    "CORE CHARACTER",
    "NUMBERS & STATISTICS",
    "ARCHIVE / VERSION 42.0"
  ]
};
