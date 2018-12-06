let deselectChromie;

function forceSimulation(nodes, links) {
    return d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-200))
        .force('collision', d3.forceCollide(20))
        .force("center", d3.forceCenter());
}

// simulation tick management
const ticked = () => {

    d3.selectAll('line.link')
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    d3.selectAll('g.node')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
};


const radius = nsupp => {

    return metricScales('support')(nsupp);

};

const sectorGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(d => radius(d.data.cumGain.support))
    .startAngle(d => d.startAngle)
    .endAngle(d => d.endAngle);

const renderLinks = svg => {
    svg.append("g")
        .attr("stroke", "#999")
        .attr('transform', translateCenter)
        .selectAll("line.link")
        .data(links)
        .enter().append("line")
        .attr('class', 'link')
        .attr("stroke-width", 2);
};

const renderNodes = svg => {
    const simulation = forceSimulation(nodes)
    // create a link force and allow node initial
    // node reference by node id
        .force('link', d3.forceLink(links).id(d => d.id))
        .on("tick", ticked);
        
    const rNodes = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr('transform', translateCenter)
        .selectAll("g.node")
        .data(nodes)
        .enter().append("g")
        .attr('class', node => `node ${node.type}`)
        .call(drag(simulation));

    rNodes.filter(d => d.type === 'column')
        .append("circle")
        .attr("r", d => radius(d.cumGain.support))
        .attr("fill", d => columnScale(d.id))
        .attr("stroke-width", 0)
        // .on('mouseover', nodeHover)
        // .on('click', nodeClick)
        .append("title")
        .text(node => node.id);

    const pie = d3.pie().sort(null).value(() => 1);

    rNodes.filter(d => d.type === 'aggregator').on('click', d => {
        rNodes.transition()
            .duration(300)
            .style('opacity', 1);

        rNodes.filter(c => d.id !== c.id && d.columns.filter(e => e.id === c.id).length === 0)
            .transition()
            .duration(300)
            .style('opacity', 0.1);

        updateScatterplot(d);
    });

    rNodes.filter(d => d.type === 'aggregator')
        .selectAll('.sector')
        .data(d => pie(d.columns))
        .enter().append('path')
            .attr('class', 'sector')
            .attr('d', d => sectorGenerator(d))
            .attr('fill', d => columnScale(d.data.id))
            .attr('stroke-width', 0);
    
    deselectChromie = () => {
        rNodes.transition()
            .duration(300)
            .style('opacity', 1);
        
        deselectScatterplot();
    };
};

const renderGraph = (_, svg) => {


    svg.call(renderLinks);

    svg.call(renderNodes)

};
