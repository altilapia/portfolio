import { fetchJSON, renderProjects } from '../global.js';


async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');

        if (!projects) {
            console.error('No projects found.');
            return;
        }

        const projectsContainer = document.querySelector('.projects');
        if (!projectsContainer) {
            console.error('Projects container not found.');
            return;
        }

        renderProjects(projects, projectsContainer, 'h2');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

loadProjects(); // Immediately invoke the function
