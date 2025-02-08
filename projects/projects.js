// import { fetchJSON, renderProjects } from '../global.js';
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";


// const projects = await fetchJSON('../lib/projects.json');
// const projectsContainer = document.querySelector('.projects');
// renderProjects(projects, projectsContainer, 'h2');
// let selectedIndex = -1;
// let query = '';

// let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener('input', (event) => {
//     query = event.target.value.toLowerCase();

//     let filteredProjects = projects.filter((project) => {
//         let values = Object.values(project).join('\n').toLowerCase();
//         return values.includes(query);
//     });

//     renderProjects(filteredProjects, projectsContainer, 'h2');
//     renderPieChart(filteredProjects);
// });

// function renderPieChart(projectsGiven) {
//     let newSVG = d3.select('svg');
//     newSVG.selectAll('path').remove();

//     let legend = d3.select('.legend');
//     legend.selectAll('*').remove();

//     let rolledData = d3.rollups(
//         projectsGiven,
//         (v) => v.length,
//         (d) => d.year,
//     );

//     let data = rolledData.map(([year, count]) => ({
//         value: count,
//         label: year,
//     }));

//     let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
//     let sliceGenerator = d3.pie().value((d) => d.value);
//     let arcData = sliceGenerator(data);
//     let arcs = arcData.map((d) => arcGenerator(d));
//     let colors = d3.scaleOrdinal(d3.schemeTableau10);

//     arcs.forEach((arc, i) => {
//         newSVG.append('path')
//             .attr('d', arc)
//             .attr('fill', colors(i)) 
//             .attr('class', 'pie-wedge')
//             .classed('selected', i === selectedIndex)
//             .on('click', () => {
//                 selectedIndex = selectedIndex === i ? -1 : i;
//                 if (selectedIndex == -1) {
//                     renderProjects(projectsGiven, projectsContainer, 'h2');
//                 } else {
//                     let selectedYear = data[selectedIndex].label;
//                     let filteredProjects = projectsGiven.filter((project) => project.year === selectedYear);
//                     renderProjects(filteredProjects, projectsContainer, 'h2');
//                 }
//                 renderPieChart(projectsGiven);

//             });
//     });

//     data.forEach((d, idx) => {
//         legend.append('li')
//             .attr('class', 'legend-item')
//             .attr('style', `--color:${colors(idx)}`)
//             .classed('selected', idx === selectedIndex)
//             .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
//     });

// }


// renderPieChart(projects);

import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let selectedIndex = -1;
let query = '';

async function loadProjects() {
    try {
        const projects = await fetchJSON('/portfolio/lib/projects.json'); // Corrected path
        if (!projects || projects.length === 0) {
            console.error('No projects found.');
            return;
        }

        const projectsContainer = document.querySelector('.projects');
        if (!projectsContainer) {
            console.error('Projects container not found.');
            return;
        }

        console.log('Projects:', projects); // Debugging: Log the projects to ensure they are loaded correctly

        renderProjects(projects, projectsContainer, 'h2');
        renderPieChart(projects);

        let searchInput = document.querySelector('.searchBar');
        searchInput.addEventListener('input', (event) => {
            query = event.target.value.toLowerCase();
            applyFilters(projects, projectsContainer);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function applyFilters(projects, projectsContainer) {
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        let matchesQuery = values.includes(query);
        let matchesYear = selectedIndex === -1 || project.year === data[selectedIndex].label;
        return matchesQuery && matchesYear;
    });

    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
}

function renderPieChart(projectsGiven) {
    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();

    let legend = d3.select('.legend');
    legend.selectAll('*').remove();

    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year,
    }));

    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    arcs.forEach((arc, i) => {
        newSVG.append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .attr('class', 'pie-wedge')
            .classed('selected', i === selectedIndex)
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;
                applyFilters(projectsGiven, document.querySelector('.projects'));
            });
    });

    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', 'legend-item')
            .attr('style', `--color:${colors(idx)}`)
            .classed('selected', idx === selectedIndex)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

loadProjects();
