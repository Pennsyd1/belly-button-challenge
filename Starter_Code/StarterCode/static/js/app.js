
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function Options(){
  d3.json(url).then(function(sample){
      
      var metadataID = sample.metadata.map(d=>d.id);
      console.log(metadataID);
      
      var DatasetInput = d3.select("#selDataset");
      metadataID.forEach(function(id){
          DatasetInput.append("option").attr('value',id).text(id);
      });
  });
}


d3.json(url).then(function(data) {
    console.log(data);
})

function init(){
  Options();
  plots("940");
  datadash("940");
}

function plots(selection){
  d3.json(url).then(function(sample){
      console.log("Data", sample);
        
      var topten = sample.samples.filter(function(t){
          return t.id == selection
      });
      console.log("Filtered Data:",topten);
        
      var otu_id = topten[0].otu_ids.slice(0,10).reverse().map(id=>id);
      var sample_value = topten[0].sample_values.slice(0,10).reverse();
      var otu_label = topten[0].otu_labels.slice(0,10).reverse()
      console.log("otu_label", otu_label);

      var data = [{
        type: 'bar',
        x: sample_value,
        y:otu_id.map(id=>"OTU"+id),
        text: otu_label,
        orientation: 'h'
      }];

      Plotly.newPlot("bar", data);

      var bub_data = [{
        x: otu_id,
        y:sample_value,
        mode: 'markers',
        marker: {
          size: sample_value,
          sizeref: 2,
          color: [100, 200, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300],
          colorscale: 'Viridis'
        },
        text: otu_label,
        type: 'scatter'
      }];

      var layout = {
        title: 'Bubble Chart',
        legend: true,
        xaxis: {title:"OTU ID"},
        height: 400,
        width: 1000
      };
      Plotly.newPlot("bubble", bub_data, layout);
  });
}

function datadash(selection) {
  d3.json(url).then(function(sample) {
    var dashdata = sample.metadata.filter(function(s) {
      return s.id == selection
    });
    d3.select('.panel-body').text('')
    Object.entries(dashdata[0]).forEach(([key, value])=> {
      d3.select('.panel-body').append('p').text(`${key}: ${value}`)
    })
  });
}

init()
function optionChanged(val){
  console.log("Selected",val);
  plots(val);
  datadash(val);
}