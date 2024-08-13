import { Spot, ResponseStore, Response, ResponseBody, ResponseDetails } from './spot';
import { Grid } from "gridjs";

type siteDataArray = string[][];
let siteData: siteDataArray = [];
let grid: Grid | null = null;

// Define the updateTable function
export function updateTable(parsedResponse: ResponseStore) {
  // Extract the response details from the parsed response
  const responseDetails = parsedResponse.response.data?.responseDetails;

  // Transform the response details into an array of type siteDataArray
  const transformedData: siteDataArray = responseDetails?.map((detail) => [
    detail.patId,
    detail.organoidId,
    detail.therapy.toString(),
    detail.therapyType,
  ]) ?? [];
  
  if (siteData.length == 0) {
    siteData = transformedData;
    renderTable(siteData);  
  } else if (siteData.length > 0 && grid){
    siteData = siteData.concat(transformedData);
    grid.updateConfig({
      data: siteData
    });
  }  
}

// Create a new Spot instance
const url = new URL('');
const sites = [''];
const spot = new Spot(url, sites);

const payload = JSON.stringify({ payload: "SELECT_TABLES" });
const query = btoa(payload);

// Create an AbortController to cancel the request if needed
const controller = new AbortController();

// Send the query
spot.send(query, controller).then(() => {
  console.log('Query sent successfully');
}).catch((err) => {
  console.error('Error sending query:', err);
});


function renderTable(siteData: siteDataArray) {
  const tableElement = document.getElementById("table");
  if (tableElement) {
    tableElement.innerHTML = '';
    grid = new Grid({
      columns: ["Pat.ID", "Organoid.ID", "Therapy", "Type of Therapy"],
      data: siteData,
      sort: true,
      pagination: {
        limit: 30
      },
      search: true,
    }).render(tableElement);
  } else {
    console.error("Element with id 'table' not found");
  }
}

// Example usage of the updateTable function
// spot.send will call this function internally when it receives new data
// but you can also call it manually for testing purposes
const exampleParsedResponse: ResponseStore = {
  site: 'site1', 
  response: {
  status: 'succeeded',
  data: { date: '2023-03-01', responseDetails: [
      {
        "patId": "NeoM-M1-01",
        "organoidId": "NeoM-M01-t1-T0",
        "therapy": true,
        "therapyType": "epigenetic editing"      
      }  
    ]},
  }
};
updateTable(exampleParsedResponse);

const exampleParsedResponse2: ResponseStore = {
  site: 'site2', 
  response: {
  status: 'succeeded',
  data: { date: '2023-03-01', responseDetails: [
      {
        "patId": "NeoM-F1-02",
        "organoidId": "NeoM-F01-t1-T0",
        "therapy": true,
        "therapyType": "genetic editing"      
      }  
    ]},
  }
};
updateTable(exampleParsedResponse2);