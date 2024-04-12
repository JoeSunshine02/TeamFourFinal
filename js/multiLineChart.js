class MultiLineChart {

    /**
     * class constructor with basic chart configuration
     * @param {Object} _config 
     * @param {Array} _data 
     */
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 400,
            margin: _config.margin || { top: 50, right: 50, bottom: 50, left: 50 }
        };
        this.data = _data;
        const targetAreas = ["United States of America"];
        this.data = this.data.filter(obj => targetAreas.includes(obj.Area));
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chartG = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

            vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.3); // Some initial padding; /// Adjust padding here

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        vis.xAxisG = vis.chartG.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`);

        vis.yAxisG = vis.chartG.append('g')
            .attr('class', 'axis y-axis');

        // Add x-axis label
        vis.svg.append("text")
            .attr("transform", `translate(${vis.width / 2}, ${vis.height + vis.config.margin.top + 40})`)
            .style("text-anchor", "middle")
            .text("Year");

        // Add y-axis label
        vis.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 0 - (vis.height/2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Value");

        vis.marksG = vis.chartG.append('g');
    }

    updateVis(parameters) {
        let vis = this;

        // Update scales
        vis.xScale.domain(vis.data.map(d => d.Year));
        vis.yScale.domain([0, d3.max(vis.data, d => {
            return d3.max(parameters, parameter => d[parameter]);
        })]);
        vis.colorScale.domain(parameters);

        // Update axes
        vis.xAxisG.transition().call(vis.xAxis);
        vis.yAxisG.transition().call(vis.yAxis);

        // Update lines
        parameters.forEach(parameter => {
            const line = d3.line()
                .x(d => vis.xScale(d.Year))
                .y(d => vis.yScale(d[parameter]));

            let path = vis.marksG.selectAll(`.line-${parameter}`)
                .data([vis.data]);

            path.enter().append('path')
                .attr('class', `line line-${parameter}`)
                .merge(path)
                .attr('fill', 'none')
                .attr('stroke', vis.colorScale(parameter))
                .attr('stroke-width', 1.5)
                .attr('d', line);

            path.exit().remove();
        });
    }
}