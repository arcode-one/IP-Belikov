<?php
/**
 * Блок 1. Виды изделий. Ленту, стрелки и счётчик собирает assets/js/blocks/products.js
 */

$data = ipb_content()['products'];
if ( empty( $data['items'] ) ) {
	return;
}
?>
<section class="section" id="products" aria-labelledby="products-title">
	<h2 class="section__title section__title--plain" id="products-title"><?php echo esc_html( $data['title'] ); ?></h2>
	<div class="products slider">
		<?php foreach ( $data['items'] as $item ) : ?>
			<div class="products__item">
				<?php ipb_image( array_merge( $item, array( 'alt' => '' ) ), array( 'class' => 'products__image', 'sizes' => '(max-width: 560px) 50vw, (max-width: 860px) 34vw, 230px' ) ); ?>
				<h2 class="products__title"><?php echo esc_html( $item['title'] ); ?></h2>
			</div>
		<?php endforeach; ?>
	</div>
</section>
