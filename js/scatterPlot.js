class ScatterPlot {
    constructor(_config, _data, _colorScale) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 600,
            containerHeight: _config.containerHeight || 600,
            margin: _config.margin || { top: 25, right: 80, bottom: 80, left: 80 },
            tooltipPadding: _config.tooltipPadding || 15
        };
        this.data = _data;
        this.colorScale = _colorScale;
        const targetAreas = ["United States of America", "Germany", "China", "India", "Brazil", "Egypt"];
        this.data = this.data.filter(obj => targetAreas.includes(obj.Area));
        console.log(this.data);
        this.currentAttribute = 'Urban population';
        this.initVis();
        this.updateVis();
    }

    initVis() {
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Create the SVG container
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Main chart group
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Scales
        vis.xScale = d3.scaleLinear().range([0, vis.width]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);

        // Axis generators
        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6)
            .tickSizeOuter(0);
        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0);

        // Axis groups
        vis.xAxisG = vis.chart.append('g').attr('class', 'axis x-axis').attr('transform', `translate(0,${vis.height})`);
        vis.yAxisG = vis.chart.append('g').attr('class', 'axis y-axis');

        // Axis titles
        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0).attr('y', 25)
            .attr('dy', '0.71em')
            .text('Urban Population');
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('x', vis.width).attr('y', vis.height - 15)
            .attr('dy', '0.71em').style('text-anchor', 'end')
            .text(vis.currentAttribute);

        // Tooltip setup
        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('background-color', 'white')
            .style('border', '1px solid black')
            .style('padding', '5px');
    }

    updateVis() {
        let vis = this;
        vis.colorValue = d => d.Area;
        vis.xValue = d => d['Rural population'];
        vis.yValue = d => d['Urban population'];

        vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
        vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

        // Create a dropdown for attributes
        const specifiedAttributes = ['Savanna fires', 'Rice Cultivation', 'Food Household Consumption', 'On-farm Electricity Use', 'Food Processing', 'Agrifood Systems Waste Disposal', 'Pesticides Manufacturing'];
        const dropdown = document.getElementById('attribute-selector');
        dropdown.innerHTML = '';
        specifiedAttributes.forEach(attr => {
            const option = document.createElement('option');
            option.value = attr;
            option.textContent = attr;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', function () {
            vis.updateData(this.value);
        });

        vis.renderVis();
    }

    updateData(attribute) {
        let vis = this;
        vis.xValue = d => d[attribute];
        vis.currentAttribute = attribute;

        // Update axis title
        vis.chart.selectAll('.axis-title').remove();
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('x', vis.width).attr('y', vis.height - 15)
            .attr('dy', '0.71em').style('text-anchor', 'end')
            .text(vis.currentAttribute);

        // Update xScale with new data
        vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // Draw the points (bubbles)
        const bubbles = vis.chart.selectAll('.point')
            .data(vis.data)
            .join('circle')
            .attr('class', 'point')
            .attr('r', 4)
            .attr('cx', d => vis.xScale(vis.xValue(d)))
            .attr('cy', d => vis.yScale(vis.yValue(d)))
            .attr('fill', d => vis.colorScale(vis.colorValue(d)))
            // Mouseover event to highlight point
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr('r', 8)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1.5);
                vis.tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                vis.tooltip.html(`
                    Area: ${d.Area}<br>
                    ${vis.currentAttribute.replace(/_/g, ' ')}: ${d[vis.currentAttribute]}<br>
                    Rural Population: ${d['Rural population'].toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}<br>
                    Urban Population: ${d['Urban population']}<br>
                    Year: ${d['Year']}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
                    //highlighting the bar in the bar chart 
                d3.selectAll('.bar')
                .style('fill-opacity', bar => bar.Area === d.Area ? 1 : 0.1);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr('r', 4)
                    .attr('stroke', 'none');
                vis.tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);

                d3.selectAll('.bar').style('fill-opacity', 1);
                
            });

        // Update axes with ticks and lines
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

        // Add legend items
        vis.legend = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width - 100},${vis.config.margin.top})`);

        vis.colorScale.domain().forEach((area, i) => {
            let legendItem = vis.legend.append('g')
                .attr('class', 'legend-item')
                .attr('transform', `translate(0,${i * 20})`);

            legendItem.append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', vis.colorScale(area));

            legendItem.append('text')
                .attr('x', 15)
                .attr('y', 7)
                .text(area);
        });
    }
}
