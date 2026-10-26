<?php
/**
 * Лишнее от WordPress для сайта-визитки: в sitemap только то, что надо индексировать,
 * логины пользователей наружу не светим
 */

defined( 'ABSPATH' ) || exit;

// Sitemap (/sitemap.xml → /wp-sitemap.xml): без списка пользователей
add_filter( 'wp_sitemaps_add_provider', function ( $provider, $name ) {
	return 'users' === $name ? false : $provider;
}, 10, 2 );

// Политика закрыта от индекса (inc/head.php), значит и в sitemap ей не место
add_filter( 'wp_sitemaps_posts_query_args', function ( $args, $post_type ) {
	$policy = (int) get_option( 'wp_page_for_privacy_policy' );
	if ( 'page' === $post_type && $policy ) {
		$args['post__not_in'] = array_merge( $args['post__not_in'] ?? array(), array( $policy ) );
	}
	return $args;
}, 10, 2 );

// Архивов авторов на визитке нет: /author/admin/ и ?author=1 выдавали логин администратора
add_action( 'template_redirect', function () {
	if ( is_author() || isset( $_GET['author'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}, 1 );

// Список пользователей через REST API — только для вошедших (редактору он нужен)
add_filter( 'rest_endpoints', function ( $endpoints ) {
	if ( ! is_user_logged_in() ) {
		unset( $endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
	}
	return $endpoints;
} );
