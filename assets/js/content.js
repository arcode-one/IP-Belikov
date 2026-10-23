const content = {
  name: 'ИП Беликов Александр Вячеславович',
  // Контакты в шапке (справа над главным фото)
  headerContacts: [
    { text: 'г. Томск, ул. Профсоюзная 2/36', href: '' },
    { text: 'тел. 8 923 437 78 88', href: 'tel:+79234377888' },
  ],
  address: 'г. Томск, ул. Профсоюзная 2/36',
  phone: { text: '8 923 437 78 88', href: 'tel:+79234377888' },
  email: { text: 'zakaz@easy-wood.ru', href: 'mailto:zakaz@easy-wood.ru' },
  hero: { src: 'assets/img/hero/hero.webp', alt: 'Фасад деревянного дома в Томске с резными наличниками и белыми окнами' },
  // H1 поверх главного фото: две строки крупно и подстрока
  title: ['Изготовление', 'и реставрация'],
  subtitle: ['деревянных окон, дверей', 'и объектов культурного наследия'],
  // О нас (перед формой)
  about: {
    title: 'О нас',
    paragraphs: [
      'Мы работаем в Томске с 1998 года. Специализируемся на изготовлении деревянных окон, дверей и иных изделий из дерева и реставрации исторических зданий. Наше производство полного цикла — от сушки древесины в собственных сушильных камерах до покраски промышленными методами.',
      'Для изготовления используем массив дерева, клееный и сращенный брусок. Работаем на европейском оборудовании с соблюдением всех технологических требований и с контролем качества на каждом этапе производства.',
      'Среди наших преимуществ: индивидуальный подход, высокое качество, гарантия, соблюдение сроков, официальный договор, сопровождение в реставрации и ремонте.',
    ],
  },
  // Блок 1. Порядок как на макете: первыми видны наличники, резьба, лестница
  products: {
    title: 'Виды изделий',
    items: [
      { title: 'Наличники на окна и двери', src: 'assets/img/products/nalichniki.webp' },
      { title: 'Резьба и фронтоны', src: 'assets/img/products/rezba.webp' },
      { title: 'Лестница с балюстрадой', src: 'assets/img/products/lestnica.webp' },
      { title: 'Деревянные окна', src: 'assets/img/products/okna.webp' },
      { title: 'Деревянные двери', src: 'assets/img/products/dveri.webp' },
      { title: 'Колоды (обсады)', src: 'assets/img/products/kolody.webp' },
      { title: 'Вагонка (и др. погонаж)', src: 'assets/img/products/vagonka.webp' },
    ],
  },
  // Блок 2. Адреса объектов впечатаны в сами фото
  works: {
    title: 'Галерея выполненных работ',
    // Свежие фото первыми: work-16 — последнее загруженное, work-01 — самое первое.
    // alt — что на фото и адрес объекта (адреса впечатаны в сами фото)
    items: [
      { src: 'assets/img/works/work-16.webp', alt: 'Деревянное окно в интерьере, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-15.webp', alt: 'Столы с точёными ножками в интерьере, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-14.webp', alt: 'Резной карниз с подсветкой в интерьере, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-13.webp', alt: 'Деревянная межкомнатная дверь, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-12.webp', alt: 'Резные наличники на фасаде, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-11.webp', alt: 'Наличник и балкон с точёными балясинами, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-10.webp', alt: 'Наличник и деревянная входная дверь, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-09.webp', alt: 'Фасад бревенчатого дома с наличниками, Томск, ул. Пушкина, 24' },
      { src: 'assets/img/works/work-08.webp', alt: 'Резной наличник и деревянное окно, Томск, пер. Кустарный, 4' },
      { src: 'assets/img/works/work-07.webp', alt: 'Фасад с наличниками и резным карнизом, Томск, пер. Кустарный, 4' },
      { src: 'assets/img/works/work-06.webp', alt: 'Наружная лестница с резным декором, Томск, пер. Кустарный, 4' },
      { src: 'assets/img/works/work-05.webp', alt: 'Отреставрированный фасад с наличниками, Томск, пер. Кустарный, 4' },
      { src: 'assets/img/works/work-04.webp', alt: 'Резной наличник на окно, Томск, ул. Красноармейская, 12а' },
      { src: 'assets/img/works/work-03.webp', alt: 'Фасад с резными наличниками после реставрации, Томск, ул. Красноармейская, 12а' },
      { src: 'assets/img/works/work-02.webp', alt: 'Резной фронтон и наличники, Томск, ул. Красноармейская, 12а' },
      { src: 'assets/img/works/work-01.webp', alt: 'Фасад деревянного дома с резными наличниками и фронтонами, Томск, ул. Красноармейская, 12а' },
    ],
  },
  // Блок 3
  equipment: {
    title: 'Оборудование',
    items: [
      { src: 'assets/img/equipment/equipment-01.webp', alt: 'Сушильные камеры KATRES для камерной сушки древесины', caption: 'Сушим дерево' },
      { src: 'assets/img/equipment/equipment-02.webp', alt: 'Четырёхсторонний строгальный станок Weinig Powermat 2000', caption: 'Строгаем брусок' },
      { src: 'assets/img/equipment/equipment-03.webp', alt: 'Сканер для контроля качества и оптимизации древесины', caption: 'Вырезаем дефекты' },
      { src: 'assets/img/equipment/equipment-04.webp', alt: 'Линия сращивания бруска GreCon', caption: 'Сращиваем брусок' },
      { src: 'assets/img/equipment/equipment-05.webp', alt: 'Пресс ProfiPress 4500 для склейки бруса', caption: 'Склеиваем брус' },
      { src: 'assets/img/equipment/equipment-06.webp', alt: 'Обрабатывающий центр с ЧПУ для изготовления окон', caption: 'Изготавливаем окна' },
      { src: 'assets/img/equipment/equipment-07.webp', alt: 'Обрабатывающий центр с ЧПУ Format-4', caption: 'Обрабатываем детали' },
      { src: 'assets/img/equipment/equipment-08.webp', alt: 'Линия покраски Makor', caption: 'Красим изделия' },
    ],
  },
  // Блок 4. Текст заметки впечатан в картинку (так у заказчика); свежие заметки первыми
  notes: {
    title: 'Полезные заметки',
    items: [
      { src: 'assets/img/notes/kleeny-brusok.webp', alt: 'В чём разница между клеёным и цельным (строганным) бруском: цельный брусок выпилен из бревна или доски без склейки по длине' },
      { src: 'assets/img/notes/okna-ekologichnost.webp', alt: 'Деревянное окно в бревенчатом доме: окна из дерева становятся популярнее благодаря экологичности и естественному воздухообмену' },
    ],
  },
  socials: [
    { id: 'vk', text: 'ВКонтакте', href: 'https://vk.ru/belikov_70' },
    { id: 'max', text: 'MAX', href: 'https://max.ru/u/f9LHodD0cOJBZn1jFNjC21VRcTMfF4meoePWZ_4RlE5FCegSaMcdsqHrvuk' },
  ],
};

export default content;
