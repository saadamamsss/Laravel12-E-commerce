$(window).on('load', () => {


    $(document).on('click', '.eye', function (e) {
        if ($(this).siblings()[1].getAttribute('type', 'text') == 'password') {
            $(this).siblings()[1].setAttribute('type', 'text');
            $(this).children('i').attr('class', 'fa-solid fa-eye');
        }
        else {
            $(this).siblings()[1].setAttribute('type', 'password');
            $(this).children('i').attr('class', 'fa-solid fa-eye-slash');

        }

    });

    $(document).on('click', '.topbar-menu-area .topbar-menu li.parent .item-header', function () {

        if ($('.topbar-menu .submenu').hasClass('submenutoggle') && !$(this).parent('li').children('.submenu').hasClass('submenutoggle')) $('.topbar-menu .submenu').removeClass('submenutoggle');

        $('.dropdown-menu').fadeOut('fast');

        $(this).parent('li').children('.submenu').toggleClass('submenutoggle');

    });

    /////////////////////////////////////////////////////////////////////////////////////////////////

    $(document).on('click', '.menuparent', function (e) {
        if ($('.topbar-menu .submenu').hasClass('submenutoggle')) {
            $('.topbar-menu .submenu').removeClass('submenutoggle');
        }
        const _this = $(this);
        if ($('#notif-dropdown-menu').children('a').length == 0) return;
        $(this).parent('.dropdown').children('.dropdown-menu').fadeToggle('fast');

    });

    $(document).on('click', '.list-group li', function (e) {


        if (e.target.className == 'close') {
            return;
        } else {
            const _this = $(this);
            const href = _this.attr('href');
            const id = _this.attr('data-id');
            axios.post("/customer/api/notificationdelete", { id: id }).then((response) => {
                console.log(response.data);

            }).catch((err) => {

            }).finally(() => {
                location.assign(href);
            });

        }
    });

    $(document).on('click', '.list-group li .close', function (e) {
        const _this = $(this);
        const id = _this.parent('li').attr('data-id');
        _this.parent('li').animate({
            left: '-40px'
        }, 'fast', function () {
            _this.parent('li').remove();
            axios.post("/customer/api/notificationdelete", { id: id }).then((response) => {
                console.log(response.data);

            })
        });

        //_this.parent('li').parent('ul').parent('a').children('button').length
        if (_this.parent('li').siblings().length == 0) {
            _this.parent('li').parent('ul').parent('a').remove();
            //console.log('remove a');
            if ($('#notif-dropdown-menu').children('a').length == 0) {
                $('#notif-dropdown-menu').fadeOut('fast');
                $('.Notifications .fa-circle').hide();
            }
        }
        if (_this.parent('li').siblings().length - 1 == 0) {
            _this.parent('li').parent('ul').parent('a').children('button').remove();
        }

        if (_this.parent('li').parent('ul').parent('a').children('button').children('span').length == 0) {
            // console.log(_this.parent('li').hasClass('exp'));
            if (_this.parent('li').hasClass('exp')) {

            } else {
                _this.parent('li').next().fadeIn('fast');
                _this.parent('li').next().removeClass('exp');
                //console.log('fade in');
            }
        } else {
            _this.parent('li').next().fadeIn('fast');
            _this.parent('li').next().removeClass('exp');
            _this.parent('li').parent('ul').parent('a').children('button').children('span').children('span')
                .text(_this.parent('li').siblings().length - 1);
            //console.log('fade in');
        }


    })
    $(document).on('click', '.plus_notifications', function (e) {

        if ($(this).children('span').length == 0) {
            var id = $(this).parent('a').attr('id');
            $(this).html(`<span>+
      <span id="${id}-counts">
        ${$(this).parent('a').children('ul').children('.exp').length}
      </span>
      notifications
      </span>`);
        } else {
            $(this).html('see fewer');
        }
        $(this).parent('.dropdown-item').children('ul').children('.exp').slideToggle();

    });

});