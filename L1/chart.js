console.log("Hello world");

async function drawLineChart() {
	console.log("drawLineChart");
	const data = await d3.json("./my_weather_data.json");


	const dateParser = d3.timeParse("%Y-%m-%d");

	const yAccessor = d => d.temperatureMax;
	const y2Accessor = d=> d.temperatureMin;

	function xAccessor(d){
		return dateParser(d.date);
	}

	let dimensions = {
		width: window.innerWidth*0.9,
		height: 400,
		margin: {
			top: 15,
			right: 15,
			bottom: 40,
			left: 60
		}
	};

	dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	const wrapper = d3.select("#wrapper");
	const svg = wrapper.append("svg");
	svg.attr("width", dimensions.width);
	svg.attr("height", dimensions.height);

	const bounds = svg.append("g").style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

	const yScale = d3.scaleLinear()
						.domain(d3.extent(data, yAccessor))
						.range([dimensions.boundedHeight, 0]);

	const limitTemperatureVal= yScale(32);
	const limitTemperature = bounds.append("rect")
									.attr("x", 0)
									.attr("width", dimensions.boundedWidth)
									.attr("y", limitTemperatureVal)
									.attr("height", dimensions.boundedHeight - limitTemperatureVal)
									.attr("fill", "#eeeeee");


	const xScale = d3.scaleTime()
						.domain(d3.extent(data, xAccessor))
						.range([0, dimensions.boundedWidth]);


	const lineGenerator = d3.line()
							.x(d => xScale(xAccessor(d)))
							.y(d => yScale(yAccessor(d)));

	const lineGenerator2 = d3.line()
							.x(d => xScale(xAccessor(d)))
							.y(d => yScale(y2Accessor(d)));

	const line = bounds.append("path")
						.attr("d", lineGenerator(data))
						.attr("fill", "none")
						.attr("stroke", "#dafc2d")
						.attr("stroke-width", 2);

	const line2 = bounds.append("path")
						.attr("d", lineGenerator2(data))
						.attr("fill", "none")
						.attr("stroke", "#60f50a")
						.attr("stroke-width", 2);

	const yAxisGenerator = d3.axisLeft()
							.scale(yScale);

	const xAxisGenerator = d3.axisBottom()
							.scale(xScale);

	const yAxis = bounds.append("g")
						.call(yAxisGenerator);

	const xAxis = bounds.append("g")
						.call(xAxisGenerator)
						.style("transform", `translateY(${dimensions.boundedHeight}px)`);


	console.log(data);




}

drawLineChart();
