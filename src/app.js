const fs = require('fs');
const {
  loadData,
  REGIONS,
  getProductsForRegion,
  getProductsOfCategory,
  getCheapestInCategory,
  createOrderFile
} = require('./dataManager');

const {
  showRegionSelectingPage,
  showMenuPage,
  showProductSelectingPage
} = require('./ui');

const { ask, sleep, exitProgram, cIO } = require('./utils');
const { ORDERS_PATH, MAXLEN_ID, MAXLEN_NAME, MAXLEN_PRICE, MAXLEN_CATEGORY } = require('./config');

if (!fs.existsSync(ORDERS_PATH)) {
    fs.mkdirSync(ORDERS_PATH, { recursive: true });
}

/** 
 * корзина товаров
 * @type {Array<{id: number, name: string, category: string, price: number}>} 
 * */
let basket = [];

/** 
 * общая стоимость корзины товаров
 * @type {number} 
 * */
let total = 0;

/**
 * Пересчитывает общую стоимость корзины на основе текущих цен и помещает результат в total
 */

function updateTotal() {
  total = basket.reduce((sum, item) => sum + item.price, 0);
}







/**
 * Осуществляет добавление товара в корзину
 * @param {Object} product - товар
 * @param {string} region - регион покупки
 */

function addToBasket(product, region) {
  const price = product.prices[region];
  basket.push({
    id: product.id,
    name: product.name,
    category: product.category,
    price: price
  });
  updateTotal();
}

/**
 * Осуществляет удаление товара из корзины
 * Пытается удержать клиента
 * Предлагает скидку или замену, если товар данной категории последний в корзине
 * @param {number} posNum - индекс товара в корзине [0; n-1]
 * @param {string} region - регион покупки
 * @param {Array} allProducts - каталог товаров для поиска
 */

async function removeFromBasket(posNum, region, allProducts) {
  if (posNum < 0 || posNum >= basket.length) return null;

  const item = basket[posNum];
  const category = item.category;

  const allInCategory = getProductsOfCategory(getProductsForRegion(allProducts, region), category);

  if (allInCategory.length === 0) {
    basket.splice(posNum, 1);
    updateTotal();
    // console.log(`Товар "${item.name}" удалён (аналогов нет)`);
    return;
  }

  const cheapestProduct = getCheapestInCategory(getProductsForRegion(allProducts, region), category, region);
  const cheapestPrice = cheapestProduct.prices[region];

  const isCheapest = (cheapestProduct.id === item.id);

  const otherInBasket = basket.filter((_, i) => i !== posNum && _.category === category);

  if (otherInBasket.length === 0) {
    if (isCheapest) {
      const discount = cheapestPrice * 0.95;
      console.log();
      console.log(`Товар "${item.name}" – самый дешёвый в категории`);
      console.log(`Предлагаем скидку 5%: ${discount} вместо ${item.price}`);
      const wantDiscount = await ask('Принять предложение? (y/n): ');
      if (wantDiscount.trim().toLowerCase() === 'y') {
        basket[posNum].price = discount;
        updateTotal();
        // console.log('Обновлена цена');
      } else {
        basket.splice(posNum, 1);
        updateTotal();
        // console.log('Удалён товар');
      }
    } else {
      console.log();
      console.log(`Найден более дешёвый товар в категории: ${cheapestProduct.name} по цене ${cheapestPrice}`);
      console.log(`${item.price} вместо ${cheapestPrice}`);
      const wantReplace = await ask('Заменить? (y/n): ');
      if (wantReplace.trim().toLowerCase() === 'y') {
        basket[posNum] = {
          id: cheapestProduct.id,
          name: cheapestProduct.name,
          category: cheapestProduct.category,
          price: cheapestPrice
        };
        updateTotal();
        // console.log('Заменён товар');
      } else {
        basket.splice(posNum, 1);
        updateTotal();
        // console.log('Удалён товар');
      }
    }
  } else {
    basket.splice(posNum, 1);
    updateTotal();
    // console.log(`Товар "${item.name}" удалён`);
  }
}

/**
 * Преобразует формат корзины в формат заказа для передачи на печать в файл
 * @param {string} region - регион покупки
 * @returns {Object} - объект заказа с полями region, items, total, timestamp
 */

function createOrderObject(region) {
  return {
    region: region,
    items: basket.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price
    })),
    total: total,
    timestamp: new Date().toISOString()
  };
}

/**
 * Запрашивает у пользователя ID товара и проверяет его корректность
 * @param {Array} productInRegion - список товаров в регионе
 * @param {string} region - регион покупки
 * @returns {Promise<number>} - ID выбранного товара
 */

async function chooseProduct(productInRegion, region) {
  let chosenId;
  while (true) {
    const input = await ask('Введите id товара: ');
    chosenId = Number(input.trim());
    if (Number.isInteger(chosenId) && productInRegion.some(p => p.id === chosenId)) {
      break;
    }
    console.clear();
    showProductSelectingPage(productInRegion, region, basket, total);
     // console.log('Некорректный id');
  }
  return chosenId;
}










/**
 * Главный метод в приложении
 * Выполняет последовательность: (загрузка данных + вычисление доступных регионов) -> выбор региона покупки -> работа с корзиной -> сохранение заявки в файл
 * @returns {Promise<void>}
 */

async function main() {
  console.clear();

  const allProducts = loadData();

  let region = null;
  let productInRegion = [];

  while (true) {
    showRegionSelectingPage();
    const input = await ask(`Выберите регион [0 ; ${REGIONS.size - 1}]: `);
    const regionID = Number(input.trim());
    if (Number.isInteger(regionID) && regionID >= 0 && regionID < REGIONS.size) {
      region = REGIONS.get(regionID);
      productInRegion = getProductsForRegion(allProducts, region);
      if (productInRegion.length === 0) {
        // console.log('В этом регионе нет товаров');
        continue;
      }
      break;
    }
    console.clear();
  }

  console.clear();
  showProductSelectingPage(productInRegion, region, basket, total);

  let isExit = false;
  while (!isExit) {
    console.clear();
    showProductSelectingPage(productInRegion, region, basket, total);
    showMenuPage();
    const action = (await ask('Ваш выбор: ')).trim();

    switch (action) {
      case '1': {
        console.clear();
        showProductSelectingPage(productInRegion, region, basket, total);
        const chosenId = await chooseProduct(productInRegion, region);
        const chosenProduct = productInRegion.find(p => p.id === chosenId);
        if (!chosenProduct) {
          // console.log('Товар не найден');
          break;
        }
        addToBasket(chosenProduct, region);
        console.clear();
        showProductSelectingPage(productInRegion, region, basket, total);
        // console.log(`Товар "${chosenProduct.name}" добавлен`);
        break;
      }
      case '2': {
        if (basket.length === 0) {
          //console.log('Корзина пуста');
          break;
        }
        console.clear();
        showProductSelectingPage(productInRegion, region, basket, total);
        const posNumInput = await ask('Введите номер товара в корзине для удаления: ');
        const posNum = Number(posNumInput.trim()) - 1;
        if (!Number.isInteger(posNum) || posNum < 0 || posNum >= basket.length) {
           // console.log('Неверный номер');
          break;
        }
        await removeFromBasket(posNum, region, allProducts);
        console.clear();
        showProductSelectingPage(productInRegion, region, basket, total);
        break;
      }
      case '3': {
        if (basket.length === 0) {
          //console.log('Корзина пуста');
          break;
        }
        console.clear();
        showProductSelectingPage(productInRegion, region, basket, total);

        const confirmRequest = await ask('\nОформить заявку? (y/n): ');
        if (confirmRequest.trim().toLowerCase() === 'y') {
          const order = createOrderObject(region);
          createOrderFile(order);
          await exitProgram();
          isExit = true;
        } else if (confirmRequest.trim().toLowerCase() === 'n') {
          const confirmCancelAgain = await ask('Вы уверены, что хотите не оформлять заявку и выйти из программы? (y/n): ');
          if (confirmCancelAgain.trim().toLowerCase() === 'y') {
            // console.log('Заявка не оформлена');
            await exitProgram();
            isExit = true;
          } else if (confirmCancelAgain.trim().toLowerCase() === 'n') {
            console.clear();
            showProductSelectingPage(productInRegion, region, basket, total);
            // console.log('Работа с корзиной');
          }
        }
        break;
      }
      case '4': {
        const confirmChangeRegion = await ask('При смене региона корзина будет очищена, продолжить? (y/n): ');
        if (confirmChangeRegion.trim().toLowerCase() === 'y') {
          basket = [];
          total = 0;
          while (true) {
            showRegionSelectingPage();
            const inputR = await ask('Выберите новый регион (индекс): ');
            const regionID = Number(inputR.trim());
            if (Number.isInteger(regionID) && regionID >= 0 && regionID < REGIONS.size) {
              region = REGIONS.get(regionID);
              productInRegion = getProductsForRegion(allProducts, region);
              if (productInRegion.length === 0) {
                continue;
              }
              break;
            }
            console.clear();
            // console.log(`Некорректный индекс, введите число от 0 до ${REGIONS.size - 1}: `);
          }
          console.clear();
          showProductSelectingPage(productInRegion, region, basket, total);
        }
        break;
      }
      case '5': {
        const confirmExit = await ask('Выйти без сохранения? (y/n): ');
        if (confirmExit.trim().toLowerCase() === 'y') {
          await exitProgram();
          isExit = true;
        }
        break;
      }
      default:
        console.clear();
        showProductSelectingPage(productInRegion, region, basket, total);
        // console.log('Неверный выбор, попробуйте снова: ');
    }
  }
}

main().catch(err => {
  console.error('ОШИБКА:', err);
  cIO.close();
});