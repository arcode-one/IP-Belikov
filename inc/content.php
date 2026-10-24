<?php
/**
 * Контент главной. Источник — админка «Контент сайта» (inc/fields.php).
 * Шаблоны берут данные только через ipb_content().
 *
 * Запасной контент ниже показывается, если поле пустое или плагин SCF выключен,
 * а для списков фото — если их ни разу не сохраняли (пустой сохранённый список скрывает блок).
 */

defined( 'ABSPATH' ) || exit;

function ipb_content() {
	static $content = null;
	if ( null === $content ) {
		$content = function_exists( 'get_field' ) ? ipb_content_from_fields( ipb_default_content() ) : ipb_default_content();

		// Ссылки и контакты в шапке собираем из основных полей
		$content['phone']['href']   = 'tel:+7' . substr( preg_replace( '/\D/', '', $content['phone']['text'] ), -10 );
		$content['email']['href']   = 'mailto:' . $content['email']['text'];
		$content['header_contacts'] = array(
			array( 'text' => $content['address'], 'href' => '' ),
			array( 'text' => 'тел. ' . $content['phone']['text'], 'href' => $content['phone']['href'] ),
		);
	}
	return $content;
}

/** Фото из медиатеки. alt пустой → подпись фото → $alt_fallback, чтобы в HTML не было alt="" */
function ipb_attachment( $id, $size, $alt_fallback = '' ) {
	$src = $id ? wp_get_attachment_image_url( $id, $size ) : false;
	if ( ! $src ) {
		return null;
	}
	$alt = trim( (string) get_post_meta( $id, '_wp_attachment_image_alt', true ) );
	if ( '' === $alt ) {
		$alt = trim( (string) wp_get_attachment_caption( $id ) ) ?: $alt_fallback;
	}
	return array(
		'id'   => (int) $id,
		'size' => $size,
		'src'  => $src,
		'full' => wp_get_attachment_image_url( $id, '1536x1536' ),
		'alt'  => $alt,
	);
}

function ipb_content_from_fields( $c ) {
	$text  = static function ( $name ) {
		return trim( (string) get_field( $name, 'option' ) );
	};
	$lines = static function ( $value ) {
		// Флаг u обязателен: без него \R режет кириллицу (байт \x85 внутри буквы «х»)
		return array_values( array_filter( array_map( 'trim', preg_split( '/\R/u', $value ) ) ) );
	};
	// Список фото ни разу не сохраняли — показываем запасной
	$saved = static function ( $name ) {
		return false !== get_option( "options_$name" );
	};

	foreach ( array( 'name', 'address' ) as $key ) {
		$c[ $key ] = $text( $key ) ?: $c[ $key ];
	}
	$c['phone']['text'] = $text( 'phone' ) ?: $c['phone']['text'];
	$c['email']['text'] = $text( 'email' ) ?: $c['email']['text'];

	if ( $saved( 'socials' ) ) {
		$c['socials'] = array();
		foreach ( (array) get_field( 'socials', 'option' ) as $row ) {
			if ( ! empty( $row['href'] ) ) {
				$c['socials'][] = array( 'id' => $row['id'], 'text' => 'vk' === $row['id'] ? 'ВКонтакте' : 'MAX', 'href' => $row['href'] );
			}
		}
	}

	// Шапка
	$c['title']    = $lines( $text( 'title' ) ) ?: $c['title'];
	$c['subtitle'] = $lines( $text( 'subtitle' ) ) ?: $c['subtitle'];
	$c['hero']     = ipb_attachment( get_field( 'hero_image', 'option' ), 'full', implode( ' ', array_merge( $c['title'], $c['subtitle'] ) ) ) ?: $c['hero'];

	foreach ( array( 'products', 'works', 'equipment', 'notes' ) as $block ) {
		$c[ $block ]['title'] = $text( "{$block}_title" ) ?: $c[ $block ]['title'];
	}

	// Изделия: название под картинкой, поэтому alt у картинки пустой
	if ( $saved( 'products' ) ) {
		$c['products']['items'] = array();
		foreach ( (array) get_field( 'products', 'option' ) as $row ) {
			$item = ipb_attachment( $row['image'] ?? 0, 'medium_large' );
			if ( $item && ! empty( $row['title'] ) ) {
				$c['products']['items'][] = array_merge( $item, array( 'alt' => '', 'title' => $row['title'] ) );
			}
		}
	}

	// Галереи работ и заметок
	foreach ( array( 'works' => 'фото', 'notes' => 'заметка' ) as $block => $noun ) {
		if ( $saved( $block ) ) {
			$c[ $block ]['items'] = array();
			foreach ( (array) get_field( $block, 'option' ) as $i => $id ) {
				$item = ipb_attachment( $id, 'medium', sprintf( '%s, %s %d', $c[ $block ]['title'], $noun, $i + 1 ) );
				if ( $item ) {
					$c[ $block ]['items'][] = $item;
				}
			}
		}
	}

	if ( $saved( 'equipment' ) ) {
		$c['equipment']['items'] = array();
		foreach ( (array) get_field( 'equipment', 'option' ) as $row ) {
			$caption = trim( (string) ( $row['caption'] ?? '' ) );
			$item    = ipb_attachment( $row['image'] ?? 0, 'medium_large', $caption ?: $c['equipment']['title'] );
			if ( $item ) {
				$c['equipment']['items'][] = array_merge( $item, array( 'caption' => $caption ) );
			}
		}
	}

	// О нас: абзацы через пустую строку
	$c['about']['title'] = $text( 'about_title' ) ?: $c['about']['title'];
	$about               = array_filter( array_map( 'trim', preg_split( '/\R\s*\R/u', $text( 'about_text' ) ) ) );
	if ( $about ) {
		$c['about']['paragraphs'] = array_map( static fn( $p ) => preg_replace( '/\s*\R\s*/u', ' ', $p ), array_values( $about ) );
	}

	$c['socials_title'] = $text( 'socials_title' ) ?: $c['socials_title'];
	foreach ( $c['form'] as $key => $value ) {
		$c['form'][ $key ] = $text( $key ) ?: $value;
	}
	foreach ( $c['cookie'] as $key => $value ) {
		$c['cookie'][ $key ] = $text( "cookie_$key" ) ?: $value;
	}

	$c['seo']['title']       = $text( 'seo_title' ) ?: $c['seo']['title'];
	$c['seo']['description'] = $text( 'seo_description' ) ?: $c['seo']['description'];
	$c['seo']['og_title']    = $text( 'og_title' ) ?: $c['seo']['og_title'];
	$og                      = ipb_attachment( get_field( 'og_image', 'option' ), 'full' );
	if ( $og ) {
		$c['seo']['og_image'] = $og['src'];
	}

	return $c;
}

/** Запасной контент (он же залит в админку при первом запуске) */
function ipb_default_content() {
	return array(
		// Заголовок вкладки, описание для поисковиков и превью ссылки в мессенджерах
		'seo'            => array(
			'title'                => 'Деревянные окна, двери и реставрация в Томске · ИП Беликов',
			'description'          => 'Изготовление деревянных окон, дверей, наличников и реставрация объектов культурного наследия в Томске с 1998 года.',
			'site_name'            => 'ИП Беликов А. В.',
			'og_title'             => 'Деревянные окна, двери и реставрация в Томске',
			'og_image'             => 'assets/img/og/og-image.jpg',
			'business_description' => 'Изготовление деревянных окон, дверей, наличников и реставрация объектов культурного наследия',
			'telephone'            => '+7-923-437-78-88',
			'founding_date'        => '1998',
			'address'              => array(
				'@type'           => 'PostalAddress',
				'streetAddress'   => 'ул. Профсоюзная, 2/36',
				'addressLocality' => 'Томск',
				'addressRegion'   => 'Томская область',
				'addressCountry'  => 'RU',
			),
		),
		'name'           => 'ИП Беликов Александр Вячеславович',
		'address'        => 'г. Томск, ул. Профсоюзная 2/36',
		// Ссылки tel: и mailto: ipb_content() собирает сама
		'phone'          => array( 'text' => '8 923 437 78 88' ),
		'email'          => array( 'text' => 'zakaz@easy-wood.ru' ),
		'hero'           => array( 'src' => 'assets/img/hero/hero.webp', 'alt' => 'Фасад деревянного дома в Томске с резными наличниками и белыми окнами' ),
		// H1 поверх главного фото: две строки крупно и подстрока
		'title'          => array( 'Изготовление', 'и реставрация' ),
		'subtitle'       => array( 'деревянных окон, дверей', 'и объектов культурного наследия' ),
		// О нас (перед формой)
		'about'          => array(
			'title'      => 'О нас',
			'paragraphs' => array(
				'Мы работаем в Томске с 1998 года. Специализируемся на изготовлении деревянных окон, дверей и иных изделий из дерева и реставрации исторических зданий. Наше производство полного цикла — от сушки древесины в собственных сушильных камерах до покраски промышленными методами.',
				'Для изготовления используем массив дерева, клееный и сращенный брусок. Работаем на европейском оборудовании с соблюдением всех технологических требований и с контролем качества на каждом этапе производства.',
				'Среди наших преимуществ: индивидуальный подход, высокое качество, гарантия, соблюдение сроков, официальный договор, сопровождение в реставрации и ремонте.',
			),
		),
		// Блок 1. Порядок как на макете: первыми видны наличники, резьба, лестница
		'products'       => array(
			'title' => 'Виды изделий',
			'items' => array(
				array( 'title' => 'Наличники на окна и двери', 'src' => 'assets/img/products/nalichniki.webp' ),
				array( 'title' => 'Резьба и фронтоны', 'src' => 'assets/img/products/rezba.webp' ),
				array( 'title' => 'Лестница с балюстрадой', 'src' => 'assets/img/products/lestnica.webp' ),
				array( 'title' => 'Деревянные окна', 'src' => 'assets/img/products/okna.webp' ),
				array( 'title' => 'Деревянные двери', 'src' => 'assets/img/products/dveri.webp' ),
				array( 'title' => 'Колоды (обсады)', 'src' => 'assets/img/products/kolody.webp' ),
				array( 'title' => 'Вагонка (и др. погонаж)', 'src' => 'assets/img/products/vagonka.webp' ),
			),
		),
		// Блок 2. Свежие фото первыми; alt — что на фото и адрес объекта (адреса впечатаны в сами фото)
		'works'          => array(
			'title' => 'Галерея выполненных работ',
			'items' => array(
				array( 'src' => 'assets/img/works/work-16.webp', 'alt' => 'Деревянное окно в интерьере, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-15.webp', 'alt' => 'Столы с точёными ножками в интерьере, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-14.webp', 'alt' => 'Резной карниз с подсветкой в интерьере, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-13.webp', 'alt' => 'Деревянная межкомнатная дверь, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-12.webp', 'alt' => 'Резные наличники на фасаде, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-11.webp', 'alt' => 'Наличник и балкон с точёными балясинами, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-10.webp', 'alt' => 'Наличник и деревянная входная дверь, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-09.webp', 'alt' => 'Фасад бревенчатого дома с наличниками, Томск, ул. Пушкина, 24' ),
				array( 'src' => 'assets/img/works/work-08.webp', 'alt' => 'Резной наличник и деревянное окно, Томск, пер. Кустарный, 4' ),
				array( 'src' => 'assets/img/works/work-07.webp', 'alt' => 'Фасад с наличниками и резным карнизом, Томск, пер. Кустарный, 4' ),
				array( 'src' => 'assets/img/works/work-06.webp', 'alt' => 'Наружная лестница с резным декором, Томск, пер. Кустарный, 4' ),
				array( 'src' => 'assets/img/works/work-05.webp', 'alt' => 'Отреставрированный фасад с наличниками, Томск, пер. Кустарный, 4' ),
				array( 'src' => 'assets/img/works/work-04.webp', 'alt' => 'Резной наличник на окно, Томск, ул. Красноармейская, 12а' ),
				array( 'src' => 'assets/img/works/work-03.webp', 'alt' => 'Фасад с резными наличниками после реставрации, Томск, ул. Красноармейская, 12а' ),
				array( 'src' => 'assets/img/works/work-02.webp', 'alt' => 'Резной фронтон и наличники, Томск, ул. Красноармейская, 12а' ),
				array( 'src' => 'assets/img/works/work-01.webp', 'alt' => 'Фасад деревянного дома с резными наличниками и фронтонами, Томск, ул. Красноармейская, 12а' ),
			),
		),
		// Блок 3
		'equipment'      => array(
			'title' => 'Оборудование',
			'items' => array(
				array( 'src' => 'assets/img/equipment/equipment-01.webp', 'alt' => 'Сушильные камеры KATRES для камерной сушки древесины', 'caption' => 'Сушим дерево' ),
				array( 'src' => 'assets/img/equipment/equipment-02.webp', 'alt' => 'Четырёхсторонний строгальный станок Weinig Powermat 2000', 'caption' => 'Строгаем брусок' ),
				array( 'src' => 'assets/img/equipment/equipment-03.webp', 'alt' => 'Сканер для контроля качества и оптимизации древесины', 'caption' => 'Вырезаем дефекты' ),
				array( 'src' => 'assets/img/equipment/equipment-04.webp', 'alt' => 'Линия сращивания бруска GreCon', 'caption' => 'Сращиваем брусок' ),
				array( 'src' => 'assets/img/equipment/equipment-05.webp', 'alt' => 'Пресс ProfiPress 4500 для склейки бруса', 'caption' => 'Склеиваем брус' ),
				array( 'src' => 'assets/img/equipment/equipment-06.webp', 'alt' => 'Обрабатывающий центр с ЧПУ для изготовления окон', 'caption' => 'Изготавливаем окна' ),
				array( 'src' => 'assets/img/equipment/equipment-07.webp', 'alt' => 'Обрабатывающий центр с ЧПУ Format-4', 'caption' => 'Обрабатываем детали' ),
				array( 'src' => 'assets/img/equipment/equipment-08.webp', 'alt' => 'Линия покраски Makor', 'caption' => 'Красим изделия' ),
			),
		),
		// Блок 4. Текст заметки впечатан в картинку (так у заказчика); свежие заметки первыми
		'notes'          => array(
			'title' => 'Полезные заметки',
			'items' => array(
				array( 'src' => 'assets/img/notes/kleeny-brusok.webp', 'alt' => 'В чём разница между клеёным и цельным (строганным) бруском: цельный брусок выпилен из бревна или доски без склейки по длине' ),
				array( 'src' => 'assets/img/notes/okna-ekologichnost.webp', 'alt' => 'Деревянное окно в бревенчатом доме: окна из дерева становятся популярнее благодаря экологичности и естественному воздухообмену' ),
			),
		),
		// Блок «Напишите нам». Пустой leads_email — заявки идут на email из контактов
		'form'           => array(
			'contact_title'   => 'Напишите нам',
			'contact_lead'    => 'Если у Вас есть какие-либо вопросы — заполните форму ниже, и мы с Вами свяжемся.',
			'consent_text'    => 'Согласен на обработку персональных данных в соответствии с',
			'submit_label'    => 'Отправить',
			'success_message' => 'Спасибо! Сообщение отправлено, мы скоро свяжемся с вами.',
			'leads_email'     => '',
		),
		// Плашка о cookies, ссылка на политику добавляется в конце текста
		'cookie'         => array(
			'text'   => 'Мы используем файлы cookies и обрабатываем персональные данные, чтобы сайт работал корректно. Продолжая пользоваться сайтом, вы соглашаетесь с',
			'button' => 'Согласен',
		),
		'socials_title'  => 'Мы в соц. сетях:',
		'socials'        => array(
			array( 'id' => 'vk', 'text' => 'ВКонтакте', 'href' => 'https://vk.ru/belikov_70' ),
			array( 'id' => 'max', 'text' => 'MAX', 'href' => 'https://max.ru/u/f9LHodD0cOJBZn1jFNjC21VRcTMfF4meoePWZ_4RlE5FCegSaMcdsqHrvuk' ),
		),
	);
}
