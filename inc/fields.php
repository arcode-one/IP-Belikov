<?php
/**
 * Админка «Контент сайта» на Secure Custom Fields. Поля описаны здесь, в коде,
 * поэтому живут в git вместе с темой и не требуют экспорта на прод.
 */

defined( 'ABSPATH' ) || exit;

// Поля задаются только кодом: меню SCF клиенту ни к чему
add_filter( 'acf/settings/show_admin', '__return_false' );

add_action( 'acf/init', function () {
	acf_add_options_page( array(
		'page_title' => 'Контент сайта',
		'menu_title' => 'Контент сайта',
		'menu_slug'  => 'ipb-content',
		'capability' => 'edit_pages',
		'position'   => 3,
		'icon_url'   => 'dashicons-edit-page',
		'redirect'   => false,
		'autoload'   => true,
		'update_button'   => 'Сохранить',
		'updated_message' => 'Сохранено',
	) );

	$tab   = static function ( $key, $label ) {
		return array( 'key' => "field_ipb_tab_$key", 'label' => $label, 'type' => 'tab', 'placement' => 'left' );
	};
	$text  = static function ( $name, $label, $extra = array() ) {
		return array_merge( array( 'key' => "field_ipb_$name", 'name' => $name, 'label' => $label, 'type' => 'text' ), $extra );
	};
	$image = static function ( $name, $label, $extra = array() ) {
		return array_merge( array(
			'key'           => "field_ipb_$name",
			'name'          => $name,
			'label'         => $label,
			'type'          => 'image',
			'return_format' => 'id',
			'preview_size'  => 'medium',
			'library'       => 'all',
		), $extra );
	};
	$alt_hint = 'Подписи для поисковиков и незрячих (alt) задаются у самих фото: нажмите на фото → «Альтернативный текст».';

	acf_add_local_field_group( array(
		'key'      => 'group_ipb_content',
		'title'    => 'Контент сайта',
		'style'    => 'seamless',
		'location' => array( array( array( 'param' => 'options_page', 'operator' => '==', 'value' => 'ipb-content' ) ) ),
		'fields'   => array(
			$tab( 'contacts', 'Контакты' ),
			$text( 'name', 'Название (в шапке и в микроразметке)' ),
			$text( 'address', 'Адрес' ),
			$text( 'phone', 'Телефон', array( 'instructions' => 'Как показывать на сайте, например 8 923 437 78 88. Ссылку для звонка сайт сделает сам.' ) ),
			array( 'key' => 'field_ipb_email', 'name' => 'email', 'label' => 'Email', 'type' => 'email', 'instructions' => 'Сюда же приходят заявки с формы, если ниже во вкладке «Форма и cookies» не указан другой адрес.' ),
			$text( 'socials_title', 'Подпись к соцсетям в подвале' ),
			array(
				'key'          => 'field_ipb_socials',
				'name'         => 'socials',
				'label'        => 'Соцсети',
				'type'         => 'repeater',
				'layout'       => 'table',
				'button_label' => 'Добавить соцсеть',
				'sub_fields'   => array(
					array( 'key' => 'field_ipb_social_id', 'name' => 'id', 'label' => 'Сеть', 'type' => 'select', 'choices' => array( 'vk' => 'ВКонтакте', 'max' => 'MAX' ) ),
					array( 'key' => 'field_ipb_social_href', 'name' => 'href', 'label' => 'Ссылка', 'type' => 'url' ),
				),
			),

			$tab( 'hero', 'Шапка' ),
			$image( 'hero_image', 'Главное фото', array( 'instructions' => 'Широкое фото не меньше 1600 px по ширине.' ) ),
			array( 'key' => 'field_ipb_title', 'name' => 'title', 'label' => 'Заголовок крупно', 'type' => 'textarea', 'rows' => 2, 'new_lines' => '', 'instructions' => 'Каждая строка — с новой строки.' ),
			array( 'key' => 'field_ipb_subtitle', 'name' => 'subtitle', 'label' => 'Подзаголовок', 'type' => 'textarea', 'rows' => 2, 'new_lines' => '', 'instructions' => 'Каждая строка — с новой строки.' ),

			$tab( 'products', 'Виды изделий' ),
			$text( 'products_title', 'Заголовок блока' ),
			array(
				'key'          => 'field_ipb_products',
				'name'         => 'products',
				'label'        => 'Изделия',
				'type'         => 'repeater',
				'layout'       => 'table',
				'button_label' => 'Добавить изделие',
				'instructions' => 'Порядок меняется перетаскиванием. Если не добавить ни одного, блок скроется.',
				'sub_fields'   => array(
					$image( 'image', 'Картинка' ),
					$text( 'title', 'Название' ),
				),
			),

			$tab( 'works', 'Галерея работ' ),
			$text( 'works_title', 'Заголовок блока' ),
			array( 'key' => 'field_ipb_works', 'name' => 'works', 'label' => 'Фото работ', 'type' => 'gallery', 'return_format' => 'id', 'preview_size' => 'medium', 'insert' => 'prepend', 'instructions' => 'Новые фото добавляются в начало. ' . $alt_hint ),

			$tab( 'equipment', 'Оборудование' ),
			$text( 'equipment_title', 'Заголовок блока' ),
			array(
				'key'          => 'field_ipb_equipment',
				'name'         => 'equipment',
				'label'        => 'Оборудование',
				'type'         => 'repeater',
				'layout'       => 'table',
				'button_label' => 'Добавить фото',
				'instructions' => $alt_hint,
				'sub_fields'   => array(
					$image( 'image', 'Фото' ),
					$text( 'caption', 'Подпись на фото' ),
				),
			),

			$tab( 'notes', 'Полезные заметки' ),
			$text( 'notes_title', 'Заголовок блока' ),
			array( 'key' => 'field_ipb_notes', 'name' => 'notes', 'label' => 'Заметки (картинки с текстом)', 'type' => 'gallery', 'return_format' => 'id', 'preview_size' => 'medium', 'insert' => 'prepend', 'instructions' => 'Новые заметки добавляются в начало. Текст заметки продублируйте в «Альтернативный текст» картинки — так его увидят поисковики.' ),

			$tab( 'about', 'О нас' ),
			$text( 'about_title', 'Заголовок блока' ),
			array( 'key' => 'field_ipb_about_text', 'name' => 'about_text', 'label' => 'Текст', 'type' => 'textarea', 'rows' => 10, 'new_lines' => '', 'instructions' => 'Абзацы разделяйте пустой строкой.' ),

			$tab( 'form', 'Форма и cookies' ),
			$text( 'contact_title', 'Заголовок блока с формой' ),
			array( 'key' => 'field_ipb_contact_lead', 'name' => 'contact_lead', 'label' => 'Текст над формой', 'type' => 'textarea', 'rows' => 2, 'new_lines' => '' ),
			$text( 'consent_text', 'Текст согласия', array( 'instructions' => 'В конце сама добавится ссылка «политикой конфиденциальности».' ) ),
			$text( 'submit_label', 'Текст кнопки' ),
			$text( 'success_message', 'Сообщение после отправки' ),
			array( 'key' => 'field_ipb_leads_email', 'name' => 'leads_email', 'label' => 'Куда приходят заявки', 'type' => 'email', 'instructions' => 'Если пусто — на email из вкладки «Контакты».' ),
			array( 'key' => 'field_ipb_cookie_text', 'name' => 'cookie_text', 'label' => 'Текст плашки о cookies', 'type' => 'textarea', 'rows' => 3, 'new_lines' => '', 'instructions' => 'В конце сама добавится ссылка «политикой обработки персональных данных».' ),
			$text( 'cookie_button', 'Кнопка на плашке' ),

			$tab( 'seo', 'SEO' ),
			$text( 'seo_title', 'Заголовок вкладки (title)', array( 'required' => 1, 'maxlength' => 70, 'instructions' => 'Главное, что видно в поиске. До 60–70 символов.' ) ),
			array( 'key' => 'field_ipb_seo_description', 'name' => 'seo_description', 'label' => 'Описание (description)', 'type' => 'textarea', 'rows' => 3, 'new_lines' => '', 'required' => 1, 'maxlength' => 200, 'instructions' => 'Текст под заголовком в поиске и в превью ссылки. До 160 символов.' ),
			$text( 'og_title', 'Заголовок превью в мессенджерах' ),
			$image( 'og_image', 'Картинка превью в мессенджерах', array( 'instructions' => '1200 × 630 px. Если пусто, берётся картинка из темы.' ) ),
		),
	) );
} );
