// Handles portfolio form submission via AJAX

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('portfolio-form');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (key === 'skills') {
        data[key] = value.split(',').map(s => s.trim()).filter(Boolean);
      } else if (key === 'cv' && formData.get('cv') instanceof File && formData.get('cv').name) {
        data[key] = formData.get('cv'); // File will be handled separately
      } else {
        data[key] = value;
      }
    });

    // Handle file upload
    const hasFile = formData.get('cv') && formData.get('cv').name;
    let response;
    if (hasFile) {
      // Send as multipart/form-data
      response = await fetch('/api/portfolio', {
        method: 'POST',
        body: formData
      });
    } else {
      // Send as JSON
      response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    if (response.ok) {
      alert('Portfolio saved successfully!');
      form.reset();
    } else {
      alert('Failed to save portfolio.');
    }
  });
});
