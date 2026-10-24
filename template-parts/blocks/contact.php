<?php
/**
 * Напишите нам: контакты и форма заявки (отправка — inc/lead-form.php)
 */

$c    = ipb_content();
$form = $c['form'];
$rows = array(
	array( 'map-pin', 'Адрес', $c['address'], '' ),
	array( 'phone', 'Телефон', $c['phone']['text'], $c['phone']['href'] ),
	array( 'mail', 'Email', $c['email']['text'], $c['email']['href'] ),
);
?>
<section class="contact" id="contact" aria-labelledby="contact-title">
	<div class="contact__box">
		<h2 class="contact__title" id="contact-title"><?php echo esc_html( $form['contact_title'] ); ?></h2>
		<div class="contact__layout">
			<ul class="contact__list">
				<?php foreach ( $rows as list( $icon, $label, $text, $href ) ) : ?>
					<li class="contact__item">
						<?php ipb_icon( $icon, 'contact__icon' ); ?>
						<span class="contact__label"><?php echo esc_html( $label ); ?></span>
						<?php ipb_link( $text, $href ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
			<div>
				<p class="contact__lead"><?php echo esc_html( $form['contact_lead'] ); ?></p>
				<form class="lead-form" novalidate data-endpoint="<?php echo esc_url( rest_url( 'ip-belikov/v1/lead' ) ); ?>" data-phone="<?php echo esc_attr( $c['phone']['text'] ); ?>" data-success="<?php echo esc_attr( $form['success_message'] ); ?>">
					<label class="lead-form__field">
						<span class="sr-only">Имя</span>
						<input class="lead-form__input" name="name" type="text" autocomplete="name" maxlength="100" placeholder="Ваше имя" required>
					</label>
					<label class="lead-form__field">
						<span class="sr-only">Email</span>
						<input class="lead-form__input" name="email" type="email" autocomplete="email" maxlength="120" placeholder="Ваш email">
					</label>
					<label class="lead-form__field">
						<span class="sr-only">Номер телефона</span>
						<input class="lead-form__input" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="Номер телефона">
					</label>
					<label class="lead-form__field">
						<span class="sr-only">Сообщение</span>
						<textarea class="lead-form__input lead-form__input--textarea" name="message" rows="4" maxlength="2000" placeholder="Сообщение"></textarea>
					</label>
					<!-- Ловушка для ботов: люди это поле не видят -->
					<label class="lead-form__hp" aria-hidden="true">Сайт <input name="website" type="text" tabindex="-1" autocomplete="off"></label>
					<label class="lead-form__consent">
						<input class="lead-form__checkbox" name="consent" type="checkbox" required>
						<span><?php echo esc_html( $form['consent_text'] ); ?> <a href="<?php echo esc_url( ipb_policy_url() ); ?>" data-policy>политикой конфиденциальности</a></span>
					</label>
					<div class="lead-form__footer">
						<button class="button lead-form__submit" type="submit"><?php echo esc_html( $form['submit_label'] ); ?><?php ipb_icon( 'send' ); ?></button>
						<p class="lead-form__status" role="status" aria-live="polite"></p>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
