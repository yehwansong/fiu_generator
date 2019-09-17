var makerjs = require('makerjs');
var fonts
var fontlist 
var counter
// var theme_counter = 0
window.onload = function () {
var a_counter = 0
    getGoogleFonts('AIzaSyDqXVt_H3XqKNj9Uyqu-G0OVe0FgS4np8w');
    fontlist = document.getElementsByClassName('fontlist')

    function getGoogleFonts(apiKey){
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + apiKey, true);
        xhr.onloadend = function () {
            objectarray(JSON.parse(xhr.responseText).items)
            fonts = JSON.parse(xhr.responseText);
            console.log(fonts)
        };
        xhr.send();
    };


    function objectarray(FontsInUseArray){
        for (var i =  0; i < FontsInUseArray.length; i++) {
            var FontsInUseObject = document.createElement("div");
            var checkbox = document.createElement("input");
                checkbox.type="checkbox" 
                checkbox.value = i
                checkbox.classList.add('objectlist')
            FontsInUseObject.appendChild(checkbox);  
            FontsInUseObject.innerHTML += FontsInUseArray[i].family
            FontsInUseObject.setAttribute("id",'index_'+i)
            FontsInUseObject.setAttribute("class",'fontlist')
            document.getElementById("objectlist_wrapper").appendChild(FontsInUseObject); 
        }
    }



        var selected_theme = 'none'
        var selected_color = 'salmon'
        var selected_variant = 'regular'
        var selected_ratio = '100-191'
        var selected_content = 'word^shining'
        var selected_content_type = 'word'

        $('.wrapper>div').click(function(){
            var k = $(this).attr('id').split('_')[0]

            if(k === 'theme'){
            selected_theme =String($(this).attr('id').split('_')[1])}
            if(k === 'color'){
            selected_color =String($(this).attr('id').split('_')[1])}
            if(k === 'variant'){
            selected_variant =String($(this).attr('id').split('_')[1])}
            if(k === 'ratio'){
            selected_ratio =String($(this).attr('id').split('_')[1])}
            if(k === 'content'){
                if(String($(this).attr('id').split('_')[1]) === 'words'){
                    selected_content_string = $(this).attr('id').split('_')[2]
                    selected_content_string_etc = $(this).attr('id').split('_')[2]+1
                }else if(selected_content_type === 'word'){
                    selected_content_string = $(this).attr('id').split('_')[2]
                }else if(selected_content_type === 'sentence'){
                    selected_content_string = $(this).attr('id').split('_')[2]
                }else if(selected_content_type === 'character'){
                    selected_content_string = $(this).attr('id').split('_')[2]
                }
            }
            if(k === 'content'){
            selected_content_string =String($(this).attr('id').split('_')[1].split('^')[1])}

            $('#'+k+'_wrapper>div').removeClass('selected')
            $(this).addClass('selected')
        })


    $('#generate').click(function(){
        document.getElementById("output_wrapper").innerHTML = "";

        var apiUrl = [];
        var family_array = [];
        apiUrl.push('https://fonts.googleapis.com/css?family=');

        for (var i = 0; i <  fontlist.length; i++) {
            if(fontlist[i].getElementsByClassName('objectlist')[0].checked){

                if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'words'){
                render(fontlist[i].id.split('_')[1], 
                    selected_variant, 
                    $('#content_wrapper>.selected>span:nth-child(1)').html(), 
                    $('#content_wrapper>.selected>span:nth-child(2)').html())
                }else if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
                    load_type(undefined,fonts.items[i].family, $('#content_wrapper>.selected').html())
                    family_array.push(fonts.items[i].family);
                    apiUrl.push(fonts.items[i].family.replace(/ /g, '+'));
                    apiUrl.push('|');
                }else{
                render(fontlist[i].id.split('_')[1], selected_variant, $('#content_wrapper>.selected').html())
                }
            }
                if( i == fontlist.length-1 && $('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
                    create_style(apiUrl,family_array)
                }
        }
    })

// if sentence
    function create_style(apiUrl,family_array){
    console.log(apiUrl)
        if(selected_variant === 'italic'){
            var clone_apiUrl = []
            clone_apiUrl.push('https://fonts.googleapis.com/css?family=');
            var apiUrllen = apiUrl.length
            for (var i = 1; i < apiUrllen; i++) {
                clone_apiUrl.push(apiUrl[i])
                clone_apiUrl.push(':i')
                if( i == apiUrl.length-1){
                    clone_apiUrl.pop();
                    clone_apiUrl.pop();
                    clone_apiUrl.push('&display=swap');
                    var clone_url = clone_apiUrl.join('');
                    var clone_fontlink = document.createElement('link'); 
                    clone_fontlink.href = clone_url;
                    clone_fontlink.rel = "stylesheet"; 
                    head = document.head || document.getElementsByTagName('head')[0],
                    head.appendChild(clone_fontlink);
                    console.log(clone_apiUrl)
                }
            } 
        }
        apiUrl.pop();
        apiUrl.push('&display=swap');
        console.log(family_array)
        var url = apiUrl.join('');
        var fontlink = document.createElement('link'); 
        fontlink.href = url;
        fontlink.rel = "stylesheet"; 
        head = document.head || document.getElementsByTagName('head')[0],
        head.appendChild(fontlink);

        var style = document.createElement('style');
        if(selected_variant === 'italic'){
            style.innerHTML +='.output_elem_child{font-style:italic}'
        }
        for (var i = family_array.length - 1; i >= 0; i--) {
            style.innerHTML +='#output_wrapper>div:nth-child('+(i+1)+')>div>div *{font-family:'+family_array[i]+'}'
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    function reset_size_sentence(elem){
    var style = window.getComputedStyle(elem, null).getPropertyValue('font-size');
    var fontSize = parseFloat(style); 

                console.log(elem.style.fontSize)
    console.log(elem.offsetWidth)
        if( selected_ratio === '1-1'){
            if((elem.offsetWidth > 350) ||(elem.offsetHeight > 350)){
                elem.style.fontSize = (fontSize - 5) + 'px';
                reset_size_sentence(elem)
            }
        }else if(selected_ratio === '3-4'){
            if((elem.offsetWidth > 350) ||(elem.offsetHeight > 262.5)){
                elem.style.fontSize = (fontSize - 5) + 'px';
                reset_size_sentence(elem)
            }
        }else{
            if((elem.offsetWidth > 477.5) ||(elem.offsetHeight > 250)){
                elem.style.fontSize = (fontSize - 5) + 'px';
                console.log(elem.style.fontSize)
                reset_size_sentence(elem)
            }
        }
    }

// if sentence



    function render(fontIndex, variant, text, text_2, text_3, text_4){
        var f = fonts.items[fontIndex];
        var family = fonts.items[fontIndex].family
        var var_index
        if(variant === 'regular'){
            for (var i = f.variants.length - 1; i >= 0; i--) {
                if(f.variants[i] === 'regular'){
                    var_index = i
                    var v = f.variants[var_index];
                    var url = f.files[v].substring(5); 
                    load_type(url,family,text, text_2,text_3,text_4)
                    return false
                }else if(f.variants[i] === '300'){
                    var_index = i
                    var v = f.variants[var_index];
                    var url = f.files[v].substring(5); 
                    load_type(url,family,text, text_2,text_3,text_4)
                    return false
                }else{
                    var_index = 0
                    var v = f.variants[var_index];
                    var url = f.files[v].substring(5); 
                    load_type(url,family,text, text_2,text_3,text_4)
                    return false
                }
            }
        }
        if(variant === 'italic'){
            for (var i = f.variants.length - 1; i >= 0; i--) {
                if(f.variants[i] === 'italic'){
                    var_index = i
                    var v = f.variants[var_index];
                    var url = f.files[v].substring(5); 
                    load_type(url,family,text, text_2,text_3,text_4)
                    return false
                }else if(f.variants[i].includes("italic")){
                    var_index = i
                    var v = f.variants[var_index];
                    var url = f.files[v].substring(5); 
                    load_type(url,family,text, text_2,text_3,text_4)
                    return false
                }else if(f.variants[i].includes("i")){
                    var_index = i
                    var v = f.variants[var_index];
                    var url = f.files[v].substring(5); 
                    load_type(url,family,text, text_2,text_3,text_4)
                    return false
                }else{
                    failed_load_type()
                    return false
                }
            }
        }
    }


    function load_type(url,family,text,text_2,text_3,text_4){
            opentype.load(url, function (err, font) {
                if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'character'){
                var textModel = new makerjs.models.Text(font, text, 300, true, true, undefined);
                var svg = makerjs.exporter.toSVG(textModel);
                }else if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
                        var svg = text
                }else{
                var textModel = new makerjs.models.Text(font, text, 100, true, true, undefined);
                var svg = makerjs.exporter.toSVG(textModel);
                }

                var output_wholewrap = document.createElement("div");
                output_wholewrap.setAttribute("class",'svg_wholewrapper')

                var output = document.createElement("div");
                output.setAttribute("class",'svg_wrapper')

                var output_elem = document.createElement("div");
                output_elem.setAttribute("class",'svg_wrapper_elem')
                output.appendChild(output_elem); 
                output_wholewrap.appendChild(output); 

                if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'character'){
                    output_elem.setAttribute("class",'character')
                output_elem.innerHTML = svg; 
                }
                if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'word'){
                    output_elem.setAttribute("class",'word')
                output_elem.innerHTML = svg; 
                }
                if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'words'){
                    output_elem.setAttribute("class",'word')
                    var textModel_2 = new makerjs.models.Text(font, text_2, 100, false, true, undefined);
                    var svg_2 = makerjs.exporter.toSVG(textModel_2);
                    var output_elem_2 = document.createElement("div");

                    output_elem.setAttribute("class",'svg_wrapper_elem words svg_wrapper_elem_top')
                    output_elem_2.setAttribute("class",'svg_wrapper_elem words svg_wrapper_elem_bottom')

                    output_elem_2.innerHTML = svg_2; 
                    output.appendChild(output_elem_2); 
                output_elem.innerHTML = svg; 
                } 
                if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
                var output_elem_child = document.createElement("div");
                output_elem.appendChild(output_elem_child);
                output_elem_child.setAttribute("class",'output_elem_child')
                output_elem_child.innerHTML = svg; 
                } 


                
                var a = document.createElement('a');
                a.setAttribute("id",family);
                a.innerHTML = 'Download';
                output_wholewrap.appendChild(a)

                var span = document.createElement('span');
                span.innerHTML = family;
                output_wholewrap.appendChild(span)

                document.getElementById("output_wrapper").appendChild(output_wholewrap);
                setTimeout(function(){
                reset_color(output)
                }, 3000);
            });  
    }
    function reset_color(output){
        if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
            var output_elem_child = document.getElementsByClassName('output_elem_child')
            for (var i = output_elem_child.length - 1; i >= 0; i--) {
                reset_size_sentence(output_elem_child[i])
            }
        }
                if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
                if(selected_color === 'salmon'){
                        $('.output_elem_child').css({color : '#ff5252'})
                        $('.svg_wrapper').css({background : '#ffecef'})
                }
                if(selected_color === 'salmoninv'){
                        $('.output_elem_child').css({color : 'white'})
                        $('.svg_wrapper').css({background : '#ff5252'})
                }
                if(selected_color === 'blue'){
                        $('.output_elem_child').css({color : '#12b5cb'})
                        $('.svg_wrapper').css({background : '#e4f7fb'})
                }
                if(selected_color === 'blueinv'){
                        $('.output_elem_child').css({color : 'white'})
                        $('.svg_wrapper').css({background : '#12b5cb'})
                }
                if(selected_color === 'gray'){
                        $('.output_elem_child').css({color : '#202124'})
                        $('.svg_wrapper').css({background : '#f8f9fa'})
                }
                if(selected_color === 'grayinv'){
                        $('.output_elem_child').css({color : 'white'})
                        $('.svg_wrapper').css({background : '#202124'})
                }


                }else{
                    console.log($('#content_wrapper>.selected').attr('id').split('_')[1])

        var divs_array = document.getElementsByClassName('svg_wrapper')
        for (var j = divs_array.length - 1; j >= 0; j--) {
            var divs = divs_array[j].getElementsByTagName('div')
            for (var i = divs.length - 1; i >= 0; i--) {
                if(selected_color === 'salmon'){
                        divs[i].getElementsByTagName('g')[0].style.fill='#ff5252'
                        $('.svg_wrapper').css({background : '#ffecef'})
                }
                if(selected_color === 'salmoninv'){
                        divs[i].getElementsByTagName('g')[0].style.fill='white'
                        $('.svg_wrapper').css({background : '#ff5252'})
                }
                if(selected_color === 'blue'){
                        divs[i].getElementsByTagName('g')[0].style.fill='#12b5cb'
                        $('.svg_wrapper').css({background : '#e4f7fb'})
                }
                if(selected_color === 'blueinv'){
                        divs[i].getElementsByTagName('g')[0].style.fill='white'
                        $('.svg_wrapper').css({background : '#12b5cb'})
                }
                if(selected_color === 'gray'){
                        divs[i].getElementsByTagName('g')[0].style.fill='#202124'
                        $('.svg_wrapper').css({background : '#f8f9fa'})
                }
                if(selected_color === 'grayinv'){
                        divs[i].getElementsByTagName('g')[0].style.fill='white'
                        $('.svg_wrapper').css({background : '#202124'})
                }
                        divs[i].getElementsByTagName('g')[0].style.stroke='none'
            }
        }

                    }
                reset_size(output)
    }
    function failed_load_type(){
                var output_wholewrap = document.createElement("div");
                output_wholewrap.setAttribute("class",'svg_wholewrapper')

                var a = document.createElement('a');
                a.innerHTML = ' ';
                output_wholewrap.appendChild(a)

                var output = document.createElement("div");
                output.setAttribute("class",'svg_wrapper')
                output.innerHTML = 'this font does not have italic';
                output_wholewrap.appendChild(output);

                document.getElementById("output_wrapper").appendChild(output_wholewrap);
                document.getElementById("output_wrapper").appendChild(output); 
    }

function reset_size(output){
            var total_svg = output.getElementsByTagName('svg')
            var totalheight = 0
            var totalwidth = 0
            var transformed = 1
            var wrapperheight = 200
            var overwidth = 1
            var overheight = 1

            var minheight = 10000
            var height_array= []
            if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
                wrapperheight = 50
            }
            if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'words'){
                wrapperheight = 100
            }


            for (var i = total_svg.length - 1; i >= 0; i--) {
                totalheight = totalheight + total_svg[i].clientHeight
                if(totalwidth<total_svg[i].clientWidth){
                    totalwidth = total_svg[i].clientWidth
                }
                if(minheight>total_svg[i].clientHeight){
                    minheight = total_svg[i].clientHeight
                }
                height_array.push(total_svg[i].clientHeight)
                if(totalheight > 200){
                    overheight = 200/totalheight
                }
                if(totalwidth > 280){
                    overwidth = 280/totalwidth
                }
                if(i == 0){

                    if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'sentence'){
                    }else if($('#content_wrapper>.selected').attr('id').split('_')[1] === 'words'){
                        if(overheight== 1 && overwidth == 1){}
                        else if(overheight<overwidth){
                            total_svg[0].style.transform='translateY(-50%) translateX(-50%) scale('+overheight+')'
                            total_svg[1].style.transform='translateY(-50%) translateX(-50%) scale('+overheight+')'
                        }else{
                            total_svg[0].style.transform='translateY(-50%) translateX(-50%) scale('+overwidth+')'
                            total_svg[1].style.transform='translateY(-50%) translateX(-50%) scale('+overwidth+')'
                        }
                    }else{
                        if(overheight== 1 && overwidth == 1){}
                        else if(overheight<overwidth){
                            total_svg[0].style.transform='translateY(-50%) translateX(-50%) scale('+overheight+')'
                        }else{
                            total_svg[0].style.transform='translateY(-50%) translateX(-50%) scale('+overwidth+')'
                        }
                    }
                }
            } 
            reset_ratio()
    }
    function reset_ratio(){
        if( selected_ratio === '1-1'){
            $('.svg_wrapper_elem').css("cssText", "left:0px !important;");
            // $('.svg_wrapper_elem_top').css({top:'65px'});
            // $('.svg_wrapper_elem_bottom').css({top:'177px'});
            $('.svg_wrapper').css({width:'350px'});
            $('.svg_wrapper').css({height:'350px'});
        }else if( selected_ratio === '3-4'){
            $('.svg_wrapper_elem').css("cssText", "left:0px !important;");
            // $('.svg_wrapper_elem_bottom').css({top:'130px'});
            // $('.svg_wrapper_elem_top').css({top:'18.75px'});
            $('.svg_wrapper').css({width:'350px'});
            $('.svg_wrapper').css({height:'262.5px'});
        }else{
            $('.svg_wrapper').css({width:'477.5px'});
            $('.svg_wrapper').css({height:'250px'});
        }
        theme(a_counter)
    }
function hasClass( target, className ) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

    function theme(a_counter){
        if(selected_theme === 'none'){}else{
            var svg_wrapper = document.getElementsByClassName('svg_wrapper')  
            for (var i = svg_wrapper.length - 1; i >= 0; i--) {
                if(svg_wrapper[i].children[0].classList.contains('svg_wrapper_inner')){}else{
                    console.log(svg_wrapper[i].children[0].classList)
                    org_html = svg_wrapper[i].innerHTML;
                    new_html = "<div class='svg_wrapper_inner'>" + org_html + "</div>";
                    svg_wrapper[i].innerHTML = new_html;    
                }
            }
                if(selected_color === 'salmon'){
                        $('.svg_wrapper_inner').css({background : '#ffecef'})
                        $('.svg_wrapper_inner').css({borderColor : '#ff5252'})
                }
                if(selected_color === 'salmoninv'){
                        $('.svg_wrapper_inner').css({background : '#ff5252'})
                        $('.svg_wrapper_inner').css({borderColor : 'white'})
                }
                if(selected_color === 'blue'){
                        $('.svg_wrapper_inner').css({background : '#e4f7fb'})
                        $('.svg_wrapper_inner').css({borderColor : '#12b5cb'})
                }
                if(selected_color === 'blueinv'){
                        $('.svg_wrapper_inner').css({background : '#12b5cb'})
                        $('.svg_wrapper_inner').css({borderColor : 'white'})
                }
                if(selected_color === 'gray'){
                        $('.svg_wrapper_inner').css({background : '#f8f9fa'})
                        $('.svg_wrapper_inner').css({borderColor : '#202124'})
                }
                if(selected_color === 'grayinv'){
                        $('.svg_wrapper_inner').css({background : '#202124'})
                        $('.svg_wrapper_inner').css({borderColor : 'white'})
                }
;

                if( selected_ratio === '1-1'){
                }else if( selected_ratio === '3-4'){
                    $('.svg_wrapper_inner').css({width:'370px'});
                    $('.svg_wrapper_inner').css({marginLeft:'-11px'});
                    $('.svg_wrapper_elem').css({marginLeft:'11px'});
                }else{
                    $('.svg_wrapper_inner').css({width:'517.5px'});
                    $('.svg_wrapper_inner').css({marginLeft:'-20px'});
                    $('.svg_wrapper_elem').css({marginLeft:'20px'});
                }
        }




            divtoimage(a_counter) 
    }
    function divtoimage(a_counter){
        var svg_wrapper = document.getElementsByClassName("svg_wrapper")
        var svg_wholewrapper = document.getElementsByClassName("svg_wholewrapper")
        console.log(a_counter)
        // for (var i = svg_wrapper.length - 1; i >= 0; i--) {
            var i_top = svg_wrapper[a_counter].getBoundingClientRect().top + window.scrollY;
            var i_left = svg_wrapper[a_counter].getBoundingClientRect().left + window.scrollX;
            if(svg_wholewrapper[a_counter].getElementsByTagName('a').length){
                var a = svg_wholewrapper[a_counter].getElementsByTagName('a')[0]
                if( selected_ratio === '1-1'){
                    html2canvas(svg_wrapper[a_counter], {
                        x:i_left,
                        y:i_top,
                        width: 350,
                        height: 350
                    }).then(function(canvas, i) {
                        a.href = canvas.toDataURL("image/png");
                        a.download = a.id;
                        a_counter++
                        if(a_counter < svg_wrapper.length){
                            divtoimage(a_counter)
                        }
                    });
                }else if( selected_ratio === '3-4'){
                    html2canvas(svg_wrapper[a_counter], {
                        x:i_left,
                        y:i_top,
                        width: 350,
                        height: 262.5
                    }).then(function(canvas, i) {
                        a.href = canvas.toDataURL("image/png");
                        a.download = a.id;
                        a_counter++
                        if(a_counter < svg_wrapper.length){
                            divtoimage(a_counter)
                        }
                    });
                }else{
                    html2canvas(svg_wrapper[a_counter], {
                        x:i_left,
                        y:i_top,
                        width: 477.5,
                        height: 250
                    }).then(function(canvas, i) {
                        console.log(a_counter)
                        // var a = svg_wholewrapper[counter].getElementsByTagName('a')[0]
                        a.href = canvas.toDataURL("image/png");
                        a.download = a.id;
                        a_counter++
                        if(a_counter < svg_wrapper.length){
                            divtoimage(a_counter)
                        }
                    });
                }
            }
        // }
    }
    // function set_color(){

    // }
        var all_selected = false
            $('#selectall').click(function(){
                if(all_selected){
                    $('#objectlist_wrapper input[type="checkbox"]').prop('checked', false);
                    $('#selectall').html('Select All')
                    all_selected = false
                }else{
                    $('#objectlist_wrapper input[type="checkbox"]').prop('checked', true);
                    $('#selectall').html('Deselect All')
                    all_selected = true
                }
            });

};
    


