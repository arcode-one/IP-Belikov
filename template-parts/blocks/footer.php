<?php
/**
 * Подвал: контакты и соцсети
 */

$c = ipb_content();
?>
<footer class="footer">
	<div class="footer__contacts">
		<?php ipb_link( $c['address'], '' ); ?>
		<?php ipb_link( 'тел. ' . $c['phone']['text'], $c['phone']['href'] ); ?>
		<?php ipb_link( $c['email']['text'], $c['email']['href'] ); ?>
	</div>
	<div class="footer__social">
		<p class="footer__social-title">Мы в соц. сетях:</p>
		<nav class="footer__social-links" aria-label="Социальные сети и мессенджеры">
			<?php foreach ( $c['socials'] as $social ) : ?>
				<a class="social social--<?php echo esc_attr( $social['id'] ); ?>" href="<?php echo esc_url( $social['href'] ); ?>" aria-label="<?php echo esc_attr( $social['text'] ); ?>" title="<?php echo esc_attr( $social['text'] ); ?>" target="_blank" rel="noopener"><?php ipb_icon( $social['id'] ); ?></a>
			<?php endforeach; ?>
		</nav>
	</div>
</footer>
