function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    // 5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(sampleObj => "OTU " + sampleObj).slice(0,10).reverse();

    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
        x : sample_values.slice(0, 10).reverse(),
        y : yticks,
        type : "bar",
        orientation: "h",
        text : otu_labels.slice(0, 10).reverse(),
        font : {family: "Georgia", size: 10, color: "#000000"},
    }
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        font : {family: "Georgia", size: 14, color: "#000000"},
        paper_bgcolor: "#F2F2F2",
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 11. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode : "markers",
      text: otu_labels,
      font : {family: "Georgia", size: 11, color: "#000000"},
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Jet",
      },
  }];

    // 12. Create the layout for the bubble chart.
    var bubbleLayout = {
      xaxis: {title: "OTU ID"},
      title: "Bacteria Cultures per Sample",
      automargin: true,
      font : {family: "Georgia", size: 14, color: "#000000"},
      paper_bgcolor: "#F2F2F2",
    };

    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData, bubbleLayout);

    // 14. Create a variable that filters the metadata array for the object with the desired sample number. 
    var metadata = data.metadata;

    // 15. Filter the data for the object with the desired sample number
    var gaugeArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 16. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];

    // 17. Create a variable that holds the washing frequency & convert to floating point number
    var wfreqs = parseFloat(gaugeResult.wfreq);    
    
    // 18. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreqs,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency </b> <br></br> Scrubs Per Week"},
      font : {family: "Georgia", size: 14, color: "#000000"},
      gauge: {
        axis: {range: [null,10], dtick: "2"},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2,
      }
    }
    ];
    
    // 19. Create the layout for the gauge chart.
    var gaugeLayout = { 
      automargin: true,
      font : {family: "Georgia", size: 14, color: "#000000"},
      paper_bgcolor: "#F2F2F2",
    };

    // 20. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}