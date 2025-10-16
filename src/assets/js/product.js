import { datalistProductItems } from "./data/datalist-products.js";
/**
 * Get products from Brownser API localStorage
 * @returns null or Array of product with label 
 */
export function getProductsFromLocalStorage() {
  const productsFromLS = localStorage.getItem("products");
  if (productsFromLS) return JSON.parse(productsFromLS);
  else return null;
}

/**
 * Compute products purchased out of total products
 * @returns void
 */
export function computePurchased() {
  const total = getProductsFromLocalStorage().length;
  const purchased = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  ).length;
  const h2 = document.querySelector("#section-shoplist h2 span");
  h2.innerHTML = ` : achats ${purchased}/${total}`;
}

/**
 * Update products purchased out of total products
 * @returns void
 */
export function updatePurchased() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  if (checkboxes.length) {
    checkboxes.forEach(function (c) {
      c.addEventListener("change", computePurchased);
    });
  }
}

/**
 * Display shop list
 * @returns void
 */
export function showShopList() {
  const sectionElt = document.querySelector("#section-shoplist");
  const items = getProductsFromLocalStorage();
  if (items) {
    const ol = document.createElement("ol");
    const p = sectionElt.querySelector("p");
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const li = document.createElement("li");
      li.innerHTML = `<input type="checkbox" id="${i}" value="${item.label}"><label for="product-${i}">${item.label}</label>`;
      ol.append(li);
    }
    if (p) {
      // delete default content empty basket
      p.remove();
    }
    sectionElt.append(ol);
    computePurchased();
  }
}

/**
 * Add product to current shop list
 * @returns void
 */
export function addProduct() {
  const formElt = document.querySelector("#section-add-product");
  if (formElt) {
    formElt.addEventListener("submit", function (e) {
      e.preventDefault();
      const alertUser = document.querySelector("#alert-user");
      alertUser.innerHTML = ""; // remove last message
      const products = getProductsFromLocalStorage();
      const productName = document.querySelector("#product-name");
      const newProduct = { label: productName.value.trim(), checked: false };
      if (products === null) {
        // first product
        localStorage.setItem("products", JSON.stringify([newProduct]));
      } else if (products.some((item) => item.label.toLowerCase() === newProduct.label.toLowerCase())) {
        // duplicate product
        alertUser.innerText = `${newProduct.label} est déjà présent dans votre liste`;
      } else {
        // new product inside products list
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
      }
      productName.value = ""; // remove current value after submitted
      const ol = document.querySelector("#section-shoplist ol");
      if (ol) {
        ol.remove(); // remove last list
      }
      showShopList();
    });
  }
}

/**
 * Show or hide the form
 * @returns void
 */
export function toogleForm() {
  const btnPlus = document.querySelector("#btn-add-product");
  btnPlus.addEventListener("click", function () {
    const formSectionElt = document.querySelector("#section-add-product");
    formSectionElt.classList.toggle("hidden");
  });
}

/**
 * fill datalist to add quickly product 
 * @returns void
 */
export function fillDataListProducts() {
  const datalistProductElt = document.querySelector("#data-products");
  for (let i = 0; i < datalistProductItems.length; i++) {
    const item = datalistProductItems[i];
    const opt = document.createElement("option");
    opt.value = `${item.label} - ${item.category}`;
    opt.innerText = `${item.label} - ${item.category}`;
    datalistProductElt.append(opt);
  }
}
