$(document).ready(function() {
    /*			Funcion para el menu de las fichas LIGAMX		*/
    $('.navbar-ficha a[data-target]').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var target = $this.attr('data-target');
        if (!$this.parent().hasClass('active')) {
            $('.navbar-ficha [data-target]').parent().removeClass('active');
            $(".navbar-ficha [data-target='" + target + "']").parent().addClass('active');
            $('.estadisticaFicha').hide();
            $('.' + target).show();
        }
    });
    /*##### Para que el tooltip salga debajo se envía el parámetro bottom, lfrias*/
    $(".table a").tooltip({
        placement : 'bottom', html: true
    });
    $(".row a").tooltip({
        placement : 'bottom', html: true,
        container: 'body'
    });

    $(".dataSimulador").tooltip({
        placement : 'bottom', html: true,
    });

    /*##### lightbox			lcanales	 #####*/
    // $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    //     event.preventDefault();
    //     $(this).ekkoLightbox();
    // });
    $(document).on("click",'.playVideoLiga',function(){

        ////LMX.fp_ModalConstructVideo($(this));////Inicial

        ////Google Analytics - Videos

        ////console.log( $(this) );

        var vsUrlVideo = $(this)[0].dataset.urlvideo;
        var vaUrlVideo = vsUrlVideo.split('/');
        var vsDataVideo = vaUrlVideo[vaUrlVideo.length - 1];
        ////console.log( $(this)[0].dataset.titlevideoga );
        var vsTitleVideoGA = $(this)[0].dataset.titlevideoga;

        vsDataVideo = vsDataVideo.replace('.mp4','');
        // Se mandan los parametros en la URL como JSON
        // var params = {"idVideo":vsDataVideo," psTipoEstd":vsTitleVideo};
        var	href = btoa(vsDataVideo);


        ////Modal inicial o a la seccion de video JW Player
        if( typeof (vsTitleVideoGA) == 'undefined' ) {
            LMX.fp_ModalConstructVideo($(this));

            ////Para que no aparezca undefined
            vsTitleVideoGA = '';
        }
        else {
            ////window.open('/cancha/ver-video/' + href + '/' + vsTitleVideoGA, "_self");////Manda a seccion ver-video
            LMX.fp_ModalConstructVideo($(this));
        }

        ////Google Analytics
        try {
            ga('send', 'pageview', {
                'page': '/cancha/ver-video/' + btoa(href) + '/' + vsTitleVideoGA,
                'title': 'Video ' + vsTitleVideoGA
            });
        }
        catch(e) {
            console.log("e: " + e);
        }

    });
});
/*amejia sirve para darle formato a los numeros
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: número de decimales
 * @param integer x: tamaño de grupos de numero enteros
 * @param mixed   s: delimitador de grupos
 * @param mixed   c: delimitador de decimales
 */
Number.prototype.formatNumber = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
var LMX = {
    consultarServicio : function(service, params, callback, option){
        // #### Funcion para consultar un servicio dentro del objeto "services", lcanales
        var parametrosLocales = {};
        $.extend(parametrosLocales, window.parametros.actual);
        $.extend(parametrosLocales, params);
        for (variable in parametrosLocales) {
            var buscar = '<'+variable.toUpperCase()+'>';
            var re = new RegExp(buscar, 'g');
            service = service.replace(re, parametrosLocales[variable]);
        }
        url = btoa(service).replace('/','@');
        //### Parametros por defecto
        var prmts = {
            url: "ws/"+url,
            dataType: 'json', contentType: "application/json; charset=utf-8",
            type: "GET", async: true, //data: myData,
            success: function(data) { callback(data); }
        };
        //### Verificamos si nos mandan parametros adicionales para ejecutar el servicio
        if(option && (typeof option == 'object')){
            $.extend(prmts,option);
        }
        //### Ejecutamos la consulta
        $.ajax(prmts);
    },
    fp_setCookie : function(cname,cvalue) {
        document.cookie = cname + "=" + cvalue + "";
    },
    fp_getCookie : function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    fp_AbrePDF : function(psURL, psTitulo, psCmpr){
        // ##### Función para mostrar los PDFs en Modal
        // ##### El modal está en MAsterPage, 04nov2014, lfrias
        var ua = navigator.userAgent;
        var isiPad = /iPad/i.test(ua);
        psURL=('http://administrador.ligamx.net' + psURL.replace('/media',''));
        //### android
        var ua = navigator.userAgent;
        var isAndroid = ua.indexOf("android") > -1;
        if ((isAndroid) || (isiPad) || (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
            window.open(psURL, "Vista Previa", "toolbar=no,location=no,directories=no,resizable=no,fullscreen=yes");
        } else {
            var vnModalHeight = $(window).height()-100;
            $(".show_loading").attr("height", vnModalHeight);
            var frameSrc = psURL;
            var htmlHeader = '<button data-modalvideo="modalVideoPlayer" type="button" data-dismiss="modal" aria-label="Close" ' +
                'class="close"><span aria-hidden="true" id="btnClose" class="icoCerrar" style="margin-top:0px;' +
                'background: url(" img="" close-icon.png")="" no-repeat="" scroll="" center="" top="" rgba(0,="" 0,="" 0);="" "="">' +
                '</span></button>';
            $('.modal-header').html(htmlHeader);
            $('.modal-footer').html('');
            if(psCmpr == 1 || psCmpr == true ){
                var html = '' +'<section class="redesBtns" style="left: 16px !important;right: 0 !important;"><nav><ul><li><a onclick="window.open(\'https://www.facebook.com/sharer/sharer.php?u=' + psURL + '\',\'_blank\');" class="btn-red facebook redSociali" style="margin:5px;"></a></li><li><a onclick="window.open(\'https://twitter.com/intent/tweet?original_referer=http://www.ligabancomer.mx/&text=' + psTitulo + '&url=' + psURL + '&via=ligabancomermx\',\'_blank\');" class="btn-red twitter redSociali" style="margin:5px;"></a></li><li><a onclick="window.open(\'https://plus.google.com/share?url=' + psURL + '\',\'_blank\');" class="btn-red google redSociali" style="margin:5px;"></a></li><li><a onclick="window.open(\'https://www.linkedin.com/shareArticle?mini=true&url=' + psURL + '&title=' + psTitulo + '&summary=&source=\',\'_blank\');" class="btn-red linkedin redSociali" style="margin:5px;"></a></li><li><a style="margin:5px"  href="mailto:?subject=Te comparto este documento de la pagina de: '+parametros.actual.nombreDivision+'&body=Te comparto algo interesante de la página de '+parametros.actual.nombreDivision+'%0A%0AMas información: '+ psURL+'" class="btn-red mail redSociali "></a></li><li><a download  href="' + psURL + '"  target="_blank"  style="margin:4px;font-size:18px; height: 32px; width: 32px;cursor:pointer !important;" class="btn-red download redSociali "></a></li></ul></nav></section>';
                $('.modal-footer').prepend(html);
            }
            $('#objModalPDFDiv').modal({show:true});
            $("#objPDF").attr("data", frameSrc);
            $("#objPDF").attr("height", vnModalHeight);
            $("#objModalLabel").html(psTitulo);

            $('.show_loading').show();
            $('#objPDF').hide();
            $('.redesBtns').hide();
            var timeLoading=(window.location.href.indexOf("/cancha/informeArbitral/")>=0?8000:3000);
            setTimeout(function(){
                $('.show_loading').hide();
                $('#objPDF').show();
                $('.redesBtns').show();
            },timeLoading);
        }
    },
    fp_NavAnchor : function(target){
        // ##### Función navegar en anchors
        // ##### 21nov2014, lfrias
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top-88
        }, 900, 'swing', function () {
            window.location.hash = target;
        });
    },
    fp_GrfcGlesxTipo : function(contenedor,series,colores){
        conf="$(contenedor).highcharts({";
        conf+="        legend: {";
        conf+="            useHTML:true, labelFormatter: function() {return  this.name +'<span style=\"font-size:13px; color:#787876\"> (' + this.y +' '+(this.name==\"Autogol\"?(this.y==1?\"Autogol\":\"Autogoles\"):(this.y==1?\"Gol\":\"Goles\"))+') <!--span style=\"color:#787876\">'+Highcharts.numberFormat(this.percentage,2)+'%</span--></span>';},symbolRadius: 20,";
        conf+="            symbolHeight: 12,";
        conf+="            symbolWidth: 12,";
        conf+="            symbolPadding: 10,";
        conf+="            layout: 'vertical'";
        conf+="            ";
        conf+="        },";
        conf+=colores+"    chart: {";
        conf+="        plotBackgroundColor: null,";
        conf+="        plotBorderWidth: null,";
        conf+="        plotShadow: false";
        conf+="    },";
        conf+="    title: {";
        conf+="        text: ''";
        conf+="    },";
        /*
         conf+="    legend: {";
         conf+="        align: 'right',";
         conf+="        verticalAlign: 'top',";
         conf+="        layout: 'vertical',";
         conf+="        x: -150,";
         conf+="        y: 100";
         conf+="    },";
         */
        conf+="    tooltip: {";
        conf+="        useHTML: true, headerFormat: '<span style=\"font-size: 13px\">{point.key}</span><br>',style: {fontSize:'15px'},";
        conf+="        pointFormat: '<strong>{point.y} {series.name}</strong><br> <strong>{point.percentage:.2f}%</strong>'";
        conf+="    },";
        conf+="    plotOptions: {";
        conf+="        pie: {";
        conf+="            allowPointSelect: true,";
        conf+="            cursor: '',";
        conf+="            dataLabels: {";
        conf+="                enabled: false";
        conf+="            },";
        conf+="            showInLegend: true";
        if(series.search('url')>=0) {
            conf += "            ,point: {";
            conf += "             events: {";
            conf += "                 click: function () {";
            conf += "                     location.href = this.options.url;";
            conf += "                 }";
            conf += "             }";
            conf += "            }";
        }
        conf+="        }";
        conf+="    },";
        conf+="    series: [{";
        conf+="        type: 'pie',";
        conf+="        name: 'Goles',";
        conf+="        data: ["+series+" ]";
        conf+="    }],";
        conf+="    credits:{";
        conf+="        enabled:false";
        conf+="    }";
        conf+="    ,navigation: {buttonOptions: {enabled: false}}";
        conf+="});";
        eval(conf);
    },
    fp_GrfcRngoGles : function(series,xAxis){
        var contenedor="#div_graf";
        var conf="$(contenedor).highcharts({";
        conf+="        title: {";
        conf+="            text: ''";
        conf+="        },";
        conf+="        subtitle: {";
        conf+="            text: ''";
        conf+="        },";
        conf+=         xAxis;
        conf+="        yAxis: {";
        conf+="            title: {";
        conf+="                text: 'Goles'";
        conf+="            },";
        conf+="            labels: {";
        conf+="                formatter: function () {";
        conf+="                    return this.value ;";
        conf+="                }";
        conf+="            },min:0";
        conf+="        },";
        conf+="        tooltip: {";
        //conf+="        useHTML: true, headerFormat: '<span style=\"font-size: 13px\">Minutos:{point.key}</span><br>',style: {fontSize:'15px'},";
        //conf+="        pointFormat: '<b>{series.name}:</b> {point.y} Goles Anotados',";
        conf+="            crosshairs: true,";
        conf+="            shared: true";
        conf+="        },";
        conf+="        series: ["+series+"],";
        conf+="   credits: {";
        conf+="       enabled: false";
        conf+="   },";
        conf+="   navigation: {";
        conf+="         buttonOptions: {";
        conf+="             enabled: false";
        conf+="         }";
        conf+="   }";
        conf+="});";
        eval(conf);
    },
    fp_GrfcGlesxNcnl : function(contenedor,series,title,band){
//        var contenedor="#golesXnacionalidad";
        var conf="$(contenedor).highcharts({";
        conf+="    chart: {";
        conf+="        type: 'column'";
        conf+="    },";
        conf+="    title: {";
        conf+="        text: '"+title+"'";
        conf+="    },";
        conf+="    subtitle: {";
        conf+="        text: ''";
        conf+="    },";
        conf+="    xAxis: {";
        conf+="        title: {";
        conf+="            text: '"+(band?'Nacionalidad':'Edades')+"'";
        conf+="        },";
        conf+="        type: 'category',";
        conf+="        labels: {";
        conf+="            rotation: "+(band?'-45':'0')+",";
        conf+="            style: {";
        conf+="                fontSize: '13px',";
        conf+="                fontFamily: 'Verdana, sans-serif'";
        conf+="            }";
        conf+="        }";
        conf+="    },";
        conf+="    yAxis: {";
        conf+="        min: 0,";
        conf+="        title: {";
        conf+="            text: 'Goles'";
        conf+="        }";
        conf+="    },";
        conf+="    legend: {";
        conf+="        enabled: false";
        conf+="    },";
        conf+="    tooltip: {";
        conf+="        useHTML: true, headerFormat: '<span style=\"font-size: 13px\">{point.key}</span><br>',style: {fontSize:'15px'},";
        conf+="        pointFormat: '<b>{point.y} Goles Anotados por {point.name}</b>'";
        conf+="    },";
        conf+="    series: [{";
        conf+="        name: '',";
        conf+="        data: [";
        conf+=series;
        conf+="        ],";
        conf+="        dataLabels: {";
        conf+="            enabled: true,";
        conf+="            rotation: 0,";
        conf+="            color: '#000000',";
        conf+="            align: 'center',";
        conf+="            format: '{point.y}',";
        conf+="            style: {";
        conf+="                fontSize: '10px',";
        conf+="                fontFamily: 'Verdana, sans-serif'";
        conf+="            }";
        conf+="        }";
        conf+="    }],";
        conf+="   credits: {";
        conf+="       enabled: false";
        conf+="   },";
        conf+="   navigation: {";
        conf+="         buttonOptions: {";
        conf+="             enabled: false";
        conf+="         }";
        conf+="   }";
        conf+="});";
//            alert(conf);
        eval(conf);
    },
    fp_GrfcBarras:function(element,content){
        var vsCategory=$('#'+element).attr('data-gfCatEjex').split(':');
        var title=$('#'+element).attr('data-gfTitle');
        var subtitle=$('#'+element).attr('data-gfSubtitle');
        var vsDatos=$('#'+element).attr('data-gfSeries').split(';');

        var conf2="[";
        for (index in vsDatos) {
            vsDatoSerie=vsDatos[index];
            var vsDSerie=vsDatoSerie.split(':');
            var vsDatohead=vsDSerie[0].split(',');
            conf2+="{";
            conf2+="    name: '"+vsDatohead[0]+"',";
            conf2+="    color: '"+vsDatohead[1]+"',";
            conf2+="    dataLabels: {";
            conf2+="        enabled: true,";
            //conf2+="        rotation: -90,";
            conf2+="        color: 'black',";
            conf2+="        align: 'center',";
            conf2+="        style: {";
            conf2+="            fontSize: '13px',";
            conf2+="            fontFamily: 'Verdana, sans-serif',";
            conf2+="            textShadow: '0'";
            conf2+="        }";
            conf2+="    },";
            conf2+="    data:"+vsDSerie[1]+"},";
        }
        conf2=conf2.substring(0,conf2.length-1)+"]";
        $(content).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle
            },
            xAxis: {
                title: {
                    text: vsCategory[0]
                },
                categories: eval(vsCategory[1])
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cantidad'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:13px">Jornada: {point.key}</span><table>',
                pointFormat: '<tr><td style="color:black;padding:0">{series.name}: </td>' +
                '<td style="padding:0"> <b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                style: {fontSize:'15px'},
                shared: true,
                useHTML: true,
                borderColor: '#000000'
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0
                }
            },
            series: eval(conf2),
            credits: {
                enabled: false
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            }
        });
    },
    fp_GrfcPart : function(element,content){
        var cad=$('#'+element).attr('data-gfSeries').replace(/<=/gi,"≤").replace(/>=/gi,"≥");
        var title=$('#'+element).attr('data-gfTitle');
        var subtitle=$('#'+element).attr('data-gfSubtitle');
        var gfname=$('#'+element).attr('data-gfName');
        //alert(subtitle);
        $(content).highcharts({
            chart: {
                backgroundColor:'transparent',
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: title
            },
            subtitle: {
                text: subtitle,
                align: 'center',
                verticalAlign: 'middle',
                y: 0,
                style:{
                    color:'white'
                }
            },
            tooltip: {
                useHTML: true, headerFormat: '<span style=\"font-size: 13px\">{point.key}</span><br>',style: {fontSize:'15px'},
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: '',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            fontWeight: 'bold',
                            color: 'green',
                            textShadow: '0px 1px 2px grey'
                        }
                    },
                    center: ['50%', '50%']
                }
            },
            series: [{
                type: 'pie',
                name: gfname,
                innerSize: '50%',
                data:
                    eval(cad)

            }],
            credits: {
                enabled: false
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            }
        });
    },
    fp_GrfcPromE : function(element,content){
        var vsCadena=$('#'+element).attr('data-gfSeries');
        var title=$('#'+element).attr('data-gfTitle');
        var subtitle=$('#'+element).attr('data-gfSubtitle');
        $(content).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                useHTML:true,
                text: title,
                style: {
                    textAlign:'center'
                }
            },
            subtitle: {
                useHTML:true,
                text: subtitle,
                style: {
                    textAlign:'center'
                }
            },
            xAxis: {
                type: 'category',title: {
                    text: 'Edad'
                },
                labels: {
                    rotation:0,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Jugadores'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                useHTML: true, headerFormat: '<span style="font-size: 13px;font-weight: bolder" >Edad: {point.key} años</span><br>',style: {fontSize:'15px'},
                pointFormat: 'Jugadores: <b>{point.y}</b>'
            },
            series: [{
                name: '.',
                data:eval(vsCadena),
                dataLabels: {
                    enabled: true,
                    rotation: 0,
                    color: '#000',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }],
            credits: {
                enabled: false
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            }
        });
    },
    fp_ModalConstructVideo:function(e){
        var modalVideo=""+e.attr('data-modalVideo');
        modalVideo=(modalVideo=="undefined")?"modalVideoPlayer":modalVideo;
        if (!$("#"+modalVideo).length){//si el modal no existe en el html se procede a crearlo
            var htmlModal='<div id="'+modalVideo+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" class="modal fade bs-example-modal-lg">';
            htmlModal+='<div style="width: 745px " class="modal-dialog modal_videosfull">';
            htmlModal+='<div class="modal-content" style="height:60px;background:#00529C;border-radius: 5px 5px 0 0" >';
            htmlModal+='<div class="modal-header" style="width:95%;background:#00529C;" >';
            //htmlModal+='<img src=/img/logo-bancomer-horizontal.png" style="margin-top:7px;">';
            htmlModal+='<button data-modalVideo="'+modalVideo+'" type="button" data-dismiss="modal" aria-label="Close" class="close" id="btnClose">';
            htmlModal+='<span aria-hidden="true" id="btnClose" class="icoCerrar" style="margin-top:11px;background: url(\"/img/close-icon.png\") no-repeat scroll center top rgba(0, 0, 0, 0); "></span>';
            htmlModal+='</button>';
            htmlModal+='<h4 class="modal-title" style="color:white;"></h4>';
            htmlModal+='</div>';
            htmlModal+='</div>';
            htmlModal+='<div class="modal-body" style="padding:0px;border-bottom-right-radius:5px;border-bottom-left-radius:5px;">';
            htmlModal+='</div>';
            htmlModal+='<div class="modal-info" class="col-lg-10 col-md-10 col-xs-10"></div>';
            htmlModal+='<div class="modal-footer" style="background:none;color:black;text-align:center;font-weight:normal;padding: 0 30px;">';
            htmlModal+='</div>';
            htmlModal+='</div>';
            htmlModal+='</div>';
            $('body').append(htmlModal);
        }
        modalVideo="#"+modalVideo;
        $(modalVideo).modal('toggle');
        var url=e.attr('data-urlVideo');
        var tit_vid=e.attr('data-titleVideo');
        var idVideo="videoPlayerLiga";//podria ser un nombre aleatorio
        var infoVideo=""+e.attr('data-infoVideo');
        infoVideo=(infoVideo=="undefined")?"":$(infoVideo).html();
        $(modalVideo+' .modal-info').html(infoVideo);
        var html = this.fp_Player(url,idVideo);
        $(modalVideo+' .modal-body').html('<div class="center-block" style="display: table;"><img src="/img/wait.gif"/></div>');
        $(modalVideo+' .modal-title').html(tit_vid);
        $(modalVideo+' .modal-body').html(html);
        $(document).on("click",'#btnClose',function(){
            ////$(modalVideo+' .modal-body').html('');
            $(modalVideo+' .modal-info').html('');
        });
        $(modalVideo).on('hidden.bs.modal', function () {
            $('#btnClose').click();
        })

        $('#'+idVideo).on('ended', function() {
            $('#btnClose').click();
        });
    },
    fp_Player:function(movieUrl,idVideo){
        var htmlVideo='<div class="col-md-12 list-block cntplayer">';
        htmlVideo+='<div class="contenedor">';
        htmlVideo+='<div class="cntplayervideo">';
        if (Modernizr.video) {
            // el navegador del usuario soporta el elemento video
            htmlVideo+='<video id="'+idVideo+'" width="100%" height="100%" controls autoplay><source src="'+movieUrl+'" type="video/mp4" codecs="avc1.42E01E, mp4a.40.2">El Navegador no soporta video HTML5 <br>Your browser does not support HTML5 video.</video>';
        } else {
            // el navegador no soporta video
            //(una solución alternativa podría ser usar Flash)
            htmlVideo+='<embed id="'+idVideo+'" src="'+movieUrl+'" type="video/mp4" id="playvideo" width="100%" height="100%" allowfullscreen="true" scale="tofit" bgcolor="#000000">';
        }
        htmlVideo+='</div>';
        htmlVideo+='</div>';
        htmlVideo+='</div>';
        htmlVideo+='<div class="clearfix"></div>';
        return htmlVideo
    },
    fp_CheckQuickTime : function(){
        var haveqt = false;
        if (navigator.plugins) {
            for (i=0; i < navigator.plugins.length; i++ ) {
                if (navigator.plugins[i].name.indexOf("QuickTime") >= 0){
                    haveqt = true;
                }
            }
        }
        return haveqt;
    },
    fp_textForTitle : function(psTextForTitle){
        psTextoAdicional = (psTextForTitle=='undefined'||psTextForTitle==null) ? '' : psTextForTitle;
        var _url = window.location.host;
        document.title += ' - ' + psTextoAdicional + ' - ' + _url;
    },
    removeAccents: function(e){for(var r=e.toLowerCase(),t="áéíóúü".split(""),a="aeiouu".split(""),o=0;o<t.length;o++)r=r.replace(t[o],a[o]);return r.replace(/[^\\s\w]/g,"")},
    sort_objc_by:function(n,r,t){var u=t?function(r){return t(r[n])}:function(r){return r[n]};return r=[-1,1][+!!r],function(n,t){return n=u(n),t=u(t),r*((n>t)-(t>n))}}
}
//script menu flotante
$(window).scroll(function(){
    if ($(this).scrollTop() > 320) {
        $('#menu_float').slideDown(300);

    } else {
        $('#menu_float').slideUp(100);
    }
});
var titulo='';
switch(_sitio){
    case '1':
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo_liga_mx.jpg" style=" margin:7px 0; width: 300px; "></div>';
        break;
    case '0':
        titulo='<div class="logodivision" style="text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo-copa-mx.png" style=" margin:7px 0; width: 200px; ">';
        break;
    case '2':
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo-ascenso.png" style=" margin:7px 0; width: 300px;">';
        break;
    case '3':
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo-bancomer-bbva-20.png" style=" margin:7px 0;  width: 260px">';
        break;
    case '4':
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo-bancomer-bbva-17.png" style=" margin:7px 0;  width: 260px">';
        break;
    case '5':
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo-bancomer-bbva-15.png" style=" margin:7px 0;  width: 260px">';
        break;
    case '6':
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo-bancomer-bbva-13.png" style=" margin:7px 0;  width: 260px">';
        break;
    case '14':
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo_liga-femenil_mx.png" style=" margin:7px 0;  width: 260px">';
        break;
    default:
        titulo='<div class="logodivision" style="background: white !important;text-align: center;"><img src="https://s3.amazonaws.com/lmxwebsite/images/logo_liga_mx.jpg" style=" margin:7px 0; width: 300px; "></div>';
        break;
}
$('#head_menufloat').html(titulo);
// fin script menu flotante
