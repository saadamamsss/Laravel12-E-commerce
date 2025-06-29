import { ref, computed, onMounted, onUnmounted, mergeProps, unref, withCtx, createTextVNode, useSSRContext, createVNode, toDisplayString, resolveDynamicComponent, createBlock, openBlock, Fragment, renderList, renderSlot, createCommentVNode, withModifiers, mergeModels, useModel, watch, onBeforeUnmount, resolveComponent, Suspense, withDirectives, vModelCheckbox, vModelText, vModelSelect, reactive, vModelRadio, withKeys, nextTick, createSSRApp, h } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderSlot, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderVNode, ssrGetDynamicModelProps, ssrRenderSuspense } from "vue/server-renderer";
import { usePage, Link, useForm, Head, createInertiaApp } from "@inertiajs/vue3";
import { defineStore, createPinia } from "pinia";
import axios from "axios";
import { HomeIcon, MapPinIcon, ShoppingBagIcon, CreditCardIcon, QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
import { route as route$1, ZiggyVue } from "ziggy-js";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
const useCartState = defineStore("CART", () => {
  const count = ref(0);
  ref({});
  function setCartCount(cartcount) {
    count.value = cartcount;
  }
  return {
    count,
    setCartCount
  };
});
const API = axios.create({
  baseURL: `/_/api/`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  withCredentials: true
});
API.interceptors.request.use(
  (config) => {
    var _a;
    if (config.method !== "get") {
      const csrfToken = (_a = document.querySelector(
        'meta[name="csrf-token"]'
      )) == null ? void 0 : _a.content;
      if (csrfToken) {
        config.headers["X-CSRF-TOKEN"] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const _sfc_main$V = {
  __name: "NotificationBell",
  __ssrInlineRender: true,
  props: {
    initialNotifications: {
      type: Array,
      default: () => []
    },
    unreadCount: {
      type: Number,
      default: 0
    }
  },
  setup(__props) {
    const { props: pageProps } = usePage();
    const props = __props;
    const showDropdown = ref(false);
    const notifications = ref(props.initialNotifications);
    const groupedNotifications = computed(() => {
      const groups = {};
      notifications.value.forEach((notification) => {
        const key = `${notification.data.notifiable_type}-${notification.data.notifiable_id}`;
        if (!groups[key]) {
          groups[key] = {
            type: notification.data.notifiable_type,
            id: notification.data.notifiable_id,
            count: 0,
            unreadCount: 0,
            latestDate: null,
            latestMessage: "",
            title: "",
            url: notification.data.url,
            primaryIds: []
          };
        }
        if (!groups[key].latestDate || new Date(notification.created_at) > new Date(groups[key].latestDate)) {
          groups[key].latestDate = notification.created_at;
          groups[key].latestMessage = notification.data.message;
          groups[key].title = getGroupTitle(notification);
          groups[key].url = notification.data.url;
        }
        groups[key].count++;
        groups[key].primaryIds.push(notification.id);
        if (!notification.read_at) {
          groups[key].unreadCount++;
        }
      });
      return Object.values(groups).sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate));
    });
    const totalUnreadCount = computed(() => {
      return groupedNotifications.value.reduce((sum, group) => sum + group.unreadCount, 0);
    });
    const getGroupTitle = (notification) => {
      const type = notification.data.notifiable_type;
      const id = notification.data.notifiable_id;
      switch (type) {
        case "Contact":
          return `Contact Message #${id}`;
        default:
          return `${type} #${id}`;
      }
    };
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
    const formatNotifiableType = (type) => {
      const types = {
        "Order": "Order",
        "Review": "Review",
        "Contact": "Contact"
      };
      return types[type] || type;
    };
    const clickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        showDropdown.value = false;
      }
    };
    onMounted(() => {
      document.addEventListener("click", clickOutside);
      if (pageProps.auth.user) {
        `user.${pageProps.auth.user.id}-channel`;
        window.Echo.private("user." + pageProps.auth.user.id).notification((notification) => {
          notifications.value.unshift(notification);
        });
      }
    });
    onUnmounted(() => {
      document.removeEventListener("click", clickOutside);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({ class: "relative px-2" }, _attrs))}><button class="relative"><i class="fa-solid fa-bell"></i>`);
      if (totalUnreadCount.value > 0) {
        _push(`<span class="absolute top-0 -right-1 bg-red-500/90 text-white rounded-full w-2 h-2 flex items-center justify-center text-xs"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (showDropdown.value) {
        _push(`<div class="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200"><div class="px-4 py-2 border-b bg-gray-50 flex justify-between items-center"><h3 class="font-medium">Notifications</h3><button class="text-xs text-blue-600 hover:text-blue-800"> Mark all as read </button></div><div class="max-h-96 overflow-y-auto">`);
        if (groupedNotifications.value.length === 0) {
          _push(`<div class="p-4 text-center text-gray-500"> No new notifications </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(groupedNotifications.value, (group) => {
          _push(`<div class="${ssrRenderClass([{ "bg-blue-50": group.unreadCount > 0 }, "border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"])}"><div class="px-4 py-3"><div class="flex justify-between items-start"><div><p class="${ssrRenderClass([{ "text-blue-600": group.unreadCount > 0 }, "font-medium text-sm"])}">${ssrInterpolate(group.title)}</p><p class="text-xs text-gray-500 mt-1">${ssrInterpolate(formatTime(group.latestDate))}</p></div>`);
          if (group.count > 1) {
            _push(`<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${ssrInterpolate(group.count)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mt-2"><p class="text-xs text-gray-600 truncate">${ssrInterpolate(group.latestMessage)}</p></div><div class="mt-1"><span class="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-600">${ssrInterpolate(formatNotifiableType(group.type))}</span>`);
          if (group.unreadCount > 0) {
            _push(`<span class="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">${ssrInterpolate(group.unreadCount)} unread </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
        _push(ssrRenderComponent(unref(Link), {
          href: "#",
          class: "block px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 border-t"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View all notifications `);
            } else {
              return [
                createTextVNode(" View all notifications ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</li>`);
    };
  }
};
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/NotificationBell.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const _sfc_main$U = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const { props } = usePage();
    const CART = useCartState();
    CART.setCartCount(props.cartCount);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<!--[--><header id="header" class="header header-style-1"><div class="container-fluid"><div class="row"><div class="topbar-menu-area"><div class="container"><div class="topbar-menu left-menu"><ul><li class="menu-item"><a title="Hotline: (+123) 456 789" href="#"><span class="icon label-before fa fa-mobile"></span>Hotline: (+123) 456 789</a></li></ul></div><div class="topbar-menu right-menu"><ul>`);
      if (_ctx.$page.props.auth.user) {
        _push(ssrRenderComponent(_sfc_main$V, {
          "initial-notifications": _ctx.$page.props.notifications || []
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$page.props.auth.user) {
        _push(`<li class="menu-item menu-item-has-children parent"><a class="item-header cursor-pointer" title="User">${ssrInterpolate((_a = _ctx.$page.props.auth.user) == null ? void 0 : _a.name)} <i class="fa fa-user" aria-hidden="true"></i></a>`);
        if (((_b = _ctx.$page.props.auth.user) == null ? void 0 : _b.role) == "ADM") {
          _push(`<ul class="submenu curency"><li class="menu-item">`);
          _push(ssrRenderComponent(unref(Link), {
            title: "Dashboard",
            href: "/account/dashboard"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Dashboard`);
              } else {
                return [
                  createTextVNode("Dashboard")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li><li class="menu-item"><a title="Logout" href=""> Logout </a><form id="logout-form" action="" method="POST" class="d-none"></form></li></ul>`);
        } else {
          _push(`<!---->`);
        }
        if (((_c = _ctx.$page.props.auth.user) == null ? void 0 : _c.role) == "USR") {
          _push(`<ul class="submenu curency"><li class="menu-item">`);
          _push(ssrRenderComponent(unref(Link), {
            title: "Account",
            href: "/account"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Account`);
              } else {
                return [
                  createTextVNode("Account")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li><li class="menu-item">`);
          _push(ssrRenderComponent(unref(Link), {
            title: "Account",
            href: "/orders"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Orders`);
              } else {
                return [
                  createTextVNode("Orders")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li><li class="nav-divider"></li><li class="menu-item" style="${ssrRenderStyle({ "color": "rgb(245, 35, 52)" })}"><a title="Logout" href=""> Logout </a><form id="logout-form" action="" method="POST" class="d-none"></form></li></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      } else {
        _push(`<li class="menu-item">`);
        _push(ssrRenderComponent(unref(Link), {
          title: "Register or Login",
          href: "/login"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Sign In`);
            } else {
              return [
                createTextVNode("Sign In")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
      }
      _push(`</ul></div></div></div><div class="container"><div class="mid-section main-info-area"><div class="wrap-logo-top left-section"><a href="/" class="link-to-home"><img src="/assets/images/logo-top-1.png" alt="mercado"></a></div><div class="wrap-search center-section"><div class="wrap-search-form"><form action="/shop" id="form-search-top" name="form-search-top"><input type="text" name="search" value="" placeholder="Search here..."><button form="form-search-top" type="submit"><i class="fa fa-search" aria-hidden="true"></i></button></form></div></div><div class="wrap-icon right-section"><div class="wrap-icon-section wishlist">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "#",
        onClick: () => {
        },
        class: "link-direction"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa fa-heart" aria-hidden="true"${_scopeId}></i><div class="left-info"${_scopeId}><span class="index"${_scopeId}>0 item</span><span class="title"${_scopeId}>Wishlist</span></div>`);
          } else {
            return [
              createVNode("i", {
                class: "fa fa-heart",
                "aria-hidden": "true"
              }),
              createVNode("div", { class: "left-info" }, [
                createVNode("span", { class: "index" }, "0 item"),
                createVNode("span", { class: "title" }, "Wishlist")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="wrap-icon-section minicart">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/cart",
        class: "link-direction"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa fa-shopping-basket" aria-hidden="true"${_scopeId}></i><div class="left-info"${_scopeId}><span class="index"${_scopeId}><span id="cartindex"${_scopeId}>${ssrInterpolate(unref(CART).count)}</span> items</span><span class="title"${_scopeId}>CART</span></div>`);
          } else {
            return [
              createVNode("i", {
                class: "fa fa-shopping-basket",
                "aria-hidden": "true"
              }),
              createVNode("div", { class: "left-info" }, [
                createVNode("span", { class: "index" }, [
                  createVNode("span", { id: "cartindex" }, toDisplayString(unref(CART).count), 1),
                  createTextVNode(" items")
                ]),
                createVNode("span", { class: "title" }, "CART")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="wrap-icon-section show-up-after-1024"><a href="#" class="mobile-navigation"><span></span><span></span><span></span></a></div></div></div></div><div class="nav-section header-sticky w-full flex flex-column relative"><div class="header-nav-section"><div class="container"><ul class="nav menu-nav clone-main-menu" id="mercado_haead_menu" data-menuname="Sale Info"><!--[-->`);
      ssrRenderList(_ctx.$page.props.headerCollection, (item, index) => {
        _push(`<li class="menu-item">`);
        _push(ssrRenderComponent(unref(Link), {
          href: item.url,
          class: "link-term"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span class="nav-label hot-label">hot</span></li>`);
      });
      _push(`<!--]--></ul></div></div></div></div></div></header><div class="row mx-0 sticky top-0 z-10"><div class="primary-nav-section w-full"><div class="container"><ul class="nav primary clone-main-menu" id="mercado_main" data-menuname="Main menu"><li class="menu-item home-icon py-2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "link-term mercado-item-title"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="fa fa-home" aria-hidden="true"${_scopeId}></i>`);
          } else {
            return [
              createVNode("i", {
                class: "fa fa-home",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(unref(props).mainMenu, (item) => {
        _push(`<li class="menu-item py-2">`);
        _push(ssrRenderComponent(unref(Link), {
          href: item.url,
          class: "link-term mercado-item-title"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const saad_google_maps = function($) {
  if ($(".mercado-google-maps").length == 1) {
    var wfm = document.createElement("script");
    wfm.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBpXkIHekTsMPHuS_yuG1cIK0j5TvVjFkE";
    wfm.type = "text/javascript";
    var sm = document.getElementsByTagName("script")[0];
    sm.parentNode.insertBefore(wfm, sm);
  }
};
const saad = function($) {
  if (document.querySelectorAll(".cardcontent .col-lg-12").length > 0) {
    var width = document.querySelectorAll(".cardcontent .sa")[0].clientWidth;
    console.log(width);
    $(".cardcontent .col-lg-12 .checked span").css("width", width / 6);
    $(".cardcontent .col-lg-12 .checked p").css("width", width / 6);
  }
};
const mercado_product_slider = function($) {
  if ($(".product-gallery").length > 0) {
    $(".product-gallery").flexslider({
      animation: "slide",
      controlNav: "thumbnails"
    });
    var config = {
      margin: 10,
      nav: true,
      dots: false,
      loop: false,
      navText: [
        '<i class="fa fa-angle-left " aria-hidden="true"></i>',
        '<i class="fa fa-angle-right " aria-hidden="true"></i>'
      ]
    };
    config.responsive = {
      0: { items: "2" },
      370: { items: "3" },
      480: { items: "4" },
      768: { items: "4" },
      992: { items: "3" },
      1200: { items: "4" }
    };
    $(".flex-control-thumbs").owlCarousel(config);
  }
};
const mercado_toggle_slide_menu = function($) {
  if ($(".widget .has-child-cate").length > 0) {
    $(document).on(
      "click",
      ".widget .has-child-cate .toggle-control",
      function(el) {
        el.preventDefault();
        var _this = $(this);
        if (_this.parent().hasClass("open")) {
          _this.parent().removeClass("open");
        } else {
          _this.closest(".widget-content").find(".open").removeClass("open");
          _this.parent().addClass("open");
        }
      }
    );
  }
  if ($(".widget .list-limited").length > 0) {
    $(document).on("click", ".btn-control.control-show-more", function(e) {
      e.preventDefault();
      var _this = $(this);
      _this.parent().next().children().children().slideToggle();
      _this.toggleClass("hiddenList");
    });
  }
  if ($(".toggle-slide-menu").length > 0) {
    $(".toggle-slide-menu").on("click", ".btn-control a", function(el) {
      el.preventDefault();
      var _this = $(this);
      _this.parent().siblings(".default-hiden").slideToggle(300);
      _this.find("i").toggleClass("fa-rotate-180");
    });
  }
};
const mercado_price_range = function($) {
  if ($("#slider-range").length > 0) {
    const minprice = parseInt($("#minprice").val());
    const maxprice = parseInt($("#maxprice").val());
    const initial = $("#RangeVlaue").val().split(",").map(Number);
    $("#slider-range").slider({
      range: true,
      min: minprice,
      max: maxprice,
      values: initial,
      slide: function(event, ui) {
        $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        $("#RangeVlaue").val(ui.values.join(","));
      }
    });
    $("#amount").val(
      "$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1)
    );
  }
};
const mercado_clone_all_zan_menus = function($) {
  var i = 0;
  Array();
  $(".clone-main-menu").each(function() {
    var $this = $(this), thisMenu = $this, this_menu_id = thisMenu.attr("id"), this_menu_clone_id = "mercado-clone-" + this_menu_id;
    if (!$("#" + this_menu_clone_id).length) {
      var thisClone = $this.clone(true);
      thisClone.find(".menu-item").addClass("clone-menu-item");
      thisClone.find("[id]").each(function() {
        thisClone.find(
          '.vc_tta-panel-heading a[href="#' + $(this).attr("id") + '"]'
        ).attr(
          "href",
          "#" + mercado_add_string_prefix(
            $(this).attr("id"),
            "mercado-clone-"
          )
        );
        $(this).attr(
          "id",
          mercado_add_string_prefix(
            $(this).attr("id"),
            "mercado-clone-"
          )
        );
      });
      thisClone.find(".mercado-menu").addClass("mercado-menu-clone");
      var thisMenuId = "mercado-panel-" + $this.attr("id"), thisMenuname = $this.data("menuname");
      if (!$(".mercado-clone-wrap .mercado-panels #mercado-main-panel").length) {
        $(".mercado-clone-wrap .mercado-panels").append(
          '<div id="mercado-main-panel" class="mercado-panel mercado-main-panel"><ul class="depth-01"></ul></div>'
        );
      }
      $(
        ".mercado-clone-wrap .mercado-panels #mercado-main-panel ul"
      ).append(
        '<li class="menu-item"><a data-target="#' + thisMenuId + '" class="mercado-next-panel" href="#' + thisMenuId + '"></a><a title="' + thisMenuname + '" class="mercado-item-title" href="#">' + thisMenuname + "</a></li>"
      );
      if (!$(
        ".mercado-clone-wrap .mercado-panels #mercado-panel-" + this_menu_id
      ).length) {
        $(".mercado-clone-wrap .mercado-panels").append(
          '<div id="mercado-panel-' + this_menu_id + '" class="mercado-panel mercado-hidden"><ul class="depth-01"></ul></div>'
        );
      }
      var thisMainPanel = $(
        ".mercado-clone-wrap .mercado-panels #mercado-panel-" + this_menu_id + " ul"
      );
      thisMainPanel.html(thisClone.html());
      mercado_insert_children_panels_html_by_elem(
        $,
        thisMainPanel,
        i
      );
    }
  });
};
const mercado_insert_children_panels_html_by_elem = function($, $elem, i) {
  var index = parseInt(i, 10);
  if ($elem.find(".menu-item-has-children").length) {
    $elem.find(".menu-item-has-children").each(function() {
      var thisChildItem = $(this);
      mercado_insert_children_panels_html_by_elem(
        $,
        thisChildItem,
        index
      );
      var next_nav_target = "mercado-panel-" + String(index);
      while ($("#" + next_nav_target).length) {
        index++;
        next_nav_target = "mercado-panel-" + String(index);
      }
      thisChildItem.prepend(
        '<a class="mercado-next-panel" href="#' + next_nav_target + '" data-target="#' + next_nav_target + '"></a>'
      );
      var submenu_html = $("<div>").append(
        thisChildItem.find("> .submenu,> .wrap-megamenu").clone()
      ).html();
      thisChildItem.find("> .submenu,> .wrap-megamenu").remove();
      $(".mercado-clone-wrap .mercado-panels").append(
        '<div id="' + next_nav_target + '" class="mercado-panel mercado-sub-panel mercado-hidden">' + submenu_html + "</div>"
      );
    });
  }
};
const mercado_control_panel = function($) {
  $(document).on("click", ".mercado-next-panel", function(e) {
    var _this = $(this);
    _this.closest(".menu-item");
    var thisPanel = _this.closest(".mercado-panel"), target_id = _this.attr("href");
    if ($(target_id).length) {
      thisPanel.addClass("mercado-sub-opened");
      $(target_id).addClass("mercado-panel-opened").removeClass("mercado-hidden").attr("data-parent-panel", thisPanel.attr("id"));
      var item_title = "", firstItemTitle = "";
      item_title = _this.siblings(".mercado-item-title").attr("title");
      if (typeof item_title == "undefined") {
        item_title = "mercado menu";
      }
      if ($(".mercado-panels-actions-wrap .mercado-current-panel-title").length > 0) {
        firstItemTitle = $(
          ".mercado-panels-actions-wrap .mercado-current-panel-title"
        ).html();
      }
      $(".mercado-panels-actions-wrap").find(".mercado-current-panel-title").remove();
      $(".mercado-panels-actions-wrap").prepend(
        '<span class="mercado-current-panel-title">' + item_title + "</span>"
      );
      $(".mercado-panels-actions-wrap .mercado-prev-panel").remove();
      $(".mercado-panels-actions-wrap").prepend(
        '<a data-prenttitle="' + firstItemTitle + '" class="mercado-prev-panel" href="#' + thisPanel.attr("id") + '" data-cur-panel="' + target_id + '" data-target="#' + thisPanel.attr("id") + '"></a>'
      );
    }
    e.preventDefault();
  });
  $(document).on("click", ".mercado-prev-panel", function(e) {
    var $this = $(this), cur_panel_id = $this.attr("data-cur-panel"), target_id = $this.attr("href");
    $(cur_panel_id).removeClass("mercado-panel-opened").addClass("mercado-hidden");
    $(target_id).addClass("mercado-panel-opened").removeClass("mercado-sub-opened");
    var new_parent_panel_id = $(target_id).attr("data-parent-panel");
    if (typeof new_parent_panel_id == "undefined" || typeof new_parent_panel_id == false) {
      $(".mercado-panels-actions-wrap .mercado-prev-panel").remove();
      $(
        ".mercado-panels-actions-wrap .mercado-current-panel-title"
      ).remove();
    } else {
      $(".mercado-panels-actions-wrap .mercado-prev-panel").attr("href", "#" + new_parent_panel_id).attr("data-cur-panel", target_id).attr("data-target", "#" + new_parent_panel_id);
      var item_title = "";
      item_title = $("#" + new_parent_panel_id).find('.mercado-next-panel[data-target="' + target_id + '"]').siblings(".mercado-item-title").attr("title");
      if (typeof item_title == "undefined") {
        item_title = "mercado menu";
      }
      $(".mercado-panels-actions-wrap").prepend(
        '<span class="mercado-current-panel-title">' + item_title + "</span>"
      );
    }
    e.preventDefault();
  });
};
const mercado_control_mobile_menu = function($) {
  $(document).on("click", ".mobile-navigation", function(el) {
    el.preventDefault();
    $(".mercado-clone-wrap").addClass("open");
    return false;
  });
  $(document).on(
    "click",
    ".mercado-clone-wrap .mercado-close-panels",
    function() {
      $(".mercado-clone-wrap").removeClass("open");
      return false;
    }
  );
};
const mercado_innit_carousel = function($) {
  $(".owl-carousel").each(function(index, el) {
    var _this = $(this), _owl = _this, _config = _this.data(), _animateOut = _this.data("animateout"), _animateIn = _this.data("animatein"), _slidespeed = _this.data("slidespeed");
    _config.navText = [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ];
    if (typeof _animateOut != "undefined") {
      _config.animateOut = _animateOut;
    }
    if (typeof _animateIn != "undefined") {
      _config.animateIn = _animateIn;
    }
    if (typeof _slidespeed != "undefined") {
      _config.smartSpeed = _slidespeed;
    }
    if ($("body").hasClass("rtl")) {
      _config.rtl = true;
    }
    _owl.on("drag.owl.carousel", function(event) {
      _owl.addClass("owl-changed");
      setTimeout(function() {
        _owl.removeClass("owl-changed");
      }, _config.smartSpeed);
    });
    _owl.owlCarousel(_config);
  });
};
const mercado_tabs = function($) {
  if ($(".tab-control:not(.normal)").length > 0) {
    if ($(".tab-contents").length) {
      setTimeout(function() {
        $(".tab-contents:not(.tab-not-equal)").each(function() {
          var $this = $(this);
          if ($this.find(".tab-content-item").length) {
            $this.find(".tab-content-item").css({
              height: "auto"
            });
            var elem_height = 0;
            $this.find(".tab-content-item").each(function() {
              var this_elem_h = $(this).height();
              if (parseInt(elem_height, 10) < parseInt(this_elem_h, 10)) {
                elem_height = parseInt(this_elem_h, 10);
              }
            });
            $this.find(".tab-content-item").height(elem_height);
          }
        });
      }, 1200);
    }
    $(document).on(
      "click",
      ".tab-control .tab-control-item",
      function(ev) {
        ev.preventDefault();
        if (!$(this).hasClass("active")) {
          var _this = $(this), _link_content = _this.attr("href"), _tab_active = _this.closest(".wrap-product-tab").find(".tab-contents").find(_link_content);
          _this.siblings(".active").removeClass("active");
          _this.addClass("active");
          _this.closest(".wrap-product-tab").find(".tab-contents .active").removeClass("active");
          _tab_active.addClass("active");
          _tab_active.find(".wrap-products .owl-item").each(function(index) {
            var owl_item = $(this), style = $(this).attr("style"), tab_animated = "zoomIn", delay = parseInt(index, 10) * 100;
            owl_item.attr(
              "style",
              style + ";-webkit-animation-delay:" + String(delay) + "ms;-moz-animation-delay:" + String(delay) + "ms;-o-animation-delay:" + String(delay) + "ms;animation-delay:" + String(delay) + "ms;"
            ).addClass(tab_animated + " animated").one(
              "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
              function() {
                owl_item.removeClass(
                  tab_animated + " animated"
                );
                owl_item.attr("style", style);
              }
            );
          });
        }
      }
    );
  }
  if ($(".tab-control.normal").length > 0) {
    $(document).on(
      "click",
      ".tab-control.normal .tab-control-item",
      function(ev) {
        ev.preventDefault();
        var _this = $(this);
        if (!_this.hasClass("active")) {
          _this.siblings(".active").removeClass("active");
          _this.addClass("active");
          _this.parents().siblings(".tab-contents").find(".active").removeClass("active");
          _this.parents().siblings(".tab-contents").find(_this.attr("href")).addClass("active");
        }
      }
    );
  }
};
const mercado_countdown = function($) {
  if ($(".mercado-countdown").length > 0) {
    $(".mercado-countdown").each(function(index, el) {
      var _this = $(this), _expire = _this.data("expire");
      _this.countdown(_expire, function(event) {
        $(this).html(
          event.strftime(
            "<span><b>%D</b> Days</span> <span><b>%-H</b> Hrs</span> <span><b>%M</b> Mins</span> <span><b>%S</b> Secs</span>"
          )
        );
      });
    });
  }
};
const mercado_better_equal_elems = function($) {
  setTimeout(function() {
    $(".equal-container").each(function() {
      var _this = $(this), _children = _this.find(".equal-elem");
      if (_children.length) {
        _children.css("height", "auto");
        var max_height = 0;
        _children.each(function() {
          var el_height = $(this).height();
          if (max_height < parseFloat(el_height)) {
            max_height = parseFloat(el_height);
          }
        });
        _children.height(parseInt(max_height, 10));
      }
    });
  }, 1e3);
};
const mercado_remove_product_in_cart = function($) {
  if ($(".products-cart .pr-cart-item").length > 0) {
    $(document).on(
      "click",
      ".pr-cart-item .delete .btn-delete",
      function(event) {
        event.preventDefault();
        $(this).closest(".pr-cart-item").remove();
      }
    );
  }
};
const mercado_toggle_vertical_main_menu = function($) {
  if ($(".header.header-toggle .vertical-menu-toggle").length) {
    $(".header.header-toggle .vertical-menu-toggle").on(
      "click",
      ".wrap-toggle-menu",
      function(event) {
        event.preventDefault();
        $(this).toggleClass("close-menu");
      }
    );
  }
};
const InitallFunctions = () => {
  mercado_clone_all_zan_menus(
    window.Zepto || window.jQuery
  );
  mercado_control_mobile_menu(
    window.Zepto || window.jQuery
  );
  mercado_control_panel(window.Zepto || window.jQuery);
  mercado_tabs(window.Zepto || window.jQuery);
  mercado_countdown(window.Zepto || window.jQuery);
  mercado_better_equal_elems(window.Zepto || window.jQuery);
  mercado_toggle_slide_menu(window.Zepto || window.jQuery);
  mercado_price_range(window.Zepto || window.jQuery);
  mercado_remove_product_in_cart(
    window.Zepto || window.jQuery
  );
  mercado_product_slider(window.Zepto || window.jQuery);
  mercado_toggle_vertical_main_menu(
    window.Zepto || window.jQuery
  );
  saad_google_maps(window.Zepto || window.jQuery);
  saad(window.Zepto || window.jQuery);
  mercado_innit_carousel(window.Zepto || window.jQuery);
  mercado_price_range(window.Zepto || window.jQuery);
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$T = {};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ id: "footer" }, _attrs))}><div class="wrap-footer-content footer-style-1"><div class="wrap-function-info"><div class="container"><ul><li class="fc-info-item"><i class="fa fa-truck" aria-hidden="true"></i><div class="wrap-left-info"><h4 class="fc-name">Free Shipping</h4><p class="fc-desc">Free On Oder Over $99</p></div></li><li class="fc-info-item"><i class="fa fa-recycle" aria-hidden="true"></i><div class="wrap-left-info"><h4 class="fc-name">Guarantee</h4><p class="fc-desc">30 Days Money Back</p></div></li><li class="fc-info-item"><i class="fa fa-credit-card-alt" aria-hidden="true"></i><div class="wrap-left-info"><h4 class="fc-name">Safe Payment</h4><p class="fc-desc">Safe your online payment</p></div></li><li class="fc-info-item"><i class="fa fa-life-ring" aria-hidden="true"></i><div class="wrap-left-info"><h4 class="fc-name">Online Suport</h4><p class="fc-desc">We Have Support 24/7</p></div></li></ul></div></div><div class="main-footer-content"><div class="container"><div class="row"><div class="col-lg-4 col-sm-4 col-md-4 col-xs-12"><div class="wrap-footer-item"><h3 class="item-header">Contact Details</h3><div class="item-content"><div class="wrap-contact-detail"><ul><li><i class="fa fa-map-marker" aria-hidden="true"></i><p class="contact-txt"> 45 Grand Central Terminal New York,NY 1017 United State USA </p></li><li><i class="fa fa-phone" aria-hidden="true"></i><p class="contact-txt"> (+123) 456 789 - (+123) 666 888 </p></li><li><i class="fa fa-envelope" aria-hidden="true"></i><p class="contact-txt"> Contact@yourcompany.com </p></li></ul></div></div></div></div><div class="col-lg-4 col-sm-4 col-md-4 col-xs-12"><div class="wrap-footer-item"><h3 class="item-header">Hot Line</h3><div class="item-content"><div class="wrap-hotline-footer"><span class="desc">Call Us toll Free</span><b class="phone-number">(+123) 456 789 - (+123) 666 888</b></div></div></div><div class="wrap-footer-item footer-item-second"><h3 class="item-header"> Sign up for newsletter </h3><div class="item-content"><div class="wrap-newletter-footer"><form action="#" class="frm-newletter" id="frm-newletter"><input type="email" class="input-email" name="email" value="" placeholder="Enter your email address"><button class="btn-submit"> Subscribe </button></form></div></div></div></div><div class="col-lg-4 col-sm-4 col-md-4 col-xs-12 box-twin-content"><div class="row"><div class="wrap-footer-item twin-item"><h3 class="item-header">My Account</h3><div class="item-content"><div class="wrap-vertical-nav"><ul><li class="menu-item"><a href="#" class="link-term">My Account</a></li><li class="menu-item"><a href="#" class="link-term">Brands</a></li><li class="menu-item"><a href="#" class="link-term">Gift Certificates</a></li><li class="menu-item"><a href="#" class="link-term">Affiliates</a></li><li class="menu-item"><a href="#" class="link-term">Wish list</a></li></ul></div></div></div><div class="wrap-footer-item twin-item"><h3 class="item-header">Infomation</h3><div class="item-content"><div class="wrap-vertical-nav"><ul><li class="menu-item"><a href="#" class="link-term">Contact Us</a></li><li class="menu-item"><a href="#" class="link-term">Returns</a></li><li class="menu-item"><a href="#" class="link-term">Site Map</a></li><li class="menu-item"><a href="#" class="link-term">Specials</a></li><li class="menu-item"><a href="#" class="link-term">Order History</a></li></ul></div></div></div></div></div></div><div class="row"><div class="col-lg-4 col-sm-4 col-md-4 col-xs-12"><div class="wrap-footer-item"><h3 class="item-header"> We Using Safe Payments: </h3><div class="item-content"><div class="wrap-list-item wrap-gallery"><img src="/assets/images/payment.png" style="${ssrRenderStyle({ "max-width": "260px" })}"></div></div></div></div><div class="col-lg-4 col-sm-4 col-md-4 col-xs-12"><div class="wrap-footer-item"><h3 class="item-header">Social network</h3><div class="item-content"><div class="wrap-list-item social-network"><ul><li><a href="#" class="link-to-item" title="twitter"><i class="fa fa-twitter" aria-hidden="true"></i></a></li><li><a href="#" class="link-to-item" title="facebook"><i class="fa fa-facebook" aria-hidden="true"></i></a></li><li><a href="#" class="link-to-item" title="pinterest"><i class="fa fa-pinterest" aria-hidden="true"></i></a></li><li><a href="#" class="link-to-item" title="instagram"><i class="fa fa-instagram" aria-hidden="true"></i></a></li><li><a href="#" class="link-to-item" title="vimeo"><i class="fa fa-vimeo" aria-hidden="true"></i></a></li></ul></div></div></div></div><div class="col-lg-4 col-sm-4 col-md-4 col-xs-12"><div class="wrap-footer-item"><h3 class="item-header">Dowload App</h3><div class="item-content"><div class="wrap-list-item apps-list"><ul><li><a href="#" class="link-to-item" title="our application on apple store"><figure><img src="/assets/images/brands/apple-store.png" alt="apple store" width="128" height="36"></figure></a></li><li><a href="#" class="link-to-item" title="our application on google play store"><figure><img src="/assets/images/brands/google-play-store.png" alt="google play store" width="128" height="36"></figure></a></li></ul></div></div></div></div></div></div><div class="wrap-back-link"><div class="container"><div class="back-link-box"><h3 class="backlink-title">Quick Links</h3><div class="back-link-row"><ul class="list-back-link"><li><span class="row-title">Mobiles:</span></li><li><a href="#" class="redirect-back-link" title="mobile">Mobiles</a></li><li><a href="#" class="redirect-back-link" title="yphones">YPhones</a></li><li><a href="#" class="redirect-back-link" title="Gianee Mobiles GL">Gianee Mobiles GL</a></li><li><a href="#" class="redirect-back-link" title="Mobiles Karbonn">Mobiles Karbonn</a></li><li><a href="#" class="redirect-back-link" title="Mobiles Viva">Mobiles Viva</a></li><li><a href="#" class="redirect-back-link" title="Mobiles Intex">Mobiles Intex</a></li><li><a href="#" class="redirect-back-link" title="Mobiles Micrumex">Mobiles Micrumex</a></li><li><a href="#" class="redirect-back-link" title="Mobiles Bsus">Mobiles Bsus</a></li><li><a href="#" class="redirect-back-link" title="Mobiles Samsyng">Mobiles Samsyng</a></li><li><a href="#" class="redirect-back-link" title="Mobiles Lenova">Mobiles Lenova</a></li></ul><ul class="list-back-link"><li><span class="row-title">Tablets:</span></li><li><a href="#" class="redirect-back-link" title="Plesc YPads">Plesc YPads</a></li><li><a href="#" class="redirect-back-link" title="Samsyng Tablets">Samsyng Tablets</a></li><li><a href="#" class="redirect-back-link" title="Qindows Tablets">Qindows Tablets</a></li><li><a href="#" class="redirect-back-link" title="Calling Tablets">Calling Tablets</a></li><li><a href="#" class="redirect-back-link" title="Micrumex Tablets">Micrumex Tablets</a></li><li><a href="#" class="redirect-back-link" title="Lenova Tablets Bsus">Lenova Tablets Bsus</a></li><li><a href="#" class="redirect-back-link" title="Tablets iBall">Tablets iBall</a></li><li><a href="#" class="redirect-back-link" title="Tablets Swipe">Tablets Swipe</a></li><li><a href="#" class="redirect-back-link" title="Tablets TVs, Audio">Tablets TVs, Audio</a></li></ul><ul class="list-back-link"><li><span class="row-title">Fashion:</span></li><li><a href="#" class="redirect-back-link" title="Sarees Silk">Sarees Silk</a></li><li><a href="#" class="redirect-back-link" title="sarees Salwar">sarees Salwar</a></li><li><a href="#" class="redirect-back-link" title="Suits Lehengas">Suits Lehengas</a></li><li><a href="#" class="redirect-back-link" title="Biba Jewellery">Biba Jewellery</a></li><li><a href="#" class="redirect-back-link" title="Rings Earrings">Rings Earrings</a></li><li><a href="#" class="redirect-back-link" title="Diamond Rings">Diamond Rings</a></li><li><a href="#" class="redirect-back-link" title="Loose Diamond Shoes">Loose Diamond Shoes</a></li><li><a href="#" class="redirect-back-link" title="BootsMen Watches">BootsMen Watches</a></li><li><a href="#" class="redirect-back-link" title="Women Watches">Women Watches</a></li></ul></div></div></div></div></div><div class="coppy-right-box"><div class="container"><div class="coppy-right-item item-left"><p class="coppy-right-text"> Copyright © 2020 Surfside Media. All rights reserved </p></div><div class="coppy-right-item item-right"><div class="wrap-nav horizontal-nav"><ul><li class="menu-item"><a href="about-us.html" class="link-term">About us</a></li><li class="menu-item"><a href="privacy-policy.html" class="link-term">Privacy Policy</a></li><li class="menu-item"><a href="terms-conditions.html" class="link-term">Terms &amp; Conditions</a></li><li class="menu-item"><a href="return-policy.html" class="link-term">Return Policy</a></li></ul></div></div><div class="clearfix"></div></div></div></div></footer>`);
}
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Footer.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["ssrRender", _sfc_ssrRender$6]]);
const _sfc_main$S = {
  __name: "DefaultLayout",
  __ssrInlineRender: true,
  setup(__props) {
    onMounted(() => {
      InitallFunctions();
      setTimeout(() => {
        InitallFunctions();
      }, 1e3);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_sfc_main$U, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/DefaultLayout.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const _sfc_main$R = {
  __name: "About",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main id="main" class="main-site"${_scopeId}><div class="container"${_scopeId}><div class="wrap-breadcrumb"${_scopeId}><ul${_scopeId}><li class="item-link"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`home`);
                } else {
                  return [
                    createTextVNode("home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li class="item-link"${_scopeId}><span${_scopeId}>About us</span></li></ul></div></div><div class="container"${_scopeId}><div class="aboutus-info style-center"${_scopeId}><b class="box-title"${_scopeId}>Interesting Facts</b><p class="txt-content"${_scopeId}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s, when an unknown printer took a galley of type </p></div><div class="row equal-container"${_scopeId}><div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"${_scopeId}><div class="aboutus-box-score equal-elem"${_scopeId}><b class="box-score-title"${_scopeId}>10000</b><span class="sub-title"${_scopeId}>Items in Store</span><p class="desc"${_scopeId}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s... </p></div></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"${_scopeId}><div class="aboutus-box-score equal-elem"${_scopeId}><b class="box-score-title"${_scopeId}>90%</b><span class="sub-title"${_scopeId}>Our Customers comeback</span><p class="desc"${_scopeId}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s... </p></div></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"${_scopeId}><div class="aboutus-box-score equal-elem"${_scopeId}><b class="box-score-title"${_scopeId}>2 million</b><span class="sub-title"${_scopeId}>User of the site</span><p class="desc"${_scopeId}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s... </p></div></div></div><div class="row"${_scopeId}><div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"${_scopeId}><div class="aboutus-info style-small-left"${_scopeId}><b class="box-title"${_scopeId}>What we really do?</b><p class="txt-content"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, </p></div><div class="aboutus-info style-small-left"${_scopeId}><b class="box-title"${_scopeId}>History of the Company</b><p class="txt-content"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, </p></div></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"${_scopeId}><div class="aboutus-info style-small-left"${_scopeId}><b class="box-title"${_scopeId}>Our Vision</b><p class="txt-content"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, </p></div><div class="aboutus-info style-small-left"${_scopeId}><b class="box-title"${_scopeId}>Cooperate with Us!</b><p class="txt-content"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, </p></div></div><div class="col-lg-4 col-md-4 col-sm-4 col-xs-12"${_scopeId}><div class="aboutus-info style-small-left"${_scopeId}><b class="box-title"${_scopeId}>Cooperate with Us!</b><div class="list-showups"${_scopeId}><label${_scopeId}><input type="radio" class="hidden" name="showup" id="shoup1" value="shoup1" checked="checked"${_scopeId}><span class="check-box"${_scopeId}></span><span class="function-name"${_scopeId}>Support 24/7</span><span class="desc"${_scopeId}>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</span></label><label${_scopeId}><input type="radio" class="hidden" name="showup" id="shoup2" value="shoup2"${_scopeId}><span class="check-box"${_scopeId}></span><span class="function-name"${_scopeId}>Best Quanlity</span><span class="desc"${_scopeId}>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</span></label><label${_scopeId}><input type="radio" class="hidden" name="showup" id="shoup3" value="shoup3"${_scopeId}><span class="check-box"${_scopeId}></span><span class="function-name"${_scopeId}>Fastest Delivery</span><span class="desc"${_scopeId}>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</span></label><label${_scopeId}><input type="radio" class="hidden" name="showup" id="shoup4" value="shoup4"${_scopeId}><span class="check-box"${_scopeId}></span><span class="function-name"${_scopeId}>Customer Care</span><span class="desc"${_scopeId}>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</span></label></div></div></div></div><div class="our-team-info"${_scopeId}><h4 class="title-box"${_scopeId}>Our teams</h4><div class="our-staff"${_scopeId}><div class="slide-carousel owl-carousel style-nav-1 equal-container" data-items="5" data-loop="false" data-nav="true" data-dots="false" data-margin="30" data-responsive="{&quot;0&quot;:{&quot;items&quot;:&quot;1&quot;},&quot;480&quot;:{&quot;items&quot;:&quot;2&quot;},&quot;768&quot;:{&quot;items&quot;:&quot;3&quot;},&quot;992&quot;:{&quot;items&quot;:&quot;3&quot;},&quot;1200&quot;:{&quot;items&quot;:&quot;4&quot;}}"${_scopeId}><div class="team-member equal-elem"${_scopeId}><div class="media"${_scopeId}><a href="#" title="LEONA"${_scopeId}><figure${_scopeId}><img src="/assets/images/member-leona.jpg" alt="LEONA"${_scopeId}></figure></a></div><div class="info"${_scopeId}><b class="name"${_scopeId}>leona</b><span class="title"${_scopeId}>Director</span><p class="desc"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text... </p></div></div><div class="team-member equal-elem"${_scopeId}><div class="media"${_scopeId}><a href="#" title="LUCIA"${_scopeId}><figure${_scopeId}><img src="/assets/images/member-lucia.jpg" alt="LUCIA"${_scopeId}></figure></a></div><div class="info"${_scopeId}><b class="name"${_scopeId}>LUCIA</b><span class="title"${_scopeId}>Manager</span><p class="desc"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text... </p></div></div><div class="team-member equal-elem"${_scopeId}><div class="media"${_scopeId}><a href="#" title="NANA"${_scopeId}><figure${_scopeId}><img src="/assets/images/member-nana.jpg" alt="NANA"${_scopeId}></figure></a></div><div class="info"${_scopeId}><b class="name"${_scopeId}>NANA</b><span class="title"${_scopeId}>Marketer</span><p class="desc"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text... </p></div></div><div class="team-member equal-elem"${_scopeId}><div class="media"${_scopeId}><a href="#" title="BRAUM"${_scopeId}><figure${_scopeId}><img src="/assets/images/member-braum.jpg" alt="BRAUM"${_scopeId}></figure></a></div><div class="info"${_scopeId}><b class="name"${_scopeId}>BRAUM</b><span class="title"${_scopeId}>Member</span><p class="desc"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text... </p></div></div><div class="team-member equal-elem"${_scopeId}><div class="media"${_scopeId}><a href="#" title="LUCIA"${_scopeId}><figure${_scopeId}><img src="/assets/images/member-lucia.jpg" alt="LUCIA"${_scopeId}></figure></a></div><div class="info"${_scopeId}><b class="name"${_scopeId}>LUCIA</b><span class="title"${_scopeId}>Manager</span><p class="desc"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text... </p></div></div><div class="team-member equal-elem"${_scopeId}><div class="media"${_scopeId}><a href="#" title="NANA"${_scopeId}><figure${_scopeId}><img src="/assets/images/member-nana.jpg" alt="NANA"${_scopeId}></figure></a></div><div class="info"${_scopeId}><b class="name"${_scopeId}>NANA</b><span class="title"${_scopeId}>Marketer</span><p class="desc"${_scopeId}> Contrary to popular belief, Lorem Ipsum is not simply random text... </p></div></div></div></div></div></div></main>`);
          } else {
            return [
              createVNode("main", {
                id: "main",
                class: "main-site"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "wrap-breadcrumb" }, [
                    createVNode("ul", null, [
                      createVNode("li", { class: "item-link" }, [
                        createVNode(unref(Link), {
                          href: "/",
                          class: "link"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("home")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("li", { class: "item-link" }, [
                        createVNode("span", null, "About us")
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "aboutus-info style-center" }, [
                    createVNode("b", { class: "box-title" }, "Interesting Facts"),
                    createVNode("p", { class: "txt-content" }, " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s, when an unknown printer took a galley of type ")
                  ]),
                  createVNode("div", { class: "row equal-container" }, [
                    createVNode("div", { class: "col-lg-4 col-md-4 col-sm-4 col-xs-12" }, [
                      createVNode("div", { class: "aboutus-box-score equal-elem" }, [
                        createVNode("b", { class: "box-score-title" }, "10000"),
                        createVNode("span", { class: "sub-title" }, "Items in Store"),
                        createVNode("p", { class: "desc" }, " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s... ")
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-4 col-md-4 col-sm-4 col-xs-12" }, [
                      createVNode("div", { class: "aboutus-box-score equal-elem" }, [
                        createVNode("b", { class: "box-score-title" }, "90%"),
                        createVNode("span", { class: "sub-title" }, "Our Customers comeback"),
                        createVNode("p", { class: "desc" }, " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s... ")
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-4 col-md-4 col-sm-4 col-xs-12" }, [
                      createVNode("div", { class: "aboutus-box-score equal-elem" }, [
                        createVNode("b", { class: "box-score-title" }, "2 million"),
                        createVNode("span", { class: "sub-title" }, "User of the site"),
                        createVNode("p", { class: "desc" }, " Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the dummy text ever since the 1500s... ")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-4 col-md-4 col-sm-4 col-xs-12" }, [
                      createVNode("div", { class: "aboutus-info style-small-left" }, [
                        createVNode("b", { class: "box-title" }, "What we really do?"),
                        createVNode("p", { class: "txt-content" }, " Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, ")
                      ]),
                      createVNode("div", { class: "aboutus-info style-small-left" }, [
                        createVNode("b", { class: "box-title" }, "History of the Company"),
                        createVNode("p", { class: "txt-content" }, " Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, ")
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-4 col-md-4 col-sm-4 col-xs-12" }, [
                      createVNode("div", { class: "aboutus-info style-small-left" }, [
                        createVNode("b", { class: "box-title" }, "Our Vision"),
                        createVNode("p", { class: "txt-content" }, " Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, ")
                      ]),
                      createVNode("div", { class: "aboutus-info style-small-left" }, [
                        createVNode("b", { class: "box-title" }, "Cooperate with Us!"),
                        createVNode("p", { class: "txt-content" }, " Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, ")
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-4 col-md-4 col-sm-4 col-xs-12" }, [
                      createVNode("div", { class: "aboutus-info style-small-left" }, [
                        createVNode("b", { class: "box-title" }, "Cooperate with Us!"),
                        createVNode("div", { class: "list-showups" }, [
                          createVNode("label", null, [
                            createVNode("input", {
                              type: "radio",
                              class: "hidden",
                              name: "showup",
                              id: "shoup1",
                              value: "shoup1",
                              checked: "checked"
                            }),
                            createVNode("span", { class: "check-box" }),
                            createVNode("span", { class: "function-name" }, "Support 24/7"),
                            createVNode("span", { class: "desc" }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry...")
                          ]),
                          createVNode("label", null, [
                            createVNode("input", {
                              type: "radio",
                              class: "hidden",
                              name: "showup",
                              id: "shoup2",
                              value: "shoup2"
                            }),
                            createVNode("span", { class: "check-box" }),
                            createVNode("span", { class: "function-name" }, "Best Quanlity"),
                            createVNode("span", { class: "desc" }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry...")
                          ]),
                          createVNode("label", null, [
                            createVNode("input", {
                              type: "radio",
                              class: "hidden",
                              name: "showup",
                              id: "shoup3",
                              value: "shoup3"
                            }),
                            createVNode("span", { class: "check-box" }),
                            createVNode("span", { class: "function-name" }, "Fastest Delivery"),
                            createVNode("span", { class: "desc" }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry...")
                          ]),
                          createVNode("label", null, [
                            createVNode("input", {
                              type: "radio",
                              class: "hidden",
                              name: "showup",
                              id: "shoup4",
                              value: "shoup4"
                            }),
                            createVNode("span", { class: "check-box" }),
                            createVNode("span", { class: "function-name" }, "Customer Care"),
                            createVNode("span", { class: "desc" }, "Lorem Ipsum is simply dummy text of the printing and typesetting industry...")
                          ])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "our-team-info" }, [
                    createVNode("h4", { class: "title-box" }, "Our teams"),
                    createVNode("div", { class: "our-staff" }, [
                      createVNode("div", {
                        class: "slide-carousel owl-carousel style-nav-1 equal-container",
                        "data-items": "5",
                        "data-loop": "false",
                        "data-nav": "true",
                        "data-dots": "false",
                        "data-margin": "30",
                        "data-responsive": '{"0":{"items":"1"},"480":{"items":"2"},"768":{"items":"3"},"992":{"items":"3"},"1200":{"items":"4"}}'
                      }, [
                        createVNode("div", { class: "team-member equal-elem" }, [
                          createVNode("div", { class: "media" }, [
                            createVNode("a", {
                              href: "#",
                              title: "LEONA"
                            }, [
                              createVNode("figure", null, [
                                createVNode("img", {
                                  src: "/assets/images/member-leona.jpg",
                                  alt: "LEONA"
                                })
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "info" }, [
                            createVNode("b", { class: "name" }, "leona"),
                            createVNode("span", { class: "title" }, "Director"),
                            createVNode("p", { class: "desc" }, " Contrary to popular belief, Lorem Ipsum is not simply random text... ")
                          ])
                        ]),
                        createVNode("div", { class: "team-member equal-elem" }, [
                          createVNode("div", { class: "media" }, [
                            createVNode("a", {
                              href: "#",
                              title: "LUCIA"
                            }, [
                              createVNode("figure", null, [
                                createVNode("img", {
                                  src: "/assets/images/member-lucia.jpg",
                                  alt: "LUCIA"
                                })
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "info" }, [
                            createVNode("b", { class: "name" }, "LUCIA"),
                            createVNode("span", { class: "title" }, "Manager"),
                            createVNode("p", { class: "desc" }, " Contrary to popular belief, Lorem Ipsum is not simply random text... ")
                          ])
                        ]),
                        createVNode("div", { class: "team-member equal-elem" }, [
                          createVNode("div", { class: "media" }, [
                            createVNode("a", {
                              href: "#",
                              title: "NANA"
                            }, [
                              createVNode("figure", null, [
                                createVNode("img", {
                                  src: "/assets/images/member-nana.jpg",
                                  alt: "NANA"
                                })
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "info" }, [
                            createVNode("b", { class: "name" }, "NANA"),
                            createVNode("span", { class: "title" }, "Marketer"),
                            createVNode("p", { class: "desc" }, " Contrary to popular belief, Lorem Ipsum is not simply random text... ")
                          ])
                        ]),
                        createVNode("div", { class: "team-member equal-elem" }, [
                          createVNode("div", { class: "media" }, [
                            createVNode("a", {
                              href: "#",
                              title: "BRAUM"
                            }, [
                              createVNode("figure", null, [
                                createVNode("img", {
                                  src: "/assets/images/member-braum.jpg",
                                  alt: "BRAUM"
                                })
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "info" }, [
                            createVNode("b", { class: "name" }, "BRAUM"),
                            createVNode("span", { class: "title" }, "Member"),
                            createVNode("p", { class: "desc" }, " Contrary to popular belief, Lorem Ipsum is not simply random text... ")
                          ])
                        ]),
                        createVNode("div", { class: "team-member equal-elem" }, [
                          createVNode("div", { class: "media" }, [
                            createVNode("a", {
                              href: "#",
                              title: "LUCIA"
                            }, [
                              createVNode("figure", null, [
                                createVNode("img", {
                                  src: "/assets/images/member-lucia.jpg",
                                  alt: "LUCIA"
                                })
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "info" }, [
                            createVNode("b", { class: "name" }, "LUCIA"),
                            createVNode("span", { class: "title" }, "Manager"),
                            createVNode("p", { class: "desc" }, " Contrary to popular belief, Lorem Ipsum is not simply random text... ")
                          ])
                        ]),
                        createVNode("div", { class: "team-member equal-elem" }, [
                          createVNode("div", { class: "media" }, [
                            createVNode("a", {
                              href: "#",
                              title: "NANA"
                            }, [
                              createVNode("figure", null, [
                                createVNode("img", {
                                  src: "/assets/images/member-nana.jpg",
                                  alt: "NANA"
                                })
                              ])
                            ])
                          ]),
                          createVNode("div", { class: "info" }, [
                            createVNode("b", { class: "name" }, "NANA"),
                            createVNode("span", { class: "title" }, "Marketer"),
                            createVNode("p", { class: "desc" }, " Contrary to popular belief, Lorem Ipsum is not simply random text... ")
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/About.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$R
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$Q = {
  __name: "AddressEditForm",
  __ssrInlineRender: true,
  props: {
    address: {
      type: Object,
      default: null
    }
  },
  emits: ["submit", "cancel", "applycahnges", "addnewaddress"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const countries = ref([
      "United provinces",
      "Canada",
      "United Kingdom",
      "Australia"
      // Add more countries as needed
    ]);
    const initialData = {
      id: null,
      name: "",
      phone: "",
      address_1: "",
      address_2: "",
      city: "",
      province: "",
      zipCode: "",
      country: "",
      is_default: false
    };
    const formData = ref(props.address ?? initialData);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "border-2 border-[#ff2832] rounded-lg p-6 bg-white shadow-md" }, _attrs))} data-v-22c41f32><h3 class="text-lg font-medium text-[#444444] mb-4" data-v-22c41f32>${ssrInterpolate(((_a = __props.address) == null ? void 0 : _a.id) ? "Edit Address" : "Add New Address")}</h3><form data-v-22c41f32><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-22c41f32><div class="md:col-span-2" data-v-22c41f32><label for="name" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>Full Name *</label><input id="name"${ssrRenderAttr("value", formData.value.name)} type="text" required class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32></div><div data-v-22c41f32><label for="phone" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>Phone Number *</label><input id="phone"${ssrRenderAttr("value", formData.value.phone)} type="tel" required class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32></div><div class="md:col-span-2" data-v-22c41f32><label for="address_1" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>address_1 Address *</label><input id="address_1"${ssrRenderAttr("value", formData.value.address_1)} type="text" required class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32></div><div class="md:col-span-2" data-v-22c41f32><label for="address_2" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>Apartment, Suite, etc. (Optional)</label><input id="address_2"${ssrRenderAttr("value", formData.value.address_2)} type="text" class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32></div><div data-v-22c41f32><label for="city" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>City *</label><input id="city"${ssrRenderAttr("value", formData.value.city)} type="text" required class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32></div><div data-v-22c41f32><label for="province" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>province/Province *</label><input id="province"${ssrRenderAttr("value", formData.value.province)} type="text" required class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32></div><div data-v-22c41f32><label for="zipCode" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>zipCode/Postal Code *</label><input id="zipCode"${ssrRenderAttr("value", formData.value.zipCode)} type="text" required class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32></div><div data-v-22c41f32><label for="country" class="block text-sm font-medium text-[#444444] mb-1" data-v-22c41f32>Country *</label><select id="country" required class="block w-full px-3 py-2 border border-[#e6e3de] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-22c41f32><option value="" data-v-22c41f32${ssrIncludeBooleanAttr(Array.isArray(formData.value.country) ? ssrLooseContain(formData.value.country, "") : ssrLooseEqual(formData.value.country, "")) ? " selected" : ""}>Select Country</option><!--[-->`);
      ssrRenderList(countries.value, (country) => {
        _push(`<option${ssrRenderAttr("value", country)} data-v-22c41f32${ssrIncludeBooleanAttr(Array.isArray(formData.value.country) ? ssrLooseContain(formData.value.country, country) : ssrLooseEqual(formData.value.country, country)) ? " selected" : ""}>${ssrInterpolate(country)}</option>`);
      });
      _push(`<!--]--></select></div><div class="md:col-span-2 flex items-center" data-v-22c41f32><input id="default"${ssrIncludeBooleanAttr(Array.isArray(formData.value.is_default) ? ssrLooseContain(formData.value.is_default, null) : formData.value.is_default) ? " checked" : ""} type="checkbox" class="h-4 w-4 text-[#ff2832] border-[#e6e3de] rounded focus:ring-[#ff2832]/50" data-v-22c41f32><label for="default" class="ml-2 block text-sm text-[#444444]" data-v-22c41f32> Set as default address </label></div></div><div class="mt-6 flex justify-end space-x-3" data-v-22c41f32><button type="button" class="px-4 py-2 border border-[#e6e3de] rounded-md shadow-sm text-sm font-medium text-[#444444] hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200" data-v-22c41f32> Cancel </button><button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"${ssrIncludeBooleanAttr(formData.value.processing) ? " disabled" : ""} data-v-22c41f32>${ssrInterpolate(formData.value.processing ? "Saving..." : "Save Address")}</button></div></form></div>`);
    };
  }
};
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/AddressEditForm.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const AddressEditForm = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["__scopeId", "data-v-22c41f32"]]);
const _sfc_main$P = {
  __name: "AuthenticatedLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const { url: pagePathname } = usePage();
    const navItems = ref([
      { name: "Dashboard", href: "/account/dashboard", icon: HomeIcon },
      { name: "Profile", href: "/account/profile", icon: MapPinIcon },
      { name: "Orders", href: "/account/orders", icon: ShoppingBagIcon },
      { name: "Addresses", href: "/account/address", icon: MapPinIcon },
      { name: "Payment Methods", href: "/account/payments", icon: CreditCardIcon },
      { name: "Help Center", href: "/help", icon: QuestionMarkCircleIcon }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main class="mx-auto px-4 py-8 sm:px-6 lg:px-8" id="pageContent" data-v-24093030${_scopeId}><div class="container" data-v-24093030${_scopeId}><div class="grid grid-cols-1 lg:grid-cols-4 gap-6" data-v-24093030${_scopeId}><div class="lg:col-span-1 px-0" data-v-24093030${_scopeId}><div class="bg-white rounded-xl shadow-sm overflow-hidden" id="side-nav" data-v-24093030${_scopeId}><nav class="space-y-1 p-4" data-v-24093030${_scopeId}><!--[-->`);
            ssrRenderList(navItems.value, (item) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: item.name,
                href: item.href,
                class: [
                  "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                  unref(pagePathname).startsWith(item.href) ? "bg-[#ff2832]/10 text-[#ff2832]" : "text-[#444444] hover:bg-[#e6e3de]/30"
                ]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(item.icon), { class: "h-5 w-5 mr-3" }, null), _parent3, _scopeId2);
                    _push3(` ${ssrInterpolate(item.name)}`);
                  } else {
                    return [
                      (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "h-5 w-5 mr-3" })),
                      createTextVNode(" " + toDisplayString(item.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></nav></div></div><div class="lg:col-span-3 space-y-6 px-0" data-v-24093030${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div></div></main>`);
          } else {
            return [
              createVNode("main", {
                class: "mx-auto px-4 py-8 sm:px-6 lg:px-8",
                id: "pageContent"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "grid grid-cols-1 lg:grid-cols-4 gap-6" }, [
                    createVNode("div", { class: "lg:col-span-1 px-0" }, [
                      createVNode("div", {
                        class: "bg-white rounded-xl shadow-sm overflow-hidden",
                        id: "side-nav"
                      }, [
                        createVNode("nav", { class: "space-y-1 p-4" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(navItems.value, (item) => {
                            return openBlock(), createBlock(unref(Link), {
                              key: item.name,
                              href: item.href,
                              class: [
                                "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                                unref(pagePathname).startsWith(item.href) ? "bg-[#ff2832]/10 text-[#ff2832]" : "text-[#444444] hover:bg-[#e6e3de]/30"
                              ]
                            }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "h-5 w-5 mr-3" })),
                                createTextVNode(" " + toDisplayString(item.name), 1)
                              ]),
                              _: 2
                            }, 1032, ["href", "class"]);
                          }), 128))
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "lg:col-span-3 space-y-6 px-0" }, [
                      renderSlot(_ctx.$slots, "default", {}, void 0, true)
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/AuthenticatedLayout.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const AuthenticatedLayout = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["__scopeId", "data-v-24093030"]]);
const _sfc_main$O = {
  __name: "Address",
  __ssrInlineRender: true,
  props: ["addresses"],
  setup(__props) {
    const props = __props;
    const addresses = ref(props.addresses);
    const showAddForm = ref(false);
    const setDefaultAddress = async (id) => {
      try {
        const { data } = await API.post("set-address-default", id);
        if (data.success) {
          resetDefaultAddress(id);
          changeDefaultAddress(id);
        }
      } catch (error) {
      }
    };
    const deleteAddress = async (id) => {
      try {
        const { data } = await API.delete("delete-address", id);
        if (data.success) {
          addresses.value = addresses.value.filter((addr) => addr.id !== id);
        }
      } catch (error) {
      }
    };
    const editingAddress = ref(null);
    const EditAddress = (address) => {
      editingAddress.value = address;
    };
    const applyEditAddress = (data) => {
      if (data.is_default) {
        resetDefaultAddress(data.id);
      }
      editingAddress.value = null;
    };
    const AddNewAddress = (data) => {
      data.id = Math.max(...addresses.value.map((m) => m.id), 0) + 1;
      addresses.value = [data, ...addresses.value];
      if (data.is_default) {
        resetDefaultAddress(data.id);
      }
      showAddForm.value = false;
    };
    function resetDefaultAddress(id) {
      const address = addresses.value.find((i) => i.is_default == true && i.id !== id);
      address.is_default = false;
    }
    function changeDefaultAddress(id) {
      const newDefaultAddr = addresses.value.find((i) => i.id == id);
      newDefaultAddr.is_default = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AuthenticatedLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!showAddForm.value && !editingAddress.value) {
              _push2(`<div class="bg-white shadow-md rounded-lg border px-3 py-3 flex justify-end" data-v-858b84f3${_scopeId}><button class="bg-[#ff2832]/90 px-4 py-2 rounded-lg text-white hover:bg-[#ff2832]/80" data-v-858b84f3${_scopeId}>Add New Address</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!showAddForm.value && !editingAddress.value) {
              _push2(`<!--[-->`);
              ssrRenderList(addresses.value, (address) => {
                _push2(`<div class="${ssrRenderClass([address.is_default ? "ring-1 ring-[#ff2832]" : "hover:ring-1 hover:ring-[#ff2832]/80", "rounded-lg p-6 bg-white transition-shadow duration-200"])}" data-v-858b84f3${_scopeId}><div class="flex justify-between items-start" data-v-858b84f3${_scopeId}><div data-v-858b84f3${_scopeId}><h3 class="font-medium text-[#444444]" data-v-858b84f3${_scopeId}>${ssrInterpolate(address.name)}</h3><p class="text-sm text-[#444444]/80 mt-1" data-v-858b84f3${_scopeId}>${ssrInterpolate(address.phone)}</p></div><div class="flex space-x-2" data-v-858b84f3${_scopeId}>`);
                if (address.is_default) {
                  _push2(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff2832]/10 text-[#ff2832]" data-v-858b84f3${_scopeId}> Default </span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<button class="text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200" data-v-858b84f3${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" data-v-858b84f3${_scopeId}><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" data-v-858b84f3${_scopeId}></path></svg></button><button class="text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200" data-v-858b84f3${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" data-v-858b84f3${_scopeId}><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" data-v-858b84f3${_scopeId}></path></svg></button></div></div><div class="mt-4 text-sm text-[#444444]" data-v-858b84f3${_scopeId}><p data-v-858b84f3${_scopeId}>${ssrInterpolate(address.address_1)}</p>`);
                if (address.address_2) {
                  _push2(`<p data-v-858b84f3${_scopeId}>${ssrInterpolate(address.address_2)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<p data-v-858b84f3${_scopeId}>${ssrInterpolate(address.city)}, ${ssrInterpolate(address.province)} ${ssrInterpolate(address.zipCode)}</p><p data-v-858b84f3${_scopeId}>${ssrInterpolate(address.country)}</p></div>`);
                if (!address.is_default) {
                  _push2(`<div class="mt-4" data-v-858b84f3${_scopeId}><button class="text-sm font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200" data-v-858b84f3${_scopeId}> Set as default </button></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            if (editingAddress.value) {
              _push2(ssrRenderComponent(AddressEditForm, {
                address: editingAddress.value,
                onCancel: ($event) => editingAddress.value = null,
                onApplycahnges: applyEditAddress
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (showAddForm.value) {
              _push2(ssrRenderComponent(AddressEditForm, {
                onCancel: ($event) => showAddForm.value = false,
                onAddnewaddress: AddNewAddress
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !showAddForm.value && !editingAddress.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "bg-white shadow-md rounded-lg border px-3 py-3 flex justify-end"
              }, [
                createVNode("button", {
                  onClick: withModifiers(($event) => showAddForm.value = true, ["stop"]),
                  class: "bg-[#ff2832]/90 px-4 py-2 rounded-lg text-white hover:bg-[#ff2832]/80"
                }, "Add New Address", 8, ["onClick"])
              ])) : createCommentVNode("", true),
              !showAddForm.value && !editingAddress.value ? (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(addresses.value, (address) => {
                return openBlock(), createBlock("div", {
                  class: ["rounded-lg p-6 bg-white transition-shadow duration-200", address.is_default ? "ring-1 ring-[#ff2832]" : "hover:ring-1 hover:ring-[#ff2832]/80"]
                }, [
                  createVNode("div", { class: "flex justify-between items-start" }, [
                    createVNode("div", null, [
                      createVNode("h3", { class: "font-medium text-[#444444]" }, toDisplayString(address.name), 1),
                      createVNode("p", { class: "text-sm text-[#444444]/80 mt-1" }, toDisplayString(address.phone), 1)
                    ]),
                    createVNode("div", { class: "flex space-x-2" }, [
                      address.is_default ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff2832]/10 text-[#ff2832]"
                      }, " Default ")) : createCommentVNode("", true),
                      createVNode("button", {
                        onClick: withModifiers(($event) => EditAddress(address), ["stop"]),
                        class: "text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200"
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          class: "h-5 w-5",
                          viewBox: "0 0 20 20",
                          fill: "currentColor"
                        }, [
                          createVNode("path", { d: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" })
                        ]))
                      ], 8, ["onClick"]),
                      createVNode("button", {
                        onClick: withModifiers(($event) => deleteAddress(address.id), ["stop"]),
                        class: "text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200"
                      }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          class: "h-5 w-5",
                          viewBox: "0 0 20 20",
                          fill: "currentColor"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z",
                            "clip-rule": "evenodd"
                          })
                        ]))
                      ], 8, ["onClick"])
                    ])
                  ]),
                  createVNode("div", { class: "mt-4 text-sm text-[#444444]" }, [
                    createVNode("p", null, toDisplayString(address.address_1), 1),
                    address.address_2 ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(address.address_2), 1)) : createCommentVNode("", true),
                    createVNode("p", null, toDisplayString(address.city) + ", " + toDisplayString(address.province) + " " + toDisplayString(address.zipCode), 1),
                    createVNode("p", null, toDisplayString(address.country), 1)
                  ]),
                  !address.is_default ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mt-4"
                  }, [
                    createVNode("button", {
                      onClick: withModifiers(($event) => setDefaultAddress(address.id), ["stop"]),
                      class: "text-sm font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200"
                    }, " Set as default ", 8, ["onClick"])
                  ])) : createCommentVNode("", true)
                ], 2);
              }), 256)) : createCommentVNode("", true),
              editingAddress.value ? (openBlock(), createBlock(AddressEditForm, {
                key: 2,
                address: editingAddress.value,
                onCancel: ($event) => editingAddress.value = null,
                onApplycahnges: applyEditAddress
              }, null, 8, ["address", "onCancel"])) : createCommentVNode("", true),
              showAddForm.value ? (openBlock(), createBlock(AddressEditForm, {
                key: 3,
                onCancel: ($event) => showAddForm.value = false,
                onAddnewaddress: AddNewAddress
              }, null, 8, ["onCancel"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Address.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const Address = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["__scopeId", "data-v-858b84f3"]]);
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Address
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$N = {};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    viewBox: "0 0 316 316",
    xmlns: "http://www.w3.org/2000/svg"
  }, _attrs))}><path d="M305.8 81.125C305.77 80.995 305.69 80.885 305.65 80.755C305.56 80.525 305.49 80.285 305.37 80.075C305.29 79.935 305.17 79.815 305.07 79.685C304.94 79.515 304.83 79.325 304.68 79.175C304.55 79.045 304.39 78.955 304.25 78.845C304.09 78.715 303.95 78.575 303.77 78.475L251.32 48.275C249.97 47.495 248.31 47.495 246.96 48.275L194.51 78.475C194.33 78.575 194.19 78.725 194.03 78.845C193.89 78.955 193.73 79.045 193.6 79.175C193.45 79.325 193.34 79.515 193.21 79.685C193.11 79.815 192.99 79.935 192.91 80.075C192.79 80.285 192.71 80.525 192.63 80.755C192.58 80.875 192.51 80.995 192.48 81.125C192.38 81.495 192.33 81.875 192.33 82.265V139.625L148.62 164.795V52.575C148.62 52.185 148.57 51.805 148.47 51.435C148.44 51.305 148.36 51.195 148.32 51.065C148.23 50.835 148.16 50.595 148.04 50.385C147.96 50.245 147.84 50.125 147.74 49.995C147.61 49.825 147.5 49.635 147.35 49.485C147.22 49.355 147.06 49.265 146.92 49.155C146.76 49.025 146.62 48.885 146.44 48.785L93.99 18.585C92.64 17.805 90.98 17.805 89.63 18.585L37.18 48.785C37 48.885 36.86 49.035 36.7 49.155C36.56 49.265 36.4 49.355 36.27 49.485C36.12 49.635 36.01 49.825 35.88 49.995C35.78 50.125 35.66 50.245 35.58 50.385C35.46 50.595 35.38 50.835 35.3 51.065C35.25 51.185 35.18 51.305 35.15 51.435C35.05 51.805 35 52.185 35 52.575V232.235C35 233.795 35.84 235.245 37.19 236.025L142.1 296.425C142.33 296.555 142.58 296.635 142.82 296.725C142.93 296.765 143.04 296.835 143.16 296.865C143.53 296.965 143.9 297.015 144.28 297.015C144.66 297.015 145.03 296.965 145.4 296.865C145.5 296.835 145.59 296.775 145.69 296.745C145.95 296.655 146.21 296.565 146.45 296.435L251.36 236.035C252.72 235.255 253.55 233.815 253.55 232.245V174.885L303.81 145.945C305.17 145.165 306 143.725 306 142.155V82.265C305.95 81.875 305.89 81.495 305.8 81.125ZM144.2 227.205L100.57 202.515L146.39 176.135L196.66 147.195L240.33 172.335L208.29 190.625L144.2 227.205ZM244.75 114.995V164.795L226.39 154.225L201.03 139.625V89.825L219.39 100.395L244.75 114.995ZM249.12 57.105L292.81 82.265L249.12 107.425L205.43 82.265L249.12 57.105ZM114.49 184.425L96.13 194.995V85.305L121.49 70.705L139.85 60.135V169.815L114.49 184.425ZM91.76 27.425L135.45 52.585L91.76 77.745L48.07 52.585L91.76 27.425ZM43.67 60.135L62.03 70.705L87.39 85.305V202.545V202.555V202.565C87.39 202.735 87.44 202.895 87.46 203.055C87.49 203.265 87.49 203.485 87.55 203.695V203.705C87.6 203.875 87.69 204.035 87.76 204.195C87.84 204.375 87.89 204.575 87.99 204.745C87.99 204.745 87.99 204.755 88 204.755C88.09 204.905 88.22 205.035 88.33 205.175C88.45 205.335 88.55 205.495 88.69 205.635L88.7 205.645C88.82 205.765 88.98 205.855 89.12 205.965C89.28 206.085 89.42 206.225 89.59 206.325C89.6 206.325 89.6 206.325 89.61 206.335C89.62 206.335 89.62 206.345 89.63 206.345L139.87 234.775V285.065L43.67 229.705V60.135ZM244.75 229.705L148.58 285.075V234.775L219.8 194.115L244.75 179.875V229.705ZM297.2 139.625L253.49 164.795V114.995L278.85 100.395L297.21 89.825V139.625H297.2Z"></path></svg>`);
}
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ApplicationLogo.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const ApplicationLogo = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$M = {
  __name: "GuestLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0" }, _attrs))}><div>`);
      _push(ssrRenderComponent(unref(Link), { href: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(ApplicationLogo, { class: "h-20 w-20 fill-current text-gray-500" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(ApplicationLogo, { class: "h-20 w-20 fill-current text-gray-500" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/GuestLayout.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const _sfc_main$L = {
  __name: "InputError",
  __ssrInlineRender: true,
  props: {
    message: {
      type: String
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: __props.message ? null : { display: "none" }
      }, _attrs))}><p class="text-sm text-red-600">${ssrInterpolate(__props.message)}</p></div>`);
    };
  }
};
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/InputError.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const _sfc_main$K = {
  __name: "InputLabel",
  __ssrInlineRender: true,
  props: {
    value: {
      type: String
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<label${ssrRenderAttrs(mergeProps({ class: "block text-sm font-medium text-gray-700" }, _attrs))}>`);
      if (__props.value) {
        _push(`<span>${ssrInterpolate(__props.value)}</span>`);
      } else {
        _push(`<span>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</span>`);
      }
      _push(`</label>`);
    };
  }
};
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/InputLabel.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<button${ssrRenderAttrs(mergeProps({ class: "inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</button>`);
}
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PrimaryButton.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const PrimaryButton = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$I = {
  __name: "TextInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    class: {
      type: String,
      default: ""
    }
  }, {
    "modelValue": {
      type: String,
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const input = ref(null);
    onMounted(() => {
      if (input.value.hasAttribute("autofocus")) {
        input.value.focus();
      }
    });
    __expose({ focus: () => input.value.focus() });
    return (_ctx, _push, _parent, _attrs) => {
      let _temp0;
      _push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
        class: props.class,
        ref_key: "input",
        ref: input
      }, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, model.value))))}>`);
    };
  }
};
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/TextInput.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const _sfc_main$H = {
  __name: "ConfirmPassword",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      password: ""
    });
    const submit = () => {
      form.post(route$1("password.confirm"), {
        onFinish: () => form.reset()
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$M, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Confirm Password" }, null, _parent2, _scopeId));
            _push2(`<div class="mb-4 text-sm text-gray-600"${_scopeId}> This is a secure area of the application. Please confirm your password before continuing. </div><form${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$K, {
              for: "password",
              value: "Password"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$I, {
              id: "password",
              type: "password",
              class: "mt-1 block w-full",
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              required: "",
              autocomplete: "current-password",
              autofocus: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$L, {
              class: "mt-2",
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-4 flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(PrimaryButton, {
              class: ["ms-4", { "opacity-25": unref(form).processing }],
              disabled: unref(form).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Confirm `);
                } else {
                  return [
                    createTextVNode(" Confirm ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Confirm Password" }),
              createVNode("div", { class: "mb-4 text-sm text-gray-600" }, " This is a secure area of the application. Please confirm your password before continuing. "),
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"])
              }, [
                createVNode("div", null, [
                  createVNode(_sfc_main$K, {
                    for: "password",
                    value: "Password"
                  }),
                  createVNode(_sfc_main$I, {
                    id: "password",
                    type: "password",
                    class: "mt-1 block w-full",
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    required: "",
                    autocomplete: "current-password",
                    autofocus: ""
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_sfc_main$L, {
                    class: "mt-2",
                    message: unref(form).errors.password
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "mt-4 flex justify-end" }, [
                  createVNode(PrimaryButton, {
                    class: ["ms-4", { "opacity-25": unref(form).processing }],
                    disabled: unref(form).processing
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Confirm ")
                    ]),
                    _: 1
                  }, 8, ["class", "disabled"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ConfirmPassword.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$H
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$G = {
  __name: "ForgotPassword",
  __ssrInlineRender: true,
  props: {
    status: {
      type: String
    }
  },
  setup(__props) {
    const form = useForm({
      email: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" }, _attrs))}><div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl">`);
      _push(ssrRenderComponent(unref(Head), { title: "Forgot Password" }, null, _parent));
      _push(`<div class="mb-4 text-sm text-gray-600"> Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one. </div>`);
      if (__props.status) {
        _push(`<div class="mb-4 text-sm font-medium text-green-600">${ssrInterpolate(__props.status)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="mt-8 space-y-6"><div class="rounded-md space-y-4"><div><label for="email" class="block text-sm font-medium text-[#444444] mb-1">Email address</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="you@example.com">`);
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.email
      }, null, _parent));
      _push(`</div></div><div><button type="submit" class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}> Email Password Reset Link </button></div></form></div></div>`);
    };
  }
};
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ForgotPassword.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$G
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$F = {
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    canResetPassword: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Log in" }, null, _parent));
      _push(`<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" data-v-2c53454d><div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl" data-v-2c53454d><h2 class="mt-6 text-center text-3xl font-extrabold text-[#444444]" data-v-2c53454d> Welcome back </h2><p class="mt-2 text-center text-sm text-[#444444]/80" data-v-2c53454d> Sign in to your account </p><form class="mt-8 space-y-6" data-v-2c53454d><div class="rounded-md space-y-4" data-v-2c53454d><div data-v-2c53454d><label for="email" class="block text-sm font-medium text-[#444444] mb-1" data-v-2c53454d>Email address</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="you@example.com" data-v-2c53454d>`);
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.email
      }, null, _parent));
      _push(`</div><div data-v-2c53454d><label for="password" class="block text-sm font-medium text-[#444444] mb-1" data-v-2c53454d>Password</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="••••••••" data-v-2c53454d>`);
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.password
      }, null, _parent));
      _push(`</div></div><div class="flex items-center justify-between" data-v-2c53454d><div class="flex items-center" data-v-2c53454d><input id="remember-me" type="checkbox" name="remember"${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} class="h-4 w-4 my-0 text-[#ff2832] focus:ring-[#ff2832]/50 border-[#e6e3de] rounded" data-v-2c53454d><label for="remember-me" class="ml-2 my-0 block text-sm text-[#444444]" data-v-2c53454d> Remember me </label></div><div class="text-sm" data-v-2c53454d><a${ssrRenderAttr("href", unref(route$1)("password.request"))} class="font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200" data-v-2c53454d> Forgot your password? </a></div></div><div data-v-2c53454d><button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-2c53454d><span class="absolute left-0 inset-y-0 flex items-center pl-3" data-v-2c53454d><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white/80 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor" data-v-2c53454d><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" data-v-2c53454d></path></svg></span> Sign in </button></div></form><div class="text-center text-sm text-[#444444]" data-v-2c53454d> Don&#39;t have an account? `);
      _push(ssrRenderComponent(unref(Link), {
        href: unref(route$1)("register"),
        class: "font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign up `);
          } else {
            return [
              createTextVNode(" Sign up ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const Login = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["__scopeId", "data-v-2c53454d"]]);
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$E = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Register" }, null, _parent));
      _push(`<div class="min-h-screen flex items-center justify-center bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8" data-v-5624f707><div class="max-w-md w-full bg-white px-10 py-6 rounded-xl shadow-lg" data-v-5624f707><h2 class="text-center text-3xl font-bold text-[#444444] mb-2" data-v-5624f707> Create your account </h2><p class="text-center text-[#444444]/80 mb-8" data-v-5624f707> Join our community today </p><form class="space-y-4" data-v-5624f707><div data-v-5624f707><div class="relative" data-v-5624f707><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-5624f707><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50" viewBox="0 0 20 20" fill="currentColor" data-v-5624f707><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" data-v-5624f707></path></svg></div><input id="email"${ssrRenderAttr("value", unref(form).name)} type="text" required class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="Full Name" data-v-5624f707></div>`);
      _push(ssrRenderComponent(_sfc_main$L, {
        message: unref(form).errors.name
      }, null, _parent));
      _push(`</div><div data-v-5624f707><div class="relative" data-v-5624f707><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-5624f707><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50" viewBox="0 0 20 20" fill="currentColor" data-v-5624f707><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" data-v-5624f707></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" data-v-5624f707></path></svg></div><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="Email Address" data-v-5624f707></div>`);
      _push(ssrRenderComponent(_sfc_main$L, {
        message: unref(form).errors.email
      }, null, _parent));
      _push(`</div><div data-v-5624f707><div class="relative" data-v-5624f707><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-5624f707><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50" viewBox="0 0 20 20" fill="currentColor" data-v-5624f707><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" data-v-5624f707></path></svg></div><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="••••••••" data-v-5624f707></div>`);
      _push(ssrRenderComponent(_sfc_main$L, {
        message: unref(form).errors.password
      }, null, _parent));
      _push(`<p class="mt-1 text-xs text-[#444444]/60" data-v-5624f707>Minimum 8 characters</p></div><div data-v-5624f707><div class="relative" data-v-5624f707><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-5624f707><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50" viewBox="0 0 20 20" fill="currentColor" data-v-5624f707><path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd" data-v-5624f707></path></svg></div><input id="password_confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" required class="pl-5 pr-3 block w-full py-2 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="••••••••" data-v-5624f707></div>`);
      _push(ssrRenderComponent(_sfc_main$L, {
        message: unref(form).errors.password_confirmation
      }, null, _parent));
      _push(`</div><div class="flex items-start" data-v-5624f707><div class="flex items-center h-5" data-v-5624f707><input id="terms"${ssrIncludeBooleanAttr(Array.isArray(unref(form).terms) ? ssrLooseContain(unref(form).terms, null) : unref(form).terms) ? " checked" : ""} type="checkbox" class="focus:ring-[#ff2832] h-4 w-4 text-[#ff2832] border-[#e6e3de] rounded" required data-v-5624f707></div><div class="ml-3 text-sm" data-v-5624f707><label for="terms" class="font-medium text-[#444444]" data-v-5624f707> I agree to the <a href="#" class="text-[#ff2832] hover:text-[#ff2832]/80" data-v-5624f707>Terms</a> and <a href="#" class="text-[#ff2832] hover:text-[#ff2832]/80" data-v-5624f707>Privacy Policy</a></label></div></div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-75 cursor-not-allowed": unref(form).processing }, "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 transform hover:scale-[1.02]"])}" data-v-5624f707>`);
      if (unref(form).processing) {
        _push(`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-5624f707><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-5624f707></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-5624f707></path></svg>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(unref(form).processing ? "Creating account..." : "Sign up")}</button></form><div class="mt-6 text-center text-sm text-[#444444]" data-v-5624f707> Already have an account? `);
      _push(ssrRenderComponent(unref(Link), {
        href: unref(route$1)("login"),
        class: "font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign in `);
          } else {
            return [
              createTextVNode(" Sign in ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Register.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const Register = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["__scopeId", "data-v-5624f707"]]);
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Register
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$D = {
  __name: "ResetPassword",
  __ssrInlineRender: true,
  props: {
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      token: props.token,
      email: props.email,
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" }, _attrs))}><div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl">`);
      _push(ssrRenderComponent(unref(Head), { title: "Reset Password" }, null, _parent));
      _push(`<form><div><label for="email" class="block text-sm font-medium text-[#444444] mb-1">Email address</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="you@example.com">`);
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.email
      }, null, _parent));
      _push(`</div><div class="mt-4"><label for="password" class="block text-sm font-medium text-[#444444] mb-1">Password</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="••••••••">`);
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.password
      }, null, _parent));
      _push(`</div><div class="mt-4"><div><label for="password_confirmation" class="block text-sm font-medium text-[#444444] mb-1">Password Confirm</label><input id="password_confirmation"${ssrRenderAttr("value", unref(form).password_confirmation)} type="password" required class="appearance-none relative block w-full px-3 py-3 border border-[#e6e3de] placeholder-[#444444]/40 text-[#444444] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 focus:z-10 sm:text-sm transition-all duration-200" placeholder="••••••••">`);
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.password_confirmation
      }, null, _parent));
      _push(`</div></div><div class="mt-4 flex items-center justify-end"><button type="submit" class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}> Reset Password </button></div></form></div></div>`);
    };
  }
};
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ResetPassword.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$D
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$C = {
  __name: "VerifyEmail",
  __ssrInlineRender: true,
  props: {
    status: {
      type: String
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({});
    const verificationLinkSent = computed(
      () => props.status === "verification-link-sent"
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Email Verification" }, null, _parent));
      _push(`<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl"><div class="mb-4 text-sm text-gray-600"> Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn&#39;t receive the email, we will gladly send you another. </div>`);
      if (verificationLinkSent.value) {
        _push(`<div class="mb-4 text-sm font-medium text-green-600"> A new verification link has been sent to the email address you provided during registration. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form><div class="mt-4 flex items-center justify-between"><button type="submit" class="${ssrRenderClass([{ "opacity-25": unref(form).processing }, "group relative flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200 shadow-md"])}"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}> Resend Verification Email </button>`);
      _push(ssrRenderComponent(unref(Link), {
        href: unref(route$1)("logout"),
        method: "post",
        as: "button",
        class: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Log Out`);
          } else {
            return [
              createTextVNode(" Log Out")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/VerifyEmail.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$C
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$B = {
  __name: "ImageComponent",
  __ssrInlineRender: true,
  props: {
    source: {
      type: String,
      default: null
    },
    alt: {
      type: String,
      default: ""
    },
    class: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const loaded = ref(false);
    const observer = ref(null);
    const imageref = ref();
    onMounted(() => {
      ObservImage();
    });
    watch(() => props.source, () => {
      ObservImage();
      loadImage();
    }, { deep: true });
    function ObservImage() {
      observer.value = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.value.unobserve(imageref.value);
          }
        });
      }, {
        rootMargin: "0px 0px 100px 0px"
        // Load 100px before entering viewport
      });
      observer.value.observe(imageref.value);
    }
    onBeforeUnmount(() => {
      if (observer.value) {
        observer.value.disconnect();
      }
    });
    function loadImage() {
      const img = new Image();
      img.src = imageref.value.dataset.src;
      img.onload = () => {
        imageref.value.src = props.source;
        loaded.value = true;
      };
      img.onerror = () => {
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<figure${ssrRenderAttrs(mergeProps({ class: "relative flex" }, _attrs))} data-v-70cd37f9>`);
      if (__props.source) {
        _push(`<img${ssrRenderAttr("data-src", __props.source)} class="${ssrRenderClass({ "loaded": loaded.value })}"${ssrRenderAttr("alt", __props.alt)} data-v-70cd37f9>`);
      } else {
        _push(`<!---->`);
      }
      if (!loaded.value && ((_a = imageref.value) == null ? void 0 : _a.src) == "") {
        _push(`<div class="image-placeholder" data-v-70cd37f9></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</figure>`);
    };
  }
};
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ImageComponent.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const ImageComponent = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-70cd37f9"]]);
const _sfc_main$A = {
  __name: "SlideShow",
  __ssrInlineRender: true,
  props: ["content"],
  setup(__props) {
    const props = __props;
    const slides = ref(props.content);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap-main-slide" }, _attrs))} data-v-c1838139><div class="slide-carousel owl-carousel d-flex style-nav-1 slideShow" data-items="1" data-loop="1" data-nav="true" data-dots="false" data-v-c1838139><!--[-->`);
      ssrRenderList(slides.value, (slide, index) => {
        _push(`<div class="item-slide position-relative slides" data-v-c1838139>`);
        _push(ssrRenderComponent(ImageComponent, {
          source: `assets/images/${slide.image}`,
          alt: slide.title,
          class: "img-slide"
        }, null, _parent));
        _push(`<div class="${ssrRenderClass(["slide-info", slide.slideClass])}" data-v-c1838139><h2 class="f-title" data-v-c1838139>${slide.title ?? ""}</h2>`);
        if (slide.subtitle) {
          _push(`<span class="subtitle" data-v-c1838139>${ssrInterpolate(slide.subtitle)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (slide.price) {
          _push(`<p class="sale-info" data-v-c1838139>${ssrInterpolate(slide.priceLabel || "Only price:")} <span class="price" data-v-c1838139>${ssrInterpolate(slide.price)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        if (slide.discountCode) {
          _push(`<p class="discount-code" data-v-c1838139>${ssrInterpolate(slide.discountCode)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (slide.freeTitle) {
          _push(`<!--[--><h4 class="s-title" data-v-c1838139>${ssrInterpolate(slide.freeTitle)}</h4><p class="s-subtitle" data-v-c1838139>${ssrInterpolate(slide.freeSubtitle)}</p><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (slide.cta) {
          _push(`<a href="#" class="btn-link" data-v-c1838139>${ssrInterpolate(slide.cta)}</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/SlideShow.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const SlideShow = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["__scopeId", "data-v-c1838139"]]);
const _sfc_main$z = {
  name: "ProductSection",
  components: { ImageComponent },
  props: {
    title: {
      type: String,
      default: null
    },
    products: {
      type: Array,
      required: true
    },
    countdown: {
      type: String,
      default: null
    },
    saleActive: {
      type: Boolean,
      default: false
    },
    showNewLabel: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ImageComponent = resolveComponent("ImageComponent");
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: ["wrap-show-advance-info-box style-1", { "has-countdown": $props.countdown }]
  }, _attrs))}>`);
  if ($props.products.length) {
    _push(`<div class="wrap-show-advance-info-box style-1 position-relative">`);
    if ($props.title) {
      _push(`<h3 class="title-box">${ssrInterpolate($props.title)}</h3>`);
    } else {
      _push(`<!---->`);
    }
    if ($props.countdown) {
      _push(`<div class="wrap-countdown relative mercado-countdown"${ssrRenderAttr("data-expire", $props.countdown)}></div>`);
    } else {
      _push(`<div class="row mx-0 py-2"></div>`);
    }
    _push(`<div class="wrap-products pt-0"><div class="wrap-product-tab tab-style-1 mt-0"><div class="tab-contents"><div class="tab-content-item active" id="digital_1a"><div class="wrap-products slide-carousel owl-carousel style-nav-1 equal-container flex-slider" data-items="5" data-loop="false" data-nav="true" data-dots="false" data-responsive="{&quot;0&quot;:{&quot;items&quot;:&quot;1&quot;},&quot;480&quot;:{&quot;items&quot;:&quot;2&quot;},&quot;768&quot;:{&quot;items&quot;:&quot;3&quot;},&quot;992&quot;:{&quot;items&quot;:&quot;4&quot;},&quot;1200&quot;:{&quot;items&quot;:&quot;5&quot;}}"><!--[-->`);
    ssrRenderList($props.products, (item, index) => {
      _push(`<div class="product product-style-2 equal-elem slides"><div class="product-thumnail prod-img-ratio"><a${ssrRenderAttr("href", `/products/${item.slug}`)}${ssrRenderAttr("title", item.name)}>`);
      _push(ssrRenderComponent(_component_ImageComponent, {
        source: `/assets/images/products/${item.images.split(",")[0]}`,
        alt: item.name
      }, null, _parent));
      _push(`</a><div class="group-flash"></div><div class="wrap-btn"><a${ssrRenderAttr("href", `/products/${item.slug}`)} class="function-link">quick view</a></div></div><div class="product-info"><a${ssrRenderAttr("href", `/products/${item.slug}`)} class="product-name d-block"><span>${ssrInterpolate(item.name)}</span></a><div class="wrap-price"><span class="product-price">$${ssrInterpolate(item.price)}</span></div></div></div>`);
    });
    _push(`<!--]--></div></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ProductSectionView.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const ProductSectionView = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$y = {
  __name: "ProductSection",
  __ssrInlineRender: true,
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const products = ref([]);
    async function getProducts() {
      try {
        const { data } = await API.get("product-collection", {
          params: {
            collectionID: props.content.collectionId
          }
        });
        products.value = data;
      } catch (error) {
        console.error("Failed to load products", error);
        getProducts();
      }
    }
    getProducts();
    return (_ctx, _push, _parent, _attrs) => {
      if (products.value.length) {
        _push(ssrRenderComponent(ProductSectionView, mergeProps({
          countdown: props.content.countdown,
          title: props.content.title,
          products: products.value
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ProductSection.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = {
  __name: "BannerTwin",
  __ssrInlineRender: true,
  props: ["content"],
  setup(__props) {
    const props = __props;
    const banners = ref(props.content);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap-banner style-twin-default" }, _attrs))}><!--[-->`);
      ssrRenderList(banners.value, (banner, index) => {
        _push(`<div class="banner-item"><a${ssrRenderAttr("href", banner.link || "#")} class="link-banner banner-effect-1"><figure><img${ssrRenderAttr("src", banner.image)}${ssrRenderAttr("alt", banner.alt || "Banner image")}${ssrRenderAttr("width", banner.width)}${ssrRenderAttr("height", banner.height)}></figure></a></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/BannerTwin.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = {
  __name: "BannerSingle",
  __ssrInlineRender: true,
  props: ["content"],
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      if (props.content.image) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap-top-banner py-5" }, _attrs))}><a${ssrRenderAttr("href", props.content.url)} class="link-banner banner-effect-2"><figure><img${ssrRenderAttr("src", `/assets/images/${props.content.image}`)} width="1170" height="240" alt=""></figure></a></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/BannerSingle.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = {
  __name: "ProductCategory",
  __ssrInlineRender: true,
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const categories = ref([]);
    async function getProducts() {
      try {
        const { data } = await API.get("product-categories", {
          params: {
            categories: props.content.categories.join("--"),
            limit: props.content.limit
          }
        });
        categories.value = data;
      } catch (error) {
        console.error("Failed to load products", error);
        getProducts();
      }
    }
    getProducts();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap-show-advance-info-box style-1" }, _attrs))}><h3 class="title-box">Product Categories</h3><div class="wrap-products"><div class="wrap-product-tab tab-style-1"><div class="tab-control"><!--[-->`);
      ssrRenderList(categories.value, (item, index) => {
        _push(`<a${ssrRenderAttr("href", `#${item.slug}`)} class="${ssrRenderClass([
          "tab-control-item",
          index === 0 ? "active" : ""
        ])}">${ssrInterpolate(item.name)}</a>`);
      });
      _push(`<!--]--></div><div class="tab-contents"><!--[-->`);
      ssrRenderList(categories.value, (category, index) => {
        _push(`<div class="${ssrRenderClass([
          "tab-content-item",
          index === 0 ? "active" : ""
        ])}"${ssrRenderAttr("id", category.slug)}><div class="wrap-products slide-carousel owl-carousel style-nav-1 equal-container flex-slider" data-items="5" data-loop="false" data-nav="true" data-dots="false" data-responsive="{&quot;0&quot;:{&quot;items&quot;:&quot;1&quot;},&quot;480&quot;:{&quot;items&quot;:&quot;2&quot;},&quot;768&quot;:{&quot;items&quot;:&quot;3&quot;},&quot;992&quot;:{&quot;items&quot;:&quot;4&quot;},&quot;1200&quot;:{&quot;items&quot;:&quot;5&quot;}}"><!--[-->`);
        ssrRenderList(category.products, (item, index2) => {
          _push(`<div class="product product-style-2 equal-elem slides"><div class="product-thumnail prod-img-ratio"><a${ssrRenderAttr("href", `/products/${item.slug}`)}${ssrRenderAttr("title", item.name)}>`);
          _push(ssrRenderComponent(ImageComponent, {
            source: `/assets/images/products/${item.images.split(",")[0]}`,
            alt: item.name
          }, null, _parent));
          _push(`</a><div class="wrap-btn"><a${ssrRenderAttr("href", `/products/${item.slug}`)} class="function-link">quick view</a></div></div><div class="product-info"><a${ssrRenderAttr("href", `/products/${item.slug}`)} class="product-name d-block"><span>${ssrInterpolate(item.name)}</span></a><div class="wrap-price"><span class="product-price">$${ssrInterpolate(item.price)}</span></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ProductCategory.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _sfc_main$u = {
  __name: "BuildPage",
  __ssrInlineRender: true,
  props: ["data"],
  setup(__props) {
    const componentsMap = {
      slide_show: SlideShow,
      product_collection: _sfc_main$y,
      banner_twin: _sfc_main$x,
      banner_single: _sfc_main$w,
      product_category: _sfc_main$v
    };
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main id="main" class="main-site"${_scopeId}><div class="container"${_scopeId}>`);
            ssrRenderSuspense(_push2, {
              default: () => {
                _push2(`<!--[-->`);
                ssrRenderList(props.data, (component, i) => {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(componentsMap[component.name]), {
                    key: i,
                    content: component.fields
                  }, null), _parent2, _scopeId);
                });
                _push2(`<!--]-->`);
              },
              _: 1
            });
            _push2(`</div></main>`);
          } else {
            return [
              createVNode("main", {
                id: "main",
                class: "main-site"
              }, [
                createVNode("div", { class: "container" }, [
                  (openBlock(), createBlock(Suspense, null, {
                    default: withCtx(() => [
                      (openBlock(true), createBlock(Fragment, null, renderList(props.data, (component, i) => {
                        return openBlock(), createBlock(resolveDynamicComponent(componentsMap[component.name]), {
                          key: i,
                          content: component.fields
                        }, null, 8, ["content"]);
                      }), 128))
                    ]),
                    _: 1
                  }))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/BuildPage.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$u
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$t = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "spinner-border",
    role: "status"
  }, _attrs))} data-v-c4edcb3d><span class="sr-only" data-v-c4edcb3d></span></div>`);
}
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Spinner.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const Spinner = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-c4edcb3d"]]);
const _sfc_main$s = {
  __name: "CartItemQty",
  __ssrInlineRender: true,
  props: {
    quantity: {
      type: Number,
      default: 1,
      required: true
    },
    rowId: {
      type: String,
      default: "",
      required: true
    },
    maxQty: {
      type: Number,
      default: 1,
      required: true
    }
  },
  emits: ["refresh-cart"],
  setup(__props, { emit: __emit }) {
    const loader = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "quantity-input d-flex align-items-center py-1 px-2" }, _attrs))}><div class="d-flex gap-2"><a class="btn btn-reduce m-0"${ssrIncludeBooleanAttr(loader.value ? true : void 0) ? " disabled" : ""}></a><a class="btn btn-increase m-0"${ssrIncludeBooleanAttr(loader.value ? true : void 0) ? " disabled" : ""}></a></div><div style="${ssrRenderStyle({ "flex": "1" })}" class="d-flex justify-content-center">`);
      if (loader.value) {
        _push(ssrRenderComponent(Spinner, null, null, _parent));
      } else {
        _push(`<span>${ssrInterpolate(__props.quantity)}</span>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/CartItemQty.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = {
  __name: "CartItemRemover",
  __ssrInlineRender: true,
  props: {
    rowId: {
      type: String,
      default: "",
      required: true
    }
  },
  emits: ["refresh-cart"],
  setup(__props, { emit: __emit }) {
    const loader = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "delete" }, _attrs))}>`);
      if (loader.value) {
        _push(ssrRenderComponent(Spinner, null, null, _parent));
      } else {
        _push(`<a href="#" class="btn btn-delete"><span>Delete from your cart</span><i class="fa fa-times-circle" aria-hidden="true"></i></a>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/CartItemRemover.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = {
  __name: "Cart",
  __ssrInlineRender: true,
  props: ["data"],
  setup(__props) {
    const CART = useCartState();
    const props = __props;
    const cart = ref(JSON.parse(props.data.cart));
    const clearCartLoader = ref(false);
    const removeCouponLoader = ref(false);
    const applyCouponLoader = ref(false);
    const coupon_code = ref("");
    const haveCoupon = ref(false);
    const error = ref(null);
    function refreshCart(data) {
      cart.value = data;
      CART.setCartCount(data.count);
    }
    async function clearCart() {
      clearCartLoader.value = true;
      try {
        const { data } = await API.get("clear-cart");
        cart.value = data;
        document.getElementById("cartindex").innerText = 0;
      } catch (error2) {
        console.log("faild to clear the cart");
      } finally {
        clearCartLoader.value = false;
      }
    }
    async function removeCoupon() {
      removeCouponLoader.value = true;
      try {
        const { data } = await API.get("remove-coupon");
        cart.value = data;
      } catch (error2) {
        console.log("faild to remove this coupon !");
      } finally {
        removeCouponLoader.value = true;
      }
    }
    async function applyCoupon() {
      if (this.coupon_code.trim() == "") {
        error.value = "you should provide a code.";
        return;
      }
      applyCouponLoader.value = true;
      try {
        const { data } = await API.post("apply-coupon", {
          coupon_code: this.coupon_code
        });
        if (data.error) {
          error.value = data.error;
          return;
        }
        cart.value = data.cart;
      } catch (error2) {
        console.log("faild to apply this coupon !");
      } finally {
        applyCouponLoader.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<main id="main" class="main-site"${_scopeId}><div class="container"${_scopeId}><div class="row mx-0"${_scopeId}><div class="wrap-breadcrumb col-12"${_scopeId}><ul${_scopeId}><li class="item-link"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`home`);
                } else {
                  return [
                    createTextVNode("home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li class="item-link"${_scopeId}><span${_scopeId}>Cart</span></li></ul></div>`);
            if (cart.value) {
              _push2(`<div class="main-content-area shopping-cart col-12"${_scopeId}>`);
              if (((_a = cart.value) == null ? void 0 : _a.count) > 0) {
                _push2(`<div${_scopeId}><div class="wrap-iten-in-cart"${_scopeId}><h3 class="box-title"${_scopeId}>Products Name</h3><ul class="products-cart"${_scopeId}><!--[-->`);
                ssrRenderList(cart.value.content, (item, index) => {
                  var _a2, _b2, _c, _d, _e;
                  _push2(`<li class="pr-cart-item"${_scopeId}><div class="product-image"${_scopeId}><figure${_scopeId}>`);
                  if ((_a2 = item.model) == null ? void 0 : _a2.images) {
                    _push2(`<img${ssrRenderAttr("src", `/assets/images/products/${(_c = (_b2 = item.model) == null ? void 0 : _b2.images) == null ? void 0 : _c.split(
                      ","
                    )[0]}`)} alt=""${_scopeId}>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</figure></div><div class="product-name"${_scopeId}><a class="link-to-product"${ssrRenderAttr("href", `/products/${(_d = item.model) == null ? void 0 : _d.slug}`)}${_scopeId}>${ssrInterpolate(item.name)}</a></div><div class="price-field produtc-price"${_scopeId}><p class="price"${_scopeId}> $${ssrInterpolate(item.price)}</p></div><div class="quantity"${_scopeId}>`);
                  _push2(ssrRenderComponent(_sfc_main$s, {
                    onRefreshCart: refreshCart,
                    quantity: item.qty,
                    rowId: item.rowId,
                    maxQty: ((_e = item.model) == null ? void 0 : _e.quantity) ?? 0
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="price-field sub-total"${_scopeId}><p class="price"${_scopeId}> $${ssrInterpolate(item.subtotal)}</p></div>`);
                  _push2(ssrRenderComponent(_sfc_main$r, {
                    onRefreshCart: refreshCart,
                    rowId: item.rowId
                  }, null, _parent2, _scopeId));
                  _push2(`</li>`);
                });
                _push2(`<!--]--></ul></div><div class="row mx-0 border py-3 px-3 gap-y-5"${_scopeId}><div class="col-12 col-md-4"${_scopeId}><h4 class="text-lg md:text-xl mb-3"${_scopeId}>Order Summary</h4><p class="flex justify-between mb-3 font-bold"${_scopeId}><span class="text-sm"${_scopeId}>Subtotal </span><b class="text-sm"${_scopeId}> $${ssrInterpolate(cart.value.subtotal)}</b></p><p class="flex justify-between mb-3 font-bold"${_scopeId}><span class="text-sm"${_scopeId}>Shipping</span><b class="text-sm"${_scopeId}>Free Shipping</b></p><p class="flex justify-between mb-3 font-bold"${_scopeId}><span class="text-sm"${_scopeId}>Tax</span><b class="text-sm"${_scopeId}> $${ssrInterpolate(cart.value.tax)}</b></p>`);
                if (cart.value.coupon) {
                  _push2(`<p class="flex justify-between mb-3 font-bold"${_scopeId}><span class="text-sm"${_scopeId}>Discount</span><b class="text-sm"${_scopeId}> $${ssrInterpolate(cart.value.discount)}</b></p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<hr${_scopeId}><p class="flex justify-between mt-3 font-bold"${_scopeId}><span class="text-sm"${_scopeId}>Total</span><b class="text-sm"${_scopeId}> $${ssrInterpolate(cart.value.discountedTotal)}</b></p></div>`);
                if (!cart.value.coupon) {
                  _push2(`<div class="col-12 col-md-5 d-flex justify-center"${_scopeId}><div class="md:px-5 pt-4 mt-3 w-full"${_scopeId}><label class="inline-flex items-center gap-2"${_scopeId}><input class="rounded-sm checked:bg-[#ff2832] checked:hover:bg-[#ff2832] checked:focus:bg-[#ff2832] ring-0 focus:ring-0" name="have-code" id="have-code" type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(haveCoupon.value) ? ssrLooseContain(haveCoupon.value, null) : haveCoupon.value) ? " checked" : ""}${_scopeId}><span${_scopeId}>I have coupon code</span></label>`);
                  if (haveCoupon.value) {
                    _push2(`<div class="row-in-form pt-3 fadding"${_scopeId}><form method="post"${_scopeId}><div class="mb-1"${_scopeId}><input id="coupon-code" type="text" class="text-sm ring-0 focus:ring-0 border-2 focus:border-[#ff2832]/70 transition" placeholder="Enter Your Coupon code"${ssrRenderAttr("value", coupon_code.value)}${_scopeId}>`);
                    if (error.value) {
                      _push2(`<span class="text-danger d-block mt-1"${_scopeId}>* ${ssrInterpolate(error.value)}</span>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div><button class="btn-prime px-3 py-2 flex gap-1 mt-3 transition" type="submit"${ssrIncludeBooleanAttr(applyCouponLoader.value) ? " disabled" : ""}${_scopeId}>`);
                    if (applyCouponLoader.value) {
                      _push2(ssrRenderComponent(Spinner, null, null, _parent2, _scopeId));
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<span${_scopeId}>Apply</span></button></form></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="col-12 col-md-3 d-flex flex-column gap-3 justify-end mt-5 md:mt-0"${_scopeId}><button class="btn text-center btn-prime_2 btn-clear-cart py-2 align-self-end transition"${ssrIncludeBooleanAttr(
                  clearCartLoader.value ? true : void 0
                ) ? " disabled" : ""}${_scopeId}>`);
                if (clearCartLoader.value) {
                  _push2(ssrRenderComponent(Spinner, null, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span${_scopeId}>Clear Shopping Cart</span></button>`);
                if (cart.value.coupon) {
                  _push2(`<button class="btn text-center btn-prime_2 btn-clear-cart py-2 align-self-end transition"${ssrIncludeBooleanAttr(
                    removeCouponLoader.value ? true : void 0
                  ) ? " disabled" : ""}${_scopeId}>`);
                  if (removeCouponLoader.value) {
                    _push2(ssrRenderComponent(Spinner, null, null, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<span${_scopeId}>Remove Coupon</span></button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(ssrRenderComponent(unref(Link), {
                  class: "btn text-center btn-prime btn-checkout py-2 align-self-end transition",
                  href: unref(route$1)("checkout")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Check out`);
                    } else {
                      return [
                        createTextVNode("Check out")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              } else {
                _push2(`<div class="cartempty"${_scopeId}><h1${_scopeId}>Cart Empty!</h1>`);
                _push2(ssrRenderComponent(unref(Link), {
                  href: unref(route$1)("shop")
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`Continue shopping <i class="fa fa-arrow-circle-right" aria-hidden="true"${_scopeId2}></i>`);
                    } else {
                      return [
                        createTextVNode("Continue shopping "),
                        createVNode("i", {
                          class: "fa fa-arrow-circle-right",
                          "aria-hidden": "true"
                        })
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (props.data.public_products.length) {
              _push2(ssrRenderComponent(ProductSectionView, {
                title: "Most Viewed",
                products: props.data.public_products
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></main>`);
          } else {
            return [
              createVNode("main", {
                id: "main",
                class: "main-site"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "row mx-0" }, [
                    createVNode("div", { class: "wrap-breadcrumb col-12" }, [
                      createVNode("ul", null, [
                        createVNode("li", { class: "item-link" }, [
                          createVNode(unref(Link), {
                            href: "/",
                            class: "link"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("home")
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("li", { class: "item-link" }, [
                          createVNode("span", null, "Cart")
                        ])
                      ])
                    ]),
                    cart.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "main-content-area shopping-cart col-12"
                    }, [
                      ((_b = cart.value) == null ? void 0 : _b.count) > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("div", { class: "wrap-iten-in-cart" }, [
                          createVNode("h3", { class: "box-title" }, "Products Name"),
                          createVNode("ul", { class: "products-cart" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(cart.value.content, (item, index) => {
                              var _a2, _b2, _c, _d, _e;
                              return openBlock(), createBlock("li", {
                                class: "pr-cart-item",
                                key: index
                              }, [
                                createVNode("div", { class: "product-image" }, [
                                  createVNode("figure", null, [
                                    ((_a2 = item.model) == null ? void 0 : _a2.images) ? (openBlock(), createBlock("img", {
                                      key: 0,
                                      src: `/assets/images/products/${(_c = (_b2 = item.model) == null ? void 0 : _b2.images) == null ? void 0 : _c.split(
                                        ","
                                      )[0]}`,
                                      alt: ""
                                    }, null, 8, ["src"])) : createCommentVNode("", true)
                                  ])
                                ]),
                                createVNode("div", { class: "product-name" }, [
                                  createVNode("a", {
                                    class: "link-to-product",
                                    href: `/products/${(_d = item.model) == null ? void 0 : _d.slug}`
                                  }, toDisplayString(item.name), 9, ["href"])
                                ]),
                                createVNode("div", { class: "price-field produtc-price" }, [
                                  createVNode("p", { class: "price" }, " $" + toDisplayString(item.price), 1)
                                ]),
                                createVNode("div", { class: "quantity" }, [
                                  createVNode(_sfc_main$s, {
                                    onRefreshCart: refreshCart,
                                    quantity: item.qty,
                                    rowId: item.rowId,
                                    maxQty: ((_e = item.model) == null ? void 0 : _e.quantity) ?? 0
                                  }, null, 8, ["quantity", "rowId", "maxQty"])
                                ]),
                                createVNode("div", { class: "price-field sub-total" }, [
                                  createVNode("p", { class: "price" }, " $" + toDisplayString(item.subtotal), 1)
                                ]),
                                createVNode(_sfc_main$r, {
                                  onRefreshCart: refreshCart,
                                  rowId: item.rowId
                                }, null, 8, ["rowId"])
                              ]);
                            }), 128))
                          ])
                        ]),
                        createVNode("div", { class: "row mx-0 border py-3 px-3 gap-y-5" }, [
                          createVNode("div", { class: "col-12 col-md-4" }, [
                            createVNode("h4", { class: "text-lg md:text-xl mb-3" }, "Order Summary"),
                            createVNode("p", { class: "flex justify-between mb-3 font-bold" }, [
                              createVNode("span", { class: "text-sm" }, "Subtotal "),
                              createVNode("b", { class: "text-sm" }, " $" + toDisplayString(cart.value.subtotal), 1)
                            ]),
                            createVNode("p", { class: "flex justify-between mb-3 font-bold" }, [
                              createVNode("span", { class: "text-sm" }, "Shipping"),
                              createVNode("b", { class: "text-sm" }, "Free Shipping")
                            ]),
                            createVNode("p", { class: "flex justify-between mb-3 font-bold" }, [
                              createVNode("span", { class: "text-sm" }, "Tax"),
                              createVNode("b", { class: "text-sm" }, " $" + toDisplayString(cart.value.tax), 1)
                            ]),
                            cart.value.coupon ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "flex justify-between mb-3 font-bold"
                            }, [
                              createVNode("span", { class: "text-sm" }, "Discount"),
                              createVNode("b", { class: "text-sm" }, " $" + toDisplayString(cart.value.discount), 1)
                            ])) : createCommentVNode("", true),
                            createVNode("hr"),
                            createVNode("p", { class: "flex justify-between mt-3 font-bold" }, [
                              createVNode("span", { class: "text-sm" }, "Total"),
                              createVNode("b", { class: "text-sm" }, " $" + toDisplayString(cart.value.discountedTotal), 1)
                            ])
                          ]),
                          !cart.value.coupon ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "col-12 col-md-5 d-flex justify-center"
                          }, [
                            createVNode("div", { class: "md:px-5 pt-4 mt-3 w-full" }, [
                              createVNode("label", { class: "inline-flex items-center gap-2" }, [
                                withDirectives(createVNode("input", {
                                  class: "rounded-sm checked:bg-[#ff2832] checked:hover:bg-[#ff2832] checked:focus:bg-[#ff2832] ring-0 focus:ring-0",
                                  name: "have-code",
                                  id: "have-code",
                                  type: "checkbox",
                                  "onUpdate:modelValue": ($event) => haveCoupon.value = $event
                                }, null, 8, ["onUpdate:modelValue"]), [
                                  [vModelCheckbox, haveCoupon.value]
                                ]),
                                createVNode("span", null, "I have coupon code")
                              ]),
                              haveCoupon.value ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "row-in-form pt-3 fadding"
                              }, [
                                createVNode("form", {
                                  method: "post",
                                  onSubmit: withModifiers(($event) => applyCoupon(), ["prevent"])
                                }, [
                                  createVNode("div", { class: "mb-1" }, [
                                    withDirectives(createVNode("input", {
                                      id: "coupon-code",
                                      type: "text",
                                      class: "text-sm ring-0 focus:ring-0 border-2 focus:border-[#ff2832]/70 transition",
                                      placeholder: "Enter Your Coupon code",
                                      "onUpdate:modelValue": ($event) => coupon_code.value = $event
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelText, coupon_code.value]
                                    ]),
                                    error.value ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "text-danger d-block mt-1"
                                    }, "* " + toDisplayString(error.value), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("button", {
                                    class: "btn-prime px-3 py-2 flex gap-1 mt-3 transition",
                                    type: "submit",
                                    disabled: applyCouponLoader.value
                                  }, [
                                    applyCouponLoader.value ? (openBlock(), createBlock(Spinner, { key: 0 })) : createCommentVNode("", true),
                                    createVNode("span", null, "Apply")
                                  ], 8, ["disabled"])
                                ], 40, ["onSubmit"])
                              ])) : createCommentVNode("", true)
                            ])
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "col-12 col-md-3 d-flex flex-column gap-3 justify-end mt-5 md:mt-0" }, [
                            createVNode("button", {
                              class: "btn text-center btn-prime_2 btn-clear-cart py-2 align-self-end transition",
                              onClick: withModifiers(($event) => clearCart(), ["prevent"]),
                              disabled: clearCartLoader.value ? true : void 0
                            }, [
                              clearCartLoader.value ? (openBlock(), createBlock(Spinner, { key: 0 })) : createCommentVNode("", true),
                              createVNode("span", null, "Clear Shopping Cart")
                            ], 8, ["onClick", "disabled"]),
                            cart.value.coupon ? (openBlock(), createBlock("button", {
                              key: 0,
                              class: "btn text-center btn-prime_2 btn-clear-cart py-2 align-self-end transition",
                              onClick: withModifiers(($event) => removeCoupon(), ["prevent"]),
                              disabled: removeCouponLoader.value ? true : void 0
                            }, [
                              removeCouponLoader.value ? (openBlock(), createBlock(Spinner, { key: 0 })) : createCommentVNode("", true),
                              createVNode("span", null, "Remove Coupon")
                            ], 8, ["onClick", "disabled"])) : createCommentVNode("", true),
                            createVNode(unref(Link), {
                              class: "btn text-center btn-prime btn-checkout py-2 align-self-end transition",
                              href: unref(route$1)("checkout")
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Check out")
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ])
                        ])
                      ])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "cartempty"
                      }, [
                        createVNode("h1", null, "Cart Empty!"),
                        createVNode(unref(Link), {
                          href: unref(route$1)("shop")
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Continue shopping "),
                            createVNode("i", {
                              class: "fa fa-arrow-circle-right",
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ]))
                    ])) : createCommentVNode("", true)
                  ]),
                  props.data.public_products.length ? (openBlock(), createBlock(ProductSectionView, {
                    key: 0,
                    title: "Most Viewed",
                    products: props.data.public_products
                  }, null, 8, ["products"])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Cart.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$q
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$p = {
  __name: "CheckoutForm",
  __ssrInlineRender: true,
  props: ["grandtotal"],
  setup(__props) {
    const form = useForm({
      billing_name: "",
      billing_email: "",
      billing_phone: "",
      billing_country: "",
      billing_city: "",
      billing_province: "",
      billing_address_1: "",
      billing_address_2: "",
      billing_zipCode: "",
      diff_address: false,
      paymentMethod: null,
      card_numbr: null,
      card_expMonth: null,
      card_expYear: null,
      card_cvc: null
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "main-content-area" }, _attrs))}><div class="wrap-address-billing"><h3 class="box-title">Billing Address</h3><form method="post" id="billing-form"><p class="row-in-form"><label for="fname">first name<span>*</span></label><input id="fname" type="text" name="name"${ssrRenderAttr("value", unref(form).billing_name)} placeholder="Your name" required>`);
      if (unref(form).errors.billing_name) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_name)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="email">Email Addreess:</label><input id="email" type="email" name="email"${ssrRenderAttr("value", unref(form).billing_email)} placeholder="Type your email" required>`);
      if (unref(form).errors.billing_email) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_email)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="phone">Phone number<span>*</span></label><input id="phone" type="number" name="phone"${ssrRenderAttr("value", unref(form).billing_phone)} placeholder="10 digits format" required>`);
      if (unref(form).errors.billing_phone) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_phone)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="line_1">Line 1<span>*</span></label><input id="line_1" type="text" name="address_1"${ssrRenderAttr("value", unref(form).billing_address_1)} placeholder="line 1" required>`);
      if (unref(form).errors.billing_address_1) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_address_1)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="line_2">Line 2<span>*</span></label><input id="line_2" type="text" name="address_2"${ssrRenderAttr("value", unref(form).billing_address_2)} placeholder="line 2" required>`);
      if (unref(form).errors.billing_address_2) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_address_2)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="country">Country<span>*</span></label><input id="country" type="text" name="country"${ssrRenderAttr("value", unref(form).billing_country)} placeholder="United States" required>`);
      if (unref(form).errors.billing_country) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_country)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="province">Province<span>*</span></label><input id="province" type="text" name="province"${ssrRenderAttr("value", unref(form).billing_province)} placeholder="United States" required>`);
      if (unref(form).errors.billing_province) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_province)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="zipcode">Postcode / ZIP:</label><input id="zipcode" type="number" name="zip-code"${ssrRenderAttr("value", unref(form).billing_zipCode)} placeholder="Your postal code" required>`);
      if (unref(form).errors.billing_zipCode) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_zipCode)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form"><label for="city">Town / City<span>*</span></label><input id="city" type="text" name="city"${ssrRenderAttr("value", unref(form).billing_city)} placeholder="City name" required>`);
      if (unref(form).errors.billing_city) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.billing_city)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p><p class="row-in-form fill-wife"><label class="checkbox-field"><input name="different-add" id="different-add"${ssrIncludeBooleanAttr(Array.isArray(unref(form).diff_address) ? ssrLooseContain(unref(form).diff_address, null) : unref(form).diff_address) ? " checked" : ""} type="checkbox"><span>Ship to a different address?</span></label></p><div class="summary summary-checkout"><div class="summary-item payment-method"><h4 class="title-box">Payment Method</h4>`);
      if (unref(form).errors.paymentMethod) {
        _push(`<span class="text-red">*${ssrInterpolate(unref(form).errors.paymentMethod)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="choose-payment-methods row border-top-0"><div class="col-lg-6 col-md-6 col-sm-6"><label class="payment-method"><input name="payment-method" id="payment-method-delivery" value="cod" type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).paymentMethod, "cod")) ? " checked" : ""}><span>cash on delivery</span><span class="payment-desc">But the majority have suffered alteration in some form, by injected humour, or randomised words which don&#39;t look even slightly believable</span></label><label class="payment-method"><input name="payment-method" id="payment-method-visa" value="visa" type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).paymentMethod, "visa")) ? " checked" : ""}><span>visa</span><span class="payment-desc">There are many variations of passages of Lorem Ipsum available</span></label><label class="payment-method"><input name="payment-method" id="payment-method-paypal" value="paypal" type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).paymentMethod, "paypal")) ? " checked" : ""}><span>Paypal</span><span class="payment-desc">You can pay with your credit</span><span class="payment-desc">card if you don&#39;t have a paypal account</span></label></div><div class="col-lg-6 col-md-6 col-sm-6">`);
      if (unref(form).paymentMethod == "visa") {
        _push(`<div class="wrap-address-billing">`);
        if (_ctx.paymentError) {
          _push(`<div class="py-3">${ssrInterpolate(_ctx.paymentError)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div id="cardform"><p class="row-in-form"><label for="card-number">Card Number</label><input type="text" id="card-number" name="card-number"${ssrRenderAttr("value", unref(form).card_numbr)}></p><p class="row-in-form"><label for="expiry-Month">Expiry Month</label><input type="text" id="expiry-Month" name="exp-month"${ssrRenderAttr("value", unref(form).card_expMonth)}></p><p class="row-in-form"><label for="expiry-Year">Expiry Year</label><input type="text" id="expiry-Year" name="exp-year"${ssrRenderAttr("value", unref(form).card_expYear)}></p><p class="row-in-form"><label for="cvc">CVC</label><input type="text" id="cvc" name="cvc"${ssrRenderAttr("value", unref(form).card_cvc)}></p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="summary-info grand-total"><span>Grand Total</span><span class="grand-total-price">$${ssrInterpolate(_ctx.$props.grandtotal)}</span></p>`);
      if (unref(form).paymentMethod == "paypal") {
        _push(`<div class="paypal-pay-method" style="${ssrRenderStyle({ "width": "250px" })}"><div id="paypal-button-container"></div></div>`);
      } else {
        _push(`<div><button type="submit" class="btn btn-medium">`);
        if (unref(form).processing) {
          _push(ssrRenderComponent(Spinner, null, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<span>Place Order Now</span></button></div>`);
      }
      _push(`</div></div></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/CheckoutForm.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = {
  __name: "Checkout",
  __ssrInlineRender: true,
  props: ["total"],
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main id="main" class="main-site"${_scopeId}><div class="container"${_scopeId}><div class="wrap-breadcrumb"${_scopeId}><ul${_scopeId}><li class="item-link"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`home`);
                } else {
                  return [
                    createTextVNode("home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li class="item-link"${_scopeId}><span${_scopeId}>Checkout</span></li></ul></div>`);
            _push2(ssrRenderComponent(_sfc_main$p, {
              grandtotal: props.total
            }, null, _parent2, _scopeId));
            _push2(`</div></main>`);
          } else {
            return [
              createVNode("main", {
                id: "main",
                class: "main-site"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "wrap-breadcrumb" }, [
                    createVNode("ul", null, [
                      createVNode("li", { class: "item-link" }, [
                        createVNode(unref(Link), {
                          href: "/",
                          class: "link"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("home")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("li", { class: "item-link" }, [
                        createVNode("span", null, "Checkout")
                      ])
                    ])
                  ]),
                  createVNode(_sfc_main$p, {
                    grandtotal: props.total
                  }, null, 8, ["grandtotal"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Checkout.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$o
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$n = {
  __name: "Contact",
  __ssrInlineRender: true,
  setup(__props) {
    const form = useForm({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
    const successMessage = ref(null);
    function sendmessage() {
      form.post(route("contact.send"), {
        preserveScroll: true,
        onFinish: () => {
        },
        onSuccess: (data) => {
          console.log(data);
          successMessage.value = data == null ? void 0 : data.message;
          form.reset();
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
          if (_push2) {
            _push2(`<main id="main" class="main-site left-sidebar"${_scopeId}><div class="container"${_scopeId}><div class="wrap-breadcrumb"${_scopeId}><ul${_scopeId}><li class="item-link"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`home`);
                } else {
                  return [
                    createTextVNode("home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li class="item-link"${_scopeId}><span${_scopeId}>Contact us</span></li></ul></div><div class="row mx-0 mb-5"${_scopeId}><div class="wrap-contacts my-0 d-block col-12 col-md-6"${_scopeId}><div class="contact-box contact-form"${_scopeId}><h2 class="box-title"${_scopeId}>Leave a Message</h2>`);
            if ((_b = (_a = _ctx.$page.props) == null ? void 0 : _a.flash) == null ? void 0 : _b.success) {
              _push2(`<div class="alert alert-success"${_scopeId}>${ssrInterpolate((_d = (_c = _ctx.$page.props) == null ? void 0 : _c.flash) == null ? void 0 : _d.success)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_f = (_e = _ctx.$page.props) == null ? void 0 : _e.flash) == null ? void 0 : _f.error) {
              _push2(`<div class="alert alert-danger"${_scopeId}>${ssrInterpolate((_h = (_g = _ctx.$page.props) == null ? void 0 : _g.flash) == null ? void 0 : _h.error)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<br${_scopeId}><form id="frm-contact" enctype="multipart/form-data"${_scopeId}><div class="form-group"${_scopeId}><label for="name"${_scopeId}>Name<span${_scopeId}>*</span></label><input type="text" id="name" name="name"${ssrRenderAttr("value", unref(form).name)} required${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<span class="text-danger"${_scopeId}>${ssrInterpolate(unref(form).errors.name)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-group"${_scopeId}><label for="email"${_scopeId}>Email<span${_scopeId}>*</span></label><input type="text" id="email" name="email"${ssrRenderAttr("value", unref(form).email)} required${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<span class="text-danger"${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-group"${_scopeId}><label for="phone"${_scopeId}>Phone Number<span${_scopeId}>(optional*)</span></label><input type="text" id="phone" name="phone"${ssrRenderAttr("value", unref(form).phone)}${_scopeId}>`);
            if (unref(form).errors.name) {
              _push2(`<span class="text-danger"${_scopeId}>${ssrInterpolate(unref(form).errors.phone)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-group"${_scopeId}><label for="message"${_scopeId}>Message</label><textarea name="message" id="message" required maxlength="100"${_scopeId}>${ssrInterpolate(unref(form).message)}</textarea>`);
            if (unref(form).errors.name) {
              _push2(`<span class="text-danger"${_scopeId}>${ssrInterpolate(unref(form).errors.message)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button type="submit" class="flex gap-2 justify-center"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""}${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<i class="fa fa-circle-o-notch fa-spin"${_scopeId}></i>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span${_scopeId}>Send</span></button></form></div></div></div></div></main>`);
          } else {
            return [
              createVNode("main", {
                id: "main",
                class: "main-site left-sidebar"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "wrap-breadcrumb" }, [
                    createVNode("ul", null, [
                      createVNode("li", { class: "item-link" }, [
                        createVNode(unref(Link), {
                          href: "/",
                          class: "link"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("home")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("li", { class: "item-link" }, [
                        createVNode("span", null, "Contact us")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "row mx-0 mb-5" }, [
                    createVNode("div", { class: "wrap-contacts my-0 d-block col-12 col-md-6" }, [
                      createVNode("div", { class: "contact-box contact-form" }, [
                        createVNode("h2", { class: "box-title" }, "Leave a Message"),
                        ((_j = (_i = _ctx.$page.props) == null ? void 0 : _i.flash) == null ? void 0 : _j.success) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "alert alert-success"
                        }, toDisplayString((_l = (_k = _ctx.$page.props) == null ? void 0 : _k.flash) == null ? void 0 : _l.success), 1)) : createCommentVNode("", true),
                        ((_n = (_m = _ctx.$page.props) == null ? void 0 : _m.flash) == null ? void 0 : _n.error) ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "alert alert-danger"
                        }, toDisplayString((_p = (_o = _ctx.$page.props) == null ? void 0 : _o.flash) == null ? void 0 : _p.error), 1)) : createCommentVNode("", true),
                        createVNode("br"),
                        createVNode("form", {
                          id: "frm-contact",
                          enctype: "multipart/form-data",
                          onSubmit: withModifiers(($event) => sendmessage(), ["prevent"])
                        }, [
                          createVNode("div", { class: "form-group" }, [
                            createVNode("label", { for: "name" }, [
                              createTextVNode("Name"),
                              createVNode("span", null, "*")
                            ]),
                            withDirectives(createVNode("input", {
                              type: "text",
                              id: "name",
                              name: "name",
                              "onUpdate:modelValue": ($event) => unref(form).name = $event,
                              required: ""
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).name]
                            ]),
                            unref(form).errors.name ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-danger"
                            }, toDisplayString(unref(form).errors.name), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "form-group" }, [
                            createVNode("label", { for: "email" }, [
                              createTextVNode("Email"),
                              createVNode("span", null, "*")
                            ]),
                            withDirectives(createVNode("input", {
                              type: "text",
                              id: "email",
                              name: "email",
                              "onUpdate:modelValue": ($event) => unref(form).email = $event,
                              required: ""
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).email]
                            ]),
                            unref(form).errors.name ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-danger"
                            }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "form-group" }, [
                            createVNode("label", { for: "phone" }, [
                              createTextVNode("Phone Number"),
                              createVNode("span", null, "(optional*)")
                            ]),
                            withDirectives(createVNode("input", {
                              type: "text",
                              id: "phone",
                              name: "phone",
                              "onUpdate:modelValue": ($event) => unref(form).phone = $event
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).phone]
                            ]),
                            unref(form).errors.name ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-danger"
                            }, toDisplayString(unref(form).errors.phone), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "form-group" }, [
                            createVNode("label", { for: "message" }, "Message"),
                            withDirectives(createVNode("textarea", {
                              name: "message",
                              "onUpdate:modelValue": ($event) => unref(form).message = $event,
                              id: "message",
                              required: "",
                              maxlength: "100"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).message]
                            ]),
                            unref(form).errors.name ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-danger"
                            }, toDisplayString(unref(form).errors.message), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("button", {
                            type: "submit",
                            class: "flex gap-2 justify-center",
                            disabled: unref(form).processing
                          }, [
                            unref(form).processing ? (openBlock(), createBlock("i", {
                              key: 0,
                              class: "fa fa-circle-o-notch fa-spin"
                            })) : createCommentVNode("", true),
                            createVNode("span", null, "Send")
                          ], 8, ["disabled"])
                        ], 40, ["onSubmit"])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Contact.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$n
}, Symbol.toStringTag, { value: "Module" }));
const useGloabalState = defineStore("GLOBAL", () => {
  const recommendedProducts = ref([]);
  function setRecommendedProducts(data) {
    recommendedProducts.value = data;
  }
  return {
    recommendedProducts,
    setRecommendedProducts
  };
});
const _sfc_main$m = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: ["recentOrders"],
  setup(__props) {
    const globals = useGloabalState();
    const props = __props;
    const recommendedProducts = ref(globals.recommendedProducts ?? []);
    async function getrecommendedProducts() {
      var _a;
      if ((_a = recommendedProducts.value) == null ? void 0 : _a.length) return;
      try {
        const { data } = await API.get("recommended-products");
        recommendedProducts.value = data;
        globals.setRecommendedProducts(data);
      } catch (error) {
        console.log("faild to get recommended products!");
        getrecommendedProducts();
      }
    }
    getrecommendedProducts();
    const stats = ref({
      recentOrders: props.recentOrders,
      wishlistItems: 8
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AuthenticatedLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-gradient-to-r from-[#ff2832]/10 to-[#e6e3de]/20 rounded-xl p-6 shadow-sm"${_scopeId}><div class="flex flex-col md:flex-row md:items-center md:justify-between"${_scopeId}><div${_scopeId}><h2 class="text-xl font-bold text-[#444444]"${_scopeId}> Welcome back, ${ssrInterpolate(_ctx.$page.props.auth.user.name)}! </h2><p class="text-[#444444]/80 mt-1"${_scopeId}></p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/shop",
              class: "mt-4 md:mt-0 bg-[#ff2832] hover:bg-[#ff2832]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Start Shopping `);
                } else {
                  return [
                    createTextVNode(" Start Shopping ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6"${_scopeId}><div class="bg-white rounded-xl shadow-sm p-6"${_scopeId}><div class="flex items-center"${_scopeId}><div class="p-3 rounded-lg bg-[#ff2832]/10 text-[#ff2832]"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"${_scopeId}></path></svg></div><div class="ml-4"${_scopeId}><p class="text-sm text-[#444444]/60"${_scopeId}>Recent Orders</p><p class="text-xl font-semibold text-[#444444]"${_scopeId}>${ssrInterpolate(stats.value.recentOrders)}</p></div></div></div><div class="bg-white rounded-xl shadow-sm p-6"${_scopeId}><div class="flex items-center"${_scopeId}><div class="p-3 rounded-lg bg-[#ff2832]/10 text-[#ff2832]"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"${_scopeId}></path></svg></div><div class="ml-4"${_scopeId}><p class="text-sm text-[#444444]/60"${_scopeId}>Wishlist Items</p><p class="text-xl font-semibold text-[#444444]"${_scopeId}>${ssrInterpolate(stats.value.wishlistItems)}</p></div></div></div></div><div class="bg-white rounded-xl shadow-sm overflow-hidden"${_scopeId}><div class="p-6 border-b border-[#e6e3de]"${_scopeId}><h3 class="text-lg font-medium text-[#444444]"${_scopeId}>Recommended For You</h3></div><div class="grid grid-cols-3 gap-6 p-6"${_scopeId}><!--[-->`);
            ssrRenderList(recommendedProducts.value, (product) => {
              _push2(`<div class="group"${_scopeId}><div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-[#e6e3de]/30"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/products/${product.slug}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a, _b;
                  if (_push3) {
                    _push3(`<img${ssrRenderAttr("src", `/assets/images/products/${(_a = product.images) == null ? void 0 : _a.split(",")[0]}`)}${ssrRenderAttr("alt", product.name)} class="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"${_scopeId2}>`);
                  } else {
                    return [
                      createVNode("img", {
                        src: `/assets/images/products/${(_b = product.images) == null ? void 0 : _b.split(",")[0]}`,
                        alt: product.name,
                        class: "h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                      }, null, 8, ["src", "alt"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><div class="mt-2"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/products/${product.slug}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a, _b;
                  if (_push3) {
                    _push3(`<p class="text-sm text-[#444444]/80"${_scopeId2}>${ssrInterpolate(((_a = product.category) == null ? void 0 : _a.name) ?? "_")}</p>`);
                  } else {
                    return [
                      createVNode("p", { class: "text-sm text-[#444444]/80" }, toDisplayString(((_b = product.category) == null ? void 0 : _b.name) ?? "_"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<h4 class="font-medium text-[#444444] group-hover:text-[#ff2832] transition-colors duration-200"${_scopeId}>${ssrInterpolate(product.name)}</h4><p class="text-[#ff2832] text-lg font-bold mt-1"${_scopeId}>$${ssrInterpolate(product.price)}</p></div></div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-gradient-to-r from-[#ff2832]/10 to-[#e6e3de]/20 rounded-xl p-6 shadow-sm" }, [
                createVNode("div", { class: "flex flex-col md:flex-row md:items-center md:justify-between" }, [
                  createVNode("div", null, [
                    createVNode("h2", { class: "text-xl font-bold text-[#444444]" }, " Welcome back, " + toDisplayString(_ctx.$page.props.auth.user.name) + "! ", 1),
                    createVNode("p", { class: "text-[#444444]/80 mt-1" })
                  ]),
                  createVNode(unref(Link), {
                    href: "/shop",
                    class: "mt-4 md:mt-0 bg-[#ff2832] hover:bg-[#ff2832]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Start Shopping ")
                    ]),
                    _: 1
                  })
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6" }, [
                createVNode("div", { class: "bg-white rounded-xl shadow-sm p-6" }, [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode("div", { class: "p-3 rounded-lg bg-[#ff2832]/10 text-[#ff2832]" }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "h-6 w-6",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        })
                      ]))
                    ]),
                    createVNode("div", { class: "ml-4" }, [
                      createVNode("p", { class: "text-sm text-[#444444]/60" }, "Recent Orders"),
                      createVNode("p", { class: "text-xl font-semibold text-[#444444]" }, toDisplayString(stats.value.recentOrders), 1)
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-sm p-6" }, [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode("div", { class: "p-3 rounded-lg bg-[#ff2832]/10 text-[#ff2832]" }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "h-6 w-6",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        })
                      ]))
                    ]),
                    createVNode("div", { class: "ml-4" }, [
                      createVNode("p", { class: "text-sm text-[#444444]/60" }, "Wishlist Items"),
                      createVNode("p", { class: "text-xl font-semibold text-[#444444]" }, toDisplayString(stats.value.wishlistItems), 1)
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "bg-white rounded-xl shadow-sm overflow-hidden" }, [
                createVNode("div", { class: "p-6 border-b border-[#e6e3de]" }, [
                  createVNode("h3", { class: "text-lg font-medium text-[#444444]" }, "Recommended For You")
                ]),
                createVNode("div", { class: "grid grid-cols-3 gap-6 p-6" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(recommendedProducts.value, (product) => {
                    return openBlock(), createBlock("div", {
                      key: product.id,
                      class: "group"
                    }, [
                      createVNode("div", { class: "aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-[#e6e3de]/30" }, [
                        createVNode(unref(Link), {
                          href: `/products/${product.slug}`
                        }, {
                          default: withCtx(() => {
                            var _a;
                            return [
                              createVNode("img", {
                                src: `/assets/images/products/${(_a = product.images) == null ? void 0 : _a.split(",")[0]}`,
                                alt: product.name,
                                class: "h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                              }, null, 8, ["src", "alt"])
                            ];
                          }),
                          _: 2
                        }, 1032, ["href"])
                      ]),
                      createVNode("div", { class: "mt-2" }, [
                        createVNode(unref(Link), {
                          href: `/products/${product.slug}`
                        }, {
                          default: withCtx(() => {
                            var _a;
                            return [
                              createVNode("p", { class: "text-sm text-[#444444]/80" }, toDisplayString(((_a = product.category) == null ? void 0 : _a.name) ?? "_"), 1)
                            ];
                          }),
                          _: 2
                        }, 1032, ["href"]),
                        createVNode("h4", { class: "font-medium text-[#444444] group-hover:text-[#ff2832] transition-colors duration-200" }, toDisplayString(product.name), 1),
                        createVNode("p", { class: "text-[#ff2832] text-lg font-bold mt-1" }, "$" + toDisplayString(product.price), 1)
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Dashboard.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$m
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$l = {
  __name: "Order",
  __ssrInlineRender: true,
  props: ["orders"],
  setup(__props) {
    const props = __props;
    const orders = ref(props.orders.data);
    const paginate = ref({ ...props.orders, data: void 0 });
    const paginateOrders = async (url) => {
      const b = new URL(url);
      try {
        const { data } = await API.get("get-orders", { params: { page: b.searchParams.get("page") } });
        orders.value = data.data;
        paginate.value = { ...data, data: void 0 };
      } catch (error) {
      }
    };
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const filteredOrders = computed(() => {
      let result = orders.value;
      if (statusFilter.value !== "all") {
        result = result.filter((order) => order.status === statusFilter.value);
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((order) => {
          var _a;
          return order.id.toLowerCase().includes(query) || ((_a = order.items) == null ? void 0 : _a.some((item) => item.name.toLowerCase().includes(query)));
        });
      }
      return result;
    });
    const statusClasses = (status) => {
      return {
        "bg-green-100 text-green-800": status === "delivered",
        "bg-yellow-100 text-yellow-800": status === "pending",
        "bg-blue-100 text-blue-800": status === "shipped",
        "bg-red-100 text-red-800": status === "cancelled"
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AuthenticatedLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-white rounded-xl shadow-sm p-6" data-v-fc195e38${_scopeId}><div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4" data-v-fc195e38${_scopeId}><div class="flex-1" data-v-fc195e38${_scopeId}><label for="search" class="sr-only" data-v-fc195e38${_scopeId}>Search orders</label><div class="relative" data-v-fc195e38${_scopeId}><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-v-fc195e38${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#444444]/50" viewBox="0 0 20 20" fill="currentColor" data-v-fc195e38${_scopeId}><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" data-v-fc195e38${_scopeId}></path></svg></div><input id="search"${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Search orders..." class="pl-10 block w-full pr-3 py-2 border border-[#e6e3de] rounded-md shadow-sm placeholder-[#444444]/40 focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-fc195e38${_scopeId}></div></div><div class="flex-shrink-0" data-v-fc195e38${_scopeId}><select class="block w-full pl-3 pr-10 py-2 text-base border border-[#e6e3de] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200" data-v-fc195e38${_scopeId}><option value="all" data-v-fc195e38${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "all") : ssrLooseEqual(statusFilter.value, "all")) ? " selected" : ""}${_scopeId}>All Statuses</option><option value="processing" data-v-fc195e38${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "processing") : ssrLooseEqual(statusFilter.value, "processing")) ? " selected" : ""}${_scopeId}>Processing</option><option value="shipped" data-v-fc195e38${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "shipped") : ssrLooseEqual(statusFilter.value, "shipped")) ? " selected" : ""}${_scopeId}>Shipped</option><option value="delivered" data-v-fc195e38${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "delivered") : ssrLooseEqual(statusFilter.value, "delivered")) ? " selected" : ""}${_scopeId}>Delivered</option><option value="cancelled" data-v-fc195e38${ssrIncludeBooleanAttr(Array.isArray(statusFilter.value) ? ssrLooseContain(statusFilter.value, "cancelled") : ssrLooseEqual(statusFilter.value, "cancelled")) ? " selected" : ""}${_scopeId}>Cancelled</option></select></div></div></div><div class="bg-white rounded-xl shadow-sm overflow-hidden" data-v-fc195e38${_scopeId}><div class="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f8f8] border-b border-[#e6e3de] text-sm font-medium text-[#444444]/80" data-v-fc195e38${_scopeId}><div class="col-span-3" data-v-fc195e38${_scopeId}>Order</div><div class="col-span-3" data-v-fc195e38${_scopeId}>Date</div><div class="col-span-2" data-v-fc195e38${_scopeId}>Total</div><div class="col-span-2" data-v-fc195e38${_scopeId}>Status</div><div class="col-span-2" data-v-fc195e38${_scopeId}>Actions</div></div><div class="divide-y divide-[#e6e3de]" data-v-fc195e38${_scopeId}><!--[-->`);
            ssrRenderList(filteredOrders.value, (order) => {
              _push2(`<div class="p-6 hover:bg-[#f8f8f8] transition-colors duration-150" data-v-fc195e38${_scopeId}><div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center" data-v-fc195e38${_scopeId}><div class="md:hidden flex justify-between items-center" data-v-fc195e38${_scopeId}><span class="text-sm text-[#444444]/60" data-v-fc195e38${_scopeId}>Order</span><span class="font-medium text-[#444444]" data-v-fc195e38${_scopeId}>#${ssrInterpolate(order.id)}</span></div><div class="hidden md:block col-span-3" data-v-fc195e38${_scopeId}><p class="mb-0 font-medium text-[#444444]" data-v-fc195e38${_scopeId}>#${ssrInterpolate(order.id)}</p><p class="mb-0 text-sm text-[#444444]/60 mt-1" data-v-fc195e38${_scopeId}>${ssrInterpolate(order.items_count)} items</p></div><div class="md:col-span-3" data-v-fc195e38${_scopeId}><div class="md:hidden flex justify-between items-center" data-v-fc195e38${_scopeId}><span class="text-sm text-[#444444]/60" data-v-fc195e38${_scopeId}>Date</span><span class="text-[#444444]" data-v-fc195e38${_scopeId}>${ssrInterpolate(new Date(order.created_at).toDateString())}</span></div><div class="hidden md:block" data-v-fc195e38${_scopeId}><p class="mb-0 text-[#444444]" data-v-fc195e38${_scopeId}>${ssrInterpolate(new Date(order.created_at).toDateString())}</p></div></div><div class="md:col-span-2" data-v-fc195e38${_scopeId}><div class="md:hidden flex items-center" data-v-fc195e38${_scopeId}><span class="text-sm text-[#444444]/60" data-v-fc195e38${_scopeId}>Total</span><span class="font-medium text-[#444444]" data-v-fc195e38${_scopeId}>${ssrInterpolate(order.total)}</span></div><div class="hidden md:block md:text-left" data-v-fc195e38${_scopeId}><p class="mb-0 font-medium text-[#444444]" data-v-fc195e38${_scopeId}>${ssrInterpolate(order.total)}</p></div></div><div class="md:col-span-2" data-v-fc195e38${_scopeId}><div class="flex justify-end md:justify-start" data-v-fc195e38${_scopeId}><span class="${ssrRenderClass([statusClasses(order.status), "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"])}" data-v-fc195e38${_scopeId}>${ssrInterpolate(order.status)}</span></div></div><div class="md:col-span-2" data-v-fc195e38${_scopeId}><div class="flex" data-v-fc195e38${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `orders/${order.id}`,
                class: "text-nowrap text-sm font-medium text-[#fff] bg-[#ff2832]/90 px-3 py-2 rounded-md cursor-pointer hover:bg-[#ff2832]/80 transition-colors duration-200 flex items-center"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` View Details `);
                  } else {
                    return [
                      createTextVNode(" View Details ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div></div></div>`);
            });
            _push2(`<!--]--></div><div class="px-6 py-4 border-t border-[#e6e3de] flex items-center justify-between" data-v-fc195e38${_scopeId}><div class="sm:flex-1 sm:flex sm:items-center sm:justify-between" data-v-fc195e38${_scopeId}><div data-v-fc195e38${_scopeId}><p class="mb-0 text-sm text-[#444444]" data-v-fc195e38${_scopeId}> Showing <span class="font-medium" data-v-fc195e38${_scopeId}>${ssrInterpolate(paginate.value.current_page)}</span> to <span class="font-medium" data-v-fc195e38${_scopeId}>${ssrInterpolate(paginate.value.links.length - 2)}</span> of <span class="font-medium" data-v-fc195e38${_scopeId}>${ssrInterpolate(paginate.value.total)}</span> results </p></div><div data-v-fc195e38${_scopeId}><nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination" data-v-fc195e38${_scopeId}><!--[-->`);
            ssrRenderList(paginate.value.links, (link, index) => {
              _push2(`<button${ssrRenderAttr("aria-current", link.active ? "page" : void 0)} class="${ssrRenderClass([
                link.active ? "z-10 bg-[#ddd] border-[#ff2832]/50 text-[#ff2832]" : "text-[#444444] hover:bg-[#e6e3de]/30",
                "relative inline-flex items-center px-4 py-2 border border-[#e6e3de] bg-white text-sm font-medium"
              ])}" data-v-fc195e38${_scopeId}>${link.label ?? ""}</button>`);
            });
            _push2(`<!--]--></nav></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-white rounded-xl shadow-sm p-6" }, [
                createVNode("div", { class: "flex flex-col md:flex-row md:items-center md:justify-between gap-4" }, [
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("label", {
                      for: "search",
                      class: "sr-only"
                    }, "Search orders"),
                    createVNode("div", { class: "relative" }, [
                      createVNode("div", { class: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" }, [
                        (openBlock(), createBlock("svg", {
                          xmlns: "http://www.w3.org/2000/svg",
                          class: "h-5 w-5 text-[#444444]/50",
                          viewBox: "0 0 20 20",
                          fill: "currentColor"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z",
                            "clip-rule": "evenodd"
                          })
                        ]))
                      ]),
                      withDirectives(createVNode("input", {
                        id: "search",
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                        type: "text",
                        placeholder: "Search orders...",
                        class: "pl-10 block w-full pr-3 py-2 border border-[#e6e3de] rounded-md shadow-sm placeholder-[#444444]/40 focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, searchQuery.value]
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex-shrink-0" }, [
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                      class: "block w-full pl-3 pr-10 py-2 text-base border border-[#e6e3de] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2832]/50 focus:border-[#ff2832]/50 transition-all duration-200"
                    }, [
                      createVNode("option", { value: "all" }, "All Statuses"),
                      createVNode("option", { value: "processing" }, "Processing"),
                      createVNode("option", { value: "shipped" }, "Shipped"),
                      createVNode("option", { value: "delivered" }, "Delivered"),
                      createVNode("option", { value: "cancelled" }, "Cancelled")
                    ], 8, ["onUpdate:modelValue"]), [
                      [vModelSelect, statusFilter.value]
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "bg-white rounded-xl shadow-sm overflow-hidden" }, [
                createVNode("div", { class: "hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#f8f8f8] border-b border-[#e6e3de] text-sm font-medium text-[#444444]/80" }, [
                  createVNode("div", { class: "col-span-3" }, "Order"),
                  createVNode("div", { class: "col-span-3" }, "Date"),
                  createVNode("div", { class: "col-span-2" }, "Total"),
                  createVNode("div", { class: "col-span-2" }, "Status"),
                  createVNode("div", { class: "col-span-2" }, "Actions")
                ]),
                createVNode("div", { class: "divide-y divide-[#e6e3de]" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(filteredOrders.value, (order) => {
                    return openBlock(), createBlock("div", {
                      key: order.id,
                      class: "p-6 hover:bg-[#f8f8f8] transition-colors duration-150"
                    }, [
                      createVNode("div", { class: "grid grid-cols-1 md:grid-cols-12 gap-4 items-center" }, [
                        createVNode("div", { class: "md:hidden flex justify-between items-center" }, [
                          createVNode("span", { class: "text-sm text-[#444444]/60" }, "Order"),
                          createVNode("span", { class: "font-medium text-[#444444]" }, "#" + toDisplayString(order.id), 1)
                        ]),
                        createVNode("div", { class: "hidden md:block col-span-3" }, [
                          createVNode("p", { class: "mb-0 font-medium text-[#444444]" }, "#" + toDisplayString(order.id), 1),
                          createVNode("p", { class: "mb-0 text-sm text-[#444444]/60 mt-1" }, toDisplayString(order.items_count) + " items", 1)
                        ]),
                        createVNode("div", { class: "md:col-span-3" }, [
                          createVNode("div", { class: "md:hidden flex justify-between items-center" }, [
                            createVNode("span", { class: "text-sm text-[#444444]/60" }, "Date"),
                            createVNode("span", { class: "text-[#444444]" }, toDisplayString(new Date(order.created_at).toDateString()), 1)
                          ]),
                          createVNode("div", { class: "hidden md:block" }, [
                            createVNode("p", { class: "mb-0 text-[#444444]" }, toDisplayString(new Date(order.created_at).toDateString()), 1)
                          ])
                        ]),
                        createVNode("div", { class: "md:col-span-2" }, [
                          createVNode("div", { class: "md:hidden flex items-center" }, [
                            createVNode("span", { class: "text-sm text-[#444444]/60" }, "Total"),
                            createVNode("span", { class: "font-medium text-[#444444]" }, toDisplayString(order.total), 1)
                          ]),
                          createVNode("div", { class: "hidden md:block md:text-left" }, [
                            createVNode("p", { class: "mb-0 font-medium text-[#444444]" }, toDisplayString(order.total), 1)
                          ])
                        ]),
                        createVNode("div", { class: "md:col-span-2" }, [
                          createVNode("div", { class: "flex justify-end md:justify-start" }, [
                            createVNode("span", {
                              class: ["inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", statusClasses(order.status)]
                            }, toDisplayString(order.status), 3)
                          ])
                        ]),
                        createVNode("div", { class: "md:col-span-2" }, [
                          createVNode("div", { class: "flex" }, [
                            createVNode(unref(Link), {
                              href: `orders/${order.id}`,
                              class: "text-nowrap text-sm font-medium text-[#fff] bg-[#ff2832]/90 px-3 py-2 rounded-md cursor-pointer hover:bg-[#ff2832]/80 transition-colors duration-200 flex items-center"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" View Details ")
                              ]),
                              _: 2
                            }, 1032, ["href"])
                          ])
                        ])
                      ])
                    ]);
                  }), 128))
                ]),
                createVNode("div", { class: "px-6 py-4 border-t border-[#e6e3de] flex items-center justify-between" }, [
                  createVNode("div", { class: "sm:flex-1 sm:flex sm:items-center sm:justify-between" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "mb-0 text-sm text-[#444444]" }, [
                        createTextVNode(" Showing "),
                        createVNode("span", { class: "font-medium" }, toDisplayString(paginate.value.current_page), 1),
                        createTextVNode(" to "),
                        createVNode("span", { class: "font-medium" }, toDisplayString(paginate.value.links.length - 2), 1),
                        createTextVNode(" of "),
                        createVNode("span", { class: "font-medium" }, toDisplayString(paginate.value.total), 1),
                        createTextVNode(" results ")
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("nav", {
                        class: "relative z-0 inline-flex rounded-md shadow-sm -space-x-px",
                        "aria-label": "Pagination"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(paginate.value.links, (link, index) => {
                          return openBlock(), createBlock("button", {
                            key: index,
                            onClick: ($event) => paginateOrders(link.url),
                            "aria-current": link.active ? "page" : void 0,
                            class: [
                              "relative inline-flex items-center px-4 py-2 border border-[#e6e3de] bg-white text-sm font-medium",
                              link.active ? "z-10 bg-[#ddd] border-[#ff2832]/50 text-[#ff2832]" : "text-[#444444] hover:bg-[#e6e3de]/30"
                            ],
                            innerHTML: link.label
                          }, null, 10, ["onClick", "aria-current", "innerHTML"]);
                        }), 128))
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Order.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const Order = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-fc195e38"]]);
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Order
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$k = {
  __name: "OrderConfirmation",
  __ssrInlineRender: true,
  props: ["order"],
  setup(__props) {
    const props = __props;
    const order = ref(props.order);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8" data-v-9ac8f2f6${_scopeId}><div class="max-w-3xl mx-auto" data-v-9ac8f2f6${_scopeId}><div class="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg" data-v-9ac8f2f6${_scopeId}><div class="p-8" data-v-9ac8f2f6${_scopeId}><div class="flex items-center justify-center mb-6" data-v-9ac8f2f6${_scopeId}><div class="rounded-full bg-[#ff2832]/10 p-4" data-v-9ac8f2f6${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[#ff2832]" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-9ac8f2f6${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-v-9ac8f2f6${_scopeId}></path></svg></div></div><h1 class="text-3xl font-bold text-center text-[#444444] mb-4" data-v-9ac8f2f6${_scopeId}>Order Confirmed!</h1><p class="text-center text-[#444444]/80 mb-6" data-v-9ac8f2f6${_scopeId}> Thank you for your purchase. Your order <span class="font-semibold text-[#ff2832]" data-v-9ac8f2f6${_scopeId}>#${ssrInterpolate(order.value.id)}</span> has been received and is being processed. </p><div class="bg-[#e6e3de]/30 px-4 py-2 rounded-lg border border-[#e6e3de]" data-v-9ac8f2f6${_scopeId}><h3 class="font-medium text-[#444444] mb-4" data-v-9ac8f2f6${_scopeId}>Order Summary</h3><div class="mb-2 flex justify-between text-sm text-[#444444]/80" data-v-9ac8f2f6${_scopeId}><span data-v-9ac8f2f6${_scopeId}>Date:</span><span data-v-9ac8f2f6${_scopeId}>${ssrInterpolate(new Date(order.value.created_at).toDateString())}</span></div><div class="mb-2 flex justify-between text-sm text-[#444444]/80" data-v-9ac8f2f6${_scopeId}><span data-v-9ac8f2f6${_scopeId}>Total:</span><span class="font-medium" data-v-9ac8f2f6${_scopeId}>$${ssrInterpolate(Number(order.value.total).toFixed(2))}</span></div><div class="mb-3 flex justify-between text-sm text-[#444444]/80" data-v-9ac8f2f6${_scopeId}><span data-v-9ac8f2f6${_scopeId}>Payment Status:</span><span data-v-9ac8f2f6${_scopeId}>(${ssrInterpolate(order.value.paymentStatus)})</span></div></div></div></div><div class="mt-8 flex flex-col sm:flex-row gap-4" data-v-9ac8f2f6${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/account/orders",
              class: "flex-1 bg-[#444444] hover:bg-[#ddd] text-white hover:text-black py-3 px-4 text-center font-medium transition-colors duration-200"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` View All Orders `);
                } else {
                  return [
                    createTextVNode(" View All Orders ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/shop",
              class: "flex-1 bg-white border border-[#e6e3de] hover:bg-[#ff2832] hover text-[#444444] hover:text-white py-3 px-4 text-center font-medium transition-colors duration-200 shadow-sm"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Continue Shopping `);
                } else {
                  return [
                    createTextVNode(" Continue Shopping ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-[#f5f5f5] py-12 px-4 sm:px-6 lg:px-8" }, [
                createVNode("div", { class: "max-w-3xl mx-auto" }, [
                  createVNode("div", { class: "bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg" }, [
                    createVNode("div", { class: "p-8" }, [
                      createVNode("div", { class: "flex items-center justify-center mb-6" }, [
                        createVNode("div", { class: "rounded-full bg-[#ff2832]/10 p-4" }, [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            class: "h-16 w-16 text-[#ff2832]",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            })
                          ]))
                        ])
                      ]),
                      createVNode("h1", { class: "text-3xl font-bold text-center text-[#444444] mb-4" }, "Order Confirmed!"),
                      createVNode("p", { class: "text-center text-[#444444]/80 mb-6" }, [
                        createTextVNode(" Thank you for your purchase. Your order "),
                        createVNode("span", { class: "font-semibold text-[#ff2832]" }, "#" + toDisplayString(order.value.id), 1),
                        createTextVNode(" has been received and is being processed. ")
                      ]),
                      createVNode("div", { class: "bg-[#e6e3de]/30 px-4 py-2 rounded-lg border border-[#e6e3de]" }, [
                        createVNode("h3", { class: "font-medium text-[#444444] mb-4" }, "Order Summary"),
                        createVNode("div", { class: "mb-2 flex justify-between text-sm text-[#444444]/80" }, [
                          createVNode("span", null, "Date:"),
                          createVNode("span", null, toDisplayString(new Date(order.value.created_at).toDateString()), 1)
                        ]),
                        createVNode("div", { class: "mb-2 flex justify-between text-sm text-[#444444]/80" }, [
                          createVNode("span", null, "Total:"),
                          createVNode("span", { class: "font-medium" }, "$" + toDisplayString(Number(order.value.total).toFixed(2)), 1)
                        ]),
                        createVNode("div", { class: "mb-3 flex justify-between text-sm text-[#444444]/80" }, [
                          createVNode("span", null, "Payment Status:"),
                          createVNode("span", null, "(" + toDisplayString(order.value.paymentStatus) + ")", 1)
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "mt-8 flex flex-col sm:flex-row gap-4" }, [
                    createVNode(unref(Link), {
                      href: "/account/orders",
                      class: "flex-1 bg-[#444444] hover:bg-[#ddd] text-white hover:text-black py-3 px-4 text-center font-medium transition-colors duration-200"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" View All Orders ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Link), {
                      href: "/shop",
                      class: "flex-1 bg-white border border-[#e6e3de] hover:bg-[#ff2832] hover text-[#444444] hover:text-white py-3 px-4 text-center font-medium transition-colors duration-200 shadow-sm"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Continue Shopping ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/OrderConfirmation.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const OrderConfirmation = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-9ac8f2f6"]]);
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderConfirmation
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$j = {
  __name: "OrderDetails",
  __ssrInlineRender: true,
  props: ["order"],
  setup(__props) {
    const billingData = ref(null);
    onMounted(() => {
      console.log(billingData.value);
    });
    const statusMessages = {
      pending: {
        title: "Order Processing",
        message: "Your order is being prepared for shipment"
      },
      shipped: {
        title: "Order Shipped",
        message: "Your order is on the way"
      },
      delivered: {
        title: "Order Delivered",
        message: "Your order has been delivered"
      },
      cancelled: {
        title: "Order Cancelled",
        message: "Your order has been cancelled"
      }
    };
    const getImage = (item) => {
      const path = "/assets/images/products/";
      if (item.variant) {
        return path + item.variant.images.split(",")[0];
      }
      return path + item.product.images.split(",")[0];
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount);
    };
    const variantAttributes = (variant) => {
      const { id, images, SKU, ...rest } = variant;
      return Object.entries(rest);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AuthenticatedLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            if (__props.order.status !== "delivered") {
              _push2(`<div class="rounded-md bg-[#ff2832]/10 p-4" data-v-e734b93b${_scopeId}><div class="flex" data-v-e734b93b${_scopeId}><div class="flex-shrink-0" data-v-e734b93b${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#ff2832]" viewBox="0 0 20 20" fill="currentColor" data-v-e734b93b${_scopeId}><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" data-v-e734b93b${_scopeId}></path></svg></div><div class="ml-3" data-v-e734b93b${_scopeId}><h3 class="text-sm my-0 font-medium text-[#ff2832]" data-v-e734b93b${_scopeId}>${ssrInterpolate(((_a = statusMessages[__props.order.status]) == null ? void 0 : _a.title) || "Order Processing")}</h3><div class="mt-2 text-sm text-[#ff2832]/80" data-v-e734b93b${_scopeId}><p data-v-e734b93b${_scopeId}>${ssrInterpolate(((_b = statusMessages[__props.order.status]) == null ? void 0 : _b.message) || "Your order is being processed")}</p></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-white rounded-xl shadow-sm overflow-hidden" data-v-e734b93b${_scopeId}><div class="p-6 border-b border-[#e6e3de]" data-v-e734b93b${_scopeId}><h2 class="text-lg font-medium text-[#444444]" data-v-e734b93b${_scopeId}>Order Summary</h2></div><div class="divide-y divide-[#e6e3de]" data-v-e734b93b${_scopeId}><!--[-->`);
            ssrRenderList(__props.order.items, (item) => {
              _push2(`<div class="p-6" data-v-e734b93b${_scopeId}><div class="flex flex-col sm:flex-row gap-2" data-v-e734b93b${_scopeId}><div class="flex-shrink-0" data-v-e734b93b${_scopeId}><img${ssrRenderAttr("src", getImage(item))}${ssrRenderAttr("alt", item.product.name)} class="w-20 h-20 rounded-md object-cover" data-v-e734b93b${_scopeId}></div><div class="sm:mt-0 sm:ml-6 flex-1" data-v-e734b93b${_scopeId}><div class="flex items-start justify-between" data-v-e734b93b${_scopeId}><div data-v-e734b93b${_scopeId}><h4 class="text-sm font-medium text-[#444444]" data-v-e734b93b${_scopeId}>${ssrInterpolate(item.product.name)}</h4>`);
              if (item.variant) {
                _push2(`<p class="mt-1 text-sm text-[#444444]/60" data-v-e734b93b${_scopeId}><!--[-->`);
                ssrRenderList(variantAttributes(item.variant), ([attr, value]) => {
                  _push2(`<span class="d-block" data-v-e734b93b${_scopeId}><strong data-v-e734b93b${_scopeId}>${ssrInterpolate(attr)}</strong>: ${ssrInterpolate(value)}</span>`);
                });
                _push2(`<!--]--></p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><p class="text-sm font-medium text-[#444444] ml-4" data-v-e734b93b${_scopeId}>${ssrInterpolate(formatCurrency(item.price))}</p></div><div class="mt-2 flex items-center justify-between" data-v-e734b93b${_scopeId}><p class="text-sm text-[#444444]/60" data-v-e734b93b${_scopeId}> Qty: ${ssrInterpolate(item.qty)}</p><p class="text-sm font-medium text-[#444444]" data-v-e734b93b${_scopeId}>${ssrInterpolate(formatCurrency(item.price * item.qty))}</p></div></div></div></div>`);
            });
            _push2(`<!--]--></div><div class="p-6 border-t border-[#e6e3de]" data-v-e734b93b${_scopeId}><div class="space-y-4" data-v-e734b93b${_scopeId}><div class="flex justify-between text-sm text-[#444444]" data-v-e734b93b${_scopeId}><span data-v-e734b93b${_scopeId}>Subtotal</span><span data-v-e734b93b${_scopeId}>${ssrInterpolate(formatCurrency(__props.order.subTotal))}</span></div><div class="flex justify-between text-sm text-[#444444]" data-v-e734b93b${_scopeId}><span data-v-e734b93b${_scopeId}>Shipping</span><span data-v-e734b93b${_scopeId}>${ssrInterpolate(formatCurrency(__props.order.shipCost))}</span></div><div class="flex justify-between text-sm text-[#444444]" data-v-e734b93b${_scopeId}><span data-v-e734b93b${_scopeId}>Tax</span><span data-v-e734b93b${_scopeId}>${ssrInterpolate(formatCurrency(__props.order.tax))}</span></div><div class="flex justify-between text-base font-medium text-[#444444] pt-2 border-t border-[#e6e3de] mt-2" data-v-e734b93b${_scopeId}><span data-v-e734b93b${_scopeId}>Total</span><span data-v-e734b93b${_scopeId}>${ssrInterpolate(formatCurrency(__props.order.total))}</span></div></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-v-e734b93b${_scopeId}><div class="bg-white rounded-xl shadow-sm overflow-hidden" data-v-e734b93b${_scopeId}><div class="p-6 border-b border-[#e6e3de]" data-v-e734b93b${_scopeId}><h2 class="text-lg font-medium text-[#444444]" data-v-e734b93b${_scopeId}>Shipping Information</h2></div><div class="p-6" data-v-e734b93b${_scopeId}>`);
            if (__props.order.shipping) {
              _push2(`<div class="text-sm text-[#444444] space-y-2" data-v-e734b93b${_scopeId}><p class="font-medium" data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.shipping.name)}</p><p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.shipping.address_1)}</p>`);
              if (__props.order.shipping.address_2) {
                _push2(`<p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.shipping.address_2)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.shipping.city)}, ${ssrInterpolate(__props.order.shipping.state)} ${ssrInterpolate(__props.order.shipping.zip)}</p><p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.shipping.country)}</p><p class="mt-4" data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.shipping.phone)}</p></div>`);
            } else {
              _push2(`<div class="text-sm text-[#444444] space-y-2" data-v-e734b93b${_scopeId}><p class="font-medium" data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.name)}</p><p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.address_1)}</p>`);
              if (__props.order.address_2) {
                _push2(`<p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.address_2)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.city)}, ${ssrInterpolate(__props.order.province)} ${ssrInterpolate(__props.order.zipCode)}</p><p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.country)}</p><p class="mt-4" data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.phone)}</p></div>`);
            }
            _push2(`</div></div><div class="bg-white rounded-xl shadow-sm overflow-hidden" data-v-e734b93b${_scopeId}><div class="p-6 border-b border-[#e6e3de]" data-v-e734b93b${_scopeId}><h2 class="text-lg font-medium text-[#444444]" data-v-e734b93b${_scopeId}>Payment Information</h2></div><div class="p-6" data-v-e734b93b${_scopeId}><div class="flex items-center" data-v-e734b93b${_scopeId}><div class="flex-shrink-0" data-v-e734b93b${_scopeId}><div class="h-10 w-16 rounded-md bg-[#e6e3de]/30 flex items-center justify-center" data-v-e734b93b${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="{1.5}" stroke="currentColor" className="size-6" data-v-e734b93b${_scopeId}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" data-v-e734b93b${_scopeId}></path></svg></div></div><div class="ml-4" data-v-e734b93b${_scopeId}><h4 class="text-sm font-medium text-[#444444]" data-v-e734b93b${_scopeId}>${ssrInterpolate("credit".toUpperCase())} ending in 24564 </h4><p class="text-sm text-[#444444]/60 mt-1" data-v-e734b93b${_scopeId}> Expires 11/28 </p></div></div><div class="mt-6" data-v-e734b93b${_scopeId}><h3 class="text-sm font-medium text-[#444444]" data-v-e734b93b${_scopeId}>Billing Address</h3><div class="text-sm text-[#444444] mt-1 space-y-1" data-v-e734b93b${_scopeId}><p class="font-medium" data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.name)}</p><p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.address_1)}</p>`);
            if (__props.order.address_2) {
              _push2(`<p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.address_2)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.city)}, ${ssrInterpolate(__props.order.province)} ${ssrInterpolate(__props.order.zipCode)}</p><p data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.country)}</p><p class="mt-4" data-v-e734b93b${_scopeId}>${ssrInterpolate(__props.order.phone)}</p></div></div></div></div></div><div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3" data-v-e734b93b${_scopeId}>`);
            if (__props.order.status === "delivered") {
              _push2(`<button type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200" data-v-e734b93b${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-e734b93b${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-v-e734b93b${_scopeId}></path></svg> Buy Again </button>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.order.status === "delivered") {
              _push2(`<button type="button" class="inline-flex items-center px-4 py-2 border border-[#e6e3de] text-sm font-medium rounded-md shadow-sm text-[#444444] bg-white hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200" data-v-e734b93b${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-e734b93b${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-e734b93b${_scopeId}></path></svg> Get Help </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Link), {
              type: "button",
              class: "inline-flex items-center px-4 py-2 border border-[#e6e3de] text-sm font-medium rounded-md shadow-sm text-[#444444] bg-white hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200",
              href: unref(route$1)("orders.index")
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Back to Orders `);
                } else {
                  return [
                    createTextVNode(" Back to Orders ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              __props.order.status !== "delivered" ? (openBlock(), createBlock("div", {
                key: 0,
                class: "rounded-md bg-[#ff2832]/10 p-4"
              }, [
                createVNode("div", { class: "flex" }, [
                  createVNode("div", { class: "flex-shrink-0" }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      class: "h-5 w-5 text-[#ff2832]",
                      viewBox: "0 0 20 20",
                      fill: "currentColor"
                    }, [
                      createVNode("path", {
                        "fill-rule": "evenodd",
                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z",
                        "clip-rule": "evenodd"
                      })
                    ]))
                  ]),
                  createVNode("div", { class: "ml-3" }, [
                    createVNode("h3", { class: "text-sm my-0 font-medium text-[#ff2832]" }, toDisplayString(((_c = statusMessages[__props.order.status]) == null ? void 0 : _c.title) || "Order Processing"), 1),
                    createVNode("div", { class: "mt-2 text-sm text-[#ff2832]/80" }, [
                      createVNode("p", null, toDisplayString(((_d = statusMessages[__props.order.status]) == null ? void 0 : _d.message) || "Your order is being processed"), 1)
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              createVNode("div", { class: "bg-white rounded-xl shadow-sm overflow-hidden" }, [
                createVNode("div", { class: "p-6 border-b border-[#e6e3de]" }, [
                  createVNode("h2", { class: "text-lg font-medium text-[#444444]" }, "Order Summary")
                ]),
                createVNode("div", { class: "divide-y divide-[#e6e3de]" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.order.items, (item) => {
                    return openBlock(), createBlock("div", {
                      key: item.id,
                      class: "p-6"
                    }, [
                      createVNode("div", { class: "flex flex-col sm:flex-row gap-2" }, [
                        createVNode("div", { class: "flex-shrink-0" }, [
                          createVNode("img", {
                            src: getImage(item),
                            alt: item.product.name,
                            class: "w-20 h-20 rounded-md object-cover"
                          }, null, 8, ["src", "alt"])
                        ]),
                        createVNode("div", { class: "sm:mt-0 sm:ml-6 flex-1" }, [
                          createVNode("div", { class: "flex items-start justify-between" }, [
                            createVNode("div", null, [
                              createVNode("h4", { class: "text-sm font-medium text-[#444444]" }, toDisplayString(item.product.name), 1),
                              item.variant ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "mt-1 text-sm text-[#444444]/60"
                              }, [
                                (openBlock(true), createBlock(Fragment, null, renderList(variantAttributes(item.variant), ([attr, value]) => {
                                  return openBlock(), createBlock("span", { class: "d-block" }, [
                                    createVNode("strong", null, toDisplayString(attr), 1),
                                    createTextVNode(": " + toDisplayString(value), 1)
                                  ]);
                                }), 256))
                              ])) : createCommentVNode("", true)
                            ]),
                            createVNode("p", { class: "text-sm font-medium text-[#444444] ml-4" }, toDisplayString(formatCurrency(item.price)), 1)
                          ]),
                          createVNode("div", { class: "mt-2 flex items-center justify-between" }, [
                            createVNode("p", { class: "text-sm text-[#444444]/60" }, " Qty: " + toDisplayString(item.qty), 1),
                            createVNode("p", { class: "text-sm font-medium text-[#444444]" }, toDisplayString(formatCurrency(item.price * item.qty)), 1)
                          ])
                        ])
                      ])
                    ]);
                  }), 128))
                ]),
                createVNode("div", { class: "p-6 border-t border-[#e6e3de]" }, [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("div", { class: "flex justify-between text-sm text-[#444444]" }, [
                      createVNode("span", null, "Subtotal"),
                      createVNode("span", null, toDisplayString(formatCurrency(__props.order.subTotal)), 1)
                    ]),
                    createVNode("div", { class: "flex justify-between text-sm text-[#444444]" }, [
                      createVNode("span", null, "Shipping"),
                      createVNode("span", null, toDisplayString(formatCurrency(__props.order.shipCost)), 1)
                    ]),
                    createVNode("div", { class: "flex justify-between text-sm text-[#444444]" }, [
                      createVNode("span", null, "Tax"),
                      createVNode("span", null, toDisplayString(formatCurrency(__props.order.tax)), 1)
                    ]),
                    createVNode("div", { class: "flex justify-between text-base font-medium text-[#444444] pt-2 border-t border-[#e6e3de] mt-2" }, [
                      createVNode("span", null, "Total"),
                      createVNode("span", null, toDisplayString(formatCurrency(__props.order.total)), 1)
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [
                createVNode("div", { class: "bg-white rounded-xl shadow-sm overflow-hidden" }, [
                  createVNode("div", { class: "p-6 border-b border-[#e6e3de]" }, [
                    createVNode("h2", { class: "text-lg font-medium text-[#444444]" }, "Shipping Information")
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    __props.order.shipping ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-sm text-[#444444] space-y-2"
                    }, [
                      createVNode("p", { class: "font-medium" }, toDisplayString(__props.order.shipping.name), 1),
                      createVNode("p", null, toDisplayString(__props.order.shipping.address_1), 1),
                      __props.order.shipping.address_2 ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(__props.order.shipping.address_2), 1)) : createCommentVNode("", true),
                      createVNode("p", null, toDisplayString(__props.order.shipping.city) + ", " + toDisplayString(__props.order.shipping.state) + " " + toDisplayString(__props.order.shipping.zip), 1),
                      createVNode("p", null, toDisplayString(__props.order.shipping.country), 1),
                      createVNode("p", { class: "mt-4" }, toDisplayString(__props.order.shipping.phone), 1)
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-sm text-[#444444] space-y-2"
                    }, [
                      createVNode("p", { class: "font-medium" }, toDisplayString(__props.order.name), 1),
                      createVNode("p", null, toDisplayString(__props.order.address_1), 1),
                      __props.order.address_2 ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(__props.order.address_2), 1)) : createCommentVNode("", true),
                      createVNode("p", null, toDisplayString(__props.order.city) + ", " + toDisplayString(__props.order.province) + " " + toDisplayString(__props.order.zipCode), 1),
                      createVNode("p", null, toDisplayString(__props.order.country), 1),
                      createVNode("p", { class: "mt-4" }, toDisplayString(__props.order.phone), 1)
                    ]))
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-xl shadow-sm overflow-hidden" }, [
                  createVNode("div", { class: "p-6 border-b border-[#e6e3de]" }, [
                    createVNode("h2", { class: "text-lg font-medium text-[#444444]" }, "Payment Information")
                  ]),
                  createVNode("div", { class: "p-6" }, [
                    createVNode("div", { class: "flex items-center" }, [
                      createVNode("div", { class: "flex-shrink-0" }, [
                        createVNode("div", { class: "h-10 w-16 rounded-md bg-[#e6e3de]/30 flex items-center justify-center" }, [
                          (openBlock(), createBlock("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            strokeWidth: "{1.5}",
                            stroke: "currentColor",
                            className: "size-6"
                          }, [
                            createVNode("path", {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              d: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                            })
                          ]))
                        ])
                      ]),
                      createVNode("div", { class: "ml-4" }, [
                        createVNode("h4", { class: "text-sm font-medium text-[#444444]" }, toDisplayString("credit".toUpperCase()) + " ending in 24564 ", 1),
                        createVNode("p", { class: "text-sm text-[#444444]/60 mt-1" }, " Expires 11/28 ")
                      ])
                    ]),
                    createVNode("div", { class: "mt-6" }, [
                      createVNode("h3", { class: "text-sm font-medium text-[#444444]" }, "Billing Address"),
                      createVNode("div", { class: "text-sm text-[#444444] mt-1 space-y-1" }, [
                        createVNode("p", { class: "font-medium" }, toDisplayString(__props.order.name), 1),
                        createVNode("p", null, toDisplayString(__props.order.address_1), 1),
                        __props.order.address_2 ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(__props.order.address_2), 1)) : createCommentVNode("", true),
                        createVNode("p", null, toDisplayString(__props.order.city) + ", " + toDisplayString(__props.order.province) + " " + toDisplayString(__props.order.zipCode), 1),
                        createVNode("p", null, toDisplayString(__props.order.country), 1),
                        createVNode("p", { class: "mt-4" }, toDisplayString(__props.order.phone), 1)
                      ])
                    ])
                  ])
                ])
              ]),
              createVNode("div", { class: "flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3" }, [
                __props.order.status === "delivered" ? (openBlock(), createBlock("button", {
                  key: 0,
                  type: "button",
                  class: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "-ml-1 mr-2 h-5 w-5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    })
                  ])),
                  createTextVNode(" Buy Again ")
                ])) : createCommentVNode("", true),
                __props.order.status === "delivered" ? (openBlock(), createBlock("button", {
                  key: 1,
                  type: "button",
                  class: "inline-flex items-center px-4 py-2 border border-[#e6e3de] text-sm font-medium rounded-md shadow-sm text-[#444444] bg-white hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "-ml-1 mr-2 h-5 w-5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    })
                  ])),
                  createTextVNode(" Get Help ")
                ])) : createCommentVNode("", true),
                createVNode(unref(Link), {
                  type: "button",
                  class: "inline-flex items-center px-4 py-2 border border-[#e6e3de] text-sm font-medium rounded-md shadow-sm text-[#444444] bg-white hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200",
                  href: unref(route$1)("orders.index")
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Back to Orders ")
                  ]),
                  _: 1
                }, 8, ["href"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/OrderDetails.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const OrderDetails = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-e734b93b"]]);
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: OrderDetails
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = {
  __name: "PaymentMethodCard",
  __ssrInlineRender: true,
  props: {
    paymentMethod: {
      type: Object,
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  emits: ["set-default", "edit", "delete"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["border border-[#e6e3de] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 relative", { "border-[#ff2832]": __props.isDefault }]
      }, _attrs))} data-v-cd9ee3c3><div class="flex items-start justify-between" data-v-cd9ee3c3><div class="flex items-center" data-v-cd9ee3c3><div class="flex-shrink-0" data-v-cd9ee3c3>`);
      if (__props.paymentMethod.type === "card") {
        _push(`<div class="h-10 w-16 rounded-md bg-[#e6e3de]/30 flex items-center justify-center" data-v-cd9ee3c3><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="{1.5}" stroke="currentColor" className="size-6" data-v-cd9ee3c3><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" data-v-cd9ee3c3></path></svg></div>`);
      } else if (__props.paymentMethod.type === "paypal") {
        _push(`<div class="h-10 w-16 rounded-md bg-[#e6e3de]/30 flex items-center justify-center" data-v-cd9ee3c3><svg class="h-6 w-6 text-[#00457C]" viewBox="0 0 24 24" fill="currentColor" data-v-cd9ee3c3><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm15.147-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.032.175-.056.306-.23 1.888-.892 6.12-1.003 6.85L19.4 15.829l1.61-9.912zm-1.127-3.562c-.202-1.207-.713-2.03-1.608-2.73-.899-.7-2.146-1.15-3.725-1.15h-7.46a.641.641 0 0 0-.633.74l2.108 13.365a.873.873 0 0 0 .862.74h2.98c4.226 0 7.48-1.402 8.742-5.8.452-1.848.528-3.462.252-4.735a4.615 4.615 0 0 0-.518-1.43z" data-v-cd9ee3c3></path></svg></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="ml-4" data-v-cd9ee3c3><h4 class="text-sm font-medium text-[#444444]" data-v-cd9ee3c3>`);
      if (__props.paymentMethod.type === "card") {
        _push(`<span data-v-cd9ee3c3>${ssrInterpolate(__props.paymentMethod.brand.toUpperCase())} ending in ${ssrInterpolate(__props.paymentMethod.last4)}</span>`);
      } else if (__props.paymentMethod.type === "paypal") {
        _push(`<span data-v-cd9ee3c3> PayPal (${ssrInterpolate(__props.paymentMethod.email)}) </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</h4>`);
      if (__props.paymentMethod.type === "card") {
        _push(`<p class="text-sm text-[#444444]/60 mt-1" data-v-cd9ee3c3> Expires ${ssrInterpolate(__props.paymentMethod.exp_month)}/${ssrInterpolate(__props.paymentMethod.exp_year.toString().slice(-2))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex space-x-2" data-v-cd9ee3c3>`);
      if (__props.isDefault) {
        _push(`<div data-v-cd9ee3c3><span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ff2832]/10 text-[#ff2832]" data-v-cd9ee3c3> Default </span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="text-[#444444]/60 hover:text-[#ff2832] transition-colors duration-200" data-v-cd9ee3c3><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" data-v-cd9ee3c3><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" data-v-cd9ee3c3></path></svg></button></div></div><div class="default-badge absolute" data-v-cd9ee3c3>`);
      if (!__props.isDefault) {
        _push(`<button class="text-sm font-medium text-[#ff2832] hover:text-[#ff2832]/80 transition-colors duration-200" data-v-cd9ee3c3> Set Default </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PaymentMethodCard.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const PaymentMethodCard = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-cd9ee3c3"]]);
const _sfc_main$h = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    show: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: "2xl"
    },
    closeable: {
      type: Boolean,
      default: true
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const dialog = ref();
    const showSlot = ref(props.show);
    watch(
      () => props.show,
      () => {
        var _a;
        if (props.show) {
          document.body.style.overflow = "hidden";
          showSlot.value = true;
          (_a = dialog.value) == null ? void 0 : _a.showModal();
        } else {
          document.body.style.overflow = "";
          setTimeout(() => {
            var _a2;
            (_a2 = dialog.value) == null ? void 0 : _a2.close();
            showSlot.value = false;
          }, 200);
        }
      }
    );
    const close = () => {
      if (props.closeable) {
        emit("close");
      }
    };
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (props.show) {
          close();
        }
      }
    };
    onMounted(() => document.addEventListener("keydown", closeOnEscape));
    onUnmounted(() => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    });
    const maxWidthClass = computed(() => {
      return {
        sm: "sm:max-w-sm",
        md: "sm:max-w-md",
        lg: "sm:max-w-lg",
        xl: "sm:max-w-xl",
        "2xl": "sm:max-w-2xl"
      }[props.maxWidth];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<dialog${ssrRenderAttrs(mergeProps({
        class: "z-50 m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent",
        ref_key: "dialog",
        ref: dialog
      }, _attrs))}><div class="fixed flex items-center inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0" scroll-region><div style="${ssrRenderStyle(__props.show ? null : { display: "none" })}" class="fixed inset-0 transform transition-all"><div class="absolute inset-0 bg-gray-500 opacity-75"></div></div><div style="${ssrRenderStyle(__props.show ? null : { display: "none" })}" class="${ssrRenderClass([maxWidthClass.value, "mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full"])}">`);
      if (showSlot.value) {
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></dialog>`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Modal.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = {
  __name: "PaymentMethodForm",
  __ssrInlineRender: true,
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    paymentMethod: {
      type: Object,
      default: null
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  },
  emits: ["submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const formData = reactive({ type: "card" });
    watch(() => formData.type, (newVal) => {
      var _a;
      if (formData.type === "card") {
        Object.assign(formData, {
          type: "card",
          last4: "",
          brand: "",
          exp_month: "",
          exp_year: "",
          is_default: false
        });
      } else {
        Object.assign(formData, {
          type: "paypal",
          email: ((_a = props.paymentMethod) == null ? void 0 : _a.email) ?? "",
          is_default: false
        });
      }
    }, { deep: true });
    watch(() => props.paymentMethod, (newVal) => {
      Object.assign(formData, JSON.parse(JSON.stringify(newVal)));
    }, { deep: true, immediate: true });
    const submitForm = () => {
      emit("submit", formData);
    };
    const closeForm = () => {
      emit("cancel");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$h, mergeProps({
        show: props.isOpen,
        "max-width": "lg"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"${_scopeId}><h3 class="text-lg font-medium text-[#444444] mb-4"${_scopeId}>${ssrInterpolate(((_a = __props.paymentMethod) == null ? void 0 : _a.id) ? "Edit Payment Method" : "Add Payment Method")}</h3> ${ssrInterpolate((_b = __props.paymentMethod) == null ? void 0 : _b.id)} <div class="space-y-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><input type="radio" id="card-payment"${ssrIncludeBooleanAttr(ssrLooseEqual(formData.type, "card")) ? " checked" : ""} value="card"${_scopeId}><label for="card-payment" class="mb-0"${_scopeId}>Credit Card</label></div>`);
            if (formData.type === "card") {
              _push2(`<div id="card-element" class="border border-[#e6e3de] rounded-md p-3"${_scopeId}><div class="grid grid-cols-2 gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$I, {
                class: "w-full mb-2 border-1 border-gray-300",
                modelValue: formData.last4,
                "onUpdate:modelValue": ($event) => formData.last4 = $event,
                placeholder: "Card Number"
              }, null, _parent2, _scopeId));
              _push2(`<select class="w-full mb-2 border-1 border-gray-300"${_scopeId}><option value="visa"${ssrIncludeBooleanAttr(Array.isArray(formData.brand) ? ssrLooseContain(formData.brand, "visa") : ssrLooseEqual(formData.brand, "visa")) ? " selected" : ""}${_scopeId}>visa</option><option value="master-card"${ssrIncludeBooleanAttr(Array.isArray(formData.brand) ? ssrLooseContain(formData.brand, "master-card") : ssrLooseEqual(formData.brand, "master-card")) ? " selected" : ""}${_scopeId}>master card</option></select></div><div class="grid grid-cols-2 gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$I, {
                class: "w-full mb-2 border-1 border-gray-300",
                modelValue: formData.exp_month,
                "onUpdate:modelValue": ($event) => formData.exp_month = $event,
                placeholder: "Exp Month"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$I, {
                class: "w-full mb-2 border-1 border-gray-300",
                modelValue: formData.exp_year,
                "onUpdate:modelValue": ($event) => formData.exp_year = $event,
                placeholder: "Exp Year"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="relative"${_scopeId}><div class="absolute inset-0 flex items-center" aria-hidden="true"${_scopeId}><div class="w-full border-t border-[#e6e3de]"${_scopeId}></div></div><div class="relative flex justify-center"${_scopeId}><span class="px-2 bg-white text-sm text-[#444444]/60"${_scopeId}>Or</span></div></div><div class="flex items-center gap-2"${_scopeId}><input type="radio" id="paypal-payment"${ssrIncludeBooleanAttr(ssrLooseEqual(formData.type, "paypal")) ? " checked" : ""} value="paypal"${_scopeId}><label for="paypal-payment" class="mb-0"${_scopeId}>PayPal</label></div>`);
            if (formData.type === "paypal") {
              _push2(`<div class="flex"${_scopeId}><div class="relative"${_scopeId}><span class="absolute left-0 top-0 block mx-0 my-0"${_scopeId}><svg class="h-5 w-5 mr-2 text-[#00457C]" viewBox="0 0 24 24" fill="currentColor"${_scopeId}><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm15.147-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.032.175-.056.306-.23 1.888-.892 6.12-1.003 6.85L19.4 15.829l1.61-9.912zm-1.127-3.562c-.202-1.207-.713-2.03-1.608-2.73-.899-.7-2.146-1.15-3.725-1.15h-7.46a.641.641 0 0 0-.633.74l2.108 13.365a.873.873 0 0 0 .862.74h2.98c4.226 0 7.48-1.402 8.742-5.8.452-1.848.528-3.462.252-4.735a4.615 4.615 0 0 0-.518-1.43z"${_scopeId}></path></svg></span>`);
              _push2(ssrRenderComponent(_sfc_main$I, {
                class: "w-full mb-2 border-1 border-gray-300",
                modelValue: formData.email,
                "onUpdate:modelValue": ($event) => formData.email = $event,
                placeholder: "Add PayPal Account"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center"${_scopeId}><input id="default"${ssrIncludeBooleanAttr(Array.isArray(formData.is_default) ? ssrLooseContain(formData.is_default, null) : formData.is_default) ? " checked" : ""} type="checkbox" class="h-4 w-4 mt-0 text-[#ff2832] border-[#e6e3de] rounded focus:ring-[#ff2832]/50"${_scopeId}><label for="default" class="ml-2 mb-0 block text-sm text-[#444444]"${_scopeId}> Set as default payment method </label></div></div></div><div class="bg-[#e6e3de]/30 px-4 py-3 sm:px-6 sm:flex space-x-4"${_scopeId}><button type="button" class="flex-1 bg-[#ff2832] text-[#fff] py-3 hover:bg-[#ff2832]/90 transition-all duration-200"${ssrIncludeBooleanAttr(__props.isSubmitting) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(__props.isSubmitting ? "Processing..." : "Save Payment Method")}</button><button type="button" class="flex-1 border border-[#e6e3de] text-[#444444] hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"${_scopeId}> Cancel </button></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, [
                createVNode("h3", { class: "text-lg font-medium text-[#444444] mb-4" }, toDisplayString(((_c = __props.paymentMethod) == null ? void 0 : _c.id) ? "Edit Payment Method" : "Add Payment Method"), 1),
                createTextVNode(" " + toDisplayString((_d = __props.paymentMethod) == null ? void 0 : _d.id) + " ", 1),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    withDirectives(createVNode("input", {
                      type: "radio",
                      id: "card-payment",
                      "onUpdate:modelValue": ($event) => formData.type = $event,
                      value: "card"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelRadio, formData.type]
                    ]),
                    createVNode("label", {
                      for: "card-payment",
                      class: "mb-0"
                    }, "Credit Card")
                  ]),
                  formData.type === "card" ? (openBlock(), createBlock("div", {
                    key: 0,
                    id: "card-element",
                    class: "border border-[#e6e3de] rounded-md p-3"
                  }, [
                    createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                      createVNode(_sfc_main$I, {
                        class: "w-full mb-2 border-1 border-gray-300",
                        modelValue: formData.last4,
                        "onUpdate:modelValue": ($event) => formData.last4 = $event,
                        placeholder: "Card Number"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      withDirectives(createVNode("select", {
                        class: "w-full mb-2 border-1 border-gray-300",
                        "onUpdate:modelValue": ($event) => formData.brand = $event
                      }, [
                        createVNode("option", { value: "visa" }, "visa"),
                        createVNode("option", { value: "master-card" }, "master card")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, formData.brand]
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                      createVNode(_sfc_main$I, {
                        class: "w-full mb-2 border-1 border-gray-300",
                        modelValue: formData.exp_month,
                        "onUpdate:modelValue": ($event) => formData.exp_month = $event,
                        placeholder: "Exp Month"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$I, {
                        class: "w-full mb-2 border-1 border-gray-300",
                        modelValue: formData.exp_year,
                        "onUpdate:modelValue": ($event) => formData.exp_year = $event,
                        placeholder: "Exp Year"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "relative" }, [
                    createVNode("div", {
                      class: "absolute inset-0 flex items-center",
                      "aria-hidden": "true"
                    }, [
                      createVNode("div", { class: "w-full border-t border-[#e6e3de]" })
                    ]),
                    createVNode("div", { class: "relative flex justify-center" }, [
                      createVNode("span", { class: "px-2 bg-white text-sm text-[#444444]/60" }, "Or")
                    ])
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    withDirectives(createVNode("input", {
                      type: "radio",
                      id: "paypal-payment",
                      "onUpdate:modelValue": ($event) => formData.type = $event,
                      value: "paypal"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelRadio, formData.type]
                    ]),
                    createVNode("label", {
                      for: "paypal-payment",
                      class: "mb-0"
                    }, "PayPal")
                  ]),
                  formData.type === "paypal" ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex"
                  }, [
                    createVNode("div", { class: "relative" }, [
                      createVNode("span", { class: "absolute left-0 top-0 block mx-0 my-0" }, [
                        (openBlock(), createBlock("svg", {
                          class: "h-5 w-5 mr-2 text-[#00457C]",
                          viewBox: "0 0 24 24",
                          fill: "currentColor"
                        }, [
                          createVNode("path", { d: "M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm15.147-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.032.175-.056.306-.23 1.888-.892 6.12-1.003 6.85L19.4 15.829l1.61-9.912zm-1.127-3.562c-.202-1.207-.713-2.03-1.608-2.73-.899-.7-2.146-1.15-3.725-1.15h-7.46a.641.641 0 0 0-.633.74l2.108 13.365a.873.873 0 0 0 .862.74h2.98c4.226 0 7.48-1.402 8.742-5.8.452-1.848.528-3.462.252-4.735a4.615 4.615 0 0 0-.518-1.43z" })
                        ]))
                      ]),
                      createVNode(_sfc_main$I, {
                        class: "w-full mb-2 border-1 border-gray-300",
                        modelValue: formData.email,
                        "onUpdate:modelValue": ($event) => formData.email = $event,
                        placeholder: "Add PayPal Account"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex items-center" }, [
                    withDirectives(createVNode("input", {
                      id: "default",
                      "onUpdate:modelValue": ($event) => formData.is_default = $event,
                      type: "checkbox",
                      class: "h-4 w-4 mt-0 text-[#ff2832] border-[#e6e3de] rounded focus:ring-[#ff2832]/50"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelCheckbox, formData.is_default]
                    ]),
                    createVNode("label", {
                      for: "default",
                      class: "ml-2 mb-0 block text-sm text-[#444444]"
                    }, " Set as default payment method ")
                  ])
                ])
              ]),
              createVNode("div", { class: "bg-[#e6e3de]/30 px-4 py-3 sm:px-6 sm:flex space-x-4" }, [
                createVNode("button", {
                  type: "button",
                  onClick: submitForm,
                  class: "flex-1 bg-[#ff2832] text-[#fff] py-3 hover:bg-[#ff2832]/90 transition-all duration-200",
                  disabled: __props.isSubmitting
                }, toDisplayString(__props.isSubmitting ? "Processing..." : "Save Payment Method"), 9, ["disabled"]),
                createVNode("button", {
                  type: "button",
                  onClick: closeForm,
                  class: "flex-1 border border-[#e6e3de] text-[#444444] hover:bg-[#e6e3de]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"
                }, " Cancel ")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/PaymentMethodForm.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = {
  __name: "PaymentMethods",
  __ssrInlineRender: true,
  setup(__props) {
    const paymentMethods = ref([
      {
        id: 1,
        type: "card",
        last4: "4242",
        brand: "visa",
        exp_month: "12",
        exp_year: "2025",
        is_default: true
      },
      {
        id: 2,
        type: "card",
        last4: "1881",
        brand: "master-card",
        exp_month: "3",
        exp_year: "2024",
        is_default: false
      },
      {
        id: 3,
        type: "paypal",
        email: "user@example.com",
        is_default: false
      }
    ]);
    const showAddForm = ref(false);
    const editingPaymentMethod = ref(null);
    const isSubmitting = ref(false);
    const defaultPaymentMethod = computed(
      () => paymentMethods.value.find((method) => method.is_default)
    );
    const otherPaymentMethods = computed(
      () => paymentMethods.value.filter((method) => !method.is_default)
    );
    const setDefaultPayment = (id) => {
      paymentMethods.value = paymentMethods.value.map((method) => ({
        ...method,
        is_default: method.id === id
      }));
    };
    const editPaymentMethod = (method) => {
      editingPaymentMethod.value = method;
    };
    const confirmDeletePayment = (id) => {
      if (confirm("Are you sure you want to delete this payment method?")) {
        paymentMethods.value = paymentMethods.value.filter((method) => method.id !== id);
      }
    };
    const handleSubmit = (formData) => {
      isSubmitting.value = true;
      console.log(formData);
      setTimeout(() => {
        if (formData.id) {
          const index = paymentMethods.value.findIndex((m) => m.id === formData.id);
          if (index !== -1) {
            paymentMethods.value[index] = JSON.parse(JSON.stringify(formData));
          }
        } else {
          paymentMethods.value.push({
            ...formData,
            id: Math.max(...paymentMethods.value.map((m) => m.id), 0) + 1
          });
        }
        isSubmitting.value = false;
        closeForm();
      }, 1e3);
    };
    const closeForm = () => {
      showAddForm.value = false;
      editingPaymentMethod.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AuthenticatedLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="w-full flex items-center justify-center p-6 border-2 border-dashed border-[#e6e3de] rounded-xl hover:border-[#ff2832]/50 transition-all duration-200 group" data-v-c8130660${_scopeId}><div class="text-center" data-v-c8130660${_scopeId}><div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#ff2832]/10 group-hover:bg-[#ff2832]/20 transition-colors duration-200" data-v-c8130660${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#ff2832]" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c8130660${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-c8130660${_scopeId}></path></svg></div><h3 class="mt-2 text-sm font-medium text-[#444444] group-hover:text-[#ff2832] transition-colors duration-200" data-v-c8130660${_scopeId}> Add Payment Method </h3></div></button><div class="space-y-4" data-v-c8130660${_scopeId}>`);
            if (defaultPaymentMethod.value) {
              _push2(`<div class="relative" data-v-c8130660${_scopeId}>`);
              _push2(ssrRenderComponent(PaymentMethodCard, {
                "payment-method": defaultPaymentMethod.value,
                "is-default": true,
                onSetDefault: setDefaultPayment,
                onEdit: editPaymentMethod,
                onDelete: confirmDeletePayment
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(otherPaymentMethods.value, (method) => {
              _push2(`<div class="relative" data-v-c8130660${_scopeId}>`);
              _push2(ssrRenderComponent(PaymentMethodCard, {
                "payment-method": method,
                "is-default": false,
                onSetDefault: setDefaultPayment,
                onEdit: editPaymentMethod,
                onDelete: confirmDeletePayment
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
            if (paymentMethods.value.length === 0) {
              _push2(`<div class="text-center py-12" data-v-c8130660${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-[#444444]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c8130660${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" data-v-c8130660${_scopeId}></path></svg><h3 class="mt-2 text-sm font-medium text-[#444444]" data-v-c8130660${_scopeId}>No payment methods</h3><p class="mt-1 text-sm text-[#444444]/60" data-v-c8130660${_scopeId}>Add a payment method to make checkout faster</p><div class="mt-6" data-v-c8130660${_scopeId}><button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200" data-v-c8130660${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-c8130660${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-c8130660${_scopeId}></path></svg> Add Payment Method </button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$g, {
              isOpen: !!showAddForm.value || !!editingPaymentMethod.value,
              "payment-method": editingPaymentMethod.value,
              "is-submitting": isSubmitting.value,
              onSubmit: handleSubmit,
              onCancel: closeForm
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("button", {
                onClick: ($event) => showAddForm.value = true,
                class: "w-full flex items-center justify-center p-6 border-2 border-dashed border-[#e6e3de] rounded-xl hover:border-[#ff2832]/50 transition-all duration-200 group"
              }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("div", { class: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#ff2832]/10 group-hover:bg-[#ff2832]/20 transition-colors duration-200" }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      class: "h-6 w-6 text-[#ff2832]",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                      })
                    ]))
                  ]),
                  createVNode("h3", { class: "mt-2 text-sm font-medium text-[#444444] group-hover:text-[#ff2832] transition-colors duration-200" }, " Add Payment Method ")
                ])
              ], 8, ["onClick"]),
              createVNode("div", { class: "space-y-4" }, [
                defaultPaymentMethod.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "relative"
                }, [
                  createVNode(PaymentMethodCard, {
                    "payment-method": defaultPaymentMethod.value,
                    "is-default": true,
                    onSetDefault: setDefaultPayment,
                    onEdit: editPaymentMethod,
                    onDelete: confirmDeletePayment
                  }, null, 8, ["payment-method"])
                ])) : createCommentVNode("", true),
                (openBlock(true), createBlock(Fragment, null, renderList(otherPaymentMethods.value, (method) => {
                  return openBlock(), createBlock("div", {
                    key: method.id,
                    class: "relative"
                  }, [
                    createVNode(PaymentMethodCard, {
                      "payment-method": method,
                      "is-default": false,
                      onSetDefault: setDefaultPayment,
                      onEdit: editPaymentMethod,
                      onDelete: confirmDeletePayment
                    }, null, 8, ["payment-method"])
                  ]);
                }), 128))
              ]),
              paymentMethods.value.length === 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "text-center py-12"
              }, [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "mx-auto h-12 w-12 text-[#444444]/40",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "1.5",
                    d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  })
                ])),
                createVNode("h3", { class: "mt-2 text-sm font-medium text-[#444444]" }, "No payment methods"),
                createVNode("p", { class: "mt-1 text-sm text-[#444444]/60" }, "Add a payment method to make checkout faster"),
                createVNode("div", { class: "mt-6" }, [
                  createVNode("button", {
                    onClick: () => showAddForm.value = true,
                    type: "button",
                    class: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ff2832] hover:bg-[#ff2832]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2832]/50 transition-all duration-200"
                  }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      class: "-ml-1 mr-2 h-5 w-5",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
                      })
                    ])),
                    createTextVNode(" Add Payment Method ")
                  ], 8, ["onClick"])
                ])
              ])) : createCommentVNode("", true),
              createVNode(_sfc_main$g, {
                isOpen: !!showAddForm.value || !!editingPaymentMethod.value,
                "payment-method": editingPaymentMethod.value,
                "is-submitting": isSubmitting.value,
                onSubmit: handleSubmit,
                onCancel: closeForm
              }, null, 8, ["isOpen", "payment-method", "is-submitting"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PaymentMethods.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const PaymentMethods = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-c8130660"]]);
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PaymentMethods
}, Symbol.toStringTag, { value: "Module" }));
const useDrawerStore = defineStore("DRAWER", () => {
  const isOpen = ref(false);
  const drawerContent = ref(null);
  function toggleDrawer() {
    isOpen.value = !isOpen.value;
    if (isOpen.value)
      document.querySelector("body").classList.add("no-scroll");
    else document.querySelector("body").classList.remove("no-scroll");
  }
  function setDrawerContent(data) {
    drawerContent.value = data;
  }
  return {
    isOpen,
    toggleDrawer,
    drawerContent,
    setDrawerContent
  };
});
const _sfc_main$e = {
  __name: "AddToCartButton",
  __ssrInlineRender: true,
  props: {
    productId: {
      type: Number,
      default: void 0,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    drawer: {
      type: Boolean,
      default: true
    },
    disabled: { type: Boolean, default: false },
    variantId: { type: Number, default: void 0 }
  },
  setup(__props) {
    useDrawerStore();
    useCartState();
    const props = __props;
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        class: "btn btn-prime d-flex justify-content-center items-center gap-3",
        disabled: loading.value || props.disabled ? true : void 0
      }, _attrs))} data-v-39eafb8b>`);
      if (loading.value) {
        _push(ssrRenderComponent(Spinner, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<span data-v-39eafb8b>Add To Cart </span></a>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/AddToCartButton.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const AddToCartButton = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-39eafb8b"]]);
const _sfc_main$d = {
  name: "ReviewForm",
  components: {
    Spinner
  },
  props: {
    productId: {
      type: Number,
      default: void 0,
      required: true
    }
  },
  data() {
    return {
      rate: 1,
      comment: "",
      loading: false
    };
  },
  methods: {
    async addReview() {
      if (this.comment.trim() == "") return;
      this.loading = true;
      try {
        const { data } = await API.post(
          "add-review",
          { productId: this.productId, rate: this.rate, review: this.comment }
        );
        if (data.success) {
          this.$emit("add-to-reviews", data.data);
          this.rate = 1;
          this.comment = "";
        }
      } catch (error) {
        console.log("faild to add review");
      } finally {
        this.loading = false;
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Spinner = resolveComponent("Spinner");
  _push(`<div${ssrRenderAttrs(mergeProps({
    id: "respond",
    class: "comment-respond mt-5"
  }, _attrs))}><h2>Add Review</h2><form id="commentform" method="post" class="comment-form"><div class="comment-form-rating py-3"><label>Your Rating<span class="required">*</span></label><p class="stars d-block"><!--[-->`);
  ssrRenderList(5, (i) => {
    _push(`<!--[--><label class="text-2xl"${ssrRenderAttr("for", `rate-${i}`)}></label><input type="radio"${ssrRenderAttr("id", `rate-${i}`)} name="rating"${ssrRenderAttr("value", i)}${ssrIncludeBooleanAttr(ssrLooseEqual($data.rate, i)) ? " checked" : ""}${ssrIncludeBooleanAttr($data.rate === i) ? " checked" : ""}><!--]-->`);
  });
  _push(`<!--]--></p></div><div class="comment-form-comment py-3"><label for="comment">Your review <span class="required">*</span></label><textarea class="d-block" id="comment" name="comment" cols="45" rows="8" style="${ssrRenderStyle({ "resize": "none" })}">${ssrInterpolate($data.comment)}</textarea></div><div class="form-submit"><button name="submit" type="submit" id="submit" class="btn-prime px-4 py-2"${ssrIncludeBooleanAttr($data.loading) ? " disabled" : ""}>`);
  if ($data.loading) {
    _push(ssrRenderComponent(_component_Spinner, null, null, _parent));
  } else {
    _push(`<!---->`);
  }
  _push(`<span>Send</span></button></div></form></div>`);
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ReviewForm.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const ReviewForm = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$c = {
  __name: "VariantView",
  __ssrInlineRender: true,
  props: ["variants", "variantType", "productId", "showqty"],
  setup(__props) {
    const props = __props;
    const selectedAttributes = ref({});
    const prodAttribues = computed(
      () => {
        var _a;
        return (_a = props.variants) == null ? void 0 : _a.reduce((acc, variant) => {
          const { id, SKU, quantity: quantity2, images, price, ...rest } = variant;
          Object.keys(rest).forEach((key) => {
            if (!rest[key]) return;
            const bv = acc.find((i) => i.type == key);
            if (!bv) {
              acc.push({ type: key, values: [rest[key]] });
              return;
            }
            if (!bv.values.includes(rest[key])) {
              bv.values.push(rest[key]);
            }
          });
          return acc;
        }, []);
      }
    );
    const mainAttribues = computed(() => prodAttribues.value.find((i) => i.type == props.variantType));
    const subAttribues = computed(() => prodAttribues.value.filter((i) => i.type != props.variantType));
    function variantImg(value) {
      var _a, _b;
      return (_b = (_a = props.variants.find((i) => i[props.variantType] == value)) == null ? void 0 : _a.images) == null ? void 0 : _b.split(",")[0];
    }
    const avaliableAttributes = computed(() => props.variants.filter((i) => i[props.variantType] == selectedAttributes.value[props.variantType]));
    const isAvailable = (type, value) => {
      return !avaliableAttributes.value.find((i) => i[type] && i[type] === value);
    };
    const selectedVariant = ref(void 0);
    watch(() => selectedAttributes.value, () => {
      var _a;
      const values = (_a = subAttribues.value) == null ? void 0 : _a.reduce((acc, attr) => {
        acc = acc.filter((i) => i[attr.type] == selectedAttributes.value[attr.type]);
        if (!acc.length) delete selectedAttributes.value[attr.type];
        return acc;
      }, avaliableAttributes.value);
      selectedVariant.value = values == null ? void 0 : values[0];
    }, { deep: true });
    const quantity = ref(1);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(_attrs)}><div><h5>${ssrInterpolate(mainAttribues.value.type)}</h5><div class="d-flex gap-2 main-attributes"><!--[-->`);
      ssrRenderList(mainAttribues.value.values, (value, index) => {
        _push(`<div><input type="radio" class="d-none"${ssrRenderAttr("name", mainAttribues.value.type)}${ssrRenderAttr("value", value)}${ssrRenderAttr("id", `product_attr_${value}`)}${ssrIncludeBooleanAttr(ssrLooseEqual(selectedAttributes.value[mainAttribues.value.type], value)) ? " checked" : ""}><label${ssrRenderAttr("for", `product_attr_${value}`)} class="mb-0"><img${ssrRenderAttr("src", `/assets/images/products/${variantImg(value)}`)} alt=""></label></div>`);
      });
      _push(`<!--]--></div></div><!--[-->`);
      ssrRenderList(subAttribues.value, (attr, index) => {
        _push(`<div><h5>${ssrInterpolate(attr.type)}</h5><div class="d-flex gap-2 sub-atributes"><!--[-->`);
        ssrRenderList(attr.values, (value, index2) => {
          _push(`<div><input type="radio"${ssrRenderAttr("name", attr.type)}${ssrRenderAttr("value", value)} class="d-none"${ssrRenderAttr("id", `product_attr_${value}`)}${ssrIncludeBooleanAttr(isAvailable(attr.type, value)) ? " disabled" : ""}${ssrIncludeBooleanAttr(ssrLooseEqual(selectedAttributes.value[attr.type], value)) ? " checked" : ""}><label${ssrRenderAttr("for", `product_attr_${value}`)} class="mb-0">${ssrInterpolate(value)}</label></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--><br>`);
      if ((_a = selectedVariant.value) == null ? void 0 : _a.id) {
        _push(`<div class="row mx-0"><strong>Available Qty :</strong> ${ssrInterpolate(selectedVariant.value.quantity ? selectedVariant.value.quantity : "Out Stock")}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (props.showqty && ((_b = selectedVariant.value) == null ? void 0 : _b.quantity)) {
        _push(`<div class="row mx-0"><div class="quantity"><div class="quantity-input"><span>${ssrInterpolate(quantity.value)}</span><a class="q-btn btn btn-reduce"></a><a class="q-btn btn btn-increase"></a></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="my-3">`);
      _push(ssrRenderComponent(AddToCartButton, {
        productId: props.productId,
        drawer: false,
        disabled: !((_c = selectedVariant.value) == null ? void 0 : _c.id) || !selectedVariant.value.quantity,
        variantId: ((_d = selectedVariant.value) == null ? void 0 : _d.id) ? selectedVariant.value.id : void 0,
        quantity: quantity.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/VariantView.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {
  __name: "ProductDetails",
  __ssrInlineRender: true,
  props: ["product"],
  setup(__props) {
    const props = __props;
    const reviews = ref(props.product.reviews);
    function addToReviews(review) {
      reviews.value.push(review);
    }
    const quantity = ref(1);
    function increaseQty() {
      if (quantity.value < props.product.quantity) {
        quantity.value += 1;
      }
    }
    function decreaseQty() {
      if (quantity.value > 1) {
        quantity.value -= 1;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<main id="main" class="main-site"${_scopeId}><div class="container"${_scopeId}><div class="wrap-breadcrumb"${_scopeId}><ul${_scopeId}><li class="item-link"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`home`);
                } else {
                  return [
                    createTextVNode("home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li class="item-link"${_scopeId}><span${_scopeId}>detail</span></li></ul></div><div class="row"${_scopeId}><div class="col-lg-9 col-md-8 col-sm-8 col-xs-12 main-content-area"${_scopeId}><div class="wrap-product-detail"${_scopeId}><div class="detail-media"${_scopeId}><div class="product-gallery"${_scopeId}>`);
            if (props.product.images) {
              _push2(`<ul class="slides"${_scopeId}><!--[-->`);
              ssrRenderList(props.product.images.split(","), (img) => {
                _push2(`<li class="prod-img-ratio"${ssrRenderAttr("data-thumb", `/assets/images/products/${img}`)}${_scopeId}>`);
                _push2(ssrRenderComponent(ImageComponent, {
                  source: `/assets/images/products/${img}`,
                  alt: "product thumbnail"
                }, null, _parent2, _scopeId));
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              _push2(`<ul class="slides"${_scopeId}><li${ssrRenderAttr("data-thumb", `/assets/images/products/${props.product.image}`)}${_scopeId}>`);
              _push2(ssrRenderComponent(ImageComponent, {
                source: `/assets/images/products/${props.product.image}`,
                alt: "product thumbnail"
              }, null, _parent2, _scopeId));
              _push2(`</li></ul>`);
            }
            _push2(`</div></div><div class="detail-info"${_scopeId}><div class="product-rating"${_scopeId}><!--[-->`);
            ssrRenderList(5, (i) => {
              _push2(`<i class="fa fa-star" aria-hidden="true" style="${ssrRenderStyle({ color: i <= Math.ceil(props.product.avg_rate) ? "#efce4a" : "#aaa" })}"${_scopeId}></i>`);
            });
            _push2(`<!--]--><a href="#" class="count-review"${_scopeId}>(${ssrInterpolate(reviews.value.length)} review)</a></div><div class="mb-4 border-bottom pb-3"${_scopeId}><h2 class="text-2xl font-bold my-0"${_scopeId}>${ssrInterpolate(props.product.name)}</h2><div class="short-desc"${_scopeId}>${props.product.shortDesc ?? ""}</div></div><div class="wrap-price mt-0"${_scopeId}><span class="product-price"${_scopeId}>$${ssrInterpolate(props.product.price)}</span></div>`);
            if ((_a = props.product.variants) == null ? void 0 : _a.length) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$c, {
                variants: props.product.variants,
                variantType: props.product.variantType,
                productId: props.product.id,
                showqty: true
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="mt-4"${_scopeId}>`);
              if (props.product.quantity) {
                _push2(`<div class="row mx-0"${_scopeId}><div class="quantity mb-3"${_scopeId}><span class="mb-1"${_scopeId}><strong${_scopeId}>Available Qty :</strong> ${ssrInterpolate(props.product.quantity)}</span><div class="quantity-input"${_scopeId}><span${_scopeId}>${ssrInterpolate(quantity.value)}</span><a class="q-btn btn btn-reduce"${_scopeId}></a><a class="q-btn btn btn-increase"${_scopeId}></a></div></div>`);
                _push2(ssrRenderComponent(AddToCartButton, {
                  productId: props.product.id,
                  drawer: false,
                  quantity: quantity.value
                }, null, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`<div class="py-0 w-full"${_scopeId}><div class="wrap-btn"${_scopeId}><a href="#" class="btn btn-compare"${_scopeId}>Add Compare</a><a href="#" class="btn btn-wishlist"${_scopeId}>Add Wishlist</a></div></div></div><div class="advance-info"${_scopeId}><div class="tab-control normal"${_scopeId}><a href="#description" class="tab-control-item active"${_scopeId}>description</a><a href="#add_infomation" class="tab-control-item"${_scopeId}>Addtional Infomation</a><a href="#review" class="tab-control-item"${_scopeId}>Reviews</a></div><div class="tab-contents"${_scopeId}><div class="tab-content-item active" id="description"${_scopeId}>${props.product.description ?? ""}</div><div class="tab-content-item" id="add_infomation"${_scopeId}>${props.product.features ?? ""}</div><div class="tab-content-item" id="review"${_scopeId}><div class="wrap-review-form d-flex flex-column"${_scopeId}><div id="comments"${_scopeId}><h2 class="woocommerce-Reviews-title"${_scopeId}>${ssrInterpolate(reviews.value.length)} review for <span${_scopeId}>${ssrInterpolate(props.product.name)}</span></h2><ol class="commentlist"${_scopeId}><!--[-->`);
            ssrRenderList(reviews.value, (review, index) => {
              _push2(`<li class="comment byuser comment-author-admin bypostauthor even thread-even depth-1" id="li-comment-20"${_scopeId}><div id="comment-20" class="comment_container"${_scopeId}>`);
              if (review.user.avatar) {
                _push2(ssrRenderComponent(ImageComponent, {
                  source: `/assets/images/${review.user.avatar}`,
                  height: "80",
                  width: "80",
                  alt: ""
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<span class="avatar" style="${ssrRenderStyle({ "background": "#bbb" })}"${_scopeId}>${ssrInterpolate(review.user.name[0])}</span>`);
              }
              _push2(`<div class="comment-text"${_scopeId}><div class="product-rating"${_scopeId}><!--[-->`);
              ssrRenderList(5, (i) => {
                _push2(`<i class="fa fa-star" aria-hidden="true" style="${ssrRenderStyle({ color: i <= review.rate ? "#efce4a" : "#aaa" })}"${_scopeId}></i>`);
              });
              _push2(`<!--]--></div><p class="meta"${_scopeId}><strong class="woocommerce-review__author"${_scopeId}>${ssrInterpolate(review.user.name)}</strong><span class="woocommerce-review__dash"${_scopeId}>–</span><span class="woocommerce-review__published-date"${_scopeId}>${ssrInterpolate(new Date(review.created_at).toDateString())}</span></p><div class="description"${_scopeId}><p${_scopeId}>${ssrInterpolate(review.review)}</p></div></div></div></li>`);
            });
            _push2(`<!--]--></ol></div>`);
            if ((_b = _ctx.$page.props.auth) == null ? void 0 : _b.user) {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(ReviewForm, {
                onAddToReviews: addToReviews,
                productId: props.product.id
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div></div></div></div><div class="col-lg-3 col-md-4 col-sm-4 col-xs-12 sitebar"${_scopeId}><div class="widget widget-our-services"${_scopeId}><div class="widget-content"${_scopeId}><ul class="our-services"${_scopeId}><li class="service"${_scopeId}><a class="link-to-service" href="#"${_scopeId}><i class="fa fa-truck" aria-hidden="true"${_scopeId}></i><div class="right-content"${_scopeId}><b class="title"${_scopeId}>Free Shipping</b><span class="subtitle"${_scopeId}>On Oder Over $99</span><p class="desc"${_scopeId}> Lorem Ipsum is simply dummy text of the printing... </p></div></a></li><li class="service"${_scopeId}><a class="link-to-service" href="#"${_scopeId}><i class="fa fa-gift" aria-hidden="true"${_scopeId}></i><div class="right-content"${_scopeId}><b class="title"${_scopeId}>Special Offer</b><span class="subtitle"${_scopeId}>Get a gift!</span><p class="desc"${_scopeId}> Lorem Ipsum is simply dummy text of the printing... </p></div></a></li><li class="service"${_scopeId}><a class="link-to-service" href="#"${_scopeId}><i class="fa fa-reply" aria-hidden="true"${_scopeId}></i><div class="right-content"${_scopeId}><b class="title"${_scopeId}>Order Return</b><span class="subtitle"${_scopeId}>Return within 7 days</span><p class="desc"${_scopeId}> Lorem Ipsum is simply dummy text of the printing... </p></div></a></li></ul></div></div></div></div></div></main>`);
          } else {
            return [
              createVNode("main", {
                id: "main",
                class: "main-site"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "wrap-breadcrumb" }, [
                    createVNode("ul", null, [
                      createVNode("li", { class: "item-link" }, [
                        createVNode(unref(Link), {
                          href: "/",
                          class: "link"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("home")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("li", { class: "item-link" }, [
                        createVNode("span", null, "detail")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode("div", { class: "col-lg-9 col-md-8 col-sm-8 col-xs-12 main-content-area" }, [
                      createVNode("div", { class: "wrap-product-detail" }, [
                        createVNode("div", { class: "detail-media" }, [
                          createVNode("div", { class: "product-gallery" }, [
                            props.product.images ? (openBlock(), createBlock("ul", {
                              key: 0,
                              class: "slides"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(props.product.images.split(","), (img) => {
                                return openBlock(), createBlock("li", {
                                  key: img.index,
                                  class: "prod-img-ratio",
                                  "data-thumb": `/assets/images/products/${img}`
                                }, [
                                  createVNode(ImageComponent, {
                                    source: `/assets/images/products/${img}`,
                                    alt: "product thumbnail"
                                  }, null, 8, ["source"])
                                ], 8, ["data-thumb"]);
                              }), 128))
                            ])) : (openBlock(), createBlock("ul", {
                              key: 1,
                              class: "slides"
                            }, [
                              createVNode("li", {
                                "data-thumb": `/assets/images/products/${props.product.image}`
                              }, [
                                createVNode(ImageComponent, {
                                  source: `/assets/images/products/${props.product.image}`,
                                  alt: "product thumbnail"
                                }, null, 8, ["source"])
                              ], 8, ["data-thumb"])
                            ]))
                          ])
                        ]),
                        createVNode("div", { class: "detail-info" }, [
                          createVNode("div", { class: "product-rating" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(5, (i) => {
                              return createVNode("i", {
                                class: "fa fa-star",
                                "aria-hidden": "true",
                                key: i,
                                style: { color: i <= Math.ceil(props.product.avg_rate) ? "#efce4a" : "#aaa" }
                              }, null, 4);
                            }), 64)),
                            createVNode("a", {
                              href: "#",
                              class: "count-review"
                            }, "(" + toDisplayString(reviews.value.length) + " review)", 1)
                          ]),
                          createVNode("div", { class: "mb-4 border-bottom pb-3" }, [
                            createVNode("h2", { class: "text-2xl font-bold my-0" }, toDisplayString(props.product.name), 1),
                            createVNode("div", {
                              class: "short-desc",
                              innerHTML: props.product.shortDesc
                            }, null, 8, ["innerHTML"])
                          ]),
                          createVNode("div", { class: "wrap-price mt-0" }, [
                            createVNode("span", { class: "product-price" }, "$" + toDisplayString(props.product.price), 1)
                          ]),
                          ((_c = props.product.variants) == null ? void 0 : _c.length) ? (openBlock(), createBlock("div", { key: 0 }, [
                            createVNode(_sfc_main$c, {
                              variants: props.product.variants,
                              variantType: props.product.variantType,
                              productId: props.product.id,
                              showqty: true
                            }, null, 8, ["variants", "variantType", "productId"])
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "mt-4"
                          }, [
                            props.product.quantity ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "row mx-0"
                            }, [
                              createVNode("div", { class: "quantity mb-3" }, [
                                createVNode("span", { class: "mb-1" }, [
                                  createVNode("strong", null, "Available Qty :"),
                                  createTextVNode(" " + toDisplayString(props.product.quantity), 1)
                                ]),
                                createVNode("div", { class: "quantity-input" }, [
                                  createVNode("span", null, toDisplayString(quantity.value), 1),
                                  createVNode("a", {
                                    class: "q-btn btn btn-reduce",
                                    onClick: withModifiers(decreaseQty, ["prevent"])
                                  }),
                                  createVNode("a", {
                                    class: "q-btn btn btn-increase",
                                    onClick: withModifiers(increaseQty, ["prevent"])
                                  })
                                ])
                              ]),
                              createVNode(AddToCartButton, {
                                productId: props.product.id,
                                drawer: false,
                                quantity: quantity.value
                              }, null, 8, ["productId", "quantity"])
                            ])) : createCommentVNode("", true)
                          ])),
                          createVNode("div", { class: "py-0 w-full" }, [
                            createVNode("div", { class: "wrap-btn" }, [
                              createVNode("a", {
                                href: "#",
                                class: "btn btn-compare"
                              }, "Add Compare"),
                              createVNode("a", {
                                href: "#",
                                class: "btn btn-wishlist"
                              }, "Add Wishlist")
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "advance-info" }, [
                          createVNode("div", { class: "tab-control normal" }, [
                            createVNode("a", {
                              href: "#description",
                              class: "tab-control-item active"
                            }, "description"),
                            createVNode("a", {
                              href: "#add_infomation",
                              class: "tab-control-item"
                            }, "Addtional Infomation"),
                            createVNode("a", {
                              href: "#review",
                              class: "tab-control-item"
                            }, "Reviews")
                          ]),
                          createVNode("div", { class: "tab-contents" }, [
                            createVNode("div", {
                              class: "tab-content-item active",
                              id: "description",
                              innerHTML: props.product.description
                            }, null, 8, ["innerHTML"]),
                            createVNode("div", {
                              class: "tab-content-item",
                              id: "add_infomation",
                              innerHTML: props.product.features
                            }, null, 8, ["innerHTML"]),
                            createVNode("div", {
                              class: "tab-content-item",
                              id: "review"
                            }, [
                              createVNode("div", { class: "wrap-review-form d-flex flex-column" }, [
                                createVNode("div", { id: "comments" }, [
                                  createVNode("h2", { class: "woocommerce-Reviews-title" }, [
                                    createTextVNode(toDisplayString(reviews.value.length) + " review for ", 1),
                                    createVNode("span", null, toDisplayString(props.product.name), 1)
                                  ]),
                                  createVNode("ol", { class: "commentlist" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(reviews.value, (review, index) => {
                                      return openBlock(), createBlock("li", {
                                        class: "comment byuser comment-author-admin bypostauthor even thread-even depth-1",
                                        id: "li-comment-20",
                                        key: index
                                      }, [
                                        createVNode("div", {
                                          id: "comment-20",
                                          class: "comment_container"
                                        }, [
                                          review.user.avatar ? (openBlock(), createBlock(ImageComponent, {
                                            key: 0,
                                            source: `/assets/images/${review.user.avatar}`,
                                            height: "80",
                                            width: "80",
                                            alt: ""
                                          }, null, 8, ["source"])) : (openBlock(), createBlock("span", {
                                            key: 1,
                                            class: "avatar",
                                            style: { "background": "#bbb" }
                                          }, toDisplayString(review.user.name[0]), 1)),
                                          createVNode("div", { class: "comment-text" }, [
                                            createVNode("div", { class: "product-rating" }, [
                                              (openBlock(), createBlock(Fragment, null, renderList(5, (i) => {
                                                return createVNode("i", {
                                                  class: "fa fa-star",
                                                  "aria-hidden": "true",
                                                  key: i,
                                                  style: { color: i <= review.rate ? "#efce4a" : "#aaa" }
                                                }, null, 4);
                                              }), 64))
                                            ]),
                                            createVNode("p", { class: "meta" }, [
                                              createVNode("strong", { class: "woocommerce-review__author" }, toDisplayString(review.user.name), 1),
                                              createVNode("span", { class: "woocommerce-review__dash" }, "–"),
                                              createVNode("span", { class: "woocommerce-review__published-date" }, toDisplayString(new Date(review.created_at).toDateString()), 1)
                                            ]),
                                            createVNode("div", { class: "description" }, [
                                              createVNode("p", null, toDisplayString(review.review), 1)
                                            ])
                                          ])
                                        ])
                                      ]);
                                    }), 128))
                                  ])
                                ]),
                                ((_d = _ctx.$page.props.auth) == null ? void 0 : _d.user) ? (openBlock(), createBlock("div", { key: 0 }, [
                                  createVNode(ReviewForm, {
                                    onAddToReviews: addToReviews,
                                    productId: props.product.id
                                  }, null, 8, ["productId"])
                                ])) : createCommentVNode("", true)
                              ])
                            ])
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "col-lg-3 col-md-4 col-sm-4 col-xs-12 sitebar" }, [
                      createVNode("div", { class: "widget widget-our-services" }, [
                        createVNode("div", { class: "widget-content" }, [
                          createVNode("ul", { class: "our-services" }, [
                            createVNode("li", { class: "service" }, [
                              createVNode("a", {
                                class: "link-to-service",
                                href: "#"
                              }, [
                                createVNode("i", {
                                  class: "fa fa-truck",
                                  "aria-hidden": "true"
                                }),
                                createVNode("div", { class: "right-content" }, [
                                  createVNode("b", { class: "title" }, "Free Shipping"),
                                  createVNode("span", { class: "subtitle" }, "On Oder Over $99"),
                                  createVNode("p", { class: "desc" }, " Lorem Ipsum is simply dummy text of the printing... ")
                                ])
                              ])
                            ]),
                            createVNode("li", { class: "service" }, [
                              createVNode("a", {
                                class: "link-to-service",
                                href: "#"
                              }, [
                                createVNode("i", {
                                  class: "fa fa-gift",
                                  "aria-hidden": "true"
                                }),
                                createVNode("div", { class: "right-content" }, [
                                  createVNode("b", { class: "title" }, "Special Offer"),
                                  createVNode("span", { class: "subtitle" }, "Get a gift!"),
                                  createVNode("p", { class: "desc" }, " Lorem Ipsum is simply dummy text of the printing... ")
                                ])
                              ])
                            ]),
                            createVNode("li", { class: "service" }, [
                              createVNode("a", {
                                class: "link-to-service",
                                href: "#"
                              }, [
                                createVNode("i", {
                                  class: "fa fa-reply",
                                  "aria-hidden": "true"
                                }),
                                createVNode("div", { class: "right-content" }, [
                                  createVNode("b", { class: "title" }, "Order Return"),
                                  createVNode("span", { class: "subtitle" }, "Return within 7 days"),
                                  createVNode("p", { class: "desc" }, " Lorem Ipsum is simply dummy text of the printing... ")
                                ])
                              ])
                            ])
                          ])
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/ProductDetails.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<button${ssrRenderAttrs(mergeProps({ class: "inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</button>`);
}
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/DangerButton.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const DangerButton = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$9 = {
  __name: "SecondaryButton",
  __ssrInlineRender: true,
  props: {
    type: {
      type: String,
      default: "button"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: __props.type,
        class: "inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25"
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/SecondaryButton.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "DeleteUserForm",
  __ssrInlineRender: true,
  setup(__props) {
    const confirmingUserDeletion = ref(false);
    const passwordInput = ref(null);
    const form = useForm({
      password: ""
    });
    const confirmUserDeletion = () => {
      confirmingUserDeletion.value = true;
      nextTick(() => passwordInput.value.focus());
    };
    const deleteUser = () => {
      form.delete(route$1("profile.destroy"), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value.focus(),
        onFinish: () => form.reset()
      });
    };
    const closeModal = () => {
      confirmingUserDeletion.value = false;
      form.clearErrors();
      form.reset();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><header><h2 class="text-lg font-medium text-gray-900"> Delete Account </h2><p class="mt-1 text-sm text-gray-600"> Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. </p></header>`);
      _push(ssrRenderComponent(DangerButton, { onClick: confirmUserDeletion }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Delete Account`);
          } else {
            return [
              createTextVNode("Delete Account")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$h, {
        show: confirmingUserDeletion.value,
        onClose: closeModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="p-6"${_scopeId}><h2 class="text-lg font-medium text-gray-900"${_scopeId}> Are you sure you want to delete your account? </h2><p class="mt-1 text-sm text-gray-600"${_scopeId}> Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. </p><div class="mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$K, {
              for: "password",
              value: "Password",
              class: "sr-only"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$I, {
              id: "password",
              ref_key: "passwordInput",
              ref: passwordInput,
              modelValue: unref(form).password,
              "onUpdate:modelValue": ($event) => unref(form).password = $event,
              type: "password",
              class: "mt-1 block w-3/4",
              placeholder: "Password",
              onKeyup: deleteUser
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$L, {
              message: unref(form).errors.password,
              class: "mt-2"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mt-6 flex justify-end"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$9, { onClick: closeModal }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Cancel `);
                } else {
                  return [
                    createTextVNode(" Cancel ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(DangerButton, {
              class: ["ms-3", { "opacity-25": unref(form).processing }],
              disabled: unref(form).processing,
              onClick: deleteUser
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Delete Account `);
                } else {
                  return [
                    createTextVNode(" Delete Account ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("h2", { class: "text-lg font-medium text-gray-900" }, " Are you sure you want to delete your account? "),
                createVNode("p", { class: "mt-1 text-sm text-gray-600" }, " Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. "),
                createVNode("div", { class: "mt-6" }, [
                  createVNode(_sfc_main$K, {
                    for: "password",
                    value: "Password",
                    class: "sr-only"
                  }),
                  createVNode(_sfc_main$I, {
                    id: "password",
                    ref_key: "passwordInput",
                    ref: passwordInput,
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    type: "password",
                    class: "mt-1 block w-3/4",
                    placeholder: "Password",
                    onKeyup: withKeys(deleteUser, ["enter"])
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode(_sfc_main$L, {
                    message: unref(form).errors.password,
                    class: "mt-2"
                  }, null, 8, ["message"])
                ]),
                createVNode("div", { class: "mt-6 flex justify-end" }, [
                  createVNode(_sfc_main$9, { onClick: closeModal }, {
                    default: withCtx(() => [
                      createTextVNode(" Cancel ")
                    ]),
                    _: 1
                  }),
                  createVNode(DangerButton, {
                    class: ["ms-3", { "opacity-25": unref(form).processing }],
                    disabled: unref(form).processing,
                    onClick: deleteUser
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Delete Account ")
                    ]),
                    _: 1
                  }, 8, ["class", "disabled"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/DeleteUserForm.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  __name: "UpdatePasswordForm",
  __ssrInlineRender: true,
  setup(__props) {
    const passwordInput = ref(null);
    const currentPasswordInput = ref(null);
    const form = useForm({
      current_password: "",
      password: "",
      password_confirmation: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><header><h2 class="text-lg font-medium text-gray-900"> Update Password </h2><p class="mt-1 text-sm text-gray-600"> Ensure your account is using a long, random password to stay secure. </p></header><form class="mt-6 space-y-6"><div>`);
      _push(ssrRenderComponent(_sfc_main$K, {
        for: "current_password",
        value: "Current Password"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$I, {
        id: "current_password",
        ref_key: "currentPasswordInput",
        ref: currentPasswordInput,
        modelValue: unref(form).current_password,
        "onUpdate:modelValue": ($event) => unref(form).current_password = $event,
        type: "password",
        class: "mt-1 block w-full focus:shadow-none focus:ring-0 border-2 focus:border-[#ff2832]/80 transition",
        autocomplete: "current-password"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$L, {
        message: unref(form).errors.current_password,
        class: "mt-2"
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$K, {
        for: "password",
        value: "New Password"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$I, {
        id: "password",
        ref_key: "passwordInput",
        ref: passwordInput,
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        type: "password",
        class: "mt-1 block w-full focus:shadow-none focus:ring-0 border-2 focus:border-[#ff2832]/80 transition",
        autocomplete: "new-password"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$L, {
        message: unref(form).errors.password,
        class: "mt-2"
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$K, {
        for: "password_confirmation",
        value: "Confirm Password"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$I, {
        id: "password_confirmation",
        modelValue: unref(form).password_confirmation,
        "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
        type: "password",
        class: "mt-1 block w-full focus:shadow-none focus:ring-0 border-2 focus:border-[#ff2832]/80 transition",
        autocomplete: "new-password"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$L, {
        message: unref(form).errors.password_confirmation,
        class: "mt-2"
      }, null, _parent));
      _push(`</div><div class="flex items-center gap-4"><button${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-3 mt-3 py-2 text-white bg-[#ff2832]/95 hover:bg-[#ff2832]/80 transition">Save Changes </button>`);
      if (unref(form).recentlySuccessful) {
        _push(`<p class="text-sm text-gray-600"> Saved. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></section>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdatePasswordForm.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {
  __name: "UpdateProfileInformationForm",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    const user = usePage().props.auth.user;
    const form = useForm({
      name: user.name,
      email: user.email
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}><header><h2 class="text-lg font-medium text-gray-900"> Profile Information </h2><p class="mt-1 text-sm text-gray-600"> Update your account&#39;s profile information and email address. </p></header><form class="mt-6 space-y-6"><div>`);
      _push(ssrRenderComponent(_sfc_main$K, {
        for: "name",
        value: "Name"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$I, {
        id: "name",
        type: "text",
        class: "mt-1 block w-full focus:shadow-none focus:ring-0 border-2 focus:border-[#ff2832]/80 transition",
        modelValue: unref(form).name,
        "onUpdate:modelValue": ($event) => unref(form).name = $event,
        required: "",
        autofocus: "",
        autocomplete: "name"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.name
      }, null, _parent));
      _push(`</div><div>`);
      _push(ssrRenderComponent(_sfc_main$K, {
        for: "email",
        value: "Email"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$I, {
        id: "email",
        type: "email",
        class: "mt-1 block w-full focus:shadow-none focus:ring-0 border-2 focus:border-[#ff2832]/80 transition",
        modelValue: unref(form).email,
        "onUpdate:modelValue": ($event) => unref(form).email = $event,
        required: "",
        autocomplete: "username"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$L, {
        class: "mt-2",
        message: unref(form).errors.email
      }, null, _parent));
      _push(`</div>`);
      if (__props.mustVerifyEmail && unref(user).email_verified_at === null) {
        _push(`<div><p class="mt-2 text-sm text-gray-800"> Your email address is unverified. `);
        _push(ssrRenderComponent(unref(Link), {
          href: unref(route$1)("verification.send"),
          method: "post",
          as: "button",
          class: "rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Click here to re-send the verification email. `);
            } else {
              return [
                createTextVNode(" Click here to re-send the verification email. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p><div style="${ssrRenderStyle(__props.status === "verification-link-sent" ? null : { display: "none" })}" class="mt-2 text-sm font-medium text-green-600"> A new verification link has been sent to your email address. </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-4"><button${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="px-3 mt-3 py-2 text-white bg-[#ff2832]/95 hover:bg-[#ff2832]/80 transition">Save</button>`);
      if (unref(form).recentlySuccessful) {
        _push(`<p class="text-sm text-gray-600"> Saved. </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></form></section>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    mustVerifyEmail: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Profile" }, null, _parent));
      _push(ssrRenderComponent(AuthenticatedLayout, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-7xl space-y-6"${_scopeId}><div class="bg-white p-4 shadow-md sm:rounded-lg sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              "must-verify-email": __props.mustVerifyEmail,
              status: __props.status,
              class: "max-w-xl"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="bg-white p-4 shadow-md sm:rounded-lg sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$7, { class: "max-w-xl" }, null, _parent2, _scopeId));
            _push2(`</div><div class="bg-white p-4 shadow-md sm:rounded-lg sm:p-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$8, { class: "max-w-xl" }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-7xl space-y-6" }, [
                createVNode("div", { class: "bg-white p-4 shadow-md sm:rounded-lg sm:p-8" }, [
                  createVNode(_sfc_main$6, {
                    "must-verify-email": __props.mustVerifyEmail,
                    status: __props.status,
                    class: "max-w-xl"
                  }, null, 8, ["must-verify-email", "status"])
                ]),
                createVNode("div", { class: "bg-white p-4 shadow-md sm:rounded-lg sm:p-8" }, [
                  createVNode(_sfc_main$7, { class: "max-w-xl" })
                ]),
                createVNode("div", { class: "bg-white p-4 shadow-md sm:rounded-lg sm:p-8" }, [
                  createVNode(_sfc_main$8, { class: "max-w-xl" })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Edit.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$4 = {
  __name: "FilterList",
  __ssrInlineRender: true,
  props: ["items", "title", "modelValue", "link"],
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    var _a;
    const props = __props;
    const emit = __emit;
    const collapsed = ref(!!((_a = props.modelValue) == null ? void 0 : _a.length));
    const localFilters = computed({
      get: () => props.modelValue || [],
      set: (value) => emit("update:modelValue", value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "widget mercado-widget" }, _attrs))}><div class="d-flex justify-content-between align-items-center mb-1"><h2 class="widget-title">${ssrInterpolate(props.title)}</h2><a href="#" class="control-show-more">`);
      if (!collapsed.value) {
        _push(`<i class="fa fa-plus" aria-hidden="true"></i>`);
      } else {
        _push(`<i class="fa fa-minus" aria-hidden="true"></i>`);
      }
      _push(`</a></div><div class="widget-content"><ul class="list-style vertical-list has-count-index color-filter"><!--[-->`);
      ssrRenderList(props.items, (item) => {
        var _a2;
        _push(`<li class="list-item mt-2" style="${ssrRenderStyle(collapsed.value ? null : { display: "none" })}">`);
        if (props.link) {
          _push(ssrRenderComponent(unref(Link), {
            class: "filter-link",
            href: item.slug
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!--[--><input type="checkbox"${ssrRenderAttr("id", item.slug ? item.slug : item)} class="input"${ssrRenderAttr("name", `sectionFilter_${props.title}`)}${ssrRenderAttr("value", item.slug ? item.slug : item)}${ssrIncludeBooleanAttr(Array.isArray(localFilters.value) ? ssrLooseContain(localFilters.value, item.slug ? item.slug : item) : localFilters.value) ? " checked" : ""}${ssrIncludeBooleanAttr(
            (_a2 = __props.modelValue) == null ? void 0 : _a2.includes(
              item.slug ? item.slug : item
            )
          ) ? " checked" : ""}><label${ssrRenderAttr("for", item.slug ? item.slug : item)} class="colors">${ssrInterpolate(item.name ? item.name : item)}</label><!--]-->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/FilterList.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "FilterSection",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    brands: {
      type: Array,
      default: () => []
    }
  },
  emits: ["refetch"],
  setup(__props, { emit: __emit }) {
    const { url: pageUrl } = usePage();
    const locationURL = ref(pageUrl);
    const url_search = computed(() => {
      return locationURL.value.split("?")[1];
    });
    const props = __props;
    ref(null);
    const COLORS = [
      "red",
      "blue",
      "white",
      "black",
      "green",
      "yellow",
      "pink",
      "purple",
      "beige"
    ];
    const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
    const RANGE_PRICE = [0, 1e3];
    const FilterPrice = ref(false);
    const FILTERS = reactive({
      search: [],
      color: [],
      size: [],
      brand: [],
      price: []
    });
    const getAppliedFilters = (search = null) => {
      const params = new URLSearchParams(search ?? url_search.value);
      const object = Object.fromEntries(params.entries());
      Object.keys(object).forEach((key) => {
        FILTERS[key] = params.get(key).split("--");
      });
      FilterPrice.value = !!FILTERS.price.length;
    };
    getAppliedFilters();
    const priceRangeValue = computed(() => {
      var _a;
      return ((_a = FILTERS.price) == null ? void 0 : _a.length) ? FILTERS.price.join(",") : RANGE_PRICE.join(",");
    });
    const hasAppliedFilters = computed(() => {
      return new URLSearchParams(url_search.value).size > 0;
    });
    const filtersHasValues = computed(() => {
      return Object.keys(FILTERS).some((key) => FILTERS[key].length) || FilterPrice.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-lg-3 col-md-4 col-sm-4 col-xs-12 sitebar position-sticky" }, _attrs))} data-v-e6f7c5bc>`);
      _push(ssrRenderComponent(_sfc_main$4, {
        title: "category",
        items: props.categories,
        link: true
      }, null, _parent));
      if (props.brands.length) {
        _push(ssrRenderComponent(_sfc_main$4, {
          title: "brand",
          items: props.brands,
          modelValue: FILTERS.brand,
          "onUpdate:modelValue": ($event) => FILTERS.brand = $event
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$4, {
        title: "color",
        items: COLORS,
        modelValue: FILTERS.color,
        "onUpdate:modelValue": ($event) => FILTERS.color = $event
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, {
        title: "size",
        items: SIZES,
        modelValue: FILTERS.size,
        "onUpdate:modelValue": ($event) => FILTERS.size = $event
      }, null, _parent));
      _push(`<div class="widget mercado-widget filter-widget price-filter" data-v-e6f7c5bc><h2 class="widget-title mb-2" data-v-e6f7c5bc>Price</h2><p class="row mx-0 pricefiltercheckbox" data-v-e6f7c5bc><input type="checkbox" id="useprice" class="input"${ssrIncludeBooleanAttr(Array.isArray(FilterPrice.value) ? ssrLooseContain(FilterPrice.value, null) : FilterPrice.value) ? " checked" : ""} data-v-e6f7c5bc><label for="useprice" class="colors" data-v-e6f7c5bc>Apply Price Filter</label></p><div class="widget-content" data-v-e6f7c5bc><div id="slider-range" data-v-e6f7c5bc></div><p data-v-e6f7c5bc><label for="amount" data-v-e6f7c5bc>Price:</label><input type="text" id="amount" readonly data-v-e6f7c5bc></p></div><input type="hidden" id="minprice"${ssrRenderAttr("value", RANGE_PRICE[0])} data-v-e6f7c5bc><input type="hidden" id="maxprice"${ssrRenderAttr("value", RANGE_PRICE[1])} data-v-e6f7c5bc><input type="hidden" id="RangeVlaue"${ssrRenderAttr("value", priceRangeValue.value)} data-v-e6f7c5bc></div><div class="d-flex gap-2 flex-wrap" data-v-e6f7c5bc><button${ssrIncludeBooleanAttr(!filtersHasValues.value) ? " disabled" : ""} class="border border-[#e6e3de] bg-[#ff2832] text-white hover:text-black hover:bg-[#ddd] py-3 px-4 text-center font-medium transition-colors duration-200 shadow-sm" data-v-e6f7c5bc> FILTER </button>`);
      if (hasAppliedFilters.value) {
        _push(`<button class="flex-1 bg-[#444444] hover:bg-[#ddd] text-white hover:text-black py-3 px-4 text-center font-medium transition-colors duration-200" data-v-e6f7c5bc> CLEAR FILTER </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/FilterSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const FilterSection = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-e6f7c5bc"]]);
const _sfc_main$2 = {
  __name: "AddToCartDrawer",
  __ssrInlineRender: true,
  setup(__props) {
    const DRAWER = useDrawerStore();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["cart-drawer", { "cart-drawer--open": unref(DRAWER).isOpen }]
      }, _attrs))} data-v-d5405f34><div class="cart-drawer__overlay" data-v-d5405f34></div><div class="cart-drawer__content" data-v-d5405f34><div class="cart-drawer__header" data-v-d5405f34><h2 class="cart-drawer__title" data-v-d5405f34>Your Cart</h2><button class="cart-drawer__close" data-v-d5405f34><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-d5405f34><line x1="18" y1="6" x2="6" y2="18" data-v-d5405f34></line><line x1="6" y1="6" x2="18" y2="18" data-v-d5405f34></line></svg></button></div>`);
      if (unref(DRAWER).drawerContent) {
        _push(`<div class="cart-drawer__body" data-v-d5405f34><div class="product-gallery" data-v-d5405f34><ul data-v-d5405f34><!--[-->`);
        ssrRenderList(unref(DRAWER).drawerContent.images.split(","), (img, index) => {
          _push(`<li data-v-d5405f34><img${ssrRenderAttr("src", `/assets/images/products/${img}`)} alt="product images" data-v-d5405f34></li>`);
        });
        _push(`<!--]--></ul></div><br data-v-d5405f34><div data-v-d5405f34><h3 class="font-medium mb-3" data-v-d5405f34>${ssrInterpolate(unref(DRAWER).drawerContent.name)}</h3><h4 class="font-bold" data-v-d5405f34>$${ssrInterpolate(unref(DRAWER).drawerContent.price)}</h4></div>`);
        if ((_a = unref(DRAWER).drawerContent.variants) == null ? void 0 : _a.length) {
          _push(`<div data-v-d5405f34>`);
          _push(ssrRenderComponent(_sfc_main$c, {
            variants: unref(DRAWER).drawerContent.variants,
            variantType: unref(DRAWER).drawerContent.variantType,
            productId: unref(DRAWER).drawerContent.id
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="mt-4 mb-2" data-v-d5405f34>`);
          _push(ssrRenderComponent(AddToCartButton, {
            productId: unref(DRAWER).drawerContent.id,
            drawer: false
          }, null, _parent));
          _push(`</div>`);
        }
        _push(`<a${ssrRenderAttr("href", `/products/${unref(DRAWER).drawerContent.slug}`)} class="text-gray-700 underline text-base hover:text-gray-100" data-v-d5405f34>view more details</a></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/AddToCartDrawer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AddToCartDrawer = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-d5405f34"]]);
const _sfc_main$1 = {
  __name: "ProductSkelton",
  __ssrInlineRender: true,
  props: {
    count: {
      type: Number,
      default: 4
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(__props.count, (product) => {
        _push(`<div class="col-lg-4 col-md-6 col-sm-6 col-xs-6" data-v-3ffeb986><div class="product product-style-3 equal-elem" data-v-3ffeb986><div class="product-thumnail prod-img-ratio" data-v-3ffeb986><div class="skeleton-image" data-v-3ffeb986></div></div><div class="product-info" data-v-3ffeb986><div class="skeleton-title" data-v-3ffeb986></div><div class="skeleton-price" data-v-3ffeb986></div><div class="skeleton-button" data-v-3ffeb986></div></div></div></div>`);
      });
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ProductSkelton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProductSkelton = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3ffeb986"]]);
const _sfc_main = {
  __name: "Shop",
  __ssrInlineRender: true,
  props: ["brands", "categories", "pageType"],
  setup(__props) {
    const props = __props;
    const { url: locationURL } = usePage();
    const pageLoading = ref(true);
    const products = ref([]);
    const pagination = ref({});
    const url_search = computed(() => {
      return locationURL.split("?")[1];
    });
    const Getproducts = async (url) => {
      try {
        const { data } = await API.get(url);
        products.value = data.data;
        pagination.value = { ...data, data: void 0 };
      } catch (error) {
        console.log("faild to get shop products!");
      } finally {
        pageLoading.value = false;
      }
    };
    const routeParam = computed(() => {
      const pathname = locationURL.split("?")[0];
      return `shop-products/${props.pageType + pathname}`;
    });
    function initGettingProducts() {
      const params = new URLSearchParams(url_search.value);
      const search = params.toString();
      Getproducts(search ? `${routeParam.value}?${search}` : routeParam.value);
    }
    initGettingProducts();
    const pginationClick = (url) => {
      Getproducts(url);
      window.scrollTo({ top: 140, behavior: "smooth" });
    };
    const refetchProducts = (search) => {
      Getproducts(routeParam.value + "?" + search);
      window.scrollTo({ top: 140, behavior: "smooth" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$S, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<main id="main" class="main-site left-sidebar"${_scopeId}><div class="container"${_scopeId}><div class="wrap-breadcrumb"${_scopeId}><ul${_scopeId}><li class="item-link"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "link"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`home`);
                } else {
                  return [
                    createTextVNode("home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</li><li class="item-link"${_scopeId}><span${_scopeId}>Shop</span></li></ul></div><div class="row"${_scopeId}>`);
            _push2(ssrRenderComponent(FilterSection, {
              categories: props.categories,
              brands: props.brands,
              onRefetch: refetchProducts
            }, null, _parent2, _scopeId));
            _push2(`<div class="col-lg-9 col-md-8 col-sm-8 col-xs-12 main-content-area"${_scopeId}><div class="wrap-shop-control"${_scopeId}><h1 class="shop-title"${_scopeId}>Shop</h1><div class="wrap-right"${_scopeId}><div class="sort-item product-per-page"${_scopeId}><select name="post-per-page" class="border rounded-md h-8 py-0"${_scopeId}><option value="15" selected="selected"${_scopeId}> 15 per page </option><option value="16"${_scopeId}>18 per page</option><option value="18"${_scopeId}>21 per page</option><option value="21"${_scopeId}>24 per page</option><option value="24"${_scopeId}>27 per page</option><option value="30"${_scopeId}>30 per page</option><option value="32"${_scopeId}>33 per page</option></select></div></div></div><div class="row"${_scopeId}><!--[-->`);
            ssrRenderList(products.value, (product) => {
              _push2(`<div class="col-lg-4 col-md-6 col-sm-6 col-xs-6"${_scopeId}><div class="product product-style-3 equal-elem"${_scopeId}><div class="product-thumnail prod-img-ratio"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/products/${product.slug}`,
                title: "T-Shirt Raw Hem Organic Boro Constrast Denim"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(ImageComponent, {
                      source: `/assets/images/products/${product.images.split(",")[0]}`,
                      alt: "product thumbnail"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(ImageComponent, {
                        source: `/assets/images/products/${product.images.split(",")[0]}`,
                        alt: "product thumbnail"
                      }, null, 8, ["source"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div><div class="product-info"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/products/${product.slug}`,
                class: "product-name"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span${_scopeId2}>${ssrInterpolate(product.name)}</span>`);
                  } else {
                    return [
                      createVNode("span", null, toDisplayString(product.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<div class="wrap-price"${_scopeId}><span class="product-price"${_scopeId}>$${ssrInterpolate(product.price)}</span></div>`);
              _push2(ssrRenderComponent(AddToCartButton, {
                productId: product.id
              }, null, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            });
            _push2(`<!--]-->`);
            if (pageLoading.value) {
              _push2(ssrRenderComponent(ProductSkelton, { count: 3 }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (!products.value.length && !pageLoading.value) {
              _push2(`<div class="row mx-0 py-3"${_scopeId}><div class="col-12 px-2"${_scopeId}><h2 class="mb-3"${_scopeId}>No products match your filters</h2><p${_scopeId}>Try adjusting your search criteria or `);
              _push2(ssrRenderComponent(unref(Link), {
                href: unref(locationURL).split("?")[0]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`clear all filters`);
                  } else {
                    return [
                      createTextVNode("clear all filters")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</p></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (products.value.length) {
              _push2(`<div class="wrap-pagination-info"${_scopeId}><ul class="page-numbers"${_scopeId}><!--[-->`);
              ssrRenderList(pagination.value.links, (link, index) => {
                _push2(`<li${_scopeId}>`);
                if (link.active) {
                  _push2(`<button class="page-number-item current"${_scopeId}>${link.label ?? ""}</button>`);
                } else {
                  _push2(`<button class="page-number-item"${_scopeId}>${link.label ?? ""}</button>`);
                }
                _push2(`</li>`);
              });
              _push2(`<!--]--></ul><p class="result-count"${_scopeId}> Showing 1-${ssrInterpolate(pagination.value.per_page)} of ${ssrInterpolate(pagination.value.total)} result </p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
            _push2(ssrRenderComponent(AddToCartDrawer, null, null, _parent2, _scopeId));
            _push2(`</main>`);
          } else {
            return [
              createVNode("main", {
                id: "main",
                class: "main-site left-sidebar"
              }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "wrap-breadcrumb" }, [
                    createVNode("ul", null, [
                      createVNode("li", { class: "item-link" }, [
                        createVNode(unref(Link), {
                          href: "/",
                          class: "link"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("home")
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("li", { class: "item-link" }, [
                        createVNode("span", null, "Shop")
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "row" }, [
                    createVNode(FilterSection, {
                      categories: props.categories,
                      brands: props.brands,
                      onRefetch: refetchProducts
                    }, null, 8, ["categories", "brands"]),
                    createVNode("div", { class: "col-lg-9 col-md-8 col-sm-8 col-xs-12 main-content-area" }, [
                      createVNode("div", { class: "wrap-shop-control" }, [
                        createVNode("h1", { class: "shop-title" }, "Shop"),
                        createVNode("div", { class: "wrap-right" }, [
                          createVNode("div", { class: "sort-item product-per-page" }, [
                            createVNode("select", {
                              name: "post-per-page",
                              class: "border rounded-md h-8 py-0"
                            }, [
                              createVNode("option", {
                                value: "15",
                                selected: "selected"
                              }, " 15 per page "),
                              createVNode("option", { value: "16" }, "18 per page"),
                              createVNode("option", { value: "18" }, "21 per page"),
                              createVNode("option", { value: "21" }, "24 per page"),
                              createVNode("option", { value: "24" }, "27 per page"),
                              createVNode("option", { value: "30" }, "30 per page"),
                              createVNode("option", { value: "32" }, "33 per page")
                            ])
                          ])
                        ])
                      ]),
                      createVNode("div", { class: "row" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(products.value, (product) => {
                          return openBlock(), createBlock("div", {
                            key: product.id,
                            class: "col-lg-4 col-md-6 col-sm-6 col-xs-6"
                          }, [
                            createVNode("div", { class: "product product-style-3 equal-elem" }, [
                              createVNode("div", { class: "product-thumnail prod-img-ratio" }, [
                                createVNode(unref(Link), {
                                  href: `/products/${product.slug}`,
                                  title: "T-Shirt Raw Hem Organic Boro Constrast Denim"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(ImageComponent, {
                                      source: `/assets/images/products/${product.images.split(",")[0]}`,
                                      alt: "product thumbnail"
                                    }, null, 8, ["source"])
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ]),
                              createVNode("div", { class: "product-info" }, [
                                createVNode(unref(Link), {
                                  href: `/products/${product.slug}`,
                                  class: "product-name"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("span", null, toDisplayString(product.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"]),
                                createVNode("div", { class: "wrap-price" }, [
                                  createVNode("span", { class: "product-price" }, "$" + toDisplayString(product.price), 1)
                                ]),
                                createVNode(AddToCartButton, {
                                  productId: product.id
                                }, null, 8, ["productId"])
                              ])
                            ])
                          ]);
                        }), 128)),
                        pageLoading.value ? (openBlock(), createBlock(ProductSkelton, {
                          key: 0,
                          count: 3
                        })) : createCommentVNode("", true)
                      ]),
                      !products.value.length && !pageLoading.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "row mx-0 py-3"
                      }, [
                        createVNode("div", { class: "col-12 px-2" }, [
                          createVNode("h2", { class: "mb-3" }, "No products match your filters"),
                          createVNode("p", null, [
                            createTextVNode("Try adjusting your search criteria or "),
                            createVNode(unref(Link), {
                              href: unref(locationURL).split("?")[0]
                            }, {
                              default: withCtx(() => [
                                createTextVNode("clear all filters")
                              ]),
                              _: 1
                            }, 8, ["href"])
                          ])
                        ])
                      ])) : createCommentVNode("", true),
                      products.value.length ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "wrap-pagination-info"
                      }, [
                        createVNode("ul", { class: "page-numbers" }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(pagination.value.links, (link, index) => {
                            return openBlock(), createBlock("li", { key: index }, [
                              link.active ? (openBlock(), createBlock("button", {
                                key: 0,
                                class: "page-number-item current",
                                onClick: ($event) => pginationClick(link.url),
                                innerHTML: link.label
                              }, null, 8, ["onClick", "innerHTML"])) : (openBlock(), createBlock("button", {
                                key: 1,
                                class: "page-number-item",
                                onClick: ($event) => pginationClick(link.url),
                                innerHTML: link.label
                              }, null, 8, ["onClick", "innerHTML"]))
                            ]);
                          }), 128))
                        ]),
                        createVNode("p", { class: "result-count" }, " Showing 1-" + toDisplayString(pagination.value.per_page) + " of " + toDisplayString(pagination.value.total) + " result ", 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                createVNode(AddToCartDrawer)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Shop.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
const pinia = createPinia();
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/About.vue": __vite_glob_0_0, "./Pages/Address.vue": __vite_glob_0_1, "./Pages/Auth/ConfirmPassword.vue": __vite_glob_0_2, "./Pages/Auth/ForgotPassword.vue": __vite_glob_0_3, "./Pages/Auth/Login.vue": __vite_glob_0_4, "./Pages/Auth/Register.vue": __vite_glob_0_5, "./Pages/Auth/ResetPassword.vue": __vite_glob_0_6, "./Pages/Auth/VerifyEmail.vue": __vite_glob_0_7, "./Pages/BuildPage.vue": __vite_glob_0_8, "./Pages/Cart.vue": __vite_glob_0_9, "./Pages/Checkout.vue": __vite_glob_0_10, "./Pages/Contact.vue": __vite_glob_0_11, "./Pages/Dashboard.vue": __vite_glob_0_12, "./Pages/Order.vue": __vite_glob_0_13, "./Pages/OrderConfirmation.vue": __vite_glob_0_14, "./Pages/OrderDetails.vue": __vite_glob_0_15, "./Pages/PaymentMethods.vue": __vite_glob_0_16, "./Pages/ProductDetails.vue": __vite_glob_0_17, "./Pages/Profile/Edit.vue": __vite_glob_0_18, "./Pages/Profile/Partials/DeleteUserForm.vue": __vite_glob_0_19, "./Pages/Profile/Partials/UpdatePasswordForm.vue": __vite_glob_0_20, "./Pages/Profile/Partials/UpdateProfileInformationForm.vue": __vite_glob_0_21, "./Pages/Shop.vue": __vite_glob_0_22 });
      return pages[`./Pages/${name}.vue`];
    },
    setup({ App, props, plugin }) {
      return createSSRApp({
        render: () => h(App, props)
      }).use(plugin).use(pinia).use(ZiggyVue);
    }
  })
);
