/* ============================================================
   PAES TECHNOVA 2026 — Google API Integration
   Google Sheets, Drive, Slides API wrapper
   ============================================================ */

const GoogleAPI = (function () {
  'use strict';

  // ---- CONFIGURATION ----
  // IMPORTANT: Replace these with your actual values after setting up Google Cloud
  const CONFIG = {
    API_KEY: 'AIzaSyAeTncL0enj_ta2WB4NIIz3o2N80zcgFgg',
    CLIENT_ID: '86195276646-iaiim1agmccbm5o6e9nofb3j109ur7he.apps.googleusercontent.com',
    SCOPES: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',

    // Google Sheet IDs (create these sheets in your Drive)
    SHEETS: {
      REGISTRATIONS: '1PgQxbagM_c7aZYk9LhYjLP0I2G-7rhp3NwbJDOfCyFM',
      NOTICES: '1L7wrvRw08YklxDfbKX4Gq45UbIwPbviciiuP9ZYrvs8',
      COMMITTEES: '1IdMwdGrEazA-6KQDARyxLQHzptNxaiH6hyMYo5WITeo',
      CERTIFICATES: '1HgkoqXkcnpms9dJiv83DHhtxXY4SAoWrTqqN6EuzVIQ',
      AUTH_WHITELIST: '1T0gU7Is-TzCwARsiroeI301ufz0vlaBAUHKj_KFpTHA',
      GALLERY_INDEX: '1q6Lc8sSGW6OpBL4mAPe9pKV4-CPVAlHgP2RzFVcYghk'
    },

    // Google Drive Folder IDs
    DRIVE_FOLDERS: {
      CERTIFICATES: '179otCR5vlroN9rxLER_iEkFcdcKjo_NY',
      GALLERY: '1JUdtMrby6Dj7ES2JZEwOqLse_QigxbWN',
      NOTICES: '11V4QaxkQFXF8_vFyrTqu1TVoGnNQx9vr',
      REPORTS: '18cRRrofOSra4zKO14QeR2xJn1wgjf0fk'
    },

    // Certificate template
    CERT_TEMPLATE_ID: '1uKHe-9DvUXUi3aba9AWH-ZQgJXhHkTgJ-L64Uxcsn9o'
  };

  let accessToken = null;

  // ---- SHEETS API ----

  /**
   * Read data from a Google Sheet range
   * @param {string} sheetId - The Google Sheet ID
   * @param {string} range - The range (e.g., 'Sheet1!A1:D10')
   * @returns {Promise<Array>} Array of row arrays
   */
  async function readRange(sheetId, range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${CONFIG.API_KEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Sheets API error: ${response.status}`);
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Failed to read sheet:', error);
      throw error;
    }
  }

  /**
   * Append a row to a Google Sheet
   * @param {string} sheetId - The Google Sheet ID
   * @param {string} range - The range (e.g., 'Sheet1!A:L')
   * @param {Array} values - Array of values for the row
   */
  async function appendRow(sheetId, range, values) {
    if (!accessToken) throw new Error('Not authenticated. Please sign in first.');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [values]
        })
      });
      if (!response.ok) throw new Error(`Sheets API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to append row:', error);
      throw error;
    }
  }

  /**
   * Update a specific cell in a Google Sheet
   */
  async function updateCell(sheetId, range, value) {
    if (!accessToken) throw new Error('Not authenticated');

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [[value]]
        })
      });
      if (!response.ok) throw new Error(`Sheets API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to update cell:', error);
      throw error;
    }
  }

  // ---- DRIVE API ----

  /**
   * Upload a file to Google Drive
   */
  async function uploadFile(folderId, file, metadata = {}) {
    if (!accessToken) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify({
      name: metadata.name || file.name,
      parents: [folderId],
      ...metadata
    })], { type: 'application/json' }));
    formData.append('file', file);

    try {
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      if (!response.ok) throw new Error(`Drive API error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  /**
   * List files in a Google Drive folder
   */
  async function listFiles(folderId, pageSize = 50) {
    const query = `'${folderId}' in parents and trashed=false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=${pageSize}&fields=files(id,name,mimeType,thumbnailLink,webViewLink,createdTime)&key=${CONFIG.API_KEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Drive API error: ${response.status}`);
      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Google Drive
   */
  async function deleteFile(fileId) {
    if (!accessToken) throw new Error('Not authenticated');

    const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error(`Drive API error: ${response.status}`);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  /**
   * Get a file's shareable link
   */
  function getFileUrl(fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }

  function getFileThumbnail(fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }

  // ---- SLIDES API (Certificates) ----

  /**
   * Copy a Google Slides template and fill in data
   */
  async function generateCertificate(participantData) {
    if (!accessToken) throw new Error('Not authenticated');

    // 1. Copy template
    const copyResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${CONFIG.CERT_TEMPLATE_ID}/copy`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Certificate - ${participantData.name} - ${participantData.event}`,
        parents: [CONFIG.DRIVE_FOLDERS.CERTIFICATES]
      })
    });

    if (!copyResponse.ok) throw new Error('Failed to copy template');
    const copiedFile = await copyResponse.json();

    // 2. Replace placeholders in the copy
    const requests = [
      { replaceAllText: { containsText: { text: '{{NAME}}', matchCase: true }, replaceText: participantData.name } },
      { replaceAllText: { containsText: { text: '{{EVENT}}', matchCase: true }, replaceText: participantData.event } },
      { replaceAllText: { containsText: { text: '{{DATE}}', matchCase: true }, replaceText: participantData.date } },
      { replaceAllText: { containsText: { text: '{{REG_ID}}', matchCase: true }, replaceText: participantData.regId } },
      { replaceAllText: { containsText: { text: '{{CATEGORY}}', matchCase: true }, replaceText: participantData.category || 'Participant' } }
    ];

    await fetch(`https://slides.googleapis.com/v1/presentations/${copiedFile.id}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });

    // 3. Export as PDF
    const pdfUrl = `https://www.googleapis.com/drive/v3/files/${copiedFile.id}/export?mimeType=application/pdf`;

    return {
      fileId: copiedFile.id,
      viewUrl: getFileUrl(copiedFile.id),
      pdfUrl: pdfUrl,
      name: copiedFile.name
    };
  }

  // ---- AUTH ----

  function setAccessToken(token) {
    accessToken = token;
  }

  function getAccessToken() {
    return accessToken;
  }

  function isAuthenticated() {
    return !!accessToken;
  }

  function getConfig() {
    return { ...CONFIG };
  }

  // ---- PUBLIC API ----
  return {
    readRange,
    appendRow,
    updateCell,
    uploadFile,
    deleteFile,
    listFiles,
    getFileUrl,
    getFileThumbnail,
    generateCertificate,
    setAccessToken,
    getAccessToken,
    isAuthenticated,
    getConfig
  };

})();

// Make globally available
window.GoogleAPI = GoogleAPI;
