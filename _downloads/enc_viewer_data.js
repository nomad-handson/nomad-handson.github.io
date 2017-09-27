function apiReq(materialId, dataType, authToken, callback){
  let oReq = new XMLHttpRequest();
  oReq.addEventListener("load", callback);
  oReq.open("GET", "https://encyclopedia-api.nomad-coe.eu/v1.0/materials/"+materialId+"/"+dataType);
  oReq.setRequestHeader('Authorization', 'Basic '+btoa(authToken));
  oReq.send();
  return oReq;
}


function getMaterialStructureDataFromAPI(materialId, authToken, callback){

	apiReq(materialId, 'elements', authToken, e => {
		let elements = JSON.parse(e.target.response).results;

		apiReq(materialId, 'cells', authToken, e1 => {
			let cells = JSON.parse(e1.target.response).results;
			let cell;
			if (!cells[0].is_primitive) cell= cells[0];
			else cell= cells[1];

			callback(getCellDataForViewer(elements, cell));
		});
	});
}


function getNumberArray(string){
  let sArray= string.substring(1,string.length-1).split(',');
  let fArray= [];
  for (let i = 0; i < sArray.length; i++) {
    fArray.push(parseFloat(sArray[i]));
  }
  return fArray;
}


function getCellDataForViewer(elements, cell){
  let cellData= {};
  cellData.normalizedCell= [
    getNumberArray(cell.a),
    getNumberArray(cell.b),
    getNumberArray(cell.c)
  ];

  cellData.labels= [];
  cellData.positions= [];

  for (let i = 0; i < elements.length; i++) {
    cellData.labels.push(elements[i].label);
    cellData.positions.push(getNumberArray(elements[i].position));
  }

  //cellData.periodicity = JSON.parse(matData.periodicity);

  return cellData;
}
