import {nest, sum} from 'd3';

//Utility functions for parsing

function parseArtist(d){
	return {
		artist: d.Artist,
    freq:d.Freq
	}
}

function parseSpan(d){
	return {
		artist: d.Artist,
    yearstart:d.Yearstart,
		yearend:d.Yearend,
		careerspan:d.Careerspan
	}
}

function parseWords(d){
	return {
		artist: d.Artist,
		decade:d.Decade,
    rank:d.Rank,
		song:d.Song,
		uniwc:d.UniqueWordCount,
		wc:d.WordCount,
		year:d.Year
	}
}

function parseYear(d){
	return {
		year: d.year,
		keyword:d.keyword,
    totalword:d.totalword,
		rank:d.rank
	}
}


export{
  parseArtist,
	parseSpan,
	parseWords,
	parseYear
}
