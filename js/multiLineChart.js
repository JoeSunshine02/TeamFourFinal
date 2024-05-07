class MultiLineChart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 90,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || { top: 50, right: 50, bottom: 50, left: 50 }
        };
        this.fullData = _data;
        this.data = [];
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        // Create an SVG container
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Add the main chart group
        vis.chartG = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        // Set up scales
        vis.xScale = d3.scaleTime()
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Create axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        // Append axis groups
        vis.xAxisG = vis.chartG.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);

        vis.yAxisG = vis.chartG.append('g')
            .attr('class', 'axis y-axis');

        // Group for lines and tooltips
        vis.marksG = vis.chartG.append('g');

        // Tooltip setup
        vis.tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Add a legend group
        vis.legendG = vis.svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width - 150}, 30)`);

        // Initially, all lines are shown
        vis.activeLines = {};
    }

    updateVis(parameters) {
        let vis = this;

        // Update scales
        vis.xScale.domain(d3.extent(vis.data, d => d.Year));
        vis.yScale.domain([0, d3.max(vis.data, d => d3.max(parameters, parameter => d[parameter]))]);
        vis.colorScale.domain(parameters);

        // Update axes
        vis.xAxisG.transition().call(vis.xAxis);
        vis.yAxisG.transition().call(vis.yAxis);

        // Initialize activeLines to show all parameters by default
        parameters.forEach(p => {
            if (vis.activeLines[p] === undefined) vis.activeLines[p] = true;
        });

        // Create line generator function
        const lineGenerator = (parameter) => d3.line()
            .x(data => vis.xScale(data.Year))
            .y(data => vis.yScale(data[parameter]));

        // Bind data to lines
        const lines = vis.marksG.selectAll('.line')
            .data(parameters.filter(p => vis.activeLines[p]));

        // Enter & update paths
        lines.enter().append('path')
            .attr('class', 'line')
            .merge(lines)
            .attr('fill', 'none')
            .attr('stroke', d => vis.colorScale(d))
            .attr('stroke-width', 1.5)
            .attr('d', d => lineGenerator(d)(vis.data))
            .on('mouseover', function (event, d) {
                d3.select(this).attr('stroke-width', 3); // Highlight the line
                vis.tooltip.transition().duration(200).style('opacity', 0.9);
                vis.tooltip.html(`<strong>${d}</strong>`)
                    .style('left', (event.pageX + 5) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                d3.select(this).attr('stroke-width', 1.5); // Revert to normal width
                vis.tooltip.transition().duration(500).style('opacity', 0);
            })
            .on('click', function () {
                d3.selectAll('.line').attr('stroke-opacity', 0.2); // Dim all lines
                d3.select(this).attr('stroke-opacity', 1).attr('stroke-width', 3); // Highlight clicked line
            });

        // Remove old lines
        lines.exit().remove();

        // Add a legend with clickable items
        const legendItems = vis.legendG.selectAll('.legend-item')
            .data(parameters);

        // Enter & update legend items
        const legendEnter = legendItems.enter().append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`)
            .on('click', function (event, d) {
                vis.activeLines[d] = !vis.activeLines[d]; // Toggle visibility
                vis.updateVis(parameters); // Re-render
            });

        legendEnter.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', d => vis.colorScale(d))
            .attr('opacity', d => (vis.activeLines[d] ? 1 : 0.2));

        legendEnter.append('text')
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '0.35em')
            .text(d => d);

        // Update existing legend items
        legendItems.select('rect')
            .attr('opacity', d => (vis.activeLines[d] ? 1 : 0.2));

        legendItems.select('text')
            .text(d => d);

        legendItems.exit().remove();
    }

    filterDataByCountry(country) {
        this.data = this.fullData.filter(d => d.Area === country);
        this.updateVis(["Savanna fires", "Forest fires", "Crop Residues", "Rice Cultivation", "Pesticides Manufacturing"]);
    }
}
