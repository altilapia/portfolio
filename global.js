console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Create the navigation element
let nav = document.createElement('nav');
document.body.prepend(nav);

// Define the pages
let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'resume/resume.html', title: 'Resume' },
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Only prepend '/portfolio/' when hosted on a live server, not locally
  if (!ARE_WE_HOME && !url.startsWith('http')) {
    if (window.location.hostname !== "127.0.0.1" && window.location.hostname !== "localhost") {
      url = '/portfolio/' + url;
      console.log(url);
    }
    // } else {
    //   url = '/portfolio/index.html' + url;
    // }
  }

  // Create the anchor element
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;


  let linkPath = new URL(a.getAttribute('href'), window.location.origin).pathname
  .replace(/\/+$/, "") // Remove trailing slashes
  .replace(/\/index.html$/, ""); // Treat /index.html as /

  let currentPath = window.location.pathname
  .replace(/\/+$/, "")
  .replace(/\/index.html$/, "");

  // console.log(`Checking: ${title}, Link Path: ${linkPath}, Current Path: ${currentPath}`);

  if (linkPath === currentPath) {
  console.log(`Applying 'current' to: ${title}`);
  a.classList.add('current');
  }


  // Append to the navigation bar
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="color-scheme-select">
      <option value="automatic">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

const select = document.querySelector('.color-scheme select');

if ('colorScheme' in localStorage) {
  const savedTheme = localStorage.colorScheme;
  document.documentElement.style.setProperty('color-scheme', savedTheme);
  select.value = savedTheme;
} else {
  document.documentElement.style.setProperty('color-scheme', 'light dark');
  select.value = 'light dark';
}

select.addEventListener('input', function (event) {
  const selectedTheme = event.target.value;
  console.log('Color scheme changed to', selectedTheme);
  
  document.documentElement.style.setProperty('color-scheme', selectedTheme);
  localStorage.colorScheme = selectedTheme;
});

// Set base URL dynamically
const baseElement = document.createElement('base');
baseElement.href = (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") 
  ? "/" 
  : "/portfolio/";
document.head.appendChild(baseElement);

export async function fetchJSON(url) {
  try {
    const isRelative = url.startsWith('/') || url.startsWith('./');
    console.log("Original URL:", url);

    const adjustedUrl = window.location.hostname === 'altilapia.github.io' && isRelative
    ? `/portfolio/${url.replace(/^\/+|^\.+/, '')}`  // Remove leading slashes or dots to avoid double periods
    : url;
  
    console.log("Adjusted URL:", adjustedUrl);

    const response = await fetch(adjustedUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}
// Function to render projects
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  const titleElement = document.querySelector('.projects-title');
  if (titleElement) {
    titleElement.textContent = `${projects.length} Projects`;
  }

  containerElement.innerHTML = '';

  projects.forEach(project => {
    if (!containerElement || !(containerElement instanceof HTMLElement)) {
      console.error('Invalid container element.');
      return;
    }

    const heading = document.createElement(headingLevel);
    heading.textContent = project.title;


    const article = document.createElement('article');
    article.classList.add('project'); /* not entirely sure */

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
      ${project.link ? `<a href="${project.link}">See more details</a>` : ''}
    `;

//     article.innerHTML = `
//     <h3>${project.title}</h3>
//     <img src="${project.image}" alt="${project.title}">
//     <p>${project.description}</p>
// `;

    containerElement.appendChild(article);
  });
}

export async function fetchGitHubData(username) {
  return  fetchJSON(`https://api.github.com/users/${username}`);
}
