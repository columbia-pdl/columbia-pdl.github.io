String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {       
	var reg = new RegExp("\\{" + i + "\\}", "gm");             
	str = str.replace(reg, arguments[i]);
    }
    return str;
}


function load_events() {
	$.getJSON('https://lul21s7ud8.execute-api.us-west-2.amazonaws.com/prod/get_events',{'action':'organizer_events'}, function(data){
		var i;
		var html_template = '                        <div class="nf-item {0}"> \
                            <div class="item-box">\
                                <a class="" href="{1}">\
                                    <img class="item-container" src="{2}" />\
                                    <div class="item-mask">\
                                        <div class="item-caption">\
                                            <h5 class="lightblue">{3}</h5>\
                                            <p class="white">{4}</p>\
                                            <p class="salmon">Click here to register</p>\
                                        </div>\
                                    </div>\
                                </a>\
                            </div>\
                        </div>\
';
		var $event_htmls = []
		for(i = 0; i < Math.min(100, data['events'].length); i++){
			info = data['events'][i];
			$des = $(info['description']['html']);
			tags = [];
			tmp = $des.filter("#tags").html();
            if(tmp) {tags = tmp.toLowerCase().split(",")};
            if(info['status']=='live'){
			    tags.push("upcoming");
            }
            else{
			    tags.push("past");
            }
			try{
				if($event_htmls.length){
				    $event_htmls = $event_htmls.add((html_template.format(tags.join(" "),info["url"],info['logo']['url'],
									    info['name']['text'],
									     $des.filter("p").eq(0).text())));
				}
				else{
				    $event_htmls = $(html_template.format(tags.join(" "),info["url"],info['logo']['url'],
									  info['name']['text'],
									  $des.filter("p").eq(0).text()));
				}
			}
			catch(err){
				console.log(err);
			}
		}
		var $container = $('.container-masonry');
        $container.isotope({
            itemSelector: '.nf-item',
            layoutMode: 'masonry',
            masonry: {
                columnWidth: 0,
                gutter: 0
            },
        });
	    // bind filter button click
        $('.container-filter').on('click', '.categories', function () {
            var filterValue = $(this).attr('data-filter');
            $container.isotope({ filter: filterValue });
        });

	    // change active class on categories
	    $('.categories-filter').each(function (i, buttonGroup) {
	        var $buttonGroup = $(buttonGroup);
	        $buttonGroup.on('click', '.categories', function () {
	            $buttonGroup.find('.active').removeClass('active');
	            $(this).addClass('active');
	        });

	    });

	    $container.isotope("insert",$event_htmls);
	    
	    })
       }
