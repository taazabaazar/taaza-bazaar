import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import {
  Plus, Minus, ShoppingBasket, X, Leaf, Store, Check, ChevronLeft, Trash2,
  RefreshCw, MapPin, Navigation, Video, Percent, Globe, LogOut, Search,
  Edit2, Users, Package, Receipt, Wallet, ShieldCheck, Truck, Landmark,
  Layers, UserCog,
} from "lucide-react";

/* =========================================================
   THEME TOKENS
========================================================= */
const COLORS = {
  bg: "#F5F6F0",
  card: "#FFFFFF",
  border: "#E4E4D8",
  dark: "#1B3A2B",
  darkAlt: "#254A38",
  text: "#1E2A22",
  muted: "#6B7566",
  faint: "#A2A895",
  accentYellow: "#F2A93B",
  accentRed: "#D64550",
  soft: "#EEF3E9",
  softRed: "#FBE6E6",
};

/* =========================================================
   FONTS
========================================================= */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap');
    .tb-root { font-family: 'Work Sans', sans-serif; }
    .tb-display { font-family: 'Fraunces', serif; }
    .tb-tag { font-family: 'Caveat', cursive; }
    @media (prefers-reduced-motion: reduce) {
      .tb-root * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
    }
    .tb-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .tb-scrollbar::-webkit-scrollbar-thumb { background: #C9CBB8; border-radius: 999px; }
    .tb-focus:focus-visible { outline: 2px solid #1B3A2B; outline-offset: 2px; }
    .tb-input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #D8D8CC; font-size: 14px; box-sizing: border-box; font-family: 'Work Sans', sans-serif; }
    .tb-label { display: block; font-size: 13px; font-weight: 600; color: #1E2A22; margin-bottom: 4px; }
    @keyframes tb-spin { to { transform: rotate(360deg); } }
  `}</style>
);

/* =========================================================
   I18N
========================================================= */
const DICT = {
  hi: {
    appName: "ताज़ा बाज़ार", tagline: "आज की ताज़ी सब्ज़ी और फल, घर बैठे मंगवाएं",
    searchProducts: "सामान खोजें...", allCategories: "सभी", addToCart: "कार्ट में डालें",
    outOfStock: "स्टॉक ख़त्म", cart: "टोकरी", emptyCart: "टोकरी अभी खाली है",
    total: "कुल", checkout: "ऑर्डर करें", back: "वापस", deliveryDetails: "डिलीवरी की जानकारी",
    fullName: "पूरा नाम", phone: "मोबाइल नंबर", address: "डिलीवरी का पता",
    useLocation: "मेरी मौजूदा लोकेशन इस्तेमाल करें", locating: "लोकेशन ढूंढी जा रही है...",
    deliverySlot: "डिलीवरी का समय", morning: "सुबह (7–10 AM)", afternoon: "दोपहर (12–3 PM)",
    evening: "शाम (5–8 PM)", coupon: "कूपन कोड", applyCoupon: "लागू करें", couponApplied: "कूपन लागू हुआ",
    invalidCoupon: "अमान्य कूपन कोड", discount: "छूट", paymentMethod: "भुगतान का तरीका",
    cod: "नकद (डिलीवरी पर)", upi: "UPI", online: "ऑनलाइन भुगतान", payToUpi: "इस UPI ID पर भुगतान करें",
    placeOrder: "ऑर्डर पक्का करें", placing: "भेजा जा रहा है...", orderPlaced: "ऑर्डर मिल गया!",
    orderNumber: "ऑर्डर नंबर", willCall: "हम जल्द ही आपको फ़ोन करेंगे", ok: "ठीक है",
    vendorLogin: "दुकानदार लॉगिन / रजिस्टर (वैकल्पिक)", adminLogin: "प्लेटफ़ॉर्म एडमिन",
    login: "लॉगिन करें", register: "रजिस्टर करें", logout: "लॉगआउट", password: "पासवर्ड",
    shopName: "दुकान का नाम", ownerName: "मालिक का नाम", shopAddress: "दुकान का पता",
    logoUrl: "लोगो की लिंक (URL)", upiId: "आपकी UPI ID", pendingApproval: "आपकी दुकान अभी एडमिन की मंज़ूरी का इंतज़ार कर रही है",
    suspended: "फ़िलहाल निलंबित है", dashboard: "डैशबोर्ड", products: "सामान",
    orders: "ऑर्डर", sales: "बिक्री", profile: "प्रोफाइल", addProduct: "नया सामान जोड़ें",
    productName: "नाम", category: "श्रेणी (जैसे: फल, सब्ज़ी)", price: "कीमत (₹)", unit: "इकाई",
    imageUrl: "फ़ोटो की लिंक (URL)", videoUrl: "वीडियो की लिंक (URL) — वैकल्पिक",
    stockIn: "स्टॉक में", stockOut: "स्टॉक ख़त्म", save: "सेव करें", cancel: "रद्द करें",
    noProducts: "अभी कोई सामान नहीं जोड़ा गया", noOrders: "अभी तक कोई ऑर्डर नहीं आया",
    totalSales: "कुल बिक्री", totalOrders: "कुल ऑर्डर", commissionRate: "कमीशन दर",
    commissionPaid: "प्लेटफ़ॉर्म कमीशन", netEarning: "आपकी कमाई", viewOnMap: "मैप में देखें",
    vendors: "दुकानदार (भविष्य के लिए)", allOrders: "सभी ऑर्डर", settings: "सेटिंग्स", approve: "मंज़ूर करें",
    suspend: "निलंबित करें", activate: "सक्रिय करें", status: "स्थिति", pending: "मंज़ूरी बाकी",
    active: "सक्रिय", commissionPct: "कमीशन %", platformRevenue: "प्लेटफ़ॉर्म की कुल कमाई",
    defaultCommission: "डिफ़ॉल्ट कमीशन %", coupons: "कूपन", addCoupon: "नया कूपन जोड़ें",
    code: "कोड", type: "प्रकार", value: "वैल्यू", percent: "प्रतिशत (%)", flat: "फ्लैट (₹)",
    remove: "हटाएं", refresh: "ताज़ा करें", wrongPassword: "गलत पासवर्ड", fillAll: "कृपया सभी जानकारी भरें",
    invalidPhone: "कृपया सही 10 अंकों का मोबाइल नंबर डालें", backToMarket: "वापस",
    perKg: "प्रति किलो", perGram: "प्रति ग्राम", perDozen: "प्रति दर्जन", perPiece: "प्रति पीस",
    perBunch: "प्रति गुच्छा", perBox: "प्रति बॉक्स", perPack: "प्रति पैक",
    demoPassword: "डेमो पासवर्ड", newHere: "नए दुकानदार हैं?", alreadyReg: "पहले से रजिस्टर हैं?",
    phoneLogin: "फ़ोन नंबर", setPassword: "पासवर्ड बनाएं", watchVideo: "वीडियो देखें",
    locationSaved: "लोकेशन जुड़ गई", locationFailed: "लोकेशन नहीं मिल पाई, पता खुद लिखें",
    edit: "बदलें", myShop: "मेरी दुकान", platformLogo: "प्लेटफ़ॉर्म लोगो URL",
    noVendorsYet: "अभी तक कोई दुकानदार रजिस्टर नहीं हुआ",
    deliveryBoys: "डिलीवरी बॉय", addDeliveryBoy: "नया डिलीवरी बॉय जोड़ें",
    addVendor: "नया दुकानदार जोड़ें", vendorAdded: "दुकानदार जुड़ गया",
    fillRequiredFields: "कृपया नाम, फ़ोन और पासवर्ड ज़रूर भरें", phoneExists: "यह फ़ोन नंबर पहले से मौजूद है",
    deliveryBoyName: "नाम", deliveryPhone: "मोबाइल नंबर", deliveryPassword: "पासवर्ड बनाएं",
    commissionType: "कमीशन का तरीका", flatPerOrder: "फ्लैट ₹ प्रति ऑर्डर", percentOfOrder: "% प्रति ऑर्डर",
    deliveryLogin: "डिलीवरी बॉय लॉगिन", myOrders: "मेरे ऑर्डर", markOutForDelivery: "डिलीवरी के लिए निकला",
    markDelivered: "डिलीवर हो गया", delivered: "डिलीवर हो गया", outForDelivery: "डिलीवरी पर",
    assigned: "असाइन हुआ", placed: "नया ऑर्डर", assignTo: "डिलीवरी बॉय चुनें", unassigned: "कोई नहीं चुना",
    out_for_delivery: "डिलीवरी पर",
    myEarnings: "मेरी कमाई", totalDelivered: "कुल डिलीवर हुए", noAssignedOrders: "अभी कोई ऑर्डर असाइन नहीं हुआ",
    gstNumber: "GST नंबर (वैकल्पिक)", gstNote: "ताज़ी फल-सब्ज़ी पर आमतौर पर GST नहीं लगता। पैक/प्रोसेस्ड सामान के लिए अपने CA से पुष्टि करें।",
    bankDetails: "बैंक खाता (सिर्फ आपके रिकॉर्ड के लिए)", accountHolder: "खाताधारक का नाम",
    accountNumber: "खाता संख्या", ifsc: "IFSC कोड", bankName: "बैंक का नाम",
    platformName: "आपके प्लेटफ़ॉर्म का नाम", deliveryStatus: "डिलीवरी स्थिति",
    active_status: "सक्रिय", inactive_status: "निष्क्रिय", earningsSummary: "कमाई का हिसाब",
    orderCommission: "प्रति ऑर्डर कमीशन",
    platformUpiId: "आपकी UPI ID (सभी UPI/ऑनलाइन पेमेंट यहाँ आएंगे)",
    dueAmount: "बकाया राशि", recordPayment: "भुगतान दर्ज करें", paidSoFar: "अब तक भुगतान किया",
    enterAmount: "राशि (₹) डालें", confirm: "पक्का करें", paymentGoesToPlatform: "यह पैसा सीधे आपकी UPI ID में आएगा",
    scanToPay: "स्कैन करके भुगतान करें",
    theirUpi: "इनकी UPI ID", noUpiSet: "अभी UPI ID सेट नहीं की है", upiOptional: "UPI ID (वैकल्पिक)",
    zones: "क्षेत्र (एरिया)", addZone: "नया क्षेत्र जोड़ें", zoneName: "क्षेत्र का नाम (जैसे: सिविल लाइंस)",
    noZonesYet: "अभी कोई क्षेत्र नहीं जोड़ा गया", distributors: "डिस्ट्रीब्यूटर", addDistributor: "नया डिस्ट्रीब्यूटर जोड़ें",
    distributorName: "डिस्ट्रीब्यूटर का नाम", assignZone: "क्षेत्र चुनें", selectZone: "-- क्षेत्र चुनें --",
    noDistributorYet: "अभी कोई डिस्ट्रीब्यूटर नहीं जोड़ा गया", yourZone: "आपका क्षेत्र", zoneUnassigned: "कोई क्षेत्र तय नहीं",
    distributorLogin: "डिस्ट्रीब्यूटर लॉगिन", deliverArea: "डिलीवरी क्षेत्र चुनें", selectDeliverArea: "-- अपना क्षेत्र चुनें --",
    noZonesConfigured: "अभी कोई डिलीवरी क्षेत्र सेट नहीं है, कृपया एडमिन से संपर्क करें",
    distributorAssistant: "यह एडमिन असिस्टेंट है — अपने क्षेत्र के ऑर्डर संभालता है, पूरा नियंत्रण मुख्य एडमिन के पास रहता है",
    zoneRequired: "कृपया अपना डिलीवरी क्षेत्र चुनें",
    deliveryCharge: "डिलीवरी चार्ज", freeDeliveryAbove: "मुफ़्त डिलीवरी की न्यूनतम राशि (₹)",
    deliveryChargeAmount: "डिलीवरी चार्ज राशि (₹)", freeDeliveryNote: "इस राशि से कम के ऑर्डर पर डिलीवरी चार्ज जुड़ेगा",
    addedBelow: "से कम के ऑर्डर पर जुड़ता है",
    mySales: "मेरे सामान की बिक्री", addedByAdmin: "एडमिन", addedByDistributor: "डिस्ट्रीब्यूटर",
    addedByVendor: "दुकानदार", addedBy: "जोड़ा",
    youOwe: "आपको इन्हें देने हैं", theyOwe: "इनसे आपको लेने हैं", settled: "हिसाब बराबर है",
    iPaid: "मैंने भुगतान किया", iCollected: "मैंने पैसा लिया", cashHeldNote: "नगद ऑर्डर की राशि इनके पास ही रहती है",
    trackOrder: "अपना ऑर्डर देखें", enterPhoneToTrack: "अपना मोबाइल नंबर डालें",
    yourOrders: "आपके ऑर्डर", noOrdersFound: "इस नंबर से कोई ऑर्डर नहीं मिला", find: "खोजें",
    myProducts: "मेरा सामान", productsAddedByMe: "मैंने जो सामान जोड़ा है",
  },
  en: {
    appName: "Taaza Bazaar", tagline: "Fresh vegetables and fruits, delivered to your door",
    searchProducts: "Search products...", allCategories: "All", addToCart: "Add to cart",
    outOfStock: "Out of stock", cart: "Cart", emptyCart: "Your cart is empty",
    total: "Total", checkout: "Checkout", back: "Back", deliveryDetails: "Delivery details",
    fullName: "Full name", phone: "Mobile number", address: "Delivery address",
    useLocation: "Use my current location", locating: "Finding location...",
    deliverySlot: "Delivery time", morning: "Morning (7–10 AM)", afternoon: "Afternoon (12–3 PM)",
    evening: "Evening (5–8 PM)", coupon: "Coupon code", applyCoupon: "Apply", couponApplied: "Coupon applied",
    invalidCoupon: "Invalid coupon code", discount: "Discount", paymentMethod: "Payment method",
    cod: "Cash on delivery", upi: "UPI", online: "Online payment", payToUpi: "Pay to this UPI ID",
    placeOrder: "Place order", placing: "Placing order...", orderPlaced: "Order placed!",
    orderNumber: "Order number", willCall: "We'll call you shortly", ok: "OK",
    vendorLogin: "Seller login / register (optional)", adminLogin: "Platform admin",
    login: "Login", register: "Register", logout: "Logout", password: "Password",
    shopName: "Shop name", ownerName: "Owner name", shopAddress: "Shop address",
    logoUrl: "Logo link (URL)", upiId: "Your UPI ID", pendingApproval: "Your shop is awaiting admin approval",
    suspended: "Currently suspended", dashboard: "Dashboard", products: "Products",
    orders: "Orders", sales: "Sales", profile: "Profile", addProduct: "Add new product",
    productName: "Name", category: "Category (e.g. Fruits, Vegetables)", price: "Price (₹)", unit: "Unit",
    imageUrl: "Photo link (URL)", videoUrl: "Video link (URL) — optional",
    stockIn: "In stock", stockOut: "Out of stock", save: "Save", cancel: "Cancel",
    noProducts: "No products added yet", noOrders: "No orders yet",
    totalSales: "Total sales", totalOrders: "Total orders", commissionRate: "Commission rate",
    commissionPaid: "Platform commission", netEarning: "Your earning", viewOnMap: "View on map",
    vendors: "Sellers (for future use)", allOrders: "All orders", settings: "Settings", approve: "Approve",
    suspend: "Suspend", activate: "Activate", status: "Status", pending: "Pending approval",
    active: "Active", commissionPct: "Commission %", platformRevenue: "Total platform revenue",
    defaultCommission: "Default commission %", coupons: "Coupons", addCoupon: "Add coupon",
    code: "Code", type: "Type", value: "Value", percent: "Percent (%)", flat: "Flat (₹)",
    remove: "Remove", refresh: "Refresh", wrongPassword: "Wrong password", fillAll: "Please fill all fields",
    invalidPhone: "Please enter a valid 10-digit mobile number", backToMarket: "Back",
    perKg: "per kg", perGram: "per gram", perDozen: "per dozen", perPiece: "per piece",
    perBunch: "per bunch", perBox: "per box", perPack: "per pack",
    demoPassword: "Demo password", newHere: "New seller?", alreadyReg: "Already registered?",
    phoneLogin: "Phone number", setPassword: "Set password", watchVideo: "Watch video",
    locationSaved: "Location saved", locationFailed: "Could not get location, please type address",
    edit: "Edit", myShop: "My shop", platformLogo: "Platform logo URL",
    noVendorsYet: "No sellers registered yet",
    deliveryBoys: "Delivery boys", addDeliveryBoy: "Add delivery boy",
    addVendor: "Add new seller", vendorAdded: "Seller added",
    fillRequiredFields: "Please fill name, phone and password", phoneExists: "This phone number is already registered",
    deliveryBoyName: "Name", deliveryPhone: "Mobile number", deliveryPassword: "Set password",
    commissionType: "Commission type", flatPerOrder: "Flat ₹ per order", percentOfOrder: "% of order",
    deliveryLogin: "Delivery boy login", myOrders: "My orders", markOutForDelivery: "Mark out for delivery",
    markDelivered: "Mark delivered", delivered: "Delivered", outForDelivery: "Out for delivery",
    assigned: "Assigned", placed: "New order", assignTo: "Assign delivery boy", unassigned: "Unassigned",
    out_for_delivery: "Out for delivery",
    myEarnings: "My earnings", totalDelivered: "Total delivered", noAssignedOrders: "No orders assigned yet",
    gstNumber: "GST number (optional)", gstNote: "Fresh fruits & vegetables are usually GST-exempt. Confirm with your CA for packaged/processed items.",
    bankDetails: "Bank account (for your records only)", accountHolder: "Account holder name",
    accountNumber: "Account number", ifsc: "IFSC code", bankName: "Bank name",
    platformName: "Your platform name", deliveryStatus: "Delivery status",
    active_status: "Active", inactive_status: "Inactive", earningsSummary: "Earnings summary",
    orderCommission: "Commission per order",
    platformUpiId: "Your UPI ID (all UPI/online payments arrive here)",
    dueAmount: "Amount due", recordPayment: "Record payment", paidSoFar: "Paid so far",
    enterAmount: "Enter amount (₹)", confirm: "Confirm", paymentGoesToPlatform: "This payment goes directly to your UPI ID",
    scanToPay: "Scan to pay",
    theirUpi: "Their UPI ID", noUpiSet: "UPI ID not set yet", upiOptional: "UPI ID (optional)",
    zones: "Zones (areas)", addZone: "Add new zone", zoneName: "Zone name (e.g. Civil Lines)",
    noZonesYet: "No zones added yet", distributors: "Distributors", addDistributor: "Add new distributor",
    distributorName: "Distributor name", assignZone: "Assign zone", selectZone: "-- Select zone --",
    noDistributorYet: "No distributors added yet", yourZone: "Your zone", zoneUnassigned: "No zone assigned",
    distributorLogin: "Distributor login", deliverArea: "Select delivery area", selectDeliverArea: "-- Select your area --",
    noZonesConfigured: "No delivery zones set up yet, please contact admin",
    distributorAssistant: "This is an admin assistant — handles orders in their zone, fully controlled by the main admin",
    zoneRequired: "Please select your delivery zone",
    deliveryCharge: "Delivery charge", freeDeliveryAbove: "Free delivery above (₹)",
    deliveryChargeAmount: "Delivery charge amount (₹)", freeDeliveryNote: "Orders below this amount get a delivery charge",
    addedBelow: "added below this order value",
    mySales: "My product sales", addedByAdmin: "Admin", addedByDistributor: "Distributor",
    addedByVendor: "Seller", addedBy: "Added by",
    youOwe: "You owe them", theyOwe: "They owe you", settled: "Settled up",
    iPaid: "I paid them", iCollected: "I collected from them", cashHeldNote: "Cash order amounts stay with them",
    trackOrder: "Track your order", enterPhoneToTrack: "Enter your mobile number",
    yourOrders: "Your orders", noOrdersFound: "No orders found for this number", find: "Find",
    myProducts: "My products", productsAddedByMe: "Products I've added",
  },
};

const LangContext = createContext({ lang: "hi", t: (k) => k });
const useLang = () => useContext(LangContext);

const UNIT_LABELS = {
  kg: { hi: "किलो", en: "kg", key: "perKg" },
  gram: { hi: "ग्राम", en: "gram", key: "perGram" },
  dozen: { hi: "दर्जन", en: "dozen", key: "perDozen" },
  piece: { hi: "पीस", en: "piece", key: "perPiece" },
  bunch: { hi: "गुच्छा", en: "bunch", key: "perBunch" },
  box: { hi: "बॉक्स", en: "box", key: "perBox" },
  pack: { hi: "पैक", en: "pack", key: "perPack" },
};

/* =========================================================
   CONSTANTS
========================================================= */
const SUPER_ADMIN_PASSWORD = "platform123";
const DEFAULT_COMMISSION = 10;

const SEED_ZONES = [
  { id: "z1", name: "सिविल लाइंस" },
  { id: "z2", name: "गांधी मार्केट" },
  { id: "z3", name: "कटघर" },
];

const SEED_PRODUCTS = [
  { id: "p1", name: "सेब", category: "फल", price: 180, unit: "kg", imageUrl: "", videoUrl: "", stock: true, ownerType: "admin", ownerId: null },
  { id: "p2", name: "केला", category: "फल", price: 60, unit: "dozen", imageUrl: "", videoUrl: "", stock: true, ownerType: "admin", ownerId: null },
  { id: "p3", name: "टमाटर", category: "सब्ज़ी", price: 30, unit: "kg", imageUrl: "", videoUrl: "", stock: true, ownerType: "admin", ownerId: null },
  { id: "p4", name: "आलू", category: "सब्ज़ी", price: 25, unit: "kg", imageUrl: "", videoUrl: "", stock: true, ownerType: "admin", ownerId: null },
  { id: "p5", name: "पालक", category: "सब्ज़ी", price: 20, unit: "bunch", imageUrl: "", videoUrl: "", stock: true, ownerType: "admin", ownerId: null },
];

// Legacy vendor marketplace — kept dormant for future use, not shown to customers
const SEED_VENDORS = [];

const EMOJI_FALLBACK = { "फल": "🍎", "सब्ज़ी": "🥕", "fruits": "🍎", "vegetables": "🥕" };

/* =========================================================
   STORAGE HELPERS
========================================================= */
async function loadKey(key, seed) {
  try {
    const res = await window.storage.get(key, true);
    if (res && res.value) return JSON.parse(res.value);
  } catch (e) { /* not found yet */ }
  if (seed !== undefined) {
    await window.storage.set(key, JSON.stringify(seed), true);
    return seed;
  }
  return null;
}
async function saveKey(key, value) {
  await window.storage.set(key, JSON.stringify(value), true);
}
const loadZones = () => loadKey("mv_zones", SEED_ZONES);
const saveZones = (z) => saveKey("mv_zones", z);
const loadDistributors = () => loadKey("mv_distributors", []);
const saveDistributors = (d) => saveKey("mv_distributors", d);
const loadVendors = () => loadKey("vendors", SEED_VENDORS);
const saveVendors = (v) => saveKey("vendors", v);
const loadProducts = () => loadKey("mv_products", SEED_PRODUCTS);
const saveProducts = (p) => saveKey("mv_products", p);
const loadOrders = () => loadKey("mv_orders", []);
const saveOrders = (o) => saveKey("mv_orders", o);
const loadSettings = () => loadKey("mv_settings", {
  defaultCommission: DEFAULT_COMMISSION, coupons: [], platformLogoUrl: "",
  platformName: "", gstNumber: "", platformUpiId: "",
  freeDeliveryAbove: 200, deliveryCharge: 25,
  bankDetails: { accountHolder: "", accountNumber: "", ifsc: "", bankName: "" },
});
const saveSettings = (s) => saveKey("mv_settings", s);
const loadDeliveryBoys = () => loadKey("mv_delivery_boys", []);
const saveDeliveryBoys = (d) => saveKey("mv_delivery_boys", d);

function uid(prefix) {
  return prefix + Date.now() + Math.random().toString(36).slice(2, 7);
}

function mapsLink({ lat, lng, address }) {
  if (lat && lng) return `https://www.google.com/maps?q=${lat},${lng}`;
  if (address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  return null;
}

function buildUpiQrUrl(upiId, amount, payeeName) {
  if (!upiId) return null;
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName || "Payment")}&am=${amount}&cu=INR`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`;
}

function useGeolocation() {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const locate = (onSuccess) => {
    if (!navigator.geolocation) {
      setError("no-geo");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onSuccess({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setError("denied");
      },
      { timeout: 10000 }
    );
  };
  return { locate, locating, error };
}

/* =========================================================
   SMALL UI ATOMS
========================================================= */
const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
    <RefreshCw size={22} color="#6FB98F" style={{ animation: "tb-spin 1s linear infinite" }} />
  </div>
);

const ChalkTag = ({ price, unit, lang }) => {
  const u = UNIT_LABELS[unit] || { hi: unit, en: unit };
  return (
    <div className="tb-tag" style={{
      background: COLORS.dark, color: COLORS.bg, borderRadius: "6px", padding: "2px 10px 4px",
      fontSize: "22px", lineHeight: 1, transform: "rotate(-2deg)", boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
      whiteSpace: "nowrap", display: "inline-block",
    }}>
      ₹{price}<span style={{ fontSize: "13px", opacity: 0.85 }}> /{lang === "hi" ? u.hi : u.en}</span>
    </div>
  );
};

const Logo = ({ url, size = 28, fallback }) => {
  const [broken, setBroken] = useState(false);
  if (url && !broken) {
    return (
      <img
        src={url} alt="logo" onError={() => setBroken(true)}
        style={{ width: size, height: size, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return fallback || <Leaf size={size * 0.7} color={COLORS.accentYellow} />;
};

const Pill = ({ active, onClick, children }) => (
  <button
    className="tb-focus"
    onClick={onClick}
    style={{
      background: active ? COLORS.dark : "#fff", color: active ? "#fff" : COLORS.text,
      border: `1px solid ${COLORS.dark}`, borderRadius: "999px", padding: "7px 16px",
      fontWeight: 600, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

function MapLink({ lat, lng, address }) {
  const { t } = useLang();
  const url = mapsLink({ lat, lng, address });
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="tb-focus"
      style={{ display: "inline-flex", alignItems: "center", gap: 4, color: COLORS.dark, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
      <MapPin size={13} /> {t("viewOnMap")}
    </a>
  );
}

function LocationField({ address, setAddress, lat, lng, setLatLng, placeholder }) {
  const { t } = useLang();
  const { locate, locating, error } = useGeolocation();
  return (
    <div>
      <textarea
        className="tb-focus tb-input"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder={placeholder}
        rows={2}
        style={{ resize: "vertical", marginBottom: 6 }}
      />
      <button
        type="button"
        className="tb-focus"
        onClick={() => locate(({ lat, lng }) => setLatLng(lat, lng))}
        disabled={locating}
        style={{
          background: COLORS.soft, border: "none", borderRadius: "8px", padding: "7px 12px",
          fontSize: 12, fontWeight: 600, color: COLORS.dark, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
        }}
      >
        <Navigation size={13} /> {locating ? t("locating") : t("useLocation")}
      </button>
      {lat && lng && <span style={{ fontSize: 12, color: COLORS.muted, marginLeft: 8 }}>✓ {t("locationSaved")}</span>}
      {error === "denied" && <div style={{ fontSize: 12, color: COLORS.accentRed, marginTop: 4 }}>{t("locationFailed")}</div>}
    </div>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */
function ProductCard({ product, qty, onAdd, onInc, onDec }) {
  const { t, lang } = useLang();
  const [imgBroken, setImgBroken] = useState(false);
  const emoji = EMOJI_FALLBACK[product.category] || "🛒";
  return (
    <div style={{
      background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: "14px",
      padding: "14px", display: "flex", flexDirection: "column", gap: "10px", position: "relative",
    }}>
      {!product.stock && (
        <div style={{
          position: "absolute", top: 10, right: 10, background: COLORS.accentRed, color: "#fff",
          fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: 600,
        }}>
          {t("outOfStock")}
        </div>
      )}

      {product.imageUrl && !imgBroken ? (
        <img
          src={product.imageUrl} alt={product.name} onError={() => setImgBroken(true)}
          style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: "10px" }}
        />
      ) : (
        <div style={{ fontSize: "40px", textAlign: "center" }}>{emoji}</div>
      )}

      {product.videoUrl && (
        <a href={product.videoUrl} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 11, color: COLORS.dark, display: "inline-flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
          <Video size={12} /> {t("watchVideo")}
        </a>
      )}

      <div style={{ textAlign: "center" }}>
        <div className="tb-display" style={{ fontSize: "18px", fontWeight: 600, color: COLORS.text }}>{product.name}</div>
        <div style={{ marginTop: "6px", display: "flex", justifyContent: "center" }}>
          <ChalkTag price={product.price} unit={product.unit} lang={lang} />
        </div>
      </div>

      {product.stock && (
        qty > 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.soft, borderRadius: "10px", padding: "6px 10px" }}>
            <button className="tb-focus" onClick={() => onDec(product.id)} aria-label="-"
              style={{ background: COLORS.dark, color: "#fff", border: "none", borderRadius: "8px", width: 28, height: 28, cursor: "pointer" }}>
              <Minus size={14} style={{ margin: "auto" }} />
            </button>
            <span style={{ fontWeight: 600, color: COLORS.text }}>{qty}</span>
            <button className="tb-focus" onClick={() => onInc(product.id)} aria-label="+"
              style={{ background: COLORS.dark, color: "#fff", border: "none", borderRadius: "8px", width: 28, height: 28, cursor: "pointer" }}>
              <Plus size={14} style={{ margin: "auto" }} />
            </button>
          </div>
        ) : (
          <button className="tb-focus" onClick={() => onAdd(product.id)}
            style={{ background: COLORS.accentYellow, color: COLORS.text, border: "none", borderRadius: "10px", padding: "8px 0", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
            {t("addToCart")}
          </button>
        )
      )}
    </div>
  );
}

/* =========================================================
   CART DRAWER
========================================================= */
function CartDrawer({ open, onClose, cart, products, onInc, onDec, onCheckout }) {
  const { t, lang } = useLang();
  const items = Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
    .filter((i) => i.product && i.qty > 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, pointerEvents: open ? "auto" : "none" }} aria-hidden={!open}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,30,20,0.35)", opacity: open ? 1 : 0, transition: "opacity 0.25s ease" }} />
      <div className="tb-scrollbar" style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "min(380px, 92vw)", background: COLORS.bg,
        transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s ease",
        display: "flex", flexDirection: "column", boxShadow: "-8px 0 24px rgba(0,0,0,0.12)", overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: `1px solid ${COLORS.border}` }}>
          <div className="tb-display" style={{ fontSize: "20px", fontWeight: 700, color: COLORS.text }}>{t("cart")}</div>
          <button className="tb-focus" onClick={onClose} aria-label="close" style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={22} color={COLORS.text} />
          </button>
        </div>

        <div style={{ flex: 1, padding: "12px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {items.length === 0 && <div style={{ color: COLORS.muted, textAlign: "center", marginTop: "40px" }}>{t("emptyCart")}</div>}
          {items.map(({ product, qty }) => {
            const u = UNIT_LABELS[product.unit] || { hi: product.unit, en: product.unit };
            return (
              <div key={product.id} style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", borderRadius: "12px", padding: "10px 12px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: "26px" }}>{EMOJI_FALLBACK[product.category] || "🛒"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: COLORS.text }}>{product.name}</div>
                  <div style={{ fontSize: "13px", color: COLORS.muted }}>₹{product.price}/{lang === "hi" ? u.hi : u.en}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button className="tb-focus" onClick={() => onDec(product.id)} style={{ background: COLORS.soft, border: "none", borderRadius: "6px", width: 26, height: 26, cursor: "pointer" }}>
                    <Minus size={13} style={{ margin: "auto" }} />
                  </button>
                  <span style={{ minWidth: 18, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                  <button className="tb-focus" onClick={() => onInc(product.id)} style={{ background: COLORS.soft, border: "none", borderRadius: "6px", width: 26, height: 26, cursor: "pointer" }}>
                    <Plus size={13} style={{ margin: "auto" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "16px 18px", borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontWeight: 700, fontSize: "17px", color: COLORS.text }}>
              <span>{t("total")}</span><span>₹{total}</span>
            </div>
            <button className="tb-focus" onClick={onCheckout}
              style={{ width: "100%", background: COLORS.accentRed, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
              {t("checkout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   CHECKOUT MODAL
========================================================= */
function CheckoutModal({ open, onClose, onSubmit, submitting, cartTotal, platformUpiId, payeeName, zones, freeDeliveryAbove, deliveryCharge }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [zoneId, setZoneId] = useState("");
  const [slot, setSlot] = useState("morning");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");

  if (!open) return null;

  const applyCoupon = async () => {
    setCouponMsg("");
    if (!couponInput.trim()) return;
    try {
      const settings = await loadSettings();
      const found = (settings.coupons || []).find((c) => c.active && c.code.toLowerCase() === couponInput.trim().toLowerCase());
      if (found) {
        setCoupon(found);
        setCouponMsg(t("couponApplied"));
      } else {
        setCoupon(null);
        setCouponMsg(t("invalidCoupon"));
      }
    } catch (e) {
      setCouponMsg(t("invalidCoupon"));
    }
  };

  const discount = coupon ? (coupon.type === "percent" ? Math.round((cartTotal * coupon.value) / 100) : coupon.value) : 0;
  const productTotal = Math.max(0, cartTotal - discount);
  const appliedDeliveryCharge = freeDeliveryAbove && productTotal < freeDeliveryAbove ? (deliveryCharge || 0) : 0;
  const finalTotal = productTotal + appliedDeliveryCharge;

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !address.trim()) { setError(t("fillAll")); return; }
    if (!/^\d{10}$/.test(phone.trim())) { setError(t("invalidPhone")); return; }
    if (zones.length > 0 && !zoneId) { setError(t("zoneRequired")); return; }
    setError("");
    onSubmit({
      name: name.trim(), phone: phone.trim(), address: address.trim(), lat, lng, zoneId: zoneId || null,
      slot, couponCode: coupon ? coupon.code : null, discount, deliveryCharge: appliedDeliveryCharge, paymentMethod: payment,
    });
  };

  const radioRow = { display: "flex", gap: "8px", flexWrap: "wrap" };
  const radioBtn = (active) => ({
    flex: 1, minWidth: 90, textAlign: "center", padding: "9px 6px", borderRadius: "8px", cursor: "pointer",
    border: `1px solid ${active ? COLORS.dark : COLORS.border}`, background: active ? COLORS.dark : "#fff",
    color: active ? "#fff" : COLORS.text, fontSize: 13, fontWeight: 600,
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.45)", padding: "16px" }}>
      <div className="tb-scrollbar" style={{ background: "#fff", borderRadius: "16px", width: "min(440px, 100%)", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="tb-display" style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "16px" }}>{t("deliveryDetails")}</div>

        <label className="tb-label">{t("fullName")}</label>
        <input className="tb-focus tb-input" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 14 }} />

        <label className="tb-label">{t("phone")}</label>
        <input className="tb-focus tb-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" style={{ marginBottom: 14 }} />

        <label className="tb-label">{t("address")}</label>
        <div style={{ marginBottom: 14 }}>
          <LocationField address={address} setAddress={setAddress} lat={lat} lng={lng} setLatLng={(la, ln) => { setLat(la); setLng(ln); }} placeholder="" />
        </div>

        {zones.length > 0 && (
          <>
            <label className="tb-label">{t("deliverArea")}</label>
            <select className="tb-focus tb-input" value={zoneId} onChange={(e) => setZoneId(e.target.value)} style={{ marginBottom: 14 }}>
              <option value="">{t("selectDeliverArea")}</option>
              {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </>
        )}

        <label className="tb-label">{t("deliverySlot")}</label>
        <div style={{ ...radioRow, marginBottom: 14 }}>
          {["morning", "afternoon", "evening"].map((s) => (
            <div key={s} style={radioBtn(slot === s)} onClick={() => setSlot(s)}>{t(s)}</div>
          ))}
        </div>

        <label className="tb-label">{t("coupon")}</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          <input className="tb-focus tb-input" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
          <button type="button" className="tb-focus" onClick={applyCoupon}
            style={{ background: COLORS.soft, border: "none", borderRadius: "8px", padding: "0 16px", fontWeight: 600, cursor: "pointer" }}>
            {t("applyCoupon")}
          </button>
        </div>
        {couponMsg && <div style={{ fontSize: 12, color: coupon ? COLORS.dark : COLORS.accentRed, marginBottom: 10 }}>{couponMsg}</div>}

        <label className="tb-label" style={{ marginTop: 6 }}>{t("paymentMethod")}</label>
        <div style={{ ...radioRow, marginBottom: 8 }}>
          <div style={radioBtn(payment === "cod")} onClick={() => setPayment("cod")}>{t("cod")}</div>
          <div style={radioBtn(payment === "upi")} onClick={() => setPayment("upi")}>{t("upi")}</div>
        </div>
        {payment === "upi" && platformUpiId && (
          <div style={{ fontSize: 13, background: COLORS.soft, borderRadius: 8, padding: "12px 10px", marginBottom: 10, color: COLORS.text, textAlign: "center" }}>
            <div style={{ marginBottom: 8 }}>{t("payToUpi")}: <strong>{platformUpiId}</strong></div>
            <img
              src={buildUpiQrUrl(platformUpiId, finalTotal, payeeName)}
              alt="UPI QR"
              width={160}
              height={160}
              style={{ borderRadius: 8, background: "#fff", padding: 6, border: `1px solid ${COLORS.border}` }}
            />
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>{t("scanToPay")}</div>
          </div>
        )}

        <div style={{ borderTop: `1px dashed ${COLORS.border}`, marginTop: 10, paddingTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: COLORS.muted, marginBottom: 4 }}>
            <span>{t("total")}</span><span>₹{cartTotal}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: COLORS.accentRed, marginBottom: 4 }}>
              <span>{t("discount")}</span><span>-₹{discount}</span>
            </div>
          )}
          {appliedDeliveryCharge > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: COLORS.text, marginBottom: 4 }}>
              <span>{t("deliveryCharge")}</span><span>+₹{appliedDeliveryCharge}</span>
            </div>
          )}
          {freeDeliveryAbove > 0 && productTotal < freeDeliveryAbove && (
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>
              ₹{freeDeliveryAbove} {t("addedBelow")}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 17, color: COLORS.text }}>
            <span>{t("total")}</span><span>₹{finalTotal}</span>
          </div>
        </div>

        {error && <div style={{ color: COLORS.accentRed, fontSize: "13px", marginTop: 10 }}>{error}</div>}

        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button className="tb-focus" onClick={onClose} disabled={submitting}
            style={{ flex: 1, background: COLORS.soft, color: COLORS.text, border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 600, cursor: "pointer" }}>
            {t("back")}
          </button>
          <button className="tb-focus" onClick={handleSubmit} disabled={submitting}
            style={{ flex: 2, background: COLORS.dark, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? t("placing") : t("placeOrder")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER CONFIRMATION
========================================================= */
function OrderConfirmation({ order, onClose }) {
  const { t } = useLang();
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.45)", padding: "16px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", width: "min(400px, 100%)", padding: "28px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.soft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Check size={28} color={COLORS.dark} />
        </div>
        <div className="tb-display" style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "6px" }}>{t("orderPlaced")}</div>
        <div style={{ fontSize: "14px", color: COLORS.muted, marginBottom: "18px" }}>
          {t("orderNumber")} <strong>#{order.id.slice(-5).toUpperCase()}</strong>. {t("willCall")} {order.phone}.
        </div>
        <button className="tb-focus" onClick={onClose}
          style={{ width: "100%", background: COLORS.dark, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, cursor: "pointer" }}>
          {t("ok")}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */
function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button className="tb-focus" onClick={() => setLang(lang === "hi" ? "en" : "hi")}
      style={{ background: COLORS.darkAlt, border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 12, fontWeight: 700 }}>
      <Globe size={15} /> {lang === "hi" ? "EN" : "हिं"}
    </button>
  );
}

function TopHeader({ platformLogoUrl, platformName, cartCount, onCartClick, showCart }) {
  const { t } = useLang();
  return (
    <div style={{ background: COLORS.dark, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Logo url={platformLogoUrl} size={26} />
        <span className="tb-display" style={{ color: "#fff", fontWeight: 700, fontSize: "20px" }}>{platformName && platformName.trim() ? platformName : t("appName")}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <LangToggle />
        {showCart && (
          <button className="tb-focus" onClick={onCartClick} aria-label="cart" style={{ position: "relative", background: COLORS.darkAlt, border: "none", borderRadius: "10px", padding: "8px 10px", cursor: "pointer" }}>
            <ShoppingBasket size={20} color="#fff" />
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, background: COLORS.accentRed, color: "#fff", fontSize: 11, fontWeight: 700, borderRadius: "999px", minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                {cartCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STOREFRONT (single unified catalog — no vendor browsing)
========================================================= */
function Storefront({ products, cart, onInc, onDec, cartCount, onCartClick, platformLogoUrl, platformName, onVendorLogin, onAdminLogin, onDistributorLogin }) {
  const { t } = useLang();
  const [category, setCategory] = useState(t("allCategories"));
  const [search, setSearch] = useState("");
  const [trackOpen, setTrackOpen] = useState(false);

  const categories = [t("allCategories"), ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  let filtered = category === t("allCategories") ? products : products.filter((p) => p.category === category);
  if (search.trim()) filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg }}>
      <FontLoader />
      <TopHeader platformLogoUrl={platformLogoUrl} platformName={platformName} cartCount={cartCount} onCartClick={onCartClick} showCart />

      <div style={{ padding: "24px 20px 10px", maxWidth: 720, margin: "0 auto" }}>
        <div className="tb-display" style={{ fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 700, color: COLORS.text, lineHeight: 1.2 }}>
          {t("tagline")}
        </div>
      </div>

      <div style={{ padding: "10px 20px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color={COLORS.muted} style={{ position: "absolute", left: 12, top: 12 }} />
          <input className="tb-focus" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchProducts")}
            style={{ width: "100%", padding: "10px 12px 10px 34px", borderRadius: "10px", border: `1px solid ${COLORS.border}`, fontSize: 14, boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", padding: "6px 20px 16px", maxWidth: 720, margin: "0 auto", overflowX: "auto" }}>
        {categories.map((c) => <Pill key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Pill>)}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "14px" }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={onInc} onInc={onInc} onDec={onDec} />
          ))}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "40px 0" }}>{t("noProducts")}</div>}
      </div>

      <div style={{ textAlign: "center", padding: "10px 18px 0" }}>
        <button className="tb-focus" onClick={() => setTrackOpen(true)}
          style={{ background: COLORS.soft, border: "none", borderRadius: "999px", padding: "8px 16px", color: COLORS.dark, fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Receipt size={14} /> {t("trackOrder")}
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "18px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="tb-focus" onClick={onDistributorLogin} style={{ background: "none", border: "none", color: COLORS.faint, fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <UserCog size={13} /> {t("distributorLogin")}
        </button>
        <button className="tb-focus" onClick={onAdminLogin} style={{ background: "none", border: "none", color: COLORS.faint, fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={13} /> {t("adminLogin")}
        </button>
        <button className="tb-focus" onClick={onVendorLogin} style={{ background: "none", border: "none", color: COLORS.faint, fontSize: "11px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", opacity: 0.6 }}>
          <Store size={12} /> {t("vendorLogin")}
        </button>
      </div>

      {trackOpen && <TrackOrderModal onClose={() => setTrackOpen(false)} />}
    </div>
  );
}

/* =========================================================
   TRACK ORDER MODAL (customer looks up their order by phone)
========================================================= */
function TrackOrderModal({ onClose }) {
  const { t, lang } = useLang();
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const find = async () => {
    if (!/^\d{10}$/.test(phone.trim())) return;
    setSearching(true);
    try {
      const all = await loadOrders();
      const mine = all.filter((o) => o.phone === phone.trim());
      setResults(mine);
    } catch (e) {
      setResults([]);
    }
    setSearching(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(20,30,20,0.45)", padding: "16px" }}>
      <div className="tb-scrollbar" style={{ background: "#fff", borderRadius: "16px", width: "min(420px, 100%)", padding: "24px", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="tb-display" style={{ fontSize: "20px", fontWeight: 700, color: COLORS.text }}>{t("trackOrder")}</div>
          <button className="tb-focus" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={20} color={COLORS.text} />
          </button>
        </div>

        <label className="tb-label">{t("enterPhoneToTrack")}</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input className="tb-focus tb-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" />
          <button className="tb-focus" onClick={find} disabled={searching}
            style={{ background: COLORS.dark, color: "#fff", border: "none", borderRadius: "8px", padding: "0 18px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            {t("find")}
          </button>
        </div>

        {results !== null && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {results.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "20px 0" }}>{t("noOrdersFound")}</div>}
            {[...results].reverse().map((o) => (
              <div key={o.id} style={{ background: COLORS.soft, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: COLORS.text }}>#{o.id.slice(-5).toUpperCase()}</span>
                  <span style={{ fontSize: 12, color: COLORS.faint }}>{new Date(o.createdAt).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")}</span>
                </div>
                <div style={{ fontSize: 13, color: COLORS.text }}>₹{o.total} · {t(o.deliveryStatus)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LEGACY VENDOR SYSTEM (dormant — kept for possible future
   multi-shop marketplace expansion; not part of the main
   customer flow, which is a single unified storefront)
========================================================= */
function VendorAuthGate({ vendors, onLoginSuccess, onBack, onRegister }) {
  const { t } = useLang();
  const [mode, setMode] = useState("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const doLogin = () => {
    const v = vendors.find((x) => x.phone === phone.trim() && x.password === password);
    if (!v) { setError(t("wrongPassword")); return; }
    setError("");
    onLoginSuccess(v.id);
  };

  const doRegister = async () => {
    if (!shopName.trim() || !ownerName.trim() || !phone.trim() || !password.trim() || !address.trim()) {
      setError(t("fillAll"));
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) { setError(t("invalidPhone")); return; }
    if (vendors.some((v) => v.phone === phone.trim())) { setError(t("wrongPassword")); return; }
    setSaving(true);
    const newVendor = {
      id: uid("v"), shopName: shopName.trim(), ownerName: ownerName.trim(), phone: phone.trim(),
      password, address: address.trim(), upiId: "", status: "pending", paidOut: 0, payoutLog: [],
      createdAt: new Date().toISOString(),
    };
    await onRegister(newVendor);
    setSaving(false);
    onLoginSuccess(newVendor.id);
  };

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <FontLoader />
      <div className="tb-scrollbar" style={{ background: "#fff", borderRadius: "16px", padding: "28px", width: "min(420px, 100%)", maxHeight: "92vh", overflowY: "auto" }}>
        <button className="tb-focus" onClick={onBack} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: COLORS.muted, cursor: "pointer", marginBottom: "14px", padding: 0 }}>
          <ChevronLeft size={18} /> {t("backToMarket")}
        </button>
        <div className="tb-display" style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "16px" }}>{t("vendorLogin")}</div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <Pill active={mode === "login"} onClick={() => setMode("login")}>{t("login")}</Pill>
          <Pill active={mode === "register"} onClick={() => setMode("register")}>{t("register")}</Pill>
        </div>

        {mode === "login" ? (
          <>
            <label className="tb-label">{t("phoneLogin")}</label>
            <input className="tb-focus tb-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" style={{ marginBottom: 12 }} />
            <label className="tb-label">{t("password")}</label>
            <input className="tb-focus tb-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doLogin()} style={{ marginBottom: 12 }} />
            {error && <div style={{ color: COLORS.accentRed, fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button className="tb-focus" onClick={doLogin} style={{ width: "100%", background: COLORS.dark, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, cursor: "pointer" }}>
              {t("login")}
            </button>
          </>
        ) : (
          <>
            <label className="tb-label">{t("shopName")}</label>
            <input className="tb-focus tb-input" value={shopName} onChange={(e) => setShopName(e.target.value)} style={{ marginBottom: 12 }} />
            <label className="tb-label">{t("ownerName")}</label>
            <input className="tb-focus tb-input" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} style={{ marginBottom: 12 }} />
            <label className="tb-label">{t("phoneLogin")}</label>
            <input className="tb-focus tb-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" style={{ marginBottom: 12 }} />
            <label className="tb-label">{t("setPassword")}</label>
            <input className="tb-focus tb-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: 12 }} />
            <label className="tb-label">{t("shopAddress")}</label>
            <input className="tb-focus tb-input" value={address} onChange={(e) => setAddress(e.target.value)} style={{ marginBottom: 12 }} />
            {error && <div style={{ color: COLORS.accentRed, fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button className="tb-focus" onClick={doRegister} disabled={saving}
              style={{ width: "100%", background: COLORS.dark, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
              {t("register")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function VendorDashboard({ vendor, products, setProducts, orders, onLogout }) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState("products");
  const [productForm, setProductForm] = useState({ name: "", category: "", price: "", unit: "kg", imageUrl: "", videoUrl: "" });
  const [saving, setSaving] = useState(false);

  const myProducts = products.filter((p) => p.ownerType === "vendor" && p.ownerId === vendor.id);
  const myProductSales = orders.reduce((sum, o) => {
    const mine = (o.items || []).filter((it) => it.sellerType === "vendor" && it.sellerId === vendor.id);
    return sum + mine.reduce((s, it) => s + it.price * it.qty, 0);
  }, 0);
  const myOrderCount = orders.filter((o) => (o.items || []).some((it) => it.sellerType === "vendor" && it.sellerId === vendor.id)).length;

  const persistProducts = async (next) => {
    setSaving(true);
    setProducts(next);
    try { await saveProducts(next); } catch (e) { console.error(e); }
    setSaving(false);
  };
  const addProduct = () => {
    if (!productForm.name.trim() || !productForm.price) return;
    const newProduct = {
      id: uid("p"), name: productForm.name.trim(), category: productForm.category.trim() || (lang === "hi" ? "अन्य" : "Other"),
      price: Number(productForm.price), unit: productForm.unit, imageUrl: productForm.imageUrl.trim(),
      videoUrl: productForm.videoUrl.trim(), stock: true, ownerType: "vendor", ownerId: vendor.id,
    };
    persistProducts([...products, newProduct]);
    setProductForm({ name: "", category: "", price: "", unit: "kg", imageUrl: "", videoUrl: "" });
  };
  const toggleStock = (id) => persistProducts(products.map((p) => (p.id === id ? { ...p, stock: !p.stock } : p)));
  const removeProduct = (id) => persistProducts(products.filter((p) => p.id !== id));
  const updateProductField = (id, field, value) => persistProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const tabs = [
    { id: "products", label: `${t("myProducts")} (${myProducts.length})` },
    { id: "sales", label: t("sales") },
  ];

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg }}>
      <FontLoader />
      <div style={{ background: COLORS.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
          <Store size={18} /> <span className="tb-display" style={{ fontWeight: 700 }}>{vendor.shopName}</span>
        </div>
        <button className="tb-focus" onClick={onLogout} style={{ background: COLORS.darkAlt, border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
          <LogOut size={14} /> {t("logout")}
        </button>
      </div>

      {vendor.status !== "active" && (
        <div style={{ background: vendor.status === "pending" ? COLORS.soft : COLORS.softRed, padding: "10px 20px", fontSize: 13, color: COLORS.text, textAlign: "center" }}>
          {vendor.status === "pending" ? t("pendingApproval") : t("suspended")}
        </div>
      )}

      <div style={{ display: "flex", gap: "8px", padding: "16px 20px 0", maxWidth: 760, margin: "0 auto" }}>
        {tabs.map((tb) => <Pill key={tb.id} active={tab === tb.id} onClick={() => setTab(tb.id)}>{tb.label}</Pill>)}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px" }}>
        {tab === "products" && (
          <>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", marginBottom: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: "12px", color: COLORS.text }}>{t("addProduct")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <input className="tb-input" placeholder={t("productName")} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                <input className="tb-input" placeholder={t("category")} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
                <input className="tb-input" placeholder={t("price")} type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                <select className="tb-input" value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}>
                  {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{lang === "hi" ? v.hi : v.en}</option>)}
                </select>
                <input className="tb-input" placeholder={t("imageUrl")} value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
                <input className="tb-input" placeholder={t("videoUrl")} value={productForm.videoUrl} onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
              </div>
              <button className="tb-focus" onClick={addProduct} disabled={saving}
                style={{ background: COLORS.accentYellow, border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>
                + {t("addProduct")}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {myProducts.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "20px 0" }}>{t("noProducts")}</div>}
              {myProducts.map((p) => (
                <div key={p.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} /> : <div style={{ fontSize: "26px" }}>{EMOJI_FALLBACK[p.category] || "🛒"}</div>}
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 600, color: COLORS.text }}>{p.name} <span style={{ fontSize: 12, color: COLORS.faint }}>· {p.category}</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <span style={{ fontSize: 13, color: COLORS.muted }}>₹</span>
                      <input type="number" value={p.price} onChange={(e) => updateProductField(p.id, "price", Number(e.target.value) || 0)}
                        style={{ width: 64, padding: "4px 6px", borderRadius: "6px", border: `1px solid #D8D8CC`, fontSize: 13 }} />
                    </div>
                  </div>
                  <button className="tb-focus" onClick={() => toggleStock(p.id)}
                    style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: "999px", border: "none", cursor: "pointer", background: p.stock ? COLORS.soft : COLORS.softRed, color: p.stock ? COLORS.dark : COLORS.accentRed }}>
                    {p.stock ? t("stockIn") : t("stockOut")}
                  </button>
                  <button className="tb-focus" onClick={() => removeProduct(p.id)} aria-label="remove" style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accentRed }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "sales" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: t("mySales"), value: `₹${myProductSales}`, highlight: true },
              { label: t("totalOrders"), value: myOrderCount },
            ].map((c, i) => (
              <div key={i} style={{ background: c.highlight ? COLORS.dark : "#fff", color: c.highlight ? "#fff" : COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: "14px", padding: "16px" }}>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>{c.label}</div>
                <div className="tb-display" style={{ fontSize: 22, fontWeight: 700 }}>{c.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DISTRIBUTOR AUTH (login only — accounts are created by the
   main admin, distributors don't self-register)
========================================================= */
function DistributorAuthGate({ distributors, onLoginSuccess, onBack }) {
  const { t } = useLang();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const doLogin = () => {
    const d = distributors.find((x) => x.phone === phone.trim() && x.password === password);
    if (!d) { setError(t("wrongPassword")); return; }
    if (d.status !== "active") { setError(t("suspended")); return; }
    setError("");
    onLoginSuccess(d.id);
  };

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <FontLoader />
      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", width: "min(380px, 100%)" }}>
        <button className="tb-focus" onClick={onBack} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: COLORS.muted, cursor: "pointer", marginBottom: "14px", padding: 0 }}>
          <ChevronLeft size={18} /> {t("backToMarket")}
        </button>
        <div className="tb-display" style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "6px" }}>{t("distributorLogin")}</div>
        <div style={{ fontSize: 12, color: COLORS.faint, marginBottom: 16 }}>{t("distributorAssistant")}</div>
        <label className="tb-label">{t("phoneLogin")}</label>
        <input className="tb-focus tb-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" style={{ marginBottom: 12 }} />
        <label className="tb-label">{t("password")}</label>
        <input className="tb-focus tb-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doLogin()} style={{ marginBottom: 12 }} />
        {error && <div style={{ color: COLORS.accentRed, fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <button className="tb-focus" onClick={doLogin} style={{ width: "100%", background: COLORS.dark, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, cursor: "pointer" }}>
          {t("login")}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   DISTRIBUTOR DASHBOARD
========================================================= */
function DistributorDashboard({ distributor, zones, orders, deliveryBoys, products, setProducts, refreshOrders, defaultCommission, onLogout }) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState("orders");
  const [productForm, setProductForm] = useState({ name: "", category: "", price: "", unit: "kg", imageUrl: "", videoUrl: "" });
  const [saving, setSaving] = useState(false);

  const zone = zones.find((z) => z.id === distributor.zoneId);
  const myOrders = orders.filter((o) => o.zoneId === distributor.zoneId);
  const commissionPct = distributor.commissionType === "percent" ? distributor.commissionValue : null;
  const totalSales = myOrders.reduce((s, o) => s + o.total, 0);
  const totalCommission = myOrders.reduce((s, o) => s + (o.distributorCommission || 0), 0);

  const myProducts = products.filter((p) => p.ownerType === "distributor" && p.ownerId === distributor.id);
  const myProductSales = orders.reduce((sum, o) => {
    const mine = (o.items || []).filter((it) => it.sellerType === "distributor" && it.sellerId === distributor.id);
    return sum + mine.reduce((s, it) => s + it.price * it.qty, 0);
  }, 0);

  const persistProducts = async (next) => {
    setSaving(true);
    setProducts(next);
    try { await saveProducts(next); } catch (e) { console.error(e); }
    setSaving(false);
  };
  const addProduct = () => {
    if (!productForm.name.trim() || !productForm.price) return;
    const newProduct = {
      id: uid("p"), name: productForm.name.trim(), category: productForm.category.trim() || (lang === "hi" ? "अन्य" : "Other"),
      price: Number(productForm.price), unit: productForm.unit, imageUrl: productForm.imageUrl.trim(),
      videoUrl: productForm.videoUrl.trim(), stock: true, ownerType: "distributor", ownerId: distributor.id,
    };
    persistProducts([...products, newProduct]);
    setProductForm({ name: "", category: "", price: "", unit: "kg", imageUrl: "", videoUrl: "" });
  };
  const toggleStock = (id) => persistProducts(products.map((p) => (p.id === id ? { ...p, stock: !p.stock } : p)));
  const removeProduct = (id) => persistProducts(products.filter((p) => p.id !== id));
  const updateProductField = (id, field, value) => persistProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  const assignBoy = async (orderId, deliveryBoyId) => {
    try {
      const existing = await loadOrders();
      const next = existing.map((o) => (o.id === orderId ? { ...o, deliveryBoyId: deliveryBoyId || null, deliveryStatus: deliveryBoyId ? "assigned" : "placed" } : o));
      await saveOrders(next);
      refreshOrders();
    } catch (e) { console.error(e); }
  };

  const tabs = [
    { id: "orders", label: `${t("orders")} (${myOrders.length})` },
    { id: "products", label: `${t("myProducts")} (${myProducts.length})` },
    { id: "sales", label: t("sales") },
  ];

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg }}>
      <FontLoader />
      <div style={{ background: COLORS.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
          <UserCog size={18} /> <span className="tb-display" style={{ fontWeight: 700 }}>{distributor.name}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <LangToggle />
          <button className="tb-focus" onClick={onLogout} style={{ background: COLORS.darkAlt, border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
            <LogOut size={14} /> {t("logout")}
          </button>
        </div>
      </div>

      <div style={{ padding: "10px 20px 0", maxWidth: 760, margin: "0 auto", fontSize: 13, color: COLORS.muted }}>
        {t("yourZone")}: <strong style={{ color: COLORS.text }}>{zone ? zone.name : t("zoneUnassigned")}</strong>
      </div>

      <div style={{ display: "flex", gap: "8px", padding: "12px 20px 0", maxWidth: 760, margin: "0 auto" }}>
        {tabs.map((tb) => <Pill key={tb.id} active={tab === tb.id} onClick={() => setTab(tb.id)}>{tb.label}</Pill>)}
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px" }}>
        {tab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button className="tb-focus" onClick={refreshOrders} style={{ alignSelf: "flex-end", background: COLORS.soft, border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <RefreshCw size={14} /> {t("refresh")}
            </button>
            {myOrders.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "40px 0" }}>{t("noOrders")}</div>}
            {[...myOrders].reverse().map((o) => (
              <div key={o.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 700, color: COLORS.text }}>#{o.id.slice(-5).toUpperCase()}</span>
                  <span style={{ fontSize: 12, color: COLORS.faint }}>{new Date(o.createdAt).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN")}</span>
                </div>
                <div style={{ fontSize: 14, color: COLORS.text }}>{o.name} · {o.phone}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>{o.address}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span>{t("deliverySlot")}: {t(o.slot)}</span>
                  <span>{t("paymentMethod")}: {t(o.paymentMethod)}</span>
                </div>
                <div style={{ borderTop: `1px dashed ${COLORS.border}`, paddingTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {o.items.map((it) => (
                    <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.text }}>
                      <span>{it.name} × {it.qty}</span><span>₹{it.price * it.qty}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, margin: "8px 0", color: COLORS.text }}>
                  <span>{t("total")}</span><span>₹{o.total}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <label style={{ fontSize: 12, color: COLORS.muted }}>{t("assignTo")}:</label>
                  <select value={o.deliveryBoyId || ""} onChange={(e) => assignBoy(o.id, e.target.value)}
                    style={{ fontSize: 12, borderRadius: 6, border: `1px solid #D8D8CC`, padding: "5px 6px" }}>
                    <option value="">{t("unassigned")}</option>
                    {deliveryBoys.filter((d) => d.active).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                    background: o.deliveryStatus === "delivered" ? COLORS.soft : o.deliveryStatus === "out_for_delivery" ? "#FDF1DC" : o.deliveryStatus === "assigned" ? "#EAF1FB" : COLORS.softRed,
                    color: o.deliveryStatus === "delivered" ? COLORS.dark : o.deliveryStatus === "out_for_delivery" ? "#8A5A00" : o.deliveryStatus === "assigned" ? "#2A5885" : COLORS.accentRed,
                  }}>{t(o.deliveryStatus)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", marginBottom: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: "12px", color: COLORS.text }}>{t("addProduct")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <input className="tb-input" placeholder={t("productName")} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                <input className="tb-input" placeholder={t("category")} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
                <input className="tb-input" placeholder={t("price")} type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                <select className="tb-input" value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}>
                  {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{lang === "hi" ? v.hi : v.en}</option>)}
                </select>
                <input className="tb-input" placeholder={t("imageUrl")} value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
                <input className="tb-input" placeholder={t("videoUrl")} value={productForm.videoUrl} onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
              </div>
              <button className="tb-focus" onClick={addProduct} disabled={saving}
                style={{ background: COLORS.accentYellow, border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>
                + {t("addProduct")}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {myProducts.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "20px 0" }}>{t("noProducts")}</div>}
              {myProducts.map((p) => (
                <div key={p.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} /> : <div style={{ fontSize: "26px" }}>{EMOJI_FALLBACK[p.category] || "🛒"}</div>}
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 600, color: COLORS.text }}>{p.name} <span style={{ fontSize: 12, color: COLORS.faint }}>· {p.category}</span></div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <span style={{ fontSize: 13, color: COLORS.muted }}>₹</span>
                      <input type="number" value={p.price} onChange={(e) => updateProductField(p.id, "price", Number(e.target.value) || 0)}
                        style={{ width: 64, padding: "4px 6px", borderRadius: "6px", border: `1px solid #D8D8CC`, fontSize: 13 }} />
                    </div>
                  </div>
                  <button className="tb-focus" onClick={() => toggleStock(p.id)}
                    style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: "999px", border: "none", cursor: "pointer", background: p.stock ? COLORS.soft : COLORS.softRed, color: p.stock ? COLORS.dark : COLORS.accentRed }}>
                    {p.stock ? t("stockIn") : t("stockOut")}
                  </button>
                  <button className="tb-focus" onClick={() => removeProduct(p.id)} aria-label="remove" style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accentRed }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "sales" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: t("totalSales"), value: `₹${totalSales}` },
              { label: t("totalOrders"), value: myOrders.length },
              { label: t("commissionRate"), value: distributor.commissionType === "percent" ? `${distributor.commissionValue}%` : `₹${distributor.commissionValue}/${t("orders")}` },
              { label: t("myEarnings"), value: `₹${totalCommission}`, highlight: true },
              { label: t("mySales"), value: `₹${myProductSales}` },
            ].map((c, i) => (
              <div key={i} style={{ background: c.highlight ? COLORS.dark : "#fff", color: c.highlight ? "#fff" : COLORS.text, border: `1px solid ${COLORS.border}`, borderRadius: "14px", padding: "16px", gridColumn: c.highlight ? "1 / span 2" : "auto" }}>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>{c.label}</div>
                <div className="tb-display" style={{ fontSize: 22, fontWeight: 700 }}>{c.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SUPER ADMIN AUTH
========================================================= */
function AdminAuthGate({ onSuccess, onBack }) {
  const { t } = useLang();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const attempt = () => (pw === SUPER_ADMIN_PASSWORD ? onSuccess() : setError(t("wrongPassword")));
  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <FontLoader />
      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", width: "min(380px, 100%)" }}>
        <button className="tb-focus" onClick={onBack} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: COLORS.muted, cursor: "pointer", marginBottom: "14px", padding: 0 }}>
          <ChevronLeft size={18} /> {t("backToMarket")}
        </button>
        <div className="tb-display" style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "16px" }}>{t("adminLogin")}</div>
        <input className="tb-focus tb-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && attempt()} placeholder={t("password")} style={{ marginBottom: 10 }} />
        {error && <div style={{ color: COLORS.accentRed, fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <button className="tb-focus" onClick={attempt} style={{ width: "100%", background: COLORS.dark, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, cursor: "pointer" }}>
          {t("login")}
        </button>
        <div style={{ fontSize: 12, color: COLORS.faint, marginTop: 12, textAlign: "center" }}>{t("demoPassword")}: {SUPER_ADMIN_PASSWORD}</div>
      </div>
    </div>
  );
}

/* =========================================================
   SUPER ADMIN DASHBOARD
========================================================= */
function AdminDashboard({
  products, setProducts, zones, setZones, distributors, setDistributors,
  orders, setOrders, refreshOrders, settings, setSettings, deliveryBoys, setDeliveryBoys,
  vendors, setVendors, onLogout,
}) {
  const { t, lang } = useLang();
  const [tab, setTab] = useState("products");
  const [saving, setSaving] = useState(false);

  const [productForm, setProductForm] = useState({ name: "", category: "", price: "", unit: "kg", imageUrl: "", videoUrl: "" });
  const [zoneForm, setZoneForm] = useState("");
  const [distForm, setDistForm] = useState({ name: "", phone: "", password: "", zoneId: "", commissionType: "flat", commissionValue: "", upiId: "" });
  const [distFormError, setDistFormError] = useState("");
  const [boyForm, setBoyForm] = useState({ name: "", phone: "", password: "", commissionType: "flat", commissionValue: "", upiId: "" });
  const [boyFormError, setBoyFormError] = useState("");
  const [couponForm, setCouponForm] = useState({ code: "", type: "percent", value: "" });
  const [payoutInputs, setPayoutInputs] = useState({});

  const persist = (setter, saver) => async (next) => {
    setSaving(true);
    setter(next);
    try { await saver(next); } catch (e) { console.error(e); }
    setSaving(false);
  };
  const persistProducts = persist(setProducts, saveProducts);
  const persistZones = persist(setZones, saveZones);
  const persistDistributors = persist(setDistributors, saveDistributors);
  const persistOrders = persist(setOrders, saveOrders);
  const persistDeliveryBoys = persist(setDeliveryBoys, saveDeliveryBoys);
  const persistSettings = persist(setSettings, saveSettings);
  const persistVendors = persist(setVendors, saveVendors);

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const totalDistCommission = orders.reduce((s, o) => s + (o.distributorCommission || 0), 0);

  /* ---------- Products ---------- */
  const addProduct = () => {
    if (!productForm.name.trim() || !productForm.price) return;
    const newProduct = {
      id: uid("p"), name: productForm.name.trim(), category: productForm.category.trim() || (lang === "hi" ? "अन्य" : "Other"),
      price: Number(productForm.price), unit: productForm.unit, imageUrl: productForm.imageUrl.trim(),
      videoUrl: productForm.videoUrl.trim(), stock: true, ownerType: "admin", ownerId: null,
    };
    persistProducts([...products, newProduct]);
    setProductForm({ name: "", category: "", price: "", unit: "kg", imageUrl: "", videoUrl: "" });
  };
  const toggleStock = (id) => persistProducts(products.map((p) => (p.id === id ? { ...p, stock: !p.stock } : p)));
  const removeProduct = (id) => persistProducts(products.filter((p) => p.id !== id));
  const updateProductField = (id, field, value) => persistProducts(products.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  /* ---------- Zones ---------- */
  const addZone = () => {
    if (!zoneForm.trim()) return;
    persistZones([...zones, { id: uid("z"), name: zoneForm.trim() }]);
    setZoneForm("");
  };
  const removeZone = (id) => persistZones(zones.filter((z) => z.id !== id));

  /* ---------- Distributors ---------- */
  const addDistributor = () => {
    if (!distForm.name.trim() || !distForm.phone.trim() || !distForm.password.trim()) {
      setDistFormError(t("fillRequiredFields"));
      return;
    }
    if (distributors.some((d) => d.phone === distForm.phone.trim())) {
      setDistFormError(t("phoneExists"));
      return;
    }
    setDistFormError("");
    const newDist = {
      id: uid("dist"), name: distForm.name.trim(), phone: distForm.phone.trim(), password: distForm.password,
      zoneId: distForm.zoneId || null, commissionType: distForm.commissionType,
      commissionValue: Number(distForm.commissionValue) || 0, upiId: distForm.upiId.trim(),
      status: "active", paidOut: 0, payoutLog: [], createdAt: new Date().toISOString(),
    };
    persistDistributors([...distributors, newDist]);
    setDistForm({ name: "", phone: "", password: "", zoneId: "", commissionType: "flat", commissionValue: "", upiId: "" });
  };
  const setDistStatus = (id, status) => persistDistributors(distributors.map((d) => (d.id === id ? { ...d, status } : d)));
  const recordDistPayout = (id, sign) => {
    const amount = Number(payoutInputs["dist_" + id]);
    if (!amount || amount <= 0) return;
    const signedAmount = sign * amount;
    const next = distributors.map((d) => d.id === id
      ? { ...d, paidOut: (d.paidOut || 0) + signedAmount, payoutLog: [...(d.payoutLog || []), { date: new Date().toISOString(), amount: signedAmount }] }
      : d);
    persistDistributors(next);
    setPayoutInputs({ ...payoutInputs, ["dist_" + id]: "" });
  };

  /* ---------- Delivery boys ---------- */
  const addBoy = () => {
    if (!boyForm.name.trim() || !boyForm.phone.trim() || !boyForm.password.trim() || !boyForm.commissionValue) {
      setBoyFormError(t("fillRequiredFields"));
      return;
    }
    setBoyFormError("");
    const newBoy = {
      id: uid("d"), name: boyForm.name.trim(), phone: boyForm.phone.trim(), password: boyForm.password,
      commissionType: boyForm.commissionType, commissionValue: Number(boyForm.commissionValue), active: true,
      upiId: boyForm.upiId.trim(), paidOut: 0, payoutLog: [], createdAt: new Date().toISOString(),
    };
    persistDeliveryBoys([...deliveryBoys, newBoy]);
    setBoyForm({ name: "", phone: "", password: "", commissionType: "flat", commissionValue: "", upiId: "" });
  };
  const toggleBoyActive = (id) => persistDeliveryBoys(deliveryBoys.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  const removeBoy = (id) => persistDeliveryBoys(deliveryBoys.filter((d) => d.id !== id));
  const recordBoyPayout = (id) => {
    const amount = Number(payoutInputs["boy_" + id]);
    if (!amount || amount <= 0) return;
    const next = deliveryBoys.map((d) => d.id === id
      ? { ...d, paidOut: (d.paidOut || 0) + amount, payoutLog: [...(d.payoutLog || []), { date: new Date().toISOString(), amount }] }
      : d);
    persistDeliveryBoys(next);
    setPayoutInputs({ ...payoutInputs, ["boy_" + id]: "" });
  };

  /* ---------- Orders ---------- */
  const assignOrder = (orderId, deliveryBoyId) => {
    const next = orders.map((o) => (o.id === orderId ? { ...o, deliveryBoyId: deliveryBoyId || null, deliveryStatus: deliveryBoyId ? "assigned" : "placed" } : o));
    persistOrders(next);
  };

  /* ---------- Coupons ---------- */
  const addCoupon = () => {
    if (!couponForm.code.trim() || !couponForm.value) return;
    const next = { ...settings, coupons: [...(settings.coupons || []), { code: couponForm.code.trim().toUpperCase(), type: couponForm.type, value: Number(couponForm.value), active: true }] };
    persistSettings(next);
    setCouponForm({ code: "", type: "percent", value: "" });
  };
  const removeCoupon = (code) => persistSettings({ ...settings, coupons: (settings.coupons || []).filter((c) => c.code !== code) });
  const toggleCoupon = (code) => persistSettings({ ...settings, coupons: (settings.coupons || []).map((c) => (c.code === code ? { ...c, active: !c.active } : c)) });

  /* ---------- Legacy vendors ---------- */
  const setVendorStatus = (id, status) => persistVendors(vendors.map((v) => (v.id === id ? { ...v, status } : v)));

  const tabs = [
    { id: "products", label: `${t("products")} (${products.length})` },
    { id: "distributors", label: `${t("distributors")} (${distributors.length})` },
    { id: "orders", label: `${t("allOrders")} (${orders.length})` },
    { id: "delivery", label: `${t("deliveryBoys")} (${deliveryBoys.length})` },
    { id: "settings", label: t("settings") },
    { id: "vendors", label: t("vendors") },
  ];

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg }}>
      <FontLoader />
      <div style={{ background: COLORS.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
          <ShieldCheck size={18} /> <span className="tb-display" style={{ fontWeight: 700 }}>{t("adminLogin")}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <LangToggle />
          <button className="tb-focus" onClick={onLogout} style={{ background: COLORS.darkAlt, border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
            <LogOut size={14} /> {t("logout")}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "20px 20px 0", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ background: COLORS.dark, color: "#fff", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t("totalSales")}</div>
          <div className="tb-display" style={{ fontSize: 22, fontWeight: 700 }}>₹{totalSales}</div>
        </div>
        <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12, color: COLORS.muted }}>{t("totalOrders")}</div>
          <div className="tb-display" style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>{orders.length}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", padding: "16px 20px 0", maxWidth: 800, margin: "0 auto", overflowX: "auto" }}>
        {tabs.map((tb) => <Pill key={tb.id} active={tab === tb.id} onClick={() => setTab(tb.id)}>{tb.label}</Pill>)}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>

        {tab === "products" && (
          <>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", marginBottom: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: "12px", color: COLORS.text }}>{t("addProduct")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <input className="tb-input" placeholder={t("productName")} value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                <input className="tb-input" placeholder={t("category")} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
                <input className="tb-input" placeholder={t("price")} type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                <select className="tb-input" value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}>
                  {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{lang === "hi" ? v.hi : v.en}</option>)}
                </select>
                <input className="tb-input" placeholder={t("imageUrl")} value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
                <input className="tb-input" placeholder={t("videoUrl")} value={productForm.videoUrl} onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
              </div>
              <button className="tb-focus" onClick={addProduct} disabled={saving}
                style={{ background: COLORS.accentYellow, border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>
                + {t("addProduct")}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {products.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "20px 0" }}>{t("noProducts")}</div>}
              {products.map((p) => (
                <div key={p.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} /> : <div style={{ fontSize: "26px" }}>{EMOJI_FALLBACK[p.category] || "🛒"}</div>}
                  <div style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontWeight: 600, color: COLORS.text }}>
                      {p.name} <span style={{ fontSize: 12, color: COLORS.faint }}>· {p.category}</span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.faint, marginTop: 2 }}>
                      {t("addedBy")}: {
                        p.ownerType === "distributor" ? `${t("addedByDistributor")} · ${distributors.find((d) => d.id === p.ownerId)?.name || "?"}`
                        : p.ownerType === "vendor" ? `${t("addedByVendor")} · ${vendors.find((v) => v.id === p.ownerId)?.shopName || "?"}`
                        : t("addedByAdmin")
                      }
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <span style={{ fontSize: 13, color: COLORS.muted }}>₹</span>
                      <input type="number" value={p.price} onChange={(e) => updateProductField(p.id, "price", Number(e.target.value) || 0)}
                        style={{ width: 64, padding: "4px 6px", borderRadius: "6px", border: `1px solid #D8D8CC`, fontSize: 13 }} />
                      <select value={p.unit} onChange={(e) => updateProductField(p.id, "unit", e.target.value)} style={{ fontSize: 12, borderRadius: 6, border: `1px solid #D8D8CC`, padding: "3px" }}>
                        {Object.entries(UNIT_LABELS).map(([k, v]) => <option key={k} value={k}>{lang === "hi" ? v.hi : v.en}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="tb-focus" onClick={() => toggleStock(p.id)}
                    style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: "999px", border: "none", cursor: "pointer", background: p.stock ? COLORS.soft : COLORS.softRed, color: p.stock ? COLORS.dark : COLORS.accentRed }}>
                    {p.stock ? t("stockIn") : t("stockOut")}
                  </button>
                  <button className="tb-focus" onClick={() => removeProduct(p.id)} aria-label="remove" style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accentRed }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "distributors" && (
          <>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", marginBottom: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: "12px", color: COLORS.text, display: "flex", alignItems: "center", gap: 6 }}><Layers size={16} /> {t("zones")}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input className="tb-input" placeholder={t("zoneName")} value={zoneForm} onChange={(e) => setZoneForm(e.target.value)} />
                <button className="tb-focus" onClick={addZone} style={{ background: COLORS.soft, border: "none", borderRadius: "8px", padding: "0 16px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                  + {t("addZone")}
                </button>
              </div>
              {zones.length === 0 && <div style={{ fontSize: 13, color: COLORS.muted }}>{t("noZonesYet")}</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {zones.map((z) => (
                  <div key={z.id} style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.soft, borderRadius: 999, padding: "6px 10px", fontSize: 13 }}>
                    <span style={{ color: COLORS.text, fontWeight: 600 }}>{z.name}</span>
                    <button className="tb-focus" onClick={() => removeZone(z.id)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accentRed, display: "flex" }}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", marginBottom: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: "12px", color: COLORS.text }}>{t("addDistributor")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <input className="tb-input" placeholder={t("distributorName")} value={distForm.name} onChange={(e) => setDistForm({ ...distForm, name: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
                <input className="tb-input" placeholder={t("phoneLogin")} value={distForm.phone} onChange={(e) => setDistForm({ ...distForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} inputMode="numeric" />
                <input className="tb-input" placeholder={t("setPassword")} value={distForm.password} onChange={(e) => setDistForm({ ...distForm, password: e.target.value })} />
                <select className="tb-input" value={distForm.zoneId} onChange={(e) => setDistForm({ ...distForm, zoneId: e.target.value })} style={{ gridColumn: "1 / span 2" }}>
                  <option value="">{t("selectZone")}</option>
                  {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
                <select className="tb-input" value={distForm.commissionType} onChange={(e) => setDistForm({ ...distForm, commissionType: e.target.value })}>
                  <option value="flat">{t("flatPerOrder")}</option>
                  <option value="percent">{t("percentOfOrder")}</option>
                </select>
                <input className="tb-input" type="number" placeholder={t("orderCommission")} value={distForm.commissionValue} onChange={(e) => setDistForm({ ...distForm, commissionValue: e.target.value })} />
                <input className="tb-input" placeholder={t("upiOptional")} value={distForm.upiId} onChange={(e) => setDistForm({ ...distForm, upiId: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
              </div>
              <button className="tb-focus" onClick={addDistributor} disabled={saving}
                style={{ background: COLORS.accentYellow, border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>
                + {t("addDistributor")}
              </button>
              {distFormError && <div style={{ color: COLORS.accentRed, fontSize: 12, marginTop: 8 }}>{distFormError}</div>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {distributors.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "20px 0" }}>{t("noDistributorYet")}</div>}
              {distributors.map((d) => {
                const dOrders = orders.filter((o) => o.distributorId === d.id);
                const dSales = dOrders.reduce((s, o) => s + o.total, 0);
                const codOrders = dOrders.filter((o) => o.paymentMethod === "cod");
                const upiOrders = dOrders.filter((o) => o.paymentMethod === "upi");
                const cashHeld = codOrders.reduce((s, o) => s + o.total, 0);
                const codCommission = codOrders.reduce((s, o) => s + (o.distributorCommission || 0), 0);
                const upiCommission = upiOrders.reduce((s, o) => s + (o.distributorCommission || 0), 0);
                const distributorOwesFromCash = cashHeld - codCommission;
                const due = upiCommission - distributorOwesFromCash - (d.paidOut || 0);
                const zone = zones.find((z) => z.id === d.zoneId);
                const dProductSales = orders.reduce((sum, o) => {
                  const mine = (o.items || []).filter((it) => it.sellerType === "distributor" && it.sellerId === d.id);
                  return sum + mine.reduce((s, it) => s + it.price * it.qty, 0);
                }, 0);
                return (
                  <div key={d.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: COLORS.text }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>{d.phone} · {t("yourZone")}: {zone ? zone.name : t("zoneUnassigned")}</div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                        background: d.status === "active" ? COLORS.soft : COLORS.softRed,
                        color: d.status === "active" ? COLORS.dark : COLORS.accentRed,
                      }}>
                        {d.status === "active" ? t("active") : t("suspended")}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: COLORS.muted, flexWrap: "wrap" }}>
                      <span>{t("totalSales")}: ₹{dSales}</span>
                      <span>{t("totalOrders")}: {dOrders.length}</span>
                      <span>{d.commissionType === "percent" ? `${d.commissionValue}%` : `₹${d.commissionValue}/${t("orders")}`}</span>
                      {dProductSales > 0 && <span>{t("mySales")}: ₹{dProductSales}</span>}
                    </div>
                    {cashHeld > 0 && (
                      <div style={{ fontSize: 11, color: COLORS.faint, marginTop: 4 }}>{t("cashHeldNote")}: ₹{cashHeld} (COD)</div>
                    )}

                    <div style={{ marginTop: 8, background: due !== 0 ? COLORS.softRed : COLORS.soft, borderRadius: 8, padding: "8px 10px" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: due !== 0 ? COLORS.accentRed : COLORS.dark, marginBottom: 8 }}>
                        {due > 0 ? `${t("youOwe")}: ₹${due}` : due < 0 ? `${t("theyOwe")}: ₹${Math.abs(due)}` : t("settled")}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <input type="number" placeholder={t("enterAmount")} value={payoutInputs["dist_" + d.id] || ""}
                          onChange={(e) => setPayoutInputs({ ...payoutInputs, ["dist_" + d.id]: e.target.value })}
                          style={{ width: 90, padding: "5px 7px", borderRadius: 6, border: `1px solid #D8D8CC`, fontSize: 12 }} />
                        <button className="tb-focus" onClick={() => recordDistPayout(d.id, 1)}
                          style={{ fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 8, border: "none", background: COLORS.dark, color: "#fff", cursor: "pointer" }}>
                          {t("iPaid")}
                        </button>
                        <button className="tb-focus" onClick={() => recordDistPayout(d.id, -1)}
                          style={{ fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 8, border: `1px solid ${COLORS.dark}`, background: "#fff", color: COLORS.dark, cursor: "pointer" }}>
                          {t("iCollected")}
                        </button>
                      </div>
                    </div>

                    {d.upiId ? (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, background: COLORS.card, border: `1px dashed ${COLORS.border}`, borderRadius: 8, padding: "8px 10px" }}>
                        <img src={buildUpiQrUrl(d.upiId, Math.max(due, 1), d.name)} alt="Distributor UPI QR" width={56} height={56}
                          style={{ borderRadius: 6, background: "#fff", padding: 3, border: `1px solid ${COLORS.border}`, flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: COLORS.text }}>
                          <div style={{ color: COLORS.muted }}>{t("theirUpi")}</div>
                          <strong>{d.upiId}</strong>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 8, fontSize: 12, color: COLORS.faint, fontStyle: "italic" }}>{t("noUpiSet")}</div>
                    )}

                    <div style={{ marginTop: 10 }}>
                      {d.status === "active" ? (
                        <button className="tb-focus" onClick={() => setDistStatus(d.id, "suspended")}
                          style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "none", background: COLORS.softRed, color: COLORS.accentRed, cursor: "pointer" }}>
                          {t("suspend")}
                        </button>
                      ) : (
                        <button className="tb-focus" onClick={() => setDistStatus(d.id, "active")}
                          style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "none", background: COLORS.soft, color: COLORS.dark, cursor: "pointer" }}>
                          {t("activate")}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button className="tb-focus" onClick={refreshOrders} style={{ alignSelf: "flex-end", background: COLORS.soft, border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <RefreshCw size={14} /> {t("refresh")}
            </button>
            {orders.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "40px 0" }}>{t("noOrders")}</div>}
            {[...orders].reverse().map((o) => {
              const zone = zones.find((z) => z.id === o.zoneId);
              return (
                <div key={o.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, color: COLORS.text }}>#{o.id.slice(-5).toUpperCase()}</span>
                    <span style={{ fontSize: 12, color: COLORS.faint }}>{new Date(o.createdAt).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN")}</span>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 6 }}>{o.name} · {zone ? zone.name : "—"}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.text }}>
                    <span>{t("total")}: ₹{o.total}{o.deliveryCharge > 0 && <span style={{ color: COLORS.muted, fontSize: 11 }}> ({t("deliveryCharge")}: ₹{o.deliveryCharge})</span>}</span>
                    <span>{t("paymentMethod")}: {t(o.paymentMethod)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <label style={{ fontSize: 12, color: COLORS.muted }}>{t("assignTo")}:</label>
                    <select value={o.deliveryBoyId || ""} onChange={(e) => assignOrder(o.id, e.target.value || null)}
                      style={{ fontSize: 12, borderRadius: 6, border: `1px solid #D8D8CC`, padding: "5px 6px" }}>
                      <option value="">{t("unassigned")}</option>
                      {deliveryBoys.filter((d) => d.active).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                      background: o.deliveryStatus === "delivered" ? COLORS.soft : o.deliveryStatus === "out_for_delivery" ? "#FDF1DC" : o.deliveryStatus === "assigned" ? "#EAF1FB" : COLORS.softRed,
                      color: o.deliveryStatus === "delivered" ? COLORS.dark : o.deliveryStatus === "out_for_delivery" ? "#8A5A00" : o.deliveryStatus === "assigned" ? "#2A5885" : COLORS.accentRed,
                    }}>{t(o.deliveryStatus)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "delivery" && (
          <>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", marginBottom: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: "12px", color: COLORS.text }}>{t("addDeliveryBoy")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <input className="tb-input" placeholder={t("deliveryBoyName")} value={boyForm.name} onChange={(e) => setBoyForm({ ...boyForm, name: e.target.value })} />
                <input className="tb-input" placeholder={t("deliveryPhone")} value={boyForm.phone} onChange={(e) => setBoyForm({ ...boyForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} inputMode="numeric" />
                <input className="tb-input" placeholder={t("deliveryPassword")} value={boyForm.password} onChange={(e) => setBoyForm({ ...boyForm, password: e.target.value })} />
                <select className="tb-input" value={boyForm.commissionType} onChange={(e) => setBoyForm({ ...boyForm, commissionType: e.target.value })}>
                  <option value="flat">{t("flatPerOrder")}</option>
                  <option value="percent">{t("percentOfOrder")}</option>
                </select>
                <input className="tb-input" type="number" placeholder={t("orderCommission")} value={boyForm.commissionValue} onChange={(e) => setBoyForm({ ...boyForm, commissionValue: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
                <input className="tb-input" placeholder={t("upiOptional")} value={boyForm.upiId} onChange={(e) => setBoyForm({ ...boyForm, upiId: e.target.value })} style={{ gridColumn: "1 / span 2" }} />
              </div>
              <button className="tb-focus" onClick={addBoy} disabled={saving}
                style={{ background: COLORS.accentYellow, border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>
                + {t("addDeliveryBoy")}
              </button>
              {boyFormError && <div style={{ color: COLORS.accentRed, fontSize: 12, marginTop: 8 }}>{boyFormError}</div>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {deliveryBoys.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "20px 0" }}>{t("noAssignedOrders")}</div>}
              {deliveryBoys.map((d) => {
                const dOrders = orders.filter((o) => o.deliveryBoyId === d.id);
                const delivered = dOrders.filter((o) => o.deliveryStatus === "delivered");
                const earned = delivered.reduce((s, o) => s + (o.deliveryCommission || 0), 0);
                const due = earned - (d.paidOut || 0);
                return (
                  <div key={d.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: COLORS.text }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>{d.phone} · {d.commissionType === "percent" ? `${d.commissionValue}%` : `₹${d.commissionValue}/${t("orders")}`}</div>
                      </div>
                      <button className="tb-focus" onClick={() => toggleBoyActive(d.id)}
                        style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: "999px", border: "none", cursor: "pointer", background: d.active ? COLORS.soft : COLORS.softRed, color: d.active ? COLORS.dark : COLORS.accentRed }}>
                        {d.active ? t("active_status") : t("inactive_status")}
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 12, color: COLORS.muted, flexWrap: "wrap" }}>
                      <span>{t("totalDelivered")}: {delivered.length}</span>
                      <span>{t("myEarnings")}: ₹{earned}</span>
                      <span>{t("paidSoFar")}: ₹{d.paidOut || 0}</span>
                    </div>
                    <div style={{ marginTop: 8, background: due > 0 ? COLORS.softRed : COLORS.soft, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: due > 0 ? COLORS.accentRed : COLORS.dark }}>{t("dueAmount")}: ₹{due}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <input type="number" placeholder={t("enterAmount")} value={payoutInputs["boy_" + d.id] || ""}
                          onChange={(e) => setPayoutInputs({ ...payoutInputs, ["boy_" + d.id]: e.target.value })}
                          style={{ width: 90, padding: "5px 7px", borderRadius: 6, border: `1px solid #D8D8CC`, fontSize: 12 }} />
                        <button className="tb-focus" onClick={() => recordBoyPayout(d.id)}
                          style={{ fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 8, border: "none", background: COLORS.dark, color: "#fff", cursor: "pointer" }}>
                          {t("recordPayment")}
                        </button>
                      </div>
                    </div>
                    {d.upiId ? (
                      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, background: COLORS.card, border: `1px dashed ${COLORS.border}`, borderRadius: 8, padding: "8px 10px" }}>
                        <img src={buildUpiQrUrl(d.upiId, Math.max(due, 1), d.name)} alt="Delivery boy UPI QR" width={56} height={56}
                          style={{ borderRadius: 6, background: "#fff", padding: 3, border: `1px solid ${COLORS.border}`, flexShrink: 0 }} />
                        <div style={{ fontSize: 12, color: COLORS.text }}>
                          <div style={{ color: COLORS.muted }}>{t("theirUpi")}</div>
                          <strong>{d.upiId}</strong>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 8, fontSize: 12, color: COLORS.faint, fontStyle: "italic" }}>{t("noUpiSet")}</div>
                    )}
                    <button className="tb-focus" onClick={() => removeBoy(d.id)} style={{ marginTop: 8, background: "none", border: "none", cursor: "pointer", color: COLORS.accentRed, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                      <Trash2 size={14} /> {t("remove")}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: COLORS.text }}>{t("platformName")}</div>
              <input className="tb-input" value={settings.platformName || ""} onChange={(e) => persistSettings({ ...settings, platformName: e.target.value })} />
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `2px solid ${COLORS.dark}` }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: COLORS.text }}>{t("platformUpiId")}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>{t("paymentGoesToPlatform")}</div>
              <input className="tb-input" placeholder="yourname@upi" value={settings.platformUpiId || ""} onChange={(e) => persistSettings({ ...settings, platformUpiId: e.target.value })} />
              {settings.platformUpiId && (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <img
                    src={buildUpiQrUrl(settings.platformUpiId, 1, settings.platformName || "Taaza Bazaar")}
                    alt="UPI QR"
                    width={140} height={140}
                    style={{ borderRadius: 8, background: "#fff", padding: 6, border: `1px solid ${COLORS.border}` }}
                  />
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{t("scanToPay")}</div>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: COLORS.text }}>{t("defaultCommission")}</div>
              <input type="number" value={settings.defaultCommission} onChange={(e) => persistSettings({ ...settings, defaultCommission: Number(e.target.value) || 0 })}
                style={{ width: 90, padding: "8px 10px", borderRadius: 8, border: `1px solid #D8D8CC` }} />
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: COLORS.text }}>{t("deliveryCharge")}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>{t("freeDeliveryNote")}</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <div>
                  <label className="tb-label">{t("freeDeliveryAbove")}</label>
                  <input type="number" value={settings.freeDeliveryAbove} onChange={(e) => persistSettings({ ...settings, freeDeliveryAbove: Number(e.target.value) || 0 })}
                    style={{ width: 110, padding: "8px 10px", borderRadius: 8, border: `1px solid #D8D8CC` }} />
                </div>
                <div>
                  <label className="tb-label">{t("deliveryChargeAmount")}</label>
                  <input type="number" value={settings.deliveryCharge} onChange={(e) => persistSettings({ ...settings, deliveryCharge: Number(e.target.value) || 0 })}
                    style={{ width: 110, padding: "8px 10px", borderRadius: 8, border: `1px solid #D8D8CC` }} />
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: COLORS.text }}>{t("platformLogo")}</div>
              <input className="tb-input" value={settings.platformLogoUrl || ""} onChange={(e) => persistSettings({ ...settings, platformLogoUrl: e.target.value })} />
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 6, color: COLORS.text, display: "flex", alignItems: "center", gap: 6 }}><Receipt size={16} /> {t("gstNumber")}</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>{t("gstNote")}</div>
              <input className="tb-input" value={settings.gstNumber || ""} onChange={(e) => persistSettings({ ...settings, gstNumber: e.target.value })} />
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: COLORS.text, display: "flex", alignItems: "center", gap: 6 }}><Landmark size={16} /> {t("bankDetails")}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input className="tb-input" placeholder={t("accountHolder")} value={settings.bankDetails?.accountHolder || ""}
                  onChange={(e) => persistSettings({ ...settings, bankDetails: { ...settings.bankDetails, accountHolder: e.target.value } })} />
                <input className="tb-input" placeholder={t("bankName")} value={settings.bankDetails?.bankName || ""}
                  onChange={(e) => persistSettings({ ...settings, bankDetails: { ...settings.bankDetails, bankName: e.target.value } })} />
                <input className="tb-input" placeholder={t("accountNumber")} value={settings.bankDetails?.accountNumber || ""}
                  onChange={(e) => persistSettings({ ...settings, bankDetails: { ...settings.bankDetails, accountNumber: e.target.value } })} />
                <input className="tb-input" placeholder={t("ifsc")} value={settings.bankDetails?.ifsc || ""}
                  onChange={(e) => persistSettings({ ...settings, bankDetails: { ...settings.bankDetails, ifsc: e.target.value } })} />
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: "14px", padding: "18px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: COLORS.text }}>{t("addCoupon")}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <input className="tb-input" placeholder={t("code")} value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} style={{ flex: 1, minWidth: 100 }} />
                <select className="tb-input" value={couponForm.type} onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })} style={{ flex: 1, minWidth: 100 }}>
                  <option value="percent">{t("percent")}</option>
                  <option value="flat">{t("flat")}</option>
                </select>
                <input className="tb-input" type="number" placeholder={t("value")} value={couponForm.value} onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })} style={{ flex: 1, minWidth: 90 }} />
              </div>
              <button className="tb-focus" onClick={addCoupon} style={{ background: COLORS.accentYellow, border: "none", borderRadius: "8px", padding: "9px 16px", fontWeight: 700, cursor: "pointer" }}>
                + {t("addCoupon")}
              </button>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                {(settings.coupons || []).map((c) => (
                  <div key={c.code} style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.soft, borderRadius: 8, padding: "8px 12px" }}>
                    <strong style={{ color: COLORS.text }}>{c.code}</strong>
                    <span style={{ fontSize: 12, color: COLORS.muted }}>{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</span>
                    <div style={{ flex: 1 }} />
                    <button className="tb-focus" onClick={() => toggleCoupon(c.code)}
                      style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 999, border: "none", cursor: "pointer", background: c.active ? "#fff" : COLORS.softRed, color: c.active ? COLORS.dark : COLORS.accentRed }}>
                      {c.active ? t("active") : t("suspend")}
                    </button>
                    <button className="tb-focus" onClick={() => removeCoupon(c.code)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.accentRed }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "vendors" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {vendors.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "20px 0" }}>{t("noVendorsYet")}</div>}
            {vendors.map((v) => {
              const vProductSales = orders.reduce((sum, o) => {
                const mine = (o.items || []).filter((it) => it.sellerType === "vendor" && it.sellerId === v.id);
                return sum + mine.reduce((s, it) => s + it.price * it.qty, 0);
              }, 0);
              const vOrderCount = orders.filter((o) => (o.items || []).some((it) => it.sellerType === "vendor" && it.sellerId === v.id)).length;
              const vProductCount = products.filter((p) => p.ownerType === "vendor" && p.ownerId === v.id).length;
              return (
              <div key={v.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: COLORS.text }}>{v.shopName}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted }}>{v.ownerName} · {v.phone}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                      background: v.status === "active" ? COLORS.soft : v.status === "pending" ? "#FDF1DC" : COLORS.softRed,
                      color: v.status === "active" ? COLORS.dark : v.status === "pending" ? "#8A5A00" : COLORS.accentRed,
                    }}>
                      {t(v.status)}
                    </span>
                    {v.status !== "active" && (
                      <button className="tb-focus" onClick={() => setVendorStatus(v.id, "active")}
                        style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "none", background: COLORS.soft, color: COLORS.dark, cursor: "pointer" }}>
                        {t("approve")}
                      </button>
                    )}
                    {v.status !== "suspended" && (
                      <button className="tb-focus" onClick={() => setVendorStatus(v.id, "suspended")}
                        style={{ fontSize: 12, fontWeight: 600, padding: "6px 10px", borderRadius: 8, border: "none", background: COLORS.softRed, color: COLORS.accentRed, cursor: "pointer" }}>
                        {t("suspend")}
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: COLORS.muted, flexWrap: "wrap" }}>
                  <span>{t("mySales")}: ₹{vProductSales}</span>
                  <span>{t("totalOrders")}: {vOrderCount}</span>
                  <span>{t("products")}: {vProductCount}</span>
                </div>
              </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   DELIVERY BOY AUTH
========================================================= */
function DeliveryAuthGate({ deliveryBoys, onLoginSuccess, onBack }) {
  const { t } = useLang();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const doLogin = () => {
    const d = deliveryBoys.find((x) => x.phone === phone.trim() && x.password === password);
    if (!d) { setError(t("wrongPassword")); return; }
    if (!d.active) { setError(t("suspended")); return; }
    setError("");
    onLoginSuccess(d.id);
  };

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <FontLoader />
      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", width: "min(380px, 100%)" }}>
        <button className="tb-focus" onClick={onBack} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 6, color: COLORS.muted, cursor: "pointer", marginBottom: "14px", padding: 0 }}>
          <ChevronLeft size={18} /> {t("backToMarket")}
        </button>
        <div className="tb-display" style={{ fontSize: "22px", fontWeight: 700, color: COLORS.text, marginBottom: "16px" }}>{t("deliveryLogin")}</div>
        <label className="tb-label">{t("deliveryPhone")}</label>
        <input className="tb-focus tb-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" style={{ marginBottom: 12 }} />
        <label className="tb-label">{t("password")}</label>
        <input className="tb-focus tb-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doLogin()} style={{ marginBottom: 12 }} />
        {error && <div style={{ color: COLORS.accentRed, fontSize: 13, marginBottom: 10 }}>{error}</div>}
        <button className="tb-focus" onClick={doLogin} style={{ width: "100%", background: COLORS.dark, color: "#fff", border: "none", borderRadius: "10px", padding: "12px 0", fontWeight: 700, cursor: "pointer" }}>
          {t("login")}
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   DELIVERY BOY DASHBOARD
========================================================= */
function DeliveryDashboard({ deliveryBoy, orders, refreshOrders, onLogout }) {
  const { t, lang } = useLang();
  const myOrders = orders.filter((o) => o.deliveryBoyId === deliveryBoy.id);
  const delivered = myOrders.filter((o) => o.deliveryStatus === "delivered");
  const totalEarning = delivered.reduce((s, o) => s + (o.deliveryCommission || 0), 0);

  const updateStatus = async (orderId, status) => {
    try {
      const existing = await loadOrders();
      const next = existing.map((o) => (o.id === orderId ? { ...o, deliveryStatus: status } : o));
      await saveOrders(next);
      refreshOrders();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg }}>
      <FontLoader />
      <div style={{ background: COLORS.dark, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
          <Truck size={18} /> <span className="tb-display" style={{ fontWeight: 700 }}>{deliveryBoy.name}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <LangToggle />
          <button className="tb-focus" onClick={onLogout} style={{ background: COLORS.darkAlt, border: "none", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
            <LogOut size={14} /> {t("logout")}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "20px 20px 0", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ background: COLORS.dark, color: "#fff", borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t("myEarnings")}</div>
          <div className="tb-display" style={{ fontSize: 22, fontWeight: 700 }}>₹{totalEarning}</div>
        </div>
        <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12, color: COLORS.muted }}>{t("totalDelivered")}</div>
          <div className="tb-display" style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>{delivered.length}</div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px" }}>
        <button className="tb-focus" onClick={refreshOrders} style={{ marginBottom: 12, background: COLORS.soft, border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={14} /> {t("refresh")}
        </button>
        {myOrders.length === 0 && <div style={{ textAlign: "center", color: COLORS.muted, padding: "40px 0" }}>{t("noAssignedOrders")}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...myOrders].reverse().map((o) => (
            <div key={o.id} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: COLORS.text }}>#{o.id.slice(-5).toUpperCase()}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                  background: o.deliveryStatus === "delivered" ? COLORS.soft : o.deliveryStatus === "out_for_delivery" ? "#FDF1DC" : "#EAF1FB",
                  color: o.deliveryStatus === "delivered" ? COLORS.dark : o.deliveryStatus === "out_for_delivery" ? "#8A5A00" : "#2A5885",
                }}>{t(o.deliveryStatus)}</span>
              </div>
              <div style={{ fontSize: 14, color: COLORS.text }}>{o.name} · {o.phone}</div>
              <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>{o.address}</div>
              <MapLink address={o.address} lat={o.lat} lng={o.lng} />
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 8, color: COLORS.text }}>
                <span>{t("total")}</span><span>₹{o.total}</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {o.deliveryStatus === "assigned" && (
                  <button className="tb-focus" onClick={() => updateStatus(o.id, "out_for_delivery")}
                    style={{ flex: 1, background: COLORS.accentYellow, border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                    {t("markOutForDelivery")}
                  </button>
                )}
                {o.deliveryStatus === "out_for_delivery" && (
                  <button className="tb-focus" onClick={() => updateStatus(o.id, "delivered")}
                    style={{ flex: 1, background: COLORS.dark, color: "#fff", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                    {t("markDelivered")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ERROR BOUNDARY (shows a visible message instead of a blank page)
========================================================= */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", background: "#F5F6F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "sans-serif" }}>
          <div style={{ background: "#fff", border: "1px solid #E4E4D8", borderRadius: 14, padding: 22, maxWidth: 480 }}>
            <div style={{ fontWeight: 700, color: "#D64550", marginBottom: 8, fontSize: 16 }}>कुछ गड़बड़ हो गई / Something went wrong</div>
            <div style={{ fontSize: 13, color: "#1E2A22", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {String((this.state.error && this.state.error.message) || this.state.error)}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* =========================================================
   MAIN APP
========================================================= */
function AppInner() {
  const [lang, setLang] = useState("hi");
  const t = useCallback((key) => (DICT[lang] && DICT[lang][key]) || key, [lang]);
  const langCtx = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [products, setProducts] = useState([]);
  const [zones, setZones] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [settings, setSettings] = useState({
    defaultCommission: DEFAULT_COMMISSION, coupons: [], platformLogoUrl: "",
    platformName: "", gstNumber: "", platformUpiId: "",
    freeDeliveryAbove: 200, deliveryCharge: 25,
    bankDetails: { accountHolder: "", accountNumber: "", ifsc: "", bankName: "" },
  });

  const [view, setView] = useState("home");
  const [loggedVendorId, setLoggedVendorId] = useState(null);
  const [loggedDistributorId, setLoggedDistributorId] = useState(null);
  const [loggedDeliveryBoyId, setLoggedDeliveryBoyId] = useState(null);

  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [p, z, dist, v, s, db] = await Promise.all([
          loadProducts(), loadZones(), loadDistributors(), loadVendors(), loadSettings(), loadDeliveryBoys(),
        ]);
        setProducts(p);
        setZones(z);
        setDistributors(dist);
        setVendors(v);
        setSettings(s);
        setDeliveryBoys(db);
      } catch (e) {
        console.error(e);
        setLoadError(true);
        setProducts(SEED_PRODUCTS);
        setZones(SEED_ZONES);
      }
      setLoading(false);
    })();
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const o = await loadOrders();
      setOrders(o);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (view === "adminDash" || view === "distributorDash" || view === "deliveryDash") refreshOrders();
  }, [view, refreshOrders]);

  const inc = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const dec = (id) => setCart((c) => {
    const next = { ...c };
    if ((next[id] || 0) <= 1) delete next[id];
    else next[id] -= 1;
    return next;
  });
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((x) => x.id === id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const loggedVendor = vendors.find((v) => v.id === loggedVendorId);
  const loggedDistributor = distributors.find((d) => d.id === loggedDistributorId);
  const loggedDeliveryBoy = deliveryBoys.find((d) => d.id === loggedDeliveryBoyId);

  const handlePlaceOrder = async (customer) => {
    setSubmitting(true);
    const items = Object.entries(cart).map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      return p ? { id: p.id, name: p.name, price: p.price, unit: p.unit, qty, sellerType: p.ownerType || "admin", sellerId: p.ownerId || null } : null;
    }).filter(Boolean);
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const productTotal = Math.max(0, subtotal - (customer.discount || 0));
    const deliveryCharge = customer.deliveryCharge || 0;
    const total = productTotal + deliveryCharge;

    const distributor = distributors.find((d) => d.zoneId === customer.zoneId && d.status === "active");
    const distributorId = distributor ? distributor.id : null;
    // Distributor commission is based on product sales only, not the delivery charge
    const distributorCommission = distributor
      ? (distributor.commissionType === "percent" ? Math.round((productTotal * distributor.commissionValue) / 100) : distributor.commissionValue)
      : 0;

    const order = {
      id: uid("ord"), ...customer, items, subtotal, productTotal, total,
      distributorId, distributorCommission,
      deliveryBoyId: null, deliveryStatus: "placed", deliveryCommission: 0,
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = await loadOrders();
      await saveOrders([...existing, order]);
    } catch (e) { console.error("Order save failed", e); }
    setSubmitting(false);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCart({});
    setConfirmedOrder(order);
  };

  const registerVendor = async (newVendor) => {
    const next = [...vendors, newVendor];
    setVendors(next);
    try { await saveVendors(next); } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="tb-root" style={{ minHeight: "100vh", background: COLORS.bg }}>
        <FontLoader />
        <Spinner />
      </div>
    );
  }

  return (
    <LangContext.Provider value={langCtx}>
      {view === "home" && (
        <>
          <Storefront
            products={products}
            cart={cart}
            onInc={inc}
            onDec={dec}
            cartCount={cartCount}
            onCartClick={() => setCartOpen(true)}
            platformLogoUrl={settings.platformLogoUrl}
            platformName={settings.platformName}
            onVendorLogin={() => setView("vendorAuth")}
            onAdminLogin={() => setView("adminAuth")}
            onDistributorLogin={() => setView("distributorAuth")}
          />
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            products={products}
            onInc={inc}
            onDec={dec}
            onCheckout={() => setCheckoutOpen(true)}
          />
          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            onSubmit={handlePlaceOrder}
            submitting={submitting}
            cartTotal={cartTotal}
            platformUpiId={settings.platformUpiId}
            payeeName={settings.platformName || "Taaza Bazaar"}
            zones={zones}
            freeDeliveryAbove={settings.freeDeliveryAbove}
            deliveryCharge={settings.deliveryCharge}
          />
          {confirmedOrder && <OrderConfirmation order={confirmedOrder} onClose={() => setConfirmedOrder(null)} />}
        </>
      )}

      {view === "vendorAuth" && (
        <VendorAuthGate
          vendors={vendors}
          onBack={() => setView("home")}
          onRegister={registerVendor}
          onLoginSuccess={(id) => { setLoggedVendorId(id); setView("vendorDash"); }}
        />
      )}

      {view === "vendorDash" && loggedVendor && (
        <VendorDashboard vendor={loggedVendor} products={products} setProducts={setProducts} orders={orders} onLogout={() => { setLoggedVendorId(null); setView("home"); }} />
      )}

      {view === "distributorAuth" && (
        <DistributorAuthGate
          distributors={distributors}
          onBack={() => setView("home")}
          onLoginSuccess={(id) => { setLoggedDistributorId(id); setView("distributorDash"); }}
        />
      )}

      {view === "distributorDash" && loggedDistributor && (
        <DistributorDashboard
          distributor={loggedDistributor}
          zones={zones}
          orders={orders}
          deliveryBoys={deliveryBoys}
          products={products}
          setProducts={setProducts}
          refreshOrders={refreshOrders}
          defaultCommission={settings.defaultCommission}
          onLogout={() => { setLoggedDistributorId(null); setView("home"); }}
        />
      )}

      {view === "adminAuth" && (
        <AdminAuthGate onBack={() => setView("home")} onSuccess={() => setView("adminDash")} />
      )}

      {view === "adminDash" && (
        <AdminDashboard
          products={products} setProducts={setProducts}
          zones={zones} setZones={setZones}
          distributors={distributors} setDistributors={setDistributors}
          orders={orders} setOrders={setOrders}
          refreshOrders={refreshOrders}
          settings={settings} setSettings={setSettings}
          deliveryBoys={deliveryBoys} setDeliveryBoys={setDeliveryBoys}
          vendors={vendors} setVendors={setVendors}
          onLogout={() => setView("home")}
        />
      )}

      {view === "deliveryAuth" && (
        <DeliveryAuthGate
          deliveryBoys={deliveryBoys}
          onBack={() => setView("home")}
          onLoginSuccess={(id) => { setLoggedDeliveryBoyId(id); setView("deliveryDash"); }}
        />
      )}

      {view === "deliveryDash" && loggedDeliveryBoy && (
        <DeliveryDashboard
          deliveryBoy={loggedDeliveryBoy}
          orders={orders}
          refreshOrders={refreshOrders}
          onLogout={() => { setLoggedDeliveryBoyId(null); setView("home"); }}
        />
      )}
    </LangContext.Provider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
