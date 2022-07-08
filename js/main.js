// A $( document ).ready() block.
$(document).ready(function () {
    $.getJSON("js/json/nav.json", function (data) {
        Nav.init({
            "data": data,
            $el: $(".main-nav").eq(0)
        });
        Nav.build($("#main_menu"));
        Nav.firstPage();

    });
    $("main").attr("aria-live", "assertive");


    let lang = $("html").attr("lang");
    let modTitle = $('.add-title');
    let modBody = $('.modal-body');
    let closeBtnLow = $('#btn_close_1');
    setTimeout(() => {
        $('#modal_1').attr('open', '')
    }, 1000);

    if (lang === 'fr') {
        modTitle.html(`Suivez les instructions`);
        modBody.html(`Trouver 10 problèmes d'accessibilité 🔎`);
        closeBtnLow.text('close');
    } else {
        modTitle.html(`Follow the isntructions`);
        modBody.html(`Find 10 accessibility issues 🔎`);
        closeBtnLow.text('Fermer');
    }

});

/* **********************************************
 * * NAV
 * *********************************************/
const Nav = {
    init: function (options) {
        this.pages = [];
        this.pageList = []

        //create the pages
        this.createPages(options.data);
        this.$el = options.$el
        this.currentPage = null;
        this.lang = $("html").attr("lang");

    },

    createPages: function (data) {
        let newPage;
        let index = 0;
        for (let key in data) {

            newPage = new Page(data[key], this, index);
            this.pages[key] = newPage;
            this.pageList[this.pageList.length] = newPage;
            index++;
        }

    },
    build: function ($location) {
        for (let i = 0; i < this.pageList.length; i++) {
            this.pageList[i].addToDom($location);
        }

        //create dropdown
        this.initDropdown();
        this.initBacknext();
        this.initToolbar();

    },
    initDropdown: function () {
        let that = this;
        let $link = this.$el.children("h2").children("a");
        let $list = this.$el.children("ul");
        this.$el.children("ul").find("a").attr("tabindex", "-1");
        //label for dropdown
        let aria = (this.lang === "fr") ?
            "Menu. Press Enter to open, then Down to navigate" :
            "Menu. Appuyez sur la touche Entrée pour ouvrir, puis sur la touche Bas pour naviguer.";
        $link.attr("aria-label", aria);
        $link.attr("aria-haspopup", "true");
        $link.attr("aria-controls", "main_menu");
        $link.attr("aria-expanded", "false");
        //dropdown aria
        $list.attr("aria-hidden", "true");
        //$list.attr("aria-expanded", "false");



        this.hideMenu();
        //set the click event
        this.setEvents();

    },
    initBacknext: function () {
        let that = this;
        $(".backnext").find("a.prev").click(function () {
            that.prev();
            return false;
        });
        $(".backnext").find("a.next").click(function () {
            that.next();
            return false;
        });
        $(".backnext").find("a").attr("aria-controls", "dynamic_content");

    },
    setPageof: function () {
        let pageIndex = this.currentPage.index + 1;
        let pageNb = this.pageList.length;
        let of = (this.lang === "fr") ? " of " : " de ";
        let pageOfTxt = pageIndex + of +pageNb;
        $(".pageof").html(pageOfTxt);
    },
    initToolbar: function () {
        let that = this;

        let $tools = $("#toolbar");
        let $home = $tools.find("a.home");
        let $help = $tools.find("a.help");
        let $quit = $tools.find("a.quit");

        $home.click(function () {
            that.firstPage();
            return false;
        });

        $help.click(function () {
            let help = (that.lang === "fr") ? "If you need help please contact helpme@email.com" : "Si vous avez besoin d’aide, veuillez contacter helpme@email.com.";
            alert(help);
            return false;
        });
        $quit.click(function () {
            let close = (that.lang === "fr") ? "Closing course" : "Fermeture du cours";
            alert(close);
            return false;
        });
    },
    // --------------------------loading ---------------------------
    firstPage: function () {
        this.loadPage(this.pageList[0]);
    },
    loadPage: function (pageObj) {
        let that = this;
        this.currentPage = pageObj;
        let $main = $("#dynamic_content");


        $main.fadeOut(function () {
            let filename = "./content/" + pageObj.page + "_" + $("html").attr("lang") + ".html"
            $.get(filename, function (data) {
                    $main.html(data)
                    that.isLoaded();
                    document.title = pageObj.title;
                })
                .fail(function () {
                    that.loadFailed(pageObj);
                    document.title = pageObj.title;
                })
                .always(function () {
                    $main.fadeIn();
                });

        });

        this.setPageof();
        this.disableBackNext();


    },
    next: function () {
        let lastIndex = this.pageList.length - 1;
        if (this.currentPage.index !== lastIndex) {


            this.loadPage(this.pageList[this.currentPage.index + 1]);
        }

    },
    prev: function () {
        if (this.currentPage.index !== 0) {
            this.loadPage(this.pageList[this.currentPage.index - 1]);
        }
    },
    disableBackNext: function () {
        let lastIndex = this.pageList.length - 1;
        let $prev = $(".prev");
        let $next = $(".next");
        let $both = $(".prev, .next");

        $both.removeClass("disabled");
        $both.attr("aria-disabled", false);
        $both.removeAttr("tabindex");

        if (this.currentPage.index === 0) {
            //disable prev
            $prev.addClass("disabled");
            $prev.attr("aria-disabled", true);
            $prev.attr("tabindex", "-1");
        }
        if (this.currentPage.index === lastIndex) {
            //disable next
            $next.addClass("disabled");
            $next.attr("aria-disabled", true);
            $next.attr("tabindex", "-1");
        }
    },

    // -------------------------AFTER LOAD
    isLoaded: function () {
        //when the page is loaded
        $(document).trigger("navigation:pageLoad", [this]);
    },
    loadFailed: function (page) {
        //load 404
        $("#dynamic_content").html("<h1>Page Load Failed: " + page.title + "</h1>");
    },

    // --------------------------MENU MANAGEMENT ---------------------------

    setEvents: function () {
        let that = this;
        let $link = this.$el.children("h2").children("a");
        //OUTSIDE CLICK
        $(window).click(function (e) {
            //Hide the menus if visible
            if ($(e.target).attr("id") !== "mainmenu_link") {
                that.clickOutside();
            }

        });
        //click on link
        $link.click(function (e) {
            that.showMenu();
            that.pressDown();
        });
        //keyboard events
        $link.keydown(function (e) {
            if (e.which == 40) {
                //DOWN
                e.preventDefault();
                that.showMenu();
                that.pressDown();
                return false;
            } else if (e.which == 9) {
                //tabbing
                that.hideMenu();
            }
        });

        document.onkeydown = function (e) {
            if (e.which === 27) {
                that.hideMenu();
            }
        };
    },
    // --------------------------MENU STATES ---------------------------


    clickOutside: function () {
        this.hideMenu();
    },
    showMenu: function () {
        this.$el.children("h2").children("a").attr("aria-expanded", "true");
        this.$el.children("ul").show(); //.attr("aria-visible", "true");
    },
    hideMenu: function () {
        this.$el.children("h2").children("a").attr("aria-expanded", "false");
        this.$el.children("ul").hide(); //.show().attr("aria-visible", "false");

    },
    pressDown: function () {
        this.pageList[0].setFocus();
    },
    toggleMenu: function () {
        this.$el.children("ul").toggle();
    }
}



/* *********************************************************************
 * * PAGE
 * **********************************************************************/

function Page(data, parent, index) {
    this.parent = parent;
    this.page = data.page;
    this.title = ($("html").attr("lang") === "fr") ? data.title_fr : data.title;
    this.index = index;

    this.addToDom = function ($location) {
        let that = this;
        $location.append("<li><a href='#' data-page=\"" + this.page + "\" role='menuitem'>" + this.title + "</a></li>");
        this.$el = $location.children("li").children("a").last();
        this.$el.attr("aria-controls", "dynamic_content");
        this.$el.attr("aria-label", "Navigate to " + this.title)
        this.$el.click(function () {
            that.clickLink();
        });
        this.$el.keydown(function (e) {
            if (e.which == 40) {
                that.focusNextPage();
                return false;
            } else if (e.which == 38) {
                that.focusPrevPage();
            } else if (e.which == 9) {
                that.parent.hideMenu();
            }
        });



    };

    this.clickLink = function () {
        this.parent.loadPage(this);
    }

    this.setFocus = function () {
        this.$el.focus();
    }

    this.loadPage = function () {
        this.parent.loadPage(this);
    }

    this.focusNextPage = function () {
        //find this' parents total indexes
        let totalIndexes = this.parent.pageList.length;
        if ((this.index + 1) === totalIndexes) {
            //you're last
            this.parent.pageList[0].setFocus();

        } else {
            this.parent.pageList[this.index + 1].setFocus();
        }

    }
    this.focusPrevPage = function () {
        //find this' parents total indexes
        let totalIndexes = this.parent.pageList.length;
        if ((this.index) === 0) {
            //you're first
            this.parent.pageList[totalIndexes - 1].setFocus();

        } else {
            this.parent.pageList[this.index - 1].setFocus();
        }
    }
}