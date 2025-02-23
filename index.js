import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('lib/projects.json');
    const projects = await response.json();

    // Sort projects by year in descending order
    const sortedProjects = projects.sort((a, b) => b.year - a.year);

    // Get the top 3 most recent projects
    const recentProjects = sortedProjects.slice(0, 3);

    // Render the recent projects
    const projectsContainer = document.querySelector('.projects');
    renderProjects(recentProjects, projectsContainer, 'h3');
  } catch (error) {
    console.error('Error loading projects:', error);
  }
});

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
  
loadGitHubData();

