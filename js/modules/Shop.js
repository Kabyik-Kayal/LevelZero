// ============================================
// LevelZero — Shop Module
// ============================================

import { Icons } from '../components/Icons.js';
import { showToast } from '../components/Toast.js';

export function renderShop(state, engine) {
    const { shopItems, customRewards, stats } = state;
    const level = stats.level;

    const allItems = [
        ...shopItems.map(i => ({ ...i, isCustom: false })),
        ...customRewards.map(i => ({ ...i, isCustom: true })),
    ];

    const itemsHTML = allItems.map(item => {
        const locked = item.levelRequired && level < item.levelRequired;
        const canAfford = stats.gold >= item.price;

        return `
      <div class="shop-item ${locked ? 'locked' : ''}" data-item-id="${item.id}">
        <div class="shop-item-left">
          <div class="shop-item-icon">
            <span style="font-size: 1.5rem;">${Icons[item.icon] || Icons.gift}</span>
          </div>
          <div>
            <p class="shop-item-name">${item.name}</p>
            <div class="shop-item-price">
              ${Icons.coins} ${item.price} Gold
            </div>
            ${locked ? `
              <div class="shop-item-level-lock">
                ${Icons.lock} Unlocks at Level ${item.levelRequired}
              </div>
            ` : ''}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <button 
            class="btn btn-sm ${locked ? '' : canAfford ? 'btn-gold' : 'btn-ghost'}"
            data-action="buy-item"
            data-id="${item.id}"
            data-custom="${item.isCustom}"
            ${locked || !canAfford ? 'disabled' : ''}
          >
            ${locked ? Icons.lock + ' Locked' : canAfford ? 'Purchase' : 'Can\'t Afford'}
          </button>
          ${item.isCustom ? `
            <button class="delete-btn" data-action="delete-reward" data-id="${item.id}" title="Remove reward" style="opacity: 1;">
              ${Icons.trash}
            </button>
          ` : ''}
        </div>
      </div>
    `;
    }).join('');

    return `
    <div class="tab-content" id="tab-shop">
      <div class="info-banner indigo animate-slide-up">
        <div class="info-banner-icon">${Icons.shoppingBag}</div>
        <div>
          <p class="info-banner-title">The Reward Bazaar is open</p>
          <p class="info-banner-desc">Convert your hard-earned gold into real-life indulgences.</p>
        </div>
      </div>

      <div class="section-header">${Icons.shoppingBag} Available Rewards</div>
      <div class="shop-grid stagger-children" id="shop-list">
        ${itemsHTML}
      </div>

      <!-- Add Custom Reward -->
      <div style="margin-top: var(--space-6);">
        <div class="section-header">${Icons.plus} Create Custom Reward</div>
        <form class="quest-form" id="custom-reward-form">
          <div class="quest-form-input-row">
            <input type="text" class="input" id="reward-name" placeholder="Reward name (e.g., Pizza Night)" autocomplete="off" />
          </div>
          <div class="quest-form-controls">
            <input type="number" class="input" id="reward-price" placeholder="Gold price" min="1" style="max-width: 140px;" />
            <select class="select" id="reward-icon">
              <option value="gift">Gift</option>
              <option value="burger">Food</option>
              <option value="gamepad">Gaming</option>
              <option value="movie">Entertainment</option>
              <option value="shoppingBag">Shopping</option>
              <option value="sun">Leisure</option>
              <option value="coffee">Drinks</option>
              <option value="music">Music</option>
            </select>
            <button type="submit" class="btn btn-primary">Add Reward</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function attachShopEvents(engine, rerender) {
    // Buy & delete actions
    const shopList = document.getElementById('shop-list');
    if (shopList) {
        shopList.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;

            if (action === 'buy-item') {
                const id = btn.dataset.id;
                const isCustom = btn.dataset.custom === 'true';
                const numId = parseFloat(id);
                const usedId = isNaN(numId) ? id : numId;
                const result = engine.buyItem(usedId, isCustom);

                if (result.success) {
                    showToast({
                        title: `Purchased: ${result.item.name}`,
                        message: `You earned this! -${result.item.price} gold`,
                        type: 'success',
                        icon: Icons[result.item.icon] || Icons.shoppingBag,
                    });
                } else {
                    // Shake animation
                    const shopItem = btn.closest('.shop-item');
                    if (shopItem) {
                        shopItem.classList.add('animate-shake');
                        setTimeout(() => shopItem.classList.remove('animate-shake'), 500);
                    }
                    showToast({
                        title: result.reason,
                        type: 'warning',
                    });
                }
                rerender();
            } else if (action === 'delete-reward') {
                const id = parseFloat(btn.dataset.id);
                engine.deleteCustomReward(id);
                rerender();
            }
        });
    }

    // Custom reward form
    const form = document.getElementById('custom-reward-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reward-name').value.trim();
            const price = parseInt(document.getElementById('reward-price').value);
            const icon = document.getElementById('reward-icon').value;

            if (!name || !price || price < 1) return;

            engine.addCustomReward(name, price, icon);
            document.getElementById('reward-name').value = '';
            document.getElementById('reward-price').value = '';
            rerender();
        });
    }
}
