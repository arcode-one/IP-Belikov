<?php
/**
 * Всплывающие элементы главной: плашка cookies, окно политики, просмотр фото
 */

$cookie = ipb_content()['cookie'];
?>
<div class="cookie" role="region" aria-label="Уведомление о cookies" hidden>
	<span class="cookie__icon"><?php ipb_icon( 'cookie' ); ?></span>
	<p class="cookie__text"><?php echo esc_html( $cookie['text'] ); ?> <a href="<?php echo esc_url( ipb_policy_url() ); ?>" data-policy>политикой обработки персональных данных</a>.</p>
	<button class="button cookie__button" type="button"><?php echo esc_html( $cookie['button'] ); ?></button>
</div>

<dialog class="policy-dialog" id="policy-dialog" aria-labelledby="policy-dialog-title">
	<button class="dialog-close" type="button" aria-label="Закрыть"><?php ipb_icon( 'x' ); ?></button>
	<div class="policy-dialog__body" tabindex="-1" autofocus></div>
</dialog>

<dialog class="lightbox" id="lightbox" aria-label="Просмотр изображения">
	<button class="dialog-close" type="button" aria-label="Закрыть просмотр"><?php ipb_icon( 'x' ); ?></button>
	<div class="lightbox__image" tabindex="-1" autofocus></div>
</dialog>
