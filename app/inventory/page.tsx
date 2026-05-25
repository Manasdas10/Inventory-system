"use client";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import {
  Package,
  Search,
  AlertTriangle,
  Pencil,
  Trash2,
  ShieldPlus,
} from "lucide-react";

import { useSession } from "next-auth/react";

export default function InventoryPage() {

  const { data: session } =
    useSession();

  const isAdmin =
    (session?.user as any)
      ?.role === "ADMIN";

  //////////////////////////////////////////////////////
  // STATES
  //////////////////////////////////////////////////////

  const [products, setProducts] =
    useState<any[]>([]);

  const [warehouses, setWarehouses] =
    useState<any[]>([]);

  const [warehouseId, setWarehouseId] =
    useState("");

  const [name, setName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [category, setCategory] =
    useState("GENERAL");

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState("");

  //////////////////////////////////////////////////////
  // FETCH PRODUCTS
  //////////////////////////////////////////////////////

  const fetchProducts =
    async () => {

      try {

        const res =
          await fetch(
            "/api/inventory",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await res.json();

        setProducts(
          data.inventory || []
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Inventory fetch failed"
        );
      }
    };

  //////////////////////////////////////////////////////
  // FETCH WAREHOUSES
  //////////////////////////////////////////////////////

  const fetchWarehouses =
    async () => {

      try {

        const res =
          await fetch(
            "/api/warehouse"
          );

        const data =
          await res.json();

        setWarehouses(
          data.warehouses || []
        );

        if (
          data.warehouses?.length > 0
        ) {

          setWarehouseId(
            data.warehouses[0].id
          );
        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Warehouse fetch failed"
        );
      }
    };

  //////////////////////////////////////////////////////
  // INITIAL LOAD
  //////////////////////////////////////////////////////

  useEffect(() => {

    fetchProducts();

    fetchWarehouses();

  }, []);

  //////////////////////////////////////////////////////
  // ADD PRODUCT
  //////////////////////////////////////////////////////

  const addProduct =
    async () => {

      if (
        !name ||
        !quantity ||
        !price ||
        !warehouseId
      ) {

        toast.error(
          "Fill all fields"
        );

        return;
      }

      try {

        const res =
          await fetch(
            "/api/inventory",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                name,

                quantity:
                  Number(quantity),

                price:
                  Number(price),

                category,

                warehouseId,
              }),
            }
          );

        if (!res.ok) {
          throw new Error();
        }

        toast.success(
          "Product added"
        );

        setName("");
        setQuantity("");
        setPrice("");
        setCategory("GENERAL");

        await fetchProducts();

      } catch (error) {

        console.log(error);

        toast.error(
          "Add failed"
        );
      }
    };

  //////////////////////////////////////////////////////
  // DELETE
  //////////////////////////////////////////////////////

  const deleteProduct =
    async (
      inventoryId: string
    ) => {

      try {

        const res =
          await fetch(
            `/api/inventory/${inventoryId}`,
            {
              method:
                "DELETE",
            }
          );

        if (!res.ok) {
          throw new Error();
        }

        toast.success(
          "Deleted"
        );

        await fetchProducts();

      } catch (error) {

        console.log(error);

        toast.error(
          "Delete failed"
        );
      }
    };

  //////////////////////////////////////////////////////
  // EDIT
  //////////////////////////////////////////////////////

  const editProduct =
    (item: any) => {

      setEditingId(
        item.id
      );

      setName(
        item.product?.name || ""
      );

      setQuantity(
        String(
          item.totalUnits || 0
        )
      );

      setPrice(
        String(
          item.product?.price || 0
        )
      );

      setCategory(
        item.product?.category ||
        "GENERAL"
      );

      setWarehouseId(
        item.warehouseId || ""
      );
    };

  //////////////////////////////////////////////////////
  // UPDATE
  //////////////////////////////////////////////////////

  const updateProduct =
    async () => {

      try {

        const currentProduct =
          products.find(
            (item: any) =>
              item.id === editingId
          );

        if (!currentProduct) {

          toast.error(
            "Product not found"
          );

          return;
        }

        const res =
          await fetch(
            `/api/inventory/${editingId}`,
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                inventoryId:
                  editingId,

                productId:
                  currentProduct.product.id,

                name,

                quantity:
                  Number(quantity),

                price:
                  Number(price),

                category,

                warehouseId,
              }),
            }
          );

        if (!res.ok) {
          throw new Error();
        }

        toast.success(
          "Updated successfully"
        );

        setEditingId("");

        setName("");
        setQuantity("");
        setPrice("");
        setCategory("GENERAL");

        await fetchProducts();

      } catch (error) {

        console.log(error);

        toast.error(
          "Update failed"
        );
      }
    };

  //////////////////////////////////////////////////////
  // RESERVE
  //////////////////////////////////////////////////////

  const reserveProduct =
    async (
      productId: string,
      warehouseId: string
    ) => {

      try {

        const response =
          await fetch(
            "/api/reservations",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                productId:
                  String(productId),

                warehouseId:
                  String(warehouseId),

                quantity: 1,
              }),
            }
          );

        const result =
          await response.json();

        console.log(
          "RESERVATION RESULT:",
          result
        );

        ////////////////////////////////////////////////////
        // FAILED
        ////////////////////////////////////////////////////

        if (!response.ok) {

          toast.error(

            result.message ||

            "Reservation failed"
          );

          return;
        }

        ////////////////////////////////////////////////////
        // STORE RESERVATION
        ////////////////////////////////////////////////////
         
        console.log(
          "SAVING:",
          result
        );
        
        localStorage.setItem(

          "reservation",

          JSON.stringify(
            result.reservation
          )
        );

        ////////////////////////////////////////////////////
        // SUCCESS
        ////////////////////////////////////////////////////

        toast.success(
          "Reservation successful"
        );

        ////////////////////////////////////////////////////
        // REFRESH
        ////////////////////////////////////////////////////

        await fetchProducts();

        ////////////////////////////////////////////////////
        // REDIRECT
        ////////////////////////////////////////////////////

        window.location.href =
          "/checkout";

      } catch (error) {

        console.log(error);

        toast.error(
          "Frontend error"
        );
      }
    };

  //////////////////////////////////////////////////////
  // SEARCH
  //////////////////////////////////////////////////////

  const filteredProducts =

    products.filter(
      (item: any) =>

        item?.product?.name
          ?.toLowerCase()
          ?.includes(
            search.toLowerCase()
          )
    );

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 ml-72 p-8">

        <Navbar />

        <div className="mt-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h1 className="text-5xl font-bold text-slate-800">

                Inventory Management

              </h1>

              <p className="text-slate-500 mt-2">

                Manage hospital inventory and medical stock

              </p>

            </div>

            <div className="bg-cyan-100 p-5 rounded-3xl text-cyan-700">

              <Package size={36} />

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className="border border-slate-200 rounded-2xl px-5 py-4"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    e.target.value
                  )
                }
                className="border border-slate-200 rounded-2xl px-5 py-4"
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
                className="border border-slate-200 rounded-2xl px-5 py-4"
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="border border-slate-200 rounded-2xl px-5 py-4"
              >

                <option value="GENERAL">
                  GENERAL
                </option>

                <option value="ICU">
                  ICU
                </option>

                <option value="SURGICAL">
                  SURGICAL
                </option>

                <option value="MEDICINE">
                  MEDICINE
                </option>

              </select>

              <select
                value={warehouseId}
                onChange={(e) =>
                  setWarehouseId(
                    e.target.value
                  )
                }
                className="border border-slate-200 rounded-2xl px-5 py-4"
              >

                <option value="">
                  Select Warehouse
                </option>

                {warehouses.map(
                  (warehouse: any) => (

                    <option
                      key={warehouse.id}
                      value={warehouse.id}
                    >

                      {warehouse.name}

                    </option>
                  )
                )}

              </select>

              <button
                onClick={
                  editingId
                    ? updateProduct
                    : addProduct
                }
                className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-semibold"
              >

                {editingId
                  ? "Update"
                  : "Add Product"}

              </button>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-3xl font-bold text-slate-800">

                Inventory Records

              </h2>

              <div className="relative">

                <Search
                  className="absolute left-4 top-4 text-slate-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  className="border border-slate-200 rounded-2xl pl-12 pr-5 py-4"
                />

              </div>

            </div>

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-200 text-left">

                  <th className="pb-5">
                    Product
                  </th>

                  <th className="pb-5">
                    Category
                  </th>

                  <th className="pb-5">
                    Warehouse
                  </th>

                  <th className="pb-5">
                    Quantity
                  </th>

                  <th className="pb-5">
                    Price
                  </th>

                  <th className="pb-5">
                    Status
                  </th>

                  <th className="pb-5">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredProducts.map(
                  (product: any) => (

                    <tr
                      key={product.id}
                      className="border-b border-slate-100"
                    >

                      <td className="py-5">
                        {product.product?.name}
                      </td>

                      <td className="py-5">
                        {product.product?.category}
                      </td>

                      <td className="py-5">
                        {product.warehouse?.name}
                      </td>

                      <td className="py-5">
                        {product.availableUnits}
                      </td>

                      <td className="py-5">
                        ₹
                        {product.product?.price}
                      </td>

                      <td className="py-5">

                        {product.availableUnits < 5 ? (

                          <span className="text-red-500 flex items-center gap-2">

                            <AlertTriangle size={16} />

                            Low Stock

                          </span>

                        ) : (

                          <span className="text-emerald-600">

                            In Stock

                          </span>

                        )}

                      </td>

                      <td className="py-5">

                        <div className="flex gap-3">

                          <button
                            onClick={() =>
                              editProduct(
                                product
                              )
                            }
                            className="bg-cyan-500 text-white p-3 rounded-xl"
                          >

                            <Pencil size={16} />

                          </button>

                          {isAdmin && (

                            <button
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl"
                            >

                              <Trash2 size={16} />

                            </button>

                          )}

                          <button
                            onClick={() =>
                              reserveProduct(
                                product.productId,
                                product.warehouseId
                              )
                            }
                            className="bg-emerald-500 text-white p-3 rounded-xl"
                          >

                            <ShieldPlus size={16} />

                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}