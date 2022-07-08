// A $( document ).ready() block.
$(document).ready(function () {



    $(document).on("navigation:pageLoad", function (event, nav) {
        tweakLinkList();
        tweakTools(nav.currentPage);
        timeout(nav.currentPage);
        switchNext(nav.currentPage);
        initNotBacknext(nav)
    });

});

function tweakLinkList() {
    let listClass = ".list-of-links";
    let $list = $(listClass).find("a");
    let $el1, $el2, tab1, tab2;
    if ($list.length > 0) {
        $el1 = $list.eq(1);
        $el2 = $("a.help");


        $list.addClass("tabbed-link");
        let $complete = $("a,.quite-small");

        for (let i = 0; i < $complete.length; i++) {
            $complete.eq(i).attr("tabindex", i);

        }
        tab1 = $el1.attr("tabindex");
        tab2 = $el2.attr("tabindex");
        $el1.attr("tabindex", tab2);
        $el2.attr("tabindex", tab1);
        //$list.eq(2).parent().insertBefore($list.eq(2).parent().prev());



    } else {
        $("[tabindex]").removeAttr("tabindex");
    }

}

function tweakTools(page) {
    if (page.index === 2) {
        $("a.home").text("First Page");
    } else {
        $("a.home").text("Home");

    }
}

function timeout(page) {
    if (page.index === 2) {



        setTimeout(function () {
            $(".10-secs").remove();
        }, 5000);
    }
}

function switchNext(page) {
    console.log(page)
    if (page.index === 0) {
        $("footer .backnext").hide()
    } else {
        $("footer .backnext").show()
    }

}


function initNotBacknext(nav) {
    let that = nav;
    $(".not-backnext").find("a.prev").click(function () {
        that.prev();
        return false;
    });
    $(".not-backnext").find("a.next").click(function () {
        that.next();
        return false;
    });
    $(".not-backnext").find("a").attr("aria-controls", "dynamic_content");
}