class ScatterPlot {
    constructor(_config, _data, _colorScale) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 600,
            margin: _config.margin || {top: 25, right: 80, bottom: 80, left: 80},
            tooltipPadding: _config.tooltipPadding || 15
        };
        this.data = _data;
        this.colorScale = _colorScale;
        const targetAreas = ["United States of America", "Germany", "China", "India", "Brazil", "Egypt"];
        this.data = this.data.filter(obj => targetAreas.includes(obj.Area));
        console.log(this.data);
        this.initVis();
        this.updateVis();
    }

    initVis() {
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        
        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        
        vis.xScale = d3.scaleLinear().range([0, vis.width]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0);

        vis.xAxisG = vis.chart.append('g').attr('class', 'axis x-axis').attr('transform', `translate(0,${vis.height})`);
        vis.yAxisG = vis.chart.append('g').attr('class', 'axis y-axis');

        vis.svg.append('text').attr('class', 'axis-title').attr('x', 0).attr('y', 25).attr('dy', '0.71em').text('Rural Population');
        vis.chart.append('text').attr('class', 'axis-title').attr('x', vis.width).attr('y', vis.height - 15).attr('dy', '0.71em').style('text-anchor', 'end').text('Urban Population');
    }

    updateVis() {
        let vis = this;
        vis.colorValue = d => d.Area;
        vis.xValue = d => d['Rural population'];
        vis.yValue = d => d['Urban population'];

        vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
        vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

        const specifiedAttributes = ['Savanna fires', 'Rice Cultivation', 'Food Household Consumption', 'On-farm Electricity Use', 'Food Processing'];
        const dropdown = document.getElementById('attribute-selector');
        dropdown.innerHTML = '';  
        specifiedAttributes.forEach(attr => {
            const option = document.createElement('option');
            option.value = attr;
            option.textContent = attr;
            dropdown.appendChild(option);
        });

        
        dropdown.addEventListener('change', function() {
            vis.updateData(this.value);
        });

        vis.renderVis();
    }

    updateData(attribute) {
        let vis = this;

        // Update xValue function to reflect the new attribute
        vis.xValue = d => d[attribute];

        // Recalculating  domain based on new data
        vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
        
        // Update the chart
        vis.renderVis();
    }

    renderVis() {
        let vis = this;
        
        const bubbles = vis.chart.selectAll('.point')
            .data(vis.data)
            .join('circle')
            .attr('class', 'point')
            .attr('r', 4)
            .attr('cx', d => vis.xScale(vis.xValue(d)))
            .attr('cy', d => vis.yScale(vis.yValue(d)))
            .attr('fill', d => vis.colorScale(vis.colorValue(d)));

        vis.xAxisG.call(vis.xAxis).call(g => g.select('.domain').remove());
        vis.yAxisG.call(vis.yAxis).call(g => g.select('.domain').remove());
    }
}
