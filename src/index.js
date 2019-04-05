import './stylesheet.css'; //how you import css into the homepage
import * as d3 from 'd3';

import {
  musicDataPromise,
  artistsFreqPromise,
  artistsSpanPromise
} from './data';

 // import script from viewModules
import BarChart from './viewModules/Chart1-NumberperArtist.js';
import GanttChart from './viewModules/Chart2-CareerSpan.js';
