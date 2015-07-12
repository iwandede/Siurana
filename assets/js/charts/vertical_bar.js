function getVerticalBar(data) {

	var data = [];
	var width = 800;
	var height = 600;

	function my (container) {


		var margin = {top: 20, right: 25, bottom: 60, left: 50},
			widthChart = width - margin.left - margin.right,
			heightChart = height - margin.top - margin.bottom;

		var xScale = d3.scale.ordinal()
			.rangeRoundBands([0, widthChart], .1);

		var yScale = d3.scale.linear()
			.rangeRound([heightChart, 0]);

		var typeColor = function (type) {
			switch (type) {
				case 'Sport lead':	return 'gold';
				case 'Boulder':		return 'lightskyblue';
				case 'Traditional':	return 'lightgreen';
				case 'Multi-pitch':	return 'sandybrown';
				case 'Top rope':	return 'lightgray';
				default :			return 'lightgray';
			};
		};

		var formatMonth = function (value) {
			var month = [];
			month[1] = "Jan"; month[2] = "Feb";
			month[3] = "Mar"; month[4] = "Apr";
			month[5] = "May"; month[6] = "Jun";
			month[7] = "Jul"; month[8] = "Aug";
			month[9] = "Sep"; month[10] = "Oct";
			month[11] = "Nov";month[12] = "Dec";

			return month[parseInt(value)];
		};

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left")
			.tickFormat(d3.format("d"));

		//REMOVE SVG
		container.select("svg").remove();

		// CREATE NEW SVG
		var svg = container.append("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var div = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);


		// Create Domains
		var maxRoutes = 0;

		for (var i = 0 ; i < data.length ; i ++) {
			var month = data[i];

			var totalRoutes = 0;
			for (var j = 0 ; j < month.type.length ; j ++) {
				totalRoutes += month.type[j].sum;
			}
			maxRoutes = Math.max(maxRoutes,totalRoutes);
		}

		var currentDate = new Date();
		var xDomain = [];

		for (var i =0 ; i < 12 ; i ++) {
			var string = String(currentDate.getMonth()+1) + String(currentDate.getFullYear());
			string = currentDate.getMonth() < 9 ? '0'+string : string;
			xDomain.push(string);
			currentDate.setMonth(currentDate.getMonth() -1);
		}


		xScale.domain(xDomain.reverse());
		yScale.domain([0, maxRoutes]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + heightChart + ")")
			.call(xAxis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-65)")
			.text( function (d) { 
				var month = d.substr(0,2);
				var year = d.substr(4,6);
				return formatMonth(month) + '-' + year;
			});

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Climbs");

		var barsX = svg.selectAll(".date")
			.data(data)
			.enter().append("g")
			.attr("class", "g")
			.attr("transform", function(d) {
				return "translate(" + xScale(d.date) + ",0)"; 
			});

		barsX.selectAll("rect")
			.data(function(d) { return d.type })
			.enter().append("rect")
			.attr("width", xScale.rangeBand())
			.attr("y", function(d) { return yScale(d.y1); })
			.attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); })
			.style("fill", function (d) { return typeColor(d.name); } )
			.style("fill-opacity","0.6")
			.on("mousemove", function(d) { 

				div.style("background",typeColor(d.name));   
				div.style("border","1px solid black");
				div.transition().duration(200).style("opacity", .8);
				div.html(d.sum + ' ' +d.name);
				div.style("font-weight","bold");
				div.style("color","black");
				div.style("left", (event.pageX) + "px");
				div.style("top", (event.pageY-20)  + "px");

			})
			.on("mouseout", function(d) {       
				div.transition()        
				.duration(800)      
				.style("opacity", 0);   
			});


		svg.selectAll('.axis line, .axis path')
			.style({
				'stroke': 'Black',
				'fill': 'none',
				'stroke-width': '1px',
				'shape-rendering':'crispEdges'
			});


		return my;
	};

	my.data = function (value) {
		if (!arguments.length) {
			return data;
		}
		data = value;
		return my;
	};

	my.width = function(value) {
		if (!arguments.length) {
			return width;
		}
		width = value;
		return my;
	};

	my.height = function(value) {
		if (!arguments.length) {
			return height;
		}
		height = value;
		return my;
	};
	return my;
}