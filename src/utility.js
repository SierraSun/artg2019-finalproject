import {nest, sum} from 'd3';

//Utility functions for parsing
function parseMusicData(d){
	return {
		artist: d.Artist,
    rank:d.Rank,
    song:d.Song,
    source:d.Source,
    year:d.Year
	}
}

function parseArtist(d){
	return {
		artist: d.Artist,
    freq:d.Freq
	}
}

export{
  parseMusicData,
  parseArtist
}
