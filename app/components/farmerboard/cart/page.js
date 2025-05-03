"use client";
import { emptyCart, getCart, removeItem } from "@/helpers/CartHelpers";
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";



export default function Cart() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const cartItems = getCart().map((item) => ({ ...item, quantity: 1 }));
    setItems(cartItems);
  }, []);

  const incrementQuantity = (itemId) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
    });
  };

  const decrementQuantity = (itemId) => {
    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item._id === itemId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  const handleEmptyCart = () => {
    emptyCart(() => {
      setItems([]);
    });
    window.location.reload();
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + 3000 * item.quantity, 0);
  };


  return (
    <>
      <div
        style={{
          margin: "2rem",
          fontFamily: "Times New Roman",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        <h1>My cart has {items.length} item(s)</h1>
      </div>
      {items.map((item) => (
        <div key={item._id}>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-body">
                  <h3 className="card-title">{item.batchName}</h3>

                  <p className="card-text"> {item.batchMadeAt}</p>
                  <p className="card-text">
                    {new Date(item.batchManufactured).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        item.batchStatus === "active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {item.batchStatus}
                    </span>
                  </p>

                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => decrementQuantity(item._id)}
                    >
                      <Minus size={18} className="me-1" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-secondary"
                      onClick={() => incrementQuantity(item._id)}
                    >
                      <Plus size={18} className="me-1" />
                    </button>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}{" "}
      *
       <div style={{ textAlign: "center", margin: "2rem" }}>
        <button className="btn btn-danger" onClick={handleEmptyCart} style={{ marginRight: "3rem" }}>
          Empty Cart
        </button>
        <Button className="btn btn-primary" disabled>
          Checkout
        </Button>
      </div> 

      <div style={{ textAlign: "center", margin: "2rem", fontFamily: "sans-serif", fontStyle: "revert-layer" }}>
        <h3>Total Price: MK {calculateTotalPrice()}</h3>
      </div>

    </>
  );
}
