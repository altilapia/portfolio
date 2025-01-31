import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function loadProjects() {
  try {
    let jsonPath = 'lib/projects.json';
    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
    renderProjects(latestProjects, projectsContainer, 'h2');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

async function loadGitHubData() {
    try {
      const githubData = await fetchGitHubData('altilapia');
      console.log(githubData) 
      const profileStats = document.querySelector('#profile-stats');
      if (profileStats) {
        profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
        `;
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
    }
  }
  
loadProjects();
loadGitHubData();

