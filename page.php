<?php
/**
 * Обычная страница. Разметка как у политики: главная открывает её во всплывающем окне
 * и ищет .policy, .policy__title и .policy__back (assets/js/components/policy-dialog.js)
 */

get_header();
?>
<main id="main">
	<?php
	while ( have_posts() ) :
		the_post();
		?>
		<article class="policy policy--page">
			<a class="policy__back" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php ipb_icon( 'arrow-left' ); ?>На главную</a>
			<h1 class="policy__title"><?php the_title(); ?></h1>
			<div class="policy__content">
				<?php the_content(); ?>
			</div>
			<a class="policy__back" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php ipb_icon( 'arrow-left' ); ?>На главную</a>
		</article>
	<?php endwhile; ?>
</main>
<?php
get_footer();
