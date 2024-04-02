import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Avatar() {
  const svgRef = useRef(null);
  const [csvData, setCsvData] = useState('');

  const handleCsvUpload = event => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => setCsvData(e.target.result);
    reader.readAsText(file);
  };

  useEffect(() => {
    if (!csvData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Prepare the drawing area

    const scaleX = d3.scaleLinear().domain([0, 1920]).range([0, 800]);
    const scaleY = d3.scaleLinear().domain([0, 1080]).range([0, 600]);

    

    const keypoints = d3.csvParse(csvData, d => ({
      name: d.Name,
      x: +d.X,
      y: +d.Y,
      score: +d.Score,
      timestamp: +d.Timestamp,
    })).sort((a, b) => a.timestamp - b.timestamp);

    // Assuming the animation starts at the timestamp of the first keypoint
    const animationStartTimestamp = keypoints[0].timestamp;

    keypoints.forEach(kp => {
      // Calculate the delay based on the difference from the first timestamp
      const delay = kp.timestamp - animationStartTimestamp;

      setTimeout(() => {
        const circle = svg.append("circle")
                          .attr("cx", scaleX(kp.x))
                          .attr("cy", scaleY(kp.y))
                          .attr("r", 5)
                          .attr("fill", "blue");

        // Transition for disappearing
        circle.transition()
              .duration(50) // Time until the start of the disappearing effect
              .attr("r", 5)  // Keep the same size, or animate to a different size before disappearing
              .transition()
              .duration(50) // Time for the disappearing effect
              .style("opacity", 0) // Fade out effect
              .remove(); // Remove the circle from the DOM after the transition
      }, delay);
    });

  }, [csvData]);

  return (
   
      <div className="App" style={{ backgroundImage: 'url(/stadium.png)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Upload CSV and Visualize Avatar</h2>
        <input type="file" accept=".csv" onChange={handleCsvUpload} />
        <svg ref={svgRef} width="800" height="600" style={{ border: "1px solid black" }}></svg>
      </div>
  );
}

export default Avatar;