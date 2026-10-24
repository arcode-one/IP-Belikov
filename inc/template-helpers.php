<?php
/**
 * Мелкие помощники для шаблонов (аналоги assets/js/utils)
 */

defined( 'ABSPATH' ) || exit;

/** Адрес картинки: путь внутри темы превращаем в URL, готовый URL оставляем как есть */
function ipb_src( $src ) {
	return preg_match( '#^https?://#i', $src ) ? $src : get_theme_file_uri( $src );
}

/**
 * <img> из элемента контента { src, alt, id?, size? }. Фото из медиатеки выводим
 * через WordPress — с srcset, чтобы браузер брал подходящий размер.
 * eager — грузить сразу (первый экран), иначе лениво; sizes — ширина картинки в вёрстке.
 */
function ipb_image( $item, $args = array() ) {
	$args  = wp_parse_args( $args, array( 'class' => '', 'eager' => false, 'sizes' => '' ) );
	$attrs = array(
		'alt'      => $item['alt'] ?? '',
		'loading'  => $args['eager'] ? 'eager' : 'lazy',
		'decoding' => 'async',
	);
	if ( $args['class'] ) {
		$attrs['class'] = $args['class'];
	}
	if ( $args['eager'] ) {
		$attrs['fetchpriority'] = 'high';
	}

	if ( ! empty( $item['id'] ) ) {
		if ( $args['sizes'] ) {
			$attrs['sizes'] = $args['sizes'];
		}
		echo wp_get_attachment_image( $item['id'], $item['size'], false, $attrs );
		return;
	}

	$html = '';
	foreach ( $attrs as $name => $value ) {
		$html .= sprintf( ' %s="%s"', $name, esc_attr( $value ) );
	}
	printf( '<img src="%s"%s>', esc_url( ipb_src( $item['src'] ) ), $html ); // phpcs:ignore WordPress.Security.EscapeOutput -- атрибуты экранированы выше
}

/** Файл для крупного просмотра (лайтбокс, большое фото галереи) */
function ipb_full( $item ) {
	return ipb_src( $item['full'] ?? $item['src'] );
}

/** Декоративная иконка, скринридер её пропускает */
function ipb_icon( $name, $class = '' ) {
	printf( '<span class="icon icon--%s%s" aria-hidden="true"></span>', esc_attr( $name ), $class ? ' ' . esc_attr( $class ) : '' );
}

/** Ссылка, если адрес валидный (http, mailto, tel, #), иначе просто текст */
function ipb_link( $text, $href, $class = '' ) {
	$class = $class ? ' class="' . esc_attr( $class ) . '"' : '';
	if ( preg_match( '/^(https?:|mailto:|tel:|#)/i', (string) $href ) ) {
		printf( '<a%s href="%s">%s</a>', $class, esc_url( $href, array( 'http', 'https', 'mailto', 'tel' ) ), esc_html( $text ) );
	} else {
		printf( '<span%s>%s</span>', $class, esc_html( $text ) );
	}
}

/** Ссылка на политику: страница из «Настройки → Конфиденциальность» */
function ipb_policy_url() {
	return get_privacy_policy_url() ?: '#';
}
