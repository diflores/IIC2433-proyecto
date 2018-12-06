const margin = {top: 30, right: 65, bottom: 100, left: 50};

const WIDTH = 800;
const HEIGHT = 680;

width =  WIDTH - margin.left - margin.right;
height = HEIGHT - margin.top - margin.bottom;

let updateScatterplot;
let fillScatterplot;
let deselectScatterplot;

const renderScatter = svg => {

    const div = d3.select("body").append("div")
        .attr("class", "tooltip")				
        .style("opacity", 0);

    const containerScatterplot = svg
        .attr("width", '90%').attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const verScale = d3.scaleLinear()
        .range([margin.top + height, margin.top])
        .domain([0, 1.1]);

    const horScale = d3.scaleLinear()
        .range([margin.left, width + margin.left])
        .domain([0, 1.1]);

    const yAxis = d3.axisLeft(verScale).ticks(5);
    const yAxisElement = containerScatterplot.append('g')
        .attr('class', 'axis axis--y')
        .attr('transform', `translate(${margin.left - 5}, 0)`);
    const xAxis = d3.axisBottom(horScale).ticks(5);
    const xAxisElement = containerScatterplot.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height + margin.top + 5})`);

    yAxisElement.call(yAxis);
    xAxisElement.call(xAxis);

    containerScatterplot.append("text")
        .attr("transform",
            "translate(" + (width / 2 + 40) + " ," +
            (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .attr("class", "axisname")
        .text("Confidence");

    containerScatterplot.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("class", "axisname")
        .text("Support");

    fillScatterplot = () => {
        nodes.filter(d => d.type === 'aggregator').forEach(d => {
            const circle = containerScatterplot.selectAll(`.circle.chromie-${d.id}`).data(d.rules);
            circle.enter()
                .append('circle')
                    .attr('class', `circle chromie-${d.id}`)
                    .attr('fill', 'orange')
                    .on('mouseover', handleMouseOver)
                    .on('mouseout', handleMouseOut)
                    .on('mousemove', moving)
                    .attr('cx', (d) => horScale(d.conf))
                    .attr('cy', (d) => verScale(d.support))
                    .attr('r', 5);
        })
    };

    deselectScatterplot = () => {
        containerScatterplot.selectAll('.circle')
            .transition()
            .duration(300)
            .attr('fill', 'orange');
    };

    updateScatterplot = (chromie) => {
        console.log('CHROMIE INCOMING');
        console.log(chromie);  // should be [{x:[{'col':, 'val':},...], y:[...], conf:, supp:, ...}, ...]
        containerScatterplot.selectAll('.circle')
            .transition()
            .duration(300)
            .attr('fill', 'orange');
        containerScatterplot.selectAll(`.circle.chromie-${chromie.id}`)
            .transition()
            .duration(300)
            .attr('fill', 'brown');
    };

    function handleMouseOver(d, i) {


        let textLength = 550;
        let contWidth = WIDTH;


        let circle = d3.select(this)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        let r = circle.attr('r');
        let cx = Math.floor(circle.attr('cx'));
        let cy = Math.floor(circle.attr('cy'));

        // DISGUSTING
        let xText = contWidth - (cx - r * 25) > textLength ? cx - r * 25 - 50 : cx - r * 25 - (textLength - (contWidth - (cx - r * 25))) - 50;

        // containerScatterplot.append("text")
        //     .attr('id', "t" + cx + "-" + cy + "-" + i)
        //     .attr('x', xText)
        //     .attr('y', cy - r * 2)
        //     .attr('textLength', textLength)
        //     .text(function () {
        //         console.log(d);
        //         return `${d.x} => ${d.y}` // Value of the text
        //     })
        //     .style("font-size", "34px");
        
        let tVal = '| ';
        d.x.forEach(c => {
            tVal += c.col + ': ' + c.val + ' | ';
        });
        tVal += '=> | '
        d.y.forEach(c => {
            tVal += c.col + ': ' + c.val + ' | ';
        });

        div.transition()
            .duration(200)
            .style('opacity', 0.9);
        div.html(tVal);

        // containerScatterplot.append("text")
        //     .attr('id', "t" + cx + "-" + cy + "-" + i)
        //     .attr('x', xText)
        //     .attr('y', cy - r * 2)
        //     .attr('textLength', textLength)
        //     .text(function () {
        //         console.log(d);
        //         return `${d.x[0]['col']} => ${d.y[0]['col']}` // Value of the text
        //     })
        //     .style("font-size", "34px");

    }

    function handleMouseOut(d, i) {

        let circle = d3.select(this)
            .attr('stroke', null);

        let r = circle.attr('r');
        let cx = Math.floor(circle.attr('cx'));
        let cy = Math.floor(circle.attr('cy'));

        // d3.select(`#t${cx}-${cy}-${i}`).remove();

        div.transition()
          .duration(200)
          .style('opacity', 0);

    }

    function moving() {
        div.style("left", (d3.event.pageX - 250) + "px")
          .style("top", (d3.event.pageY - 30) + "px");
      }

    fillScatterplot();
};
