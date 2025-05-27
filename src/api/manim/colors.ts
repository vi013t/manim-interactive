export let colors = [
	["#C7E9F1", "#9CDCEB", "#58C4DD", "#29ABCA", "#236B8E"],
	["#ACEAD7", "#76DDC0", "#5CD0B3", "#55C1A7", "#55C1A7"],
	["#C9E2AE", "#A6CF8C", "#83C167", "#77B05D", "#699C52"],
	["#FFF1B6", "#FFEA94", "#FFFF00", "#F4D345", "#E8C11C"],
	["#F7C797", "#F9B775", "#F0AC5F", "#E1A158", "#C78D46"],
	["#F7A1A3", "#FF8080", "#FC6255", "#E65A4C", "#CF5044"],
	["#ECABC1", "#EC92AB", "#C55F73", "#A24D61", "#94424F"],
	["#CAA3E8", "#B189C6", "#9A72AC", "#715582", "#644172"],
];

export function getDefaultStrokeColor(objectType: string) {
	return (
		{
			Circle: "#FC6255",
			Ellipse: "#FC6255",
			Star: "#58C4DD",
			Triangle: "#58C4DD",
			Polygon: "#58C4DD",
		}[objectType] ?? "#FFFFFF"
	);
}
