const svgWidth = 600;
const svgHeight = 400;
let metricScales;

const translateCenter = `translate(${svgWidth/2},${svgHeight/2})`;


const defineMetrics = () => {
    const maxSupp = d3.max(nodes, d => d.type === 'column' ? d.cumGain.support : d3.max(d.columns, c => c.cumGain.support));
    const maxSuppCount = d3.max(nodes, d => d.type === 'column' ? d.cumGain.supportCount : d3.max(d.columns, c => c.cumGain.supportCount));
    const maxConf = d3.max(nodes, d => d.type === 'column' ? d.cumGain.conf : d3.max(d.columns, c => c.cumGain.conf));
    const maxLift = d3.max(nodes, d => d.type === 'column' ? d.cumGain.lift : d3.max(d.columns, c => c.cumGain.lift));

    metricScales = metric => (
        // TODO: calculate domains from data
        {
            'support': d3.scaleLinear().domain([1, maxSupp]).range([5, 15]),
            'supportCount': d3.scaleLog().domain([1,maxSuppCount]).range([5, 15]),
            'conf': d3.scaleLog().domain([1,maxConf]).range([5, 15]),
            'lift': d3.scaleLog().domain([1,maxLift]).range([5, 15])
        }[metric]
    );
}

const translator = t => (
    {'Support': 'support', 'Support Count': 'supportCount', 'Confidence': 'conf', 'Lift': 'lift'}[t]
);

// one color for column (this limits the number of columns that can be shown)
const columnScale = d3.scaleOrdinal(d3.schemeCategory10);