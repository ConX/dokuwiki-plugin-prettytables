/**
 * String manipulation function similar to 
 * Ruby's and pythons "repeat" build in functions.
 * @author szsk (http://snipplr.com/users/szsk/)
 **/
function repeat(text,num) {
	for( var i = 0, buf = ""; i < num; i++ ){
		buf += text;
	}
	return buf;
}

/**
 * String manipulation function similar to 
 * Ruby's and pythons "center" build in functions.
 * @author szsk (http://snipplr.com/users/szsk/)
 **/
function strcenter (text, width) {
	padding = " ";
	if( text.length < width ) { 
		var len = width - text.length;
		var remain = ( len % 2 === 0 ) ? "" : padding;
		var pads = repeat(padding, parseInt(len / 2, 10));
		return pads + text + pads + remain;
	}   
	else{

		return text;
	}
}

/**
 * Helper function that creates a map for the position
 * of headers (^) in the tables.
 * @author ConX <conx@xanthopoulos.info>
 **/
function mapHeaders(text){
	var row = [];
	for (var i=0; i<text.length; i++){
		text = text.replace(/\[\[.*\|.*\]\]/g, "");
		if (text.charAt(i) == '^'){
			row.push(1);
		}
		else if(text.charAt(i) == "|"){
			row.push(0);
		}
	}
	return row;
}

/**
 * The actual reformating function for the plugin
 * @param string sample		Table's source code
 * @author Constantinos Xanthopoulos <conx@xanthopoulos.info>
 **/
function fixTableFormat(text) {
	var lines =  text.split(/\n/);
	var table = [];
	var r = "";
	var map = [];
	var startre = /^[\^|]/;
	var linkre = /^[^\[|]*[\[]{2}[^\]]*[\]]{2}[^|\^]*/;
	var smileyre = /^[^\:]*[\:][\-][|][^|\^]*/;
	var regre = /^[^|\[\^]+/;
	for (var i=0;i<lines.length;i++){
		if (lines[i] !== ""){
			var c =[];
			var t = lines[i];
			var s;
			map.push(mapHeaders(lines[i]));
			if (t.match(startre)){
				t = t.substr(1);
				while (t.length != '0'){
					if ((s = t.match(linkre)) !== null){
						t = t.substr(s[0].length+1);
					}
					else if ((s = t.match(smileyre)) !== null){
						t = t.substr(s[0].length+1);
					}
					else{
						s = t.match(regre);
						t = t.substr(s[0].length+1);
					}
					s = s[0].replace(/^[ ]+/,"");
					s = s.replace(/[ ]+$/,"");
					c.push(s);
				}
				table.push(c);    
			}
			else{
				alert("Not a table");
				return null;
			}
		}            
	}
	var colsize = new Array(table[0].length);
	for (i=0;i<colsize.length;i++){
		colsize[i] = 0;
	}

	for (i=0;i<table.length;i++){
		for (j=0;j<table[i].length;j++){
			if (table[i][j].length > colsize[j]){
				colsize[j] = table[i][j].length;    
			}
		}
	}

	for (i=0;i<table.length;i++){
		for (j=0;j<table[i].length;j++){
			if (map[i][j] == 1){
				r = r + "^";
			}
			else{
				r = r + "|"; 
			}        
			r = r + strcenter(table[i][j],colsize[j]+4);
		}
		r = r + "|\n";
	}
	return r;

}

/**
 * Button action for prettytables
 *
 * @author Constantinos Xanthopoulos <conx@xanthopoulos.info>
 */
function addBtnActionPrettytables($btn, props, edid, id){
	$btn.click(function(){
			var selection = getSelection(jQuery('#'+edid)[0]);
			if(selection.getLength()){
				var sample = fixtxt(selection.getText());
				opts = {nosel: true};
				sample = fixTableFormat(sample);
				if (sample !== null){
					pasteText(selection,sample,opts);
				}
			}
			else{
				alert("No selection");
			}

			});
	return true;
}
