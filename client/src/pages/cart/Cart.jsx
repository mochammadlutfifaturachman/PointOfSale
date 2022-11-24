import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/Layout";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CurrencyFormat from "react-currency-format";

const Cart = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopUp, setBillPopUp] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.rootReducer);

  const handlerIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const handlerDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const handlerDelete = (record) => {
    dispatch({
      type: "DELETE_FROM_CART",
      payload: record,
    });
  };

  const columns = [
    {
      title: "Nama Item",
      dataIndex: "name",
    },
    {
      title: "Gambar",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height={60} width={60} />
      ),
    },
    {
      title: "Harga",
      dataIndex: "price",
    },
    {
      title: "Jumlah Item",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <MinusCircleOutlined
            className="cart-minus"
            onClick={() => handlerDecrement(record)}
          />
          <strong className="cart-quantity">{record.quantity}</strong>
          <PlusCircleOutlined
            className="cart-plus"
            onClick={() => handlerIncrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Aksi",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          className="cart-action"
          onClick={() => handlerDelete(record)}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach(
      (product) => (temp = temp + product.price * product.quantity)
    );
    setSubTotal(temp);
  }, [cartItems]);

  const handlerSubmit = async (value) => {
    //console.log(value);
    try {
      const newObject = {
        ...value,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 10).toFixed(2)),
        totalAmount: Number(
          (
            Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))
          ).toFixed(2)
        ),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      await axios.post("/api/bills/addbills", newObject);
      message.success("Bill Generated!");
      navigate("/bills");
    } catch (error) {
      message.error("Error!");
      console.log(error);
    }
  };
  return (
    <Layout>
      <h2>Keranjang</h2>
      <Table dataSource={cartItems} columns={columns} bordered />
      <div className="subTotal">
        <h2>
          Subtotal:{" "}
          <CurrencyFormat
            value={subTotal}
            displayType={"text"}
            thousandSeparator={"."}
            decimalSeparator={","}
            prefix={"Rp"}
            renderText={(value) => (
              <span className="inline">{" " + value}</span>
            )}
          />
        </h2>
        <button
          onClick={() => setBillPopUp(true)}
          className="bg-green-400 text-white font-semibold px-3 py-2 rounded-lg hover:bg-green-500"
        >
          Buat Faktur
        </button>
      </div>
      <Modal
        title="Buat Faktur"
        visible={billPopUp}
        onCancel={() => setBillPopUp(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handlerSubmit}>
          <FormItem name="customerName" label="Nama Pelanggan">
            <Input />
          </FormItem>
          <FormItem name="customerPhone" label="Nomor Telepon">
            <Input />
          </FormItem>
          <FormItem name="customerAddress" label="Alamat">
            <Input />
          </FormItem>
          <Form.Item name="paymentMethod" label="Metode Pembayaran">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="paypal">Debit</Select.Option>
            </Select>
          </Form.Item>
          <div className="total">
            <span>
              Subtotal:
              <CurrencyFormat
                value={subTotal}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                prefix={"Rp"}
                renderText={(value) => (
                  <div className="inline">{" " + value}</div>
                )}
              />
            </span>
            <br />
            <span>
              Pajak:
              <CurrencyFormat
                value={(subTotal / 100) * 10}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                prefix={"Rp"}
                renderText={(value) => (
                  <div className="inline">{" " + value}</div>
                )}
              />
            </span>
            <h3>
              Total:
              <CurrencyFormat
                value={Number(subTotal) + Number((subTotal / 100) * 10)}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                prefix={"Rp"}
                renderText={(value) => (
                  <div className="inline">{" " + value}</div>
                )}
              />
            </h3>
          </div>
          {/* <div className="form-btn-add"> */}
          <button
            htmlType="submit"
            className="bg-green-400 text-white font-semibold px-3 py-2 rounded-lg hover:bg-green-500"
          >
            Buat Faktur
          </button>
          {/* </div> */}
        </Form>
      </Modal>
    </Layout>
  );
};

export default Cart;
