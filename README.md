<h1>Система формирования заказов на стройматериал</h1>
<p>Реализация в виде консольного приложения системы формирования заявки на закупку набора наименований строительного материала с элементами маркетингового удержания клиента.</p>
<p>Является глубокой модификацией системы расположенной в <a href="https://github.com/Daniil-Melnik/BuildingMaterialsSingle/">репозитории</a></p>

<h2>О программе</h2>
<p>Основным отличием является возможность выбора нескольких товаров в одну корзину и оформление этой корзины в одной заявке</p>
<p>Также система позволяет откатиться на уровень выбора региона, если пользователь случайно выбрал не тот</p>
<p>В отличии от <a href="https://github.com/Daniil-Melnik/BuildingMaterialsSingle/">более ранней реализации</a> здесь введено меню, позовляющее пользователю выбирать действия:</p>
<ul>
  <li>менять регион (тогда корзина опустее)</li>
  <li>добавлять товар в корзину</li>
  <li>удалять товар из корзины</li>
  <li>оформлять заявку</li>
  <li>выходить без сохранения</li>
</ul>
<p>
<p>В процессе работы пользователю видны доступные в регионе покупки товары, состав его корзины и общая стоимомть товаров в корзине</p>
<p>
<p>Логика удержанния расширена следующим образом:</p>
<ul>
  <li>Если пользователь пробует удалить товар, аналог которого есть в корзине, товар удаляется</li>
  <li>Если пользователь пробует удалить товар, аналогов которого нет в корзине, то применяется логика из раннего проекта (самая дешёвая альтернатива/ скидка в 5%/ удаление если альтернатив не существует)</li>
  <li>При попытках отказа от оформления заявки задаются уточняющие вопросы для подтверждения намериния пользователя</li>
</ul>

<p><a href="src">код</a></p>
<p><a href="data/products.json">входные данные</a></p>
<h2>Запуск</h2>
<p>Windows PS: <code>путь_до_репо\BuildingMaterialsBasket> node .\src\app.js</code></p>
<p>Linux: <code>путь_до_репо/BuildingMaterialsBasket ~$ node ./src/app.js</code></p>

<h2>Демонстрация работы</h2>
<p>Ниже приведено несколько сценариев работы приложения</p>
<h3>Выбор региона (1/2)</h3>
<p>Вначале пользователю предагают выбрать регион</p>
<img width="320" height="246" alt="image" src="https://github.com/user-attachments/assets/d3a0ef5b-bd02-462f-a67f-11046e3efcc3" />
<p>
<p>Пробуем выбрать регион с некорректным вводом и получаем отказ</p>
<img width="320" height="246" alt="image" src="https://github.com/user-attachments/assets/21519e62-86ee-41fc-910c-eeee5fbf87fa" />
<img width="320" height="246" alt="image" src="https://github.com/user-attachments/assets/442a63cd-92c2-4af8-aa5c-798e199ef828" />
<p>
<p>Выбран регион СПБ (0)</p>
<img width="717" height="480" alt="image" src="https://github.com/user-attachments/assets/5b07f4aa-2809-4106-9c31-cb13d614bdf1" />
<p>
<h3>Добавление в корзину</h3>
<p>Добавим в корзину товар с id = 1 (Утеплитель Роквул Скандик 50 мм - Утеплитель)</p>
<img width="717" height="480" alt="image" src="https://github.com/user-attachments/assets/707d318a-3ce9-42f1-beae-b4911d7fe822" />
<img width="717" height="390" alt="image" src="https://github.com/user-attachments/assets/dde35a69-d7e5-49ec-bcfb-9016fdc060cf" />
<p>В корзине появиоась одна позиция</p>
<img width="778" height="555" alt="image" src="https://github.com/user-attachments/assets/494e45a3-d401-4556-88e7-b2373bb5dbd2" />
<p>
<h3>Выход без сохранения</h3>
<p>Попробуем выйти без сохранения</p>
<img width="792" height="546" alt="image" src="https://github.com/user-attachments/assets/538aed28-f62c-4120-a0c6-c8a7407298d2" />
<p>Не согласимся с выходом и вернёмся к меню</p>
<img width="792" height="561" alt="image" src="https://github.com/user-attachments/assets/91c4900f-e654-4df3-be92-5fa91b948ef2" />
<img width="792" height="561" alt="image" src="https://github.com/user-attachments/assets/177560ee-375e-4757-a744-a38297ecc37f" />
<p>Согласимся, произойдёт выход</p>
<img width="792" height="561" alt="image" src="https://github.com/user-attachments/assets/ad10f372-8e73-479a-9a61-7bb9ef88a0ed" />
<img width="792" height="605" alt="image" src="https://github.com/user-attachments/assets/088e5853-b5f8-4bbb-b67e-4e5e4e279b10" />
<p>
<h3>Удаление</h3>
<p>Добавим товар с id = 3 (Газобетон СК D400 100x250x625 мм - Газобетон). В корзине появится вторая позиция, обновится общая сумма (до 1525)</p>
<img width="778" height="563" alt="image" src="https://github.com/user-attachments/assets/ea881153-16a3-4273-b30e-eba8319a1e3d" />
<p>
<p>Попробуем удалить утеплитель (позиция в корзине = 1)</p>
<img width="778" height="563" alt="image" src="https://github.com/user-attachments/assets/c6ce5e6b-c138-474c-a5b5-3fd83dd644eb" />
<img width="778" height="471" alt="image" src="https://github.com/user-attachments/assets/ec568c81-2096-445c-9b5b-17f62172fc97" />
<p>
<p>Получим предложение заменить на самый дешёвый в этом регионе из этой категории, согласимся</p>
<img width="778" height="523" alt="image" src="https://github.com/user-attachments/assets/fdabf426-7201-4391-be20-3c67a2417c14" />
<p>Корзина и стоимость обновились</p>
<img width="778" height="565" alt="image" src="https://github.com/user-attachments/assets/736df6ff-eca0-4e9a-a301-15e7ea95b52b" />
<p>
<p>Попробуем удалить газобетон (позиция в корзине = 2), он и так самый дешёвый в категории в этом регионе, соглашаемся</p>
<img width="778" height="523" alt="image" src="https://github.com/user-attachments/assets/e01c2eec-686f-4c3e-8ba6-d5eff8b8ccd7" />
<p>Корзина и стоимость обновились</p>
<img width="778" height="565" alt="image" src="https://github.com/user-attachments/assets/b256b903-ef55-4338-b9c3-61feb3a80f96" />
<p>
<h3>Оформление заявки</h3>
<p>Оформим заявку, везде согласимся</p>
<img width="778" height="565" alt="image" src="https://github.com/user-attachments/assets/d693dc8c-0d4b-4d11-ae7e-ed2ee10e7e40" />
<img width="778" height="485" alt="image" src="https://github.com/user-attachments/assets/356350d2-6c70-495d-a234-65c6b505bf8a" />
<p>На экране отображена заявка сохранённая в файл по отображенному пути</p>
<img width="807" height="342" alt="image" src="https://github.com/user-attachments/assets/f9cac617-727f-4851-ad7b-ce61f5d219af" />
<p>
<p>Попробуем оформить непустую заявку, откажемся</p>
<img width="792" height="472" alt="image" src="https://github.com/user-attachments/assets/d4d717c7-2ed3-4256-9afd-1383a29c3939" />
<img width="792" height="477" alt="image" src="https://github.com/user-attachments/assets/48e019d2-a020-4291-8d76-96936a2738f9" />
<p>Возврат к работе с корзиной</p>
<img width="792" height="548" alt="image" src="https://github.com/user-attachments/assets/5a0a6691-1f69-4753-b4ad-17cf6fe88bfd" />
<p>
<p>Попробуем оформить пустую заявку, ничего не произойдёт</p>
<img width="792" height="478" alt="image" src="https://github.com/user-attachments/assets/3c95d1d6-ee66-4b0e-b96a-ada4a22b7712" />
<p>
<h3>Смена региона</h3>
<p>Попробуем сменить регион снепустой корзний. С СПБ на ЕКБ:</p>
<img width="792" height="546" alt="image" src="https://github.com/user-attachments/assets/ee734be6-6c5b-4cb4-af8e-72af2ad308a2" />
<img width="792" height="561" alt="image" src="https://github.com/user-attachments/assets/547e1101-53e5-493d-b04f-f311ce77e0ce" />
<img width="325" height="237" alt="image" src="https://github.com/user-attachments/assets/47e5722f-d40f-427f-b2e5-98c5c82fe7ba" />
<p>Корзина пуста</p>
<img width="722" height="396" alt="image" src="https://github.com/user-attachments/assets/6f4d4b4c-1a68-4082-80d8-d719a66bb049" />













