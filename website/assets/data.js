/* RRPL network and company data.
 * Source: rajeshrpl.in (pan-india-network, about-company, fleets), checked 17 Nov 2026.
 * Edit this file to add, move or close a branch. Phones are kept exactly as published.
 */
window.RRPL_DATA = {
  company: {
    name: "Rajesh Roadlines Pvt. Ltd.",
    short: "RRPL",
    founded: 1969,
    motto: "First time & every time",
    phone: "022-62284444",
    phoneE164: "+912262284444",
    email: "info@rajeshrpl.in",
    address: "1002, 10th Floor, 360 Degree Business Park, Next to R Mall, LBS Road, Mulund West, Mumbai 400080",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=360+Degree+Business+Park+Mulund+West+Mumbai+400080",
    profilePdf: "assets/RRPL-company-profile.pdf",
    hours: [["Monday to Friday", "8:00 am to 7:00 pm"], ["Saturday", "10:00 am to 5:00 pm"]],
    offices: [
      { name: "Corporate office", address: "1002, 10th Floor, 360 Degree Business Park, Next to R Mall, LBS Road, Mulund West, Mumbai 400080", phones: ["022-62284444"], email: "info@rajeshrpl.in" },
      { name: "Registered office", address: "399, Narshi Natha Street, Katha Bazar, Mumbai 400009", phones: ["022-23420051", "022-23400080", "022-40590000"], email: "info@rajeshrpl.in" },
      { name: "Area office, Goa", address: "G/5, Kurtarkar Commercial Arcade, Ponda, Goa 403401", phones: ["0832-2318663"], email: "ponda@rajeshrpl.in" }
    ]
  },

  regions: [
    { id: "mumbai", label: "Mumbai & Navi Mumbai", state: "Maharashtra" },
    { id: "konkan", label: "Konkan (Sindhudurg)", state: "Maharashtra" },
    { id: "goa", label: "Goa", state: "Goa" },
    { id: "gujarat", label: "Gujarat", state: "Gujarat" }
  ],

  /* kind: office | area-office | corporate | doorstep | representative */
  branches: [
    { town: "Corporate Office", region: "mumbai", kind: "corporate", phones: ["9223258559", "9223200532"], address: "1002, 10th Floor, 360 Degree Business Park, next to R Mall, Mulund West, Mumbai 400080" },
    { town: "Bhiwandi", region: "mumbai", kind: "office", phones: ["9833533893"], address: "Gala No. 4, BGTA Compound, near Maharashtra Punjab Hotel, Rehnal, Bhiwandi 421302", email: "bhiwandi@rajeshrpl.in" },
    { town: "Vashi", region: "mumbai", kind: "office", phones: ["022-27832564", "8291843467"], address: "Plot 156/158, Sector 19-C, Godown 5, 6, 7, behind SBI Bank, Vashi, Navi Mumbai", email: "vashi@rajeshrpl.in" },
    { town: "Sakinaka", region: "mumbai", kind: "office", phones: ["022-28522117", "8291843466"], address: "A-2 KBR Sadan, near Tiwari Hospital, opposite Gulshan Hotel, Sakinaka, Mumbai 400070", email: "sakinaka@rajeshrpl.in" },
    { town: "Katha Bazar", region: "mumbai", kind: "office", phones: ["022-40590009", "8291843462"], address: "399 Narshi Natha Street, Katha Bazar, Mumbai 400009", email: "kathabazar@rajeshrpl.in" },
    { town: "Vasai", region: "mumbai", kind: "office", phones: ["0250-3299188", "9322991351"], address: "Disha Roadlines, Gala No. 3, Agarwal Shopping Complex, Sativali Road, Vasai (E) 401208" },

    { town: "Kankavli", region: "konkan", kind: "office", phones: ["8275482197"], address: "Usha-Kiran Building, near Panchayat Samiti Office, Mumbai-Goa Road, Kankavli" },
    { town: "Kudal", region: "konkan", kind: "office", phones: ["02362-222728", "9422394342"], address: "Sharad & Co., near Ganesh Krupa Hotel, Kudal" },
    { town: "Sawantwadi", region: "konkan", kind: "office", phones: ["02363-272510"], address: "M/s. Late Shri Vasudeo Kamat, Vitthal Mandir Road, Sawantwadi" },
    { town: "Vengurla", region: "konkan", kind: "office", phones: ["02366-262039"], address: "M/s. Lata Goods Transport, Bhat Wadi, Vengurla" },
    { town: "Devgad", region: "konkan", kind: "office", phones: ["9975865544", "9421052886"], address: "Datt Krupa Niwas, behind Panchayat Samiti, Devgad" },
    { town: "Malvan", region: "konkan", kind: "office", phones: ["02365-252419", "02365-251169", "9423806152"], address: "Mr. Shekhar Mungekar, Bharad, Malvan, Sindhudurg" },
    { town: "Kharepathan", region: "konkan", kind: "doorstep", phones: [], address: "" },
    { town: "Tarele", region: "konkan", kind: "doorstep", phones: [], address: "" },
    { town: "Kasal", region: "konkan", kind: "doorstep", phones: [], address: "" },

    { town: "Ponda (Area Office)", region: "goa", kind: "area-office", phones: ["0832-2318663", "0832-2312141", "9850234559"], address: "G/5 Kurtarkar Commercial Arcade, Ponda", email: "ponda@rajeshrpl.in" },
    { town: "Ponda", region: "goa", kind: "office", phones: ["9822123906", "9921876644"], address: "Gracious Building, near State Bank of India, Ponda", email: "ponda@rajeshrpl.in" },
    { town: "Mapusa", region: "goa", kind: "office", phones: ["7208874141"], address: "Shop 13, Satt Adhar Building, near Pendem Ground, Mapusa 403507", email: "ponda@rajeshrpl.in" },
    { town: "Bicholim", region: "goa", kind: "office", phones: ["0832-2362066", "0832-2362533", "9423811190"], address: "Opposite Municipal Market, Bicholim", email: "ponda@rajeshrpl.in" },
    { town: "Panjim", region: "goa", kind: "office", phones: ["9372627430", "9359653226"], address: "Spana Paradise, Shop 12 & 13, Merces-wadi, Panjim 403001", email: "panjim@rajeshrpl.in" },
    { town: "Corlim", region: "goa", kind: "office", phones: ["0832-2284832", "9326138193"], address: "Godown 3, near Mallik Petrol Pump, Corlim 403110", email: "corlim@rajeshrpl.in" },
    { town: "Kundaim", region: "goa", kind: "office", phones: ["0832-2396071", "9372627431"], address: "Plot 263/AM, opposite Goa IDC Canteen, Shop 6, 7, 9, Kundaim", email: "kundaim@rajeshrpl.in" },
    { town: "Verna", region: "goa", kind: "office", phones: ["0832-2783128", "9326138194"], address: "Rajesh House, Plot SC 1/45, Phase I, Verna Industrial Estate 403722", email: "verna@rajeshrpl.in" },
    { town: "Margao", region: "goa", kind: "office", phones: ["0832-2714312"], address: "Opposite Current Soda Factory, Malbhat, Margao" },
    { town: "Vasco da Gama", region: "goa", kind: "office", phones: ["0832-2511386"], address: "Near State Bank of India, Vasco da Gama" },
    { town: "Sauvordem", region: "goa", kind: "office", phones: ["9923845127", "9422060227"], address: "Glady Ferlandies Building, Shop 1, opposite Raj Motors Garage, Sauvordem 403706" },

    { town: "Ahmedabad (Aslali)", region: "gujarat", kind: "office", phones: ["9374599699"], address: "Rajesh House, Plot 136, Aslali Transport Nagar, Aslali Highway Road, Ahmedabad 382427", email: "ahmedabad@rajeshrpl.in" },
    { town: "Ahmedabad (Narol)", region: "gujarat", kind: "office", phones: ["9374599699"], address: "13/3 Thakor Estate, behind Rahil Weighbridge, opposite Shahwadi Bus Stop, Narol-Aslali Road, Ahmedabad 382405", email: "ahmedabad@rajeshrpl.in" },
    { town: "Ankleshwar", region: "gujarat", kind: "office", phones: ["02646-223074", "9377171708"], address: "A/2-2507 GIDC Main Road, opposite Asian Paints, Gate 2, GIDC, Ankleshwar", email: "ankleshwar@rajeshrpl.in" },
    { town: "Vapi", region: "gujarat", kind: "office", phones: ["9377199969"], address: "Golson Chambers, Plot 160/1, Godown 10/11, near Sima Weighbridge, GIDC Phase II, Vapi", email: "vapi@rajeshrpl.in" },
    { town: "Dahej", region: "gujarat", kind: "representative", phones: ["9327926855"], address: "", email: "dahej@rajeshrpl.in" },
    { town: "Hazira", region: "gujarat", kind: "representative", phones: ["8291843470"], address: "", email: "hazira@rajeshrpl.in" }
  ],

  /* Other names customers type for the same place */
  aliases: {
    "panaji": "Panjim", "panjim": "Panjim", "vasco": "Vasco da Gama", "madgaon": "Margao", "margao": "Margao",
    "navi mumbai": "Vashi", "vashi": "Vashi", "ankaleshwar": "Ankleshwar", "aslali": "Ahmedabad (Aslali)",
    "narol": "Ahmedabad (Narol)", "ahmedabad": "Ahmedabad (Aslali)", "amdavad": "Ahmedabad (Aslali)",
    "mulund": "Corporate Office", "saki naka": "Sakinaka", "kankavali": "Kankavli",
    "savantwadi": "Sawantwadi", "sawantwadi": "Sawantwadi", "bhiwandi": "Bhiwandi", "vasai": "Vasai",
    "ponda": "Ponda", "kundai": "Kundaim", "kundaim": "Kundaim", "sanvordem": "Sauvordem", "verna": "Verna"
  },

  /* The six services from the old site, with its own icons (assets/icons). */
  services: [
    { title: "Clearing and Forwarding", icon: 1, text: "Receiving, holding and forwarding goods on behalf of manufacturers." },
    { title: "Freight Forwarding", icon: 3, text: "Consignments booked and moved end to end, full load or part load." },
    { title: "C & F Services", icon: 5, text: "Carrying and forwarding agency services for brand owners." },
    { title: "Interstate Transport", icon: 4, text: "Scheduled lanes between Gujarat, Mumbai, Konkan and Goa." },
    { title: "Distribution Warehousing", icon: 2, text: "Stock held close to the market and dispatched on order." },
    { title: "Primary & Secondary Distribution", icon: 6, text: "Plant to depot and depot to dealer, with door-step delivery." }
  ],

  cargo: ["FMCG", "Hazardous chemicals in packs", "Parcel logistics", "Customised high-priority cargo", "ISO tanks", "EXIM logistics"],

  fleet: [
    { name: "Pick-up", capacity: "1 t", t: 1 },
    { name: "Canter", capacity: "3 to 3.5 t", t: 3.5 },
    { name: "LCV / LPT (Eicher, Mahindra)", capacity: "5, 6 and 8 t", t: 8 },
    { name: "Tempo, full or half body", capacity: "9 t", t: 9 },
    { name: "Container body truck", capacity: "9 t", t: 9 },
    { name: "Truck", capacity: "10 t", t: 10 },
    { name: "Multi-axle", capacity: "16 t", t: 16 },
    { name: "20 ft trailer, double or triple axle", capacity: "20 ft", t: 20 },
    { name: "Gas tanker", capacity: "25, 31 and 35 t", t: 35 },
    { name: "40 ft trailer, double or triple axle", capacity: "40 ft", t: 40 }
  ],

  about: {
    heading: "Top class logistics solution provider since 1969",
    tagline: "Providing a reliable service since 1969",
    experience: "50+ years of experience in field transportation",
    founderVision: "Late Shri N.D. Somaiya established the vision of “Value for Money” for customers, which is now the rule of the day.",
    image: { src: "assets/photos/about-since-1969.jpg", remote: "https://rajeshrpl.in/wp-content/uploads/2021/09/Untitled-3-02.jpg", alt: "Archive photo of an early Rajesh public carrier truck" },
    vision: [
      "To be acknowledged as the best ‘Partner of Choice’ in transportation and supply chain solutions.",
      "To be the first ‘Responsible Care’ recognised transport organisation."
    ],
    mission: "To be a one-stop address for your supply chain solutions, owing to high reliability and perfect execution.",
    values: [
      "Dedicated to discovering and developing possibilities that improve customer supply chain strategies by understanding customer expectations.",
      "Our business philosophy is based on providing the highest possible service."
    ]
  },

  /* Words from leadership, as published on the old site. */
  messages: [
    { name: "Chandresh Somaiya", role: "Managing Director", photo: "chandresh", text: "With the blessings and hard work of Shri. ND Somaiya, we have established a company that prioritizes work over everything." },
    { name: "Late Shri N.D. Somaiya", role: "Founder", photo: "nd", text: "Our vision is to cater to every individual with the best logistical services in cost-effective ways." },
    { name: "Jigar Somaiya", role: "Director", photo: "jigar", text: "With modern times, the logistics industry has grown dynamically and my plan is to take it to different heights and keep our company aligned with the future upgrades and trends." }
  ],

  /* Wording follows the old site's Man | Driver, Machine | Fleet, Terrain | Route lists. */
  approach: [
    { key: "man", title: "Driver", label: "Man",
      image: { src: "assets/photos/man-driver.jpg", remote: "https://rajeshrpl.in/wp-content/uploads/2021/10/IMG_9486-scaled.jpg", alt: "RRPL drivers in safety helmets in front of a Rajesh Roadlines truck" },
      points: ["Training for discipline", "Driving assessment", "Chemical licence", "Fatigue management", "Reduced night driving", "Ownership for safety", "The mentor treatment"] },
    { key: "machine", title: "Fleet", label: "Machine",
      image: { src: "assets/photos/machine-fleet.jpg", remote: "https://rajeshrpl.in/wp-content/uploads/2021/10/photo_2021-10-13_17-13-48.jpg", alt: "Two RRPL Ashok Leyland trucks at the yard" },
      points: ["Fleet maintenance", "Proactive maintenance", "Regulatory documents", "GPS surveillance", "Right driver selection", "Upgrading driver knowledge", "SOP checks before every journey"] },
    { key: "terrain", title: "Route", label: "Terrain",
      image: { src: "assets/photos/terrain-route.jpg", remote: "https://rajeshrpl.in/wp-content/uploads/2021/09/Untitled-3-26-570x430.jpg", alt: "Loaded RRPL truck passing an elephant on a forest road" },
      points: ["Time and distance study", "Journey management plan", "Identifying route black spots", "Route survey for high-value and hazardous cargo", "Emergency route support set up", "GPS control of route deviations", "Saving diesel and avoiding tolls"] }
  ],

  features: {
    operations: ["ADR classification of chemical cargo", "Strict non-conformance management", "Real-time MIS on cargo in transit", "GPS-aided operations", "Product identifiers for chemicals", "In-house emergency response plan"],
    customers: ["Transparent pricing", "On-time delivery", "Real-time tracking", "Round-the-clock support", "Experienced staff", "Insurance and guarantee"]
  },

  hsseq: ["Promote a Go-Green way of working", "An injury-free workplace", "Consignments kept safe in transit", "Full commitment to EHS norms", "Zero loss of man-hours", "Safety of men, material and money"],

  /* Figures shown as counters, as published on the old rajeshrpl.in homepage. Set value to null to hide one.
     The old site also claimed "30 branches across India"; the page shows the 32 listed locations instead. */
  stats: [
    { label: "GPS-enabled vehicles", value: "100+" },
    { label: "Expert employees", value: "60+" },
    { label: "Satisfied clients", value: "20,000+" },
    { label: "Sq. ft. of warehousing", value: "33,000+" }
  ],

  /* News shown on the page. When the platform is live, its /api/public/updates feed is shown instead. */
  news: [
    { date: "13 November", title: "Mahindra Rising Star: Jigar Somaiya", text: "Director Jigar Somaiya recognised as a Mahindra Rising Star.", url: "https://rajeshrpl.in/news-updates/" }
  ],

  hero: [
    { src: "assets/photos/hero-1.jpg", alt: "Row of RRPL Ashok Leyland trucks at the yard" },
    { src: "assets/photos/hero-2.jpg", alt: "RRPL Goods Carrier trucks lined up" },
    { src: "assets/photos/hero-3.jpg", alt: "RRPL gas tanker on the road at dusk" }
  ],

  /* Customer letters published on the old site as testimonials. */
  letters: [
    { from: "BASF India Limited", title: "Certificate of Appreciation", img: "award-14", text: "Working with BASF India as a transport service provider since 2009, on a pan-India basis. Service levels have been very good and freight rates competitive, with pro-active steps to improve safety standards." },
    { from: "Letter of recommendation", title: "Letter of Recommendation", img: "award-15", text: "Domestic, export and import movements of hazardous goods since August 2016, across Gujarat, Maharashtra and Uttar Pradesh." }
  ],

  fleetCats: { "20ft": "20 ft trailers", "40ft": "40 ft trailers", tanker: "Gas tankers", truck: "Trucks" },
  fleetPhotos: [{"src": "assets/fleet/20ft-01.jpg", "thumb": "assets/fleet/20ft-01-sm.jpg", "cat": "20ft", "w": 640, "h": 480}, {"src": "assets/fleet/20ft-02.jpg", "thumb": "assets/fleet/20ft-02-sm.jpg", "cat": "20ft", "w": 640, "h": 640}, {"src": "assets/fleet/20ft-03.jpg", "thumb": "assets/fleet/20ft-03-sm.jpg", "cat": "20ft", "w": 640, "h": 352}, {"src": "assets/fleet/20ft-04.jpg", "thumb": "assets/fleet/20ft-04-sm.jpg", "cat": "20ft", "w": 480, "h": 640}, {"src": "assets/fleet/20ft-05.jpg", "thumb": "assets/fleet/20ft-05-sm.jpg", "cat": "20ft", "w": 640, "h": 480}, {"src": "assets/fleet/20ft-06.jpg", "thumb": "assets/fleet/20ft-06-sm.jpg", "cat": "20ft", "w": 640, "h": 480}, {"src": "assets/fleet/20ft-07.jpg", "thumb": "assets/fleet/20ft-07-sm.jpg", "cat": "20ft", "w": 480, "h": 640}, {"src": "assets/fleet/20ft-08.jpg", "thumb": "assets/fleet/20ft-08-sm.jpg", "cat": "20ft", "w": 640, "h": 480}, {"src": "assets/fleet/20ft-09.jpg", "thumb": "assets/fleet/20ft-09-sm.jpg", "cat": "20ft", "w": 427, "h": 640}, {"src": "assets/fleet/20ft-10.jpg", "thumb": "assets/fleet/20ft-10-sm.jpg", "cat": "20ft", "w": 640, "h": 427}, {"src": "assets/fleet/20ft-11.jpg", "thumb": "assets/fleet/20ft-11-sm.jpg", "cat": "20ft", "w": 640, "h": 427}, {"src": "assets/fleet/20ft-12.jpg", "thumb": "assets/fleet/20ft-12-sm.jpg", "cat": "20ft", "w": 640, "h": 427}, {"src": "assets/fleet/20ft-13.jpg", "thumb": "assets/fleet/20ft-13-sm.jpg", "cat": "20ft", "w": 640, "h": 427}, {"src": "assets/fleet/20ft-14.jpg", "thumb": "assets/fleet/20ft-14-sm.jpg", "cat": "20ft", "w": 640, "h": 480}, {"src": "assets/fleet/20ft-15.jpg", "thumb": "assets/fleet/20ft-15-sm.jpg", "cat": "20ft", "w": 640, "h": 480}, {"src": "assets/fleet/20ft-16.jpg", "thumb": "assets/fleet/20ft-16-sm.jpg", "cat": "20ft", "w": 640, "h": 640}, {"src": "assets/fleet/20ft-17.jpg", "thumb": "assets/fleet/20ft-17-sm.jpg", "cat": "20ft", "w": 640, "h": 480}, {"src": "assets/fleet/20ft-18.jpg", "thumb": "assets/fleet/20ft-18-sm.jpg", "cat": "20ft", "w": 480, "h": 640}, {"src": "assets/fleet/40ft-19.jpg", "thumb": "assets/fleet/40ft-19-sm.jpg", "cat": "40ft", "w": 640, "h": 360}, {"src": "assets/fleet/40ft-20.jpg", "thumb": "assets/fleet/40ft-20-sm.jpg", "cat": "40ft", "w": 640, "h": 512}, {"src": "assets/fleet/40ft-21.jpg", "thumb": "assets/fleet/40ft-21-sm.jpg", "cat": "40ft", "w": 640, "h": 480}, {"src": "assets/fleet/40ft-22.jpg", "thumb": "assets/fleet/40ft-22-sm.jpg", "cat": "40ft", "w": 480, "h": 640}, {"src": "assets/fleet/tanker-23.jpg", "thumb": "assets/fleet/tanker-23-sm.jpg", "cat": "tanker", "w": 640, "h": 464}, {"src": "assets/fleet/tanker-24.jpg", "thumb": "assets/fleet/tanker-24-sm.jpg", "cat": "tanker", "w": 640, "h": 480}, {"src": "assets/fleet/tanker-25.jpg", "thumb": "assets/fleet/tanker-25-sm.jpg", "cat": "tanker", "w": 640, "h": 480}, {"src": "assets/fleet/tanker-26.jpg", "thumb": "assets/fleet/tanker-26-sm.jpg", "cat": "tanker", "w": 640, "h": 480}, {"src": "assets/fleet/truck-27.jpg", "thumb": "assets/fleet/truck-27-sm.jpg", "cat": "truck", "w": 640, "h": 480}, {"src": "assets/fleet/truck-28.jpg", "thumb": "assets/fleet/truck-28-sm.jpg", "cat": "truck", "w": 480, "h": 640}, {"src": "assets/fleet/truck-29.jpg", "thumb": "assets/fleet/truck-29-sm.jpg", "cat": "truck", "w": 640, "h": 427}, {"src": "assets/fleet/truck-30.jpg", "thumb": "assets/fleet/truck-30-sm.jpg", "cat": "truck", "w": 427, "h": 640}, {"src": "assets/fleet/truck-31.jpg", "thumb": "assets/fleet/truck-31-sm.jpg", "cat": "truck", "w": 640, "h": 456}, {"src": "assets/fleet/truck-32.jpg", "thumb": "assets/fleet/truck-32-sm.jpg", "cat": "truck", "w": 640, "h": 480}, {"src": "assets/fleet/truck-33.jpg", "thumb": "assets/fleet/truck-33-sm.jpg", "cat": "truck", "w": 640, "h": 480}, {"src": "assets/fleet/truck-34.jpg", "thumb": "assets/fleet/truck-34-sm.jpg", "cat": "truck", "w": 640, "h": 480}, {"src": "assets/fleet/truck-35.jpg", "thumb": "assets/fleet/truck-35-sm.jpg", "cat": "truck", "w": 640, "h": 362}, {"src": "assets/fleet/truck-36.jpg", "thumb": "assets/fleet/truck-36-sm.jpg", "cat": "truck", "w": 427, "h": 640}, {"src": "assets/fleet/truck-37.jpg", "thumb": "assets/fleet/truck-37-sm.jpg", "cat": "truck", "w": 640, "h": 427}, {"src": "assets/fleet/truck-38.jpg", "thumb": "assets/fleet/truck-38-sm.jpg", "cat": "truck", "w": 640, "h": 480}, {"src": "assets/fleet/truck-39.jpg", "thumb": "assets/fleet/truck-39-sm.jpg", "cat": "truck", "w": 640, "h": 515}, {"src": "assets/fleet/truck-40.jpg", "thumb": "assets/fleet/truck-40-sm.jpg", "cat": "truck", "w": 640, "h": 427}, {"src": "assets/fleet/truck-41.jpg", "thumb": "assets/fleet/truck-41-sm.jpg", "cat": "truck", "w": 480, "h": 640}, {"src": "assets/fleet/truck-42.jpg", "thumb": "assets/fleet/truck-42-sm.jpg", "cat": "truck", "w": 480, "h": 640}, {"src": "assets/fleet/truck-43.jpg", "thumb": "assets/fleet/truck-43-sm.jpg", "cat": "truck", "w": 480, "h": 640}, {"src": "assets/fleet/truck-44.jpg", "thumb": "assets/fleet/truck-44-sm.jpg", "cat": "truck", "w": 480, "h": 640}],
  teamPhotos: [{"src": "assets/team/team-01.jpg", "thumb": "assets/team/team-01-sm.jpg", "w": 640, "h": 480}, {"src": "assets/team/team-02.jpg", "thumb": "assets/team/team-02-sm.jpg", "w": 640, "h": 480}, {"src": "assets/team/team-03.jpg", "thumb": "assets/team/team-03-sm.jpg", "w": 640, "h": 480}, {"src": "assets/team/team-04.jpg", "thumb": "assets/team/team-04-sm.jpg", "w": 640, "h": 479}, {"src": "assets/team/team-05.jpg", "thumb": "assets/team/team-05-sm.jpg", "w": 640, "h": 480}, {"src": "assets/team/team-06.jpg", "thumb": "assets/team/team-06-sm.jpg", "w": 640, "h": 480}, {"src": "assets/team/team-07.jpg", "thumb": "assets/team/team-07-sm.jpg", "w": 640, "h": 480}, {"src": "assets/team/team-08.jpg", "thumb": "assets/team/team-08-sm.jpg", "w": 640, "h": 427}, {"src": "assets/team/team-09.jpg", "thumb": "assets/team/team-09-sm.jpg", "w": 640, "h": 427}, {"src": "assets/team/team-10.jpg", "thumb": "assets/team/team-10-sm.jpg", "w": 427, "h": 640}, {"src": "assets/team/team-11.jpg", "thumb": "assets/team/team-11-sm.jpg", "w": 473, "h": 640}, {"src": "assets/team/team-12.jpg", "thumb": "assets/team/team-12-sm.jpg", "w": 473, "h": 640}, {"src": "assets/team/team-13.jpg", "thumb": "assets/team/team-13-sm.jpg", "w": 427, "h": 640}, {"src": "assets/team/team-14.jpg", "thumb": "assets/team/team-14-sm.jpg", "w": 640, "h": 480}, {"src": "assets/team/team-15.jpg", "thumb": "assets/team/team-15-sm.jpg", "w": 480, "h": 640}, {"src": "assets/team/team-16.jpg", "thumb": "assets/team/team-16-sm.jpg", "w": 480, "h": 640}, {"src": "assets/team/team-17.jpg", "thumb": "assets/team/team-17-sm.jpg", "w": 480, "h": 640}, {"src": "assets/team/team-18.jpg", "thumb": "assets/team/team-18-sm.jpg", "w": 640, "h": 640}, {"src": "assets/team/team-19.jpg", "thumb": "assets/team/team-19-sm.jpg", "w": 480, "h": 640}, {"src": "assets/team/team-20.jpg", "thumb": "assets/team/team-20-sm.jpg", "w": 640, "h": 360}, {"src": "assets/team/team-21.jpg", "thumb": "assets/team/team-21-sm.jpg", "w": 640, "h": 480}],

  social: { facebook: null, linkedin: null },

  fleetMakes: [
    "TATA & Ashok Leyland: 9 MT and 16 MT half-body vehicles",
    "TATA, Ashok Leyland, BharatBenz & Mahindra: 9 MT and 16 MT full-body vehicles",
    "TATA & Ashok Leyland: 9 MT full body and container body",
    "LCVs & LPTs (Eicher & Mahindra): 1 MT, 3.5 MT, 5 MT, 6 MT and 8 MT",
    "Platform trucks (Ashok Leyland & TATA): 20 ft Taurus",
    "Double axle (Ashok Leyland, TATA & Mahindra): 20 ft and 40 ft trailers",
    "Triple axle (Ashok Leyland, TATA & Mahindra): 20 ft and 40 ft trailers",
    "Gas tankers: 25, 31 and 35 tonne"
  ],
  garage: "We have our own garage, where maintenance and checks are carried out regularly on the whole fleet. It is run by the in-house technical team of Rajesh Roadlines Pvt. Ltd.",

  hubs: "One of the fastest-growing networks on the west coast: 08 hubs in Gujarat, 09 in Konkan, 11 in Goa and 07 in and around Mumbai. And counting.",

  leadership: [
    { name: "Late Shri N.D. Somaiya", role: "Founder" },
    { name: "Chandresh Somaiya", role: "Managing Director" },
    { name: "Jigar Somaiya", role: "Director" }
  ],

  awards: [
    { title: "Certificate of commendation", text: "For a logistics company with the best safety standards", img: "award-07" },
    { title: "IndianOil Logistics Awards", text: "", img: "award-08" },
    { title: "Mahindra Mpower", text: "The Management Development Programme for Youth Transport Entrepreneurs", img: "award-09" },
    { title: "Certificate of participation", text: "Mahindra Mentor Summit and IIM Ahmedabad", img: "award-13" },
    { title: "Mahindra Mpower", text: "Programme presentation", img: "award-12" },
    { title: "Mahindra Mentors Summit", text: "Recognition on stage", img: "award-11" },
    { title: "Mahindra Mpower", text: "Certificate presentation", img: "award-10" }
  ]
};
