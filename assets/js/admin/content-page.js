/* Админка «Контент сайта»: новая строка в «Видах изделий» и «Оборудовании» встаёт первой,
   как новые фото в галереях работ и заметок (ТЗ, п. 3.3). Порядок дальше меняется перетаскиванием. */
(function () {
  if (!window.acf) return;

  const PREPEND = ['products', 'equipment'];

  acf.addAction('append', ($el) => {
    if (!$el.hasClass('acf-row') || $el.hasClass('acf-clone')) return;
    const field = acf.getClosestField($el);
    if (!field || !PREPEND.includes(field.get('name'))) return;
    // Кнопка «Добавить» внизу ставит строку перед скрытым шаблоном — то есть последней.
    // Строки, вставленные через «+» посреди списка, не трогаем
    const rows = $el.parent().children('.acf-row:not(.acf-clone)');
    if (rows.last()[0] !== $el[0]) return;
    $el.parent().prepend($el);
    field.render();
    $el[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
})();
