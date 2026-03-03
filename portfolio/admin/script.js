document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#dataForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      if (key !== 'cv' && key !== 'avatar') {
        if (key === 'skills') {
          data[key] = value.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          data[key] = value;
        }
      }
    });

    for (let [key, value] of formData.entries()) {
      // console.log(key, value);
    }

    const hasFile = (formData.has('cv') && formData.get('cv') instanceof File) ||
      (formData.has('avatar') && formData.get('avatar') instanceof File);
    // console.log('Has file:', hasFile);

    let response;
    if (hasFile) {
      try {
        response = await fetch('http://localhost:3000/users/postUsers', {
          method: 'POST',
          body: formData
        });
      } catch (err) {
        // console.error('Error uploading file:', err);
        alert('Failed to upload files.');
        return;
      }
    } else {
      try {
        response = await fetch('http://localhost:3000/users/postUsers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (err) {
        // console.error('Error submitting data:', err);
        alert('Failed to submit data.');
        return;
      }
    }

    if (response.ok) {
      const result = await response.json();
      alert(result.message || 'Portfolio saved successfully!');
      form.reset();
    } else {
      const errorData = await response.json();
      alert(errorData.error || 'Failed to save portfolio.');
    }
  });
});