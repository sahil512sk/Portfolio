async function loadData() {
  try {
    // Dynamic API URL - works on both localhost and production
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3000' 
      : window.location.origin;
    // console.log('Loading data from:', API_BASE);
    
    const userRes = await fetch(`${API_BASE}/users/getUsers`);
    if (!userRes.ok) {
      throw new Error(`Failed to fetch users: ${userRes.status}`);
    }
    const userData = await userRes.json();
    // console.log('Users data loaded:', userData.length, 'users found');

    if (userData.length > 0) {
      const user = userData[0];
      document.getElementById('person-name').textContent = user.name || 'Sahil';
      document.getElementById('person-role').textContent = user.role || 'Web Developer';
      document.getElementById('person-about').textContent = user.about || 'Hello — I\'m a web developer focused on building clean, accessible interfaces and fast experiences.';
      document.getElementById('person-email').href = `mailto:${user.email || 'sahil512sk@gmail.com'}`;

      const githubLink = document.querySelector('#github');
      if (githubLink && user.github) {
        githubLink.href = user.github;
      }

      const whatsappLink = document.querySelector('#whatsapp');
      if (whatsappLink && user.whatsapp) {
        whatsappLink.href = user.whatsapp;
      }

      if (user.cv) {
        const cvLink = document.getElementById('cv-link');
        if (cvLink) {
          cvLink.href = `${API_BASE}/uploads/${user.cv}`;
        }
      }

      if (user.avatar) {
        const avatarImg = document.getElementById('person-avatar');
        if (avatarImg) {
          avatarImg.src = `${API_BASE}/uploads/${user.avatar}`;
          avatarImg.style.display = 'block';
        }
      }
    }

    const projectsRes = await fetch(`${API_BASE}/projects/getProjects`);
    if (!projectsRes.ok) {
      throw new Error(`Failed to fetch projects: ${projectsRes.status}`);
    }
    const projects = await projectsRes.json();
    // console.log('Projects data loaded:', projects.length, 'projects found');

    const projectsContainer = document.querySelector('.projects-container');
    if (projectsContainer && projects && projects.length > 0) {
      const existingCards = projectsContainer.querySelectorAll('.project-card');
      existingCards.forEach(card => card.remove());

      projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const projectImage = project.image ? `<img src="${API_BASE}/uploads/${project.image}" alt="${project.title}" onerror="console.log('Image failed to load:', this.src)">` : '<div style="width: 100%; height: 280px; background: #333; display: flex; align-items: center; justify-content: center; color: #666;">No Image</div>';

        projectCard.innerHTML = `
          ${projectImage}
          <div class="project-content">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-links" style="margin-bottom: 15px;">
              ${project.gitlink ? `<a href="${project.gitlink}" target="_blank" class="btn">GitHub</a>` : ''}
              ${project.livelink ? `<a href="${project.livelink}" target="_blank" class="btn">Live Demo</a>` : ''}
            </div>
          </div>
        `;

        projectCard.addEventListener('click', () => {
          const modal = document.getElementById('project-modal');
          const modalTitle = document.getElementById('modal-title');
          const modalDesc = document.getElementById('modal-desc');
          const modalLinks = document.getElementById('modal-links');

          modalTitle.textContent = project.title;
          modalDesc.textContent = project.description;
          const modalImage = project.image ? `<img src="${API_BASE}/uploads/${project.image}" alt="${project.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">` : '';
          modalLinks.innerHTML = `
            ${modalImage}
            ${project.gitlink ? `<a href="${project.gitlink}" target="_blank" class="btn">GitHub</a>` : ''}
            ${project.livelink ? `<a href="${project.livelink}" target="_blank" class="btn">Live Demo</a>` : ''}
          `;

          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        });

        projectsContainer.appendChild(projectCard);
      });
    }

    const workRes = await fetch(`${API_BASE}/work/getWork`);
    if (!workRes.ok) {
      throw new Error(`Failed to fetch work: ${workRes.status}`);
    }
    const workExperiences = await workRes.json();
    // console.log('Work data loaded:', workExperiences.length, 'work experiences found');

    const workContainer = document.querySelector('.work-container');
    if (workContainer && workExperiences && workExperiences.length > 0) {
      const existingCards = workContainer.querySelectorAll('.work-card');
      existingCards.forEach(card => card.remove());

      workExperiences.forEach(work => {
        const workCard = document.createElement('div');
        workCard.className = 'work-card';

        const endDate = work.current ? 'Present' : work.end_date || 'Present';
        const dateRange = `${work.start_date} : ${endDate}`;

        workCard.innerHTML = `
          <h4>${work.position}</h4>
          <h5>${work.company}</h5>
          <span>${dateRange}</span>
          <p>${work.work_description}</p>
        `;

        workContainer.appendChild(workCard);
      });
    }
  } catch (error) {
    // console.error('Error loading data:', error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 10px 15px; border-radius: 5px; z-index: 9999;';
    errorDiv.textContent = 'Failed to load portfolio data. Please refresh the page.';
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();

  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }
});

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

$("#year").textContent = new Date().getFullYear();

$$('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

function closeModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }
}

const closeModalBtn = document.querySelector(".modal-close");
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

document.addEventListener("click", (e) => {
  const modal = document.getElementById('project-modal');
  if (modal && e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

const form = document.getElementById("contactForm");
if (form) {
  const submitButton = form.querySelector("button[type='submit']");
  const originalButtonText = submitButton.textContent;
  
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    
    const formData = new FormData(form);
    const endpoint = "https://formspree.io/f/mreyqwpa";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData
      });

      if (response.ok) {
        alert("Thank you! Your message was sent successfully.");
        form.reset();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "There was a problem sending your message. Please try again.";
        alert(`Oops! ${errorMessage}`);
      }
    } catch (error) {
      alert("Oops! There was a network error. Please check your connection and try again.");
      // console.error("Form submission error:", error);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}