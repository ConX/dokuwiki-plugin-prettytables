/**
 * String manipulation function similar to 
 * Ruby's and pythons "prettytables_repeat" build in functions.
 * @author szsk (http://snipplr.com/users/szsk/)
 **/
function prettytables_repeat(text,num) {
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
function prettytables_strcenter (text, width) {
	padding = " ";
	if( text.length < width ) { 
		var len = width - text.length;
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
	this.table =  [];
	this.map = [];

	/**
	 * Table parser function
	 *
	 **/
	this.parse =  function(text){
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
				}
				else{
					alert("Not a table");
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
				if (this.table[i][j].length > colsize[j]){
					colsize[j] = this.table[i][j].length;    
				}
			}
		}

		for (i=0;i<this.table.length;i++){
			for (j=0;j<this.table[i].length;j++){
				r = r + this.map[i][j];
				r = r + prettytables_strcenter(this.table[i][j],colsize[j]+4);
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
			var selection = getSelection(jQuery('#'+edid)[0]);
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
				alert("No selection");
			}

		});
	return true;
}
