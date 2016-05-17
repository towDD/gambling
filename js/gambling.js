/**
 * Created by v.zhouzhujun on 2016/4/15.
 */
require.config({
    paths: {
        "jquery": "lib/jquery-1.11.2.min",
        "underscore": "lib/underscore-min",
        "backbone": "lib/backbone"
    }
});

requirejs.config({

    shim: {

        'underscore': {
            exports: '_'
        },

        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }

    }

});


require(['underscore', 'jquery', 'backbone'], function (_, $, Backbone) {
    var NewModel = Backbone.Model.extend({
            initialize: function () {

                this.set({
                    "odds": [0, 1, 2, 5, 10, 50, 100, 500],
                    "co": 142.85,
                    aBet: 0,
                    principal: 10000,
                    num: 0,
                    small: 0.25,
                    mid: 1,
                    big: 10
                })
            }

        })
        ;


    var Gambling = Backbone.View.extend({
        initialize: function () {
            var model = this.model;
            model.on({
                "change:principal": function () {
                    $(".bet").text(model.get("principal"));
                }
            })

            var list = [];
            //this.list.concat(document.querySelectorAll(".topLine li"),
            //    document.querySelectorAll(".rightLine li"),
            //    document.querySelectorAll(".bottomLine li"),
            //    document.querySelectorAll(".leftLin li")
            //)
            var bottomLine = [];
            var leftLin = []
            Array.prototype.forEach.call(document.querySelectorAll(".topLine li"), function (item, index, arr) {
                list.push($(item));
            });
            Array.prototype.forEach.call(document.querySelectorAll(".rightLine li"), function (item, index, arr) {
                list.push($(item));
            });

            Array.prototype.forEach.call(document.querySelectorAll(".bottomLine li"), function (item, index, arr) {
                bottomLine.push($(item));
            });
            bottomLine.reverse();
            var temp = list.concat(bottomLine);

            Array.prototype.forEach.call(document.querySelectorAll(".leftLin li"), function (item, index, arr) {
                leftLin.push($(item));
            });
            leftLin.reverse();
            list = temp.concat(leftLin);
            this.list = list
            console.log(this.list.length);


            //var gamblingBox = $(".gamblingBox");
            //var g1 = gamblingBox.find("g1");

            //this.model.get("odds").each(function(){
            //
            //})
        },
        list: [],
        el: document.querySelector(".pane"),
        events: {
            "click .small": "small",
            "click .mid": "mid",
            "click .big": "big"
        },
        render: function (bet, principal) {
            //console.log(this)
            $(".btnBox").find("input").attr("disabled", "disabled");
            $(".pane li.active").removeClass("active");
            var that = this;
            var i = 0;
            var stop = false;
            var list = this.list;

            //function timeout(ms) {
            //    return new Promise(function (resolve, reject) {
            //        setTimeout(resolve("done"), ms);
            //    });
            //}
            //
            //timeout(100).then(function (value) {
            //    console.log(value);
            //});


            var loop = function (delay) {
                // console.log(this)


                if (!stop) {
                    setTimeout(function () {
                        var j = i - 1
                        list[i].addClass("active");
                        if (j < 0) {
                            j = list.length - 1;

                        }

                        list[j].removeClass("active");

                        //console.log(delay)

                        var cir = Math.random() * 100;

                        if (delay > 144 + cir) {
                            console.log(bet.toString())
                            if (list[i].attr("data-value") == bet.toString()) {
                                stop = true;
                                $(".btnBox").find("input").removeAttr("disabled");
                                that.model.set("principal", principal);
                            } else {
                                loop(delay);
                            }

                        } else {
                            loop(delay + 5);
                        }
                        if (i < list.length - 1) {
                            i++;
                        } else {
                            i = 0;
                        }


                    }, delay);

                } else {
                    return list[i];
                    $(".btnBox").find("input").removeAttr("disabled");
                }

            }
            loop(42)
        },
        calculate: function (r, size) {
            var sum = [];
            var principal = this.model.get("principal");
            for (var i = 1; i < this.model.get("odds").length; i++) {
                sum[i] = 1 / this.model.get("odds")[i] * this.model.get("co") * r;
            }
            principal = principal - size;
            this.model.set("principal", principal);
            this.Gambling(sum, size);
        },
        small: function () {
            this.calculate(0.95, this.model.get("small"));

        },
        mid: function () {
            this.calculate(0.8, this.model.get("mid"));
        },
        big: function () {
            this.calculate(0.55, this.model.get("big"));
        }
        ,
        Gambling: function (sum, bet) {
            //console.log(sum);
            var win = Math.random() * 100;

            var b = 0;
            var principal = this.model.get("principal");
            var i = 0;
            if (win < sum[1]) {
                b = bet * 1;
                i = 1;
            } else if (win < sum[2]) {
                b = bet * 2;
                i = 2;
            } else if (win < sum[3]) {
                b = bet * 5;
                i = 5;
            } else if (win < sum[4]) {
                b = bet * 10;
                i = 10;
            } else if (win < sum[5]) {
                b = bet * 50;
                i = 50;
            } else if (win < sum[6]) {
                b = bet * 100;
                i = 100;
            } else if (win < sum[7]) {
                b = bet * 500;
                i = 500;
            }

            var num = this.model.get("num");
            this.model.set("num", num + 1);


            this.render(i, principal + b);
            //$(".get").text(parseInt($(".get").text()) + b);
            //$(".num").text(this.model.get("num") + "+++" + i);

        }

    });


    var ntst = new NewModel();
    var ui = new Gambling({
        model: ntst
    });

})
