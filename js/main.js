d3.tsv('Agrofood_co2_emission.csv').then(data => {
    data.forEach(d => {
        d.diameter = +d['Diameter (km)'];
        d.distance = +d['Distance (km)'];
        d.revolution = +d['Revolution (day)'];
    });

    const width = 800, height = 600;

    const svg = d3.select('.div-chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`);

    const plotG = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

// Create a group for the scatter plot
const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Define scales
const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, innerWidth]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([innerHeight, 0]);

// Create circles for data points
g.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 5);

// Add x-axis
g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale));

// Add y-axis
g.append("g")
    .call(d3.axisLeft(yScale));

})