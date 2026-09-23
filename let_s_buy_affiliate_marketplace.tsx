import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  increment 
} from 'firebase/firestore';
import { 
  ShoppingBag, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Lock, 
  LogOut, 
  Info, 
  Sparkles, 
  TrendingUp, 
  Tag, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Globe, 
  Smartphone, 
  HelpCircle,
  Eye,
  Filter,
  User,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  DollarSign,
  Copy,
  Check,
  Share2,
  ChevronRight,
  Store,
  Layers,
  BarChart3,
  Flame,
  Home,
  Compass,
  Link2,
  CheckCircle,
  UserCheck
} from 'lucide-react';

// Firebase Configuration Setup
let firebaseApp = null;
let auth = null;
let db = null;
let appId = 'lets-buy-affiliate-v2';

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const firebaseConfig = JSON.parse(__firebase_config);
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
  }
  if (typeof __app_id !== 'undefined' && __app_id) {
    appId = __app_id;
  }
} catch (e) {
  console.warn("Firebase config fallback to local state mode:", e);
}

// Supported Platform Configuration with Color Codes & Badges
const SHOPPING_PLATFORMS = [
  { id: 'Shopee', name: 'Shopee', color: 'bg-orange-500 text-white', badge: 'from-orange-500 to-amber-500', domain: 'shopee.com' },
  { id: 'TikTok Shop', name: 'TikTok Shop', color: 'bg-slate-900 text-white', badge: 'from-slate-900 to-slate-800', domain: 'tiktok.com' },
  { id: 'Lazada', name: 'Lazada', color: 'bg-blue-600 text-white', badge: 'from-blue-600 to-indigo-600', domain: 'lazada.com' },
  { id: 'Amazon', name: 'Amazon', color: 'bg-amber-600 text-white', badge: 'from-amber-600 to-yellow-600', domain: 'amazon.com' },
  { id: 'Tokopedia', name: 'Tokopedia', color: 'bg-emerald-600 text-white', badge: 'from-emerald-600 to-teal-600', domain: 'tokopedia.com' },
  { id: 'AliExpress', name: 'AliExpress', color: 'bg-red-600 text-white', badge: 'from-red-600 to-rose-600', domain: 'aliexpress.com' },
  { id: 'Other', name: 'Partner Store', color: 'bg-purple-600 text-white', badge: 'from-purple-600 to-violet-600', domain: 'external.com' }
];

// Rich Initial Sample Affiliate Items
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Anker Soundcore Space Q45 Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    platform: 'Shopee',
    price: 349.00,
    originalPrice: 499.00,
    currency: 'RM',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://shopee.com.my',
    description: '98% noise reduction with adaptive ANC technology. Ultra-long 50-hour playtime in ANC mode. Crisp hi-res audio sound profile.',
    sellerName: "Sarah's Tech Selects",
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    sellerBio: 'Curating top tech gadgets and audio gear deals.',
    tags: ['Tech', 'Audio', 'Hot Deal'],
    views: 1240,
    clicks: 342,
    isFeatured: true,
    isTrending: true,
    createdAt: Date.now() - 100000
  },
  {
    id: 'prod-2',
    title: 'Minimalist Aesthetic Ceramic Desk Lamp & Wireless Charger',
    category: 'Home & Living',
    platform: 'TikTok Shop',
    price: 79.90,
    originalPrice: 120.00,
    currency: 'RM',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://tiktok.com',
    description: '3-level dimmable LED warm light combined with 15W fast wireless Qi smartphone charging pad.',
    sellerName: 'Minimal Home Studio',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    sellerBio: 'Aesthetic room setups & functional home decor.',
    tags: ['Home', 'Desk Setup', 'TikTok Viral'],
    views: 890,
    clicks: 215,
    isFeatured: true,
    isTrending: false,
    createdAt: Date.now() - 200000
  },
  {
    id: 'prod-3',
    title: 'CeraVe Hydrating Facial Cleanser with Hyaluronic Acid 473ml',
    category: 'Beauty & Skincare',
    platform: 'Lazada',
    price: 58.50,
    originalPrice: 75.00,
    currency: 'RM',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://lazada.com',
    description: 'Non-foaming face wash formulated with 3 essential ceramides to protect the natural skin barrier.',
    sellerName: 'GlowSkin Affiliate',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    sellerBio: 'Dermatologist approved skincare product deals.',
    tags: ['Skincare', 'Beauty', 'BestSeller'],
    views: 2100,
    clicks: 610,
    isFeatured: false,
    isTrending: true,
    createdAt: Date.now() - 300000
  },
  {
    id: 'prod-4',
    title: 'Ultra-Lightweight Ergonomic Trail Running Shoes',
    category: 'Fashion & Sports',
    platform: 'Shopee',
    price: 129.00,
    originalPrice: 199.00,
    currency: 'RM',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    affiliateUrl: 'https://shopee.com.my',
    description: 'Breathable flyknit upper material with reinforced rubber traction outsoles for jogging and hiking.',
    sellerName: 'FitLife Finds',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    sellerBio: 'Fitness gear, sportswear, and active lifestyle picks.',
    tags: ['Running', 'Sports', 'Discount'],
    views: 650,
    clicks: 180,
    isFeatured: false,
    isTrending: false,
    createdAt: Date.now() - 400000
  }
];

const LetsBuyLogo = ({ className = "h-8" }) => (
  <div className={`flex items-center gap-2.5 select-none ${className}`}>
    <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 via-emerald-500 to-indigo-600 p-0.5 shadow-md shadow-emerald-500/20 group hover:rotate-3 transition-transform">
      <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-rose-500/20 opacity-70" />
        <ShoppingBag className="w-5 h-5 text-emerald-400 relative z-10 -mt-0.5" />
        <Zap className="w-3 h-3 text-amber-400 absolute bottom-1 right-1 z-10 animate-pulse" />
      </div>
    </div>
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-indigo-900 bg-clip-text text-transparent">
          LET’S BUY!
        </span>
        <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded-md shadow-sm">
          DEALS
        </span>
      </div>
      <span className="text-[9.5px] font-bold text-slate-400 tracking-wider uppercase -mt-1">
        Affiliate Discovery
      </span>
    </div>
  </div>
);

export default function App() {
  // Auth & Profile State
  const [user, setUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState({
    username: 'Sarah_Tech_Picks',
    displayName: "Sarah's Tech Selects",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'Verified affiliate marketer sharing curated tech deals & gadgets.',
    socials: '@sarahtechdeals',
    isLoggedIn: false
  });

  // UI Navigation State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'explore' | 'trending' | 'dashboard' | 'profile'
  const [dashboardSubTab, setDashboardSubTab] = useState('overview'); // 'overview' | 'products' | 'add' | 'profile'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'popular' | 'price-low' | 'discount'

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Data State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    platform: 'Shopee',
    price: '',
    originalPrice: '',
    currency: 'RM',
    imageUrl: '',
    affiliateUrl: '',
    description: '',
    tags: ''
  });

  // Onboarding Wizard Step
  const [onboardStep, setOnboardStep] = useState(1);

  useEffect(() => {
    if (!auth) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth Init Error:", err);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Firestore Sync Listener
  useEffect(() => {
    if (!db || !user) return;

    const productsRef = collection(db, 'artifacts', appId, 'public', 'data', 'products');

    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        setIsFirebaseConnected(true);
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(loaded);
        }
      },
      (err) => {
        console.warn("Firestore listener warning, using local state:", err);
        setIsFirebaseConnected(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Toast Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Click Handler for Affiliate Links with Counter
  const handleBuyNowClick = async (product) => {
    // Local state optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, clicks: (p.clicks || 0) + 1 } : p))
    );

    // Increment in Firestore
    if (db && user) {
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', product.id);
        await updateDoc(docRef, { clicks: increment(1) });
      } catch (err) {
        console.error("Error updating click count:", err);
      }
    }

    // Safely open external link
    if (product.affiliateUrl) {
      let url = product.affiliateUrl.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleToggleLogin = () => {
    if (currentUserProfile.isLoggedIn) {
      setCurrentUserProfile((prev) => ({ ...prev, isLoggedIn: false }));
      triggerToast('Logged out of Seller Account');
    } else {
      setCurrentUserProfile((prev) => ({ ...prev, isLoggedIn: true }));
      setShowAuthModal(false);
      triggerToast(`Welcome back, ${currentUserProfile.displayName}!`);
    }
  };

  const handleCreateProductSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title || !formData.price || !formData.affiliateUrl) {
      triggerToast('Please complete Product Title, Price, and Affiliate Link');
      return;
    }

    const priceNum = parseFloat(formData.price) || 0;
    const origPriceNum = parseFloat(formData.originalPrice) || 0;

    const newProd = {
      title: formData.title.trim(),
      category: formData.category || 'General',
      platform: formData.platform || 'Shopee',
      price: priceNum,
      originalPrice: origPriceNum > priceNum ? origPriceNum : null,
      currency: formData.currency || 'RM',
      imageUrl: formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      affiliateUrl: formData.affiliateUrl.trim(),
      description: formData.description.trim() || 'Product deal discovered via LET’S BUY! affiliate platform.',
      sellerName: currentUserProfile.displayName,
      sellerAvatar: currentUserProfile.avatar,
      sellerBio: currentUserProfile.bio,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : ['Affiliate', 'Featured'],
      views: 0,
      clicks: 0,
      isFeatured: true,
      isTrending: false,
      createdAt: Date.now()
    };

    if (db && user) {
      try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), newProd);
        triggerToast('Product published to Cloud Marketplace!');
      } catch (err) {
        setProducts((prev) => [{ id: 'local-' + Date.now(), ...newProd }, ...prev]);
        triggerToast('Product published locally!');
      }
    } else {
      setProducts((prev) => [{ id: 'local-' + Date.now(), ...newProd }, ...prev]);
      triggerToast('Product published locally!');
    }

    // Reset Form
    setFormData({
      title: '',
      category: 'Electronics',
      platform: 'Shopee',
      price: '',
      originalPrice: '',
      currency: 'RM',
      imageUrl: '',
      affiliateUrl: '',
      description: '',
      tags: ''
    });

    setShowOnboardingModal(false);
    setOnboardStep(1);
    setDashboardSubTab('products');
    setActiveTab('dashboard');
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (db && user) {
      try {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', editingProduct.id);
        await updateDoc(docRef, { ...editingProduct });
        triggerToast('Product updated successfully!');
      } catch (err) {
        console.error("Update error:", err);
      }
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      triggerToast('Product updated locally!');
    }

    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product from LET'S BUY!?")) return;

    if (db && user) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', id));
        triggerToast('Product deleted!');
      } catch (err) {
        console.error("Delete error:", err);
      }
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      triggerToast('Product deleted!');
    }
  };

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesPlatform = selectedPlatform === 'All' || p.platform === selectedPlatform;
      const matchesQuery =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesPlatform && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.clicks || 0) - (a.clicks || 0);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'discount') {
        const discA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
        const discB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
        return discB - discA;
      }
      return b.createdAt - a.createdAt; // default newest
    });
  }, [products, selectedCategory, selectedPlatform, searchQuery, sortBy]);

  const myListedProducts = useMemo(() => {
    return products.filter((p) => p.sellerName === currentUserProfile.displayName);
  }, [products, currentUserProfile]);

  const myTotalClicks = useMemo(() => {
    return myListedProducts.reduce((acc, curr) => acc + (curr.clicks || 0), 0);
  }, [myListedProducts]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col pb-20 md:pb-0 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>LET’S BUY! is a Product Discovery Hub. Purchases are completed on official shopping platforms.</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
              <LetsBuyLogo />
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search deals, products, or sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 text-xs rounded-full border border-slate-700 focus:border-emerald-500 focus:outline-none transition-all text-slate-100 placeholder:text-slate-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'home' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'explore' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                Explore Deals
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'trending' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                🔥 Trending
              </button>
            </nav>

            {/* Header Right CTA */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!currentUserProfile.isLoggedIn) {
                    setShowAuthModal(true);
                  } else {
                    setShowOnboardingModal(true);
                  }
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Sell / Promote</span>
              </button>

              {currentUserProfile.isLoggedIn ? (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`p-2 rounded-xl border transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Seller Dashboard"
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Seller Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search deals, Shopee, TikTok Shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/90 text-xs rounded-full border border-slate-700 focus:outline-none focus:border-emerald-500 text-slate-100 placeholder:text-slate-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ================= HOMEPAGE VIEW ================= */}
        {(activeTab === 'home' || activeTab === 'explore' || activeTab === 'trending') && (
          <div className="space-y-8">
            
            {/* Hero Section */}
            {activeTab === 'home' && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Top Verified Product Deals & Promos
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    Discover Top Deals. <br />
                    <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                      Buy Directly on Official Apps.
                    </span>
                  </h1>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                    LET’S BUY! aggregates curated affiliate recommendations from TikTok Shop, Shopee, Lazada, and Amazon in one place.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('explore')}
                      className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                    >
                      <span>Explore All Products</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        if (!currentUserProfile.isLoggedIn) {
                          setShowAuthModal(true);
                        } else {
                          setShowOnboardingModal(true);
                        }
                      }}
                      className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
                    >
                      <Store className="w-4 h-4 text-emerald-400" />
                      <span>Promote Your Affiliate Links</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Pills */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 pr-1">
                    <Filter className="w-3.5 h-3.5" /> Category:
                  </span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sorting Dropdown */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs text-slate-400 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="newest">Latest Deals</option>
                    <option value="popular">Most Clicked</option>
                    <option value="discount">Highest Discount</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>

              {/* Platform Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 pr-1">
                  <Globe className="w-3.5 h-3.5" /> Platform:
                </span>
                <button
                  onClick={() => setSelectedPlatform('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedPlatform === 'All'
                      ? 'bg-slate-200 text-slate-900 font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Platforms
                </button>
                {SHOPPING_PLATFORMS.map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setSelectedPlatform(plat.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      selectedPlatform === plat.id
                        ? 'bg-slate-200 text-slate-900 font-bold'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{plat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-slate-800 p-8">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">No products match your criteria</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting search keywords or category filters.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedPlatform('All'); setSearchQuery(''); }}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => {
                  const platConfig = SHOPPING_PLATFORMS.find((p) => p.id === prod.platform) || SHOPPING_PLATFORMS[6];
                  const hasDiscount = prod.originalPrice && prod.originalPrice > prod.price;
                  const discountPct = hasDiscount
                    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={prod.id}
                      className="group bg-slate-800/70 hover:bg-slate-800 rounded-2xl border border-slate-700/70 hover:border-emerald-500/50 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
                    >
                      {/* Product Image */}
                      <div
                        className="relative w-full aspect-square bg-slate-950 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedProduct(prod)}
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?auto=format&fit=crop&w=800&q=80';
                          }}
                        />

                        {/* Platform Badge Tag */}
                        <span className={`absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-black rounded-lg shadow-md bg-gradient-to-r ${platConfig.badge}`}>
                          {prod.platform}
                        </span>

                        {/* Discount Badge */}
                        {hasDiscount && (
                          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-lg shadow-md">
                            -{discountPct}%
                          </span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          {/* Seller info line */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <img
                              src={prod.sellerAvatar}
                              alt={prod.sellerName}
                              className="w-4 h-4 rounded-full object-cover border border-slate-600"
                            />
                            <span className="text-[10px] text-slate-400 font-medium truncate">
                              {prod.sellerName}
                            </span>
                            <UserCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          </div>

                          <h3
                            onClick={() => setSelectedProduct(prod)}
                            className="font-bold text-slate-100 text-xs sm:text-sm line-clamp-2 cursor-pointer hover:text-emerald-400 transition-colors leading-snug"
                          >
                            {prod.title}
                          </h3>
                        </div>

                        {/* Pricing & CTA */}
                        <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-2">
                          <div className="flex items-baseline justify-between">
                            <span className="text-[10px] text-slate-400">Deal Price</span>
                            <div className="text-right">
                              {hasDiscount && (
                                <span className="text-[10px] text-slate-400 line-through mr-1.5">
                                  {prod.currency} {prod.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-sm sm:text-base font-black text-emerald-400">
                                {prod.currency} {prod.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => handleBuyNowClick(prod)}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95 transition-all"
                          >
                            <span>BUY NOW → {prod.platform}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= SELLER DASHBOARD VIEW ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Dashboard Header */}
            <div className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={currentUserProfile.avatar}
                  alt={currentUserProfile.displayName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black text-white">{currentUserProfile.displayName}</h1>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Verified Seller
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{currentUserProfile.bio}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Product Deal</span>
                </button>
                <button
                  onClick={handleToggleLogin}
                  className="p-2.5 rounded-xl bg-slate-700/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dashboard Sub-Tabs */}
            <div className="flex border-b border-slate-800 gap-4">
              <button
                onClick={() => setDashboardSubTab('overview')}
                className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  dashboardSubTab === 'overview'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Overview Analytics</span>
              </button>

              <button
                onClick={() => setDashboardSubTab('products')}
                className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  dashboardSubTab === 'products'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>My Listings ({myListedProducts.length})</span>
              </button>
            </div>

            {/* SUBTAB 1: Overview */}
            {dashboardSubTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                    <span className="text-slate-400 text-xs font-medium block">Total Products</span>
                    <span className="text-2xl font-black text-white mt-1 block">{myListedProducts.length}</span>
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                    <span className="text-slate-400 text-xs font-medium block">Affiliate Clicks</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 block">{myTotalClicks}</span>
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                    <span className="text-slate-400 text-xs font-medium block">Est. CTR</span>
                    <span className="text-2xl font-black text-teal-300 mt-1 block">
                      {myListedProducts.length > 0 ? (myTotalClicks / (myListedProducts.length * 15)).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                    <span className="text-slate-400 text-xs font-medium block">Active Platform</span>
                    <span className="text-2xl font-black text-indigo-400 mt-1 block">Shopee / TikTok</span>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-200">Affiliate Marketing Tip 💡</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Make sure to upload high-quality product lifestyle photos and set your exact deep links from Shopee Affiliate or TikTok Shop Creator Center. Products with clear original vs discount prices receive up to 3x higher click-through rates!
                  </p>
                </div>
              </div>
            )}

            {/* SUBTAB 2: My Products Management Table */}
            {dashboardSubTab === 'products' && (
              <div className="bg-slate-800/80 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/80 text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-700">
                        <th className="py-3.5 px-4">Product Deal</th>
                        <th className="py-3.5 px-4">Platform</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Clicks</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-xs">
                      {myListedProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            You haven't added any affiliate product listings yet.
                          </td>
                        </tr>
                      ) : (
                        myListedProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3 max-w-xs">
                                <img
                                  src={p.imageUrl}
                                  alt={p.title}
                                  className="w-10 h-10 rounded-xl object-cover bg-slate-900 border border-slate-700 flex-shrink-0"
                                />
                                <div className="truncate">
                                  <p className="font-bold text-slate-100 truncate">{p.title}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{p.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200 font-bold text-[10px]">
                                {p.platform}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-emerald-400">
                              {p.currency} {p.price.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                {p.clicks || 0} clicks
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-colors"
                                  title="Edit Listing"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                  title="Delete Listing"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ================= ONBOARDING & ADD PRODUCT WIZARD MODAL ================= */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  {onboardStep}
                </span>
                <h3 className="font-bold text-slate-100 text-sm">
                  {onboardStep === 1 && "Step 1: Product Link & Target Platform"}
                  {onboardStep === 2 && "Step 2: Product Name & Pricing"}
                  {onboardStep === 3 && "Step 3: Description & Image URL"}
                </h3>
              </div>
              <button onClick={() => setShowOnboardingModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1 Form */}
            {onboardStep === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Select Shopping Platform *</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {SHOPPING_PLATFORMS.map((plat) => (
                      <option key={plat.id} value={plat.id}>{plat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Paste Affiliate / Product URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://shopee.com.my/... or https://tiktok.com/..."
                    value={formData.affiliateUrl}
                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">This is the link buyers will be sent to when they click BUY NOW.</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!formData.affiliateUrl) {
                      triggerToast('Please paste your affiliate URL to continue');
                      return;
                    }
                    setOnboardStep(2);
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2 Form */}
            {onboardStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Ergonomic Gaming Mouse"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Deal Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="89.90"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Original Price (Optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="129.00"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(1)}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.title || !formData.price) {
                        triggerToast('Please complete Title and Price');
                        return;
                      }
                      setOnboardStep(3);
                    }}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 Form */}
            {onboardStep === 3 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Short Description</label>
                  <textarea
                    rows={3}
                    placeholder="Write key selling points, features, or specs..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOnboardStep(2)}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateProductSubmit}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Publish to Marketplace 🔥
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= PRODUCT DETAIL MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative aspect-video bg-slate-950">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 p-2 bg-slate-900/80 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {selectedProduct.platform}
                </span>
                <h2 className="text-base font-extrabold text-white mt-1.5">{selectedProduct.title}</h2>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  {selectedProduct.currency} {selectedProduct.price.toFixed(2)}
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/80 text-xs text-slate-300">
                {selectedProduct.description}
              </div>

              <button
                onClick={() => {
                  handleBuyNowClick(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <span>BUY NOW → {selectedProduct.platform}</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 text-sm">Edit Product Listing</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Platform</label>
                  <select
                    value={editingProduct.platform}
                    onChange={(e) => setEditingProduct({ ...editingProduct, platform: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100"
                  >
                    {SHOPPING_PLATFORMS.map((plat) => (
                      <option key={plat.id} value={plat.id}>{plat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Affiliate Link</label>
                <input
                  type="text"
                  value={editingProduct.affiliateUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, affiliateUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs hover:bg-emerald-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= AUTH MODAL ================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Seller Login & Portal</h3>
              <p className="text-xs text-slate-400 mt-1">Sign in to manage your affiliate products and view click analytics.</p>
            </div>

            <button
              onClick={handleToggleLogin}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20"
            >
              Log In as Sarah's Tech Selects
            </button>

            <button onClick={() => setShowAuthModal(false)} className="text-xs text-slate-500 hover:text-slate-300">
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around text-[10px] font-bold text-slate-400">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-400' : ''}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'explore' ? 'text-emerald-400' : ''}`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('trending')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'trending' ? 'text-emerald-400' : ''}`}
        >
          <Flame className="w-5 h-5" />
          <span>Trending</span>
        </button>

        <button
          onClick={() => {
            if (!currentUserProfile.isLoggedIn) {
              setShowAuthModal(true);
            } else {
              setActiveTab('dashboard');
            }
          }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-emerald-400' : ''}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
      </nav>

    </div>
  );
}