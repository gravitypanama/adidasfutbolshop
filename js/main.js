let productosGlobal = [];

async function cargarProductos() {
    try {
        const respuesta = await fetch('data/products.json?t=' + new Date().getTime());

        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el JSON');
        }

        const productos = await respuesta.json();

        productosGlobal = productos.filter(p => p.ESTADO === 1);

        renderProductos(productosGlobal);

    } catch (error) {
        console.error("Error al cargar los productos:", error);
        document.getElementById('catalog').innerHTML = `
            <div class="alert alert-danger text-center">
                No se pudieron cargar los productos.
            </div>
        `;
    }
}

function renderProductos(productos) {
    const catalogo = document.getElementById('catalog');
    catalogo.innerHTML = '';

    if (productos.length === 0) {
        catalogo.innerHTML = `
            <div class="container text-center py-5">
                <h4>No se encontraron productos</h4>
            </div>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();

    productos
        .sort((a, b) => {
            return parseFloat(a["PRECIO VENTA"]) - parseFloat(b["PRECIO VENTA"]);
        })
        .forEach(producto => {

            const imagenesCarousel = [producto.IMAGEN1, producto.IMAGEN2, producto.IMAGEN3, producto.IMAGEN4, producto.IMAGEN5].filter(Boolean);
            const carouselItemsHtml = imagenesCarousel.map((src, index) => `
                                                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                    <img src="${src}" class="d-block mx-auto img-fluid" alt="${producto.PRODUCTO}" style="max-height: 600px; object-fit: contain;">
                                                </div>
                                            `).join('');

            const div = document.createElement('div');
            div.classList.add('container', 'py-2');

            div.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-lg-12">
                        <div class="card product-card shadow-lg border-0 rounded-4 overflow-hidden">
                            <div class="row g-0 align-items-center">

                                <div class="col-md-8 text-center bg-light p-4 d-flex align-items-center justify-content-center">
                                    <div id="carousel-${producto.ID}" class="carousel slide w-100">
                                        <div class="carousel-inner">
                                            ${carouselItemsHtml}
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${producto.ID}" data-bs-slide="prev">
                                            <i class="bi bi-chevron-left text-black fs-2"></i>
                                            <span class="visually-hidden">Previous</span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${producto.ID}" data-bs-slide="next">
                                            <i class="bi bi-chevron-right text-black fs-2"></i>
                                            <span class="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="col-md-4 p-5">                                    
                                    <h1 class="fw-bold mb-3">${producto.PRODUCTO}</h1>

                                    <!--<div class="product-info p-3 bg-light rounded-3 mb-4">
                                        <ul class="list-unstyled mb-0">
                                            <li><strong>Color:</strong> ${producto.COLOR}</li>
                                            <li><strong>Capacidad:</strong> ${producto.TAMANO} oz</li>
                                        </ul>
                                    </div>-->

                                    <div class="product-price mb-4">
                                        <span class="current-price">$${producto["PRECIO VENTA"]}</span>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            `;

            fragment.appendChild(div);
        });

    catalogo.appendChild(fragment);
}

cargarProductos();

const btnScrollTop = document.getElementById('btnScrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        btnScrollTop.style.display = 'block';
    } else {
        btnScrollTop.style.display = 'none';
    }
});

btnScrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
