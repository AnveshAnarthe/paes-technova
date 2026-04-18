/* ============================================================
   PAES TECHNOVA 2026 — Feedback Form Logic
   Multi-step navigation, validation, and submission
   ============================================================ */

(function () {
  'use strict';

  const TOTAL_SECTIONS = 5;
  let currentSection = 1;

  // --- DOM refs ---
  const form = document.getElementById('feedback-form');
  const prevBtn = document.getElementById('fb-prev-btn');
  const nextBtn = document.getElementById('fb-next-btn');
  const submitBtn = document.getElementById('fb-submit-btn');
  const progressFill = document.getElementById('fb-progress-fill');
  const successPanel = document.getElementById('fb-success');

  // --- Helpers ---
  function getAllSections() {
    return document.querySelectorAll('.fb-section');
  }

  function getStepDots() {
    return document.querySelectorAll('.fb-step');
  }

  function showSection(num) {
    getAllSections().forEach(s => {
      s.classList.remove('active');
      if (parseInt(s.dataset.section) === num) {
        s.classList.add('active');
      }
    });

    // Update step dots
    getStepDots().forEach(dot => {
      const step = parseInt(dot.dataset.step);
      dot.classList.remove('active');
      dot.classList.toggle('completed', step < num);
      if (step === num) dot.classList.add('active');
    });

    // Progress bar
    const pct = (num / TOTAL_SECTIONS) * 100;
    progressFill.style.width = pct + '%';

    // Button visibility
    prevBtn.style.display = num > 1 ? '' : 'none';
    nextBtn.style.display = num < TOTAL_SECTIONS ? '' : 'none';
    submitBtn.style.display = num === TOTAL_SECTIONS ? '' : 'none';

    currentSection = num;

    // Scroll to top of form
    document.querySelector('.fb-form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // --- Validation ---
  function validateSection(num) {
    const section = document.querySelector(`.fb-section[data-section="${num}"]`);
    if (!section) return true;

    const requiredFields = section.querySelectorAll('.fb-field[data-required="true"]');
    let valid = true;

    requiredFields.forEach(field => {
      field.classList.remove('has-error');

      // Check radio groups (either .fb-scale or .fb-radio-group)
      const radios = field.querySelectorAll('input[type="radio"]');
      if (radios.length) {
        const anyChecked = Array.from(radios).some(r => r.checked);
        if (!anyChecked) {
          field.classList.add('has-error');
          valid = false;
        }
      }

      // Check text inputs
      const textInput = field.querySelector('input[type="text"], textarea');
      if (textInput && textInput.hasAttribute('required') && !textInput.value.trim()) {
        field.classList.add('has-error');
        valid = false;
      }
    });

    if (!valid) {
      showToast('Please complete all required fields in this section.', 'warning');
    }
    return valid;
  }

  // --- Navigation ---
  nextBtn.addEventListener('click', () => {
    if (!validateSection(currentSection)) return;
    if (currentSection < TOTAL_SECTIONS) {
      showSection(currentSection + 1);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentSection > 1) {
      showSection(currentSection - 1);
    }
  });

  // Step dot clicks
  getStepDots().forEach(dot => {
    dot.addEventListener('click', () => {
      const target = parseInt(dot.dataset.step);
      // Only allow going back or to current; going forward requires validation
      if (target < currentSection) {
        showSection(target);
      } else if (target > currentSection) {
        // Validate all sections up to current before jumping forward
        for (let i = currentSection; i < target; i++) {
          if (!validateSection(i)) return;
        }
        showSection(target);
      }
    });
  });

  // --- Google Sheets Endpoint ---
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxiBvKYz0C_Kc7qLo2Ugpapo_QDDLr5QuJu0aDBpPv_PKDdx4rljkgfhXfHloZ6Vqgd/exec';

  // --- Submission ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateSection(currentSection)) return;

    // Gather all form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <div class="spinner" style="width:18px;height:18px;border-width:2px;"></div>
      Submitting...
    `;

    try {
      // Send to Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // Also save to localStorage as backup
      try {
        const feedbacks = JSON.parse(localStorage.getItem('technova_feedbacks') || '[]');
        data.timestamp = new Date().toISOString();
        feedbacks.push(data);
        localStorage.setItem('technova_feedbacks', JSON.stringify(feedbacks));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }

      // Show success state
      document.querySelector('.fb-form-wrapper').style.display = 'none';
      successPanel.style.display = '';
      successPanel.querySelector('.fb-success-card').classList.add('visible');

      showToast('Feedback submitted successfully! Thank you! 🎉', 'success', 5000);

      // Scroll to success card
      successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
      console.error('Submission error:', error);
      showToast('Something went wrong. Please try again.', 'error', 5000);

      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Submit Feedback
      `;
    }
  });

  // --- Initialize ---
  showSection(1);
})();
