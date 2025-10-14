import { datalistProductItems } from "../../data/datalist-products.js";
function getProductsFromLocalStorage() {
  const productsFromLS = localStorage.getItem('products')
  if(productsFromLS) return JSON.parse(productsFromLS)
  else return null
}

function showComputedProducts() {
  const total = getProductsFromLocalStorage().length
  const h2 = document.querySelector('#section-shoplist h2 span')
  h2.innerHTML = ` (total ${total})`
}

function showShopList() {
  const sectionElt = document.querySelector('#section-shoplist')
  const items = getProductsFromLocalStorage()
  if(items) {
    const ol = document.createElement('ol')
    console.log('items', items.length)
    for(let i = 0; i < items.length; i++) {
      const item = items[i]
      const li = document.createElement('li')
      li.innerHTML = `<input type="checkbox" id="${i}" value="${item.label}"><label for="product-${i}">${item.label}</label>`
      ol.append(li)
    }
    sectionElt.append(ol)
    showComputedProducts()
  }
}

function addProduct() {
  const formElt = document.querySelector("#section-add-product")
  if(formElt) {
    formElt.addEventListener("submit", function (e) {
      e.preventDefault()
      const alertUser = document.querySelector('#alert-user')
      alertUser.innerHTML = '' // remove last message 
      const products = getProductsFromLocalStorage()
      const productName = document.querySelector('#product-name')
      const newProduct = {label: productName.value.trim(), checked: false }
      if(products === null) { // first product
        localStorage.setItem('products', JSON.stringify([newProduct]))
      } else if(products.some(item => item.label == newProduct.label)) { // duplicate product
        alertUser.innerText = `${newProduct.label} est déjà présent dans votre liste`
      } else { // new product inside products list
        products.push(newProduct)
        localStorage.setItem('products', JSON.stringify(products))
      }
      productName.value = '' // remove current value after submitted
      document.querySelector('#section-shoplist ol').remove() // remove last list
      showShopList()
    });
  }
}

function toogleForm() {
  const btnPlus = document.querySelector('#btn-add-product')
  btnPlus.addEventListener('click', function() {
    const formSectionElt = document.querySelector('#section-add-product')
    if(formSectionElt.classList.contains('hidden')) {
      formSectionElt.classList.remove('hidden')
    } else {
      formSectionElt.classList.add('hidden')
    }
  })
}

function fillDataListProducts() {
  const datalistProductElt = document.querySelector("#data-products");
  for (let i = 0; i < datalistProductItems.length; i++) {
    const item = datalistProductItems[i];
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.innerText = `${item.label} - ${item.category}`;
    datalistProductElt.append(opt);
  }
}

fillDataListProducts()
addProduct()
toogleForm()
showShopList()
