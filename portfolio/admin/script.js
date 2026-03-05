document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('#dataForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const userData = {};
    const projectData = {};

    formData.forEach((value, key) => {
      if (key !== 'cv' && key !== 'avatar') {
        if (key === 'skills') {
          userData[key] = value.split(',').map(s => s.trim()).filter(Boolean);
        } else if (['name', 'email', 'role', 'about'].includes(key)) {
          userData[key] = value;
        } else if (['title', 'description', 'gitlink', 'livelink'].includes(key)) {
          // Handle multiple projects - collect all project fields
          if (!projectData.projects) {
            projectData.projects = [];
          }

          const projectInputs = form.querySelectorAll(`input[name="${key}"], textarea[name="${key}"]`);
          projectInputs.forEach((input, index) => {
            if (input.value && input.value.trim()) {
              if (!projectData.projects[index]) {
                projectData.projects[index] = {};
              }
              projectData.projects[index][key] = input.value.trim();
            }
          });
        }
      }
    });

    console.log('User data object:', userData);
    console.log('Project data object:', projectData);

    const hasFile = (formData.has('cv') && formData.get('cv') instanceof File) ||
      (formData.has('avatar') && formData.get('avatar') instanceof File);

    console.log('Has file:', hasFile);

    const hasProjects = formData.has('title') || formData.has('description') || formData.has('gitlink') || formData.has('livelink');
    console.log('Has projects:', hasProjects);

    const hasUserData = formData.has('name') || formData.has('email') || formData.has('role');
    console.log('Has user data:', hasUserData);

    let responses = [];

    if (hasUserData) {
      let userResponse;
      if (hasFile) {
        try {
          userResponse = await fetch('http://localhost:3000/users/postUsers', {
            method: 'POST',
            body: formData
          });
        } catch (err) {
          alert('Failed to upload files.');
          return;
        }
      } else {
        try {
          userResponse = await fetch('http://localhost:3000/users/postUsers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
        } catch (err) {
          alert('Failed to submit user data.');
          return;
        }
      }
      responses.push(userResponse);
    }

    if (hasProjects) {
      try {
        const projectResponse = await fetch('http://localhost:3000/projects/postProjects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
        responses.push(projectResponse);
      } catch (err) {
        alert('Failed to submit project data.');
        return;
      }
    }

    if (responses.length === 0) {
      alert('No data to save. Please fill in the form.');
      return;
    }

    const allSuccessful = responses.every(response => response.ok);
    if (allSuccessful) {
      alert('Data saved successfully!');
      form.reset();
    } else {
      const failedResponse = responses.find(response => !response.ok);
      const errorData = await failedResponse.json();
      alert(errorData.error || 'Failed to save some data.');
    }
  });
});