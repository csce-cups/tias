import hsluv from 'hsluv';
const colorFromId = (linkID: number) => {
	const ret = hsluv.hsluvToRgb([
		linkID*35 % 361,
		100 - Math.floor(linkID*21 / 361)*31 % 80,
		60 + 10*(linkID*4 % 7 - 3)
	])

	return {
		r: ret[0] * 255,
		g: ret[1] * 255,
		b: ret[2] * 255,
		l: 60 + 10*(linkID*4 % 7 - 3)
	}
}

export default colorFromId;