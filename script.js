/**
 * String manipulation function similar to 
 * Ruby's and pythons "prettytables_repeat" build in functions.
 * @author szsk (http://snipplr.com/users/szsk/)
 **/
function getCharWidth(str){
    var bytesCount = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (/^[\u0000-\u00ff]$/.test(c)) {  //match ascii
            bytesCount += 1;
        } else { // assume all other chars has 2 ascii char width 
            bytesCount += 2;
        }
    }
    return bytesCount;
}
function prettytables_repeat(text,num) {
	for( var i = 0, buf = ""; i < num; i++ ){
		buf += text;
	}
	return buf;
}

// this function counts the spaces in front and behind a given text, returning an array with these two counts
function prettytables_count_spaces(text) {
  var a=0, b=0, leading=true;
  for (var i=0; i < text.length; i++) {
    if (text.substr(i,1)==' ') a++; else break;
  }
  for (var i=text.length-1; i >= 0; i--) {
    if (text.substr(i,1)==' ') b++; else break;
  }
  return [a,b];
}


/**
 * String manipulation function similar to 
 * Ruby's and pythons "center" build in functions.
 * @author szsk (http://snipplr.com/users/szsk/)
 **/
function prettytables_strcenter (text, width) {
     var txt_len = getCharWidth(text);
     var padding = " ";
     if( txt_len < width ) { 
          var len = width - txt_len;
          var remain = ( len % 2 === 0 ) ? "" : padding;
          var pads = prettytables_repeat(padding, parseInt(len / 2, 10));
          return pads + text + pads + remain;
     }   
     else{
          return text;
     }
}


/** Table representation object.
 * @author Constantinos Xanthopoulos <conx@xanthopoulos.info>
**/
function prettytable()
{
	this.orig_table = [];
	this.table =  [];
	this.map = [];

	/**
	 * Table parser function
	 *
	 **/
	this.parse =  function(text){
		this.orig_table = [];
		this.map = [];
		this.table = [];

		var lines =  text.split(/\n/);
		for (var i=0;i<lines.length;i++){
			if (lines[i] !== ""){
				var c =[];
				var mr = [];
				var t = this.encode(lines[i]);
				var s;
				if (t.match(/^[\^|]/)){
					while (t.length != '0'){
						s = t.match(/^[\^|]+/);
						mr.push(s[0]);
						t = t.substr(s[0].length);
						t = t.replace(/^[\n ]+/,"");
						if (t.length != 0){
							s = t.match(/^([^|\^]*)[\^|]/);
							t = t.substr(s[1].length);
							s = s[1].replace(/^[ ]+/,"");
							s = s.replace(/[ ]+$/,"");
							c.push(s);
						}
					}
					this.map.push(mr);
					this.table.push(c);    
					// original headings without trimming (for alignment)
					t = this.encode(lines[i]);
					c = [];
					while (t.length != '0'){
						s = t.match(/^[\^|]+/);
						t = t.substr(s[0].length);
						t  = t.replace(/^[\n]+/,"");
						if (t.length != 0){
							s = t.match(/^([^|\^]*)[\^|]/);
							t = t.substr(s[1].length);
							s = s[1];
							c.push(s);
						}
					}
					this.orig_table.push(c); 
				}
				else{
					alert(LANG.plugins.prettytables.not_a_table);
					return(null);
				}
			}            
		}
		return(this);
	};

	/**
	 * Helper function that replaces certain non table uses of
	 * the ^ and | symbols.
	 * @author Constantinos Xanthopoulos <conx@xanthopoulos.info>
	 **/
	this.encode =  function(line){
		line = line.replace(/[%]{2}[|][%]{2}/g, "%%!@#1#@!%%");
		line = line.replace(/[%]{2}[^][%]{2}/g, "%%!@#2#@!%%");
		line = line.replace(/([\[]{2}[^\]]*)[|]([^\]]*[\]]{2})/g, "$1!@#1#@!$2");
		return line
	};

	/** Invert the replacements made by encode.
	 * @author Constantinos Xanthopoulos <conx@xanthopoulos.info>
	 *
	 **/
	this.decode =  function(){
		for (var i=0;i<this.table.length;i++){
			for (var j=0;j<this.table[i].length;j++){
				t = this.table[i][j].replace(/[!][@][#][1][#][@][!]/g,"|");
				this.table[i][j] = t.replace(/[!][@][#][2][#][@][!]/g,"^");
			}
		}
	};

	/**
	 * Generate formated table
	 * @author ConX <conx@xanthopoulos.info>
         **/
	this.generate =  function(){
		var r = "";
		var colsize = new Array(this.table[0].length);
		this.decode();
		for (i=0;i<colsize.length;i++){
			colsize[i] = 0;
		}

		for (i=0;i<this.table.length;i++){
			for (j=0;j<this.table[i].length;j++){
				if (getCharWidth(this.table[i][j]) > colsize[j]){
					colsize[j] = getCharWidth(this.table[i][j]);    
				}
			}
		}

		var spaces=[];
		for (i=0;i<this.table.length;i++){
			for (j=0;j<this.table[i].length;j++){
				r = r + this.map[i][j];

				// left, right or center align?
				spaces = prettytables_count_spaces(this.orig_table[i][j]);
				if (spaces[0] >  1 && spaces[1] >  1) r = r + prettytables_strcenter(this.table[i][j],colsize[j]+4); // center
				if (spaces[0] >  1 && spaces[1] <= 1) r = r + prettytables_repeat(' ',colsize[j]-getCharWidth(this.table[i][j])+3) + this.table[i][j] + ' '; // right
				if (spaces[0] <= 1) r = r + ' ' + this.table[i][j] + prettytables_repeat(' ',colsize[j]-getCharWidth(this.table[i][j])+3); // left
			}
			if (i < this.table.length-1){
				r = r + this.map[i][j] +"\n";
			}
			else{
				r = r + this.map[i][j];
			}

		}
		return r;
	};
};


/**
 * Button action for prettytables
 *
 * @author Constantinos Xanthopoulos <conx@xanthopoulos.info>
 */
function addBtnActionPrettytables($btn, props, edid, id){
	$btn.click(function(){
			var selection = DWgetSelection(jQuery('#'+edid)[0]);
			if(selection.getLength()){
				var sample = fixtxt(selection.getText());
				opts = {nosel: true};
				var pt = new prettytable();
				pt.parse(sample);
				if (pt !== null){
					pasteText(selection,pt.generate(),opts);
				}
			}
			else{
				alert(LANG.plugins.prettytables.no_selection);
			}

		});
	return true;
}
