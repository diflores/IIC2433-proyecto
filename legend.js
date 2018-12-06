const renderLegend = (svg, data) => {
    const columns = data.ids;
    const columnsIds = Object.keys(columns);

    const legendScale = d3.scaleBand()
        .rangeRound([15, columnsIds.length * 15])
        .domain(columnsIds)

    const legend = svg.append('g')
        .attr('class', 'legend')
        .style('font', '6pt open-sans regular');
    
    const texts = legend.selectAll('.text')
        .data(columnsIds)
        .enter()
        .append('text')
            .attr('x', svgWidth - 100)
            .attr('y', d => legendScale(d))
            .attr('fill', '#6c6c6c')
            .text(d => columns[d]);
    
    const rects = legend.selectAll('.rect')
        .data(columnsIds)
        .enter()
        .append('rect')
            .attr('x', svgWidth - 108)
            .attr('y', d => legendScale(d) - 5)
            .attr('fill', d => columnScale(d))
            .attr('width', 6)
            .attr('height', 6);
};
