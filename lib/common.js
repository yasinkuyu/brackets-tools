/*
 * Copyright (c) 2012 Yasin Kuyu - twitter.com/yasinkuyu. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, window, $, Mustache, navigator */

define(function (require, exports, module) {
    'use strict';
    
	//http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
	function shadeColor(color, percent)
	{
		color = color.replace(/#/,'');
		var num = parseInt(color,16),
		amt = Math.round(2.55 * percent),
		R = (num >> 16) + amt,
		B = (num >> 8 & 0x00FF) + amt,
		G = (num & 0x0000FF) + amt;
		return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
	}

	function lightColor(color) 
	{
		color = color.replace(/#/,'');
		var num = parseInt(color,16),
		R = (num >> 16),
		B = (num >> 8 & 0x00FF),
		G = (num & 0x0000FF);
		L = 0.2*R + 0.7*G + 0.1*B;
		return (L/255.0 > 0.5);
	}
    
                        
});
  
