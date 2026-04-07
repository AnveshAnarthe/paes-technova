/* ============================================================
   PAES TECHNOVA 2026 — Authentication (Google Sign-In)
   Role-based access control with email whitelist
   ============================================================ */

const Auth = (function () {
  'use strict';

  // Role hierarchy
  const ROLES = {
    VP: 'vp',
    TECH_COORD: 'tech_coordinator',
    CULTURAL_COORD: 'cultural_coordinator',
    SPORTS_COORD: 'sports_coordinator',
    PHOTO_COORD: 'photo_coordinator',
    CERT_COORD: 'cert_coordinator',
    NOTICE_COORD: 'notice_coordinator',
    CO_COORD: 'co_coordinator'
  };

  // Whitelist (replace with actual emails)
  // In production, this would be fetched from a Google Sheet
  const WHITELIST = {
    'anvesh.anarthe.ec23@pravaraengg.org.in': { role: ROLES.VP, name: 'Anvesh', title: 'Vice President' },
    'siddhi.kharde.ec23@pravaraengg.org.in': { role: ROLES.TECH_COORD, name: 'Technical Coordinator', title: 'Technical Coordinator' },
    'cultural.coord@gmail.com': { role: ROLES.CULTURAL_COORD, name: 'Cultural Coordinator', title: 'Cultural Coordinator' },
    'sports.coord@gmail.com': { role: ROLES.SPORTS_COORD, name: 'Sports Coordinator', title: 'Sports Coordinator' },
    'kartik.dhanwate.ec23@pravaraengg.org.in': { role: ROLES.PHOTO_COORD, name: 'Kartik Dhanwate', title: 'Photography/Reels Coordinator' },
    'cert.coord@gmail.com': { role: ROLES.CERT_COORD, name: 'Certificates Coordinator', title: 'Certificates Coordinator' },
    'notice.coord@gmail.com': { role: ROLES.NOTICE_COORD, name: 'Notices Coordinator', title: 'Notices Coordinator' }
  };

  let currentUser = null;

  // ---- Google Identity Services ----
  function initGoogleSignIn() {
    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const config = GoogleAPI.getConfig();
      google.accounts.id.initialize({
        client_id: config.CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false
      });

      // Render button if login page
      const loginBtn = document.getElementById('google-signin-btn');
      if (loginBtn) {
        google.accounts.id.renderButton(loginBtn, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
          width: 300
        });
      }
    };
    document.head.appendChild(script);
  }

  function handleCredentialResponse(response) {
    // Decode JWT token
    const payload = parseJwt(response.credential);
    if (!payload) {
      if (typeof showToast === 'function') showToast('Authentication failed', 'error');
      return;
    }

    const email = payload.email.toLowerCase();
    const whitelistEntry = WHITELIST[email];

    if (!whitelistEntry) {
      if (typeof showToast === 'function') showToast('Access denied. Your email is not authorized.', 'error');
      return;
    }

    currentUser = {
      email: email,
      name: payload.name || whitelistEntry.name,
      picture: payload.picture,
      role: whitelistEntry.role,
      title: whitelistEntry.title
    };

    // Store in local storage to persist across tabs
    localStorage.setItem('paes_user', JSON.stringify(currentUser));

    if (typeof showToast === 'function') showToast(`Authenticating Drive Access...`, 'info');

    // Get OAuth2 access token for API calls
    getOAuthToken(() => {
      if (typeof showToast === 'function') showToast(`Welcome, ${currentUser.name}! (${currentUser.title})`, 'success');
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    });
  }

  function getOAuthToken(onSuccess) {
    const config = GoogleAPI.getConfig();
    const client = google.accounts.oauth2.initTokenClient({
      client_id: config.CLIENT_ID,
      scope: config.SCOPES,
      callback: (tokenResponse) => {
        GoogleAPI.setAccessToken(tokenResponse.access_token);
        localStorage.setItem('paes_token', tokenResponse.access_token);
        if (onSuccess) onSuccess();
      }
    });
    client.requestAccessToken({prompt: 'consent'});
  }

  // ---- Parse JWT ----
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return null;
    }
  }

  // ---- Session Management ----
  function restoreSession() {
    const stored = localStorage.getItem('paes_user');
    const token = localStorage.getItem('paes_token');
    if (stored) {
      currentUser = JSON.parse(stored);
      if (token) GoogleAPI.setAccessToken(token);
      updateUIForUser();
    }
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem('paes_user');
    localStorage.removeItem('paes_token');
    GoogleAPI.setAccessToken(null);
    if (typeof showToast === 'function') showToast('Logged out successfully', 'info');
    window.location.href = 'index.html';
  }

  // ---- Update Header UI ----
  function updateUIForUser() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn && currentUser) {
      loginBtn.textContent = currentUser.name.split(' ')[0];
      loginBtn.href = 'dashboard.html';
      loginBtn.title = `${currentUser.title} — Click for Dashboard`;
    }
  }

  // ---- Auth Guards ----
  function requireAuth(redirectTo = 'login.html') {
    if (!currentUser) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  function requireRole(allowedRoles, redirectTo = 'index.html') {
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      if (typeof showToast === 'function') showToast('Access denied for this section', 'error');
      setTimeout(() => { window.location.href = redirectTo; }, 1500);
      return false;
    }
    return true;
  }

  function hasRole(role) {
    return currentUser && currentUser.role === role;
  }

  function isVP() {
    return hasRole(ROLES.VP);
  }

  function isCoordinator() {
    return currentUser && currentUser.role.includes('coordinator');
  }

  // ---- Public API ----
  return {
    init: initGoogleSignIn,
    restoreSession,
    logout,
    requireAuth,
    requireRole,
    hasRole,
    isVP,
    isCoordinator,
    getCurrentUser: () => currentUser,
    ROLES
  };

})();

window.Auth = Auth;

// Auto-restore session on page load
document.addEventListener('DOMContentLoaded', () => {
  Auth.restoreSession();
});
