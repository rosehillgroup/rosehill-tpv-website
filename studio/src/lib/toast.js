/**
 * Lightweight toast notification utility.
 * Pure DOM — works anywhere, no React integration needed.
 *
 * Usage:
 *   import { showToast } from '../lib/toast.js';
 *   showToast('Something went wrong.');
 *   showToast('Design saved!', 'success');
 */

export function showToast(message, type = 'error') {
  // Remove any existing toast
  const existing = document.querySelector('.studio-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `studio-toast studio-toast--${type}`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.onclick = () => toast.remove();

  document.body.appendChild(toast);

  // Force reflow so the entrance animation plays
  toast.offsetHeight; // eslint-disable-line no-unused-expressions

  toast.classList.add('studio-toast--visible');

  const duration = type === 'success' ? 3000 : 5000;
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.remove('studio-toast--visible');
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}
