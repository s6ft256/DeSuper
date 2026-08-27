import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingCart, Zap, Clock, Palette, HelpCircle, Star, Check, Coins, AlertTriangle } from 'lucide-react';
import { sound } from '../utils/audio';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems';
  category: 'boosts' | 'cosmetics' | 'utilities';
  icon: React.ReactNode;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'xp_boost_1hr',
    name: '2x XP Boost (1 Hour)',
    description: 'Double XP from all missions for 1 hour',
    price: 200,
    currency: 'coins',
    category: 'boosts',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
  },
  {
    id: 'hint_pack',
    name: 'Hint Pack (5 hints)',
    description: 'Get extra hints for difficult missions',
    price: 100,
    currency: 'coins',
    category: 'utilities',
    icon: <HelpCircle className="w-5 h-5 text-cyan-400" />,
  },
  {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for 1 missed day',
    price: 150,
    currency: 'coins',
    category: 'utilities',
    icon: <Clock className="w-5 h-5 text-blue-400" />,
  },
  {
    id: 'neon_theme',
    name: 'Neon Theme',
    description: 'Unlock neon cyberpunk theme',
    price: 500,
    currency: 'coins',
    category: 'cosmetics',
    icon: <Palette className="w-5 h-5 text-purple-400" />,
  },
  {
    id: 'gold_badge',
    name: 'Gold Badge Frame',
    description: 'Special gold frame for your profile badge',
    price: 750,
    currency: 'coins',
    category: 'cosmetics',
    icon: <Star className="w-5 h-5 text-yellow-400" />,
  },
];

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShopModal({ isOpen, onClose }: ShopModalProps) {
  const { player, purchaseItem, ownedItems } = useGame();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [confirmPurchase, setConfirmPurchase] = useState<ShopItem | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'boosts', label: 'Boosts' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'cosmetics', label: 'Cosmetics' },
  ];

  const filteredItems = activeCategory === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((item) => item.category === activeCategory);

  const handlePurchaseClick = (item: ShopItem) => {
    if (ownedItems.includes(item.id)) {
      setPurchaseMessage('You already own this item!');
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }
    setConfirmPurchase(item);
  };

  const handleConfirmPurchase = () => {
    if (!confirmPurchase) return;

    const success = purchaseItem(confirmPurchase.id, confirmPurchase.price, confirmPurchase.currency);
    
    if (success) {
      sound.playSuccess();
      setPurchaseMessage(`Purchased ${confirmPurchase.name}!`);
    } else {
      setPurchaseMessage(`Not enough ${confirmPurchase.currency}!`);
    }
    
    setConfirmPurchase(null);
    setTimeout(() => setPurchaseMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80" onClick={onClose}>
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white">Shop</h2>
              <p className="text-xs text-slate-400 font-mono">Spend your coins on items</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-mono font-bold text-amber-300">{player.coins.toLocaleString()}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                sound.playKeyClick();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Purchase Message */}
        {purchaseMessage && (
          <div className={`mx-6 mt-4 p-3 rounded-xl text-sm font-mono ${
            purchaseMessage.includes('Not enough') || purchaseMessage.includes('already own')
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
          }`}>
            {purchaseMessage}
          </div>
        )}

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const canAfford = player.coins >= item.price;
              const isOwned = ownedItems.includes(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOwned
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : canAfford
                      ? 'bg-slate-800 border-slate-700 hover:border-cyan-500/40'
                      : 'bg-slate-800/50 border-slate-700 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isOwned ? 'bg-emerald-500/20' : 'bg-slate-700'
                    }`}>
                      {isOwned ? <Check className="w-5 h-5 text-emerald-400" /> : item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-mono text-sm text-white">{item.name}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span className={`font-bold font-mono text-sm ${canAfford ? 'text-amber-300' : 'text-rose-400'}`}>
                        {item.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchaseClick(item)}
                      disabled={!canAfford || isOwned}
                      className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                        isOwned
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                          : canAfford
                          ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isOwned ? 'Owned' : canAfford ? 'Buy' : 'Need more'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Purchase Confirmation Modal */}
        {confirmPurchase && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-slate-950/80 rounded-2xl">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold font-mono text-white">Confirm Purchase</h3>
              </div>
              <p className="text-sm text-slate-400 font-mono">
                Are you sure you want to buy <span className="text-white">{confirmPurchase.name}</span> for{' '}
                <span className="text-amber-300">{confirmPurchase.price} coins</span>?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConfirmPurchase(null)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-mono text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="flex-1 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-sm font-bold cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
