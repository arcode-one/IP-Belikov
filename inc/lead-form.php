<?php
/**
 * Заявки с формы «Напишите нам»: POST /wp-json/ip-belikov/v1/lead → письмо на почту из контента
 */

defined( 'ABSPATH' ) || exit;

add_action( 'rest_api_init', function () {
	register_rest_route( 'ip-belikov/v1', '/lead', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'ipb_handle_lead',
	) );
} );

function ipb_handle_lead( WP_REST_Request $request ) {
	$str  = static function ( $key, $max ) use ( $request ) {
		$value = $request->get_param( $key );
		return is_string( $value ) ? mb_substr( trim( $value ), 0, $max ) : '';
	};
	$lead = array(
		'name'    => sanitize_text_field( $str( 'name', 100 ) ),
		'email'   => sanitize_email( $str( 'email', 120 ) ),
		'phone'   => sanitize_text_field( $str( 'phone', 20 ) ),
		'message' => sanitize_textarea_field( $str( 'message', 2000 ) ),
	);

	// Скрытое поле заполняют только боты: отвечаем «ок», но ничего не отправляем
	if ( '' !== $str( 'website', 200 ) ) {
		return array( 'ok' => true );
	}

	// Нужны имя, согласие и хотя бы один способ связи
	$email_ok = is_email( $lead['email'] );
	$phone_ok = 11 === strlen( preg_replace( '/\D/', '', $lead['phone'] ) );
	if ( mb_strlen( $lead['name'] ) < 2 || ! ( $email_ok || $phone_ok ) || true !== $request->get_param( 'consent' ) ) {
		return new WP_REST_Response( array( 'ok' => false ), 422 );
	}

	$body = implode( "\n", array(
		'Имя: ' . $lead['name'],
		'Телефон: ' . ( $lead['phone'] ?: '—' ),
		'Email: ' . ( $lead['email'] ?: '—' ),
		'',
		$lead['message'] ?: '(без сообщения)',
	) );
	$headers = $email_ok ? array( 'Reply-To: ' . $lead['name'] . ' <' . $lead['email'] . '>' ) : array();

	if ( ! wp_mail( ipb_content()['email']['text'], 'Заявка с сайта: ' . $lead['name'], $body, $headers ) ) {
		return new WP_REST_Response( array( 'ok' => false ), 500 );
	}
	return array( 'ok' => true );
}
