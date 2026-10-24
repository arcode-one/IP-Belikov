<?php
/**
 * Главная. Блоки лежат в template-parts/blocks, поведение — в assets/js
 */

get_header();
get_template_part( 'template-parts/blocks/hero' );
?>
<main id="main">
	<?php
	get_template_part( 'template-parts/blocks/products' );
	get_template_part( 'template-parts/blocks/gallery', null, array( 'id' => 'works' ) );
	get_template_part( 'template-parts/blocks/equipment' );
	get_template_part( 'template-parts/blocks/gallery', null, array( 'id' => 'notes' ) );
	get_template_part( 'template-parts/blocks/about' );
	get_template_part( 'template-parts/blocks/contact' );
	?>
</main>
<?php
get_template_part( 'template-parts/blocks/footer' );
get_footer( null, array( 'overlays' => true ) );
