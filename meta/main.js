<script src="https://d3js.org/d3.v7.min.js"></script>

let data = [];

async function loadData() {
  data = await d3.csv('loc.csv');
//   console.log(data);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));
  }

let commits = d3.groups(data, (d) => d.commit);
console.log(commits);