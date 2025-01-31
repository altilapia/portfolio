console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}


let nav = document.createElement('nav');
document.body.prepend(nav);

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
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        // url = '../' + url;
        url = '/portfolio/' + url;
    }
    if (!url.startsWith('http') && !url.startsWith('/portfolio/')) {
        url = '/portfolio/' + url; // Prepend /portfolio/
    }
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    // nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );

    nav.append(a)
}


// JavaScript to add the color scheme switcher
document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label position: absolute; class="color-scheme">
      Theme:
      <select id="color-scheme-select">
        <option value="automatic">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>`
  );
  

const select = document.querySelector('.color-scheme select');


if ('colorScheme' in localStorage){
    const savedTheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedTheme)
} else {
    document.documentElement.style.setProperty('color-scheme', 'light dark')
    select.value = 'light dark'
}

select.addEventListener('input', function (event) {
  const selectedTheme = event.target.value;
  console.log('Color scheme changed to', selectedTheme);
  
  document.documentElement.style.setProperty('color-scheme', selectedTheme);

  localStorage.colorScheme = selectedTheme;
});

const baseElement = document.createElement('base');
if (
  window.location.hostname === "127.0.0.1" 
  // ||
  // window.location.hostname === "localhost"
) {
  baseElement.href = "/";
} else {
  baseElement.href = "/portfolio/";
}
document.head.appendChild(baseElement);


export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);

      console.log(response);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();

      return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}


export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Clear the container before adding new project articles
  containerElement.innerHTML = '';

  // Loop through each project and create its article element
  projects.forEach(project => {
    // Check if the containerElement is valid
    if (!containerElement || !(containerElement instanceof HTMLElement)) {
      console.error('Invalid container element.');
      return;
    }

    // Create the article element for each project
    const article = document.createElement('article');
    article.classList.add('project');

    // Populate the article with project details using innerHTML
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
      ${project.link ? `<a href="${project.link}">See more details</a>` : ''}
    `;

    // Append the article to the container
    containerElement.appendChild(article);
  });
}


