import { fetchJSON, renderProjects } from '../global.js';

// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');

async function loadAndRenderProjects() {
    try {
        // Fetch the project data from the projects.json file
        const projects = await fetchJSON('../lib/projects.json');

        // Select the container where the project articles will be rendered
        const projectsContainer = document.querySelector('.projects');

        // Check if the container exists before rendering
        if (projectsContainer) {
            // Render the fetched projects with an <h2> heading level
            renderProjects(projects, projectsContainer, 'h2');
        } else {
            console.error('Projects container not found.');
        }
    } catch (error) {
        console.error('Error loading or rendering projects:', error);
    }
}

// Call the function to load and render the projects
loadAndRenderProjects();