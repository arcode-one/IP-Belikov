<?php
/**
 * Блок 3. Оборудование. Ленту и стрелки собирает assets/js/blocks/equipment.js,
 * data-full — файл для крупного просмотра
 */

$data = ipb_content()['equipment'];
if ( empty( $data['items'] ) ) {
	return;
}
?>
<section class="section" id="equipment" aria-labelledby="equipment-title">
	<h2 class="section__title" id="equipment-title"><?php echo esc_html( $data['title'] ); ?></h2>
	<div class="equipment slider">
		<?php foreach ( $data['items'] as $i => $item ) : ?>
			<button class="equipment__item" type="button" aria-label="<?php echo esc_attr( sprintf( 'Увеличить фото %d', $i + 1 ) ); ?>" aria-haspopup="dialog" data-index="<?php echo (int) $i; ?>" data-full="<?php echo esc_url( ipb_full( $item ) ); ?>">
				<?php ipb_image( $item, array( 'sizes' => '(max-width: 560px) 100vw, (max-width: 860px) 50vw, 380px' ) ); ?>
				<span class="equipment__zoom"><?php ipb_icon( 'maximize' ); ?></span>
				<?php if ( ! empty( $item['caption'] ) ) : ?>
					<span class="equipment__caption"><?php echo esc_html( $item['caption'] ); ?></span>
				<?php endif; ?>
			</button>
		<?php endforeach; ?>
	</div>
</section>
