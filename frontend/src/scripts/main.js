angular.module('asmApp', [])
  .config(function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
      rewriteLinks: false
    });
  });

$(function () {

  //backgroundimage fade position
  var height = 0.5625 * parseInt($('.page .backgroundimage').css('width'));
  $('.page .backgroundimage').css('height', height+'px');
  $('.page .backgroundfade').css('top', (height-300)+'px');

  $('.header-navigation ul.mobile_navigation').slicknav({"allowParentLinks": true, brand:'<a href="http://www.assembly.org"><img src="/static/images/summer16/logo.png"/></a>'});
  $('.tools').clone().prependTo('.slicknav_menu')

  // var bodyEl = document.body,
  //   content = document.querySelector('.content-wrap'),
  //   openbtn = document.getElementById('open-button'),
  //   closebtn = document.getElementById('close-button'),
  //   isOpen = false;

  // function init() {
  //   initEvents();
  // }

  // function initEvents() {
  //   if (openbtn) openbtn.addEventListener('click', toggleMenu);
  //   if (closebtn) closebtn.addEventListener('click', toggleMenu);

  //   // close the menu element if the target it´s not the menu element or one of its descendants..
  //   content.addEventListener('click', function (ev) {
  //     var target = ev.target;
  //     if (isOpen && target !== openbtn) toggleMenu();
  //   });
  // }

  // function toggleMenu() {
  //   if (isOpen) {
  //     classie.remove(bodyEl, 'show-menu');
  //     $('.menu-wrap').stop().slideUp(300);
  //   } else {
  //     classie.add(bodyEl, 'show-menu');
  //     $('.menu-wrap').slideDown(300);
  //   }
  //   isOpen = !isOpen;
  // }

  // init();

  // $('.menu-side ul li.expanded').hover(function () {
  //   if ($(window).width() >= 960) {
  //     $(this).children('ul').stop().slideToggle();
  //     $(this).toggleClass('open');
  //   }
  // });

  // $('.menu-side ul li.expanded').click(function () {
  //   if ($(window).width() >= 960) {
  //     $(this).children('ul').stop().slideToggle();
  //     $(this).toggleClass('open');
  //   }
  // });
});
