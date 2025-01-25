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
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
) {
  baseElement.href = "/";
} else {
  baseElement.href = "/portfolio/";
}
document.head.appendChild(baseElement);








