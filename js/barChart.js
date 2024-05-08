class BarChart {
    
    /**
     * class constructor with basic chart configuration
     * @param {Object} _config 
     * @param {Array} _data 
     */
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 900,
            containerHeight: _config.containerHeight || 250,
            margin: _config.margin || {top: 5, right: 5, bottom: 20, left: 40}
        };
        this.data = _data;
        this.colorScale= d3.scaleOrdinal(d3.schemeCategory10);
        
        const targetAreas = ["United States of America", "Germany", "China", "India", "Brazil", "Egypt"];
        this.data = this.data.filter(obj => targetAreas.includes(obj.Area));
        this.initVis();
        this.updateVis();
    }
    
    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        console.log(vis.width);
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append('svg')
            .attr('id', 'barchart') // ID of the svg element
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
        
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.2);
        
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]); 

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6)
            .tickSizeOuter(0);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', 0+60)
            .attr('y', 0)
            .attr('dy', '.71em')
            .text('Avg Value');




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
       let vis =this;
       vis.array =[];
       var data1={};
       
       const uniqueAreas = [...new Set(vis.data.map(obj => obj.Area))];
       console.log(uniqueAreas);

       for(let i=0; i<uniqueAreas.length;i++){
           let agriWasteAvg=0;
           let riceProdAvg=0;
           let foodProcesAvg=0;
           let pesticideAvg=0;
            let countryCount =0;

            vis.data.forEach(function(obj){
                if (obj.Area === uniqueAreas[i]) {

                    agriWasteAvg+=parseFloat(obj["Agrifood Systems Waste Disposal"]);
                    riceProdAvg += parseFloat(obj["Rice Cultivation"]);
                    foodProcesAvg+=parseFloat(obj["Food Processing"]);
                    pesticideAvg+=parseInt(obj["Pesticides Manufacturing"]);

                    countryCount+=1;
                };
            });
            data1={Area : uniqueAreas[i], agriWaste : agriWasteAvg/countryCount, riceProd : riceProdAvg/countryCount, 
                    foodProces : foodProcesAvg/countryCount, pesticide : pesticideAvg/countryCount};
            vis.array.push(data1);

        }
        console.log(data1);
        console.log(vis.array);

        vis.x = d3.scaleBand()
            .domain(vis.array.map(function (d) { return d.Area; }))
            .range([0, vis.width])
            .padding(0.1);

        vis.y = d3.scaleLinear()
            .domain([0, d3.max(vis.array, function (d) { return d3.max([d.agriWaste, d.riceProd, d.foodProces, d.pesticide]); })])
            //.nice()
            .range([vis.height, 0]);

        vis.colorScale.domain(vis.array.map(function(d) { return d.Area; }));
        vis.xScale.domain(vis.array.map(function(d, i) {return d.Area; }));
       // vis.yScale.domain([0, d3.max(vis.array, function(d) { return d.riceProd; })]);

        vis.renderVis();

    }
    renderVis() {
        let vis = this;

        // Add bars
        var categories = ["agriWaste", "riceProd", "foodProces", "pesticide"];
        console.log(vis.x.bandwidth());
        categories.forEach(function (category, i) {
            vis.svg.selectAll(".bar-" + category)
                .data(vis.array)
                .enter().append("rect")
                .attr("class", "bar bar-" + category)
                .attr('x', function (d) { return vis.x(d.Area) + vis.x.bandwidth() / 4 * (i + 1.5); })
                .attr("y", function (d) { return vis.y(d[category]); })
                .attr("width", vis.x.bandwidth() / 4)
                .attr("height", function (d) { return vis.height - vis.y(d[category]); })
                .attr("fill", vis.colorScale(category))

                .on('mouseover', function(event, d) {
                    d3.selectAll('.line')
                    .style('stroke-opacity', lineData => lineData.Area === d.key ? 1 : 0.1);
                    d3.select(this).attr('stroke', 'black') 
                    .attr('stroke-width', 2); 
                    vis.tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                    //in this function tool tip is intialized and displayed as per the mouse coordinates it is based on the mouse coordinates which is written as event page in above code 
                vis.tooltip.html(`
                    Area: ${d.Area}<br>
                    Category: ${category}<br>
                    Average Value: ${d[category].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`)

                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px')
                    .style('background-color', vis.colorScale(category))
                    .style('color', 'white');
                
                    d3.selectAll('.point')
                    .style('fill-opacity', bar => bar.Area === d.Area ? 1 : 0.1);
        
                })
               
                .on('mouseout', function() {
                    d3.select(this).attr('stroke-width', '0px');
                    vis.tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
                    d3.selectAll('.point').style('fill-opacity', 1);
                });
        });
       
        var legend = vis.svg.selectAll(".legend")
            .data(categories)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { 
                return "translate(" + (vis.width + -40) + "," + (vis.config.margin.top + i * 20+5) + ")"; 
            });

        legend.append("rect")
            .attr("x", 0)
            .attr("y", -10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d) { return vis.colorScale(d); });

        legend.append("text")
            .attr("x", 15)
            .attr("y", 0)
            .attr("dy", ".35em")
            .text(function(d) { return d; });


        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
       

}

/*
vis.yScale.domain([0, d3.max(vis.data, d => {
            return d3.max(parameters, parameter => d[parameter]);
        })]);
*/