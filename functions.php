<?php
/**
 * Функции темы ИП Беликов
 */

defined( 'ABSPATH' ) || exit;

require get_theme_file_path( 'inc/fields.php' );
require get_theme_file_path( 'inc/content.php' );
require get_theme_file_path( 'inc/template-helpers.php' );
require get_theme_file_path( 'inc/head.php' );
require get_theme_file_path( 'inc/lead-form.php' );
require get_theme_file_path( 'inc/cleanup.php' );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'style', 'script', 'gallery', 'caption' ) );
} );

// Нарезки jpg/png (thumbnail, medium, large и -scaled) сохраняются в WebP
add_filter( 'image_editor_output_format', function ( $formats ) {
	$formats['image/jpeg'] = 'image/webp';
	$formats['image/png']  = 'image/webp';
	return $formats;
} );

// Оригинал при загрузке тоже переводим в WebP, чтобы в медиатеке не оставалось jpg/png.
// Если сервер не умеет WebP, файл остаётся как есть.
add_filter( 'wp_handle_upload', function ( $upload ) {
	if ( ! in_array( $upload['type'], array( 'image/jpeg', 'image/png' ), true ) ) {
		return $upload;
	}

	$editor = wp_get_image_editor( $upload['file'] );
	if ( is_wp_error( $editor ) || ! $editor->supports_mime_type( 'image/webp' ) ) {
		return $upload;
	}

	// В WebP не будет EXIF, поэтому поворот с телефона применяем сразу
	$editor->maybe_exif_rotate();

	$dir   = dirname( $upload['file'] );
	$name  = wp_unique_filename( $dir, preg_replace( '/\.(jpe?g|png)$/i', '.webp', wp_basename( $upload['file'] ) ) );
	$saved = $editor->save( $dir . '/' . $name, 'image/webp' );
	if ( is_wp_error( $saved ) ) {
		return $upload;
	}

	wp_delete_file( $upload['file'] );
	return array(
		'file' => $saved['path'],
		'url'  => trailingslashit( dirname( $upload['url'] ) ) . $saved['file'],
		'type' => 'image/webp',
	);
} );
