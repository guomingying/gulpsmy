$.ajax({
    url: '/api/list',
    dataType: 'json',
    success: function(res) {
        console.log(res);
        if (res.code === 1) {
            render(res.data);
        }
    }
})

function render(data) {
    var str = "";
    data.forEach(element => {
        str += `<dl>
        <dt>
            <img src="img/1.png" alt="">
        </dt>
        <dd>${element.name}</dd>
    </dl>`
    });
    $('.list').html(str);

}
var swiper = new Swiper('.swiper-container', {
    autoplay: {
        delay: 1000,
    },
    loop: true,
})
var scroll = new BScroll('.list-wrap', {
    probeType: 1,
    scrollY: true
})
scroll.on("scroll", function() {
    scroll.refresh();
})