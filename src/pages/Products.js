import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../data/ProductData";
import imgHeartBtn from "../img/heart-icon.png";
import imgArrowBtn from "../img/arrow-down.png";
import ToggleBtn from "../components/ToggleBtn";
import crossIcon from "../img/Cross-icon.PNG";

const Products = () => {
  // NAVIGATE
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  // HOVER EFFECT OF PRODUCT IMAGES
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const handleMouseEnter = (id) => setHoveredProductId(id);
  const handleMouseLeave = () => setHoveredProductId(null);

  // DROPDOWN
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [filterByPrice, setFilterByPrice] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
    const matchType =
      selectedType === "all" || product.typeOfProduct === selectedType;
    const matchPrice = !filterByPrice || product.price > 60;
    return matchType && matchPrice;
  });

  // Active filters
  const [activeFilters, setActiveFilters] = useState([]);

  // Udpating active filters
  const updateActiveFilters = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Deleting active filters
  const removeFilter = (filter) => {
    setActiveFilters(activeFilters.filter((item) => item !== filter));
    if (filter === "Free shipping") setFilterByPrice(false);
    if (filter === selectedType) setSelectedType("all");
  };

  // Handle dropdown item click
  const handleDropdownClick = (type) => {
    setSelectedType(type);
    updateActiveFilters(type === "all" ? "All products" : type);
    setIsOpen(false);
  };

  // Handle filter by price toggle
  const handleFilterByPriceClick = () => {
    setFilterByPrice((prev) => {
      const newState = !prev;

      if (newState) {
        // If the filter is activated, add "Free shipping" to active filters
        updateActiveFilters("Free shipping");
      } else {
        // If the filter is deactivated, remove "Free shipping" from active filters
        removeFilter("Free shipping");
      }

      return newState;
    });
  };

  return (
    <main className="Products">
      <h2>Products</h2>
      <div className="main-container">
        <div className="empty-cell"></div>

        <ol className="selected-options-container">
          {activeFilters.map((filter, index) => (
            <li key={index}>
              {filter}
              <button
                className="delete-btn"
                onClick={() => removeFilter(filter)}
              >
                <img src={crossIcon} alt="Cross" />
              </button>
            </li>
          ))}
        </ol>

        <section className="options-container">
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle-btn"
              title="Select a category"
              type="button"
              onClick={handleToggle}
              aria-expanded={isOpen}
            >
              {selectedType === "all" ? "All products" : selectedType}
              <img
                className="img-btn"
                src={imgArrowBtn}
                alt="Arrow down icon"
              />
            </button>
            {isOpen && (
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownClick("t-shirts")}
                >
                  <li>T-shirts</li>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownClick("sneakers")}
                >
                  <li>Sneakers</li>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => handleDropdownClick("all")}
                >
                  <li>All Products</li>
                </button>
              </ul>
            )}
          </div>

          <div className="filter-by-price">
            <p>Free shipping</p>
            <ToggleBtn
              toggled={filterByPrice}
              onClick={handleFilterByPriceClick}
              aria-label="Show products with free shipping"
            />
          </div>
        </section>

        <section className="products-container">
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <article
                key={product.id}
                className="card"
                onMouseEnter={() => handleMouseEnter(product.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleProductClick(product.id)}
              >
                <figure>
                  <img
                    src={
                      hoveredProductId === product.id
                        ? product.urlImgHover
                        : product.urlImg
                    }
                    alt={product.nameProduct}
                  />
                </figure>
                <div className="info-card">
                  {product.bestSeller && (
                    <p className="best-seller">Best Seller</p>
                  )}
                  <p className="shipping">
                    {product.price > 60 ? "Free shipping" : "Shipping from $10"}
                  </p>
                  <h3>{product.nameProduct}</h3>
                  <p className="price">${product.price}</p>

                  <button className="wishlist-btn" title="Add to wishlist">
                    <img
                      className="img-btn"
                      src={imgHeartBtn}
                      alt="Favorite icon"
                    />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default Products;
