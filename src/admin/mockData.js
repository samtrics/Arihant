// ══════════════════════════════════════════════════
// ARIHANT ADMIN PANEL — MOCK DATA
// ══════════════════════════════════════════════════

// ── Revenue & Analytics Charts ──────────────────
export const revenueData = [
  { month: "Jun '25", revenue: 285000, orders: 145, customers: 89 },
  { month: "Jul '25", revenue: 312000, orders: 162, customers: 98 },
  { month: "Aug '25", revenue: 298000, orders: 155, customers: 92 },
  { month: "Sep '25", revenue: 345000, orders: 178, customers: 112 },
  { month: "Oct '25", revenue: 388000, orders: 195, customers: 128 },
  { month: "Nov '25", revenue: 421000, orders: 214, customers: 145 },
  { month: "Dec '25", revenue: 498000, orders: 248, customers: 168 },
  { month: "Jan '26", revenue: 375000, orders: 189, customers: 135 },
  { month: "Feb '26", revenue: 402000, orders: 205, customers: 148 },
  { month: "Mar '26", revenue: 445000, orders: 228, customers: 162 },
  { month: "Apr '26", revenue: 478000, orders: 241, customers: 178 },
  { month: "May '26", revenue: 524000, orders: 267, customers: 195 },
];

export const productSalesData = [
  { name: "Sharbati Atta", value: 35, color: "#1F5132" },
  { name: "Chana Besan", value: 22, color: "#D4A64A" },
  { name: "Roasted Daliya", value: 18, color: "#2d6b45" },
  { name: "Fine Suji", value: 14, color: "#c49030" },
  { name: "Premium Maida", value: 11, color: "#417a58" },
];

export const orderStatusData = [
  { name: "Delivered", value: 58, color: "#10b981" },
  { name: "Shipped", value: 18, color: "#3b82f6" },
  { name: "Processing", value: 14, color: "#f59e0b" },
  { name: "Pending", value: 7, color: "#8b5cf6" },
  { name: "Cancelled", value: 3, color: "#ef4444" },
];

// ── Products ────────────────────────────────────
export const initialProducts = [
  { id: "PRD001", name: "Sharbati Atta", sku: "ARI-ATT-SHB-5", category: "Flours (Atta)", price: 549, offerPrice: 499, stock: 1240, weight: "5kg", status: "active", tags: ["premium", "bestseller"], emoji: "🌾", desc: "Stone-ground, 100% Whole Wheat from Sehore",
    tag: "PREMIUM WHEAT", brandTag: "HERITAGE GOLD", featured: true, bestseller: true, overlayTitle: "Purely Sourced, Freshly Packed", hasDetails: true,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFlXi6HM0fZPoImdBCxmwfUUVxmyOoErebMN2pWSCYkW2pIHEV9qt56AjLKYXHO3Ax8ygC-ilWK-tSgH14n1oynPDSQce4kWfiUp3glpd8bC5JrMKL6KSXq_SGh8Mj91fV781JMSxKiuMSkd3AuZ3YlrPlYeJG4Lm_2x-C86VFoinEL1-zrhvHjxVAusT3XomBbaNCjwlnamTf-u3mey3mKibDGMJwGWsQdakDt5qF155N-MSgf7xXAgrCkQqwrQph5QCZAiuY1DI",
    imgAlt: "Sharbati Atta", dataAlt: "A high-end editorial product shot of a premium Sharbati Atta flour sack, placed on a rustic wooden surface with a handful of golden wheat grains scattered around.",
    organic: false, heritage: true, bulk: false, icon: "add_shopping_cart" },
  { id: "PRD002", name: "Chana Besan", sku: "ARI-BSN-CHN-1", category: "Flours (Atta)", price: 125, offerPrice: 115, stock: 850, weight: "1kg", status: "active", tags: ["gram flour"], emoji: "🟡", desc: "Triple-sieved for extra fine texture",
    tag: "GRAM FLOUR", featured: true, bestseller: false, overlayTitle: "The Secret to Perfect Snacks", hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYlrFsgmD9lQFPpq2FUTquel45pepN70m1HPPr43zJzRObELoBCjVT21oVVSUaLOyr2-YVz_zI4qOkqJsHXoNwt8PGsLbyd6q4L3v7vGGDMrqC4O306dfSwKe5M_TjX9wSeFdhDvc6VaA2bMghFtnPkLvW1siGN29uRBZlM90jtiqOQJhSVjLdX2qfJWZRKsbjd5pf0V84srH5CKlmcV3FttTzF_HPIsno0HzSXwNZZ6ITfc6q7mmwdQfD3pjFoEWGWBUo__DLXOk",
    imgAlt: "Chana Besan", dataAlt: "A macro studio photograph of fine, yellow Chana Besan flour spilling from a ceramic bowl.",
    organic: false, heritage: true, bulk: false, icon: "add_shopping_cart" },
  { id: "PRD003", name: "Roasted Daliya", sku: "ARI-DAL-RST-5", category: "Roasted Daliya", price: 85, offerPrice: 75, stock: 62, weight: "500g", status: "active", tags: ["health", "breakfast"], emoji: "🌿", desc: "Slow-roasted broken wheat for wellness",
    tag: "HEALTH STAPLE", featured: true, bestseller: false, overlayTitle: "Nutritious Daily Breakfast", hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7YHG5xGwLVNRidsIt-0Rac2nDzpCrSiPW6uXVGdN7SxEpj_DBPTZva00-U6UWq1TKaGW5Rahjigy6Q_vQO-WFVsHbW2SMgunKsHDFO3zieUzbxJwB2Qa4QINXYSfTns61K695ntnUiwCJH9SFpIrQL7fijv1-uXaoKkVIxrszM_zfU6ftE78p0WQg8c5sHwYJcmtP6QVgqcRIjreTOfaRIeQz7989v69f1HM1XIB2rv6Kw86_kCpXKqYrdOG4vVUcwsJKJnrCEUo",
    imgAlt: "Roasted Daliya", dataAlt: "A top-down editorial shot of golden roasted wheat daliya in a handcrafted wooden bowl.",
    organic: false, heritage: true, bulk: false, icon: "add_shopping_cart" },
  { id: "PRD004", name: "Fine Suji", sku: "ARI-SJI-FNE-1", category: "Flours (Atta)", price: 95, offerPrice: null, stock: 435, weight: "1kg", status: "active", tags: ["semolina"], emoji: "⚡", desc: "Baking-grade fine semolina",
    tag: "NATURAL", featured: false, bestseller: false, overlayTitle: "", hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuClZGVP5P_8Nkn67GJ0rNsnYou8hHr_iWAE_qBMMpB538zcszRuOZjpiM4rzPPlYpEbxi2CfiKJCIIlGRBhmxob7rkcx9G----Kk_s3V4BBQ6ySuhxs51JV7YJDX4b9aSpEuqiEktPTB0N_cR80k4sMsFFrJ1BlvmUR6oQq7e6YMWnA3Edf1csV2BiwiCm9Oz8ncDBgE_U127ZQba4BtPIpTexwkCYILtvvMBUwNdfNOMb2jLSVK78vs0Dxn6uK4wUiqazXJeLT5Gw",
    imgAlt: "Fine Suji", dataAlt: "Macro shot of granulated semolina or Suji grains piled on a textured ceramic plate.",
    organic: false, heritage: true, bulk: false, icon: "add_shopping_cart" },
  { id: "PRD005", name: "Premium Maida", sku: "ARI-MDA-PRM-1", category: "Flours (Atta)", price: 65, offerPrice: null, stock: 18, weight: "1kg", status: "active", tags: ["refined"], emoji: "❄️", desc: "Baking-grade super-refined white flour",
    tag: "FINE", featured: false, bestseller: false, overlayTitle: "", hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUQlZgUtRPY21eJe44pA_jRVtSlm9DSGA199y3f8Dlrx-96iZcxqDPHrAFakPgFQQCntsp1Mn9uvTlYPRy3sw6IaOPHS5k5lO_OkjJLd241KWQmW3FBk3s2PAF0vbpZK2mhCbg2iYEMFp73zom3AjprWfsk-yJX_Y1kMzA0C79IIl6B2eml11EKWwzTaFgBxrwSgDatSisi-iv7jfSLW8uYDzfJAgAKFWVWtoWVElKuLLCV1yeJcqJYHRedkUtjAn4Igz3FcbxpNs",
    imgAlt: "Premium Maida", dataAlt: "An elegant presentation of pure white maida flour on a marble surface.",
    organic: false, heritage: true, bulk: false, icon: "add_shopping_cart" },
  { id: "PRD006", name: "Multigrain Atta", sku: "ARI-ATT-MUL-5", category: "Flours (Atta)", price: 420, offerPrice: 385, stock: 220, weight: "5kg", status: "active", tags: ["health", "organic"], emoji: "🌾", desc: "9-Grain power blend for high fiber",
    tag: "HEALTH BLEND", featured: false, bestseller: false, overlayTitle: "", hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkYx8ICd9lnc23xJC6wHeeRUj4AZGOaz6GIWTjdlxox5LWaEkGkwR6ZfCzdkc53OA9wjER8H0uBWK7naWWk1hXFrlDz95HOYD1sk5vedfWkS5qFUAQY4dj6WFHmAL7CCWhcFPO0jLTFUcoWAdzdyTsE1wbviSgC9foVk0dIxCkmAgthWEtLqI9vDyPuvL3BHodI_zL00IcU2Lofw_AYzZfiLX5x3jiu0Mbx4x4JJNFZFyaVpI2io_i6TSxixosVWIAbVI5mVA6bnQ",
    imgAlt: "Multigrain Atta", dataAlt: "A diverse arrangement of different grains blending into a rich, textured multigrain flour.",
    organic: true, heritage: true, bulk: false, icon: "add_shopping_cart" },
  { id: "PRD007", name: "Missi Atta", sku: "ARI-ATT-MIS-1", category: "Flours (Atta)", price: 180, offerPrice: null, stock: 0, weight: "1kg", status: "inactive", tags: ["traditional"], emoji: "🌾", desc: "Gram & Wheat blend with aromatic spices",
    tag: "TRADITIONAL", featured: false, bestseller: false, overlayTitle: "", hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9qcenzscxdgorF5458DN07v1c4dG5glxe24ngRVIzNmVwlQp-iwf9hOHeMNrDUeGUY8vdyp5hlpNE4ZLLkr1J5rSKEYTtMslVmEYIGh4s-ceqy3vl8xgw6TtMmUzXXkR8rQ3WUAjmaDBq2dnO8NxcFK0SUM9s5sZiDIneHkWq2TwJA9otXlD5dyKTXy-dGeCtebWKUkf44hU1u45N4T0V8lrl8fecsib-pY9bgxYES7Yye40emSBnAyWs-hdSi2i4Vwk_LZ0jNBg",
    imgAlt: "Missi Atta", dataAlt: "A warm, inviting studio photograph showcasing Missi Atta.",
    organic: false, heritage: true, bulk: false, icon: "add_shopping_cart" },
  { id: "PRD008", name: "Brown Rice", sku: "ARI-RCE-BRN-1", category: "Rice Varieties", price: 145, offerPrice: 130, stock: 310, weight: "1kg", status: "active", tags: ["health", "rice"], emoji: "🍚", desc: "Unpolished, nutrient-rich brown rice",
    tag: "HEALTHY GRAIN", featured: false, bestseller: false, overlayTitle: "", hasDetails: false,
    imgSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7YHG5xGwLVNRidsIt-0Rac2nDzpCrSiPW6uXVGdN7SxEpj_DBPTZva00-U6UWq1TKaGW5Rahjigy6Q_vQO-WFVsHbW2SMgunKsHDFO3zieUzbxJwB2Qa4QINXYSfTns61K695ntnUiwCJH9SFpIrQL7fijv1-uXaoKkVIxrszM_zfU6ftE78p0WQg8c5sHwYJcmtP6QVgqcRIjreTOfaRIeQz7989v69f1HM1XIB2rv6Kw86_kCpXKqYrdOG4vVUcwsJKJnrCEUo",
    imgAlt: "Brown Rice", dataAlt: "A bowl of healthy brown rice.",
    organic: false, heritage: false, bulk: true, icon: "add_shopping_cart" },
];

// ── Orders ──────────────────────────────────────
export const initialOrders = [
  { id: "ORD-001", customer: "Ramesh Kumar", email: "ramesh@example.com", phone: "9876543210", date: "2026-05-20", amount: 1097, status: "delivered", items: 3, payment: "paid", city: "Jaipur", products: ["Sharbati Atta", "Chana Besan", "Fine Suji"] },
  { id: "ORD-002", customer: "Priya Sharma", email: "priya@example.com", phone: "9765432109", date: "2026-05-21", amount: 549, status: "shipped", items: 1, payment: "paid", city: "Mumbai", products: ["Sharbati Atta"] },
  { id: "ORD-003", customer: "Anil Mehta", email: "anil@example.com", phone: "9654321098", date: "2026-05-21", amount: 295, status: "processing", items: 2, payment: "paid", city: "Ahmedabad", products: ["Chana Besan", "Fine Suji"] },
  { id: "ORD-004", customer: "Sunita Rao", email: "sunita@example.com", phone: "9543210987", date: "2026-05-22", amount: 840, status: "pending", items: 4, payment: "pending", city: "Pune", products: ["Sharbati Atta", "Multigrain Atta"] },
  { id: "ORD-005", customer: "Mohammed Iqbal", email: "iqbal@example.com", phone: "9432109876", date: "2026-05-19", amount: 195, status: "cancelled", items: 1, payment: "refunded", city: "Bhopal", products: ["Roasted Daliya"] },
  { id: "ORD-006", customer: "Geeta Patel", email: "geeta@example.com", phone: "9321098765", date: "2026-05-18", amount: 1638, status: "delivered", items: 5, payment: "paid", city: "Surat", products: ["Sharbati Atta", "Chana Besan", "Fine Suji", "Multigrain Atta"] },
  { id: "ORD-007", customer: "Vijay Singh", email: "vijay@example.com", phone: "9210987654", date: "2026-05-22", amount: 760, status: "pending", items: 3, payment: "pending", city: "Delhi", products: ["Multigrain Atta", "Brown Rice"] },
  { id: "ORD-008", customer: "Kavita Joshi", email: "kavita@example.com", phone: "9109876543", date: "2026-05-17", amount: 510, status: "shipped", items: 2, payment: "paid", city: "Indore", products: ["Roasted Daliya", "Fine Suji"] },
  { id: "ORD-009", customer: "Rajesh Gupta", email: "rajesh@example.com", phone: "9987654321", date: "2026-05-16", amount: 2190, status: "delivered", items: 6, payment: "paid", city: "Kolkata", products: ["Sharbati Atta", "Multigrain Atta", "Brown Rice"] },
  { id: "ORD-010", customer: "Nisha Verma", email: "nisha@example.com", phone: "9876543211", date: "2026-05-22", amount: 385, status: "processing", items: 2, payment: "paid", city: "Chennai", products: ["Chana Besan", "Roasted Daliya"] },
  { id: "ORD-011", customer: "Deepak Sharma", email: "deepak@example.com", phone: "9876500000", date: "2026-05-22", amount: 1249, status: "pending", items: 3, payment: "pending", city: "Jaipur", products: ["Sharbati Atta", "Fine Suji"] },
  { id: "ORD-012", customer: "Anita Yadav", email: "anita@example.com", phone: "9865412300", date: "2026-05-15", amount: 630, status: "delivered", items: 2, payment: "paid", city: "Nagpur", products: ["Brown Rice", "Multigrain Atta"] },
];

export const initialB2BOrders = [
  { id: "B2B-9562", distributorId: "DIS001", customer: "Krishna Traders", city: "Surat", date: "2026-05-20", items: 2, amount: 85200, status: "processing", payment: "pending", amountPaid: 0, products: [{ name: "Premium Maida", qty: 50, price: 1200, total: 60000 }, { name: "Sharbati Atta", qty: 30, price: 840, total: 25200 }] },
  { id: "B2B-9345", distributorId: "DIS004", customer: "Gujarat Staples", city: "Ahmedabad", date: "2026-04-28", items: 1, amount: 112500, status: "delivered", payment: "paid", amountPaid: 112500, products: [{ name: "Chana Besan", qty: 100, price: 1125, total: 112500 }] },
];

// ── Customers ────────────────────────────────────
export const initialCustomers = [
  { id: "CUS001", name: "Ramesh Kumar", email: "ramesh@example.com", phone: "9876543210", city: "Jaipur", state: "Rajasthan", orders: 12, spent: 14820, joined: "2025-01-15", status: "active" },
  { id: "CUS002", name: "Priya Sharma", email: "priya@example.com", phone: "9765432109", city: "Mumbai", state: "Maharashtra", orders: 8, spent: 9640, joined: "2025-02-20", status: "active" },
  { id: "CUS003", name: "Anil Mehta", email: "anil@example.com", phone: "9654321098", city: "Ahmedabad", state: "Gujarat", orders: 5, spent: 4250, joined: "2025-03-10", status: "active" },
  { id: "CUS004", name: "Sunita Rao", email: "sunita@example.com", phone: "9543210987", city: "Pune", state: "Maharashtra", orders: 3, spent: 2100, joined: "2025-04-05", status: "active" },
  { id: "CUS005", name: "Mohammed Iqbal", email: "iqbal@example.com", phone: "9432109876", city: "Bhopal", state: "M.P.", orders: 15, spent: 18500, joined: "2024-11-20", status: "blocked" },
  { id: "CUS006", name: "Geeta Patel", email: "geeta@example.com", phone: "9321098765", city: "Surat", state: "Gujarat", orders: 22, spent: 28900, joined: "2024-10-15", status: "active" },
  { id: "CUS007", name: "Vijay Singh", email: "vijay@example.com", phone: "9210987654", city: "Delhi", state: "Delhi", orders: 7, spent: 7840, joined: "2025-01-08", status: "active" },
  { id: "CUS008", name: "Kavita Joshi", email: "kavita@example.com", phone: "9109876543", city: "Indore", state: "M.P.", orders: 4, spent: 3200, joined: "2025-05-01", status: "active" },
  { id: "CUS009", name: "Rajesh Gupta", email: "rajesh@example.com", phone: "9987654321", city: "Kolkata", state: "W.B.", orders: 18, spent: 22400, joined: "2024-09-15", status: "active" },
  { id: "CUS010", name: "Nisha Verma", email: "nisha@example.com", phone: "9876543211", city: "Chennai", state: "Tamil Nadu", orders: 2, spent: 780, joined: "2026-04-20", status: "active" },
];

// ── Distributors ─────────────────────────────────
export const initialDistributors = [
  { id: "DIS001", business: "Patel Provision Store", owner: "Rajesh Patel", phone: "9876543210", email: "rajesh@patelprovision.com", city: "Surat", state: "Gujarat", gst: "24AAECP1234F1Z5", address: "12, Main Market Road", bizType: "Kirana / Grocery Store", years: "10+ Years", applied: "2026-05-18", status: "approved", orders: 12, revenue: 450000 },
  { id: "DIS002", business: "Sharma Supermart", owner: "Amit Sharma", phone: "9876543211", email: "amit.sharma@gmail.com", city: "Ahmedabad", state: "Gujarat", gst: "24BBEPS5678G1Z2", address: "45, CG Road", bizType: "Retail Chain", years: "5–10 Years", applied: "2026-05-20", status: "pending", orders: 0, revenue: 0 },
  { id: "DIS003", business: "Gupta Traders", owner: "Sanjay Gupta", phone: "9876543212", email: "gupta.traders@yahoo.com", city: "Vadodara", state: "Gujarat", gst: "24CCFPG9012H1Z8", address: "Phase 2, GIDC", bizType: "General Trade Distributor", years: "3–5 Years", applied: "2026-05-21", status: "rejected", orders: 0, revenue: 0 },
  { id: "DIS004", business: "Gujarat Staples Co.", owner: "Vikram Desai", phone: "9876543213", email: "vikram@gujaratstaples.in", city: "Rajkot", state: "Gujarat", gst: "24DDFPJ3456K1Z9", address: "Ring Road Circle", bizType: "Modern Trade Partner", years: "10+ Years", applied: "2026-05-10", status: "approved", orders: 34, revenue: 1250000 },
];

// ── Inventory ────────────────────────────────────
export const inventoryData = [
  { id: "PRD001", name: "Sharbati Atta", sku: "ARI-ATT-SHB-5", category: "Flours", stock: 1240, minStock: 200, unit: "bags", lastUpdated: "2026-05-20", warehouse: "Jaipur WH1", value: 619760, trend: "stable" },
  { id: "PRD002", name: "Chana Besan", sku: "ARI-BSN-CHN-1", category: "Flours", stock: 850, minStock: 150, unit: "bags", lastUpdated: "2026-05-19", warehouse: "Jaipur WH1", value: 97750, trend: "up" },
  { id: "PRD003", name: "Roasted Daliya", sku: "ARI-DAL-RST-5", category: "Daliya", stock: 62, minStock: 100, unit: "packets", lastUpdated: "2026-05-18", warehouse: "Ahmedabad WH2", value: 4650, trend: "down" },
  { id: "PRD004", name: "Fine Suji", sku: "ARI-SJI-FNE-1", category: "Flours", stock: 435, minStock: 80, unit: "packets", lastUpdated: "2026-05-21", warehouse: "Jaipur WH1", value: 41325, trend: "stable" },
  { id: "PRD005", name: "Premium Maida", sku: "ARI-MDA-PRM-1", category: "Flours", stock: 18, minStock: 100, unit: "packets", lastUpdated: "2026-05-22", warehouse: "Mumbai WH3", value: 1170, trend: "down" },
  { id: "PRD006", name: "Multigrain Atta", sku: "ARI-ATT-MUL-5", category: "Flours", stock: 220, minStock: 60, unit: "bags", lastUpdated: "2026-05-20", warehouse: "Jaipur WH1", value: 84700, trend: "up" },
  { id: "PRD007", name: "Missi Atta", sku: "ARI-ATT-MIS-1", category: "Flours", stock: 0, minStock: 50, unit: "bags", lastUpdated: "2026-05-15", warehouse: "Jaipur WH1", value: 0, trend: "down" },
  { id: "PRD008", name: "Brown Rice", sku: "ARI-RCE-BRN-1", category: "Rice", stock: 310, minStock: 70, unit: "bags", lastUpdated: "2026-05-22", warehouse: "Surat WH4", value: 40300, trend: "stable" },
];

// ── Notifications ────────────────────────────────
export const notificationsData = [
  { id: 1, type: "order", title: "New Order Received", message: "Order #ORD-011 from Deepak Sharma — ₹1,249", time: "2 min ago", read: false },
  { id: 2, type: "inventory", title: "Low Stock Alert", message: "Premium Maida stock critically low (18 units)", time: "15 min ago", read: false },
  { id: 3, type: "distributor", title: "New Distributor Application", message: "Rajputana Traders from Jodhpur has applied", time: "1 hr ago", read: false },
  { id: 4, type: "order", title: "Order Delivered", message: "Order #ORD-009 marked as delivered by logistics", time: "2 hr ago", read: true },
  { id: 5, type: "inventory", title: "Out of Stock Alert", message: "Missi Atta is now completely out of stock", time: "3 hr ago", read: true },
  { id: 6, type: "review", title: "New 5-Star Review", message: "Priya S. left a 5-star review on Sharbati Atta", time: "5 hr ago", read: true },
  { id: 7, type: "order", title: "Order Cancelled", message: "Order #ORD-005 cancelled by customer Iqbal", time: "1 day ago", read: true },
  { id: 8, type: "distributor", title: "Distributor Onboarded", message: "Gujarat Staples approved & onboarded successfully", time: "2 days ago", read: true },
];

// ── Coupons ──────────────────────────────────────
export const initialCoupons = [
  { id: "CPN001", code: "ARIHANT10", type: "percentage", value: 10, minOrder: 500, maxDiscount: 100, usage: 145, maxUsage: 500, expiry: "2026-06-30", status: "active" },
  { id: "CPN002", code: "FLAT50", type: "flat", value: 50, minOrder: 300, maxDiscount: 50, usage: 89, maxUsage: 200, expiry: "2026-05-31", status: "active" },
  { id: "CPN003", code: "NEWUSER20", type: "percentage", value: 20, minOrder: 400, maxDiscount: 150, usage: 234, maxUsage: 1000, expiry: "2026-07-31", status: "active" },
  { id: "CPN004", code: "SUMMER15", type: "percentage", value: 15, minOrder: 600, maxDiscount: 200, usage: 500, maxUsage: 500, expiry: "2026-04-30", status: "expired" },
  { id: "CPN005", code: "BULK100", type: "flat", value: 100, minOrder: 1000, maxDiscount: 100, usage: 22, maxUsage: 100, expiry: "2026-08-31", status: "active" },
];

// ── Admin Users ───────────────────────────────────
export const initialAdminUsers = [
  { id: "ADM001", name: "Super Admin", email: "admin@arihant.in", role: "super_admin", roleLabel: "Super Admin", permissions: "All Access", lastLogin: "Today, 06:30 AM", status: "active", avatar: "SA" },
  { id: "ADM002", name: "Rohit Sharma", email: "rohit.sharma@arihant.in", role: "product_manager", roleLabel: "Product Manager", permissions: "Products, Categories, Inventory", lastLogin: "Yesterday, 2:15 PM", status: "active", avatar: "RS" },
  { id: "ADM003", name: "Kavita Patel", email: "kavita.patel@arihant.in", role: "inventory_manager", roleLabel: "Inventory Manager", permissions: "Inventory, Products (view)", lastLogin: "2 days ago, 11:45 AM", status: "active", avatar: "KP" },
  { id: "ADM004", name: "Arjun Mehta", email: "arjun.mehta@arihant.in", role: "distributor_manager", roleLabel: "Distributor Manager", permissions: "Distributors, Orders (view)", lastLogin: "3 days ago, 9:30 AM", status: "inactive", avatar: "AM" },
];
