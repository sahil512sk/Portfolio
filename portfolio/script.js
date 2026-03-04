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

      const skillsList = document.querySelector('.skills');
      if (user.skills && user.skills.length > 0) {
        skillsList.innerHTML = user.skills.map(skill => `<li>${skill}</li>`).join('');
      }

      if (user.cv) {
        const cvLink = document.querySelector('a[href*="cv.pdf"]');
        if (cvLink) {
          cvLink.href = `http://localhost:3000/uploads/${user.cv}`;
        }
      }
    }

    const projectsRes = await fetch('http://localhost:3000/projects/getProjects');
    const projects = await projectsRes.json();

    const projectsContainer = document.querySelector('.projects-container');
    if (projects && projects.length > 0) {
      const existingCards = projectsContainer.querySelectorAll('.project-card');
      existingCards.forEach(card => card.remove());

      projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        projectCard.innerHTML = `
          <h4>${project.title}</h4>
          <p>${project.description}</p>
          <div class="project-links">
            <a href="${project.gitlink}" target="_blank" class="btn">GitHub</a>
            <a href="${project.livelink}" target="_blank" class="btn">Live Demo</a>
          </div>
        `;

        projectCard.addEventListener('click', () => {
          const modal = document.getElementById('project-modal');
          const modalTitle = document.getElementById('modal-title');
          const modalDesc = document.getElementById('modal-desc');
          const modalLinks = document.getElementById('modal-links');

          modalTitle.textContent = project.title;
          modalDesc.textContent = project.description;
          modalLinks.innerHTML = `
            <a href="${project.gitlink}" target="_blank" class="btn">GitHub</a>
            <a href="${project.livelink}" target="_blank" class="btn">Live Demo</a>
          `;

          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
        });

        projectsContainer.appendChild(projectCard);
      });
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadData);

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

$("#year").textContent = new Date().getFullYear();

const themeBtn = $("#theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

const menuBtn = $("#menu-toggle");
const nav = $("#main-nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");

  const expanded = nav.classList.contains("open");
  menuBtn.setAttribute("aria-expanded", expanded);
});

$$(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", false);
  });
});

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
