<template>
    <header id="header" class="header header-style-1">
        <div class="container-fluid">
            <div class="row">
                <div class="topbar-menu-area">
                    <div class="container">
                        <div class="topbar-menu left-menu">
                            <ul>
                                <li class="menu-item">
                                    <a title="Hotline: (+123) 456 789" href="#"><span
                                            class="icon label-before fa fa-mobile"></span>Hotline: (+123) 456 789</a>
                                </li>
                            </ul>
                        </div>

                        <div class="topbar-menu right-menu">
                            <ul>


                                <NotificationBell :initial-notifications="$page.props.notifications || []" />


                                <li v-if="$page.props.auth.user" class="menu-item menu-item-has-children parent">
                                    <a class="item-header cursor-pointer" title="User">
                                        {{ $page.props.auth.user?.name }}
                                        <i class="fa fa-user" aria-hidden="true"></i>
                                    </a>

                                    <!-- {{-- For Admins --}} -->
                                    <ul v-if="
                                        $page.props.auth.user?.role == 'ADM'
                                    " class="submenu curency">
                                        <li class="menu-item">
                                            <Link title="Dashboard" href="/account/dashboard">Dashboard</Link>
                                        </li>

                                        <li class="menu-item">
                                            <a title="Logout" href="">
                                                Logout
                                            </a>

                                            <form id="logout-form" action="" method="POST" class="d-none"></form>
                                        </li>
                                    </ul>

                                    <!-- {{-- For Users --}} -->
                                    <ul v-if="
                                        $page.props.auth.user?.role == 'USR'
                                    " class="submenu curency">
                                        <li class="menu-item">
                                            <Link title="Account" href="/account">Account</Link>
                                        </li>

                                        <li class="menu-item">
                                            <Link title="Account" href="/orders">Orders</Link>
                                        </li>

                                        <li class="nav-divider"></li>

                                        <li class="menu-item" style="color: rgb(245, 35, 52)">
                                            <a title="Logout" href="">
                                                Logout
                                            </a>

                                            <form id="logout-form" action="" method="POST" class="d-none"></form>
                                        </li>
                                    </ul>
                                    <!--  -->
                                </li>
                                <li v-else class="menu-item">
                                    <Link title="Register or Login" href="/login">Sign In</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="container">
                    <div class="mid-section main-info-area">
                        <div class="wrap-logo-top left-section">
                            <a href="/" class="link-to-home">
                                <img src="/assets/images/logo-top-1.png" alt="mercado" />
                            </a>
                        </div>

                        <div class="wrap-search center-section">
                            <div class="wrap-search-form">
                                <form action="/shop" id="form-search-top" name="form-search-top">
                                    <input type="text" name="search" value="" placeholder="Search here..." />

                                    <button form="form-search-top" type="submit">
                                        <i class="fa fa-search" aria-hidden="true"></i>
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="wrap-icon right-section">
                            <div class="wrap-icon-section wishlist">
                                <Link href="#" @click.stop="" class="link-direction">
                                <i class="fa fa-heart" aria-hidden="true"></i>

                                <div class="left-info">
                                    <span class="index">0 item</span>

                                    <span class="title">Wishlist</span>
                                </div>
                                </Link>
                            </div>

                            <div class="wrap-icon-section minicart">
                                <Link href="/cart" class="link-direction">
                                <i class="fa fa-shopping-basket" aria-hidden="true"></i>

                                <div class="left-info">
                                    <span class="index">
                                        <span id="cartindex">
                                            {{ CART.count }}
                                        </span>
                                        items</span>

                                    <span class="title">CART</span>
                                </div>
                                </Link>
                            </div>

                            <div class="wrap-icon-section show-up-after-1024">
                                <a href="#" class="mobile-navigation">
                                    <span></span>

                                    <span></span>

                                    <span></span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="nav-section header-sticky w-full flex flex-column relative">
                    <div class="header-nav-section">
                        <div class="container">
                            <ul class="nav menu-nav clone-main-menu" id="mercado_haead_menu" data-menuname="Sale Info">
                                <li class="menu-item" v-for="(item, index) in $page.props
                                    .headerCollection">
                                    <Link :href="item.url" class="link-term">{{
                                        item.title
                                    }}</Link>
                                    <span class="nav-label hot-label">hot</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </header>

    <div class="row mx-0 sticky top-0 z-10">
        <div class="primary-nav-section w-full">
            <div class="container">
                <ul class="nav primary clone-main-menu" id="mercado_main" data-menuname="Main menu">
                    <li class="menu-item home-icon py-2">
                        <Link href="/" class="link-term mercado-item-title">
                        <i class="fa fa-home" aria-hidden="true"></i>
                        </Link>
                    </li>

                    <li class="menu-item py-2" v-for="item in props.mainMenu">
                        <Link :href="item.url" class="link-term mercado-item-title">{{ item.title }}</Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script setup>
import { Link } from "@inertiajs/vue3";
import { useCartState } from "../stores/CartState";
import { usePage } from "@inertiajs/vue3";
import NotificationBell from "./NotificationBell.vue";
const { props } = usePage();

const CART = useCartState();
CART.setCartCount(props.cartCount);
</script>
