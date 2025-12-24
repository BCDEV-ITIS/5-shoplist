import { datalistProductItems } from "./data/datalist-products.js";
/**
 * Get products from Brownser API localStorage
 * @returns Array of product with label and checked attributes or empty array
 */
function getProductsFromStorage() {
  const productsFromLS = localStorage.getItem("products");
  if (productsFromLS) return JSON.parse(productsFromLS);
  else return [];
}

/**
 * Compute products purchased out of total products
 * @returns void
 */
export function displayTotalPurchased() {
  const total = getProductsFromStorage().length;
  const purchased = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  ).length;
  const h2 = document.querySelector("#section-shoplist h2 span");
  h2.innerHTML = ` : ${purchased}/${total}`;
}

/**
 * Update products purchased out of total products
 * @returns void
 */
function updateProductStatus() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  if (checkboxes.length) {
    checkboxes.forEach(function (c) {
      c.addEventListener("change", function () {
        let products = getProductsFromStorage();
        let findProductIndex = products.findIndex(
          (i) => i.label.toLowerCase() === c.value.toLowerCase()
        );
        const current = products[findProductIndex];
        current.checked = !current.checked;
        products[findProductIndex] = current;
        localStorage.setItem("products", JSON.stringify(products));
        displayTotalPurchased();
      });
    });
  }
}

/**
 * Display shopping list
 * @returns void
 */
export function displayShoppingList() {
  const sectionElt = document.querySelector("#section-shoplist");
  const items = getProductsFromStorage();
  if (items.length) {
    const ol = document.createElement("ol");
    const p = sectionElt.querySelector("p");
    if (p) {
      p.remove(); // delete default content empty basket or last content
    }
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const li = document.createElement("li");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `product-${i}`;
      input.value = item.label;
      if (item.checked) {
        input.setAttribute("checked", "checked");
      } else {
        input.removeAttribute("checked");
      }
      li.innerHTML = `${input.outerHTML}<label for="product-${i}">${item.label}</label>`;
      ol.append(li);
    }
    sectionElt.append(ol);
    updateProductStatus();
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
      const products = getProductsFromStorage();
      const productName = document.querySelector("#product-name");
      if (productName.value === "") {
        alertUser.innerHTML = "Le nom du produit est obligatoire !";
        return;
      }
      const newProduct = { label: productName.value.trim(), checked: false };
      if (
        products.some(
          (item) => item.label.toLowerCase() === newProduct.label.toLowerCase()
        )
      ) {
        // Duplicate product
        alertUser.innerText = `${newProduct.label} est déjà présent dans votre liste de courses !`;
      } else {
        // New product
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
      }
      productName.value = ""; // Remove current product name after submitted
      const ol = document.querySelector("#section-shoplist ol");
      if (ol) {
        ol.remove(); // Remove last list
      }
      displayShoppingList();
      displayTotalPurchased();
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
    this.querySelectorAll("svg").forEach(function (svg) {
      svg.classList.toggle("hidden");
    });
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
