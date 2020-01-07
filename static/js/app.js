function buildMetadata(year) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/position/${year}`;
  d3.json(url).then(function(response){
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_meta = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_meta.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
      sample_meta.append("p").text(`${key}: ${value}`);
    });
    console.log(sample_meta)
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

// function buildMetadata(year) {

//   // @TODO: Complete the following function that builds the metadata panel

//   // Use `d3.json` to fetch the metadata for a sample
//   var url = `/${department}/${year}`;
//   d3.json(url).then(function(response){
//     // Use d3 to select the panel with id of `#sample-metadata`
//     var sample_meta = d3.select("#sample-metadata");
//     // Use `.html("") to clear any existing metadata
//     sample_meta.html("");
//     // Use `Object.entries` to add each key and value pair to the panel
//     // Hint: Inside the loop, you will need to use d3 to append new
//     // tags for each key-value in the metadata.
//     Object.entries(response).forEach(([key, value]) => {
//       sample_meta.append("p").text(`${key}: ${value}`);
//     });
//     console.log(sample_meta)
//   });
//     // BONUS: Build the Gauge Chart
//     // buildGauge(data.WFREQ);
// };


function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/year").then((listYear) => {
      listYear.forEach((year) => {
        selector
          .append("option")
          .text(year)
          .property("value", year);
      });

    // Use the first sample from the list to build the initial plots
      const firstData = listYear[0];
      buildMetadata(firstData);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
  }

  // Initialize the dashboard
  init();