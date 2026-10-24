<?php
/**
 * Галерея: блок 2 (работы) и блок 4 (заметки). Здесь только миниатюры,
 * большое фото и колонку вокруг них собирает assets/js/components/gallery.js.
 * data-full — файл для крупного просмотра.
 *
 * @var array $args { id: works|notes }
 */

$id   = $args['id'];
$data = ipb_content()[ $id ];
if ( empty( $data['items'] ) ) {
	return;
}
?>
<section class="section" id="<?php echo esc_attr( $id ); ?>" aria-labelledby="<?php echo esc_attr( $id ); ?>-title">
	<h2 class="section__title" id="<?php echo esc_attr( $id ); ?>-title"><?php echo esc_html( $data['title'] ); ?></h2>
	<div class="<?php echo esc_attr( $id ); ?>">
		<?php foreach ( $data['items'] as $i => $item ) : ?>
			<button class="side-list__thumb" type="button" aria-label="<?php echo esc_attr( sprintf( 'Показать фото %d', $i + 1 ) ); ?>" data-full="<?php echo esc_url( ipb_full( $item ) ); ?>">
				<?php ipb_image( $item, array( 'sizes' => '170px' ) ); ?>
			</button>
		<?php endforeach; ?>
	</div>
</section>
