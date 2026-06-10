document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.logout-link, #sb-logout').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('vault_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('vault_user');
      localStorage.removeItem('vault_email');
      localStorage.removeItem('vault_id');
      localStorage.removeItem('vault_avatar');
      window.location.href = 'index.html';
    });
  });
});