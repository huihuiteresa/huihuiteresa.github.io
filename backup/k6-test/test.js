import http from 'k6/http';

export const options = {
  vus: 10,
  duration: '1000s',
};

export default function () {
  const payload = JSON.stringify({
	"detailVo": [{
		"reqlistLineId": 1825812,
		"lineNumber": 449,
		"quantity": 1.00000,
		"lotNumber": "CBLA011202603180004",
		"fromSubinventoryCode": "GL01",
		"fromLocator": "GL001",
		"toSubinventoryCode": "FL01",
		"toLocator": "QTA01",
		"approvedDate": "2026-03-24T14:33:08+08:00",
		"bottleGrade": null,
		"itemCode": "111201040001",
		"itemName": "进口酒花浸膏四氢异构",
		"transactionUom": "KG",
		"inBatchCode": "CBLA011202603180004"
	}],
	"id": 218728,
	"organizationCode": "LAC",
	"reqlistNo": "TAD2026032400012",
	"transactionType": "生产退料",
	"createdUserName": "mestest",
	"CommandFullName": "Siemens.SimaticIT.MasterData.ProductionFBLibrary.MSModel.Commands.ReturnMaterialsAndProductionCmd"
});

  const res = http.post(
    'http://192.168.88.132:55782/api/WMS/ReturnMaterialsAndProductionCmd',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  console.log(`${res.status} ${res.timings.duration}ms`);
}