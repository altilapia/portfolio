let data = [];
let commits = [];

async function loadData() {
  try {
    // const isGitHubPages = window.location.hostname === 'altilapia.github.io';
    // const csvPath = isGitHubPages ? '/portfolio/meta/loc.csv' : './loc.csv';
    
    data = await d3.csv('./loc.csv', (row) => ({
      ...row,
      line: Number(row.line), 
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
    console.log('Data loaded:', data);
    displayStats(); 
  } catch (error) {
    console.error('Error loading file:', error);
  }
}

function processCommits() {
  const baseUrl = 'https://github.com/altilapia/portfolio/commit/'; 

  commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: baseUrl + commit, 
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };
      Object.defineProperty(ret, 'lines', {
        value: lines,
        configurable: true,
        writable: true,
        enumerable: true,
      });

      return ret;
    });
  console.log('Commits processed:', commits);
}

function displayStats() {
  processCommits();

  // create the dl element
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
  dl.append('dd').text(data.length);

  dl.append('dt').text('Total commits');
  dl.append('dd').text(commits.length);

  const numFiles = new Set(data.map(d => d.file)).size;
  dl.append('dt').text('Number of files');
  dl.append('dd').text(numFiles);

  const maxFileLength = d3.max(data, d => d.line);
  dl.append('dt').text('Maximum file length (in lines)');
  dl.append('dd').text(maxFileLength);

  const avgFileLength = d3.mean(data, d => d.line);
  dl.append('dt').text('Average file length (in lines)');
  dl.append('dd').text(avgFileLength.toFixed(2));

  const maxDepth = d3.max(data, d => d.depth);
  dl.append('dt').text('Maximum depth');
  dl.append('dd').text(maxDepth);

  const longestLineLength = d3.max(data, d => d.length);
  dl.append('dt').text('Longest line length');
  dl.append('dd').text(longestLineLength);

  const workByPeriod = d3.rollups(
    data,
    (v) => v.length,
    (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
  );
  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
  dl.append('dt').text('Usually Worked On');
  dl.append('dd').text(maxPeriod);
}

function updateTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');

  if (Object.keys(commit).length === 0) {
    link.href = '';
    link.textContent = '';
    date.textContent = '';
    time.textContent = '';
    author.textContent = '';
    lines.textContent = '';
    return;
  }

  link.href = commit.url;
  link.textContent = commit.id;
  date.textContent = commit.datetime?.toLocaleString('en', {
    dateStyle: 'full',
  });
  time.textContent = commit.datetime?.toLocaleString('en', {
    timeStyle: 'short',
  });
  author.textContent = commit.author;
  lines.textContent = commit.totalLines;
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX + 10}px`; 
  tooltip.style.top = `${event.clientY + 10}px`; 
}
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  createScatterplot();
});

function createScatterplot() {
  if (commits.length === 0) {
    console.error('No commits data available for scatterplot.');
    return;
  }

  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };

  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([usableArea.left, usableArea.right])
    .nice();

  const yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.bottom, usableArea.top]);

  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);

  gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

  const xAxis = d3.axisBottom(xScale)
    .ticks(d3.timeDay.every(3)) 
    .tickFormat(d3.timeFormat('%b %d'));

  const yAxis = d3.axisLeft(yScale).tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

  svg.append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

  svg.append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

  const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

  // use a square root scale 
  const rScale = d3
    .scaleSqrt()
    .domain([minLines, maxLines])
    .range([2, 30]); 

  // sort commits first by total lines
  const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

  const dots = svg.append('g').attr('class', 'dots');

  dots
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', (d) => rScale(d.totalLines)) 
    .attr('fill', 'steelblue')
    .style('fill-opacity', 0.7) 
    .attr('stroke', 'transparent') 
    .attr('stroke-width', 10) 
    .on('mouseenter', function (event, commit) {
      d3.select(event.currentTarget).style('fill-opacity', 1); 
      updateTooltipContent(commit);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mousemove', (event) => {
      updateTooltipPosition(event);
    })
    .on('mouseleave', function () {
      d3.select(event.currentTarget).style('fill-opacity', 0.7); 
      updateTooltipContent({});
      updateTooltipVisibility(false);
    });
}