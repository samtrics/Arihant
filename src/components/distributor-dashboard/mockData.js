export const partnerProfile = {
  businessName: "Patel Provision Store",
  ownerName: "Rajesh Patel",
  partnerId: "DIS-001",
  tier: "Gold Partner",
  discountPercent: 15,
  phone: "+91 98765 43210",
  email: "rajesh.patel@example.com",
  gst: "22AAAAA0000A1Z5",
  address: "123 Market Road, Surat, Gujarat 395003",
  avatar: "RP"
};

export const dashboardStats = {
  totalOrders: 42,
  monthlyPurchases: "₹2,45,000",
  pendingDeliveries: 3,
  totalEarnings: "₹85,500",
  activeProducts: 120,
  currentDiscount: "15%"
};

export const mockNotifications = [
  { id: 1, type: "order", title: "Order Shipped", text: "Order #ORD-9562 has been shipped and is on the way.", date: "Today, 10:30 AM", read: false },
  { id: 2, type: "offer", title: "Seasonal Offer", text: "Get an extra 5% margin on all Premium Maida bulk orders this week!", date: "Yesterday, 2:15 PM", read: true },
  { id: 3, type: "inventory", title: "Low Stock Alert", text: "Sharbati Atta (25kg) is running low in your local warehouse.", date: "May 18, 2026", read: true },
];

export const mockOrders = [
  { id: "ORD-9562", date: "2026-05-20", amount: "₹85,200", status: "In Transit", items: 2 },
  { id: "ORD-9345", date: "2026-04-28", amount: "₹1,12,500", status: "Delivered", items: 5 },
  { id: "ORD-9201", date: "2026-04-12", amount: "₹45,000", status: "Delivered", items: 1 },
  { id: "ORD-9011", date: "2026-03-22", amount: "₹67,800", status: "Delivered", items: 3 },
  { id: "ORD-8850", date: "2026-03-05", amount: "₹34,200", status: "Delivered", items: 2 },
];

export const monthlyRevenueData = [
  { name: 'Jan', revenue: 150000, profit: 22500 },
  { name: 'Feb', revenue: 180000, profit: 27000 },
  { name: 'Mar', revenue: 210000, profit: 31500 },
  { name: 'Apr', revenue: 190000, profit: 28500 },
  { name: 'May', revenue: 245000, profit: 36750 },
];

export const productDemandData = [
  { name: 'Flours', value: 45 },
  { name: 'Pulses', value: 25 },
  { name: 'Spices', value: 15 },
  { name: 'Rice', value: 15 },
];

export const inventoryData = [
  { id: "INV-01", name: "Sharbati Atta", sku: "WHT-SHR-05", stock: 150, status: "High Stock", warehouse: "Surat Central" },
  { id: "INV-02", name: "Chana Besan", sku: "PLS-BSN-10", stock: 12, status: "Low Stock", warehouse: "Surat Central" },
  { id: "INV-03", name: "Roasted Daliya", sku: "WHT-DAL-01", stock: 0, status: "Out of Stock", warehouse: "Ahmedabad Hub" },
  { id: "INV-04", name: "Premium Maida", sku: "WHT-MDA-50", stock: 320, status: "High Stock", warehouse: "Surat Central" },
];
