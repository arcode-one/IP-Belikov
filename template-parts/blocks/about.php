<?php
/**
 * О нас
 */

$about = ipb_content()['about'];
?>
<section class="about" id="about" aria-labelledby="about-title">
	<h2 class="about__title" id="about-title"><?php echo esc_html( $about['title'] ); ?></h2>
	<div class="about__text">
		<?php foreach ( $about['paragraphs'] as $paragraph ) : ?>
			<p class="about__paragraph"><?php echo esc_html( $paragraph ); ?></p>
		<?php endforeach; ?>
	</div>
</section>
