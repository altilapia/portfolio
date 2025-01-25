console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");

// navLinks.forEach(link => {
//   link.classList.remove("current");
// });

// const currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );
  
// if (currentLink) {
//     currentLink.classList.add("current");
//   }

let pages = [
    { url: '', title: 'Home' },
    { url: '/projects/index.html', title: 'Projects' },
    { url: '/contact/index.html', title: 'Contact' },
    { url: '/resume/resume.html', title: 'Resume' },

  ];

let nav = document.createElement('nav');
document.body.prepend(nav);


const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
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
    <label postion: absolute; class="color-scheme">
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



  








