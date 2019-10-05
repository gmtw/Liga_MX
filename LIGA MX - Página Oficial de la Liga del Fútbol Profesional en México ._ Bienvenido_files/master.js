(function($) {
    function wdgt_master(element, options) {
        this.element = $(element);
        this.options = $.extend({}, wdgt_master.prototype.options, options);
        this.init()
    }
    wdgt_master.prototype = {
        options: {
            vnviewport: 1024,
            vbGoogleAnltcs: true,
            voNtfcSckt: null,
            voprmtrsMXM: null,
            vbajaxpolling: false,
            vbsckt: false,
            vnIDDivision: null,
            vsurlAjxPlngMrcd: "http://interfaces.ligamx.net:8021/?CSeg=45&Parametros=_Query=qry_G2_LIGA_PrtdAlMntoxPrtd_new0.txt@@Inst=1",
            vsurlAjxPlngNtfc: 'http://interfaces.ligamx.net:8022/?Modulo=Messaje&psJSON={"Accion":"Get","Top":"1"}',
            vntimeAjxplng: 2000,
            vbscrollmenu: true,
            vnscrolltop: 245
        },
        element: null,
        elms: null,
        $: function(selector) {
            return $(selector, this.element)
        },
        init: function() {
            this._initVars();
            this._defaultEvents();
            this._setEvents()
        },
        _initVars: function() {
            this.elms = {
                txt_bsqd: this.$("#txtBusqMaster"),
                btn_bsqd: this.$(".btnBusqMaster"),
                class_loadshow: this.$(".loadershow"),
                btn_extend: this.$(".btnExtend"),
                div_menufly: this.$("#divmenu_flyout"),
                div_menuflybck: this.$("#divmenu_flyout_back")
            }
        },
        _defaultEvents: function() {
            var me = this;
            if (me.options.vnviewport > 1024) {
                me._viewport()
            }
            me._checkscroll();
            if (me.options.vbajaxpolling) {
                me._NtfcMxmAjax()
            }
            if (me.options.vbsckt) {
                me._NtfcMxmSckt()
            }
            if (me.options.vbGoogleAnltcs) {
                me._getGoogleAnltcs()
            }
        },
        _setEvents: function() {
            var me = this;
            this.elms.txt_bsqd.keyup(function(event) {
                if ($(this).val().trim().length > 0) {
                    $(".btnBusqMaster").attr("disabled", false);
                    me._kpbusq(event.keyCode)
                } else {
                    $(".btnBusqMaster").attr("disabled", true)
                }
            });
            this.elms.btn_bsqd.click(function() {
                me._bsqd()
            });
            this.elms.class_loadshow.click(function() {
                me._loadershow()
            });
            this.elms.btn_extend.click(function() {
                me._extendinfo()
            })
        },
        _getGoogleAnltcs: function() {},
        _viewport: function() {
            $("#viewport").attr("content", "initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0")
        },
        _kpbusq: function(tecla) {
            if (tecla == 13) {
                this._bsqd()
            }
        },
        _bsqd: function() {
            var txtbsqd = this.elms.txt_bsqd.val().trim();
            var tamcad = txtbsqd.split(" ").length;
            var cadBus = "";
            cadBus = (txtbsqd.length > 0 ? "/cancha/busqueda/" + encodeURIComponent(txtbsqd) : "/cancha/busqueda/buscar");
            if (cadBus.length > 0) {
                window.open(cadBus, "_self")
            }
        },
        _loadershow: function() {
            $("body").loader("show")
        },
        _extendinfo: function() {
            $(this).hide()
        },
        _checkscroll: function() {
            var me = this;
            var scroll = me.options.vnscrolltop;
            $(window).scroll(function() {
                if ($(this).scrollTop() > scroll) {
                    me.elms.div_menufly.fadeIn();
                    me.elms.div_menuflybck.fadeIn()
                } else {
                    me.elms.div_menufly.fadeOut();
                    me.elms.div_menuflybck.fadeOut()
                }
            })
        },
        _NtfcMxmAjax: function() {
            setInterval(function() {
                getNotific();
                getMrcdrs()
            }, this.options.vntimeAjxplng)
        },
        _NtfcMxmSckt: function() {
            var me = this;
            ////console.log("Aqui llega notificacion.");
            me.options.voNtfcSckt.watch(function(data) {
                //console.log("Notificacion: " + JSON.stringify(data));
                if (typeof(data.data.DatosJSON)!=='undefined') {
                    var Resultado = data.data.DatosJSON[0];
                    var vsMrcdPnls = "";
                    var vsSonido = ["https://s3.amazonaws.com/lmxwebsite/media/sounds/soundgoal.mp3", "https://s3.amazonaws.com/lmxwebsite/media/sounds/notific.mp3"];
                    if (typeof(Storage) !== "undefined") {
                        var uProf = JSON.parse(localStorage.getItem("userProfile"));
                        switch (uProf.goalSound) {
                            case "00":
                            case "1":
                                vsSonido[0] = "https://s3.amazonaws.com/lmxwebsite/media/sounds/notific.mp3";
                                break;
                            case "2":
                                vsSonido[0] = "https://s3.amazonaws.com/lmxwebsite/media/sounds/soundgoal.mp3";
                                break;
                            case "3":
                                vsSonido[0] = "/sounds/sound_pit.mp3";
                                break;
                            case "4":
                                vsSonido[0] = "/sounds/done.mp3";
                                break
                        }
                        switch (uProf.notificationSound) {
                            case "00":
                            case "1":
                                vsSonido[1] = "https://s3.amazonaws.com/lmxwebsite/media/sounds/notific.mp3";
                                break;
                            case "2":
                                vsSonido[1] = "https://s3.amazonaws.com/lmxwebsite/media/sounds/soundgoal.mp3";
                                break;
                            case "3":
                                vsSonido[1] = "/sounds/sound_pit.mp3";
                                break;
                            case "4":
                                vsSonido[1] = "/sounds/done.mp3";
                                break
                        }
                    }
                    if (typeof Resultado.Id != 'undefined' && typeof Resultado.MarcadorModificado != 'undefined') {
                        $('.mrcdPrtd_' + Resultado.Id + '_' + Resultado.IdLocal).html(Resultado.GolLocal);
                        $('.mrcdPrtd_' + Resultado.Id + '_' + Resultado.IdVisita).html(Resultado.GolVisita);
                    } else if (typeof Resultado.video == 'undefined' && !uProf.muted && typeof Resultado.IdEvento == 'undefined' && typeof Resultado.Borrado == 'undefined') {
                        urlEvnt = "/cancha/mxm/" + Resultado.Id + "/" + btoa('{"idClublocal":"' + Resultado.IdLocal + '","idClubvisita":"' + Resultado.IdVisita + '","idPartido":"' + Resultado.Id + '","pestana":"3"}');
                        var msg = '<div class="alerta-header ' + (_sitio == 2 ? "ascenso" : _sitio == 7 ? "copa" : "") + ' "><i class="ico"></i>Minuto a minuto<span class="btn-close"></span></div><div class="alerta-mensaje"><h3 class="titulo">' + (Resultado.Coordenadas.Detalle == "-" ? (Resultado.Coordenadas.Minuto == 0 ? "Inicio del Partido" : "Fin del Partido") : ((Resultado.Coordenadas.IdGmCts == 6 && Resultado.Coordenadas.IdDetalle == 2) ? "Finalizan los penales!" : (me.options.vnIDDivision == 14 ? '' : Resultado.Coordenadas.Detalle)   )) + "</h3>";
                        msg += "<p>" + Resultado.Coordenadas.Comentario + "</p>";
                        msg += '<div class="pie">';
                        msg += '<div class="teams-alert"><img src="/media/images/aflddrct/logos35x35/' + Resultado.IdLocal + "/" + Resultado.IdLocal + '.png" alt="" height="40" width="40" class="local">';
                        msg += '<div class="score-alert"><span class="local">' + Resultado.GolLocal + '</span> - <span class="visit">' + Resultado.GolVisita + "</span>";
                        if (Resultado.IdGmCts == 11) {
                            vsMrcdPnls = '<span class="local gol_penl_port">(' + Resultado.PenalLocal + ')</span > <span class="visit gol_penl_port">(' + Resultado.PenalVisita + ")</span>"
                        }
                        msg += vsMrcdPnls + '</div><img src="/media/images/aflddrct/logos35x35/' + Resultado.IdVisita + "/" + Resultado.IdVisita + '.png" alt="" height="40" width="40" class="visit">';
                        msg += '</div><a href="' + urlEvnt + '" class="link">Ver más</a>';
                        msg += "</div>";
                        msg += "</div>";
                        toastr.options = {
                            closeButton: false,
                            debug: false,
                            progressBar: true,
                            positionClass: "toast-top-right",
                            preventDuplicates: false,
                            showDuration: 300,
                            hideDuration: 1000,
                            timeOut: 15000,
                            extendedTimeOut: 4000,
                            showEasing: "swing",
                            hideEasing: "linear",
                            showMethod: "slideDown",
                            hideMethod: "slideUp"
                        };
                        var $toast = toastr.success(msg);
                        $toastlast = $toast;

                        function getLastToast() {
                            return $toastlast
                        }

                        $("#clearlasttoast").click(function () {
                            toastr.clear(getLastToast())
                        });
                        $("#cleartoasts").click(function () {
                            toastr.clear()
                        });
                        var MySound = (Resultado.Coordenadas.IdTipo == "1") ? new Audio(vsSonido[0]) : new Audio(vsSonido[1]);
                        MySound.load();
                        MySound.play();
                        $(".mrcdPrtd_" + Resultado.Id + "_" + Resultado.IdLocal).html(Resultado.GolLocal);
                        $(".mrcdPrtd_" + Resultado.Id + "_" + Resultado.IdVisita).html(Resultado.GolVisita);
                        if (Resultado.IdGmCts != 13) {
                            $(".stsPrtd_" + Resultado.Id).html(me.options.voprmtrsMXM[Resultado.IdGmCts][0]);
                        }
                        $("#MrcdrPrtd_" + Resultado.Id).addClass("prtdoNJugeo");
                        if (Resultado.IDGmCs == 11) {
                            $(".mrcdPnal_" + Resultado.Id + "_" + Resultado.IdLocal).html("(" + Resultado.PenalLocal + ")");
                            $(".mrcdPnal_" + Resultado.Id + "_" + Resultado.IdVisita).html("(" + Resultado.PenalVisita + ")")
                        }
                        if (Resultado.IdGmCts > 5) {
                            $("#MrcdrPrtd_" + Resultado.Id).removeClass("prtdoNJugeo")
                        }
                    }
                }
            })
        },
        getMrcdrs: function() {
            urlAjxPlngMrcd = btoa(urlAjxPlngMrcd).replace("/", "@");
            $.ajax({
                url: "ws/directo/" + urlAjxPlngMrcd,
                type: "GET",
                async: false,
                dataType: "xml",
                success: function(data) {
                    $(data).find("JSON").each(function() {
                        eval($(this)[0].innerHTML);
                        var vnLengthR = Resultados.length;
                        for (r = 0; r < vnLengthR; r++) {
                            Resultado = Resultados[r];
                            $(".cntPrtdo").each(function(index) {
                                dato = $(this).attr("id").split("_")[1];
                                if (dato == Resultado.IDPartido) {
                                    $(".mrcdPrtd_" + Resultado.IDPartido + "_" + Resultado.IDLocal).html(Resultado.GolLocal);
                                    $(".mrcdPrtd_" + Resultado.IDPartido + "_" + Resultado.IDVisita).html(Resultado.GolVisita);
                                    $(".stsPrtd_" + Resultado.IDPartido).html(parametrosMXM[Resultado.IDEsttGmCs][0]);
                                    if (Resultado.IDEsttGmCs > 1 && Resultado.IDEsttGmCs < 6) {}
                                }
                            })
                        }
                    })
                }
            })
        },
        getNotific: function() {
            var idMnsj = 0;
            var vntemp = -1;
            var vsMnsj = "";
            urlAjxPlngNtfc = btoa(urlAjxPlngNtfc).replace("/", "@");
            $.ajax({
                url: "ws/directo/" + urlAjxPlngNtfc,
                type: "GET",
                async: false,
                success: function(data) {
                    eval(data);
                    if (Resultado.Last != "0") {
                        vntemp = parseInt(Resultado.Last.split(".")[1])
                    }
                    if (vntemp > idMnsj) {
                        idMnsj = vntemp;
                        vsMnsj = Resultado.Messajes[0];
                        vsMnsj.IdTipo = "";
                        urlEvnt = "/cancha/mxm/" + vsMnsj.IdPartido + "/" + btoa('{"idClublocal":"' + vsMnsj.IdLocal + '","idClubvisita":"' + vsMnsj.IdVisita + '","idPartido":"' + vsMnsj.IdPartido + '","pestana":"3"}');
                        var msg = '<div class="alerta-header ' + (_sitio == 2 ? "ascenso" : _sitio == 7 ? "copa" : "") + ' "><i class="ico"></i>Minuto a minuto<span class="btn-close"></span></div><div class="alerta-mensaje">' + (me.options.vnIDDivision==14?'':'<h3 class="titulo"></h3>');
                        msg += "<p>" + vsMnsj.Comentario + "</p>";
                        msg += '<div class="pie">';
                        msg += '<div class="teams-alert"><img src="/media/images/aflddrct/logos35x35/' + vsMnsj.IdLocal + "/" + vsMnsj.IdLocal + '.png" alt="" height="40" width="40" class="local">';
                        msg += '<div class="score-alert"><span class="local"></span></div><img src="/media/images/aflddrct/logos35x35/' + vsMnsj.IdVisita + "/" + vsMnsj.IdVisita + '.png" alt="" height="40" width="40" class="visit">';
                        msg += '</div><a href="' + urlEvnt + '" class="link">Ver más</a>';
                        msg += "</div>";
                        msg += "</div>";
                        toastr.options = {
                            closeButton: false,
                            debug: false,
                            progressBar: true,
                            positionClass: "toast-top-right",
                            preventDuplicates: false,
                            showDuration: 300,
                            hideDuration: 1000,
                            timeOut: 15000,
                            extendedTimeOut: 4000,
                            showEasing: "swing",
                            hideEasing: "linear",
                            showMethod: "slideDown",
                            hideMethod: "slideUp"
                        };
                        var $toast = toastr.success(msg);
                        $toastlast = $toast;

                        function getLastToast() {
                            return $toastlast
                        }
                        $("#clearlasttoast").click(function() {
                            toastr.clear(getLastToast())
                        });
                        $("#cleartoasts").click(function() {
                            toastr.clear()
                        });
                        var MySound = (vsMnsj.IdTipo == "1") ? new Audio("https://s3.amazonaws.com/lmxwebsite/media/sounds/soundgoal.mp3") : new Audio("https://s3.amazonaws.com/lmxwebsite/media/sounds/notific.mp3");
                        MySound.load();
                        MySound.play()
                    }
                }
            })
        }
    };
    $.fn.master = function(options) {
        return this.each(function() {
            if ($(this).data("master")) {
                return
            }
            $(this).data("master", new wdgt_master(this, options))
        })
    }
}(jQuery));
