const { MAXLEN_ID, MAXLEN_NAME, MAXLEN_PRICE, MAXLEN_CATEGORY, MAXLEN_POSNUM } = require('./config');
const { REGIONS } = require('./dataManager');

/**
 * Выводит одну строку таблицы с информацией о товаре для указанного региона в требуемом формате
 * @param {Object} p - товар
 * @param {string} region - регион покупки
 */

function printProductInfo(p, region) {
  let idDashesLen = MAXLEN_ID - String(p.id).length;
  let nameDashesLen = MAXLEN_NAME - String(p.name).length;
  let categoryDashesLen = MAXLEN_CATEGORY - String(p.category).length;
  let priceDashesLen = MAXLEN_PRICE - String(p.prices[region]).length;
  console.log(
    '|', p.id, ' '.repeat(idDashesLen), '|',
     p.name, ' '.repeat(nameDashesLen), '|',
     p.category, ' '.repeat(categoryDashesLen), '|',
     p.prices[region], ' '.repeat(priceDashesLen), '|');
}

/**
 * Выводит таблицу со списком товаров и ценами для заданного региона
 * @param {Array<Object>} products - набор товаров
 * @param {string} region - регион покупки
 */

function printProductListRegion(products, region) {
  console.log(
    '|', ' '.repeat(4), 'id', ' '.repeat(3), '|',
    ' '.repeat(13), 'Наименование', ' '.repeat(14), '|',
    ' '.repeat(6), 'Категория', ' '.repeat(4), '|',
    ' '.repeat(5), 'Цена', ' '.repeat(4), '|'
    );

  console.log('='.repeat(MAXLEN_POSNUM + MAXLEN_ID + MAXLEN_NAME + MAXLEN_CATEGORY + MAXLEN_PRICE + 10));
  products.forEach(p => {
    printProductInfo(p, region);
  });
  console.log('='.repeat(MAXLEN_POSNUM + MAXLEN_ID + MAXLEN_NAME + MAXLEN_CATEGORY + MAXLEN_PRICE + 10));
}

/**
 * Выводит одну строку таблицы для позиции в корзине с добавлением порядкового номера
 * @param {Object} item - позиция в корзине - экземпляр товара с упрощенной ценой
 * @param {number} posNum - номер позиции
 */

function printBasketItem(item, posNum) {
  const posNumLen = String(posNum).length;
  const idLen = String(item.id).length;
  const nameLen = String(item.name).length;
  const catLen = String(item.category).length;
  const priceLen = String(item.price).length;

  console.log(
    `${posNum + 1}`, ' '.repeat(MAXLEN_POSNUM - posNumLen),
    '|', item.id, ' '.repeat(MAXLEN_ID - idLen), '|',
    item.name, ' '.repeat(MAXLEN_NAME - nameLen), '|',
    item.category, ' '.repeat(MAXLEN_CATEGORY - catLen), '|',
    item.price, ' '.repeat(MAXLEN_PRICE - priceLen - 2), '|'
  );
}

/**
 * Отображает шапку с названием приложения
 */

function showMainPage() {
  console.clear();
  console.log('=============================================');
  console.log('#Программа создания заявки на закупку товара#');
  console.log('=============================================');
  console.log();
}

/**
 * Отображает страницу выбора региона со списком доступных регионов
 */

function showRegionSelectingPage() {
  showMainPage();
  console.log('===============');
  console.log('#Выбор региона#');
  console.log('===============');
  console.log();
  console.log('Доступные регионы:');
  REGIONS.forEach((value, key) => {
    console.log(`  ${key} -> ${value}`);
  });
}

/**
 * Выводит меню доступных действий
 */

function showMenuPage(){
    console.log();
    console.log('Выберите действие:');
    console.log('  1 -> Добавить товар');
    console.log('  2 -> Удалить товар из корзины');
    console.log('  3 -> Оформить заявку');
    console.log('  4 -> Сменить регион (корзина будет очищена)');
    console.log('  5 -> Выйти без сохранения');
}

/**
 * Выводит страницу с табличным изображением корзины покупок
 * @param {Array<Object>} basket - корзина товаров
 * @param {number} total - стоимость товаров в корзине 
 */

function showBasketPage(basket, total) {
  if (basket.length === 0) {
    console.log();
    console.log('Корзина пуста');
    return;
  }
  console.log();
  console.log('Ваша корзина:');
  console.log(
    ' '.repeat(3), '№', ' '.repeat(2), '|', ' '.repeat(4), 'id', ' '.repeat(3), '|',
    ' '.repeat(13), 'Наименование', ' '.repeat(14), '|',
    ' '.repeat(6), 'Категория', ' '.repeat(4), '|',
    ' '.repeat(5), 'Цена', ' '.repeat(2), '|'
  );
  console.log('='.repeat(MAXLEN_ID + MAXLEN_NAME + MAXLEN_CATEGORY + MAXLEN_PRICE + 24));
  basket.forEach((item, posNum) => printBasketItem(item, posNum));
  console.log('='.repeat(MAXLEN_ID + MAXLEN_NAME + MAXLEN_CATEGORY + MAXLEN_PRICE + 24));
  console.log(`   Итого: ${total}`);
}

/**
 * Выводит страницу выбора товара в заданном регионе
 * 
 * @param {Array<Object>} productInRegion - товары в регионе покупки
 * @param {string} region - регион покупки
 * @param {Array<Object>} basket - корзина товаров
 * @param {number} total - стоимость товаров в корзине 
 */

function showProductSelectingPage(productInRegion, region, basket, total) {
  showMainPage();
  console.log('==============');
  console.log('#Выбор товара#');
  console.log('==============');
  console.log();
  console.log('Товары в регионе: ', region);
  printProductListRegion(productInRegion, region);
  showBasketPage(basket, total);
}

module.exports = {
  printProductInfo,
  printProductListRegion,
  printBasketItem,
  showMainPage,
  showRegionSelectingPage,
  showMenuPage,
  showBasketPage,
  showProductSelectingPage
};