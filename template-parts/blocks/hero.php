<?php
/**
 * Шапка: имя и контакты над фото, H1 поверх главного фото
 */

$c = ipb_content();

// Строки H1 с переносами как в макете
$lines = static function ( $list ) {
	return implode( '<br>', array_map( 'esc_html', $list ) );
};
?>
<header class="hero">
	<div class="hero__bar">
		<p class="hero__brand"><?php echo esc_html( $c['name'] ); ?></p>
		<div class="hero__contacts">
			<?php foreach ( $c['header_contacts'] as $contact ) : ?>
				<?php ipb_link( $contact['text'], $contact['href'] ); ?>
			<?php endforeach; ?>
		</div>
	</div>
	<div class="hero__image">
		<?php ipb_image( $c['hero'], array( 'eager' => true, 'sizes' => IPB_HERO_SIZES ) ); ?>
		<h1 class="hero__title">
			<span class="hero__title-main"><?php echo $lines( $c['title'] ); // phpcs:ignore WordPress.Security.EscapeOutput -- экранировано в $lines ?></span>
			<span class="hero__title-sub"><?php echo $lines( $c['subtitle'] ); // phpcs:ignore WordPress.Security.EscapeOutput ?></span>
		</h1>
	</div>
</header>
