<?php
/**
 * <head>: подключение стилей и скриптов, предзагрузка, SEO-разметка, иконки
 */

defined( 'ABSPATH' ) || exit;

// Ширина главного фото в вёрстке: на всю ширину контейнера (1140px + поля по 16px)
const IPB_HERO_SIZES = '(max-width: 1172px) 100vw, 1140px';

/** Версия файла по времени изменения, чтобы браузер не держал старый кэш */
function ipb_ver( $path ) {
	return (string) filemtime( get_theme_file_path( $path ) );
}

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'ip-belikov', get_theme_file_uri( 'assets/css/main.css' ), array(), ipb_ver( 'assets/css/main.css' ) );

	if ( is_front_page() ) {
		wp_enqueue_script_module( 'ip-belikov', get_theme_file_uri( 'assets/js/main.js' ), array(), ipb_ver( 'assets/js/main.js' ) );
	}
} );

// Стили и модули подключены цепочкой через @import / import: сообщаем браузеру
// обо всех файлах сразу, чтобы он качал их параллельно. Списки берём из самих файлов.
add_action( 'wp_head', function () {
	if ( ! is_front_page() ) {
		return;
	}
	$c = ipb_content();

	// Пока страница собирается, она скрыта; main.js показывает её, когда готовы скрипты и шрифт
	echo "<script>document.documentElement.classList.add('is-loading');</script>\n";

	foreach ( array( 'C059-Roman', 'C059-Bold' ) as $font ) {
		printf( "<link rel=\"preload\" href=\"%s\" as=\"font\" type=\"font/woff2\" crossorigin>\n", esc_url( get_theme_file_uri( "assets/fonts/$font.woff2" ) ) );
	}
	// Главное фото: из медиатеки — с тем же srcset, что у <img>, иначе браузер скачает его дважды
	$hero = $c['hero'];
	if ( ! empty( $hero['id'] ) ) {
		printf(
			"<link rel=\"preload\" as=\"image\" href=\"%s\" imagesrcset=\"%s\" imagesizes=\"%s\" fetchpriority=\"high\">\n",
			esc_url( $hero['src'] ),
			esc_attr( (string) wp_get_attachment_image_srcset( $hero['id'], $hero['size'] ) ),
			esc_attr( IPB_HERO_SIZES )
		);
	} else {
		printf( "<link rel=\"preload\" as=\"image\" href=\"%s\" fetchpriority=\"high\">\n", esc_url( ipb_src( $hero['src'] ) ) );
	}

	preg_match_all( '/@import url\("([^"]+)"\)/', file_get_contents( get_theme_file_path( 'assets/css/main.css' ) ), $imports );
	foreach ( $imports[1] as $css ) {
		printf( "<link rel=\"preload\" href=\"%s\" as=\"style\">\n", esc_url( get_theme_file_uri( "assets/css/$css" ) ) );
	}

	foreach ( glob( get_theme_file_path( 'assets/js/*/*.js' ) ) as $file ) {
		$relative = 'assets/js/' . basename( dirname( $file ) ) . '/' . basename( $file );
		printf( "<link rel=\"modulepreload\" href=\"%s\">\n", esc_url( get_theme_file_uri( $relative ) ) );
	}
}, 1 );

// Заголовок вкладки на главной
add_filter( 'pre_get_document_title', function ( $title ) {
	return is_front_page() ? ipb_content()['seo']['title'] : $title;
} );

// Описание, Open Graph и микроразметка организации для Яндекса и Google
add_action( 'wp_head', function () {
	if ( ! is_front_page() ) {
		return;
	}
	$c     = ipb_content();
	$seo   = $c['seo'];
	$url   = home_url( '/' );
	$image = ipb_src( $seo['og_image'] );

	$meta = array(
		array( 'name', 'description', $seo['description'] ),
		array( 'property', 'og:type', 'website' ),
		array( 'property', 'og:locale', 'ru_RU' ),
		array( 'property', 'og:site_name', $seo['site_name'] ),
		array( 'property', 'og:title', $seo['og_title'] ),
		array( 'property', 'og:description', $seo['description'] ),
		array( 'property', 'og:url', $url ),
		array( 'property', 'og:image', $image ),
		array( 'property', 'og:image:width', '1200' ),
		array( 'property', 'og:image:height', '630' ),
		array( 'property', 'og:image:alt', $c['hero']['alt'] ),
		array( 'name', 'twitter:card', 'summary_large_image' ),
	);
	// Если главная — статическая страница, canonical уже выводит сам WordPress
	if ( ! is_singular() ) {
		printf( "<link rel=\"canonical\" href=\"%s\">\n", esc_url( $url ) );
	}
	foreach ( $meta as list( $attr, $key, $value ) ) {
		printf( "<meta %s=\"%s\" content=\"%s\">\n", $attr, esc_attr( $key ), esc_attr( $value ) );
	}

	$schema = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'HomeAndConstructionBusiness',
		'name'        => $c['name'],
		'description' => $seo['business_description'],
		'url'         => $url,
		'image'       => $image,
		'logo'        => get_theme_file_uri( 'assets/favicon/icon-512.png' ),
		'telephone'   => $seo['telephone'],
		'email'       => $c['email']['text'],
		'foundingDate' => $seo['founding_date'],
		'sameAs'      => wp_list_pluck( $c['socials'], 'href' ),
		'address'     => $seo['address'],
		'areaServed'  => array( '@type' => 'City', 'name' => $seo['address']['addressLocality'] ),
	);
	printf( "<script type=\"application/ld+json\">%s</script>\n", wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) );
} );

// Политику не индексируем: её текст есть на главной во всплывающем окне
add_filter( 'wp_robots', function ( $robots ) {
	$policy = (int) get_option( 'wp_page_for_privacy_policy' );
	if ( $policy && is_page( $policy ) ) {
		$robots['noindex'] = true;
	}
	return $robots;
} );

// Иконки сайта из темы, пока в «Настройках» не задан свой значок
add_action( 'wp_head', function () {
	if ( ! has_site_icon() ) {
		printf( "<link rel=\"icon\" href=\"%s\" sizes=\"32x32\">\n", esc_url( get_theme_file_uri( 'favicon.ico' ) ) );
		printf( "<link rel=\"icon\" href=\"%s\" type=\"image/svg+xml\">\n", esc_url( get_theme_file_uri( 'assets/favicon/favicon.svg' ) ) );
		printf( "<link rel=\"apple-touch-icon\" href=\"%s\">\n", esc_url( get_theme_file_uri( 'assets/favicon/apple-touch-icon.png' ) ) );
	}
	echo "<meta name=\"theme-color\" content=\"#5b4636\">\n";
} );
