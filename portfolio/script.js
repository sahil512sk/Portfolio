async function loadData() {
  try {
    const userRes = await fetch('http://localhost:3000/users/getUsers');
    const userData = await userRes.json();

    if (userData.length > 0) {
      const user = userData[0];
      document.getElementById('person-name').textContent = user.name || 'Sahil';
      document.getElementById('person-role').textContent = user.role || 'Web Developer';
      document.getElementById('person-about').textContent = user.about || 'Hello — I\'m a web developer focused on building clean, accessible interfaces and fast experiences.';
      document.getElementById('person-email').textContent = user.email || 'sahil512sk@gmail.com';
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
          cvLink.href = `http://localhost:3000/uploads/${user.cv}`;
        }
      }

      if (user.avatar) {
        const avatarImg = document.getElementById('person-avatar');
        if (avatarImg) {
          avatarImg.src = `http://localhost:3000/uploads/${user.avatar}`;
          avatarImg.style.display = 'block';
        }
      }
    }

    const projectsRes = await fetch('http://localhost:3000/projects/getProjects');
    const projects = await projectsRes.json();
    // console.log('Projects data:', projects);

    const projectsContainer = document.querySelector('.projects-container');
    if (projects && projects.length > 0) {
      const existingCards = projectsContainer.querySelectorAll('.project-card');
      existingCards.forEach(card => card.remove());

      projects.forEach(project => {
        // console.log('Project:', project);
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const projectImage = project.image ? `<img src="http://localhost:3000/uploads/${project.image}" alt="${project.title}" onerror="console.log('Image failed to load:', this.src)">` : '<div style="width: 100%; height: 280px; background: #333; display: flex; align-items: center; justify-content: center; color: #666;">No Image</div>';
        // console.log('Project image HTML:', projectImage);

        projectCard.innerHTML = `
          ${projectImage}
          <div class="project-content">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-links">
              <a href="${project.gitlink}" target="_blank" class="btn">GitHub</a>
              <a href="${project.livelink}" target="_blank" class="btn">Live Demo</a>
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
          const modalImage = project.image ? `<img src="http://localhost:3000/uploads/${project.image}" alt="${project.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">` : '';
          modalLinks.innerHTML = `
            ${modalImage}
            <a href="${project.gitlink}" target="_blank" class="btn">GitHub</a>
            <a href="${project.livelink}" target="_blank" class="btn">Live Demo</a>
          `;

          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        });

        projectsContainer.appendChild(projectCard);
      });
    }

    const workRes = await fetch('http://localhost:3000/work/getWork');
    const workExperiences = await workRes.json();

    const workContainer = document.querySelector('.work-container');
    if (workExperiences && workExperiences.length > 0) {
      const existingCards = workContainer.querySelectorAll('.work-card');
      existingCards.forEach(card => card.remove());

      workExperiences.forEach(work => {
        const workCard = document.createElement('div');
        workCard.className = 'work-card';

        const endDate = work.current ? 'Present' : work.end_date || 'Present';
        const dateRange = `${work.start_date} - ${endDate}`;

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
  }
}

document.addEventListener('DOMContentLoaded', loadData);

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

$("#year").textContent = new Date().getFullYear();

$$('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = $(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const modal = $("#project-modal");
const modalTitle = $("#modal-title");
const modalDesc = $("#modal-desc");
const closeModalBtn = $(".modal-close");

$$(".project-card").forEach(card => {
  card.addEventListener("click", () => {
    const title = card.querySelector("h4").textContent;
    const desc = card.querySelector("p").textContent;

    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
